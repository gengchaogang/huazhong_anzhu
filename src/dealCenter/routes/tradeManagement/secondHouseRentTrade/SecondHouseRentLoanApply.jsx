import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import {Button} from 'antd';
import DxPanel from '../../../../commons/components/DxPanel'
import PromptModal from '../../../../commons/View/PromptModal'
import SHRentTradeInfo from '../../../../commons/components/SHRentTradeInfo'
import SHRentLoanApplyModal from '../../../components/secondHouseRentTrade/SHRentLoanApplyModal'

import './SecondHouseRentLoanApply.css'
const SecondHouseRentLoanApply=({dispatch,secondHouseRentLoanApply})=>{
  const{trackJSON,applyModal,promptObj}=secondHouseRentLoanApply;
  return (
    <div className='secondHouseRentLoanApply'>
      {!!applyModal.visible && <SHRentLoanApplyModal {...applyModal} onOk={(data)=>dispatch({
        type:'secondHouseRentLoanApply/postLoanApply',
        payload:data,
      })} onCancel={()=>dispatch({
        type:'secondHouseRentLoanApply/closeApplyModal',
      })} onCusTypeChange={(value)=>dispatch({
        type:'secondHouseRentLoanApply/onCusTypeChange',
        payload:value,
      })} cusTypeValueChange={(value)=>dispatch({
        type:'secondHouseRentLoanApply/cusTypeValueChange',
        payload:value,
      })}/>}
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'secondHouseRentLoanApply/closePrompt'})} onCancel={()=>dispatch({type:'secondHouseRentLoanApply/closePrompt'})}/>
      {!!trackJSON && <SHRentTradeInfo trackJSON={trackJSON} type='tradeCenter'/>}
      <div className='anzhu_bottom_area'>
        <Button type='primary' onClick={()=>dispatch({
            type:'secondHouseRentLoanApply/getApplyLoanData',
          })}>申请租房分期</Button>
        <Button type='ghost' onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
      </div>
    </div>
  )
}

SecondHouseRentLoanApply.propTypes = {
  secondHouseRentLoanApply: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps({secondHouseRentLoanApply}) {
  return {secondHouseRentLoanApply}
}
function filterAuditor(input, option){
  return option.props.children.indexOf(input) >= 0;
}
export default connect(mapStateToProps)(SecondHouseRentLoanApply);
