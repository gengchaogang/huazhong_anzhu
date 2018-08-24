import React from 'react'
import {Button,Row,Col,Icon} from 'antd'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import PromptModal from '../../../../../../commons/View/PromptModal'
import DxPanel from '../../../../../../commons/components/DxPanel'
import './secHandRentedVideoAndImgs.css'
import HouseVideoAndImgs from '../../../../../components/resourceManagement/newHouseProDetails/HouseVideoAndImgs'
function SecHandRentedVideoAndImgs({dispatch,secHandRentedVideoAndImgs}){
  const {
    initData,
    promptObj,
    projectId,
  }=secHandRentedVideoAndImgs
  const handleCallBackOk=()=>{
    if(promptObj.todo==="closeModal"){
      dispatch({type:"secHandRentedVideoAndImgs/togglePrompt",payload:{visible:false}})
    }
  }
  const handleCallBackCancel=()=>{

  }
  const toPrve=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/secondhandHouseRent/secHandRentedNavBar/secHandRentedDetails',
      state:{
        projectId:projectId
      }
    }))
  }
  const toNext=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/secondhandHouseRent/secHandRentedNavBar/secHandRentedAgentBroker',
      state:{
        projectId:projectId
      }
    }))
  }
  const handeBack=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/secondhandHouseRent'
    }))
  }
  const adoptImgs=()=>{
    console.log('aaaa');
  }
  return(
    <div className="secHandRentedVideoAndImgs">
      <PromptModal {...promptObj} onOk={handleCallBackOk} onCancel={handleCallBackCancel}/>
      <HouseVideoAndImgs initData={initData} adoptImgs={adoptImgs}/>
      <div>
        <Button type="primary" onClick={toPrve}>上一步</Button>
        <Button type="primary" onClick={toNext}>下一步</Button>
        <Button type="ghost" onClick={handeBack}>返回</Button>
      </div>
    </div>
  )
}
function mapStateToProps({secHandRentedVideoAndImgs}){
  return{secHandRentedVideoAndImgs}
}
export default connect(mapStateToProps)(SecHandRentedVideoAndImgs)
