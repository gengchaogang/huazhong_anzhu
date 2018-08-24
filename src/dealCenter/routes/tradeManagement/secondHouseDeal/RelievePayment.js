import React from 'react'
import {Button} from 'antd'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import  HousingDischarge from '../../../components/Modals/HousingDischarge'

function RelievePayment({secondDeal,dispatch}){

  const {showApplyLoan}=secondDeal;
  return (
    <div>
      <Button type="primary" onClick={
        ()=>{
          dispatch({
            type:'secondDeal/setState',
            payload:{
              HousingDischargeVisible:true
            }
          })
        }
      } size="large">申请房产解压</Button>
      <Button type="ghost" onClick={
        ()=>dispatch(routerRedux.goBack())
      } size="large">返回</Button>
      <HousingDischarge/>
    </div>
  );
}

function mapStateToProps({secondDeal}){
  return {secondDeal}
}

export default connect(mapStateToProps)(RelievePayment);
