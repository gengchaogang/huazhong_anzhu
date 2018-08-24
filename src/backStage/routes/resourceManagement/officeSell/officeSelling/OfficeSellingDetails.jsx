import React from 'react'
import {Button,Row,Col,Tag} from 'antd'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import DxPanel from '../../../../../commons/components/DxPanel'
import './officeSellingDetails.css'
import PromptModal from '../../../../../commons/View/PromptModal'
import UnloadHouseModal from '../../../../components/resourceManagement/secondhandHouseSell/housingDetails/UnloadHouseModal';
import HouseState from '../../../../components/resourceManagement/newHouseProDetails/HouseState'
import HouseDetails from '../../../../components/resourceManagement/newHouseProDetails/HouseDetails'
import HouseImgs from '../../../../components/resourceManagement/newHouseProDetails/HouseImgs'
function OfficeSellingDetails({dispatch,officeSellingDetails}){
  const {
    houseImgs,
    pics,
    detailsData,
    modalVisible,
    promptObj,
    projectId,
  }=officeSellingDetails
  const changeVisible=(bool)=>{
    dispatch({
      type:'officeSellingDetails/changeSubmitLoading',
      payload:{
        modalVisible:bool
      }
    });
  };
  const offLine=(values)=>{
    // console.log('values',values);
    let offLineReason='';
    if(!!values.otherReason && !!values.unloadReason){
      offLineReason=values.otherReason+'/'+values.unloadReason.join('/');
    }else if(!!values.otherReason){
      offLineReason=values.otherReason
    }else if(!!values.unloadReason){
      offLineReason=values.unloadReason.join('/');
    }
    dispatch({
      type:'officeSellingDetails/offLineSecondHouse',
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
      pathname:'/resourceManagement/officeBuildingSell/officeSellingNavBar/officeSellingVideoAndImgs',
      state:{
        projectId:projectId
      }
    }))
  }
  const handeBack=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/officeBuildingSell'
    }))
  }
  const handleCallBackOk=()=>{
    if(promptObj.todo==="closeModal"){
      dispatch({type:"officeSellingDetails/togglePrompt",payload:{visible:false}})
    }
  }
  const handleCallBackCancel=()=>{

  }
  return(
    <div className="officeSellingDetails">
      <PromptModal {...promptObj} onOk={handleCallBackOk} onCancel={handleCallBackCancel}/>
      <UnloadHouseModal {...UnloadHouseModalProps}/>
      <HouseState detailsData={!!detailsData?detailsData:{}} type="在售"/>
      <HouseDetails detailsData={!!detailsData?detailsData:{}} houseImgs={!!houseImgs&&houseImgs.length!==0?houseImgs:[]} type="写字楼出售"/>
      <HouseImgs pics={!!pics?pics:{}}/>
      <div>
        <Button type="primary" onClick={()=>changeVisible(true)}>下架</Button>
        <Button type="primary" onClick={toNext}>下一步</Button>
        <Button type="ghost" onClick={handeBack}>返回</Button>
      </div>
    </div>
  )
}
function mapStateToProps({officeSellingDetails}){
  return{officeSellingDetails}
}
export default connect(mapStateToProps)(OfficeSellingDetails)
