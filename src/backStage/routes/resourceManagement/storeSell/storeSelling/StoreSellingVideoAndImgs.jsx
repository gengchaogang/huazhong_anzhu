import React from 'react'
import {Button,Row,Col,Icon} from 'antd'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import PromptModal from '../../../../../commons/View/PromptModal'
import DxPanel from '../../../../../commons/components/DxPanel'
import './storeSellingVideoAndImgs.css'
import HouseVideoAndImgs from '../../../../components/resourceManagement/newHouseProDetails/HouseVideoAndImgs'
function StoreSellingVideoAndImgs({dispatch,storeSellingVideoAndImgs}){
  const {
    initData,
    promptObj,
    projectId,
  }=storeSellingVideoAndImgs
  const handleCallBackOk=()=>{
    if(promptObj.todo==="closeModal"){
      dispatch({type:"storeSellingVideoAndImgs/togglePrompt",payload:{visible:false}})
    }
  }
  const handleCallBackCancel=()=>{

  }
  const toPrve=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/storeSell/storeSellingNavBar/storeSellingDetails',
      state:{
        projectId:projectId
      }
    }))
  }
  const toNext=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/storeSell/storeSellingNavBar/storeSellingAgentBroker',
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
  const adoptImgs=()=>{
    console.log('aaaa');
  }
  return(
    <div className="storeSellingVideoAndImgs">
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
function mapStateToProps({storeSellingVideoAndImgs}){
  return{storeSellingVideoAndImgs}
}
export default connect(mapStateToProps)(StoreSellingVideoAndImgs)
