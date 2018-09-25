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
        currentProgramme,
        programmeList,//所有方案下拉
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
        form.resetFields();
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
    const handleSubmit = (e) => {
        e.preventDefault();
        form.validateFields((err, values) => {
            if (!err) {
                dispatch({
                    type: 'standardHome/changeCurrentPro',
                    payload: {
                        id: values.checkProgramme,
                    }
                })
                dispatch({
                    type: "standardHome/setState",
                    payload: {
                        modalConfig: {
                            visible: false
                        }
                    }
                })
                form.resetFields();
            }
        });
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
                        当前已选方案：<span style={{ "fontWeight": "bold", "display": "inlineBlock", "margin": "0 8px" }}>{currentProgramme !== null ? currentProgramme.assessName : "无"}</span> <Button size="small" type="primary" onClick={changeProgramme} style={{ "fontSize": "12px" }}>修改方案</Button>
                        <Button size="small" type="primary" style={{ "fontSize": "12px", "float": "right" }} onClick={goManage}>达标线方案管理</Button>
                    </div>
                    {
                        currentProgramme !== null ? <div className="currentProContent">
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
                                        {currentProgramme.resourcesFouseSell}
                                    </div>
                                </Col>
                                <Col span={3}>
                                    <div className="top">
                                        二手房出租新增
                            </div>
                                    <div className="bottom">
                                        {currentProgramme.resourcesFouseLease}
                                    </div>
                                </Col>
                                <Col span={3}>
                                    <div className="top">
                                        求购客户新增
                            </div>
                                    <div className="bottom">
                                        {currentProgramme.resourcesCustomerSell}
                                    </div>
                                </Col>
                                <Col span={3}>
                                    <div className="top">
                                        求租客户新增
                            </div>
                                    <div className="bottom">
                                        {currentProgramme.resourcesCustomerLease}
                                    </div>
                                </Col>
                                <Col span={3}>
                                    <div className="top">
                                        委托房源数
                            </div>
                                    <div className="bottom">
                                        {currentProgramme.resourcesFouseEntrust}
                                    </div>
                                </Col>
                                <Col span={3}>
                                    <div className="top">
                                        钥匙房源数
                            </div>
                                    <div className="bottom">
                                        {currentProgramme.resourcesFouseKey}
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
                                        考核标准
                                </div>
                                    <div className="bottom">
                                        跟进考核
                            </div>
                                </Col>
                                <Col span={3}>
                                    <div className="top">
                                        二手房出售跟进
                                </div>
                                    <div className="bottom">
                                        {currentProgramme.traceFouseSell}
                                    </div>
                                </Col>
                                <Col span={3}>
                                    <div className="top">
                                        二手房出租跟进
                            </div>
                                    <div className="bottom">
                                        {currentProgramme.traceFouseLease}
                                    </div>
                                </Col>
                                <Col span={3}>
                                    <div className="top">
                                        求购客户跟进
                            </div>
                                    <div className="bottom">
                                        {currentProgramme.traceCustomerSell}
                                    </div>
                                </Col>
                                <Col span={3}>
                                    <div className="top">
                                        求租客户跟进
                            </div>
                                    <div className="bottom">
                                        {currentProgramme.traceCustomerLease}
                                    </div>
                                </Col>
                                <Col span={3}>
                                    <div className="top">
                                        新房跟进
                            </div>
                                    <div className="bottom">
                                        {currentProgramme.traceHouse}
                                    </div>
                                </Col>
                                <Col span={3}>
                                    <div className="top">
                                        实勘跟进
                            </div>
                                    <div className="bottom">
                                        {currentProgramme.traceHouseFact}
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
                                        考核标准
                                </div>
                                    <div className="bottom">
                                        带看考核
                            </div>
                                </Col>
                                <Col span={3}>
                                    <div className="top">
                                        二手房出售带看
                                </div>
                                    <div className="bottom">
                                        {currentProgramme.lookHouseSell}
                                    </div>
                                </Col>
                                <Col span={3}>
                                    <div className="top">
                                        二手房出租带看
                                    </div>
                                    <div className="bottom">
                                        {currentProgramme.lookHouseLease}
                                    </div>
                                </Col>
                                <Col span={3}>
                                    <div className="top">
                                        新房带看
                                </div>
                                    <div className="bottom">
                                        {currentProgramme.lookNewHouseSell}
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
                                        考核标准
                                </div>
                                    <div className="bottom">
                                        成交考核
                            </div>
                                </Col>
                                <Col span={3}>
                                    <div className="top">
                                        二手房出售成交
                                </div>
                                    <div className="bottom">
                                        {currentProgramme.assessHouseSell}
                                    </div>
                                </Col>
                                <Col span={3}>
                                    <div className="top">
                                        二手房出租成交
                            </div>
                                    <div className="bottom">
                                        {currentProgramme.assessHouseLease}
                                    </div>
                                </Col>
                                <Col span={3}>
                                    <div className="top">
                                        新房成交
                                </div>
                                    <div className="bottom">
                                        {currentProgramme.assessNewHouseSell}
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
                        </div> : <div className="noCurrentPro">
                                ----------- 暂未选择当前方案 -----------
                    </div>
                    }
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
                                                {
                                                    programmeList.content.map(item => {
                                                        return <Option key={item.id} value={item.id + ''} disabled={item.id === currentProgramme ? currentProgramme.id : false}>{item.assessName}</Option>
                                                    })
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={3} offset={16}>
                                    <Button type='primary' onClick={handleSubmit} style={{ "fontSize": "12px" }}>保存</Button>
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