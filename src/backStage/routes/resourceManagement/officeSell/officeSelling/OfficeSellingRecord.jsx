import React from 'react';
import {connect} from 'dva';
import {routerRedux}from 'dva/router'
import {Table,Button} from 'antd';
import HouseRecord from '../../../../components/resourceManagement/newHouseProDetails/HouseRecord'
import PromptModal from '../../../../../commons/View/PromptModal'
function OfficeSellingRecord({dispatch,officeSellingRecord}){
  const {
    currentStatus,
    tableData,
    totalElements,
    tableLoading,
    promptObj,
    projectId,
  }=officeSellingRecord;
  const handleAll=()=>{
    dispatch({
      type:"storeSellingRecord/getInitData",
      payload:{
        id:projectId,
        pageNo:0,
        pageSize:10,
        status:"",
      }
    })
    dispatch({
      type:"storeSellingRecord/saveCurrentStatus",
      payload:{currentStatus:"",tableLoading:true}
    })
  }
  const alreadySee=()=>{
    dispatch({
      type:"storeSellingRecord/getInitData",
      payload:{
        id:projectId,
        pageNo:0,
        pageSize:10,
        status:"带看成功"
      }
    })
    dispatch({
      type:"storeSellingRecord/saveCurrentStatus",
      payload:{currentStatus:"带看成功",tableLoading:true}
    })
  }
  const notSee=()=>{
    dispatch({
      type:"storeSellingRecord/getInitData",
      payload:{
        id:projectId,
        pageNo:0,
        pageSize:10,
        status:"等待带看"
      }
    })
    dispatch({
      type:"storeSellingRecord/saveCurrentStatus",
      payload:{currentStatus:"等待带看",tableLoading:true}
    })
  }
  const miss=()=>{
    dispatch({
      type:"storeSellingRecord/getInitData",
      payload:{
        id:projectId,
        pageNo:0,
        pageSize:10,
        status:"带看失败"
      }
    })
    dispatch({
      type:"storeSellingRecord/saveCurrentStatus",
      payload:{currentStatus:"带看失败",tableLoading:true}
    })
  }

  const toPrve=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/officeBuildingSell/officeSellingNavBar/officeSellingAgentBroker',
      state:{
        projectId:projectId
      }
    }))
  }
  const toNext=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/officeBuildingSell/officeSellingNavBar/officeSellingDeal',
      state:{
        projectId:projectId
      }
    }))
  }
  const handeBack=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/officeBuildingSell'
    }))
  }
  const onPageChange=(page)=>{
    dispatch({
      type:"storeSellingRecord/getInitData",
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
        type:"storeSellingRecord/togglePrompt",
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
      <Button type="primary" onClick={toPrve}>上一步</Button>
      <Button type="primary" onClick={toNext}>下一步</Button>
      <Button type="ghost" onClick={handeBack}>返回</Button>
    </div>
  )
}

function mapStateToProps({officeSellingRecord}){
  return{officeSellingRecord}
}
export default connect(mapStateToProps)(OfficeSellingRecord);
