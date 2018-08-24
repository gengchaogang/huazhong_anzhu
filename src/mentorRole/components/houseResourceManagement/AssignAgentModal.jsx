import React from 'react'
import {connect} from 'dva'
import {Modal,Row,Col,Tree,Input,Table,Button,Icon,Form,InputNumber,Checkbox} from 'antd'
import './assignAgentModal.css'
import img_logo from '../../assets/images/morentouinfg.png'
import '../../../commons/css/common.css';
import '../../../commons/css/list.css';

import PromptModal from '../../../commons/View/PromptModal';
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../commons/utils/commonUtil.js';
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow';
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
const FormItem=Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
import img from '../../assets/yay.jpg'

function AssignAgentModal({
    pathIdMap,
    agentListTableData,
    selectedTreeNode,
    onExpand,
    expandedKeys,
    autoExpandParent,
    checkedTreeNode,
    teamData,
    searchTeam,
    loop,
    searchValue,
    visible,
    width,
    assignAgentModal,
    onOk,
    onCancel,
    title,
    dispatch,
    form}){
  const {getFieldDecorator}=form;
  const {
    selectedRowKeys,
    idToObj,
    brokerListPage,
    loadingShadow,
    promptObj,
    }=assignAgentModal;
    //  已发布房源
    const paginationBrokerList = {
  			showQuickJumper:commonFinalCode.showQuickJumper,
  			pageSize: brokerListPage.pageSize,
  			current:brokerListPage.pageNo,
  			defaultCurrent:1,
  			total:brokerListPage.total,
  			showTotal:total => `共${total}条数据`,
  			onChange:(page,pageSize)=>{
  				dispatch({
  					type:'assignAgentModal/getBrokerList',
  					payload:{
  						pageNo:page-1,
  						pageSize:brokerListPage.pageSize,
  					}
  				})
  			},
  	};


  const handleOk=(e)=>{
    form.validateFields((err, fieldsValue) => {
     if (err) {
       return;
     }else{
      const slectedBrokers = [];
       if (selectedRowKeys != null && selectedRowKeys.length > 0) {
           selectedRowKeys.map((item,index)=>{
             agentListTableData.map((i,index)=>{
               if(item===i.key){
                 slectedBrokers.push(i)
               }
             })
           })
       }
       const data = form.getFieldsValue();
       data.slectedBrokers = slectedBrokers;
       onOk(data);
        clearSelectRow()
       form.resetFields();
     }
   });
  }

  function handleCancel(){
    form.resetFields();
    onCancel();
  }

  const modalProps = {
    visible,
    title,
    width
  };

  const showFooterButton=()=>{
		let footer=[];
    footer=[
      <Button key="back" type="ghost" size="large" onClick={()=>handleCancel()}>取消</Button>,
      <Button key="pass" type="primary" size="large" onClick={()=>handleOk()}>确定</Button>
    ];
    return footer;
	};

  const onOkCallBack=()=>{
      if(promptObj.todo==='closeModal'){
        dispatch({
          type:"assignAgentModal/togglePrompt",
          payload:{
            visible:false
          }
        })
      }
  }
  const onCancelCallBack=()=>{}

  const searchData=()=>{
    dispatch({
      type:'assignAgentModal/getBrokerList',
      payload:{
        pageNo:0,
        pageSize:brokerListPage.pageSize,
      }
    })
  }
  const columns=[
    {
      title:"头像",
      dataIndex:'logo',
      render:(text,record,index)=>{
        const _logo = record['logo'];
        if (_logo != null && _logo.length > 0) {
            return(
              <img src={_logo} width='50px' height="50px" style={{borderRadius:"50%"}}/>
            )
        }else {
            return (
              <img src={img_logo}  width='50px' height="50px" style={{borderRadius:"50%"}}/>
            );
        }
      },
    },{
      title:"姓名",
      dataIndex:'name',
    },{
      title:"联系电话",
      dataIndex:"phoneNumber"
    },{
      title:"队伍",
      dataIndex:"teamName"
    }
  ]

  var number= 0;
  if (selectedRowKeys) {
      number = selectedRowKeys.length;
  }
  const onSelectChange=(selectedRowKeys)=>{
    dispatch({
        type:'assignAgentModal/modifySelect',
        payload:selectedRowKeys
      })
    dispatch({
      type:"assignAgentModal/saveResultData",
      payload:{
        selectedRowKeys,
      }
    })
  }
  const rowSelection = {
    selectedRowKeys,
     onChange: onSelectChange,
   };
   // 清空已选择的经纪人
   const clearSelectRow=()=>{
     dispatch({
       type:"assignAgentModal/saveResultData",
       payload:{
         selectedRowKeys:[],
       }
     })
   }
  return(
  <Modal
    width={width}
    visible={visible}
    maskClosable={false}
    title={title}
    onCancel={handleCancel}
    footer={showFooterButton()}
    >

    <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack}/>
    <DxLoadingShadow visible={loadingShadow} />

    <div className='commonModalHeight'>
        <Form>
          <Row>
            <Col sm={6} md={6}>
              <div className="zzjg">
                  <Search  placeholder="搜索" onChange={searchTeam} size='large'/>
                  <Tree
                    defaultCheckedKeys={['root']}
                    checkable = {true}
                    onSelect = {selectedTreeNode}
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onCheck = {checkedTreeNode}
                    defaultExpandedKeys={['root']}
                  >
                    {loop(teamData,searchValue)}
                  </Tree>
              </div>
            </Col>
            <Col sm={18} md={18}>
              <div className="treeTable">
                <h3>
                  <span>{`已选人员(${number})`}</span>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <a className="passedTextColor" onClick={clearSelectRow}>清空</a>
                </h3>
                <Table
                  rowSelection={rowSelection}
                  // pagination={paginationBrokerList}
                  pagination={false}
                  columns={columns}
                  dataSource={agentListTableData}
                  bordered={false}
                  scroll={{ y: 400 }}
                  size="middle"
                  />
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  )
}

function mapStateToProps({assignAgentModal}){
  return{assignAgentModal}
}

export default connect(mapStateToProps)(Form.create({})(AssignAgentModal));
