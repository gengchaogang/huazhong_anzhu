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
        promptObj,
        loadingShadow,
        eopOptions,//城市列表
    } = editPage;
    const onSelectChange = () => {

    }

    return <Form className="editPage">
        <Panel title={"客户信息"} />
        <div className="customerInfo">
            <Row>
                <Col span={24}>
                    <FormItem label="客户姓名"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 6 }}
                    >
                        {getFieldDecorator('customerName', {
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
                        {getFieldDecorator('wantType', {
                            rules: [{ required: true, message: '请选择需求方式' }],
                        })(
                            <RadioGroup>
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
                        {getFieldDecorator('fullPath', {
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
                        {getFieldDecorator('manageType', {
                            rules: [{ required: true, message: '请选择物业类型' }],
                        })(
                            <RadioGroup>
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
                        wrapperCol={{ span: 10 }}
                    >
                        {getFieldDecorator('area', {
                            rules: [{ required: false, message: '' }],
                        })(
                            <RadioGroup>
                                <Radio style={{ "marginBottom": "0" }} key="40" value="40">40㎡以下</Radio>
                                <Radio style={{ "marginBottom": "0" }} key="40㎡-60㎡" value="40㎡-60㎡">40㎡-60㎡</Radio>
                                <Radio style={{ "marginBottom": "0" }} key="60㎡-100㎡" value="60㎡-100㎡">60㎡-100㎡</Radio>
                                <Radio style={{ "marginBottom": "0" }} key="100㎡-200㎡" value="100㎡-200㎡">100㎡-200㎡</Radio>
                                <Radio style={{ "marginBottom": "0" }} key="200㎡以上" value="200㎡以上">200㎡以上</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                </Col>
                <Col span={24}>
                    <FormItem label="意向户型"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 10 }}
                    >
                        {getFieldDecorator('houseRoom', {
                            rules: [{ required: false, message: '' }],
                        })(
                            <RadioGroup>
                                <Radio style={{ "marginBottom": "0" }} key="一室" value="一室">一室</Radio>
                                <Radio style={{ "marginBottom": "0" }} key="两室" value="两室">两室</Radio>
                                <Radio style={{ "marginBottom": "0" }} key="三室" value="三室">三室</Radio>
                                <Radio style={{ "marginBottom": "0" }} key="四室" value="四室">四室</Radio>
                                <Radio style={{ "marginBottom": "0" }} key="五室及以上" value="五室及以上">五室及以上</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                </Col>
                <Col span={24}>
                    <FormItem label="资金预算"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 10 }}
                    >
                        {getFieldDecorator('price', {
                            rules: [{ required: false, message: '' }],
                        })(
                            <RadioGroup>
                                <Radio style={{ "marginBottom": "0" }} key="50万以下" value="50万以下">50万以下</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                </Col>
            </Row>
        </div>
        <div className="formListController">
            <Row>
                <Col span={19} offset={1}>
                    <Icon type="plus-square" />
                </Col>
                <Col span={4}>
                    <Button type="primary" htmlType="submit">确认提交</Button>
                </Col>
            </Row>
        </div>
    </Form>
}

function mapStateToProps({ editPage }) {
    return { editPage }
}

export default connect(mapStateToProps)(Form.create({})(editPage));