import React from 'react'
import {Button,Row,Col,Icon} from 'antd'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import PromptModal from '../../../../../../commons/View/PromptModal'
import DxPanel from '../../../../../../commons/components/DxPanel'
import './secHandSellingVideoAndImgs.css'
import HouseVideoAndImgs from '../../../../../components/resourceManagement/newHouseProDetails/HouseVideoAndImgs'
function SecHandSellingVideoAndImgs({dispatch,secHandSellingVideoAndImgs}){
  const {
    initData,
    promptObj,
    projectId,
    transCode,
  }=secHandSellingVideoAndImgs;
  console.log(transCode,'secHandSellingVideoAndImgs');
  const handleCallBackOk=()=>{
    if(promptObj.todo==="closeModal"){
      dispatch({type:"secHandSellingVideoAndImgs/togglePrompt",payload:{visible:false}})
    }
  }
  const handleCallBackCancel=()=>{

  }
  const adoptImgs=()=>{
    // console.log('aaaa');
  }
  const toPrve=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/secondhandHouseSell/secHandSellingNavBar/secHandSellingDetails',
      state:{
        projectId:projectId
      }
    }))
  }
  const toNext=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/secondhandHouseSell/secHandSellingNavBar/secHandSellingAgentBroker',
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
    <div className="secHandSellingVideoAndImgs">
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
function mapStateToProps({secHandSellingVideoAndImgs}){
  return{secHandSellingVideoAndImgs}
}
export default connect(mapStateToProps)(SecHandSellingVideoAndImgs)
