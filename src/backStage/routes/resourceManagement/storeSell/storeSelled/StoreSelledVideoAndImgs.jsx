import React from 'react'
import {Button,Row,Col,Icon} from 'antd'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import PromptModal from '../../../../../commons/View/PromptModal'
import DxPanel from '../../../../../commons/components/DxPanel'
import './storeSelledVideoAndImgs.css'
import HouseVideoAndImgs from '../../../../components/resourceManagement/newHouseProDetails/HouseVideoAndImgs'
function StoreSelledVideoAndImgs({dispatch,storeSelledVideoAndImgs}){
  const {
    initData,
    promptObj,
    projectId,
  }=storeSelledVideoAndImgs
  const handleCallBackOk=()=>{
    if(promptObj.todo==="closeModal"){
      dispatch({type:"storeSelledVideoAndImgs/togglePrompt",payload:{visible:false}})
    }
  }
  const handleCallBackCancel=()=>{

  }
  const toPrve=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/storeSell/storeSelledNavBar/storeSelledDetails',
      state:{
        projectId:projectId
      }
    }))
  }
  const adoptImgs=()=>{
    console.log('aaaa');
  }
  const toNext=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/storeSell/storeSelledNavBar/storeSelledAgentBroker',
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
  return(
    <div className="storeSelledVideoAndImgs">
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
function mapStateToProps({storeSelledVideoAndImgs}){
  return{storeSelledVideoAndImgs}
}
export default connect(mapStateToProps)(StoreSelledVideoAndImgs)
