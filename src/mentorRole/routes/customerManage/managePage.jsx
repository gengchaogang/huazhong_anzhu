import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, DatePicker, Select, Row, Col, Input, Cascader, Radio, Button, Alert, message, Tabs, Table, Spin, Modal, Checkbox } from 'antd'
import Panel from '../../../commons/components/Panel'
import DxPanel from '../../../commons/components/DxPanel'
import labelsFinalCode from '../../../commons/utils/labelsFinalCode.js';
import CheckableTags from '../../../commons/UI/CheckableTags'
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow';
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';
import PromptModal from '../../../commons/View/PromptModal';
import img from '../../assets/images/morentouinfg.png';
import './managePage.css'

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

function managePage({ dispatch, form, managePage }) {
    const { getFieldDecorator } = form;
    const {
        currentTab,
        promptObj,
        loadingShadow,
        followUpList,
        guideList,
        followModal,
        bringModal,
        record,
        isBroker,
    } = managePage;
    //表单提交
    const handleSubmit = (e) => {
        e.preventDefault();
        form.validateFields((err, values) => {
            if (!err) {
                const payload = {};
                if (values.keyword) {
                    payload.keyword = values.keyword;
                }
                if (values.dateTimePicker && values.dateTimePicker.length > 1) {
                    payload.startTime = new Date(values.dateTimePicker[0]._d).format('yyyy-MM-dd');
                    payload.endTime = new Date(values.dateTimePicker[1]._d).format('yyyy-MM-dd');
                }
                dispatch({
                    type: "managePage/setState",
                    payload,
                })
                let type;
                if (currentTab === "followCustomerTab") {
                    type = "跟进";
                } else if (currentTab == "bringCustomerTab") {
                    type = "带看";
                }
                dispatch({
                    type: "managePage/loadList",
                    payload: {
                        pageNo: 0,
                        pageSize: commonFinalCode.pageSize,
                        id: record.id,
                        type,
                        currentTab: currentTab,
                    }
                })
            }
        })
    }
    //添加客户
    const addCustomer = () => {

    }
    //客户数据分页
    const paginationFollowUpList = {
        showQuickJumper: commonFinalCode.showQuickJumper,
        pageSize: followUpList.pageSize,
        current: followUpList.current,
        defaultCurrent: 1,
        total: followUpList.total,
        showTotal: total => `共${total}条数据`,
        onChange: (page, pageSize) => {
            form.validateFields((err, values) => {
                if (!err) {
                    dispatch({
                        type: "managePage/loadList",
                        payload: {
                            pageNo: page - 1,
                            pageSize: commonFinalCode.pageSize,
                            id: record.id,
                            type: "跟进",
                            currentTab: "followCustomerTab",
                        }
                    })
                }
            })
        }
    }
    //客户数据分页
    const paginationGuideList = {
        showQuickJumper: commonFinalCode.showQuickJumper,
        pageSize: guideList.pageSize,
        current: guideList.current,
        defaultCurrent: 1,
        total: guideList.total,
        showTotal: total => `共${total}条数据`,
        onChange: (page, pageSize) => {
            form.validateFields((err, values) => {
                if (!err) {
                    dispatch({
                        type: "managePage/loadList",
                        payload: {
                            pageNo: page - 1,
                            pageSize: commonFinalCode.pageSize,
                            id: record.id,
                            type: "带看",
                            currentTab: "bringCustomerTab",
                        }
                    })
                }
            })
        }
    }
    const columnsFollow = [
        {
            title: '意向房源',
            dataIndex: 'houseBaseInfo',
        }, {
            title: '房源类型',
            dataIndex: 'houseType',
        }, {
            title: '跟进方式',
            dataIndex: 'followUpName',
        }, {
            title: '跟进内容',
            dataIndex: 'message',
        }, {
            title: '跟进时间',
            dataIndex: 'followUpTime',
        },
    ];
    const columnsGuide = [
        {
            title: '意向房源',
            dataIndex: 'houseBaseInfo',
        }, {
            title: '房源类型',
            dataIndex: 'houseType',
        }, {
            title: '跟进方式',
            dataIndex: 'followUpName',
        }, {
            title: '跟进内容',
            dataIndex: 'message',
        }, {
            title: '跟进时间',
            dataIndex: 'followUpTime',
        },
    ]
    //跟进和带看的modal等方法
    const bringCustomer = () => {
        dispatch({
            type: "managePage/setState",
            payload: {
                bringModal: {
                    visible: true,
                    required: true
                }
            }
        })
    }
    const followCustomer = () => {
        dispatch({
            type: "managePage/setState",
            payload: {
                followModal: {
                    visible: true,
                    required: true
                }
            }
        })
    }
    const followSubmit = () => {
        form.validateFields((err, values) => {
            if (!err) {
                dispatch({
                    type: "managePage/addFollowProcess",
                    payload: {
                        customerId: record.id,
                        houseNum: values.houseNum,
                        processWay: values.processWay,
                        message: values.message,
                        type: "跟进"
                    }
                })
                form.resetFields(["houseNum", "processWay", "message"]);
            }
        });
    }
    const followModalClose = () => {
        form.resetFields(["houseNum", "processWay", "message"]);
        dispatch({
            type: "managePage/setState",
            payload: {
                followModal: {
                    visible: false,
                    required: false
                }
            }
        })
    }
    const guideSubmit = () => {
        form.validateFields((err, values) => {
            if (!err) {
                dispatch({
                    type: "managePage/addFollowProcess",
                    payload: {
                        customerId: record.id,
                        houseNum: values.houseNum,
                        processWay: values.processWay,
                        message: values.message,
                        type: "带看"
                    }
                })
                form.resetFields(["houseNum", "processWay", "message"]);
            }
        });
    }
    const bringModalClose = () => {
        form.resetFields(["houseNum", "processWay", "message"]);
        dispatch({
            type: "managePage/setState",
            payload: {
                bringModal: {
                    visible: false,
                    required: false
                }
            }
        })
    }
    //关键字联想
    const handleKeywordChange = () => {

    }
    const handleSelect = () => {

    }
    const handleSelectBlur = () => {

    }

    const handleFollowType = () => {

    }
    //tab切换事件
    const onTabsChange = (key) => {
        let type;
        if (key === "followCustomerTab") {
            type = "跟进";
        } else {
            type = "带看";
        }
        dispatch({
            type: "managePage/setState",
            payload: {
                currentTab: key
            }
        })
        form.resetFields();
        dispatch({
            type: "managePage/loadList",
            payload: {
                currentTab: key,
                pageSize: commonFinalCode.pageSize,
                pageNo: 0,
                type,
                id: record.id,
                startTime: null,
                endTime: null
            }
        })
    }
    // PromptModal
    const onOkCallBack = () => {
        if (promptObj.todo === 'closeModal') {
            dispatch({
                type: "managePage/togglePrompt",
                payload: {
                    visible: false
                }
            })
        }
        if (promptObj.todo === 'closeModalAndWritePass') {
            dispatch({
                type: "managePage/togglePrompt",
                payload: {
                    visible: false
                }
            })
            dispatch({
                type: "managePage/changeVisible",
                payload: {
                    tudiGongVisible: true,
                }
            })
        }
    }
    const onCancelCallBack = () => { }
    Date.prototype.format = function (format) {
        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(),    //day
            "h+": this.getHours(),   //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
            "S": this.getMilliseconds() //millisecond
        }
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                    ("00" + o[k]).substr(("" + o[k]).length));
        return format;
    }
    return <div>
        <div className="managePage">
            <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack} />
            <DxLoadingShadow visible={loadingShadow} />
            <Panel title={"客户管理"} />
            <div className="header">
                <div className="customerDetail">
                    {record.name}（{record.gender}）{["求购", "求租"].filter(item => {
                        return record.intentionTypes.indexOf(item) !== -1
                    }).map((item, index) => {
                        if (item === "求租") {
                            return <span className="wantRent">{item}</span>
                        } else if (item === "求购") {
                            return <span className="wantSell">{item}</span>
                        }
                    })}
                </div>
                <div className="customerController">
                    客户电话：{record.phone}
                    {
                        isBroker ? <div style={{ 'float': 'right' }}>
                            <Button style={{ "fontSize": "12px" }} type="primary" onClick={bringCustomer} icon="plus">客户带看</Button>
                            <Button style={{ "fontSize": "12px" }} type="primary" onClick={followCustomer} icon="plus">客户跟进</Button>
                        </div> : null
                    }
                </div>
            </div>
            <div className="container">
                <div className="searchBar">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col span={5}>
                                <FormItem label="关键字"
                                    labelCol={{ span: 5 }}
                                    wrapperCol={{ span: 19 }}
                                >
                                    {getFieldDecorator('keyword', {
                                        rules: [{ required: false, message: '' }],
                                    })(
                                        <Input placeholder="按关键字搜索" className="searchName" size='large' />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 20 }}
                                    label="时间"
                                >
                                    {getFieldDecorator('dateTimePicker', {
                                        rules: [{ required: false, message: 'Please select time!' }],
                                    })(
                                        <RangePicker showTime format={"YYYY-MM-DD"} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={4}>
                                <Row>
                                    <Col span={10}>
                                        <Button type='primary' htmlType="submit" size='large'>查询</Button>
                                    </Col>
                                    <Col span={10}>
                                        <Button
                                            type='reset'
                                            size='large'
                                            onClick={() => {
                                                form.resetFields();
                                                dispatch({
                                                    type: 'managePage/setState',
                                                    payload: {
                                                        startTime: null,
                                                        endTime: null,
                                                        keyword: null
                                                    }
                                                })
                                                let type;
                                                if (currentTab === "followCustomerTab") {
                                                    type = "跟进"
                                                } else if (currentTab === "bringCustomerTab") {
                                                    type = "带看"
                                                }
                                                dispatch({
                                                    type: "managePage/loadList",
                                                    payload: {
                                                        pageNo: 0,
                                                        pageSize: commonFinalCode.pageSize,
                                                        id: record.id,
                                                        type,
                                                        currentTab: currentTab,
                                                    }
                                                })
                                            }}
                                        >重置</Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        {/* 跟进弹窗  DxPanel公用组件 */}
                        <Modal
                            visible={followModal.visible}
                            footer={false}
                            onCancel={followModalClose}
                        >
                            <DxPanel title="客户跟进">
                                <Row style={{ "paddingBottom": "15px", "marginTop": "-20px" }}>
                                    <Col span={24}>
                                        <FormItem label="客户意向房源" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                            {getFieldDecorator('houseNum', {
                                                rules: [{ required: followModal.required, message: '请输入客户意向房源编号' }],
                                            })(
                                                <Input placeholder="请输入客户意向房源编号" size='large' />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem label="选择跟进方式" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                            {getFieldDecorator('processWay', {
                                                rules: [{ required: followModal.required, message: '请选择跟进方式' }],
                                            })(
                                                <Select
                                                    placeholder='请选择跟进方式!'
                                                >
                                                    <Option value="来电">来电</Option>
                                                    <Option value="去电">去电</Option>
                                                    <Option value="到访">到访</Option>
                                                    <Option value="接待">接待</Option>
                                                    <Option value="其他">其他</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem label="填写跟进内容" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                            {getFieldDecorator('message', {
                                                rules: [{ required: followModal.required, message: '请填写跟进内容' }],
                                            })(
                                                <Input type="textarea" rows={4} placeholder='请填写跟进内容！' />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={3} offset={16}>
                                        <Button type='primary' style={{ "fontSize": "12px" }} onClick={followSubmit}>保存</Button>
                                    </Col>
                                    <Col span={3} offset={2}>
                                        <Button
                                            onClick={followModalClose}
                                            style={{ "fontSize": "12px" }}
                                        >取消</Button>
                                    </Col>
                                </Row>
                            </DxPanel>
                        </Modal>
                        {/* 带看弹窗  DxPanel公用组件 */}
                        <Modal
                            visible={bringModal.visible}
                            footer={false}
                            onCancel={bringModalClose}
                        >
                            <DxPanel title="客户带看">
                                <Row style={{ "paddingBottom": "15px", "marginTop": "-20px" }}>
                                    <Col span={24}>
                                        <FormItem label="客户意向房源" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                            {getFieldDecorator('houseNum', {
                                                rules: [{ required: bringModal.required, message: '请选择客户意向房源' }],
                                            })(
                                                <Input placeholder="请输入客户意向房源" size='large' />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem label="选择跟进方式" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                            {getFieldDecorator('processWay', {
                                                rules: [{ required: bringModal.required, message: '请选择跟进方式' }],
                                            })(
                                                <Select
                                                    placeholder='请选择跟进方式!'
                                                >
                                                    <Option value="来电">来电</Option>
                                                    <Option value="去电">去电</Option>
                                                    <Option value="到访">到访</Option>
                                                    <Option value="接待">接待</Option>
                                                    <Option value="其他">其他</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem label="填写跟进内容" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                            {getFieldDecorator('message', {
                                                rules: [{ required: bringModal.required, message: '请填写跟进内容' }],
                                            })(
                                                <Input type="textarea" rows={4} placeholder='请填写跟进内容！' />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={3} offset={16}>
                                        <Button type='primary' style={{ "fontSize": "12px" }} onClick={guideSubmit}>保存</Button>
                                    </Col>
                                    <Col span={3} offset={2}>
                                        <Button
                                            onClick={bringModalClose}
                                            style={{ "fontSize": "12px" }}
                                        >取消</Button>
                                    </Col>
                                </Row>
                            </DxPanel>
                        </Modal>
                    </Form>
                </div>
                <div className="managePageTabs">
                    <Tabs
                        activeKey={currentTab}
                        onChange={onTabsChange}
                        type="card"
                        className="tabs"
                        animated={false}
                    >
                        <TabPane
                            tab="客户跟进"
                            key="followCustomerTab"
                        >
                            <Table
                                loading={false}
                                dataSource={followUpList.content}
                                columns={columnsFollow}
                                pagination={paginationFollowUpList}
                            >

                            </Table>
                        </TabPane>
                        <TabPane
                            tab="客户带看"
                            key="bringCustomerTab"
                        >
                            <Table
                                loading={false}
                                dataSource={guideList.content}
                                columns={columnsGuide}
                                pagination={paginationGuideList}
                            >

                            </Table>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </div>
    </div>
}

function mapStateToProps({ managePage }) {
    return { managePage }
}

export default connect(mapStateToProps)(Form.create({})(managePage));