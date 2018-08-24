import React from 'react'
import {Button,Row,Col,Tag} from 'antd'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import DxPanel from '../../../../../commons/components/DxPanel'
import './storeRentedDetails.css'
import PromptModal from '../../../../../commons/View/PromptModal'
import HouseState from '../../../../components/resourceManagement/newHouseProDetails/HouseState'
import HouseDetails from '../../../../components/resourceManagement/newHouseProDetails/HouseDetails'
import HouseImgs from '../../../../components/resourceManagement/newHouseProDetails/HouseImgs'
function StoreRentedDetails({dispatch,storeRentedDetails}){
  const {
    houseImgs,
    pics,
    detailsData,
    promptObj,
    projectId,
  }=storeRentedDetails
  const offLine=(values)=>{
    console.log('values',values);
  }
  const toNext=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/storeRent/storeRentedNavBar/storeRentedVideoAndImgs',
      state:{
        projectId:projectId
      }
    }))
  }
  const handeBack=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/storeRent'
    }))
  }
  const handleCallBackOk=()=>{
    if(promptObj.todo==="closeModal"){
      dispatch({type:"storeRentedDetails/togglePrompt",payload:{visible:false}})
    }
  }
  const handleCallBackCancel=()=>{

  }
  return(
    <div className="storeRentedDetails">
      <PromptModal {...promptObj} onOk={handleCallBackOk} onCancel={handleCallBackCancel}/>
      <HouseState detailsData={!!detailsData?detailsData:{}} type="在售"/>
      <HouseDetails detailsData={!!detailsData?detailsData:{}} houseImgs={!!houseImgs&&houseImgs.length!==0?houseImgs:[]} type="商铺出租"/>
      <HouseImgs pics={!!pics?pics:{}}/>
      <div>
        <Button type="primary" onClick={toNext}>下一步</Button>
        <Button type="ghost" onClick={handeBack}>返回</Button>
      </div>
    </div>
  )
}
function mapStateToProps({storeRentedDetails}){
  return{storeRentedDetails}
}
export default connect(mapStateToProps)(StoreRentedDetails)
