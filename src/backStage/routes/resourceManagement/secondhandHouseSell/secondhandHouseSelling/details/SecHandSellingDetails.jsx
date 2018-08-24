import React from 'react'
import {Button,Row,Col,Tag} from 'antd'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import DxPanel from '../../../../../../commons/components/DxPanel'
import './secHandSellingDetails.css'
import PromptModal from '../../../../../../commons/View/PromptModal'
import UnloadHouseModal from '../../../../../components/resourceManagement/secondhandHouseSell/housingDetails/UnloadHouseModal';
import HouseState from '../../../../../components/resourceManagement/newHouseProDetails/HouseState'
import HouseDetails from '../../../../../components/resourceManagement/newHouseProDetails/HouseDetails'
import HouseImgs from '../../../../../components/resourceManagement/newHouseProDetails/HouseImgs'
function SecHandSellingDetails({dispatch,secHandSellingDetails}){
  const {
    pics,
    detailsData,
    modalVisible,
    promptObj,
    projectId,
    isSelled,
    transCode,
  }=secHandSellingDetails
  // console.log('detailsData',detailsData);
  // console.log('pics',pics);
  const changeVisible=(bool)=>{
    dispatch({
      type:'secHandSellingDetails/changeSubmitLoading',
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
      type:'secHandSellingDetails/offLineSecondHouse',
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
    console.log(transCode,'transCodetransCode>>');
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/secondhandHouseSell/secHandSellingNavBar/secHandSellingVideoAndImgs',
      state:{
        projectId:projectId,
        transCode:transCode,
      }
    }))
  }
  const handeBack=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/secondhandHouseSell'
    }))
  }
  const handleCallBackOk=()=>{
    if(promptObj.todo==="closeModal"){
      dispatch({type:"secHandSellingDetails/togglePrompt",payload:{visible:false}})
    }
  }
  const handleCallBackCancel=()=>{

  }
  return(
    <div className="secHandSellingDetails">
      <PromptModal {...promptObj} onOk={handleCallBackOk} onCancel={handleCallBackCancel}/>
      <UnloadHouseModal {...UnloadHouseModalProps}/>
      <HouseState detailsData={!!detailsData?detailsData:{}} type="在售"/>
      <HouseDetails detailsData={!!detailsData?detailsData:{}} type="二手房出售"/>
      <HouseImgs pics={!!pics?pics:{}} type="二手房出售"/>
      <div>
        <Button type="primary" onClick={()=>changeVisible(true)}>下架</Button>
        <Button type="primary" onClick={toNext}>下一步</Button>
        <Button type="ghost" onClick={handeBack}>返回</Button>
      </div>
    </div>
  )
}
function mapStateToProps({secHandSellingDetails}){
  return{secHandSellingDetails}
}
export default connect(mapStateToProps)(SecHandSellingDetails)
