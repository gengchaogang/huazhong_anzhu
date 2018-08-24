import React from 'react'
import {Button,Row,Col,Tag,Table} from 'antd'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import DxPanel from '../../../../../commons/components/DxPanel'
import PromptModal from '../../../../../commons/View/PromptModal'
import AgentBrokers from '../../../../components/resourceManagement/secondhandHouseSell/AgentBrokers';
function StoreSelledAgentBroker({dispatch,storeSelledAgentBroker}){
  const {
    agentBrokersData,
    promptObj,
    projectId,
  }=storeSelledAgentBroker

  const toPrve=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/storeSell/storeSelledNavBar/storeSelledVideoAndImgs',
      state:{
        projectId:projectId
      }
    }))
  }
  const toNext=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/storeSell/storeSelledNavBar/storeSelledRecord',
      state:{
        projectId:projectId
      }
    }))
  }
  const handeBack=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/storeSell'
    }))
  }
  const handleCallBackOk=()=>{
    dispatch({type:"storeSelledAgentBroker/togglePrompt",payload:{visible:false}})
  }
  const handleCallBackCancel=()=>{

  }
  const AgentBrokersProps={
    data:agentBrokersData,
  };
  return(
    <div className="storeSellimgAgentBroker">
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
function mapStateToProps({storeSelledAgentBroker}){
  return{storeSelledAgentBroker}
}
export default connect(mapStateToProps)(StoreSelledAgentBroker)
