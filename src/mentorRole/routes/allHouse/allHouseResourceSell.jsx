import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, DatePicker, Select, Row, Col, Input, Cascader, Radio, Button, Alert, message, Tabs, Table, Spin, Modal, Checkbox } from 'antd'
import Panel from '../../../commons/components/Panel'
import DxPanel from '../../../commons/components/DxPanel'
import './allHouseResource.css'
import labelsFinalCode from '../../../commons/utils/labelsFinalCode.js';
import CheckableTags from '../../../commons/UI/CheckableTags'
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow';
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';
import PromptModal from '../../../commons/View/PromptModal';
import img from '../../assets/images/morentouinfg.png';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
function allHouseResourceSell({ dispatch, form, allHouseResourceSell }) {
    const { getFieldDecorator } = form;
    const {
        sellOrRent,
        eopOptions,
        pwd,
        keyModal,
        activeKey,
        loadingShadow,
        promptObj,
        secondHandHouseSellList,
        secondHandHouseRentList,
        shopSellList,
        shopRentList,
        officeSellList,
        officeRentList,
        keyModalData,
        area,//搜索中的区域信息
        teamList,//所有门店
        labels,//标签信息
    } = allHouseResourceSell;
    console.log(teamList);
    //  tab分页数据 
    const paginationsecondHandHouseSell = {
        showQuickJumper: commonFinalCode.showQuickJumper,
        pageSize: secondHandHouseSellList.pageSize,
        current: secondHandHouseSellList.current,
        defaultCurrent: 1,
        total: secondHandHouseSellList.total,
        showTotal: total => `共${total}条数据`,
        onChange: (page, pageSize) => {
            form.validateFields((err, values) => {
                if (!err) {
                    let startTime;
                    let endTime;
                    if (values.dateTimePicker) {
                        startTime = new Date(values.dateTimePicker[0]._d).format('yyyy-MM-dd');
                        endTime = new Date(values.dateTimePicker[1]._d).format('yyyy-MM-dd');
                    }
                    dispatch({
                        type: "allHouseResourceSell/secondHandHouseSellList",
                        payload: {
                            pageNo: page - 1,
                            pageSize: secondHandHouseSellList.pageSize,
                            resourcesType: "住宅",
                            saleWay: "出售",
                            sellOrRent: sellOrRent,
                            fullPath: area,
                            keyword: values.resourcesNumber,
                            teamId: values.md,
                            startTime: startTime,
                            endTime: endTime,
                            totlePrice: values.sellPrice,
                            floorAreas: values.Area,
                            houseRoom: values.FYHX,
                            orientations: values.FYCX,
                            hasKeyHouse: values.isKey,
                            explorationHouse: values.isShiKan,
                            decoration: values.zxqk,
                            houseState: values.houseState,
                        }
                    })
                }
            })
        },
    };
    const paginationsecondHandHouseRent = {
        showQuickJumper: commonFinalCode.showQuickJumper,
        pageSize: secondHandHouseRentList.pageSize,
        current: secondHandHouseRentList.current,
        defaultCurrent: 1,
        total: secondHandHouseRentList.total,
        showTotal: total => `共${total}条数据`,
        onChange: (page, pageSize) => {
            form.validateFields((err, values) => {
                if (!err) {
                    let startTime;
                    let endTime;
                    if (values.dateTimePicker) {
                        startTime = new Date(values.dateTimePicker[0]._d).format('yyyy-MM-dd');
                        endTime = new Date(values.dateTimePicker[1]._d).format('yyyy-MM-dd');
                    }
                    dispatch({
                        type: "allHouseResourceSell/secondHandHouseRentList",
                        payload: {
                            pageNo: page - 1,
                            pageSize: secondHandHouseRentList.pageSize,
                            resourcesType: "住宅",
                            saleWay: "出租",
                            sellOrRent: sellOrRent,
                            fullPath: area,
                            keyword: values.resourcesNumber,
                            teamId: values.md,
                            startTime: startTime,
                            endTime: endTime,
                            totlePrice: values.sellPrice,
                            floorAreas: values.Area,
                            houseRoom: values.FYHX,
                            orientations: values.FYCX,
                            hasKeyHouse: values.isKey,
                            explorationHouse: values.isShiKan,
                            decoration: values.zxqk,
                            houseState: values.houseState,
                        }
                    })
                }
            })
        },
    };
    const paginationshopSell = {
        showQuickJumper: commonFinalCode.showQuickJumper,
        pageSize: shopSellList.pageSize,
        current: shopSellList.current,
        defaultCurrent: 1,
        total: shopSellList.total,
        showTotal: total => `共${total}条数据`,
        onChange: (page, pageSize) => {
            form.validateFields((err, values) => {
                if (!err) {
                    let startTime;
                    let endTime;
                    if (values.dateTimePicker) {
                        startTime = new Date(values.dateTimePicker[0]._d).format('yyyy-MM-dd');
                        endTime = new Date(values.dateTimePicker[1]._d).format('yyyy-MM-dd');
                    }
                    dispatch({
                        type: "allHouseResourceSell/shopSellList",
                        payload: {
                            pageNo: page - 1,
                            pageSize: shopSellList.pageSize,
                            resourcesType: "商铺",
                            saleWay: "出售",
                            sellOrRent: sellOrRent,
                            fullPath: area,
                            keyword: values.resourcesNumber,
                            teamId: values.md,
                            startTime: startTime,
                            endTime: endTime,
                            totlePrice: values.sellPrice,
                            floorAreas: values.Area,
                            houseRoom: values.FYHX,
                            orientations: values.FYCX,
                            hasKeyHouse: values.isKey,
                            explorationHouse: values.isShiKan,
                            decoration: values.zxqk,
                            houseState: values.houseState,
                        }
                    })
                }
            });
        },
    };
    const paginationshopRent = {
        showQuickJumper: commonFinalCode.showQuickJumper,
        pageSize: shopRentList.pageSize,
        current: shopRentList.current,
        defaultCurrent: 1,
        total: shopRentList.total,
        showTotal: total => `共${total}条数据`,
        onChange: (page, pageSize) => {
            form.validateFields((err, values) => {
                if (!err) {
                    let startTime;
                    let endTime;
                    if (values.dateTimePicker) {
                        startTime = new Date(values.dateTimePicker[0]._d).format('yyyy-MM-dd');
                        endTime = new Date(values.dateTimePicker[1]._d).format('yyyy-MM-dd');
                    }
                    dispatch({
                        type: "allHouseResourceSell/shopRentList",
                        payload: {
                            pageNo: page - 1,
                            pageSize: shopRentList.pageSize,
                            resourcesType: "商铺",
                            saleWay: "出租",
                            sellOrRent: sellOrRent,
                            fullPath: area,
                            keyword: values.resourcesNumber,
                            teamId: values.md,
                            startTime: startTime,
                            endTime: endTime,
                            totlePrice: values.sellPrice,
                            floorAreas: values.Area,
                            houseRoom: values.FYHX,
                            orientations: values.FYCX,
                            hasKeyHouse: values.isKey,
                            explorationHouse: values.isShiKan,
                            decoration: values.zxqk,
                            houseState: values.houseState,
                        }
                    })
                }
            });
        },
    };
    const paginationofficeSell = {
        showQuickJumper: commonFinalCode.showQuickJumper,
        pageSize: officeSellList.pageSize,
        current: officeSellList.current,
        defaultCurrent: 1,
        total: officeSellList.total,
        showTotal: total => `共${total}条数据`,
        onChange: (page, pageSize) => {
            form.validateFields((err, values) => {
                if (!err) {
                    let startTime;
                    let endTime;
                    if (values.dateTimePicker) {
                        startTime = new Date(values.dateTimePicker[0]._d).format('yyyy-MM-dd');
                        endTime = new Date(values.dateTimePicker[1]._d).format('yyyy-MM-dd');
                    }
                    dispatch({
                        type: "allHouseResourceSell/officeSellList",
                        payload: {
                            pageNo: page - 1,
                            pageSize: officeSellList.pageSize,
                            resourcesType: "写字楼",
                            saleWay: "出售",
                            sellOrRent: sellOrRent,
                            fullPath: area,
                            keyword: values.resourcesNumber,
                            teamId: values.md,
                            startTime: startTime,
                            endTime: endTime,
                            totlePrice: values.sellPrice,
                            floorAreas: values.Area,
                            houseRoom: values.FYHX,
                            orientations: values.FYCX,
                            hasKeyHouse: values.isKey,
                            explorationHouse: values.isShiKan,
                            decoration: values.zxqk,
                            houseState: values.houseState,
                        }
                    })
                }
            });
        },
    };
    const paginationofficeRent = {
        showQuickJumper: commonFinalCode.showQuickJumper,
        pageSize: officeRentList.pageSize,
        current: officeRentList.current,
        defaultCurrent: 1,
        total: officeRentList.total,
        showTotal: total => `共${total}条数据`,
        onChange: (page, pageSize) => {
            form.validateFields((err, values) => {
                if (!err) {
                    let startTime;
                    let endTime;
                    if (values.dateTimePicker) {
                        startTime = new Date(values.dateTimePicker[0]._d).format('yyyy-MM-dd');
                        endTime = new Date(values.dateTimePicker[1]._d).format('yyyy-MM-dd');
                    }
                    dispatch({
                        type: "allHouseResourceSell/officeRentList",
                        payload: {
                            pageNo: page - 1,
                            pageSize: officeRentList.pageSize,
                            resourcesType: "写字楼",
                            saleWay: "出租",
                            sellOrRent: sellOrRent,
                            fullPath: area,
                            keyword: values.resourcesNumber,
                            teamId: values.md,
                            startTime: startTime,
                            endTime: endTime,
                            totlePrice: values.sellPrice,
                            floorAreas: values.Area,
                            houseRoom: values.FYHX,
                            orientations: values.FYCX,
                            hasKeyHouse: values.isKey,
                            explorationHouse: values.isShiKan,
                            decoration: values.zxqk,
                            houseState: values.houseState,
                        }
                    })
                }
            });
        },
    };
    const customStyle = {
        padding: '4px 8px',
        active: {
            background: '#42B38B',
            color: '#fff',
            borderColor: 'transparent'
        }
    };
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
    function handleSubmit(e) {
        e.preventDefault();
        form.validateFields((err, values) => {
            if (!err) {
                let startTime;
                let endTime;
                if (values.dateTimePicker) {
                    startTime = new Date(values.dateTimePicker[0]._d).format('yyyy-MM-dd');
                    endTime = new Date(values.dateTimePicker[1]._d).format('yyyy-MM-dd');
                }
                dispatch({
                    type: "allHouseResourceSell/loadList",
                    payload: {
                        sellOrRent: sellOrRent,
                        fullPath: area,
                        keyword: values.resourcesNumber,
                        teamId: values.md,
                        startTime: startTime,
                        endTime: endTime,
                        totlePrice: values.sellPrice,
                        floorAreas: values.Area,
                        houseRoom: values.FYHX,
                        orientations: values.FYCX,
                        hasKeyHouse: values.isKey,
                        explorationHouse: values.isShiKan,
                        decoration: values.zxqk,
                        houseState: values.houseState,
                    }
                })
            }
        });
    }
    const onSelectChange = (value, selectedOptions) => {
        let areaName = "";
        if (selectedOptions != null && selectedOptions.length > 0) {
            selectedOptions.map((item, index) => {
                areaName = areaName + "/" + item['label'];
            })
        }
        dispatch({
            type: "allHouseResourceSell/setState",//保存搜索区域到model
            payload: {
                area: areaName
            }
        })
    }
    const tagsSellChange = (checked) => {

    }
    const tagsAreaChange = (checked) => {

    }
    const onChangeFYHX = (checked) => {

    }
    const onChangeFYCX = (checked) => {

    }
    const houseStructure = (checked) => {

    }
    const onChangeisShiKan = (checked) => {

    }
    const onChangezxqk = (checked) => {

    }
    // PromptModal
    const onOkCallBack = () => {
        if (promptObj.todo === 'closeModal') {
            dispatch({
                type: "allHouseResourceSell/togglePrompt",
                payload: {
                    visible: false
                }
            })
        }
        if (promptObj.todo === 'closeModalAndWritePass') {
            dispatch({
                type: "allHouseResourceSell/togglePrompt",
                payload: {
                    visible: false
                }
            })
            dispatch({
                type: "allHouseResourceSell/changeVisible",
                payload: {
                    tudiGongVisible: true,
                }
            })
        }
    }
    const onCancelCallBack = () => { }
    const onTabsChange = (key) => {
        form.resetFields();
        dispatch({
            type: "allHouseResourceSell/setState",
            payload: {
                activeKey: key
            }
        })
        dispatch({
            type: "allHouseResourceSell/loadList",
            payload: {
                isReFresh: false
            }
        })
    }
    const keyModalShow = (text, record, index) => {
        dispatch({
            type: 'allHouseResourceSell/findOneBrief',
            payload: {
                id: record.keyHasBrokId
            }
        })
    }
    const handleEdit = (text, record, index) => {
        dispatch(routerRedux.push({
            pathname: '/allHouse/allHouseResourceDetail',
            state: {
                id: record.id
            }
        }))
    }
    const keyModalClose = () => {
        dispatch({
            type: 'allHouseResourceSell/setState',
            payload: {
                keyModal: {
                    visible: false,
                }
            }
        })
    }
    // 房源状态 onChangeHouseState
    const onChangeHouseState = () => {

    }
    // 列字段名
    const columns = [{
        title: '序号',
        dataIndex: 'indexXh',
    }, {
        title: '房源编号',
        dataIndex: 'resourcesNumber',
    }, {
        title: '城市',
        dataIndex: 'areaName',
        render: (text, record, index) => {
            var areaNameLet = text.split("/");
            areaNameLet = areaNameLet.filter(function (value) { return !!value; });
            return (<span>{areaNameLet.join("/")}</span>)
        },
    }, {
        title: '小区',
        dataIndex: 'communityName',
        render: (text, record, index) => {
            return (
                <span>
                    <div title={text}>{text.length > 20 ? text.substr(0, 20) + '..' : text}</div>
                </span>
            )
        },
    }, {
        title: '居室',
        dataIndex: 'houseType',
        render: (text, record, index) => {
            return (
                <span>{text}</span>
            )
        }
    }, {
        title: '面积',
        dataIndex: 'floorArea',
        render: (text, record, index) => {
            return (
                <span>{text}m²</span>
            )
        }
    }, {
        title: sellOrRent === 'sell' ? '售价' : '租金',
        dataIndex: 'totlePrice',
        render: (text, record, index) => {
            return (
                <span>{sellOrRent === 'sell' ? Number(text / 10000).toFixed(2) + "万" : text + '元'}</span>
            )
        }
    }, {
        title: '钥匙人',
        dataIndex: 'hasKeyHouse',
        render: (text, record, index) => {
            return text == "否" ? <span>无钥匙</span> : <span onClick={() => keyModalShow(text, record, index)} style={{ "color": "#83A0D8", "cursor": "pointer" }}>{record.keyHasBroker}</span>
        }
    }, {
        title: '实勘图',
        dataIndex: 'picList',
        render: (text, record, index) => {
            return <span>图({text.length})</span>
        }
    }, {
        title: '所属门店',
        dataIndex: '',
        render: (text, record, index) => {
            return <span>所属门店字段</span>
        }
    }, {
        title: '创建时间',
        dataIndex: 'createDate',
        render: (text, record, index) => {
            return <span>{text}</span>
        }
    }, {
        title: '操作',
        render: (text, record, index) => {
            return (<Button style={{ "fontSize": "12px" }} size="small" type="primary" onClick={() => handleEdit(text, record, index)}>查看详情</Button>)
        }
    }];

    return <div>
        {labels === null ?
            <div className="mentorDataLoading">
                <Spin />
            </div>
            : <div className="allHouseResource">
                <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack} />
                <DxLoadingShadow visible={loadingShadow} />
                <Panel title={"公司房源(" + (sellOrRent === "sell" ? "出售" : "出租") + ")"} />
                <div>
                    <div className="searchBar">
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col xl={{ span: 6 }} lg={{ span: 8 }}>
                                    <FormItem label="关键字" {...formItemLayout}>
                                        {getFieldDecorator('resourcesNumber', {
                                            rules: [{ required: false, message: '' }],
                                        })(
                                            <Input placeholder="搜索小区名称或房源编号" className="searchName" size='large' />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col xl={{ span: 6 }} lg={{ span: 8 }}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="时间"
                                    >
                                        {getFieldDecorator('dateTimePicker', {
                                            rules: [{ required: false, message: 'Please select time!' }],
                                        })(
                                            <RangePicker showTime format={"YYYY-MM-DD"} />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col xl={{ span: 5 }} lg={{ span: 7 }}>
                                    <FormItem label="城市" {...formItemLayout}>
                                        {getFieldDecorator('area', {
                                            rules: [{ required: false, message: '请选择城市列表' }],
                                        })(
                                            <Cascader options={eopOptions} onChange={onSelectChange} changeOnSelect={true} placeholder="请选择城市列表" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col xl={{ span: 4 }} lg={{ span: 12 }}>
                                    <FormItem label="所属门店" {...formItemLayout}>
                                        {getFieldDecorator('md', {
                                            rules: [{ required: false, message: '请选择门店' }],
                                        })(
                                            <Select placeholder="请选择门店">
                                                {teamList.map((item, index) => { return <option key={index} value={item.id}>{item.name}</option> })}
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col xl={{ span: 3 }} lg={{ span: 6 }}>
                                    <Row>
                                        <Col span={11} offset={1}>
                                            <Button type='primary' htmlType="submit" size='large'>搜索</Button>
                                        </Col>
                                        <Col span={12}>
                                            <Button type='reset'
                                                onClick={
                                                    () => {
                                                        form.resetFields()
                                                        dispatch({
                                                            type: "allHouseResourceSell/loadList",
                                                            payload: {
                                                                pageNo: 0,
                                                                pageSize: commonFinalCode.pageSize,
                                                            }
                                                        })
                                                    }
                                                }
                                                size='large'>重置</Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <div className="checkableTags">
                                <Row style={{ "marginLeft": "0" }}>
                                    <Col span={24}>
                                        <FormItem label={sellOrRent === "sell" ? "房源价格" : "房源租金"} labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                                            {getFieldDecorator('sellPrice', {
                                                initialValue: [],
                                                // rules: [{ required: true, message:'请选择房源特色',type:"array"},
                                                rules: [
                                                    { required: false },
                                                    {
                                                        validator(rule, value, callback, source, options) {
                                                            var errors = [];
                                                            callback(errors);
                                                        }
                                                    }
                                                ],
                                            })(
                                                <CheckableTags
                                                    multiple={true}
                                                    tags={sellOrRent === "sell" ? labels["住宅出售总价"] : labels["住宅租金"]}
                                                    customStyle={customStyle}
                                                    onChange={tagsSellChange}
                                                // value={houseBaseInfo.characteristicsArray}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row style={{ "marginLeft": "0" }}>
                                    <Col span={24}>
                                        <FormItem label="房源面积" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                                            {getFieldDecorator('Area', {
                                                initialValue: [],
                                                // rules: [{ required: true, message:'请选择房源特色',type:"array"},
                                                rules: [
                                                    { required: false },
                                                    {
                                                        validator(rule, value, callback, source, options) {
                                                            var errors = [];
                                                            callback(errors);
                                                        }
                                                    }
                                                ],
                                            })(
                                                <CheckableTags
                                                    multiple={true}
                                                    tags={labels["住宅面积"]}
                                                    customStyle={customStyle}
                                                    onChange={tagsAreaChange}
                                                // value={houseBaseInfo.characteristicsArray}
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row style={{ "marginLeft": "0" }}>
                                    <Col span={24}>
                                        <FormItem label="房源户型" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                                            {getFieldDecorator('FYHX', {
                                                initialValue: [],
                                                // rules: [{ required: true, message:'请选择房源特色',type:"array"},
                                                rules: [
                                                    { required: false },
                                                    {
                                                        validator(rule, value, callback, source, options) {
                                                            var errors = [];
                                                            callback(errors);
                                                        }
                                                    }
                                                ],
                                            })(
                                                <CheckboxGroup options={labels["住宅居室"].map(item => { return { label: item.name, value: Number(item.value) } })} onChange={onChangeFYHX} />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row style={{ "marginLeft": "0" }}>
                                    <Col span={24}>
                                        <FormItem label="房源朝向" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                                            {getFieldDecorator('FYCX', {
                                                initialValue: [],
                                                // rules: [{ required: true, message:'请选择房源特色',type:"array"},
                                                rules: [
                                                    { required: false },
                                                    {
                                                        validator(rule, value, callback, source, options) {
                                                            var errors = [];
                                                            callback(errors);
                                                        }
                                                    }
                                                ],
                                            })(
                                                <CheckboxGroup options={labels["房源朝向"].map(item => { return { label: item.name, value: item.value } })} onChange={onChangeFYCX} />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row style={{ "marginLeft": "0" }}>
                                    <Col span={7}>
                                        <FormItem label="装修情况" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                                            {getFieldDecorator('zxqk', {
                                                initialValue: [],
                                                // rules: [{ required: true, message:'请选择房源特色',type:"array"},
                                                rules: [
                                                    { required: false },
                                                    {
                                                        validator(rule, value, callback, source, options) {
                                                            var errors = [];
                                                            callback(errors);
                                                        }
                                                    }
                                                ],
                                            })(
                                                <CheckboxGroup options={labels["装修情况"].map(item => { return { label: item.name, value: item.value } })} onChange={onChangezxqk} />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row style={{ "marginLeft": "0" }}>
                                    <Col span={6}>
                                        <FormItem label="钥匙房" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
                                            {getFieldDecorator('isKey', {
                                                initialValue: null,
                                                // rules: [{ required: true, message:'请选择房源特色',type:"array"},
                                                rules: [
                                                    { required: false },
                                                    {
                                                        validator(rule, value, callback, source, options) {
                                                            var errors = [];
                                                            callback(errors);
                                                        }
                                                    }
                                                ],
                                            })(
                                                <RadioGroup onChange={houseStructure}>
                                                    <Radio key={0} value="是">有钥匙</Radio>
                                                    <Radio key={1} value="否">无钥匙</Radio>
                                                </RadioGroup>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={7}>
                                        <FormItem label="实勘房" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
                                            {getFieldDecorator('isShiKan', {
                                                initialValue: null,
                                                // rules: [{ required: true, message:'请选择房源特色',type:"array"},
                                                rules: [
                                                    { required: false, message: "是否有实勘图为必选项" },
                                                    {
                                                        validator(rule, value, callback, source, options) {
                                                            var errors = [];
                                                            callback(errors);
                                                        }
                                                    }
                                                ],
                                            })(
                                                <RadioGroup onChange={onChangeisShiKan}>
                                                    <Radio key={0} value="是">有实勘图</Radio>
                                                    <Radio key={1} value="否">无实勘图</Radio>
                                                </RadioGroup>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={7}>
                                        <FormItem label="状态" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
                                            {getFieldDecorator('houseState', {
                                                initialValue: "已发布",
                                                // rules: [{ required: true, message:'请选择房源特色',type:"array"},
                                                rules: [
                                                    { required: true, message: "请选择房源状态" },
                                                    {
                                                        validator(rule, value, callback, source, options) {
                                                            var errors = [];
                                                            callback(errors);
                                                        }
                                                    }
                                                ],
                                            })(
                                                <RadioGroup onChange={onChangeHouseState}>
                                                    <Radio key={0} value="已发布">已发布</Radio>
                                                    <Radio key={1} value="暂缓">暂缓</Radio>
                                                </RadioGroup>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        </Form>
                    </div>
                </div>
                <div className="allHousetabs">
                    {
                        sellOrRent === 'sell' ? <Tabs
                            activeKey={activeKey}
                            onChange={onTabsChange}
                            type="card"
                            className="tabs"
                            animated={false}
                        >
                            <TabPane
                                tab="二手房出售"
                                key="secondHandHouseSell"
                            >
                                <Table
                                    loading={false}
                                    dataSource={secondHandHouseSellList.content}
                                    columns={columns}
                                    pagination={paginationsecondHandHouseSell}
                                >

                                </Table>
                            </TabPane>
                            <TabPane
                                tab="商铺出售"
                                key="shopSell"
                            >
                                <Table
                                    loading={false}
                                    dataSource={shopSellList.content}
                                    columns={columns}
                                    pagination={paginationshopSell}
                                >

                                </Table>
                            </TabPane>
                            <TabPane
                                tab="写字楼出售"
                                key="officeSell"
                            >
                                <Table
                                    loading={false}
                                    dataSource={officeSellList.content}
                                    columns={columns}
                                    pagination={paginationofficeSell}
                                >

                                </Table>
                            </TabPane>
                        </Tabs> :
                            <Tabs
                                activeKey={activeKey}
                                onChange={onTabsChange}
                                type="card"
                                className="tabs"
                                animated={false}
                            >
                                <TabPane
                                    tab="二手房出租"
                                    key="secondHandHouseRent"
                                >
                                    <Table
                                        loading={false}
                                        dataSource={secondHandHouseRentList.content}
                                        columns={columns}
                                        pagination={paginationsecondHandHouseRent}
                                    >

                                    </Table>
                                </TabPane>
                                <TabPane
                                    tab="商铺出租"
                                    key="shopRent"
                                >
                                    <Table
                                        loading={false}
                                        dataSource={shopRentList.content}
                                        columns={columns}
                                        pagination={paginationshopRent}
                                    >

                                    </Table>
                                </TabPane>
                                <TabPane
                                    tab="写字楼出租"
                                    key="officeRent"
                                >
                                    <Table
                                        loading={false}
                                        dataSource={officeRentList.content}
                                        columns={columns}
                                        pagination={paginationofficeRent}
                                    >

                                    </Table>
                                </TabPane>
                            </Tabs>
                    }
                </div>
                {/* 经纪人详情弹窗  DxPanel公用组件 */}
                <Modal
                    visible={keyModal.visible}
                    footer={false}
                    onCancel={keyModalClose}
                >
                    <DxPanel title="经纪人详情">
                        <Row style={{ "paddingBottom": "15px", "marginTop": "-20px" }}>
                            <Col span={5}>
                                <img src={img} alt="" style={{ "widht": "70px", "height": "70px" }} />
                            </Col>
                            <Col span={18} offset={1}>
                                <p style={{ "height": "24px", "lineHeight": "24px" }}>{keyModalData.name}</p>
                                <p style={{ "height": "24px", "lineHeight": "24px" }}>{keyModalData.phone}</p>
                                <p style={{ "height": "24px", "lineHeight": "24px" }}>所属门店：{keyModalData.toutorTeamOut.name}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{ "height": "38px", "lineHeight": "38px", "paddingLeft": "10px", "backgroundColor": "#EBF1F1", "textAlign": "left", "textOverflow": "ellipsis", "overflow": "hidden", "whiteSpace": "nowrap" }}>
                                门店地址：{keyModalData.toutorTeamOut.site}
                            </Col>
                        </Row>

                    </DxPanel>
                </Modal>
            </div>}
    </div>
}

function mapStateToProps({ allHouseResourceSell }) {
    return { allHouseResourceSell }
}

export default connect(mapStateToProps)(Form.create({})(allHouseResourceSell));