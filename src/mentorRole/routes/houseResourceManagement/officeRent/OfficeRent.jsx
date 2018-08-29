import React from 'react';
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import { Form, Input, Col, Row, Cascader, Select, Button, Tabs, Table, Modal, Spin, Radio } from 'antd'
import './officeRent.css'
import '../../../../commons/css/common.css';
import '../../../../commons/css/list.css';

import PromptModal from '../../../../commons/View/PromptModal';
import DxPanel from '../../../../commons/components/DxPanel'
import commonFinalCode from '../../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../../commons/utils/commonUtil.js';
import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow';
import labelsFinalCode from '../../../../commons/utils/labelsFinalCode.js';
import RadioGroup from 'antd/lib/radio/group';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};


/***************************************************************/
/**************************************************************/
/**********  写字楼出租：已发布，未指派经纪人、已下架、已售 *******/
/*************************************************************/
/*************************************************************/

function OfficeRent({ form, dispatch, mentorOfficeRent }) {
  const {
    pwd,
    tudiGongVisible,
    area,
    selectedRowRecord,
    selectedRowKeys,
    isBroker,
    activeKey,
    tableLoading,
    promptObj,
    loadingShadow,
    publishedHousePage,
    pausePage,//暂缓房源
    unassignedAgentPage,
    removedPage,
    soldPage,
    cooperationPage,
    eopOptions,
    labels,
    resourcesNumber,
    entrustModal,
    houseStateModal,
    optionss,
  } = mentorOfficeRent;

  //  已发布房源
  const paginationPublishedHouse = {
    showQuickJumper: commonFinalCode.showQuickJumper,
    pageSize: publishedHousePage.pageSize,
    current: publishedHousePage.current,
    defaultCurrent: 1,
    total: publishedHousePage.total,
    showTotal: total => `共${total}条数据`,
    onChange: (page, pageSize) => {
      dispatch({
        type: 'mentorOfficeRent/getNewHouseDealTableData',
        payload: {
          pageNo: page - 1,
          pageSize: publishedHousePage.pageSize,
          hasBroker: "是",
          houseState: '已发布',
          isCooperationSale: "关闭",
          isCurrentUser: "是",
          resourcesType: "写字楼",
          saleWay: "出租",
          keyword: mentorOfficeRent.resourcesNumber,
          fullPath: mentorOfficeRent.area,
        }
      })
    },
  };

  //  未指派经纪人
  const paginationUnassignedAgent = {
    showQuickJumper: commonFinalCode.showQuickJumper,
    pageSize: unassignedAgentPage.pageSize,
    current: unassignedAgentPage.current,
    defaultCurrent: 1,
    total: unassignedAgentPage.total,
    showTotal: total => `共${total}条数据`,
    onChange: (page, pageSize) => {
      dispatch({
        type: 'mentorOfficeRent/getNewHouseDealTableData',
        payload: {
          pageNo: page - 1,
          pageSize: unassignedAgentPage.pageSize,
          //              hasBroker:"否",
          isCurrentUser: "是",
          resourcesType: "写字楼",
          saleWay: "出租",
          keyword: mentorOfficeRent.resourcesNumber,
          fullPath: mentorOfficeRent.area,
        }
      })
    },
  };

  //  暂缓房源
  const paginationPause = {
    showQuickJumper: commonFinalCode.showQuickJumper,
    pageSize: pausePage.pageSize,
    current: pausePage.current,
    defaultCurrent: 1,
    total: pausePage.total,
    showTotal: total => `共${total}条数据`,
    onChange: (page, pageSize) => {
      dispatch({
        type: 'mentorOfficeRent/getPauseList',
        payload: {
          pageNo: page - 1,
          pageSize: pausePage.pageSize,
          //  hasBroker:"否",
          houseState: "暂缓",
          isCurrentUser: "是",
          resourcesType: "写字楼",
          saleWay: "出租",
          keyword: mentorOfficeRent.resourcesNumber,
          houseRoom: mentorOfficeRent.houseRoom,
          fullPath: mentorOfficeRent.area,
        }
      })
    },
  };

  //  已下架
  const paginationRemoved = {
    showQuickJumper: commonFinalCode.showQuickJumper,
    pageSize: removedPage.pageSize,
    current: removedPage.current,
    defaultCurrent: 1,
    total: removedPage.total,
    showTotal: total => `共${total}条数据`,
    onChange: (page, pageSize) => {
      dispatch({
        type: 'mentorOfficeRent/getNewHouseDealTableData',
        payload: {
          pageNo: page - 1,
          pageSize: removedPage.pageSize,
          houseState: '已下架',
          isCurrentUser: "是",
          resourcesType: "写字楼",
          saleWay: "出租",
          keyword: mentorOfficeRent.resourcesNumber,
          fullPath: mentorOfficeRent.area,
        }
      })
    },
  };

  //  已售
  const paginationSold = {
    showQuickJumper: commonFinalCode.showQuickJumper,
    pageSize: soldPage.pageSize,
    current: soldPage.current,
    defaultCurrent: 1,
    total: soldPage.total,
    showTotal: total => `共${total}条数据`,
    onChange: (page, pageSize) => {
      dispatch({
        type: 'mentorOfficeRent/getNewHouseDealTableData',
        payload: {
          pageNo: page - 1,
          pageSize: soldPage.pageSize,
          houseState: '已售',
          isCurrentUser: "是",
          resourcesType: "写字楼",
          saleWay: "出租",
          keyword: mentorOfficeRent.resourcesNumber,
          fullPath: mentorOfficeRent.area,
        }
      })
    },
  };
  //  合作速销
  const paginationCooperation = {
    showQuickJumper: commonFinalCode.showQuickJumper,
    pageSize: cooperationPage.pageSize,
    current: cooperationPage.current,
    defaultCurrent: 1,
    total: cooperationPage.total,
    showTotal: total => `共${total}条数据`,
    onChange: (page, pageSize) => {
      dispatch({
        type: 'mentorOfficeRent/getCooperationList',
        payload: {
          pageNo: page - 1,
          pageSize: cooperationPage.pageSize,
          hasBroker: "是",
          isCooperationSale: "开启",
          isCurrentUser: "是",
          resourcesType: "写字楼",
          saleWay: "出租",
          keyword: mentorOfficeRent.resourcesNumber,
          fullPath: mentorOfficeRent.area,
        }
      })
    },
  };
  const { getFieldDecorator } = form;
  const columns = [{
    title: '序号',
    dataIndex: 'indexXh',
  }, {
    title: '房源编号',
    dataIndex: 'resourcesNumber',
  }, {
    title: '城市',
    dataIndex: 'areaName',
    render: (text, record, index) => {
      var areaNameLet = text.split("/");
      areaNameLet = areaNameLet.filter(function (value) { return !!value; });
      return (<span>{areaNameLet.join("/")}</span>)
    },
  }, {
    title: '楼盘名称',
    dataIndex: 'communityName',
    render: (text, record, index) => {
      return (
        <span>
          <div title={text}>{text.length > 20 ? text.substr(0, 20) + '..' : text}</div>
        </span>
      )
    },
  }, {
    title: '楼层',
    dataIndex: 'storey',
    render: (text, record, index) => {
      return (
        <span>{text}/{record.totalFloors}</span>
      )
    }
  }, {
    title: '面积',
    dataIndex: 'floorArea',
    render: (text, record, index) => {
      return (
        <span>{text}㎡</span>
      )
    }
  }, {
    title: '租金',
    dataIndex: 'totlePriceShowName',
    render: (text, record, index) => {
      return (
        <span>{text}{record.uintPirce}</span>
      )
    }
  }, {
    title: '委托人',
    dataIndex: 'brokerName',
  }, {
    title: '状态',
    dataIndex: 'houseState',
  }, {
    title: '操作',
    render: (text, record, index) => {
      if (!!activeKey && activeKey === 'publishedHouse' || activeKey === 'cooperation') {
        return (
          <div className="operation">
            {!isBroker && <span onClick={() => checkeAgent(text, record, index)} className="searchIcon"></span>}
            <span onClick={() => handleEdit(text, record, index)} className="edit"></span>
            <span onClick={() => handleDelete(text, record, index)} className="delete"></span>
          </div>
        )
      } else if (activeKey === 'unassignedAgent') {
        return (
          <div className="operation">
            <span onClick={() => handleEdit(text, record, index)} className="edit"></span>
            <span onClick={() => handleEntrust(text, record, index)} className="entrust">委托</span>
            <span onClick={() => setHouseState(text, record, index)} className="setHouseState">设置状态</span>
          </div>
        )            //{!isBroker && <span onClick={()=>assignAgent(text,record,index)} className="assignedBroker"></span>}
      } else if (activeKey === 'removed') {
        return (
          <div className="operation">

            <span onClick={() => handleEdit(text, record, index)} className="edit"></span>
            <span onClick={() => handleDelete(text, record, index)} className="delete"></span>
          </div>
        )            //{!isBroker && <span onClick={()=>assignAgent(text,record,index)} className="assignedBroker"></span>}
      } else if (activeKey === 'sold') {
        return (
          <div className="operation">
            <i onClick={() => toBrokerDetail(text, record, index)} className="broker_check"></i>
            <span onClick={() => handleDelete(text, record, index)} className="delete"></span>
          </div>
        )
      } else if (activeKey === 'pause') {
        return (
          <div className="operation">
            <span onClick={() => handleEdit(text, record, index)} className="edit"></span>
            <span onClick={() => handleEntrust(text, record, index)} className="entrust">委托</span>
            <span onClick={() => setHouseState(text, record, index)} className="setHouseState">设置状态</span>
          </div>
        )
      } else {
        return;
      }
    }
  }];
  const toBrokerDetail = (text, record, index) => {
    dispatch(routerRedux.push({
      pathname: 'houseResourceRentManagement/officeRent/officeRentDetail',
      state: {
        id: record.key,
        transCode: record.transCode,
      }
    }))
  }
  const checkResource = (text, record, index) => {
    // dispatch(routerRedux.push({
    //   pathname:'/',
    //   state:{id:record.id}
    // }))
  }
  const checkeAgent = (text, record, index) => {
    dispatch(routerRedux.push({
      pathname: '/houseResourceRentManagement/directAssignAgent',
      state: {
        id: record.id
      }
    }))
  }
  const assignAgent = (text, record, index) => {
    dispatch(routerRedux.push({
      pathname: '/houseResourceRentManagement/directAssignAgent',
      state: {
        id: record.id
      }
    }))
  }

  // 编辑数据
  const handleEdit = (text, record, index) => {
    dispatch(routerRedux.push({
      pathname: '/houseResourceRentManagement/officeRent/createOfficeRentResource',
      state: {
        isUpdate: true,
        dataId: record['id'],
      }
    }))
  }

  const handleEntrust = (text, record, index) => {//委托
    dispatch({
      type: "mentorOfficeRent/setState",
      payload: {
        entrustModal: {
          visible: true,
          required: true
        },
        record: record
      }
    })
  }
  const setHouseState = (text, record, index) => {
    dispatch({
      type: "mentorOfficeRent/setState",
      payload: {
        houseStateModal: {
          visible: true,
          required: true
        },
        record: record
      }
    })
  }

  const handleDelete = (text, record, index) => {
    confirm({
      title: commonFinalCode.deleteConfirm_msg,
      onOk() {
        dispatch({
          type: "mentorOfficeRent/deleteHouse",
          payload: record,
        })
      },
      onCancel() { },
    });
  }
  const onSelectChange = (value, selectedOptions) => {
    let areaName = "";
    if (selectedOptions != null && selectedOptions.length > 0) {
      selectedOptions.map((item, index) => {
        areaName = areaName + "/" + item['label'];
      })
    }
    dispatch({
      type: "mentorOfficeRent/saveSearchArea",
      payload: {
        area: areaName
      }
    })
  }

  // 添加
  const createNewHouse = () => {  //todo
    dispatch(routerRedux.push({
      pathname: '/houseResourceRentManagement/officeRent/createOfficeRentResource',
      state: {
        eopOptions: eopOptions
      }
    }))
  }

  const onTabsChange = (key) => {
    form.resetFields();
    dispatch({
      type: "mentorOfficeRent/saveSelectedRowKeys",
      payload: {
        selectedRowKeys: []
      }
    })
    dispatch({
      type: "mentorOfficeRent/setState",
      payload: {
        activeKey: key,
        area: null
      }
    });
    dispatch({
      type: 'mentorOfficeRent/loadList',
      payload: {
        isReFresh: true
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        values.area = area;
        mentorOfficeRent.area = values.area;
        mentorOfficeRent.resourcesNumber = values.resourcesNumber;
        dispatch({
          type: "mentorOfficeRent/loadList",
          payload: {
            area: values.area,
            resourcesNumber: values.resourcesNumber,
          }
        })
      }
    });
  }

  const onOkCallBack = () => {
    if (promptObj.todo === 'closeModal') {
      dispatch({
        type: "mentorOfficeRent/togglePrompt",
        payload: {
          visible: false
        }
      })
    }
    if (promptObj.todo === 'closeModalAndWritePass') {
      dispatch({
        type: "mentorOfficeRent/togglePrompt",
        payload: {
          visible: false
        }
      })
      dispatch({
        type: "mentorOfficeRent/changeVisible",
        payload: {
          tudiGongVisible: true,
        }
      })
    }
  }
  const onCancelCallBack = () => { }

  //一键群发
  const shareHouse = () => {
    dispatch({
      type: "mentorOfficeRent/sharHouse",
      payload: {
        selectedRowKeys: selectedRowKeys,
        selectedRowRecord: selectedRowRecord,
      }
    })
  }
  const onPublishedHouseSelectChange = (selectedRowKeys, selectedRows) => {
    dispatch({
      type: "mentorOfficeRent/saveSelectedRowKeys",
      payload: {
        selectedRowKeys: selectedRowKeys,
        selectedRowRecord: selectedRows
      }
    })
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onPublishedHouseSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  //分享房源
  const saveTudigongPass = (e) => {
    dispatch({
      type: "mentorOfficeRent/saveTudigongPass",
      payload: {
        pwd: e.target.value
      }
    })
  }
  const handleOk = () => {
    if (!!pwd) {
      dispatch({
        type: "mentorOfficeRent/sharHouse",
        payload: {
          selectedRowKeys: selectedRowKeys,
          selectedRowRecord: selectedRowRecord,
          pwd: pwd,
        }
      })
    }
  }
  const handleCancel = () => {
    dispatch({
      type: "mentorOfficeRent/changeVisible",
      payload: {
        tudiGongVisible: false,
      }
    })
  }

  // 委托 所有方法
  const entrustSubmit = () => {
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: "mentorOfficeRent/entrust",
          payload: {
            brokerId: values.entrust[1]
          }
        })
        form.resetFields();
      }
    });
  }
  const entrustClose = () => {
    form.resetFields(["entrust"]);
    dispatch({
      type: "mentorOfficeRent/setState",
      payload: {
        entrustModal: {
          visible: false,
          required: false,
        }
      }
    })
  }
  // 设置状态modal的方法
  const houseStateClose = () => {
    form.resetFields(["houseState"]);
    dispatch({
      type: "mentorOfficeRent/setState",
      payload: {
        houseStateModal: {
          visible: false,
          required: false,
        }
      }
    })
  }
  const houseStateChange = () => {

  }
  const houseStateSubmit = () => {
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: "mentorOfficeRent/houseStateSet",
          payload: {
            state: values.houseState
          }
        })
        form.resetFields(["houseState"]);
      }
    });
  }
  return (
    <div className="mentorRole-houseSell">
      {
        isBroker !== null ?
          <div>
            <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack} />
            <DxLoadingShadow visible={loadingShadow} />
            <div className="searchBar">
              <Form onSubmit={handleSubmit}>
                <Row gutter={16}>
                  <Col span={5}>
                    <FormItem label="关键字" {...formItemLayout}>
                      {getFieldDecorator('resourcesNumber', {
                        rules: [{ required: false, message: '' }],
                      })(
                        <Input placeholder="搜索小区名称或房源编号" size='large' />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem label="城市" {...formItemLayout}>
                      {getFieldDecorator('area', {
                        rules: [{ required: false, message: '请选择城市列表' }],
                      })(
                        <Cascader options={eopOptions} changeOnSelect={true} onChange={onSelectChange} placeholder="请选择城市列表" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={7}>
                    <Row gutter={8}>
                      <Col span={6}>
                        <Button type='primary' htmlType="submit" size='large'>搜索</Button>
                      </Col>
                      <Col span={6}>
                        <Button type='reset'
                          onClick={
                            () => {
                              form.resetFields()
                              dispatch({
                                type: "mentorOfficeRent/setState",
                                payload: {
                                  area: null
                                }
                              })
                              dispatch({
                                type: "mentorOfficeRent/loadList",
                                payload: {}
                              })
                            }
                          }
                          size='large'>重置</Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                {/* 选择委托人公用modal */}
                <Modal
                  visible={entrustModal.visible}
                  footer={false}
                  onCancel={entrustClose}
                >
                  <DxPanel title="选择房源委托人">
                    <Row style={{ "paddingBottom": "15px", "marginTop": "-20px" }}>
                      <Col span={24}>
                        <FormItem
                          labelCol={{ "span": 5 }}
                          wrapperCol={{ "span": 16 }}
                          label="选择"
                          hasFeedback
                        >
                          {getFieldDecorator('entrust', {
                            initialValue: [],
                            rules: [
                              { required: false, message: '请选择委托人' },
                              {
                                type: 'object', fields: {
                                  0: { type: "number", required: entrustModal.required },
                                  1: { type: "number", required: entrustModal.required },
                                }, message: "请选择委托人"
                              },
                            ],
                          })(
                            <Cascader options={optionss} />
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={3} offset={14}>
                        <Button type='primary' onClick={entrustSubmit} style={{ "fontSize": "12px" }}>保存</Button>
                      </Col>
                      <Col span={3} offset={2}>
                        <Button type='reset'
                          onClick={entrustClose}
                          style={{ "fontSize": "12px" }}>取消</Button>
                      </Col>
                    </Row>
                  </DxPanel>
                </Modal>
                {/* 设置状态公用modal */}
                <Modal
                  visible={houseStateModal.visible}
                  footer={false}
                  onCancel={houseStateClose}
                >
                  <DxPanel title="设置状态">
                    <Row style={{ "paddingBottom": "15px", "margin": "-20px" }}>
                      <Col span={16}>
                        <FormItem
                          labelCol={{ "span": 5 }}
                          wrapperCol={{ "span": 19 }}
                          label="状态"
                          hasFeedback
                        >
                          {getFieldDecorator('houseState', {
                            initialValue: "",
                            rules: [
                              { required: houseStateModal.required, message: '请选择要设置的状态' }
                            ],
                          })(
                            <RadioGroup onChange={houseStateChange}>
                              <Radio key={0} value="已发布">出租</Radio>
                              <Radio key={1} value="暂缓">暂缓</Radio>
                              <Radio key={2} value="下架">下架</Radio>
                            </RadioGroup>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={3} offset={1}>
                        <Button type='primary' onClick={houseStateSubmit} style={{ "fontSize": "12px" }}>保存</Button>
                      </Col>
                      <Col span={3} offset={1}>
                        <Button type='reset'
                          onClick={houseStateClose}
                          style={{ "fontSize": "12px" }}>取消</Button>
                      </Col>
                    </Row>
                  </DxPanel>
                </Modal>
              </Form>
            </div>
            <Row>
              <Col>
                <div className='addHouse'>
                  <Button type="default" onClick={createNewHouse} icon="plus" size="large">新增房源</Button>
                  {
                    isBroker ?
                      <div className="selectItemDiv">
                        <Button type="primary" onClick={shareHouse} disabled={!hasSelected}>一键群发</Button>
                        <span className="selectItem">{hasSelected ? `选中 ${selectedRowKeys.length} 项` : ''}</span>
                      </div>
                      : null
                  }
                </div>
              </Col>
            </Row>
            <div className="mentorTabs">
              <Tabs
                activeKey={activeKey}
                onChange={onTabsChange}
                type="card"
                defaultActivKey="publishedHouse"
                className="tabs"
                animated={false}
              >
                {/*
                 <TabPane tab="合作速销房源" key="cooperation">
                  <Table
                    loading={tableLoading}
                    dataSource={cooperationPage.content}
                    columns={columns}
                    pagination={paginationCooperation}
                    rowSelection={isBroker?rowSelection:null}
                   />
              </TabPane>
                <TabPane tab="私有房源" key="publishedHouse">
                    <Table
                      loading={tableLoading}
                      dataSource={publishedHousePage.content}
                      columns={columns}
                      pagination={paginationPublishedHouse}
                      rowSelection={isBroker?rowSelection:null}
                     />
                </TabPane>
                */}
                {
                  isBroker ?
                    null
                    :
                    <TabPane tab="全部房源" key="unassignedAgent">
                      <Table
                        loading={tableLoading}
                        dataSource={unassignedAgentPage.content}
                        columns={columns}
                        pagination={paginationUnassignedAgent}
                      />
                    </TabPane>
                }
                <TabPane tab="暂缓房源" key="pause">
                  <Table
                    loading={tableLoading}
                    dataSource={pausePage.content}
                    columns={columns}
                    pagination={paginationPause}
                  />
                </TabPane>
                <TabPane tab="已租房源" key="sold">
                  <Table
                    loading={tableLoading}
                    dataSource={soldPage.content}
                    columns={columns}
                    pagination={paginationSold}
                  />
                </TabPane>
                <TabPane tab="已下架房源" key="removed">
                  <Table
                    loading={tableLoading}
                    dataSource={removedPage.content}
                    columns={columns}
                    pagination={paginationRemoved}
                  />
                </TabPane>

              </Tabs>
            </div>
          </div>
          :
          <div className="mentorDataLoading">
            <Spin />
          </div>
      }
    </div>
  )
}

function mapStateToProps({ mentorOfficeRent }) {
  return { mentorOfficeRent }
}
export default connect(mapStateToProps)(Form.create({})(OfficeRent));
