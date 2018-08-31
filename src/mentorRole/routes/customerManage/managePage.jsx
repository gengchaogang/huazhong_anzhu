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
        customerList,
        followModal,
        bringModal
    } = managePage;
    //对话框的关闭操作
    const onOkCallBack = () => {

    }
    const onCancelCallBack = (event) => {
        event.preventDefault();
    }
    //表单提交
    const handleSubmit = () => {

    }
    //添加客户
    const addCustomer = () => {

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
            dataIndex: 'want',
        }, {
            title: '创建时间',
            dataIndex: 'createDate',
        },
    ]
    //跟进和带看的modal等方法
    const bringCustomer = () => {

    }
    const followCustomer = () => {
        dispatch({
            type: "managePage/setState",
            payload: {
                followModal: {
                    visible: true
                }
            }
        })
    }
    const followModalClose = () => {
        dispatch({
            type: "managePage/setState",
            payload: {
                followModal: {
                    visible: false
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
    const showCommunityData = (data) => {//显示联想结果
        if (data.length) {
            return data.map((item, index) => {
                return (<Option key={item.id} value={item.name}>{item.name}</Option>)
            })
        }
    }
    const handleFollowType = () => {

    }
    //tab切换事件
    const onTabsChange = (key) => {
        dispatch({
            type: "managePage/setState",
            payload: {
                currentTab: key
            }
        })
    }
    return <div>
        <div className="managePage">
            <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack} />
            <DxLoadingShadow visible={loadingShadow} />
            <Panel title={"客户管理"} />
            <div className="header">
                <div className="customerDetail">
                    陈一发（先生）<span className="wantSell">求购</span><span className="wantRent">求租</span>
                </div>
                <div className="customerController">
                    客户电话：17692349163
                    <Button style={{ "fontSize": "12px" }} type="primary" onClick={bringCustomer} icon="plus">客户带看</Button>
                    <Button style={{ "fontSize": "12px" }} type="primary" onClick={followCustomer} icon="plus">客户跟进</Button>
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
                                        rules: [{ required: false, message: '请选择需求方式' }],
                                    })(
                                        <Input placeholder="搜索客户名称" className="searchName" size='large' />
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
                                        <Button type='reset' htmlType="submit" size='large'>重置</Button>
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
                                            {getFieldDecorator('wantHouse', {
                                                rules: [{ required: true, message: '请选择客户意向房源' }],
                                            })(
                                                <Select
                                                    onChange={handleKeywordChange}
                                                    mode="combobox"
                                                    optionFilterProp="children"
                                                    optionLabelProp="children"
                                                    onSelect={handleSelect}
                                                    onBlur={handleSelectBlur}
                                                    placeholder='请选择或输入小区名称!'
                                                >
                                                    {showCommunityData([])}
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem label="选择跟进方式" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                            {getFieldDecorator('followType', {
                                                rules: [{ required: true, message: '请选择跟进方式' }],
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
                                            {getFieldDecorator('followType', {
                                                rules: [{ required: true, message: '请填写跟进内容' }],
                                            })(
                                                <Input type="textarea" rows={4} placeholder='请填写跟进内容！' />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={3} offset={16}>
                                        <Button type='primary' htmlType="submit" style={{ "fontSize": "12px" }}>保存</Button>
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
                                dataSource={customerList.content}
                                columns={columns}
                                pagination={paginationCustomerList}
                            >

                            </Table>
                        </TabPane>
                        <TabPane
                            tab="客户带看"
                            key="bringCustomerTab"
                        >
                            <Table
                                loading={false}
                                dataSource={customerList.content}
                                columns={columns}
                                pagination={paginationCustomerList}
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