import React from 'react'
import {Button,Row,Col,Icon} from 'antd'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import PromptModal from '../../../../../commons/View/PromptModal'
import DxPanel from '../../../../../commons/components/DxPanel'
import './secHandRentingVideoAndImgs.css'
import HouseVideoAndImgs from '../../../../components/houseResourceManagement/newHouseProDetails/HouseVideoAndImgs'
function SecHandRentingVideoAndImgs({dispatch,secHandRentingVideoAndImgs}){
  const {
    initData,
    promptObj,
    projectId,
  }=secHandRentingVideoAndImgs
  const handleCallBackOk=()=>{
    if(promptObj.todo==="closeModal"){
      dispatch({type:"secHandRentingVideoAndImgs/togglePrompt",payload:{visible:false}})
    }
  }
  const handleCallBackCancel=()=>{

  }
  const toPrve=()=>{
    dispatch(routerRedux.push({
      pathname:'/houseResourceRentManagement/secondHandHouseRent/secHandRentingNavBar/secHandRentingDetails',
      state:{
        projectId:projectId
      }
    }))
  }
  const toNext=()=>{
    dispatch(routerRedux.push({
      pathname:'/houseResourceRentManagement/secondHandHouseRent/secHandRentingNavBar/secHandRentingAgentBroker',
      state:{
        projectId:projectId
      }
    }))
  }
  const handeBack=()=>{
    dispatch(routerRedux.push({
      pathname:'/houseResourceRentManagement/secondHandHouseRent'
    }))
  }
  const adoptImgs=()=>{
    console.log('aaaa');
  }
  return(
    <div className="secHandRentingVideoAndImgs">
      <PromptModal {...promptObj} onOk={handleCallBackOk} onCancel={handleCallBackCancel}/>
      <HouseVideoAndImgs initData={initData} adoptImgs={adoptImgs}/>
      <div className="details_buttons">
        <Button type="primary" onClick={toPrve}>上一步</Button>
        <Button type="primary" onClick={toNext}>下一步</Button>
        <Button type="ghost" onClick={handeBack}>返回</Button>
      </div>
    </div>
  )
}
function mapStateToProps({secHandRentingVideoAndImgs}){
  return{secHandRentingVideoAndImgs}
}
export default connect(mapStateToProps)(SecHandRentingVideoAndImgs)
