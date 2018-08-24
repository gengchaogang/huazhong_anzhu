import React from 'react';
import {connect} from 'dva';
import {routerRedux}from 'dva/router'
import {Table,Button} from 'antd';
import HouseRecord from '../../../../../components/resourceManagement/newHouseProDetails/HouseRecord'
import PromptModal from '../../../../../../commons/View/PromptModal'
function SecHandSelledRecord({dispatch,secHandSelledRecord}){
  const {
    currentStatus,
    tableData,
    totalElements,
    tableLoading,
    promptObj,
    projectId,
  }=secHandSelledRecord;
  const handleAll=()=>{
    dispatch({
      type:"secHandSelledRecord/getInitData",
      payload:{
        id:projectId,
        pageNo:0,
        pageSize:10,
        status:"",
      }
    })
    dispatch({
      type:"secHandSelledRecord/saveCurrentStatus",
      payload:{currentStatus:"",tableLoading:true}
    })
  }
  const alreadySee=()=>{
    dispatch({
      type:"secHandSelledRecord/getInitData",
      payload:{
        id:projectId,
        pageNo:0,
        pageSize:10,
        status:"带看成功"
      }
    })
    dispatch({
      type:"secHandSelledRecord/saveCurrentStatus",
      payload:{currentStatus:"带看成功",tableLoading:true}
    })
  }
  const notSee=()=>{
    dispatch({
      type:"secHandSelledRecord/getInitData",
      payload:{
        id:projectId,
        pageNo:0,
        pageSize:10,
        status:"等待带看"
      }
    })
    dispatch({
      type:"secHandSelledRecord/saveCurrentStatus",
      payload:{currentStatus:"等待带看",tableLoading:true}
    })
  }
  const miss=()=>{
    dispatch({
      type:"secHandSelledRecord/getInitData",
      payload:{
        id:projectId,
        pageNo:0,
        pageSize:10,
        status:"带看失败"
      }
    })
    dispatch({
      type:"secHandSelledRecord/saveCurrentStatus",
      payload:{currentStatus:"带看失败",tableLoading:true}
    })
  }
  const onPageChange=(page)=>{
    dispatch({
      type:"secHandSellingRecord/getInitData",
      payload:{
        id:projectId,
        pageSize:10,
        pageNo:page-1,
        status:currentStatus
      }
    })
  }
  const handleCallBackOk=()=>{
    if(promptObj.todo==='closeModal'){
      dispatch({
        type:"secHandSellingRecord/togglePrompt",
        payload:{visible:false}
      })
    }
  }
  const handleCallBackCancel=()=>{}

  const toPrve=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/secondhandHouseSell/secHandSelledNavBar/secHandSelledAgentBroker',
      state:{
        projectId:projectId
      }
    }))
  }
  const toNext=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/secondhandHouseSell/secHandSelledNavBar/secHandSelledDeal',
      state:{
        projectId:projectId
      }
    }))
  }
  const handeBack=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/secondhandHouseSell'
    }))
  }
  return(
    <div>
      <PromptModal onOk={handleCallBackOk} onCancel={handleCallBackCancel} {...promptObj}/>
      <HouseRecord
        onPageChange={onPageChange}
        tableData={tableData}
        handleAll={handleAll}
        alreadySee={alreadySee}
        notSee={notSee}
        miss={miss}
        totalElements={totalElements}
        tableLoading={tableLoading}
        />
      <Button type="primary" onClick={toPrve}>上一步</Button>
      <Button type="primary" onClick={toNext}>下一步</Button>
      <Button type="ghost" onClick={handeBack}>返回</Button>
    </div>
  )
}

function mapStateToProps({secHandSelledRecord}){
  return{secHandSelledRecord}
}
export default connect(mapStateToProps)(SecHandSelledRecord);
