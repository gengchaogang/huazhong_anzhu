import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, DatePicker, Select, Row, Col, Input, Cascader, Radio, Button, Alert, message, Tabs, Table, Spin, Modal, Checkbox } from 'antd'
import Panel from '../../../commons/components/Panel'
import DxPanel from '../../../commons/components/DxPanel'
import './standardHome.css'
import labelsFinalCode from '../../../commons/utils/labelsFinalCode.js';
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow';
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';
import PromptModal from '../../../commons/View/PromptModal';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;


function standardHome({ dispatch, form, standardHome }) {
    const { getFieldDecorator } = form;
    const {
        modalConfig,
    } = standardHome;

    //点击修改方案
    const changeProgramme = () => {
        dispatch({
            type: "standardHome/setState",
            payload: {
                modalConfig: {
                    visible: true
                }
            }
        })
    }
    const modalClose = () => {
        dispatch({
            type: "standardHome/setState",
            payload: {
                modalConfig: {
                    visible: false
                }
            }
        })
    }
    //表单提交事件
    const handleSubmit = () => {

    }
    //点击管理  跳到达标线管理页面
    const goManage = () => {
        dispatch(routerRedux.push({
            pathname: '/dataStatistics/standardHome/standardManage',
        }))
    }
    return <div>
        {
            true ? <Form onSubmit={handleSubmit}>
                <div className="standardHome">
                    <div className="currentProgramme">
                        当前已选方案：<span style={{ "fontWeight": "bold", "display": "inlineBlock", "margin": "0 8px" }}>9月业绩考核目标</span> <Button size="small" type="primary" onClick={changeProgramme} style={{ "fontSize": "12px" }}>修改方案</Button>
                        <Button size="small" type="primary" style={{ "fontSize": "12px", "float": "right" }} onClick={goManage}>达标线方案管理</Button>
                    </div>
                    <div className="currentProContent">
                        <Row className="proLine">
                            <Col span={3}>
                                <div className="top">
                                    考核标准
                                </div>
                                <div className="bottom">
                                    资源考核
                            </div>
                            </Col>
                            <Col span={3}>
                                <div className="top">
                                    二手房出售新增
                                </div>
                                <div className="bottom">
                                    9
                                </div>
                            </Col>
                            <Col span={3}>
                                <div className="top">
                                    二手房出租新增
                            </div>
                                <div className="bottom">
                                    9
                            </div>
                            </Col>
                            <Col span={3}>
                                <div className="top">
                                    委托房源数
                            </div>
                                <div className="bottom">
                                    10
                            </div>
                            </Col>
                            <Col span={3}>
                                <div className="top">
                                    钥匙房源数
                            </div>
                                <div className="bottom">
                                    10
                            </div>
                            </Col>
                            <Col span={3}>
                                <div className="top">
                                    求购客户新增
                            </div>
                                <div className="bottom">
                                    10
                            </div>
                            </Col>
                            <Col span={3}>
                                <div className="top">
                                    求租客户新增
                            </div>
                                <div className="bottom">
                                    10
                            </div>
                            </Col>
                            <Col span={3}>
                                <div className="top">

                                </div>
                                <div className="bottom">

                                </div>
                            </Col>
                        </Row>
                        <Row className="proLine">
                            <Col span={3}>
                                <div className="top">

                                </div>
                                <div className="bottom">

                                </div>
                            </Col>
                            <Col span={3}>
                                <div className="top">

                                </div>
                                <div className="bottom">

                                </div>
                            </Col>
                            <Col span={3}>
                                <div className="top">

                                </div>
                                <div className="bottom">

                                </div>
                            </Col>
                            <Col span={3}>
                                <div className="top">

                                </div>
                                <div className="bottom">

                                </div>
                            </Col>
                            <Col span={3}>
                                <div className="top">

                                </div>
                                <div className="bottom">

                                </div>
                            </Col>
                            <Col span={3}>
                                <div className="top">

                                </div>
                                <div className="bottom">

                                </div>
                            </Col>
                            <Col span={3}>
                                <div className="top">

                                </div>
                                <div className="bottom">

                                </div>
                            </Col>
                            <Col span={3}>
                                <div className="top">

                                </div>
                                <div className="bottom">

                                </div>
                            </Col>
                        </Row>
                        <Row className="proLine">
                            <Col span={3}>
                                <div className="top">

                                </div>
                                <div className="bottom">

                                </div>
                            </Col>
                            <Col span={3}>
                                <div className="top">

                                </div>
                                <div className="bottom">

                                </div>
                            </Col>
                            <Col span={3}>
                                <div className="top">

                                </div>
                                <div className="bottom">

                                </div>
                            </Col>
                            <Col span={3}>
                                <div className="top">

                                </div>
                                <div className="bottom">

                                </div>
                            </Col>
                            <Col span={3}>
                                <div className="top">

                                </div>
                                <div className="bottom">

                                </div>
                            </Col>
                            <Col span={3}>
                                <div className="top">

                                </div>
                                <div className="bottom">

                                </div>
                            </Col>
                            <Col span={3}>
                                <div className="top">

                                </div>
                                <div className="bottom">

                                </div>
                            </Col>
                            <Col span={3}>
                                <div className="top">

                                </div>
                                <div className="bottom">

                                </div>
                            </Col>
                        </Row>
                        <Row className="proLine">
                            <Col span={3}>
                                <div className="top">

                                </div>
                                <div className="bottom">

                                </div>
                            </Col>
                            <Col span={3}>
                                <div className="top">

                                </div>
                                <div className="bottom">

                                </div>
                            </Col>
                            <Col span={3}>
                                <div className="top">

                                </div>
                                <div className="bottom">

                                </div>
                            </Col>
                            <Col span={3}>
                                <div className="top">

                                </div>
                                <div className="bottom">

                                </div>
                            </Col>
                            <Col span={3}>
                                <div className="top">

                                </div>
                                <div className="bottom">

                                </div>
                            </Col>
                            <Col span={3}>
                                <div className="top">

                                </div>
                                <div className="bottom">

                                </div>
                            </Col>
                            <Col span={3}>
                                <div className="top">

                                </div>
                                <div className="bottom">

                                </div>
                            </Col>
                            <Col span={3}>
                                <div className="top">

                                </div>
                                <div className="bottom">

                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="tips">
                        <p>方案说明</p>
                        <p>1、点击“设置达标线”按钮，可以阵对已有考核项，面向旗下所有经纪人进行达标线设置，设置完成后，进行方案命名并完成保存。</p>
                        <p>2、当前页面，每周日可进行下周7天执行方案的选择，周一到周六不可选择。</p>
                        <p>3、设置达标线可以对旗下经纪人的工作情况有效的进行线上管理，通过消息提醒，可以对未完成任务的经纪人进行及时提醒，系统督促工作进展。</p>
                        <p>4、通过达标线数据统计，可以按周和月查看，各门店每个经纪人的达标考核数据完成情况。</p>
                    </div>
                    {/* 经纪人详情弹窗  DxPanel公用组件 */}
                    <Modal
                        visible={modalConfig.visible}
                        footer={false}
                        onCancel={modalClose}
                    >
                        <DxPanel title="经纪人详情">
                            <Row>
                                <Col span={24}>
                                    <FormItem label="选择达标线方案" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                        {getFieldDecorator('checkProgramme', {
                                            rules: [{ required: true, message: '请选择跟进方式' }],
                                        })(
                                            <Select placeholder="请选择达标线方案">
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
                                <Col span={3} offset={16}>
                                    <Button type='primary' htmlType="submit" style={{ "fontSize": "12px" }}>保存</Button>
                                </Col>
                                <Col span={3} offset={2}>
                                    <Button
                                        onClick={modalClose}
                                        style={{ "fontSize": "12px" }}>取消</Button>
                                </Col>
                            </Row>
                        </DxPanel>
                    </Modal>
                </div>
            </Form>
                :
                <div className="mentorDataLoading">
                    <Spin />
                </div>
        }
    </div>
}

function mapStateToProps({ standardHome }) {
    return { standardHome }
}

export default connect(mapStateToProps)(Form.create({})(standardHome));