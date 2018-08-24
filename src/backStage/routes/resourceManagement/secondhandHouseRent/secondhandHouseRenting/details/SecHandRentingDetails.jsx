import React from 'react'
import {Button,Row,Col,Tag} from 'antd'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import DxPanel from '../../../../../../commons/components/DxPanel'
import './secHandRentingDetails.css'
import PromptModal from '../../../../../../commons/View/PromptModal'
import UnloadHouseModal from '../../../../../components/resourceManagement/secondhandHouseSell/housingDetails/UnloadHouseModal';
import HouseState from '../../../../../components/resourceManagement/newHouseProDetails/HouseState'
import HouseDetails from '../../../../../components/resourceManagement/newHouseProDetails/HouseDetails'
import HouseImgs from '../../../../../components/resourceManagement/newHouseProDetails/HouseImgs'
function SecHandRentingDetails({dispatch,secHandRentingDetails}){
  const {
    houseImgs,
    pics,
    detailsData,
    modalVisible,
    promptObj,
    projectId,
  }=secHandRentingDetails
  // console.log('houseImgs',houseImgs);
  const changeVisible=(bool)=>{
    dispatch({
      type:'secHandRentingDetails/changeSubmitLoading',
      payload:{
        modalVisible:bool
      }
    });
  };
  const offLine=(values)=>{
    // console.log('values',values,projectId);
    let offLineReason='';
    if(!!values.otherReason && !!values.unloadReason){
      offLineReason=values.otherReason+'/'+values.unloadReason.join('/');
    }else if(!!values.otherReason){
      offLineReason=values.otherReason
    }else if(!!values.unloadReason){
      offLineReason=values.unloadReason.join('/');
    }
    dispatch({
      type:'secHandRentingDetails/offLineSecondHouse',
      payload:{
        offLineReason:offLineReason,
        houseId:projectId,
      }
    })
  }
  const UnloadHouseModalProps={
		modalVisible,
		changeVisible,
    offLine,
	};
  const toNext=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/secondhandHouseRent/secHandRentingNavBar/secHandRentingVideoAndImgs',
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
  const handleCallBackOk=()=>{
    if(promptObj.todo==="closeModal"){
      dispatch({type:"secHandRentingDetails/togglePrompt",payload:{visible:false}})
    }
  }
  const handleCallBackCancel=()=>{

  }
  return(
    <div className="secHandRentingDetails">
      <PromptModal {...promptObj} onOk={handleCallBackOk} onCancel={handleCallBackCancel}/>
      <UnloadHouseModal {...UnloadHouseModalProps}/>
      <HouseState detailsData={!!detailsData?detailsData:{}} type="在售"/>
      <HouseDetails detailsData={!!detailsData?detailsData:{}} houseImgs={!!houseImgs&&houseImgs.length!==0?houseImgs:[]} type="二手房出租"/>
      <HouseImgs pics={!!pics?pics:{}}/>
      <div>
        <Button type="primary" onClick={()=>changeVisible(true)}>下架</Button>
        <Button type="primary" onClick={toNext}>下一步</Button>
        <Button type="ghost" onClick={handeBack}>返回</Button>
      </div>
    </div>
  )
}
function mapStateToProps({secHandRentingDetails}){
  return{secHandRentingDetails}
}
export default connect(mapStateToProps)(SecHandRentingDetails)
