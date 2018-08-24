import React from 'react'
import {Button,Row,Col,Tag} from 'antd'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import DxPanel from '../../../../../commons/components/DxPanel'
import './secHandSellingDetails.css'
import PromptModal from '../../../../../commons/View/PromptModal'
import UnloadHouseModal from '../../../../components/houseResourceManagement/housingDetails/UnloadHouseModal';
import HouseState from '../../../../components/houseResourceManagement/newHouseProDetails/HouseState'
import HouseDetails from '../../../../components/houseResourceManagement/newHouseProDetails/HouseDetails'
import HouseImgs from '../../../../components/houseResourceManagement/newHouseProDetails/HouseImgs'
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
      pathname:'/houseResourceSaleManagement/secondHandHouseSell/secHandSellingNavBar/secHandSellingVideoAndImgs',
      state:{
        projectId:projectId,
        transCode:transCode,
      }
    }))
  }
  const handeBack=()=>{
    dispatch(routerRedux.push({
      pathname:'/houseResourceSaleManagement/secondHandHouseSell'
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
      <div className="buttons">
        <Button type="primary" onClick={toNext} style={{marginRight:"10px"}}>下一步</Button>
        <Button type="ghost" onClick={handeBack}>返回</Button>
      </div>
    </div>
  )
}
function mapStateToProps({secHandSellingDetails}){
  return{secHandSellingDetails}
}
export default connect(mapStateToProps)(SecHandSellingDetails)
