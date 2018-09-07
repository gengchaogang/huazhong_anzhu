import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, DatePicker, Select, Row, Col, Input, Cascader, Radio, Button, Alert, message, Tabs, Table, Spin, Modal, Checkbox, Icon } from 'antd'
import Panel from '../../../commons/components/Panel'
import DxPanel from '../../../commons/components/DxPanel'
import labelsFinalCode from '../../../commons/utils/labelsFinalCode.js';
import CheckableTags from '../../../commons/UI/CheckableTags'
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow';
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';
import PromptModal from '../../../commons/View/PromptModal';
import img from '../../assets/images/morentouinfg.png';
import './editPage.css'

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

function editPage({ dispatch, form, editPage }) {
    const { getFieldDecorator } = form;
    const {
        wantTotal,//需求数，最大3，最小1
        promptObj,
        loadingShadow,
        eopOptions,//城市列表
        labels,//标签信息
        want1,
        want2,
        want3,
        preInfo,//预编辑信息
    } = editPage;
    const splitArea = (value) => {
        let areaLet = value;
        if (!!areaLet) {
            areaLet = areaLet.split('/');
            areaLet = areaLet.filter(function (index) {
                return !!index;
            });
        } else {
            areaLet = '';
        }
        return areaLet;
    }
    const num = wantTotal;
    const onSelectChange = () => {

    }
    //提交客户及意向信息
    const handleSubmit = (e) => {
        e.preventDefault();
        form.validateFields((err, values) => {
            if (!err) {
                console.log(values);
                let price1;
                let price2;
                let price3;
                if (want1.type === "求租") {
                    price1 = values.rentPrice1;
                } else if (want1.type === "求购") {
                    price1 = values.sellPrice1;
                }
                const param = {
                    name: values.customerName,
                    idNumber: values.customerID ? values.customerID : null,
                    phone: values.phone,
                    gender: values.gender,
                    level: values.level,
                    intentionList: [
                        {
                            type: values.wantType1,
                            propertyType: values.propertyType1,
                            city: values.fullPath1 ? values.fullPath1.join('/') : null,
                            rentType: values.rentType1 ? values.rentType1 : null,
                            room: values.houseRoom1 ? values.houseRoom1 : null,
                            shopType: values.shopType1 ? values.shopType1 : null,
                            officeBuildingType: values.officeType1 ? values.officeType1 : null,
                            areaLowerLimit: values.area1 ? (values.area1.indexOf('+') === -1 ? values.area1.split('-')[0] : values.area1) : null,
                            areaUpperLimit: values.area1 ? (values.area1.indexOf('+') === -1 ? values.area1.split('-')[1] : null) : null,
                            budgetLowerLimit: price1 ? (price1.indexOf('+') === -1 ? price1.split('-')[0] : price1) : null,
                            budgetUpperLimit: price1 ? (price1.indexOf('+') === -1 ? price1.split('-')[1] : null) : null,
                            businessScope: values.shopRunType1 ? values.shopRunType1 : null,
                            canRegister: values.canRegister1 ? values.canRegister1 : null,
                            paymentMethod: values.paymentMethod1 ? values.paymentMethod1 : null,
                        }
                    ]
                };
                switch (wantTotal) {
                    case 2:
                        if (want2.type === "求租") {
                            price2 = values.rentPrice2;
                        } else if (want2.type === "求购") {
                            price2 = values.sellPrice2;
                        }
                        param.intentionList.push(
                            {
                                type: values.wantType2,
                                propertyType: values.propertyType2,
                                city: values.fullPath2 ? values.fullPath2.join('/') : null,
                                rentType: values.rentType2 ? values.rentType2 : null,
                                room: values.houseRoom2 ? values.houseRoom2 : null,
                                shopType: values.shopType2 ? values.shopType2 : null,
                                officeBuildingType: values.officeType2 ? values.officeType2 : null,
                                areaLowerLimit: values.area2 ? (values.area2.indexOf('+') === -1 ? values.area2.split('-')[0] : values.area2) : null,
                                areaUpperLimit: values.area2 ? (values.area2.indexOf('+') === -1 ? values.area2.split('-')[1] : null) : null,
                                budgetLowerLimit: price2 ? (price2.indexOf('+') === -1 ? price2.split('-')[0] : price2) : null,
                                budgetUpperLimit: price2 ? (price2.indexOf('+') === -1 ? price2.split('-')[1] : null) : null,
                                businessScope: values.shopRunType2 ? values.shopRunType2 : null,
                                canRegister: values.canRegister2 ? values.canRegister2 : null,
                                paymentMethod: values.paymentMethod2 ? values.paymentMethod2 : null,
                            }
                        );
                        break;
                    case 3:
                        if (want3.type === "求租") {
                            price2 = values.rentPrice2;
                            price3 = values.rentPrice3;
                        } else if (want3.type === "求购") {
                            price2 = values.sellPrice3;
                            price3 = values.sellPrice3;
                        }
                        param.intentionList.push(
                            {
                                type: values.wantType2,
                                propertyType: values.propertyType2,
                                city: values.fullPath2 ? values.fullPath2.join('/') : null,
                                rentType: values.rentType2 ? values.rentType2 : null,
                                room: values.houseRoom2 ? values.houseRoom2 : null,
                                shopType: values.shopType2 ? values.shopType2 : null,
                                officeBuildingType: values.officeType2 ? values.officeType2 : null,
                                areaLowerLimit: values.area2 ? (values.area2.indexOf('+') === -1 ? values.area2.split('-')[0] : values.area2) : null,
                                areaUpperLimit: values.area2 ? (values.area2.indexOf('+') === -1 ? values.area2.split('-')[1] : null) : null,
                                budgetLowerLimit: price2 ? (price2.indexOf('+') === -1 ? price2.split('-')[0] : price2) : null,
                                budgetUpperLimit: price2 ? (price2.indexOf('+') === -1 ? price2.split('-')[1] : null) : null,
                                businessScope: values.shopRunType2 ? values.shopRunType2 : null,
                                canRegister: values.canRegister2 ? values.canRegister2 : null,
                                paymentMethod: values.paymentMethod2 ? values.paymentMethod2 : null,
                            },
                            {
                                type: values.wantType3,
                                propertyType: values.propertyType3,
                                city: values.fullPath3 ? values.fullPath3.join('/') : null,
                                rentType: values.rentType3 ? values.rentType3 : null,
                                room: values.houseRoom3 ? values.houseRoom3 : null,
                                shopType: values.shopType3 ? values.shopType3 : null,
                                officeBuildingType: values.officeType3 ? values.officeType3 : null,
                                areaLowerLimit: values.area3 ? (values.area3.indexOf('+') === -1 ? values.area3.split('-')[0] : values.area3) : null,
                                areaUpperLimit: values.area3 ? (values.area3.indexOf('+') === -1 ? values.area3.split('-')[1] : null) : null,
                                budgetLowerLimit: price3 ? (price3.indexOf('+') === -1 ? price3.split('-')[0] : price3) : null,
                                budgetUpperLimit: price3 ? (price3.indexOf('+') === -1 ? price3.split('-')[1] : null) : null,
                                businessScope: values.shopRunType3 ? values.shopRunType3 : null,
                                canRegister: values.canRegister3 ? values.canRegister3 : null,
                                paymentMethod: values.paymentMethod3 ? values.paymentMethod3 : null,
                            }
                        );
                        break;
                    default:
                        break;
                }
                console.log('param', price2);
                dispatch({
                    type: 'editPage/saveCustomerInfo',
                    payload: param
                })
            }
        })
    }
    const addWant = () => {
        form.validateFields((err, values) => {
            if (!err) {
                dispatch({
                    type: "editPage/setState",
                    payload: {
                        wantTotal: num + 1
                    }
                })
            }
        })
    }
    const deleteWant = () => {
        dispatch({
            type: "editPage/setState",
            payload: {
                wantTotal: num - 1
            }
        })
    }
    //3个意向均根据求租求购物业类型更换不同label
    const want1TypeChange = (e) => {
        dispatch({
            type: "editPage/setState",
            payload: {
                want1: {
                    ...want1,
                    type: e.target.value,
                }
            }
        })
    }
    const want2TypeChange = (e) => {
        dispatch({
            type: "editPage/setState",
            payload: {
                want2: {
                    type: e.target.value,
                    propertyType: want1.propertyType
                }
            }
        })
    }
    const want3TypeChange = (e) => {
        dispatch({
            type: "editPage/setState",
            payload: {
                want3: {
                    type: e.target.value,
                    propertyType: want1.propertyType
                }
            }
        })
    }
    const want1propertyTypeChange = (e) => {
        dispatch({
            type: "editPage/setState",
            payload: {
                want1: {
                    ...want1,
                    propertyType: e.target.value
                }
            }
        })
    }
    const want2propertyTypeChange = (e) => {
        dispatch({
            type: "editPage/setState",
            payload: {
                want2: {
                    type: want2.type,
                    propertyType: e.target.value
                }
            }
        })
    }
    const want3propertyTypeChange = (e) => {
        dispatch({
            type: "editPage/setState",
            payload: {
                want3: {
                    type: want3.type,
                    propertyType: e.target.value
                }
            }
        })
    }
    // PromptModal
    const onOkCallBack = () => {
        if (promptObj.todo === 'closeModal') {
            dispatch({
                type: "editPage/togglePrompt",
                payload: {
                    visible: false
                }
            })
        }
        if (promptObj.todo === 'closeModalAndWritePass') {
            dispatch({
                type: "editPage/togglePrompt",
                payload: {
                    visible: false
                }
            })
        }
    }
    const onCancelCallBack = () => { }
    return <div>
        {
            labels === null ? <div className="mentorDataLoading">
                <Spin />
            </div> : <Form className="editPage" onSubmit={handleSubmit}>
                    <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack} />
                    <Panel title={"客户信息"} />
                    <div className="customerInfo">
                        <Row>
                            <Col span={24}>
                                <FormItem label="客户姓名"
                                    labelCol={{ span: 2 }}
                                    wrapperCol={{ span: 6 }}
                                >
                                    {getFieldDecorator('customerName', {
                                        initialValue: preInfo ? preInfo.name : null,
                                        rules: [{ required: true, message: '请输入客户姓名' }],
                                    })(
                                        <Input placeholder="客户姓名" size='large' />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="性别"
                                    labelCol={{ span: 2 }}
                                    wrapperCol={{ span: 6 }}
                                >
                                    {getFieldDecorator('gender', {
                                        initialValue: preInfo ? preInfo.gender : "男",
                                        rules: [{ required: true, message: '请选择客户性别' }],
                                    })(
                                        <RadioGroup>
                                            <Radio style={{ "marginBottom": "0" }} key="男" value="男">男</Radio>
                                            <Radio style={{ "marginBottom": "0" }} key="女" value="女">女</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="手机号码"
                                    labelCol={{ span: 2 }}
                                    wrapperCol={{ span: 6 }}
                                >
                                    {getFieldDecorator('phone', {
                                        initialValue: preInfo ? preInfo.phone : null,
                                        rules: [
                                            { required: true, message: '请输入手机号码' },
                                            { pattern: /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199)\d{8}$/, message: '请输入正确的手机号码！' }
                                        ],
                                    })(
                                        <Input placeholder="手机号码" size='large' />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="身份证号"
                                    labelCol={{ span: 2 }}
                                    wrapperCol={{ span: 6 }}
                                >
                                    {getFieldDecorator('customerID', {
                                        rules: [
                                            { required: false, message: '' },
                                            { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证号码不合法' }
                                        ],
                                        initialValue: preInfo ? preInfo.idNumber : null,
                                    })(
                                        <Input placeholder="身份证号" size='large' />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="客户级别"
                                    labelCol={{ span: 2 }}
                                    wrapperCol={{ span: 6 }}
                                >
                                    {getFieldDecorator('level', {
                                        rules: [{ required: true, message: '请选择客户级别' }],
                                        initialValue: preInfo ? preInfo.level : null,
                                    })(
                                        <RadioGroup>
                                            <Radio style={{ "marginBottom": "0" }} key="意向客户" value="意向客户">意向客户</Radio>
                                            <Radio style={{ "marginBottom": "0" }} key="重点客户" value="重点客户">重点客户</Radio>
                                            <Radio style={{ "marginBottom": "0" }} key="观望客户" value="观望客户">观望客户</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </div>
                    <Panel title={"客户意向"} />
                    <div className="wantInfo">
                        <Row>
                            <Col span={24}>
                                <FormItem label="需求方式"
                                    labelCol={{ span: 2 }}
                                    wrapperCol={{ span: 6 }}
                                >
                                    {getFieldDecorator('wantType1', {
                                        initialValue: want1.type,
                                        rules: [{ required: true, message: '请选择需求方式' }],
                                    })(
                                        <RadioGroup onChange={want1TypeChange}>
                                            <Radio style={{ "marginBottom": "0" }} key="求购" value="求购">求购</Radio>
                                            <Radio style={{ "marginBottom": "0" }} key="求租" value="求租">求租</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="意向城市"
                                    labelCol={{ span: 2 }}
                                    wrapperCol={{ span: 6 }}
                                >
                                    {getFieldDecorator('fullPath1', {
                                        rules: [{ required: false, message: '' }],
                                        initialValue: splitArea(want1.city),
                                    })(
                                        <Cascader options={eopOptions} onChange={onSelectChange} changeOnSelect={true} placeholder="请选择城市列表" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="物业类型"
                                    labelCol={{ span: 2 }}
                                    wrapperCol={{ span: 6 }}
                                >
                                    {getFieldDecorator('propertyType1', {
                                        initialValue: want1.propertyType,
                                        rules: [{ required: true, message: '请选择物业类型' }],
                                    })(
                                        <RadioGroup onChange={want1propertyTypeChange}>
                                            <Radio style={{ "marginBottom": "0" }} key="住宅" value="住宅">住宅</Radio>
                                            <Radio style={{ "marginBottom": "0" }} key="商铺" value="商铺">商铺</Radio>
                                            <Radio style={{ "marginBottom": "0" }} key="写字楼" value="写字楼">写字楼</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="意向面积"
                                    labelCol={{ span: 2 }}
                                    wrapperCol={{ span: 22 }}
                                >
                                    {getFieldDecorator('area1', {
                                        initialValue: want1.areaUpperLimit ? `${want1.areaLowerLimit}-${want1.areaUpperLimit}` : (want1.areaLowerLimit ? `${want1.areaLowerLimit}+` : null),
                                        rules: [{ required: false, message: '' }],
                                    })(
                                        <RadioGroup>
                                            {
                                                want1.propertyType === "住宅" ? labels["住宅面积"].map(item => {
                                                    return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                }) : null
                                            }
                                            {
                                                want1.propertyType === "商铺" ? labels["商铺面积"].map(item => {
                                                    return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                }) : null
                                            }
                                            {
                                                want1.propertyType === "写字楼" ? labels["写字楼面积"].map(item => {
                                                    return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                }) : null
                                            }
                                        </RadioGroup>
                                    )}
                                </FormItem>
                            </Col>
                            {
                                want1.propertyType === "住宅" ? <Col span={24}>
                                    <FormItem label="意向户型"
                                        labelCol={{ span: 2 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {getFieldDecorator('houseRoom1', {
                                            rules: [{ required: false, message: '' }],
                                            initialValue: want1.room ? want1.room + "" : null
                                        })(
                                            <RadioGroup>
                                                {
                                                    labels["住宅居室"].map(item => {
                                                        return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                    })
                                                }
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                </Col> : null
                            }
                            {
                                want1.type === "求购" ? <div>
                                    <Col span={24}>
                                        <FormItem label="资金预算"
                                            labelCol={{ span: 2 }}
                                            wrapperCol={{ span: 22 }}
                                        >
                                            {getFieldDecorator('sellPrice1', {
                                                rules: [{ required: false, message: '' }],
                                                initialValue: want1.budgetUpperLimit ? `${want1.budgetLowerLimit}-${want1.budgetUpperLimit}` : (want1.budgetLowerLimit ? `${want1.budgetLowerLimit}+` : null),
                                            })(
                                                <RadioGroup>
                                                    {want1.propertyType === "写字楼" ?
                                                        labels["写字楼出售总价"].map(item => {
                                                            return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                        })
                                                        : null
                                                    }
                                                    {want1.propertyType === "住宅" ?
                                                        labels["住宅出售总价"].map(item => {
                                                            return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                        })
                                                        : null
                                                    }
                                                    {want1.propertyType === "商铺" ?
                                                        labels["商铺出售总价"].map(item => {
                                                            return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                        })
                                                        : null
                                                    }
                                                </RadioGroup>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem label="付款方式"
                                            labelCol={{ span: 2 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            {getFieldDecorator('paymentMethod1', {
                                                initialValue: want1.paymentMethod,
                                                rules: [{ required: false, message: '' }],
                                            })(
                                                <RadioGroup>
                                                    <Radio style={{ "marginBottom": "0" }} key="全款" value="全款">全款</Radio>
                                                    <Radio style={{ "marginBottom": "0" }} key="贷款" value="贷款">贷款</Radio>
                                                </RadioGroup>
                                            )}
                                        </FormItem>
                                    </Col>
                                </div> :
                                    <div>
                                        <Col span={24}>
                                            <FormItem label="租金预算"
                                                labelCol={{ span: 2 }}
                                                wrapperCol={{ span: 22 }}
                                            >
                                                {getFieldDecorator('rentPrice1', {
                                                    rules: [{ required: false, message: '' }],
                                                    initialValue: want1.budgetUpperLimit ? `${want1.budgetLowerLimit}-${want1.budgetUpperLimit}` : (want1.budgetLowerLimit ? `${want1.budgetLowerLimit}+` : null)
                                                })(
                                                    <RadioGroup>
                                                        {
                                                            want1.propertyType === "住宅" ? labels["住宅租金"].map(item => {
                                                                return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                            }) : null
                                                        }
                                                        {
                                                            want1.propertyType === "商铺" ? labels["商铺租金"].map(item => {
                                                                return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                            }) : null
                                                        }
                                                        {
                                                            want1.propertyType === "写字楼" ? labels["写字楼租金"].map(item => {
                                                                return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                            }) : null
                                                        }
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={24}>
                                            <FormItem label="付款方式"
                                                labelCol={{ span: 2 }}
                                                wrapperCol={{ span: 10 }}
                                            >
                                                {getFieldDecorator('paymentMethod1', {
                                                    rules: [{ required: false, message: '' }],
                                                    initialValue: want1.paymentMethod
                                                })(
                                                    <RadioGroup>
                                                        {
                                                            want1.propertyType === "住宅" ? labels["二手房租赁支付方式"].map(item => {
                                                                return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                            }) : labels["求租付款方式"].map(item => {
                                                                return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                            })
                                                        }
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </div>

                            }
                            {
                                (want1.type === "求购" || want1.propertyType !== "住宅") ? null : <Col span={24}>
                                    <FormItem label="承租方式"
                                        labelCol={{ span: 2 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {getFieldDecorator('rentType1', {
                                            rules: [{ required: false, message: '' }],
                                            initialValue: want1.rentType
                                        })(
                                            <RadioGroup>
                                                <Radio style={{ "marginBottom": "0" }} key="整租" value="整租">整租</Radio>
                                                <Radio style={{ "marginBottom": "0" }} key="合租" value="合租">合租</Radio>
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                </Col>
                            }
                            {
                                want1.propertyType === "商铺" ? <div>
                                    <Col span={24}>
                                        <FormItem label="商铺类型"
                                            labelCol={{ span: 2 }}
                                            wrapperCol={{ span: 22 }}
                                        >
                                            {getFieldDecorator('shopType1', {
                                                rules: [{ required: false, message: '' }],
                                                initialValue: want1.shopType,
                                            })(
                                                <RadioGroup>
                                                    {
                                                        labels["商铺类型"].map(item => {
                                                            return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                        })
                                                    }
                                                </RadioGroup>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem label="经营类目"
                                            labelCol={{ span: 2 }}
                                            wrapperCol={{ span: 22 }}
                                        >
                                            {getFieldDecorator('shopRunType1', {
                                                rules: [{ required: false, message: '' }],
                                                initialValue: want1.businessScope ? want1.businessScope : null,
                                            })(
                                                <RadioGroup>
                                                    {
                                                        labels["经营类目"].map(item => {
                                                            return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                        })
                                                    }
                                                </RadioGroup>
                                            )}
                                        </FormItem>
                                    </Col>
                                </div> : null
                            }
                            {
                                want1.propertyType === "写字楼" ? <div>
                                    <Col span={24}>
                                        <FormItem label="写字楼类型"
                                            labelCol={{ span: 2 }}
                                            wrapperCol={{ span: 22 }}
                                        >
                                            {getFieldDecorator('officeType1', {
                                                initialValue: want1.officeBuildingType ? want1.officeBuildingType : null,
                                                rules: [{ required: false, message: '' }],
                                            })(
                                                <RadioGroup>
                                                    {
                                                        labels["写字楼类型"].map(item => {
                                                            return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                        })
                                                    }
                                                </RadioGroup>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem label="是否可注册"
                                            labelCol={{ span: 2 }}
                                            wrapperCol={{ span: 22 }}
                                        >
                                            {getFieldDecorator('canRegister1', {
                                                rules: [{ required: false, message: '' }],
                                                initialValue: want1.canRegister ? want1.canRegister : null,
                                            })(
                                                <RadioGroup>
                                                    <Radio style={{ "marginBottom": "0" }} key="是" value="是">是</Radio>
                                                    <Radio style={{ "marginBottom": "0" }} key="否" value="否">否</Radio>
                                                </RadioGroup>
                                            )}
                                        </FormItem>
                                    </Col>
                                </div> : null
                            }
                        </Row>
                        {
                            wantTotal >= 2 ? <Row style={{ "borderTop": "1px solid #ddd", "paddingTop": "10px" }}>
                                <Col span={23}>
                                    <FormItem label="需求方式"
                                        labelCol={{ span: 2 }}
                                        wrapperCol={{ span: 6 }}
                                    >
                                        {getFieldDecorator('wantType2', {
                                            initialValue: want2.type,
                                            rules: [{ required: true, message: '请选择需求方式' }],
                                        })(
                                            <RadioGroup onChange={want2TypeChange}>
                                                <Radio style={{ "marginBottom": "0" }} key="求购" value="求购">求购</Radio>
                                                <Radio style={{ "marginBottom": "0" }} key="求租" value="求租">求租</Radio>
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                </Col>
                                {
                                    wantTotal === 2 ? <Col span={1} onClick={deleteWant} style={{ "cursor": "pointer" }} title="删除意向">
                                        <Icon type="delete" style={{ "fontSize": "16px" }} />
                                    </Col> : null
                                }
                                <Col span={24}>
                                    <FormItem label="意向城市"
                                        labelCol={{ span: 2 }}
                                        wrapperCol={{ span: 6 }}
                                    >
                                        {getFieldDecorator('fullPath2', {
                                            rules: [{ required: false, message: '' }],
                                            initialValue: splitArea(want2.city),
                                        })(
                                            <Cascader options={eopOptions} onChange={onSelectChange} changeOnSelect={true} placeholder="请选择城市列表" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem label="物业类型"
                                        labelCol={{ span: 2 }}
                                        wrapperCol={{ span: 6 }}
                                    >
                                        {getFieldDecorator('propertyType2', {
                                            initialValue: want2.propertyType,
                                            rules: [{ required: true, message: '请选择物业类型' }],
                                        })(
                                            <RadioGroup onChange={want2propertyTypeChange}>
                                                <Radio style={{ "marginBottom": "0" }} key="住宅" value="住宅">住宅</Radio>
                                                <Radio style={{ "marginBottom": "0" }} key="商铺" value="商铺">商铺</Radio>
                                                <Radio style={{ "marginBottom": "0" }} key="写字楼" value="写字楼">写字楼</Radio>
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem label="意向面积"
                                        labelCol={{ span: 2 }}
                                        wrapperCol={{ span: 22 }}
                                    >
                                        {getFieldDecorator('area2', {
                                            initialValue: want2.areaUpperLimit ? `${want2.areaLowerLimit}-${want2.areaUpperLimit}` : (want2.areaLowerLimit ? `${want2.areaLowerLimit}+` : null),
                                            rules: [{ required: false, message: '' }],
                                        })(
                                            <RadioGroup>
                                                {
                                                    want2.propertyType === "住宅" ? labels["住宅面积"].map(item => {
                                                        return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                    }) : null
                                                }
                                                {
                                                    want2.propertyType === "商铺" ? labels["商铺面积"].map(item => {
                                                        return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                    }) : null
                                                }
                                                {
                                                    want2.propertyType === "写字楼" ? labels["写字楼面积"].map(item => {
                                                        return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                    }) : null
                                                }
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                </Col>
                                {
                                    want2.propertyType === "住宅" ? <Col span={24}>
                                        <FormItem label="意向户型"
                                            labelCol={{ span: 2 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            {getFieldDecorator('houseRoom2', {
                                                rules: [{ required: false, message: '' }],
                                                initialValue: want2.room ? want2.room + "" : null
                                            })(
                                                <RadioGroup>
                                                    {
                                                        labels["住宅居室"].map(item => {
                                                            return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                        })
                                                    }
                                                </RadioGroup>
                                            )}
                                        </FormItem>
                                    </Col> : null
                                }
                                {
                                    want2.type === "求购" ? <div>
                                        <Col span={24}>
                                            <FormItem label="资金预算"
                                                labelCol={{ span: 2 }}
                                                wrapperCol={{ span: 22 }}
                                            >
                                                {getFieldDecorator('sellPrice1', {
                                                    rules: [{ required: false, message: '' }],
                                                    initialValue: want2.budgetUpperLimit ? `${want2.budgetLowerLimit}-${want2.budgetUpperLimit}` : (want2.budgetLowerLimit ? `${want2.budgetLowerLimit}+` : null),
                                                })(
                                                    <RadioGroup>
                                                        {want2.propertyType === "写字楼" ?
                                                            labels["写字楼出售总价"].map(item => {
                                                                return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                            })
                                                            : null
                                                        }
                                                        {want2.propertyType === "住宅" ?
                                                            labels["住宅出售总价"].map(item => {
                                                                return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                            })
                                                            : null
                                                        }
                                                        {want2.propertyType === "商铺" ?
                                                            labels["商铺出售总价"].map(item => {
                                                                return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                            })
                                                            : null
                                                        }
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={24}>
                                            <FormItem label="付款方式"
                                                labelCol={{ span: 2 }}
                                                wrapperCol={{ span: 10 }}
                                            >
                                                {getFieldDecorator('paymentMethod2', {
                                                    rules: [{ required: false, message: '' }],
                                                    initialValue: want2.paymentMethod
                                                })(
                                                    <RadioGroup>
                                                        <Radio style={{ "marginBottom": "0" }} key="全款" value="全款">全款</Radio>
                                                        <Radio style={{ "marginBottom": "0" }} key="贷款" value="贷款">贷款</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </div> :
                                        <div>
                                            <Col span={24}>
                                                <FormItem label="租金预算"
                                                    labelCol={{ span: 2 }}
                                                    wrapperCol={{ span: 22 }}
                                                >
                                                    {getFieldDecorator('rentPrice2', {
                                                        rules: [{ required: false, message: '' }],
                                                        initialValue: want2.budgetUpperLimit ? `${want2.budgetLowerLimit}-${want2.budgetUpperLimit}` : (want2.budgetLowerLimit ? `${want2.budgetLowerLimit}+` : null)
                                                    })(
                                                        <RadioGroup>
                                                            {
                                                                want2.propertyType === "住宅" ? labels["住宅租金"].map(item => {
                                                                    return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                                }) : null
                                                            }
                                                            {
                                                                want2.propertyType === "商铺" ? labels["商铺租金"].map(item => {
                                                                    return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                                }) : null
                                                            }
                                                            {
                                                                want2.propertyType === "写字楼" ? labels["写字楼租金"].map(item => {
                                                                    return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                                }) : null
                                                            }
                                                        </RadioGroup>
                                                    )}
                                                </FormItem>
                                            </Col>
                                            <Col span={24}>
                                                <FormItem label="付款方式"
                                                    labelCol={{ span: 2 }}
                                                    wrapperCol={{ span: 10 }}
                                                >
                                                    {getFieldDecorator('paymentMethod2', {
                                                        rules: [{ required: false, message: '' }],
                                                        initialValue: want2.paymentMethod
                                                    })(
                                                        <RadioGroup>
                                                            {
                                                                want2.propertyType === "住宅" ? labels["二手房租赁支付方式"].map(item => {
                                                                    return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                                }) : labels["求租付款方式"].map(item => {
                                                                    return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                                })
                                                            }
                                                        </RadioGroup>
                                                    )}
                                                </FormItem>
                                            </Col>
                                        </div>

                                }
                                {
                                    (want2.type === "求购" || want2.propertyType !== "住宅") ? null : <Col span={24}>
                                        <FormItem label="承租方式"
                                            labelCol={{ span: 2 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            {getFieldDecorator('rentType2', {
                                                rules: [{ required: false, message: '' }],
                                                initialValue: want1.rentType
                                            })(
                                                <RadioGroup>
                                                    <Radio style={{ "marginBottom": "0" }} key="整租" value="整租">整租</Radio>
                                                    <Radio style={{ "marginBottom": "0" }} key="合租" value="合租">合租</Radio>
                                                </RadioGroup>
                                            )}
                                        </FormItem>
                                    </Col>
                                }
                                {
                                    want2.propertyType === "商铺" ? <div>
                                        <Col span={24}>
                                            <FormItem label="商铺类型"
                                                labelCol={{ span: 2 }}
                                                wrapperCol={{ span: 22 }}
                                            >
                                                {getFieldDecorator('shopType2', {
                                                    rules: [{ required: false, message: '' }],
                                                    initialValue: want2.shopType,
                                                })(
                                                    <RadioGroup>
                                                        {
                                                            labels["商铺类型"].map(item => {
                                                                return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                            })
                                                        }
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={24}>
                                            <FormItem label="经营类目"
                                                labelCol={{ span: 2 }}
                                                wrapperCol={{ span: 22 }}
                                            >
                                                {getFieldDecorator('shopRunType2', {
                                                    rules: [{ required: false, message: '' }],
                                                    initialValue: want2.businessScope,
                                                })(
                                                    <RadioGroup>
                                                        {
                                                            labels["经营类目"].map(item => {
                                                                return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                            })
                                                        }
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </div> : null
                                }
                                {
                                    want2.propertyType === "写字楼" ? <div>
                                        <Col span={24}>
                                            <FormItem label="写字楼类型"
                                                labelCol={{ span: 2 }}
                                                wrapperCol={{ span: 22 }}
                                            >
                                                {getFieldDecorator('officeType2', {
                                                    rules: [{ required: false, message: '' }],
                                                    initialValue: want2.officeBuildingType ? want2.officeBuildingType : null
                                                })(
                                                    <RadioGroup>
                                                        {
                                                            labels["写字楼类型"].map(item => {
                                                                return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                            })
                                                        }
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={24}>
                                            <FormItem label="是否可注册"
                                                labelCol={{ span: 2 }}
                                                wrapperCol={{ span: 22 }}
                                            >
                                                {getFieldDecorator('canRegister2', {
                                                    rules: [{ required: false, message: '' }],
                                                    initialValue: want2.canRegister ? want2.canRegister : null,
                                                })(
                                                    <RadioGroup>
                                                        <Radio style={{ "marginBottom": "0" }} key="是" value="是">是</Radio>
                                                        <Radio style={{ "marginBottom": "0" }} key="否" value="否">否</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </div> : null
                                }
                            </Row> : null
                        }
                        {
                            wantTotal === 3 ? <Row style={{ "borderTop": "1px solid #ddd", "paddingTop": "10px" }}>
                                <Col span={23}>
                                    <FormItem label="需求方式"
                                        labelCol={{ span: 2 }}
                                        wrapperCol={{ span: 6 }}
                                    >
                                        {getFieldDecorator('wantType3', {
                                            initialValue: want3.type,
                                            rules: [{ required: true, message: '请选择需求方式' }],
                                        })(
                                            <RadioGroup onChange={want3TypeChange}>
                                                <Radio style={{ "marginBottom": "0" }} key="求购" value="求购">求购</Radio>
                                                <Radio style={{ "marginBottom": "0" }} key="求租" value="求租">求租</Radio>
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                </Col>
                                {
                                    wantTotal === 3 ? <Col span={1} style={{ "cursor": "pointer" }} onClick={deleteWant} title="删除意向">
                                        <Icon type="delete" style={{ "fontSize": "16px" }} />
                                    </Col> : null
                                }
                                <Col span={24}>
                                    <FormItem label="意向城市"
                                        labelCol={{ span: 2 }}
                                        wrapperCol={{ span: 6 }}
                                    >
                                        {getFieldDecorator('fullPath3', {
                                            rules: [{ required: false, message: '' }],
                                            initialValue: splitArea(want3.city),
                                        })(
                                            <Cascader options={eopOptions} onChange={onSelectChange} changeOnSelect={true} placeholder="请选择城市列表" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem label="物业类型"
                                        labelCol={{ span: 2 }}
                                        wrapperCol={{ span: 6 }}
                                    >
                                        {getFieldDecorator('propertyType3', {
                                            initialValue: want3.propertyType,
                                            rules: [{ required: true, message: '请选择物业类型' }],
                                        })(
                                            <RadioGroup onChange={want3propertyTypeChange}>
                                                <Radio style={{ "marginBottom": "0" }} key="住宅" value="住宅">住宅</Radio>
                                                <Radio style={{ "marginBottom": "0" }} key="商铺" value="商铺">商铺</Radio>
                                                <Radio style={{ "marginBottom": "0" }} key="写字楼" value="写字楼">写字楼</Radio>
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem label="意向面积"
                                        labelCol={{ span: 2 }}
                                        wrapperCol={{ span: 22 }}
                                    >
                                        {getFieldDecorator('area3', {
                                            initialValue: want3.areaUpperLimit ? `${want3.areaLowerLimit}-${want3.areaUpperLimit}` : (want3.areaLowerLimit ? `${want3.areaLowerLimit}+` : null),
                                            rules: [{ required: false, message: '' }],
                                        })(
                                            <RadioGroup>
                                                {
                                                    want3.propertyType === "住宅" ? labels["住宅面积"].map(item => {
                                                        return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                    }) : null
                                                }
                                                {
                                                    want3.propertyType === "商铺" ? labels["商铺面积"].map(item => {
                                                        return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                    }) : null
                                                }
                                                {
                                                    want3.propertyType === "写字楼" ? labels["写字楼面积"].map(item => {
                                                        return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                    }) : null
                                                }
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                </Col>
                                {
                                    want3.propertyType === "住宅" ? <Col span={24}>
                                        <FormItem label="意向户型"
                                            labelCol={{ span: 2 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            {getFieldDecorator('houseRoom3', {
                                                rules: [{ required: false, message: '' }],
                                                initialValue: want3.room ? want3.room + "" : null
                                            })(
                                                <RadioGroup>
                                                    {
                                                        labels["住宅居室"].map(item => {
                                                            return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                        })
                                                    }
                                                </RadioGroup>
                                            )}
                                        </FormItem>
                                    </Col> : null
                                }
                                {
                                    want3.type === "求购" ? <div>
                                        <Col span={24}>
                                            <FormItem label="资金预算"
                                                labelCol={{ span: 2 }}
                                                wrapperCol={{ span: 22 }}
                                            >
                                                {getFieldDecorator('sellPrice3', {
                                                    rules: [{ required: false, message: '' }],
                                                    initialValue: want3.budgetUpperLimit ? `${want3.budgetLowerLimit}-${want3.budgetUpperLimit}` : (want3.budgetLowerLimit ? `${want3.budgetLowerLimit}+` : null)
                                                })(
                                                    <RadioGroup>
                                                        {want3.propertyType === "写字楼" ?
                                                            labels["写字楼出售总价"].map(item => {
                                                                return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                            })
                                                            : null
                                                        }
                                                        {want3.propertyType === "住宅" ?
                                                            labels["住宅出售总价"].map(item => {
                                                                return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                            })
                                                            : null
                                                        }
                                                        {want3.propertyType === "商铺" ?
                                                            labels["商铺出售总价"].map(item => {
                                                                return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                            })
                                                            : null
                                                        }
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={24}>
                                            <FormItem label="付款方式"
                                                labelCol={{ span: 2 }}
                                                wrapperCol={{ span: 10 }}
                                            >
                                                {getFieldDecorator('paymentMethod3', {
                                                    rules: [{ required: false, message: '' }],
                                                    initialValue: want3.paymentMethod
                                                })(
                                                    <RadioGroup>
                                                        <Radio style={{ "marginBottom": "0" }} key="全款" value="全款">全款</Radio>
                                                        <Radio style={{ "marginBottom": "0" }} key="贷款" value="贷款">贷款</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </div> :
                                        <div>
                                            <Col span={24}>
                                                <FormItem label="租金预算"
                                                    labelCol={{ span: 2 }}
                                                    wrapperCol={{ span: 22 }}
                                                >
                                                    {getFieldDecorator('rentPrice3', {
                                                        rules: [{ required: false, message: '' }],
                                                        initialValue: want3.budgetUpperLimit ? `${want3.budgetLowerLimit}-${want3.budgetUpperLimit}` : (want3.budgetLowerLimit ? `${want3.budgetLowerLimit}+` : null)
                                                    })(
                                                        <RadioGroup>
                                                            {
                                                                want3.propertyType === "住宅" ? labels["住宅租金"].map(item => {
                                                                    return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                                }) : null
                                                            }
                                                            {
                                                                want3.propertyType === "商铺" ? labels["商铺租金"].map(item => {
                                                                    return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                                }) : null
                                                            }
                                                            {
                                                                want3.propertyType === "写字楼" ? labels["写字楼租金"].map(item => {
                                                                    return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                                }) : null
                                                            }
                                                        </RadioGroup>
                                                    )}
                                                </FormItem>
                                            </Col>
                                            <Col span={24}>
                                                <FormItem label="付款方式"
                                                    labelCol={{ span: 2 }}
                                                    wrapperCol={{ span: 10 }}
                                                >
                                                    {getFieldDecorator('paymentMethod3', {
                                                        rules: [{ required: false, message: '' }],
                                                        initialValue: want3.paymentMethod
                                                    })(
                                                        <RadioGroup>
                                                            {
                                                                want3.propertyType === "住宅" ? labels["二手房租赁支付方式"].map(item => {
                                                                    return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                                }) : labels["求租付款方式"].map(item => {
                                                                    return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                                })
                                                            }
                                                        </RadioGroup>
                                                    )}
                                                </FormItem>
                                            </Col>
                                        </div>

                                }
                                {
                                    (want3.type === "求购" || want3.propertyType !== "住宅") ? null : <Col span={24}>
                                        <FormItem label="承租方式"
                                            labelCol={{ span: 2 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            {getFieldDecorator('rentType3', {
                                                rules: [{ required: false, message: '' }],
                                            })(
                                                <RadioGroup>
                                                    <Radio style={{ "marginBottom": "0" }} key="整租" value="整租">整租</Radio>
                                                    <Radio style={{ "marginBottom": "0" }} key="合租" value="合租">合租</Radio>
                                                </RadioGroup>
                                            )}
                                        </FormItem>
                                    </Col>
                                }
                                {
                                    want3.propertyType === "商铺" ? <div>
                                        <Col span={24}>
                                            <FormItem label="商铺类型"
                                                labelCol={{ span: 2 }}
                                                wrapperCol={{ span: 22 }}
                                            >
                                                {getFieldDecorator('shopType3', {
                                                    rules: [{ required: false, message: '' }],
                                                    initialValue: want3.shopType,
                                                })(
                                                    <RadioGroup>
                                                        {
                                                            labels["商铺类型"].map(item => {
                                                                return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                            })
                                                        }
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={24}>
                                            <FormItem label="经营类目"
                                                labelCol={{ span: 2 }}
                                                wrapperCol={{ span: 22 }}
                                            >
                                                {getFieldDecorator('shopRunType3', {
                                                    rules: [{ required: false, message: '' }],
                                                    initialValue: want3.businessScope,
                                                })(
                                                    <RadioGroup>
                                                        {
                                                            labels["经营类目"].map(item => {
                                                                return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                            })
                                                        }
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </div> : null
                                }
                                {
                                    want3.propertyType === "写字楼" ? <div>
                                        <Col span={24}>
                                            <FormItem label="写字楼类型"
                                                labelCol={{ span: 2 }}
                                                wrapperCol={{ span: 22 }}
                                            >
                                                {getFieldDecorator('officeType3', {
                                                    rules: [{ required: false, message: '' }],
                                                    initialValue: want3.officeBuildingType ? want3.officeBuildingType : null
                                                })(
                                                    <RadioGroup>
                                                        {
                                                            labels["写字楼类型"].map(item => {
                                                                return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                            })
                                                        }
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={24}>
                                            <FormItem label="是否可注册"
                                                labelCol={{ span: 2 }}
                                                wrapperCol={{ span: 22 }}
                                            >
                                                {getFieldDecorator('canRegister3', {
                                                    rules: [{ required: false, message: '' }],
                                                    initialValue: want3.canRegister ? want3.canRegister : null,
                                                })(
                                                    <RadioGroup>
                                                        <Radio style={{ "marginBottom": "0" }} key="是" value="是">是</Radio>
                                                        <Radio style={{ "marginBottom": "0" }} key="否" value="否">否</Radio>
                                                    </RadioGroup>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </div> : null
                                }
                            </Row> : null
                        }
                    </div>
                    <div className="formListController">
                        <Row>
                            <Col span={12} offset={1} style={{ "height": "40px", "lineHeight": "40px", }}>
                                {
                                    wantTotal === 3 ? null : <div onClick={addWant} style={{ "cursor": "pointer" }}><Icon type="plus-square" style={{ "fontSize": "20px", "color": "#ddd", "marginTop": "10px", "marginRight": "15px", "verticalAlign": "top" }} />新增客户意向</div>
                                }
                            </Col>
                            <Col span={2} offset={9} style={{ "height": "40px", "lineHeight": "40px" }}>
                                <Button type="primary" htmlType="submit">确认提交</Button>
                            </Col>
                        </Row>
                    </div>
                </Form>
        }
    </div>
}

function mapStateToProps({ editPage }) {
    return { editPage }
}

export default connect(mapStateToProps)(Form.create({})(editPage));