import React from 'react';
import {connect} from 'dva';
import {routerRedux}from 'dva/router'
import {Table,Button} from 'antd';
import HouseRecord from '../../../../components/houseResourceManagement/newHouseProDetails/HouseRecord'
import PromptModal from '../../../../../commons/View/PromptModal'
function SecHandSellingRecord({dispatch,secHandSellingRecord}){
  const {
    currentStatus,
    tableData,
    totalElements,
    tableLoading,
    promptObj,
    projectId,
  }=secHandSellingRecord;
  const handleAll=()=>{
    dispatch({
      type:"secHandSellingRecord/getInitData",
      payload:{
        id:projectId,
        pageNo:0,
        pageSize:10,
        status:"",
      }
    })
    dispatch({
      type:"secHandSellingRecord/saveCurrentStatus",
      payload:{currentStatus:"",tableLoading:true}
    })
  }
  const alreadySee=()=>{
    dispatch({
      type:"secHandSellingRecord/getInitData",
      payload:{
        id:projectId,
        pageNo:0,
        pageSize:10,
        status:"带看成功"
      }
    })
    dispatch({
      type:"secHandSellingRecord/saveCurrentStatus",
      payload:{currentStatus:"带看成功",tableLoading:true}
    })
  }
  const notSee=()=>{
    dispatch({
      type:"secHandSellingRecord/getInitData",
      payload:{
        id:projectId,
        pageNo:0,
        pageSize:10,
        status:"等待带看"
      }
    })
    dispatch({
      type:"secHandSellingRecord/saveCurrentStatus",
      payload:{currentStatus:"等待带看",tableLoading:true}
    })
  }
  const miss=()=>{
    dispatch({
      type:"secHandSellingRecord/getInitData",
      payload:{
        id:projectId,
        pageNo:0,
        pageSize:10,
        status:"带看失败"
      }
    })
    dispatch({
      type:"secHandSellingRecord/saveCurrentStatus",
      payload:{currentStatus:"带看失败",tableLoading:true}
    })
  }
  const toPrve=()=>{
    dispatch(routerRedux.push({
      pathname:'/houseResourceSaleManagement/secondHandHouseSell/secHandSellingNavBar/secHandSellingAgentBroker',
      state:{
        projectId:projectId
      }
    }))
  }
  const toNext=()=>{
    dispatch(routerRedux.push({
      pathname:'/houseResourceSaleManagement/secondHandHouseSell/secHandSellingNavBar/secHandSellingDeal',
      state:{
        projectId:projectId
      }
    }))
  }
  const handeBack=()=>{
    dispatch(routerRedux.push({
      pathname:'/houseResourceSaleManagement/secondHandHouseSell'
    }))
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
      <div style={{paddingTop:"10px"}}>
        <Button type="primary" onClick={toPrve} style={{marginRight:"10px"}}>上一步</Button>
        <Button type="primary" onClick={toNext} style={{marginRight:"10px"}}>下一步</Button>
        <Button type="ghost" onClick={handeBack} style={{marginRight:"10px"}}>返回</Button>
      </div>
    </div>
  )
}

function mapStateToProps({secHandSellingRecord}){
  return{secHandSellingRecord}
}
export default connect(mapStateToProps)(SecHandSellingRecord);
