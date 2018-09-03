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
    console.log(editPage);
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

    return <div>
        {
            labels === null ? <div className="mentorDataLoading">
                <Spin />
            </div> : <Form className="editPage">
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
                                        rules: [{ required: true, message: '请输入手机号码' }],
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
                                        rules: [{ required: false, message: '' }],
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
                                        initialValue: splitArea(want1.area)
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
                                        initialValue: want1.areaUpperLimit ? `${want1.areaLowerLimit}-${want1.areaUpperLimit}` : `${want1.areaLowerLimit}+`,
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
                                            initialValue: want1.room + ""
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
                                            })(
                                                <RadioGroup>
                                                    {want1.propertyType === "写字楼" ?
                                                        labels["写字楼出售总价"].map(item => {
                                                            return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                        })
                                                        :
                                                        labels["住宅出售总价"].map(item => {
                                                            return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                        })
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
                                            {getFieldDecorator('paySellType1', {
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
                                                    initialValue: want1.budgetUpperLimit ? `${want1.budgetLowerLimit}-${want1.budgetUpperLimit}` : `${want1.budgetLowerLimit}+`
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
                                                {getFieldDecorator('payRentType1', {
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
                                            {getFieldDecorator('shopRunType1', {
                                                rules: [{ required: false, message: '' }],
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
                                    wantTotal === 2 ? <Col span={1} onClick={deleteWant} style={{ "cursor": "pointer" }}>
                                        <Icon type="delete" theme="outlined" theme="filter" style={{ "fontSize": "16px" }} />
                                    </Col> : null
                                }
                                <Col span={24}>
                                    <FormItem label="意向城市"
                                        labelCol={{ span: 2 }}
                                        wrapperCol={{ span: 6 }}
                                    >
                                        {getFieldDecorator('fullPath2', {
                                            rules: [{ required: false, message: '' }],
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
                                            initialValue: want2.areaUpperLimit ? `${want2.areaLowerLimit}-${want2.areaUpperLimit}` : `${want2.areaLowerLimit}+`,
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
                                                initialValue: want2.room + ""
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
                                                    initialValue: want2.budgetUpperLimit ? `${want2.budgetLowerLimit}-${want2.budgetUpperLimit}` : `${want2.budgetLowerLimit}+`
                                                })(
                                                    <RadioGroup>
                                                        {want2.propertyType === "写字楼" ?
                                                            labels["写字楼出售总价"].map(item => {
                                                                return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                            })
                                                            :
                                                            labels["住宅出售总价"].map(item => {
                                                                return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                            })
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
                                                {getFieldDecorator('paySellType2', {
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
                                                        initialValue: want2.budgetUpperLimit ? `${want2.budgetLowerLimit}-${want2.budgetUpperLimit}` : `${want2.budgetLowerLimit}+`
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
                                                    {getFieldDecorator('payRentType2', {
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
                                                {getFieldDecorator('shopRunType2', {
                                                    rules: [{ required: false, message: '' }],
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
                                    wantTotal === 3 ? <Col span={1} style={{ "cursor": "pointer" }} onClick={deleteWant}>
                                        <Icon type="delete" theme="outlined" theme="filter" style={{ "fontSize": "16px" }} />
                                    </Col> : null
                                }
                                <Col span={24}>
                                    <FormItem label="意向城市"
                                        labelCol={{ span: 2 }}
                                        wrapperCol={{ span: 6 }}
                                    >
                                        {getFieldDecorator('fullPath3', {
                                            rules: [{ required: false, message: '' }],
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
                                                    initialValue: want3.budgetUpperLimit ? `${want3.budgetLowerLimit}-${want3.budgetUpperLimit}` : `${want3.budgetLowerLimit}+`
                                                })(
                                                    <RadioGroup>
                                                        {want3.propertyType === "写字楼" ?
                                                            labels["写字楼出售总价"].map(item => {
                                                                return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                            })
                                                            :
                                                            labels["住宅出售总价"].map(item => {
                                                                return <Radio style={{ "marginBottom": "0" }} key={item.value} value={item.value}>{item.name}</Radio>
                                                            })
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
                                                {getFieldDecorator('paySellType3', {
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
                                                    {getFieldDecorator('rentPrice3', {
                                                        rules: [{ required: false, message: '' }],
                                                        initialValue: want3.budgetUpperLimit ? `${want3.budgetLowerLimit}-${want3.budgetUpperLimit}` : `${want3.budgetLowerLimit}+`
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
                                                    {getFieldDecorator('payRentType3', {
                                                        rules: [{ required: false, message: '' }],
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
                                                {getFieldDecorator('shopRunType3', {
                                                    rules: [{ required: false, message: '' }],
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