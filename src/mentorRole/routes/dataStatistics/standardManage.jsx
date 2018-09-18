import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, DatePicker, Select, Row, Col, Input, Cascader, Radio, Button, Alert, message, Tabs, Table, Spin, Modal, Checkbox } from 'antd'
import Panel from '../../../commons/components/Panel'
import DxPanel from '../../../commons/components/DxPanel'
import './standardManage.css'
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


function standardManage({ dispatch, form, standardManage }) {
    const { getFieldDecorator } = form;
    const {
        modalConfig,
        programmeList,
        promptObj,
        loadingShadow,
    } = standardManage;

    //点击修改方案
    const createNewProgramme = () => {
        dispatch(routerRedux.push({
            pathname: '/dataStatistics/standardHome/standardCreate',
        }))
    }
    const modalClose = () => {
        dispatch({
            type: "standardManage/setState",
            payload: {
                modalConfig: {
                    visible: false
                }
            }
        })
    }
    // 确认删除的弹出层
    let openCity = () => {
        confirm({
            title: '确认删除吗?',
            // content: 'When clicked the OK button, this dialog will be closed after 1 second',
            onOk() {

            },
            onCancel() { },
        });
    };
    //表单提交事件
    const handleSubmit = () => {

    }
    //分页
    const pageController = {
        showQuickJumper: commonFinalCode.showQuickJumper,
        pageSize: programmeList.pageSize,
        current: programmeList.current,
        defaultCurrent: 1,
        total: programmeList.total,
        showTotal: total => `共${total}条数据`,
        onChange: (page, pageSize) => {
            form.validateFields((err, values) => {
                if (!err) {
                }
            })
        },
    };
    const handleEdit = () => {

    }
    const handleDelete = () => {

    }
    // 列字段名
    const columns = [{
        title: '序号',
        dataIndex: 'indexXh',
        render: (text, record, index) => {
            return <div className="operation">
                <span onClick={() => handleEdit(text, record, index)} className="edit"></span>
                <span onClick={() => handleDelete(text, record, index)} className="delete"></span>
            </div>
        }
    }];
    const onOkCallBack = () => {
        if (promptObj.todo === 'closeModal') {
            dispatch({
                type: "standardManage/togglePrompt",
                payload: {
                    visible: false
                }
            })
        }
        if (promptObj.todo === 'closeModalAndWritePass') {
            dispatch({
                type: "standardManage/togglePrompt",
                payload: {
                    visible: false
                }
            })
            dispatch({
                type: "standardManage/changeVisible",
                payload: {
                    tudiGongVisible: true,
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
                <div className="standardManage">
                    <div className="currentProgramme">
                        <Button onClick={createNewProgramme} icon="plus" type="primary">新增方案</Button>
                    </div>
                    <div className="standardTable">
                        <Table
                            dataSource={pageController.content}
                            columns={columns}
                            pagination={pageController}
                        >

                        </Table>
                    </div>
                </div>
            </Form>
                :
                <div className="mentorDataLoading">
                    <Spin />
                </div>
        }
    </div>
}

function mapStateToProps({ standardManage }) {
    return { standardManage }
}

export default connect(mapStateToProps)(Form.create({})(standardManage));