import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Icon, DatePicker, Select, Row, Col, Input, Upload, Cascader, Radio, Button, Alert, message, Tabs, Table, Spin, Modal, Checkbox } from 'antd'
import Panel from '../../../commons/components/Panel'
import DxPanel from '../../../commons/components/DxPanel'
import './allHouseResourceDetail.css'
import labelsFinalCode from '../../../commons/utils/labelsFinalCode.js';
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';
import CheckableTags from '../../../commons/UI/CheckableTags'
import PromptModal from '../../../commons/View/PromptModal';
import img from '../../assets/images/morentouinfg.png';
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow';
import DxUpLoadPic from '../../../commons/View/DxUpLoadPic'

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
const CheckboxGroup = Checkbox.Group;

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
function allHouseResourceDetail({ dispatch, form, allHouseResourceDetail, main }) {
    console.log(allHouseResourceDetail);//根据main命名空间里的用户信息userinfo判断是否是房源归属人
    const { getFieldDecorator } = form;
    const {
        promptObj,
        houseFollowModal,
        followSuccessModal,
        currentTab,
        previewVisible,
        previewImage,
        loadingShadow,
        houseName,//房源信息开始
        saleWay,
        characteristics,
        totlePrice,
        houseType,
        floorArea,
        resourcesNumber,
        entryUserName, // 房源录入人姓名
        keyHasBroker, // 钥匙持有人姓名
        addUserName,//委托人姓名
        keyUserInfo,
        addUserInfo,
        yezhu,//业主信息
        createDate,//挂牌时间（即创建时间）
        yaoshifang,
        communityName,//所在小区
        areaName,
        address,
        totalFloors,//总楼层
        storey,//所在楼层
        buildingAge,
        buildingType,//建筑类型（板楼等）
        houseStructure,//户型结构（平层等）
        heatingType,//供暖类型
        elevator,
        decoration,
        supportMortgage,//是否支持贷款
        orientations,
        coreSellingPoint,
        outFiles,//各成员上传的图片数组  
        outFilesList,
        showPicList,
        id,
        followUpList,//页码信息
        houseLogList,
        brokerModal,
        brokerModalData,
        isFollowed
    } = allHouseResourceDetail;
    const onOkCallBack = () => {
        if (promptObj.todo === 'closeModal') {
            dispatch({
                type: "allHouseResourceDetail/togglePrompt",
                payload: {
                    visible: false
                }
            })
        }
        if (promptObj.todo === 'closeModalAndWritePass') {
            dispatch({
                type: "allHouseResourceDetail/togglePrompt",
                payload: {
                    visible: false
                }
            })
            dispatch({
                type: "allHouseResourceDetail/changeVisible",
                payload: {
                    tudiGongVisible: true,
                }
            })
        }
    }
    const onCancelCallBack = () => { }
    //  tab分页数据 
    const paginationfollowUpList = {
        showQuickJumper: commonFinalCode.showQuickJumper,
        pageSize: followUpList.pageSize,
        current: followUpList.current,
        defaultCurrent: 1,
        total: followUpList.total,
        showTotal: total => `共${total}条数据`,
        onChange: (page, pageSize) => {
            dispatch({
                type: "allHouseResourceDetail/findFollowUpList",
                payload: {
                    pageNo: page - 1,
                    pageSize: followUpList.pageSize,
                }
            })
        },
    };
    const paginationhouseLogList = {
        showQuickJumper: commonFinalCode.showQuickJumper,
        pageSize: houseLogList.pageSize,
        current: houseLogList.current,
        defaultCurrent: 1,
        total: houseLogList.total,
        showTotal: total => `共${total}条数据`,
        onChange: (page, pageSize) => {
            dispatch({
                type: "allHouseResourceDetail/findHouseLogList",
                payload: {
                    pageNo: page - 1,
                    pageSize: houseLogList.pageSize,
                }
            })
        },
    };
    const customStyle = {
        padding: '0 5px',
        active: {
            background: '#42B38B',
            color: '#fff',
            borderColor: 'transparent',
            fontSize: "12px"
        },
    };
    const tagsArr = characteristics.split(/\"(.*?)\"/g).filter((item, index) => { return index % 2 === 1 });
    const tagsChange = (key) => {

    }
    const onTabsChange = (key) => {
        dispatch({
            type: 'allHouseResourceDetail/setState',
            payload: {
                currentTab: key
            }
        })
    }
    const handleDelete = (text, record, index) => {

    }
    const handleEdit = (text, record, index) => {

    }
    // 点击查看电话   进行房源跟进
    const houseFollow = () => {
        if (isFollowed) {
            dispatch({
                type: 'allHouseResourceDetail/setState',
                payload: {
                    followSuccessModal: {
                        visible: true,
                    }
                }
            });
        } else {
            dispatch({
                type: 'allHouseResourceDetail/setState',
                payload: {
                    houseFollowModal: {
                        visible: true,
                    }
                }
            });
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        form.validateFields((err, values) => {
            if (!err) {
                dispatch({
                    type: "allHouseResourceDetail/followUp",
                    payload: {
                        housingId: id,
                        followUpContent: values.followUpContent,
                        followUpType: values.followUpType
                    }
                })
                form.resetFields();
            }
        });
    }
    const houseFollowClose = () => {
        form.resetFields();
        dispatch({
            type: 'allHouseResourceDetail/setState',
            payload: {
                houseFollowModal: {
                    visible: false,
                },
            }
        });
    }
    // 点击保存  跟进成功modal的关闭
    const followSuccessModalClose = () => {

        dispatch({
            type: 'allHouseResourceDetail/setState',
            payload: {
                followSuccessModal: {
                    visible: false,
                }
            }
        });
    }

    const columnsFollowUp = [{
        title: '时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text, record, index) => {
            return <span>{text}</span>
        }
    }, {
        title: '跟进人',
        dataIndex: 'brokerInfo',
        key: 'brokerInfo_name',
        render: (text, record, index) => {
            return <span onClick={() => brokerModalShow(text, record, index)} style={{ "color": "#83A0D8", "cursor": "pointer" }}>{record.brokerInfo.name}</span>
        }
    }, {
        title: '所属门店',
        dataIndex: 'brokerInfo',
        key: 'brokerInfo_teamName',
        render: (text, record, index) => {
            return <span>{record.brokerInfo.teamName}</span>
        }
    }, {
        title: '跟进方式',
        dataIndex: 'followUpType',
        key: 'followUpType',
        render: (text, record, index) => {
            return <span>{text}</span>
        }
    }, {
        title: '跟进内容',
        dataIndex: 'followUpContent',
        key: 'followUpContent',
        render: (text, record, index) => {
            return <span>{text}</span>
        }
    },
    ];
    const userType = {//用户身份索引
        BROKER_USER: "经纪人",
        TUTOR_ADMIN_USER: "企业",
        BROKER_USER_MANAGE: "门店经理"
    };
    const columnsHouseLog = [
        {
            title: '时间',
            dataIndex: 'createDate',
            key: 'createDate',
            render: (text, record, index) => {
                return <span>{text}</span>
            }
        }, {
            title: '操作人员',
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => {
                return <span onClick={() => brokerModalShow(text, record, index)} style={{ "color": "#83A0D8", "cursor": "pointer" }}>{text}</span>
            }
        }, {
            title: '角色',
            dataIndex: 'userType',
            key: 'userType',
            render: (text, record, index) => {
                return <span>{userType[text]}</span>
            }
        }, {
            title: '所属门店',
            dataIndex: 'brokerInfo_teamName',
            key: 'brokerInfo_teamName',
            render: (text, record, index) => {
                return <span>{record.brokerInfo ? record.brokerInfo.teamName : ""}</span>
            }
        }, {
            title: '调整内容',
            dataIndex: 'type',
            key: 'type',
            render: (text, record, index) => {
                return <span>{text}</span>
            }
        },
    ]
    //经纪人详情
    const brokerModalShow = (text, record, index) => {
        if (record.userType && record.userType === "TUTOR_ADMIN_USER") {
            message.error("此操作人员不是门店经纪人,无法查看详细信息!", 10);
        } else {
            dispatch({
                type: 'allHouseResourceDetail/findOneBrief',
                payload: {
                    id: record.brokerId
                }
            })
        }
    }
    const brokerModalClose = () => {
        dispatch({
            type: 'allHouseResourceDetail/setState',
            payload: {
                brokerModal: {
                    visible: false,
                }
            }
        })
    }
    // 上传图片 
    let maxNum = 0;
    if (outFilesList.length > 0) {
        for (let i in outFilesList) {
            if (!isNaN(i)) { maxNum += outFilesList[i].realPictureList.length; }
        }
    }
    const upLoadPicProps = {
        url: commonFinalCode.addFileApiName,
        maxNum: 20 - maxNum,//最大上传数
        maxSize: 5,//文件大小限值
        showPicList: showPicList,//state管理图片list
        doCover: true,
        hideName: true,
        showDetail: true,
        changeList: (data) => {
            dispatch({
                type: "allHouseResourceDetail/upload",
                payload: {
                    showPicList: data
                }
            })
        },//更新list回调
        loadCallBack: (data) => {
            if (data === true) {
                dispatch({
                    type: "allHouseResourceDetail/saveUpLoadPic"
                })
            }
        }
    }
    const props = {
        url: commonFinalCode.addFileApiName,
        listType: 'picture-card',
        showUploadList: {
            showPreviewIcon: true,
            showRemoveIcon: false
        }
    };
    const handleChange = ({ file, fileList }) => {

    }
    const handleRemove = (file) => {

    }
    const handlePreview = (file) => {
        dispatch({
            type: 'allHouseResourceDetail/setState',
            payload: {
                previewImage: file.url || file.thumbUrl,
                previewVisible: true,
            }
        })
    }
    const handleCancel = (file) => {
        dispatch({
            type: 'allHouseResourceDetail/setState',
            payload: {
                previewImage: '',
                previewVisible: false,
            }
        })
    }
    return id ? <div className="allHouseResourceDetail">
        <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack} />
        <DxLoadingShadow visible={loadingShadow} />
        <Panel title="房源详情" />
        <div className="houseInfoTop">
            <Row>
                <Col span={12}>
                    <h1 className="detailName">{houseName}</h1>
                    <h1 className="detailTags">
                        <CheckableTags
                            multiple={true}
                            tags={tagsArr}
                            customStyle={customStyle}
                            onChange={tagsChange}
                            max={3}
                            min={3}
                            value={tagsArr}
                            disabled
                        />
                    </h1>
                    <ul className="detailParts">
                        <li>
                            <div className="detailPartsTitle">{saleWay === "出售" ? "售价" : "租金"}</div>
                            <div className="detailPartsValue">{saleWay === "出售" ? Number(totlePrice / 10000).toFixed(2) + "万" : totlePrice + "元"}</div>
                        </li>
                        <li>
                            <div className="detailPartsTitle">户型</div>
                            <div className="detailPartsValue">{houseType}</div>
                        </li>
                        <li>
                            <div className="detailPartsTitle">面积</div>
                            <div className="detailPartsValue">{floorArea}m²</div>
                        </li>
                    </ul>
                </Col>
                <Col span={12}>
                    <div className="detailPartsPanel">
                        <p className="detailPartsPanelHeader">
                            业主信息
                    </p>
                        <div className="detailPartsPanelContent">
                            <p>
                                姓名 ： <span>{yezhu.ownerName}</span>
                            </p>
                            <p>
                                性别 ： <span>{yezhu.gender === "先生" ? "男" : "女"}</span>
                            </p>
                            <p>
                                电话 ： <span>{yezhu.ownerPhone.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2")}</span> <Button className="openTel" onClick={houseFollow}>查看电话</Button>
                            </p>
                        </div>
                    </div>
                    <div className="detailPartsPanel">
                        <p className="detailPartsPanelHeader">
                            房源归属信息
                    </p>
                        <div className="detailPartsPanelContent">
                            <p>
                                录入人 ： <span>{entryUserName}</span>
                            </p>
                            <p>
                                委托人 ： <span>{addUserName}</span>
                            </p>
                            <p>
                                钥匙人 ： <span>{keyHasBroker}</span>
                            </p>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
        <div className="detailTabs">
            <Tabs
                activeKey={currentTab}
                onChange={onTabsChange}
                type="card"
                defaultActivKey="houseDetailInfo"
                className="tabs"
                animated={false}
            >

                {/* 房源信息tab页 */}
                <TabPane
                    tab="房源信息"
                    key="houseDetailInfo"
                >
                    <div className="houseDetailInfo">
                        <Row style={{ "paddingBottom": "15px", "borderBottom": "1px solid #bfbfbf" }}>
                            <Col span={8}>
                                <p className="infoLine">
                                    房源编号：<span>{resourcesNumber}</span>
                                </p>
                            </Col>
                            <Col span={8}>
                                <p className="infoLine">
                                    挂牌时间：<span>{createDate}</span>
                                </p>
                            </Col>
                            <Col span={8}>
                                <p className="infoLine">
                                    钥匙房：<span>{yaoshifang ? "有钥匙" : "无钥匙"}</span>
                                </p>
                            </Col>
                            <Col span={8}>
                                <p className="infoLine">
                                    所在小区：<span>{communityName}</span>
                                </p>
                            </Col>
                            <Col span={8}>
                                <p className="infoLine">
                                    所在地区：<span>{areaName}</span>
                                </p>
                            </Col>
                            <Col span={8}>
                                <p className="infoLine">
                                    小区地址：<span>{address}</span>
                                </p>
                            </Col>
                            <Col span={8}>
                                <p className="infoLine">
                                    总层数：<span>{totalFloors}层</span>
                                </p>
                            </Col>
                            <Col span={8}>
                                <p className="infoLine">
                                    所在楼层：<span>{storey}层</span>
                                </p>
                            </Col>
                            <Col span={8}>
                                <p className="infoLine">
                                    户型结构：<span>{houseStructure}</span>
                                </p>
                            </Col>
                            <Col span={8}>
                                <p className="infoLine">
                                    建筑类型：<span>{buildingType}</span>
                                </p>
                            </Col>
                            <Col span={8}>
                                <p className="infoLine">
                                    供暖方式：<span>{heatingType}</span>
                                </p>
                            </Col>
                            <Col span={8}>
                                <p className="infoLine">
                                    建筑年代：<span>{buildingAge}</span>
                                </p>
                            </Col>
                            <Col span={8}>
                                <p className="infoLine">
                                    有无电梯：<span>{elevator}</span>
                                </p>
                            </Col>
                            <Col span={8}>
                                <p className="infoLine">
                                    支持贷款：<span>{supportMortgage}</span>
                                </p>
                            </Col>
                            <Col span={8}>
                                <p className="infoLine">
                                    装修情况：<span>{decoration}</span>
                                </p>
                            </Col>
                            <Col span={8}>
                                <p className="infoLine">
                                    房屋朝向：<span>{orientations}</span>
                                </p>
                            </Col>
                        </Row>
                        <div className="sellInfoMain">
                            <div className="left">核心卖点：</div>
                            <div className="right">
                                {coreSellingPoint}
                            </div>
                        </div>
                    </div>
                </TabPane>
                {/* 房源信息tab也结束 */}

                {/* 房源图片tab */}
                <TabPane
                    tab="房源图片"
                    key="houseDetailPic"
                >
                    <div className="houseDetailPic">
                        <Row>
                            <Col span={24}>
                                每个房源最多可上传实勘图20张，当前所有成员总上传实勘图数量为：{maxNum}张
                        </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <DxUpLoadPic {...upLoadPicProps} />
                            </Col>
                        </Row>
                        {
                            outFilesList.map((item, index) => {
                                return (
                                    <Row key={index}>
                                        <Col span={24} style={{ "margin": "15px", "borderBottom": "1px solid #dfdfdf" }} className="userInfo">
                                            <div className="userPic">
                                                <img src={item.brokerInfo.logo === null ? img : item.brokerInfo.logo} alt="" />
                                            </div>
                                            <div className="userName">
                                                {item.brokerInfo.name}
                                            </div>
                                            <div>
                                                上传：{item.realPictureList.length}张
                                        </div>
                                            <div>
                                                上传时间：{item.realPictureList[0].createDate}
                                            </div>
                                        </Col>
                                        <Col span={24}>
                                            <Upload {...props}
                                                fileList={
                                                    item.realPictureList.map((item, index) => {
                                                        return {
                                                            uid: item.id / -1,
                                                            name: 'xxx.png',
                                                            status: 'done',
                                                            url: item.picPath,
                                                        }
                                                    })
                                                }
                                                onPreview={handlePreview}
                                                onChange={handleChange}
                                                onRemove={handleRemove}>
                                            </Upload>
                                        </Col>
                                    </Row>
                                )
                            })
                        }
                    </div>
                    <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                </TabPane>
                {/* 房源图片tab结束 */}

                {/* 房源跟进tab    */}
                <TabPane
                    tab="房源跟进"
                    key="houseDetailFollw"
                >
                    <Table
                        loading={false}
                        dataSource={followUpList.content}
                        columns={columnsFollowUp}
                        pagination={paginationfollowUpList}
                    >

                    </Table>
                </TabPane>
                {/* 房源修改日志tab    */}
                <TabPane
                    tab="修改日志"
                    key="houseLogList"
                >
                    <Table
                        loading={false}
                        dataSource={houseLogList.content}
                        columns={columnsHouseLog}
                        pagination={paginationhouseLogList}
                    >

                    </Table>
                </TabPane>
            </Tabs>
        </div>
        {/* 经纪人详情弹窗  DxPanel公用组件 */}
        <Modal
            visible={brokerModal.visible}
            footer={false}
            onCancel={brokerModalClose}
        >
            <DxPanel title="经纪人详情">
                <Row style={{ "paddingBottom": "15px", "marginTop": "-20px" }}>
                    <Col span={5}>
                        <img src={img} alt="" style={{ "widht": "70px", "height": "70px" }} />
                    </Col>
                    <Col span={18} offset={1}>
                        <p style={{ "height": "24px", "lineHeight": "24px" }}>{brokerModalData.name}</p>
                        <p style={{ "height": "24px", "lineHeight": "24px" }}>{brokerModalData.phone}</p>
                        <p style={{ "height": "24px", "lineHeight": "24px" }}>所属门店：{brokerModalData.toutorTeamOut.name}</p>
                    </Col>
                </Row>
                <Row>
                    <Col style={{ "height": "38px", "lineHeight": "38px", "padding-left": "10px", "backgroundColor": "#EBF1F1", "textAlign": "left", "textOverflow": "ellipsis", "overflow": "hidden", "whiteSpace": "nowrap" }}>
                        门店地址：{brokerModalData.toutorTeamOut.site}
                    </Col>
                </Row>

            </DxPanel>
        </Modal>
        {/* 房源跟进modal  DxPanel公用组件 */}
        <Modal
            visible={houseFollowModal.visible}
            footer={false}
            onCancel={houseFollowClose}
        >
            <DxPanel title={(() => {
                return <span>
                    房源跟进 <span className="panelSubTitle">(填写跟进后即可查看业主电话)</span>
                </span>
            })()}>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col span={24}>
                            <FormItem label="选择跟进方式" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                {getFieldDecorator('followUpType', {
                                    rules: [{ required: true, message: '请选择跟进方式' }],
                                })(
                                    <Select placeholder="请选择跟进方式">
                                        <Option value="来电">来电</Option>
                                        <Option value="去电">去电</Option>
                                        <Option value="到访">到访</Option>
                                        <Option value="接待">接待</Option>
                                        <Option value="其他">其他</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem label="填写跟进内容" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                {
                                    getFieldDecorator('followUpContent', {
                                        initialValue: "",
                                        rules: [
                                            { required: true, message: '请填写跟进内容!' },
                                        ],
                                    })(
                                        <Input type="textarea" rows={4} placeholder='请填写跟进内容！' />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={3} offset={16}>
                            <Button type='primary' htmlType="submit" style={{ "fontSize": "12px" }}>保存</Button>
                        </Col>
                        <Col span={3} offset={2}>
                            <Button type='reset'
                                onClick={houseFollowClose}
                                style={{ "fontSize": "12px" }}>取消</Button>
                        </Col>
                    </Row>
                </Form>

            </DxPanel>
        </Modal>
        <Modal
            visible={followSuccessModal.visible}
            footer={false}
            onCancel={followSuccessModalClose}
        >
            <DxPanel title="业主详情">
                <Row>
                    <Col span={24} style={{ "textAlign": "center", "color": "#73C5A8", "fontSize": "22px", "margin": "-30px 0 15px" }}>
                        房源跟进成功！
                </Col>
                </Row>
                <Row style={{ "padding": "10px 30px", "backgroundColor": "#EBF1F1", "textAlign": "left" }}>
                    <Col span={12} style={{ "lineHeight": "30px" }}>
                        业主姓名:{yezhu.ownerName}
                    </Col>
                    <Col span={12} style={{ "lineHeight": "30px" }}>
                        电话：{yezhu.ownerPhone}
                    </Col>
                    <Col span={24} style={{ "lineHeight": "30px" }}>
                        单元房号：{allHouseResourceDetail.communityName + "  " + allHouseResourceDetail.detailed}
                    </Col>
                </Row>
            </DxPanel>
        </Modal>
    </div> : <div className="mentorDataLoading">
            <Spin />
        </div>
}
function mapStateToProps({ allHouseResourceDetail, main }) {
    return { allHouseResourceDetail, main }
}

export default connect(mapStateToProps)(Form.create({})(allHouseResourceDetail));