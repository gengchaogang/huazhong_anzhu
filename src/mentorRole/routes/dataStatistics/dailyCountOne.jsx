import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, DatePicker, Row, Col, Button, Tabs, Table, } from 'antd'
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow';
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';
import PromptModal from '../../../commons/View/PromptModal';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
/***************************************************************/
/**************************************************************/
/**********  二手房出售：已发布，未指派经纪人、已下架、已售 *******/
/*************************************************************/
/*************************************************************/

const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};

function dailyCountOne({ form, dispatch, dailyCountOne }) {
    const {
        activeKey,
        tableLoading,
        pageListResources,
        pageListDeal,
        pageListBeltLook,
        pageListFollowUp,
        loadingShadow,
        promptObj,
        record,
    } = dailyCountOne;
    const { getFieldDecorator } = form;
    //  资源数据分页
    const pageResources = {
        showQuickJumper: commonFinalCode.showQuickJumper,
        pageSize: pageListResources.pageSize,
        current: pageListResources.current,
        defaultCurrent: 1,
        total: pageListResources.total,
        showTotal: total => `共${total}条数据`,
        onChange: (page, pageSize) => {
            form.validateFields((err, values) => {
                if (!err) {
                    dispatch({
                        type: 'dailyCountOne/pageListResources',
                        payload: {
                            pageNo: page - 1,
                            pageSize: pageListResources.pageSize,
                            keyword: dailyCountOne.keyword,
                        }
                    })
                }
            });
        },
    };
    //  成交数据分页
    const pageDeal = {
        showQuickJumper: commonFinalCode.showQuickJumper,
        pageSize: pageListDeal.pageSize,
        current: pageListDeal.current,
        defaultCurrent: 1,
        total: pageListDeal.total,
        showTotal: total => `共${total}条数据`,
        onChange: (page, pageSize) => {
            form.validateFields((err, values) => {
                if (!err) {
                    dispatch({
                        type: 'dailyCountOne/pageListDeal',
                        payload: {
                            pageNo: page - 1,
                            pageSize: pageListDeal.pageSize,
                            keyword: dailyCountOne.keyword,
                        }
                    })
                }
            });
        },
    };

    const columnsResources = [{
        title: '经纪人',
        dataIndex: 'teamName',
    }, {
        title: '二手房出售新增',
        dataIndex: 'one',
    }, {
        title: '二手房出租新增',
        dataIndex: 'two',
    }, {
        title: '委托房源总数',
        dataIndex: 'three',
    }, {
        title: '钥匙房总数',
        dataIndex: 'four',
    }, {
        title: '求租客户新增',
        dataIndex: 'five',
    }, {
        title: '求购客户新增',
        dataIndex: 'six',
    }];
    const columnsDeal = [{
        title: '经纪人',
        dataIndex: 'teamName',
    }, {
        title: '二手房出售成交',
        dataIndex: 'one',
    }, {
        title: '二手房出租成交',
        dataIndex: 'two',
    }];
    const columnsBeltLook = [{
        title: '经纪人',
        dataIndex: 'teamName',
    }, {
        title: '二手房出售带看',
        dataIndex: 'one',
    }, {
        title: '二手房出租带看',
        dataIndex: 'two',
    }, {
        title: '新房带看',
        dataIndex: 'three',
    }];
    const columnsFollowUp = [{
        title: '经纪人',
        dataIndex: 'teamName',
    }, {
        title: '二手房出售跟进',
        dataIndex: 'one',
    }, {
        title: '二手房出租跟进',
        dataIndex: 'two',
    }, {
        title: '客户求购跟进',
        dataIndex: 'three',
    }, {
        title: '客户求租跟进',
        dataIndex: 'four',
    }, {
        title: '房源实勘',
        dataIndex: 'five',
    }, {
        title: '新房跟进',
        dataIndex: 'six',
    }];
    //选择时间
    const changeTime = (date, dateString) => {

    }
    const onTabsChange = (key) => {
        form.resetFields();
        dispatch({
            type: "dailyCountOne/setState",
            payload: {
                activeKey: key,
            }
        });
        dispatch({
            type: 'dailyCountOne/loadList',
            payload: {
                keyWord: key,
                startTime: null,
                endTime: null,
            }
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        form.validateFields((err, values) => {
            if (!err) {
                const payload = {};
                if (values.dateTimePicker && values.dateTimePicker.length > 0) {
                    payload.startTime = new Date(values.dateTimePicker[0]._d).format('yyyy-MM-dd hh:mm:ss');
                    payload.endTime = new Date(values.dateTimePicker[1]._d).format('yyyy-MM-dd hh:mm:ss');
                }
                payload.keyWord = activeKey;
                dispatch({
                    type: 'dailyCountOne/loadList',
                    payload: payload
                })
            }
        });
    }
    const onOkCallBack = () => {
        if (promptObj.todo === 'closeModal') {
            dispatch({
                type: "dailyCountOne/togglePrompt",
                payload: {
                    visible: false
                }
            })
        }
        if (promptObj.todo === 'closeModalAndWritePass') {
            dispatch({
                type: "dailyCountOne/togglePrompt",
                payload: {
                    visible: false
                }
            })
            dispatch({
                type: "dailyCountOne/changeVisible",
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
    return (
        <div className="mentorRole-houseSell">
            <div>
                <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack} />
                <DxLoadingShadow visible={loadingShadow} />
                <div className="searchBar">
                    <Form onSubmit={handleSubmit}>
                        <Row gutter={16}>
                            <Col span={7}>
                                <FormItem
                                    {...formItemLayout}
                                    label="时间"
                                >
                                    {getFieldDecorator('dateTimePicker', {
                                        rules: [{ required: false, message: 'Please select time!' }],
                                    })(
                                        <RangePicker showTime format={"YYYY-MM-DD"} onChange={changeTime} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={7}>
                                <Row gutter={8}>
                                    <Col span={6}>
                                        <Button type='primary' htmlType="submit" size='large'>查询</Button>
                                    </Col>
                                    <Col span={6}>
                                        <Button type='reset'
                                            onClick={
                                                () => {
                                                    form.resetFields()
                                                    dispatch({
                                                        type: "dailyCountOne/loadList",
                                                        payload: {
                                                            keyWord: activeKey
                                                        }
                                                    })
                                                }
                                            }
                                            size='large'>重置</Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className="mentorTabs">
                    <Tabs
                        activeKey={activeKey}
                        onChange={onTabsChange}
                        type="card"
                        className="tabs"
                        animated={false}
                    >
                        <TabPane tab="资源数据" key="pageResources">
                            <Table
                                loading={tableLoading}
                                dataSource={pageListResources.resource}
                                columns={columnsResources}
                                pagination={false}
                            />
                        </TabPane>
                        <TabPane tab="成交数据" key="pageDeal">
                            <Table
                                loading={tableLoading}
                                dataSource={pageListDeal.resource}
                                columns={columnsDeal}
                                pagination={false}
                            />
                        </TabPane>
                        <TabPane tab="带看数据" key="pageBeltLook">
                            <Table
                                loading={tableLoading}
                                dataSource={pageListBeltLook.resource}
                                columns={columnsBeltLook}
                                pagination={false}
                            />
                        </TabPane>
                        <TabPane tab="跟进数据" key="pageFollowUp">
                            <Table
                                loading={tableLoading}
                                dataSource={pageListFollowUp.resource}
                                columns={columnsFollowUp}
                                pagination={false}
                            />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

function mapStateToProps({ dailyCountOne }) {
    return { dailyCountOne }
}
export default connect(mapStateToProps)(Form.create({})(dailyCountOne));
