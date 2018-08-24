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
function StoreSellingDeal({dispatch,storeSellingDeal}){
  const {
    promptObj,
    projectId,
    track,
  }=storeSellingDeal;
  const handleCallBackOk=()=>{

  }
  const handleCallBackCancel=()=>{

  }
  const toPrve=()=>{
    dispatch(routerRedux.push({
      pathname:'/houseResourceSaleManagement/shopsSell/storeSellingNavBar/storeSellingRecord',
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
function mapStateToProps({storeSellingDeal}){
  return{storeSellingDeal}
}
export default connect(mapStateToProps)(StoreSellingDeal)
