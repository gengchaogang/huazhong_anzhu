import React from 'react'
import {Button,Row,Col,Tag} from 'antd'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import DxPanel from '../../../../../commons/components/DxPanel'
import './officeSelledDetails.css'
import PromptModal from '../../../../../commons/View/PromptModal'
import HouseState from '../../../../components/resourceManagement/newHouseProDetails/HouseState'
import HouseDetails from '../../../../components/resourceManagement/newHouseProDetails/HouseDetails'
import HouseImgs from '../../../../components/resourceManagement/newHouseProDetails/HouseImgs'
function OfficeSelledDetails({dispatch,officeSelledDetails}){
  const {
    houseImgs,
    pics,
    detailsData,
    promptObj,
    projectId,
  }=officeSelledDetails
  const offLine=(values)=>{
    console.log('values',values);
  }
  const toNext=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/officeBuildingSell/officeSelledNavBar/officeSelledVideoAndImgs',
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
      dispatch({type:"officeSelledDetails/togglePrompt",payload:{visible:false}})
    }
  }
  const handleCallBackCancel=()=>{

  }
  return(
    <div className="officeSelledDetails">
      <PromptModal {...promptObj} onOk={handleCallBackOk} onCancel={handleCallBackCancel}/>
      <HouseState detailsData={!!detailsData?detailsData:{}} type="已售"/>
      <HouseDetails detailsData={!!detailsData?detailsData:{}} houseImgs={!!houseImgs&&houseImgs.length!==0?houseImgs:[]} type="写字楼出售"/>
      <HouseImgs pics={!!pics?pics:{}}/>
      <div>
        <Button type="primary" onClick={toNext}>下一步</Button>
        <Button type="ghost" onClick={handeBack}>返回</Button>
      </div>
    </div>
  )
}
function mapStateToProps({officeSelledDetails}){
  return{officeSelledDetails}
}
export default connect(mapStateToProps)(OfficeSelledDetails)
