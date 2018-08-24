import React from 'react'
import {connect} from 'dva'
import {Table,Button,Form,Row,Col,Tree,Input}from 'antd'
import { routerRedux } from 'dva/router';
import DxPanel from '../../../commons/components/DxPanel'
import img from '../../assets/yay.jpg'
import AssignAgentModal from '../../components/houseResourceManagement/AssignAgentModal'
import '../../../commons/css/common.css';
import '../../../commons/css/list.css';
import './directAssignAgent.css'
import img_logo from '../../assets/images/morentouinfg.png'
const FormItem=Form.Item;
const TreeNode = Tree.TreeNode;
const Search = Input.Search;

import PromptModal from '../../../commons/View/PromptModal';
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../commons/utils/commonUtil.js';
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow';


function DirectAssignAgent({dispatch,directAssignAgent,form}){
  const {getFieldDecorator}=form;
  const {
    userInfoJSON,
    defaultKeys,
    pathIdMap,
    houseResourceId,
    tableData,
    selectedRowKeys,
    visible,
    loadingShadow,
    teamData,
    searchValue,
    expandedKeys,
    autoExpandParent,
    promptObj,
    generateTeamData,
    treeMarkers,
    agentList,
    agentListTableData,
  } = directAssignAgent;
  if(agentList.length!==0){
    if(tableData.length!==0){
      tableData.map((item,index)=>{ //item.id
        agentList.map((i,index)=>{
          if(item.id===i.item.id){
            return pathIdMap.set(item.id,i.item)
          }
        })
      })
    }
  }

  const showModal=()=>{
    dispatch({
      type:"directAssignAgent/currentSelect",
      payload:{
        agentListTableData:agentListTableData,
        tableData:tableData
      }
    })
  }
  const onExpand = (expandedKeys) => {
      dispatch({
        type:"directAssignAgent/setStatePramas",
        payload:{
          expandedKeys,
          autoExpandParent: false,
        }
      })
    }
    const loop = (data,searchValue) => data&&data.map((item) => {
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
          <TreeNode key={item.key} title={title} oldTitle = {item.title}>
            {loop(item.children,searchValue)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={title} oldTitle = {item.title}/>;
    });
    const selectedTreeNode=(selectedIds, e)=>{  //点击部门或者名称
      // dispatch({
      //   type:"directAssignAgent/setStatePramas",
      //   payload:{
      //     treeMarkers:[{position:['106.23','29.44'],content:"123456"}]
      //   }
      // })
    }
    const checkedTreeNode=(checkedKeys,e)=>{  //勾选
      dispatch({
        type:"assignAgentModal/changeRowKeys",
        payload:{
          checkedKeys:checkedKeys
        }
      })
      let agentListTableData=[];
      if(agentList.length!==0){
        checkedKeys.map((item,index)=>{
          agentList.map((i)=>{
            if(item===i.item.key){
              agentListTableData.push({
                areaPath:i.item.areaPath,
                id:i.item.id,
                isBroker:i.item.isBroker,
                isEmployee:i.item.isEmployee,
                key:i.item.key,
                logo:i.item.logo,
                name:i.item.name,
                phoneNumber:i.item.phoneNumber,
                title:i.item.title,
                teamName:i.item.teamName,
              })
            }
          })
        })
      }
      dispatch({
        type:"directAssignAgent/saveAgentTableData",
        payload:{
          agentListTableData:agentListTableData
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
        type:"directAssignAgent/setStatePramas",
        payload:{
          expandedKeys,
          searchValue: value,
          autoExpandParent: true,
        }
      });

    }

  const toBack=()=>{
    dispatch(routerRedux.push({
      pathname:'/houseResourceManagement/secondHandHouseSell/createSecondHandSellResource/ownerInfos',
      // state:{ //这里传入projectId 跳转到下一个页面时监听路由把值存在state中
      //
      // }
    }))
  }
  const toSave=()=>{
    // dispatch(routerRedux.push({
    //   pathname:'/houseResourceManagement/secondHandHouseSell/createSecondHandSellResource/assignAgent',
    //   // state:{ //这里传入projectId 跳转到下一个页面时监听路由把值存在state中
    //   //
    //   // }
    // }))
  }
  console.log('tableData',tableData);
  const columns = [{
      title: '名称',
      render:(text,record,index)=>{
        return(
          <Row>
            <Col span={4}><img src={text.logo===''?img_logo:text.logo} width="50px" height="50px" style={{borderRadius:"50%"}}/></Col>
            <Col span={19} offset={1} className="broker_name">
              {text.name}
            </Col>
          </Row>
        )
      }
    }, {
      title:"联系电话",
      dataIndex:'phone',
    },{
      title: '售价',
      render:(text,record,index)=>{
        if(!!text.totlePrice){
          return(
            <div>
              <span>售价:</span>
              <span style={{color:'#e4393c',font:"16px"}}>{parseFloat(text.totlePrice)/10000}万</span>
            </div>
          )
        }else{
          return(
            <div>
              <span>售价:</span>
              <span style={{color:'#e4393c',font:"16px"}}> -- </span>
            </div>
          )
        }
      }
    }, {
      title: '合作促销',
      render:(text,record,index)=>{
        if(text.cooperation==='开启'){
          if(text.promotionMode==='金额'){
            return(
              <div>
                <span>合作速销: {text.cooperationPromotion}元</span>
              </div>
            )
          }else if(text.promotionMode==='比例'){
            return(
              <div>
                <span>合作速销: {!!text.cooperationPromotion?`${text.cooperationPromotion*100}%`:""}</span>
              </div>
            )
          }
        }else{
          return(<span>合作速销: 未开启</span>)
        }
      }
    }, {
      title: '操作',
      render:(text,record,index)=>{
        return(
          <Button onClick={()=>onDelete(text,record,index)}>取消代理</Button>
        )
      }
    }];
  const onDelete=(text,record,index)=>{
    dispatch({
      type:"directAssignAgent/togglePrompt",
      payload:{
        visible:true,
        title:'提示',
        description:"确认要取消此经纪人的代理资格吗？",
        todo:'deleteAgent',
        cancelText:"取消",
        currentId:record.id,
      }
    })
  }
  const onSelectChange=(selectedRowKeys)=>{
    dispatch({
      type:"directAssignAgent/changeSelectedRowKeys",
      payload:{
        selectedRowKeys,
      }
    })
  }
  const handleDelete=()=>{
    if(!!tableData.length){
      dispatch({
        type:"directAssignAgent/deleteAll",
        payload:{houseId:houseResourceId}
      })
      dispatch({
        type:"directAssignAgent/changeSelectedRowKeys",
        payload:{
          selectedRowKeys:[]
        }
      })
    }
  }
  const rowSelection = {
     selectedRowKeys,
     onChange: onSelectChange,
   };

  const onModalOk=(data)=>{
    if(data.slectedBrokers.length){
      const listBrokers=[];
      data.slectedBrokers.map((item,index)=>{
        listBrokers.push(item.id)
      })
      dispatch({
        type:"directAssignAgent/addBroker",
        payload:{
          houseId:houseResourceId,
          listBrokers:listBrokers
        }
      })
    }
    dispatch({
      type:"directAssignAgent/changeModal",
      payload:{
        visible:false
      }
    });
    // 保存选择的经纪人信息
    dispatch({
        type:"directAssignAgent/addSelectBroker",
        payload:data,
    });
  }
  const onModalCancel=()=>{
    dispatch({
      type:"directAssignAgent/changeModal",
      payload:{
        visible:false
      }
    })
  }
  const modalProps={
    visible,
    onOk:onModalOk,
    onCancel:onModalCancel,
    title:"选择经纪人",
    width:"1200px"
  }
  const props={
    pathIdMap,
    agentListTableData,
    expandedKeys,
    autoExpandParent,
    checkedTreeNode,
    teamData,
    searchValue,
    searchTeam,
    loop,
    onExpand,
    selectedTreeNode,
  }
  const onOkCallBack=()=>{
    if(promptObj.todo==='closeModal'){
      dispatch({
        type:"directAssignAgent/togglePrompt",
        payload:{
          visible:false,
        }
      })
    }else if(promptObj.todo==='deleteAgent'){
      dispatch({
        type:"directAssignAgent/deleteAgent",
        payload:{
          brokerId:promptObj.currentId,
          houseId:houseResourceId,
        }
      })
      dispatch({
        type:"directAssignAgent/togglePrompt",
        payload:{
          visible:false
        }
      })
    }else if(promptObj.todo==='closeModalAndSendFetch'){
      dispatch({
        type:"directAssignAgent/getInitAgentData",
        payload:{
          id:houseResourceId
        }
      })
      dispatch({
        type:"directAssignAgent/togglePrompt",
        payload:{
          visible:false
        }
      })
    }
  }
  const onCancelCallBack=()=>{
    dispatch({
      type:"directAssignAgent/togglePrompt",
      payload:{
        visible:false,
      }
    })
  }

  const handleBack=()=>{
    history.back();
  }

  const hasSelected = tableData.length > 0;
  return(
    <div className="assignAgent">
      <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack}/>
      <DxLoadingShadow visible={loadingShadow} />
      <AssignAgentModal {...modalProps} {...props}/>
      <DxPanel title="指派经纪人">
        {
          !!userInfoJSON&&userInfoJSON.userType==='BROKER_USER'?
            null
            :
            <div style={{ marginBottom: 16 }}>
              <Row>
                <Col span={8}>
                  <Button type="primary" onClick={showModal}>
                    指派经纪人
                  </Button>
                </Col>
                <Col span={8} offset={8} style={{textAlign:"right"}}>
                  <Button type="reset"
                    onClick={handleDelete}
                    disabled={!hasSelected}
                  >删除全部</Button>
                </Col>
              </Row>
            </div>
        }
        <Table
          // rowSelection={rowSelection}
          pagination={false}
          columns={columns}
          dataSource={tableData}
          showHeader={false}
          expandedRowKeys={defaultKeys}
          expandedRowRender={record => record.description===''?'核心卖点未添加!':<p>核心卖点：{record.description}</p>}
          />
          <div className="operation_button_center">
            <Button type="primary" onClick={handleBack}>返回</Button>              
          </div>
      </DxPanel>
      {
        /*      <div>
              <Button type="ghost" onClick={toBack}>上一步</Button>
              <Button type="primary" onClick={toSave}>保存</Button>
            </div>
            */

      }
    </div>
  )
}

function mapStateToProps({directAssignAgent}){
  return{directAssignAgent}
}
export default connect(mapStateToProps)(Form.create({})(DirectAssignAgent));
