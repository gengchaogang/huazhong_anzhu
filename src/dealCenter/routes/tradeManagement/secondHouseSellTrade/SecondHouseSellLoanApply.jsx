import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import {Button} from 'antd';
import DxPanel from '../../../../commons/components/DxPanel'
import PromptModal from '../../../../commons/View/PromptModal'
// import SecondHouseTradeDetails from '../../../components/secondHouseSellTrade/SecondHouseTradeDetails'
import SHSellTradeInfo from '../../../../commons/components/SHSellTradeInfo'
import SHSellLoanApplyModal from '../../../components/secondHouseSellTrade/SHSellLoanApplyModal'


import './SecondHouseSellLoanApply.css'
const SecondHouseSellLoanApply=({dispatch,secondHouseSellLoanApply})=>{
  const{trackJSON,applyModal,promptObj}=secondHouseSellLoanApply;
  return (
    <div className='secondHouseSellLoanApply'>
      {!!applyModal.visible && <SHSellLoanApplyModal {...applyModal} onOk={(data)=>dispatch({
        type:'secondHouseSellLoanApply/postLoanApply',
        payload:data,
      })} onCancel={()=>dispatch({
        type:'secondHouseSellLoanApply/closeApplyModal',
      })}/>}
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'secondHouseSellLoanApply/closePrompt'})} onCancel={()=>dispatch({type:'secondHouseSellLoanApply/closePrompt'})}/>
      {!!trackJSON && <SHSellTradeInfo type='tradeCenter' trackJSON={trackJSON}/>}
      <div className='anzhua_button_bottom'>
        <Button type='primary' onClick={()=>dispatch({
            type:'secondHouseSellLoanApply/getApplyLoanData',
          })}>申请贷款</Button>
        <Button type='ghost' onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
      </div>
    </div>
  )
}

SecondHouseSellLoanApply.propTypes = {
  secondHouseSellLoanApply: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps({secondHouseSellLoanApply}) {
  return {secondHouseSellLoanApply}
}
function filterAuditor(input, option){
  return option.props.children.indexOf(input) >= 0;
}
export default connect(mapStateToProps)(SecondHouseSellLoanApply);
