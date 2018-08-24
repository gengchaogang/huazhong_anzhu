import React from 'react'
import {Button,Row,Col,Tag,Table} from 'antd'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import DxPanel from '../../../../../commons/components/DxPanel'
import PromptModal from '../../../../../commons/View/PromptModal'
import AgentBrokers from '../../../../components/houseResourceManagement/AgentBrokers';
function StoreRentingAgentBroker({dispatch,storeRentingAgentBroker}){
  const {
    agentBrokersData,
    promptObj,
    projectId,
  }=storeRentingAgentBroker

  const toPrve=()=>{
    dispatch(routerRedux.push({
      pathname:'/houseResourceRentManagement/shopsRent/storeRentingNavBar/storeRentingVideoAndImgs',
      state:{
        projectId:projectId
      }
    }))
  }
  const toNext=()=>{
    dispatch(routerRedux.push({
      pathname:'/houseResourceRentManagement/shopsRent/storeRentingNavBar/storeRentingRecord',
      state:{
        projectId:projectId
      }
    }))
  }
  const handeBack=()=>{
    dispatch(routerRedux.push({
      pathname:'/houseResourceRentManagement/shopsRent'
    }))
  }
  const handleCallBackOk=()=>{
    dispatch({type:"storeRentingAgentBroker/togglePrompt",payload:{visible:false}})
  }
  const handleCallBackCancel=()=>{

  }
  const AgentBrokersProps={
    data:agentBrokersData,
  };
  return(
    <div className="storeRentingAgentBroker">
      <PromptModal {...promptObj} onOk={handleCallBackOk} onCancel={handleCallBackCancel}/>
      <DxPanel title="代理经纪人">
        <AgentBrokers {...AgentBrokersProps}/>
      </DxPanel>
      <div className="details_buttons">
        <Button type="primary" onClick={toPrve}>上一步</Button>
        <Button type="primary" onClick={toNext}>下一步</Button>
        <Button type="ghost" onClick={handeBack}>返回</Button>
      </div>
    </div>
  )
}
function mapStateToProps({storeRentingAgentBroker}){
  return{storeRentingAgentBroker}
}
export default connect(mapStateToProps)(StoreRentingAgentBroker)
