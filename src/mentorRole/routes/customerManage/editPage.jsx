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
        currentTab,
        promptObj,
        loadingShadow,
        customerList,
        followModal,
        bringModal
    } = editPage;

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
            </Row>
        </div>
    </Form>
}

function mapStateToProps({ editPage }) {
    return { editPage }
}

export default connect(mapStateToProps)(Form.create({})(editPage));