import React from 'react'
import {Button,Row,Col,Tag} from 'antd'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import DxPanel from '../../../../../commons/components/DxPanel'
import './storeSellingDetails.css'
import PromptModal from '../../../../../commons/View/PromptModal'
import UnloadHouseModal from '../../../../components/houseResourceManagement/housingDetails/UnloadHouseModal';
import HouseState from '../../../../components/houseResourceManagement/newHouseProDetails/HouseState'
import HouseDetails from '../../../../components/houseResourceManagement/newHouseProDetails/HouseDetails'
import HouseImgs from '../../../../components/houseResourceManagement/newHouseProDetails/HouseImgs'
function StoreSellingDetails({dispatch,storeSellingDetails}){
  const {
    houseImgs,
    pics,
    detailsData,
    modalVisible,
    promptObj,
    projectId,
  }=storeSellingDetails
  const changeVisible=(bool)=>{
    dispatch({
      type:'storeSellingDetails/changeSubmitLoading',
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
      type:'storeSellingDetails/offLineSecondHouse',
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
      pathname:'/houseResourceSaleManagement/shopsSell/storeSellingNavBar/storeSellingVideoAndImgs',
      state:{
        projectId:projectId
      }
    }))
  }
  const handeBack=()=>{
    dispatch(routerRedux.push({
      pathname:'/houseResourceSaleManagement/shopsSell'
    }))
  }
  const handleCallBackOk=()=>{
    if(promptObj.todo==="closeModal"){
      dispatch({type:"storeSellingDetails/togglePrompt",payload:{visible:false}})
    }
  }
  const handleCallBackCancel=()=>{

  }
  return(
    <div className="storeSellingDetails">
      <PromptModal {...promptObj} onOk={handleCallBackOk} onCancel={handleCallBackCancel}/>
      <UnloadHouseModal {...UnloadHouseModalProps}/>
      <HouseState detailsData={!!detailsData?detailsData:{}} type="在售"/>
      <HouseDetails detailsData={!!detailsData?detailsData:{}} houseImgs={!!houseImgs&&houseImgs.length!==0?houseImgs:[]} type="商铺出售"/>
      <HouseImgs pics={!!pics?pics:{}}/>
      <div className="details_buttons">
        <Button type="primary" onClick={()=>changeVisible(true)}>下架</Button>
        <Button type="primary" onClick={toNext}>下一步</Button>
        <Button type="ghost" onClick={handeBack}>返回</Button>
      </div>
    </div>
  )
}
function mapStateToProps({storeSellingDetails}){
  return{storeSellingDetails}
}
export default connect(mapStateToProps)(StoreSellingDetails)
