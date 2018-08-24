import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import {Button} from 'antd';
import DxPanel from '../../../../commons/components/DxPanel'
import PromptModal from '../../../../commons/View/PromptModal'
// import SecondHouseTradeDetails from '../../../components/secondHouseSellTrade/SecondHouseTradeDetails'
import SHSellTradeInfo from '../../../../commons/components/SHSellTradeInfo'
import SHSellTransferApplyModal from '../../../components/secondHouseSellTrade/SHSellTransferApplyModal'


import './SecondHouseSellTransferApply.css'
const SecondHouseSellTransferApply=({dispatch,secondHouseSellTransferApply})=>{
  const{trackJSON,applyModal,promptObj}=secondHouseSellTransferApply;
  return (
    <div className='secondHouseSellTransferApply'>
      {!!applyModal.visible && <SHSellTransferApplyModal {...applyModal} onOk={(data)=>dispatch({
        type:'secondHouseSellTransferApply/postLoanApply',
        payload:data,
      })} onCancel={()=>dispatch({
        type:'secondHouseSellTransferApply/closeApplyModal',
      })}/>}
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'secondHouseSellTransferApply/closePrompt'})} onCancel={()=>dispatch({type:'secondHouseSellTransferApply/closePrompt'})}/>
      {!!trackJSON && <SHSellTradeInfo type='tradeCenter' trackJSON={trackJSON}/>}
      <div className='anzhua_button_bottom'>
        <Button type='primary' onClick={()=>dispatch({
            type:'secondHouseSellTransferApply/getApplyLoanData',
          })}>申请过户</Button>
        <Button type='ghost' onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
      </div>
    </div>
  )
}

SecondHouseSellTransferApply.propTypes = {
  secondHouseSellTransferApply: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps({secondHouseSellTransferApply}) {
  return {secondHouseSellTransferApply}
}
export default connect(mapStateToProps)(SecondHouseSellTransferApply);
