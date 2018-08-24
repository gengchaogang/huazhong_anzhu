import React from 'react'
import {connect} from 'dva';
import {
  Icon,
  Button,
  Timeline
} from 'antd';
import {routerRedux} from 'dva/router'
import DxPanel from '../../../../../commons/components/DxPanel'
import PromptModal from '../../../../../commons/View/PromptModal'
import SHSellTradeInfo from '../../../../../commons/components/SHSellTradeInfo'
import img from '../../../../assets/images/morentouinfg.png'
import './SecHandSellingDeal.css'
function SecHandSellingDeal({dispatch,secHandSellingDeal}){
  const {
    promptObj,
    projectId,
    trackData,
    track,
  }=secHandSellingDeal;
  const handleCallBackOk=()=>{

  }
  const handleCallBackCancel=()=>{

  }
  if(!!track){
    console.log(JSON.parse(track),'brokerInfo');
  }
  const toPrve=()=>{
    dispatch(routerRedux.push({
      pathname:'/houseResourceSaleManagement/secondHandHouseSell/secHandSellingNavBar/secHandSellingRecord',
      state:{
        projectId:projectId
      }
    }))
  }
  const handeBack=()=>{
    dispatch(routerRedux.push({
      pathname:'/houseResourceSaleManagement/secondHandHouseSell'
    }))
  }
  return (
    <div className="selling-strike-hands">
      <PromptModal {...promptObj} onOk={handleCallBackOk} onCancel={handleCallBackCancel}/>
      {!!track && <SHSellTradeInfo type='mentorRole' trackJSON={track}/>}
      <div className="details_buttons">
        <Button type="primary" onClick={toPrve}>上一步</Button>
        <Button type="ghost" onClick={handeBack}>返回</Button>
      </div>
    </div>
  );
}
function mapStateToProps({secHandSellingDeal}){
  return{secHandSellingDeal}
}
export default connect(mapStateToProps)(SecHandSellingDeal)
