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
        programmeList,
        promptObj,
        loadingShadow,
    } = standardManage;
    console.log(programmeList);
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
                    dispatch({
                        type: 'standardManage/getAssessList',
                        payload: {
                            pageNo: page - 1
                        }
                    })
                }
            })
        },
    };
    const handleEdit = () => {

    }
    const handleDelete = () => {

    }
    // 列字段名
    const columns = [
        {
            title: "方案名称",
            dataIndex: 'assessName',
        },
        {
            title: "资源指标",
            render: (text, record, index) => {
                let arr = [];
                record.resourcesFouseSell && arr.push({ name: "二手房出售新增", value: record.resourcesFouseSell });
                record.resourcesFouseLease && arr.push({ name: "二手房出租新增", value: record.resourcesFouseLease });
                record.resourcesCustomerSell && arr.push({ name: "求购客户新增", value: record.resourcesCustomerSell });
                record.resourcesCustomerLease && arr.push({ name: "求租客户新增", value: record.resourcesCustomerLease });
                record.resourcesFouseEntrust && arr.push({ name: "委托房源新增", value: record.resourcesFouseEntrust });
                record.resourcesFouseKey && arr.push({ name: "钥匙房源新增", value: record.resourcesFouseKey });
                return arr.map(item => {
                    return <p>{`${item.name}:${item.value}套`}</p>
                })
            }
        },
        {
            title: "跟进指标",
            render: (text, record, index) => {
                let arr = [];
                record.traceFouseSell && arr.push({ name: "二手房出售跟进", value: record.traceFouseSell });
                record.traceFouseLease && arr.push({ name: "二手房出租跟进", value: record.traceFouseLease });
                record.traceCustomerSell && arr.push({ name: "求购客户跟进", value: record.traceCustomerSell });
                record.traceCustomerLease && arr.push({ name: "求租客户跟进", value: record.traceCustomerLease });
                record.traceHouse && arr.push({ name: "新房跟进", value: record.traceHouse });
                record.traceHouseFact && arr.push({ name: "实勘跟进", value: record.traceHouseFact });
                return arr.map(item => {
                    return <p>{`${item.name}:${item.value}套`}</p>
                })
            }
        },
        {
            title: "带看指标",
            render: (text, record, index) => {
                let arr = [];
                record.lookHouseSell && arr.push({ name: "二手房出售带看", value: record.lookHouseSell });
                record.lookHouseLease && arr.push({ name: "二手房出租带看", value: record.lookHouseLease });
                record.lookNewHouseSell && arr.push({ name: "新房带看", value: record.lookNewHouseSell });
                return arr.map(item => {
                    return <p>{`${item.name}:${item.value}套`}</p>
                })
            }
        },
        {
            title: "成交指标",
            render: (text, record, index) => {
                let arr = [];
                record.assessHouseSell && arr.push({ name: "二手房出售成交", value: record.assessHouseSell });
                record.assessHouseLease && arr.push({ name: "二手房出租成交", value: record.assessHouseLease });
                record.assessNewHouseSell && arr.push({ name: "新房成交", value: record.assessNewHouseSell });
                return arr.map(item => {
                    return <p>{`${item.name}:${item.value}套`}</p>
                })
            }
        },
        {
            title: "时间",
            dataIndex: 'createTime',
            render: (text, record, index) => {
                return new Date(text).format('yyyy-MM-dd hh:mm:ss')
            }
        },
        {
            title: '操作',
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
                            dataSource={programmeList.content}
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