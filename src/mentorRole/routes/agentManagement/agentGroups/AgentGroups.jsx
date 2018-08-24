import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router'
import QRCode from 'qrcode.react';
import { Alert, Table, Tree, Button, Modal, Input, Row, Col, Form, Select, TreeSelect, message, Tooltip } from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'
import Panel from '../../../../commons/components/Panel'
import img from '../../../assets/images/morentouinfg.png';
import PromptModal from '../../../../commons/View/PromptModal'
import Copy from '../../../components/copy/Copy'
import './agentGroups.css'
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
const Option = Select.Option;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};

function AgentGroups({ dispatch, agentGroups, form }) {
  const { getFieldDecorator } = form

  const {
    toturId,
    isAuthentication,
    deptName,
    teamData,
    generateTeamData,
    selectedKey,
    promptObj,
    expandedKeys,
    searchValue,
    autoExpandParent,
    selectedRowKeys,
    addMemberVisible,
    invitationVisible,
    adjustmentVisible,
    editVisible,
    pageInfo,
    tableLoading,
    editVisibles,
    userId,
    teamId
  } = agentGroups
  const columns = [
    {
      title: "头像",
      render: (text, record, index) => {
        let url = img;
        if (record.logo) {
          url = record.logo;
        }
        return (<img src={url} width='70px' height="70px" style={{ borderRadius: "50%" }} />)
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
      title: "状态",
      dataIndex: "status"
    },
    {
      title: "当前角色",
      dataIndex: "userType"
    },
    {
      title: '操作',
      render: (text, record, index) => {
        if (record.status === '已激活') {
          return (
            <div>
              <span
                onClick={() => showBrokerDetails(text, record, index)}
                className="broker_checkmen">

              </span>

              <span
                onClick={() => showBrokerDetail(text, record, index)}
                className="broker_check">
              </span>
            </div>

          )
        } else {
          return (
            <div>
              <span
                onClick={() => activationBroker(text, record, index)}
                className="broker_active">
              </span>
              <span
                onClick={() => deleteBroker(text, record, index)}
                className="broker_delete">
              </span>
            </div>
          )
        }
      }
    }
  ]
  const paginationInfo = {
    pageSize: pageInfo.pageSize,
    current: pageInfo.current,
    defaultCurrent: 1,
    total: pageInfo.total,

    showTotal: total => `共${total}条数据`,
    onChange: (pageNo) => {
      dispatch(
        {
          type: 'agentGroups/findTeamBrokerInfo',
          payload: {
            pageNo: pageNo - 1,
            pageSize: pageInfo.pageSize,
            sort: { 'id': 'DESC' },
            teamId: teamId,
          }
        })
    },
  };

  const showBrokerDetail = (record) => {  //表格查看点击事件
    dispatch(routerRedux.push({
      pathname: '/agentManagement/detaileInfors',
      state: { //这里传入projectId 跳转到下一个页面时监听路由把值存在state中
        brokerId: record.id
      }
    }))
  }
  const showBrokerDetails = (record) => {  //表格查看点击事件
    dispatch({
      type: "agentGroups/setStatePramas",
      payload: {
        editVisibles: true,
        userId: record.id
      }
    });
  }

  const activationBroker = (record) => { //表格激活
    const confirm = Modal.confirm;
    confirm({
      title: '确定激活经纪人？',
      content: '点击“确定”按钮后, 将激活经纪人（' + record.name + '）。',
      onOk() {
        return new Promise((resolve, reject) => {
          dispatch({
            type: "agentGroups/activateBroker",
            payload: {
              resolve: resolve,
              id: record.id,
            }
          });
        });
      },
      onCancel() { },
    });
  }

  const deleteBroker = (record) => { //表格操作里的删除
    const confirm = Modal.confirm;
    const brokerId = record.id;
    confirm({
      title: '确定删除该经纪人？',
      content: '点击“确定”按钮后, 将删除经纪人（' + record.name + ')。',
      onOk() {
        return new Promise((resolve, reject) => {
          dispatch({
            type: "agentGroups/deleteUnActivationBroker",
            payload: {
              resolve: resolve,
              id: brokerId,
            }
          });
        });
      },
      onCancel() { },
    });
  }

  const toAuthentication = () => {
    dispatch(routerRedux.push({
      pathname: '/businessManagement/businessInfos',
    }))
  }

  const onExpand = (expandedKeys) => {
    dispatch({
      type: "agentGroups/setStatePramas",
      payload: {
        expandedKeys,
        autoExpandParent: false,
      }
    })
  }

  const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  const searchTeam = (e) => {
    const value = e.target.value;
    const expandedKeys = generateTeamData.map((item) => {
      if (item.title.indexOf(value) > -1) {
        return getParentKey(item.key, teamData);
      }
      return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i);
    dispatch({
      type: "agentGroups/setStatePramas",
      payload: {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      }
    });

  }

  const loop = (data, searchValue) => data && data.map((item) => {
    const index = item.title.search(searchValue);
    const beforeStr = item.title.substr(0, index);
    const afterStr = item.title.substr(index + searchValue.length);
    const title = index > -1 ? (
      <span>
        {beforeStr}
        <span style={{ color: '#f50' }}>{searchValue}</span>
        {afterStr}
      </span>
    ) : <span>{item.title}</span>;
    if (item.children) {
      return (
        <TreeNode key={item.key} title={title} oldTitle={item.title}>
          {loop(item.children, searchValue)}
        </TreeNode>
      );
    }
    return <TreeNode key={item.key} title={title} oldTitle={item.title} />;
  });

  const onSelectChange = (selectedRowKeys) => { //表格选中change事件
    dispatch({
      type: "agentGroups/setStatePramas",
      payload: { selectedRowKeys, }
    })
  }

  const rowSelection = {  //表格配置项
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const adjustmentGroups = () => {  //打开调整分组modal
    dispatch({
      type: "agentGroups/setStatePramas",
      payload: {
        adjustmentVisible: true,
      }
    })
  }

  const addMember = () => { //打开添加经纪人modal
    if (isAuthentication) {
      dispatch({
        type: "agentGroups/setStatePramas",
        payload: {
          addMemberVisible: true,
        }
      })
    } else {
      dispatch({
        type: "agentGroups/togglePrompt",
        payload: {
          visible: true,
          description: "您的企业尚未认证通过，无法添加经纪人",
          titile: "提示",
          okText: '立即认证',
          todo: 'toAuthentication',
          type: 'success',
        }
      })
    }
  }

  const teamInvitation = () => {  //打开团队邀请modal
    dispatch({
      type: "agentGroups/setStatePramas",
      payload: {
        invitationVisible: true,
      }
    })
  }

  const editTeamNameAfterClose = () => {
    form.resetFields(["teamName"]);
  }

  const editTeamName = (e) => { //编辑团队名称表单提交
    e.preventDefault();
    form.validateFieldsAndScroll(["teamName"], (err, values) => {
      if (!err) {
        let teamId = "";
        if (deptName) {
          teamId = selectedKey;
        }
        dispatch({
          type: "agentGroups/updateTeam",
          payload: {
            name: values.teamName,
            id: teamId,
          }
        });
      } else {
        return
      }
    });
  }

  const addBroker = (e) => { //添加经纪人表单提交
    e.preventDefault();
    form.validateFieldsAndScroll(["brokerName", "brokerPhone", "password", "chooseGroup"], (err, values) => {
      if (!err) {
        dispatch({
          type: "agentGroups/addBroker",
          payload: {
            name: values.brokerName,
            password: values.password,
            phoneNumber: values.brokerPhone,
            teamId: values.chooseGroup,
          }
        });
        // form.resetFields(["brokerName","password","chooseGroup"]);
        form.resetFields()
      } else {
        return
      }
    });
  }

  const closeModal = (e) => {  //关闭添加经纪人modal
    dispatch({
      type: "agentGroups/setStatePramas",
      payload: {
        addMemberVisible: false
      }
    })
    form.resetFields();
  }

  const closeInvitationModal = () => {  //关闭团队邀请modal
    dispatch({
      type: "agentGroups/setStatePramas",
      payload: {
        invitationVisible: false
      }
    })
  }

  const editModalCancel = () => {
    dispatch({
      type: "agentGroups/setStatePramas",
      payload: {
        editVisible: false
      }
    })
  }

  const preEditTeamName = () => {  //编辑团队名称
    dispatch({
      type: "agentGroups/setStatePramas",
      payload: {
        editVisible: true
      }
    })
  }

  const showDeleteTeamConfirm = () => {  //tree的删除事件
    const confirm = Modal.confirm;
    confirm({
      title: '确定删除该团队？',
      content: '点击“确定”按钮后, 将删除团队（' + deptName + '）。',
      onOk() {
        return new Promise((resolve, reject) => {
          dispatch({
            type: "agentGroups/deleteTeam",
            payload: {
              resolve: resolve,
              teamId: selectedKey,
            }
          });
        });
      },
      onCancel() { },
    });
  }

  const deleteBrokers = () => { //踢出经纪人
    const confirm = Modal.confirm;
    confirm({
      title: '确定将选中的经纪人踢出团队？',
      content: '点击“确定”按钮后, 将踢出选中的经纪人。',
      onOk() {
        return new Promise((resolve, reject) => {
          dispatch({
            type: "agentGroups/deleteBrokers",
            payload: {
              resolve: resolve,
              ids: selectedRowKeys,
            }
          });
        });
      },
      onCancel() { },
    });
  }

  const onOkCallBack = () => {
    if (promptObj.todo === 'toAuthentication') {
      dispatch({
        type: "agentGroups/togglePrompt",
        payload: {
          visible: false
        }
      })
      dispatch(routerRedux.push({
        pathname: "/businessManagement/businessInfos"
      }))
    } else if (promptObj.todo === "deleteBrokers") {
      dispatch({
        type: "agentGroups/setStatePramas",
        payload: {
          selectedRowKeys: []
        }
      })
      dispatch({
        type: "agentGroups/togglePrompt",
        payload: {
          visible: false
        }
      })
    } else if (promptObj.todo === 'closeModal') {
      dispatch({
        type: "agentGroups/togglePrompt",
        payload: {
          visible: false
        }
      })
    }
  }

  const onCancelCallBack = () => { }

  const selectedTreeNode = (selectedIds, e) => {
    dispatch({
      type: "agentGroups/setStatePramas",
      payload: {
        selectedRowKeys: [],
      }
    });

    let selectedKey = e.node.props.eventKey, teamId = "", deptName = "";

    if (selectedKey != "root") {
      teamId = selectedKey;
      deptName = e.node.props.oldTitle;
    }
    dispatch({
      type: "agentGroups/setStatePramas",
      payload: {
        selectedKey: selectedKey,
        deptName: deptName,
        teamId: teamId,
      }
    })

    dispatch({
      type: 'agentGroups/findTeamBrokerInfo',
      payload: {
        pageNo: 0,
        pageSize: pageInfo.pageSize,
        teamId: teamId,
        sort: { 'id': 'DESC' },
      }
    })

  }

  const loopSelectOption = (data) => {
    console.log("data", data);
    let tempData = [];
    if (data[0] && data[0].children) {
      tempData = data[0].children;
    }
    return tempData.map((item) => {
      return <Option key={item.key} value={item.key} disabled={!item.notFull}>{item.title}</Option>;
    });
  }

  const closeAdjustmentModal = () => {  //关闭调整分组modal
    dispatch({
      type: "agentGroups/setStatePramas",
      payload: {
        adjustmentVisible: false
      }
    })
  }

  const adjustmentOk = (e) => { //调整分组
    e.preventDefault();
    form.validateFieldsAndScroll(["moveBrokerSelect"], (err, values) => {
      if (!err) {
        dispatch({
          type: "agentGroups/moveBroker",
          payload: {
            ids: selectedRowKeys,
            teamId: form.getFieldValue("moveBrokerSelect"),
          }
        });
      } else {
        return
      }
    });
  }

  const copyMessage = (e) => {
    const nodes = {
      trigger: document.getElementById('trigger'),
      target: document.getElementById('invitationUrl')
    }
    Copy(nodes.trigger, nodes.target)
    message.success('复制成功!');
  }

  const editCancel = () => {
    dispatch({
      type: "agentGroups/setStatePramas",
      payload: {
        editVisibles: false
      }
    })
  }








  const handleSearch = (e) => {
    e.preventDefault();
    form.validateFields((err, values) => {
      console.log('Received values of form: ', values.selectJs, userId);
      dispatch({
        type: 'agentGroups/editTeam',
        payload: {
          userType: values.selectJs,
          userId: userId

        }
      })
      form.resetFields(["selectJs"]);

    });
  }





  return (
    <div className="agentGroups">
      <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack} />
      <Modal
        visible={editVisibles}
        footer={false}
        onCancel={editCancel}
      >
        <Form onSubmit={handleSearch}>
          <DxPanel title="设置门店角色">
            <Row>
              <Col>
                <FormItem
                  {...formItemLayout}
                  label="选择门店角色"
                  hasFeedback
                >
                  {getFieldDecorator('selectJs', {
                    rules: [
                      { required: true, message: '选择门店角色!' },
                    ],
                  })(
                    <Select placeholder="选择门店角色">
                      <Option value="BROKER_USER_MANAGE">门店经理</Option>
                      <Option value="BROKER_USER">门店经纪人</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button htmlType="submit" type="default" style={{ marginTop: "20px" }}>完成</Button>
              </Col>
            </Row>

          </DxPanel>
        </Form>
      </Modal>
      <Modal
        visible={adjustmentVisible}
        footer={false}
        onCancel={closeAdjustmentModal}
      >
        <Panel title="调整分组" />
        <div className="reGroups">
          <Form onSubmit={adjustmentOk}>
            <FormItem label="将选中的经纪人移动至：" {...formItemLayout}>
              {getFieldDecorator('moveBrokerSelect', {
                initialValue: "",
                rules: [{ required: true, message: '请选择团队!' }],
              })(
                <Select>
                  {loopSelectOption(teamData)}
                </Select>
              )}
            </FormItem>
            <FormItem>
              <div className="onOk">
                <Button type="primary" htmlType="submit">完成</Button>
              </div>
            </FormItem>
          </Form>
        </div>
      </Modal>
      <Modal
        visible={addMemberVisible}
        footer={false}
        onCancel={closeModal}
      >
        <Panel title="添加经纪人" />
        <div className="addBroker">
          <Form onSubmit={addBroker}>
            <FormItem label="姓名">
              {getFieldDecorator('brokerName', {
                initialValue: "",
                rules: [{ required: true, message: '请输入姓名!' }],
              })(
                <Input placeholder="请输入姓名" />
              )}
            </FormItem>
            <FormItem label="电话号码">
              {getFieldDecorator('brokerPhone', {
                rules: [{ required: true, message: '请输入11位有效手机号码!', pattern: /^1\d{10}$/ }],
              })(
                <Input placeholder="请输入11位有效手机号码" size="large" />
              )}
            </FormItem>
            <div>
              <p style={{ color: "#ff6600" }}>此手机号码将作为经纪人登录APP帐号使用</p>
            </div>
            <FormItem label="登陆密码">
              {getFieldDecorator('password', {
                initialValue: "123456",
                rules: [{
                  required: true, message: '请输入密码!',
                }],
              })(
                <Input placeholder="请输入登陆密码" />
              )}
            </FormItem>
            <FormItem label="选择分组">
              {getFieldDecorator('chooseGroup', {
                initialValue: "",
                rules: [{ required: true, message: '请选择团队!' }],
              })(
                <Select>
                  {loopSelectOption(teamData)}
                </Select>
              )}
            </FormItem>
            <FormItem >
              <Button type="primary" htmlType="submit" className="button_rf">保存</Button>
              <Button type="ghost" onClick={closeModal}>取消</Button>
            </FormItem>
          </Form>
        </div>
      </Modal>
      <Modal
        footer={false}
        visible={invitationVisible}
        onCancel={closeInvitationModal}
      >
        <Panel title="邀请经纪人" />
        <div className="byLink">
          <Alert type="success" message="通过链接邀请" />
          <Row>
            <Col>
              <span id="invitationUrl">http://mobile.hzwork.net/tutorIndex.html#/shareTutor?tutorId={toturId}</span>
            </Col>
            <Col>
              复制链接发送给经纪人，邀请其加入团队
              </Col>
            <Col>
              <Button id="trigger" type="default" onClick={copyMessage}>复制链接</Button>
            </Col>
          </Row>
        </div>
        <div className="byQrCode">
          <Alert type="success" message="通过二维码邀请" />
          <div className='payModal_qrCode'>
            {<QRCode value={`http://mobile.hzwork.net/tutorIndex.html#/shareTutor?tutorId=${toturId}`} />}
          </div>
          <p>右键复制二维码，发送给经纪人</p>
        </div>
      </Modal>

      <Modal
        footer={false}
        visible={editVisible}
        onCancel={editModalCancel}
        afterClose={editTeamNameAfterClose}
      >
        <Panel title="编辑团队名称" />
        <div className="editTeam">
          <Form onSubmit={editTeamName}>
            <FormItem label="团队名称">
              {getFieldDecorator('teamName', {
                initialValue: deptName.length > 20 ? deptName.substr(0, 20) + '..' : deptName,
                rules: [{ required: true, message: '请输入团队名称!' }],
              })(
                <Input maxLength='20' />
              )}
            </FormItem>
            <FormItem >
              <Button type="primary" htmlType="submit">保存</Button>
            </FormItem>
          </Form>
        </div>
      </Modal>
      <Panel title="经纪人管理" />
      <div className="agentManagement">
        {isAuthentication ? null : <Alert
          description={<div><span style={{ display: "inline-block", fontSize: "12px", marginRight: "30px" }}>企业尚未认证，无法添加经纪人</span><Button type="danger" onClick={toAuthentication}>立即认证</Button></div>}
          type="warning"
          showIcon
        />}
        <Row gutter={6}>
          <Col span={6}>
            <div className="tree">
              <Search placeholder="输入团队名称查询" onChange={searchTeam} size="large" />
              <Tree
                checkable={false}
                onSelect={selectedTreeNode}
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                selectedKeys={[selectedKey]}
              >
                {loop(teamData, searchValue)}
              </Tree>
            </div>
          </Col>
          <Col span={18}>
            <div className="treeDetails">
              <Row>
                <Col sm={24} md={24}>
                  {deptName ?
                    <div className="header">
                      <Tooltip title={deptName} trigger="hover" autoAdjustOverflow="true">
                        <div className="teamName">{deptName}</div>
                      </Tooltip>
                      <Button type="agent_Buttons" onClick={preEditTeamName}>设置</Button>
                      <Button type="agent_Buttons" onClick={showDeleteTeamConfirm}>删除</Button>
                    </div>
                    :
                    <div className="header">
                      {//<Button type="agent_Buttons" onClick={preEditTeamName}>添加团队</Button>
                      }
                    </div>
                  }
                </Col>
                <Col sm={24} md={24}>
                  <div className="buttons">
                    <Button type="agent_Buttons" onClick={addMember} className="addMember">+ 添加成员</Button>
                    <Button type="agent_Buttons" onClick={teamInvitation}>团队邀请</Button>
                    <Button type="agent_Buttons" onClick={adjustmentGroups} disabled={!hasSelected}>调整分组</Button>
                    <Button type="agent_Buttons" onClick={deleteBrokers} disabled={!hasSelected}>踢出导师团队</Button>
                    <span style={{ marginLeft: 8 }}>{hasSelected ? `选中 ${selectedRowKeys.length} 项` : ''}</span>
                  </div>
                  <Table rowKey={record => record.id} rowSelection={rowSelection} loading={tableLoading} columns={columns} dataSource={pageInfo.content} pagination={paginationInfo} />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

function mapStateToProps({ agentGroups }) { return { agentGroups } }
export default connect(mapStateToProps)(Form.create({})(AgentGroups));
