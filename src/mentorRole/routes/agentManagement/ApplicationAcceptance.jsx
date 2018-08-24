import React from 'react'
import { connect } from 'dva'
import { Table, Button, Modal, Select, Row, Col, Form, Checkbox, Steps, Tabs } from 'antd'
import img from '../../assets/images/morentouinfg.png';
import PromptModal from '../../../commons/View/PromptModal'
import DxPanel from '../../../commons/components/DxPanel'
import './applicationAcceptance.css'
const Option = Select.Option;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 12 },
};
function ApplicationAcceptance({ dispatch, applicationAcceptance, form }) {
  const { getFieldDecorator } = form
  const {
    activeKey,
    record,
    teamData,
    chooseGroupsModa,
    pageInfo,
    tableLoading,
    promptObj,
    isEmployee,
  } = applicationAcceptance;
  const columns = [
    {
      title: "头像",
      render: (text, record, index) => {
        let url = img;
        if (record.logo) {
          url = record.logo;
        }
        return (<img src={url} width='50px' />)
      }
    },
    {
      title: '姓名',
      dataIndex: 'name'
    },
    {
      title: '手机号码',
      dataIndex: 'phoneNumber'
    },
    {
      title: "申请时间",
      dataIndex: "createDateTime"
    }, {
      title: "操作",
      render: (text, record, index) => {
        return (
          <div className="button">
            <Button type="primary" onClick={() => accept(record)}>接受</Button>
            <Button type="ghost" onClick={() => refuse(record)}>拒绝</Button>
          </div>
        )
      }
    }
  ]
  const paginationInfo = {
    pageSize: pageInfo.pageSize,
    current: pageInfo.current,
    defaultCurrent: 1,
    total: pageInfo.total,

    showTotal: total => `共${total}条数据`,
    onChange: (page) => {
      dispatch({
        type: 'applicationAcceptance/findBrokerApplyList',
        payload: {
          pageNo: page - 1,
          pageSize: pageInfo.pageSize,
        }
      })
    },
  };
  const paginationExitInfo = {
    pageSize: pageInfo.pageSize,
    current: pageInfo.current,
    defaultCurrent: 1,
    total: pageInfo.total,

    showTotal: total => `共${total}条数据`,
    onChange: (page) => {
      dispatch({
        type: 'applicationAcceptance/getBrokerExitApplyData',
        payload: {
          pageNo: page - 1,
          pageSize: pageInfo.pageSize,
        }
      })
    },
  };
  const accept = (record) => {
    if (activeKey === 'brokerApply') {
      dispatch({
        type: "applicationAcceptance/changeModal",
        payload: {
          chooseGroupsModa: true,
        }
      })
      dispatch({
        type: "applicationAcceptance/saveRecord",
        payload: {
          record: record
        }
      })
    } else {
      const confirm = Modal.confirm;
      confirm({
        title: '确定接受经纪人申请？',
        content: '点击“确定”按钮后, 将接受经纪人申请（' + record.name + '）。',
        onOk() {
          return new Promise((resolve, reject) => {
            dispatch({
              type: "applicationAcceptance/acceptBrokerExitApply",
              payload: {
                id: record.id,
                resolve: resolve,
              }
            });
          });
        },
        onCancel() { },
      });
    }
  }
  const refuse = (record) => {
    const confirm = Modal.confirm;
    confirm({
      title: '确定拒绝经纪人申请？',
      content: '点击“确定”按钮后, 将拒绝经纪人申请（' + record.name + '）。',
      onOk() {
        return new Promise((resolve, reject) => {
          dispatch({
            type: "applicationAcceptance/refuseBrokerApply",
            payload: {
              id: record.id,
              resolve: resolve,
            }
          });
        });
      },
      onCancel() { },
    });
  }

  const onModalCancel = () => {
    dispatch({
      type: "applicationAcceptance/changeModal",
      payload: {
        chooseGroupsModa: false
      }
    })
  }
  const handleSelectChange = (value) => {
  }

  const acceptSubmit = (e) => { //调整分组
    e.preventDefault();
    form.validateFieldsAndScroll(["teamSelect", 'isEmployee'], (err, values) => {
      if (!err) {
        dispatch({
          type: "applicationAcceptance/acceptBrokerApply",
          payload: {
            id: record.id,
            teamId: form.getFieldValue("teamSelect"),
            isEmployee: isEmployee,
          }
        });
      } else {
        return
      }
    });
  }

  const loopSelectOption = (data) => {
    return data.map((item) => {
      return <Option key={item.key} value={item.key} disabled={!item.notFull}>{item.title}</Option>;
    });
  }
  const onOkCallBack = () => {
    if (promptObj.todo === 'closeModal') {
      dispatch({
        type: "applicationAcceptance/togglePrompt",
        payload: {
          visible: false
        }
      });
    }
  }
  const onCancelCallBack = () => { }

  const onCheckboxChange = (e) => {
    if (e.target.checked === true) {
      dispatch({
        type: "applicationAcceptance/changeIsEmployee",
        payload: {
          isEmployee: true
        }
      })
    }
  }
  const isNotEmployee = (e) => {
    if (e.target.checked === true) {
      dispatch({
        type: "applicationAcceptance/changeIsEmployee",
        payload: {
          isEmployee: false
        }
      })
    }
  }
  const onTabsChange = (key) => {
    dispatch({
      type: "applicationAcceptance/changeTabsKey",
      payload: {
        activeKey: key
      }
    });
    if (key === "brokerExitApply") {
      dispatch({
        type: "applicationAcceptance/getBrokerExitApplyData",
        payload: {
          pageSize: 10,
          pageNo: 0,
        }
      })
    } else if (key === "brokerApply") {
      dispatch({
        type: "applicationAcceptance/getInitInfo",
        payload: {
          pageSize: 10,
          pageNo: 0,
        }
      })
    }
  }
  return (
    <div className="applicationAcceptance">
      <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack} />
      <Modal
        className="applicationAcceptance_modal"
        footer={false}
        visible={chooseGroupsModa}
        onCancel={onModalCancel}
      >
        <DxPanel title="选择团队">
          <Form onSubmit={acceptSubmit}>
            <FormItem label="经纪人" {...formItemLayout}>
              <Row>
                <Col span={12}><span>{!!record ? record.name : '读取数据失败请重新加载'}</span></Col>
                <Col span={12}><span>{!!record ? record.phoneNumber : '读取数据失败请重新加载'}</span></Col>
              </Row>
            </FormItem>
            <FormItem label="选择团队" {...formItemLayout}>
              {getFieldDecorator('teamSelect', {
                initialValue: "",
                rules: [{ required: true, message: '请选择团队!' }],
              })(
                <Select>
                  {loopSelectOption(teamData)}
                </Select>
              )}
            </FormItem>
            <FormItem label="是否为员工" {...formItemLayout}>
              {getFieldDecorator('isEmployee', {
                initialValue: isEmployee,
                rules: [{ required: false, message: '请选择是否为员工!' }],
              })(
                <div>
                  <Checkbox onChange={onCheckboxChange} checked={isEmployee === true ? true : false}>是</Checkbox>
                  <Checkbox onChange={isNotEmployee} checked={isEmployee === false ? true : false}>否</Checkbox>
                </div>
              )}
            </FormItem>
            <FormItem >
              <Button type="primary" htmlType="submit">完成</Button>
            </FormItem>
          </Form>
        </DxPanel>

      </Modal>
      <DxPanel title="申请受理">
        <Tabs
          activeKey={activeKey}
          onChange={onTabsChange}
          type="card"
          defaultActivKey="brokerApply"
          className="tabs"
          animated={false}
        >
          <TabPane tab="申请加入" key="brokerApply">
            <Table
              rowKey={record => record.id}
              loading={tableLoading}
              columns={columns}
              dataSource={pageInfo.content}
              pagination={paginationInfo} />
          </TabPane>
          <TabPane tab="申请退出" key="brokerExitApply">
            <Table
              rowKey={record => record.id}
              loading={tableLoading}
              columns={columns}
              dataSource={pageInfo.content}
              pagination={paginationExitInfo} />
          </TabPane>
        </Tabs>
      </DxPanel>
    </div>
  )
}
function mapStateToProps({ applicationAcceptance }) {
  return {
    applicationAcceptance
  }
}
export default connect(mapStateToProps)(Form.create({})(ApplicationAcceptance));
