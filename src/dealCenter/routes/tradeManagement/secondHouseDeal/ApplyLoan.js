import React from 'react'
import {Button} from 'antd'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import ApplyLoanModal from '../../../components/Modals/ApplyLoan';


function ApplyLoan({secondDeal,dispatch}){

  const {showApplyLoan}=secondDeal;
  return (
    <div>
      <Button type="primary" onClick={
        ()=>{
          dispatch({
            type:'secondDeal/setState',
            payload:{
              showApplyLoan:true
            }
          })
        }
      } size="large">申请贷款</Button>
      <Button type="ghost" onClick={
        ()=>dispatch(routerRedux.goBack())
      } size="large">返回</Button>
      <ApplyLoanModal
        visible={showApplyLoan}
        onCancel={()=>{
          dispatch({
            type:'secondDeal/setState',
            payload:{
              showApplyLoan:false
            }
          })
        }}
      />
    </div>
  );
}

function mapStateToProps({secondDeal}){
  return {secondDeal}
}

export default connect(mapStateToProps)(ApplyLoan);
