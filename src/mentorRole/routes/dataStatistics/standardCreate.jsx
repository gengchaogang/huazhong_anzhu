import React from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Input, Button, message, Spin, } from 'antd'
import Panel from '../../../commons/components/Panel'
import './standardCreate.css'
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow';
import PromptModal from '../../../commons/View/PromptModal';

const FormItem = Form.Item;



function standardCreate({ dispatch, form, standardCreate }) {
    const { getFieldDecorator } = form;
    const {
        record,
        promptObj,
        loadingShadow,
    } = standardCreate;

    //表单提交事件
    const handleSubmit = (e) => {
        e.preventDefault();
        form.validateFields((err, values) => {
            if (!err) {
                let canSubmit = false;
                for (const key in values) {
                    if (values.hasOwnProperty(key)) {
                        if (key === "assessName") {
                            continue;
                        } else if (values[key] === null || values[key] === "") {
                            continue;
                        } else if (values[key] !== null && values[key] !== "") {
                            canSubmit = true;
                            break;
                        }
                    }
                }
                if (canSubmit) {
                    if (record !== null) {
                        dispatch({
                            type: 'standardCreate/editProgramme',
                            payload: {
                                id: record.id,
                                ...values
                            }
                        })
                    } else {
                        dispatch({
                            type: 'standardCreate/addProgramme',
                            payload: values
                        })
                    }
                } else {
                    message.error("请至少填写一条考核数据！");
                }
            }
        })
    }

    const onOkCallBack = () => {
        if (promptObj.todo === 'closeModal') {
            dispatch({
                type: "standardCreate/togglePrompt",
                payload: {
                    visible: false
                }
            })
        }
        if (promptObj.todo === 'closeModalAndWritePass') {
            dispatch({
                type: "standardCreate/togglePrompt",
                payload: {
                    visible: false
                }
            })
        }
    }
    const onCancelCallBack = () => { }
    return <div>
        {
            true ? <Form onSubmit={handleSubmit}>
                <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack} />
                <DxLoadingShadow visible={loadingShadow} />
                <div className="standardCreate">
                    <Row>
                        <Col span={24} style={{ "backgroundColor": "#fff", "marginBottom": "10px", "padding": "5px 15px" }}>
                            <FormItem label="方案名称" labelCol={{ span: 2 }} wrapperCol={{ span: 6 }} style={{ "marginBottom": "0" }}>
                                {getFieldDecorator('assessName', {
                                    rules: [{ required: true, message: '请填写方案名称' }],
                                    initialValue: record ? record.assessName : null
                                })(
                                    <Input placeholder="" size="default" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <Panel title="资源考核"></Panel>
                            <div className="content">
                                <Row>
                                    <Col span={12} offset={0} className="formItem">
                                        <FormItem label="二手房出售新增" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                                            {getFieldDecorator('resourcesFouseSell', {
                                                rules: [{ required: false, message: '' }],
                                                initialValue: record ? record.resourcesFouseSell : null
                                            })(
                                                <Input addonAfter="套" placeholder="" size="default" />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} offset={0} className="formItem">
                                        <FormItem label="二手房出租新增" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                                            {getFieldDecorator('resourcesFouseLease', {
                                                rules: [{ required: false, message: '' }],
                                                initialValue: record ? record.resourcesFouseLease : null
                                            })(
                                                <Input addonAfter="套" placeholder="" size="default" />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} offset={0} className="formItem">
                                        <FormItem label="求购客户新增" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                                            {getFieldDecorator('resourcesCustomerSell', {
                                                rules: [{ required: false, message: '' }],
                                                initialValue: record ? record.resourcesCustomerSell : null
                                            })(
                                                <Input addonAfter="套" placeholder="" size="default" />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} offset={0} className="formItem">
                                        <FormItem label="求租客户新增" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                                            {getFieldDecorator('resourcesCustomerLease', {
                                                rules: [{ required: false, message: '' }],
                                                initialValue: record ? record.resourcesCustomerLease : null
                                            })(
                                                <Input addonAfter="套" placeholder="" size="default" />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} offset={0} className="formItem">
                                        <FormItem label="委托房源数" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                                            {getFieldDecorator('resourcesFouseEntrust', {
                                                rules: [{ required: false, message: '' }],
                                                initialValue: record ? record.resourcesFouseEntrust : null
                                            })(
                                                <Input addonAfter="套" placeholder="" size="default" />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} offset={0} className="formItem">
                                        <FormItem label="钥匙房源数" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                                            {getFieldDecorator('resourcesFouseKey', {
                                                rules: [{ required: false, message: '' }],
                                                initialValue: record ? record.resourcesFouseKey : null
                                            })(
                                                <Input addonAfter="套" placeholder="" size="default" />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Panel title="跟进考核"></Panel>
                            <div className="content">
                                <Row>
                                    <Col span={12} offset={0} className="formItem">
                                        <FormItem label="二手房出售跟进" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                                            {getFieldDecorator('traceFouseSell', {
                                                rules: [{ required: false, message: '' }],
                                                initialValue: record ? record.traceFouseSell : null
                                            })(
                                                <Input addonAfter="套" placeholder="" size="default" />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} offset={0} className="formItem">
                                        <FormItem label="二手房出租跟进" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                                            {getFieldDecorator('traceFouseLease', {
                                                rules: [{ required: false, message: '' }],
                                                initialValue: record ? record.traceFouseLease : null
                                            })(
                                                <Input addonAfter="套" placeholder="" size="default" />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} offset={0} className="formItem">
                                        <FormItem label="求购客户跟进" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                                            {getFieldDecorator('traceCustomerSell', {
                                                rules: [{ required: false, message: '' }],
                                                initialValue: record ? record.traceCustomerSell : null
                                            })(
                                                <Input addonAfter="套" placeholder="" size="default" />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} offset={0} className="formItem">
                                        <FormItem label="求租客户跟进" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                                            {getFieldDecorator('traceCustomerLease', {
                                                rules: [{ required: false, message: '' }],
                                                initialValue: record ? record.traceCustomerLease : null
                                            })(
                                                <Input addonAfter="套" placeholder="" size="default" />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} offset={0} className="formItem">
                                        <FormItem label="新房跟进" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                                            {getFieldDecorator('traceHouse', {
                                                rules: [{ required: false, message: '' }],
                                                initialValue: record ? record.traceHouse : null
                                            })(
                                                <Input addonAfter="套" placeholder="" size="default" />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} offset={0} className="formItem">
                                        <FormItem label="实勘跟进" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                                            {getFieldDecorator('traceHouseFact', {
                                                rules: [{ required: false, message: '' }],
                                                initialValue: record ? record.traceHouseFact : null
                                            })(
                                                <Input addonAfter="套" placeholder="" size="default" />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Panel title="带看考核"></Panel>
                            <div className="content">
                                <Row>
                                    <Col span={12} offset={0} className="formItem">
                                        <FormItem label="二手房出售带看" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                                            {getFieldDecorator('lookHouseSell', {
                                                rules: [{ required: false, message: '' }],
                                                initialValue: record ? record.lookHouseSell : null
                                            })(
                                                <Input addonAfter="套" placeholder="" size="default" />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} offset={0} className="formItem">
                                        <FormItem label="二手房出租带看" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                                            {getFieldDecorator('lookHouseLease', {
                                                rules: [{ required: false, message: '' }],
                                                initialValue: record ? record.lookHouseLease : null
                                            })(
                                                <Input addonAfter="套" placeholder="" size="default" />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} offset={0} className="formItem">
                                        <FormItem label="新房带看" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                                            {getFieldDecorator('lookNewHouseSell', {
                                                rules: [{ required: false, message: '' }],
                                                initialValue: record ? record.lookNewHouseSell : null
                                            })(
                                                <Input addonAfter="套" placeholder="" size="default" />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Panel title="成交考核"></Panel>
                            <div className="content">
                                <Row>
                                    <Col span={12} offset={0} className="formItem">
                                        <FormItem label="二手房出售成交" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                                            {getFieldDecorator('assessHouseSell', {
                                                rules: [{ required: false, message: '' }],
                                                initialValue: record ? record.assessHouseSell : null
                                            })(
                                                <Input addonAfter="套" placeholder="" size="default" />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} offset={0} className="formItem">
                                        <FormItem label="二手房出租成交" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                                            {getFieldDecorator('assessHouseLease', {
                                                rules: [{ required: false, message: '' }],
                                                initialValue: record ? record.assessHouseLease : null
                                            })(
                                                <Input addonAfter="套" placeholder="" size="default" />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12} offset={0} className="formItem">
                                        <FormItem label="新房成交" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                                            {getFieldDecorator('assessNewHouseSell', {
                                                rules: [{ required: false, message: '' }],
                                                initialValue: record ? record.assessNewHouseSell : null
                                            })(
                                                <Input addonAfter="套" placeholder="" size="default" />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ "backgroundColor": "#fff", "padding": "5px" }}>
                        <Col span={24}>
                            <Button size="default" type="primary" style={{ "fontSize": "12px" }} htmlType="submit">确认提交</Button>
                        </Col>
                    </Row>
                </div>
            </Form>
                :
                <div className="mentorDataLoading">
                    <Spin />
                </div>
        }
    </div>
}

function mapStateToProps({ standardCreate }) {
    return { standardCreate }
}

export default connect(mapStateToProps)(Form.create({})(standardCreate));