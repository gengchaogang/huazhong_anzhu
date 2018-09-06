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
import './customerManage.css'

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

function customerManage({ dispatch, form, customerManage }) {
    const { getFieldDecorator } = form;
    const {
        promptObj,
        loadingShadow,
        customerList,
        isBroker,
    } = customerManage;
    //表单提交
    const handleSubmit = (e) => {
        e.preventDefault();
        form.validateFields((err, values) => {
            if (!err) {
                const payload = {
                    pageNo: 0,
                    pageSize: customerList.pageSize,
                }
                values.keyword && (payload.keyword = values.keyword);
                values.intentionType && (payload.intentionType = values.intentionType);
                if (values.dateTimePicker && values.dateTimePicker.length > 1) {
                    payload.startTime = new Date(values.dateTimePicker[0]._d).format('yyyy-MM-dd');
                    payload.endTime = new Date(values.dateTimePicker[1]._d).format('yyyy-MM-dd');
                }
                dispatch({
                    type: "customerManage/getAllCustomerList",
                    payload
                })
            }
        });
    }
    //添加客户
    const addCustomer = () => {
        dispatch(routerRedux.push({
            pathname: '/customerManage/editPage',
            state: {
                id: null
            }
        }))
    }
    //客户数据分页
    const paginationCustomerList = {
        showQuickJumper: commonFinalCode.showQuickJumper,
        pageSize: customerList.pageSize,
        current: customerList.current,
        defaultCurrent: 1,
        total: customerList.total,
        showTotal: total => `共${total}条数据`,
        onChange: (page, pageSize) => {
            form.validateFields((err, values) => {
                if (!err) {
                    const payload = {
                        pageNo: page - 1,
                        pageSize: pageSize,
                    }
                    values.keyword && (payload.keyword = values.keyword);
                    values.intentionType && (payload.intentionType = values.intentionType);
                    if (values.dateTimePicker) {
                        payload.startTime = new Date(values.dateTimePicker[0]._d).format('yyyy-MM-dd');
                        payload.endTime = new Date(values.dateTimePicker[1]._d).format('yyyy-MM-dd');
                    }
                    dispatch({
                        type: "customerManage/getAllCustomerList",
                        payload
                    })
                }
            })
        }
    }
    const columns = [
        {
            title: '客户姓名',
            dataIndex: 'name',
        }, {
            title: '性别',
            dataIndex: 'gender',
        }, {
            title: '电话',
            dataIndex: 'phone',
        }, {
            title: '需求方式',
            dataIndex: "intentionTypes"
        }, {
            title: '创建时间',
            dataIndex: 'createDate',
            render: (text, record, index) => {
                return new Date(text).format('yyyy.MM.dd hh:mm:ss');
            }
        }, {
            title: '操作',
            render: (text, record, index) => {
                return <div className="operation">
                    <span onClick={() => handleManage(text, record, index)} className="handleManage">客户管理</span>
                    <span onClick={() => handleEdit(text, record, index)} className="handleEdit">编辑</span>
                </div>
            }
        },
    ]
    const handleManage = (text, record, index) => {
        dispatch(routerRedux.push({
            pathname: '/customerManage/managePage',
            state: {
                record: record
            }
        }))
    }
    const handleEdit = (text, record, index) => {
        dispatch(routerRedux.push({
            pathname: '/customerManage/editPage',
            state: {
                id: record.id
            }
        }))
    }
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
    return <div>
        <div className="customerManage">
            <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack} />
            <DxLoadingShadow visible={loadingShadow} />
            <div className="searchBar">
                <Form onSubmit={handleSubmit}>
                    <Row>
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
                        <Col span={5}>
                            <FormItem label="需求方式"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                            >
                                {getFieldDecorator('intentionType', {
                                    rules: [{ required: false, message: '请选择需求方式' }],
                                })(
                                    <Select placeholder="请选择需求方式">
                                        <Option value="求购">求购</Option>
                                        <Option value="求租">求租</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={5}>
                            <FormItem label="关键字"
                                labelCol={{ span: 5 }}
                                wrapperCol={{ span: 19 }}
                            >
                                {getFieldDecorator('keyword', {
                                    rules: [{ required: false, message: '请选择需求方式' }],
                                })(
                                    <Input placeholder="搜索客户名称" className="searchName" size='large' />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={4}>
                            <Row>
                                <Col span={10}>
                                    <Button type='primary' htmlType="submit" size='large'>查询</Button>
                                </Col>
                                <Col span={10}>
                                    <Button type='reset' size='large'
                                        onClick={() => {
                                            form.resetFields();
                                            dispatch({
                                                type: "customerManage/getAllCustomerList",
                                                payload: {
                                                    pageNo: 0,
                                                    pageSize: commonFinalCode.pageSize
                                                }
                                            })
                                        }}
                                    >重置</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div className="container">
                {
                    isBroker ? <Row style={{ "padding": "10px", "marginTop": "10px" }}>
                        <Col span={24}>
                            <Button size='large' type="primary" onClick={addCustomer} icon="plus">新增客户</Button>
                        </Col>
                    </Row> : null
                }
                <Table
                    loading={false}
                    dataSource={customerList.content}
                    columns={columns}
                    pagination={paginationCustomerList}
                    style={{ "padding": "0 5px" }}
                >

                </Table>
            </div>
        </div>
    </div>
}

function mapStateToProps({ customerManage }) {
    return { customerManage }
}

export default connect(mapStateToProps)(Form.create({})(customerManage));