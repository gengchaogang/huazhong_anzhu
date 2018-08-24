import React from 'react'
import {Button,Row,Col,Tag,Table} from 'antd'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import DxPanel from '../../../../../../commons/components/DxPanel'
import PromptModal from '../../../../../../commons/View/PromptModal'
import AgentBrokers from '../../../../../components/resourceManagement/secondhandHouseSell/AgentBrokers';
function SecHandSellingAgentBroker({dispatch,secHandSellingAgentBroker}){
  const {
    agentBrokersData,
    promptObj,
    projectId,
  }=secHandSellingAgentBroker
  console.log('agentBrokersData',agentBrokersData);
  const toPrve=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/secondhandHouseSell/secHandSellingNavBar/secHandSellingVideoAndImgs',
      state:{
        projectId:projectId
      }
    }))
  }
  const toNext=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/secondhandHouseSell/secHandSellingNavBar/secHandSellingRecord',
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
  const handleCallBackOk=()=>{
    if(promptObj.todo==='closeModal'){
      dispatch({type:"secHandSellingAgentBroker/togglePrompt",payload:{visible:false}})
    }
  }
  const handleCallBackCancel=()=>{

  }
  const AgentBrokersProps={
    data:agentBrokersData,
  };
  return(
    <div className="secHandSellingAgentBroker">
      <PromptModal {...promptObj} onOk={handleCallBackOk} onCancel={handleCallBackCancel}/>
      <DxPanel title="代理经纪人">
        <AgentBrokers {...AgentBrokersProps}/>
      </DxPanel>
      <div>
        <Button type="primary" onClick={toPrve}>上一步</Button>
        <Button type="primary" onClick={toNext}>下一步</Button>
        <Button type="ghost" onClick={handeBack}>返回</Button>
      </div>
    </div>
  )
}
function mapStateToProps({secHandSellingAgentBroker}){
  return{secHandSellingAgentBroker}
}
export default connect(mapStateToProps)(SecHandSellingAgentBroker)
