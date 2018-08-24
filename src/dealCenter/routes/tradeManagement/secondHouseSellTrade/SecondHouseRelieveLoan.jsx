import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import {Button} from 'antd'

import DxPanel from '../../../../commons/components/DxPanel'
import PromptModal from '../../../../commons/View/PromptModal'
// import SecondHouseTradeDetails from '../../../components/secondHouseSellTrade/SecondHouseTradeDetails'
import SHSellTradeInfo from '../../../../commons/components/SHSellTradeInfo'
import SHSellRelieveLoanApplyModal from '../../../components/secondHouseSellTrade/SHSellRelieveLoanApplyModal'

import './SecondHouseRelieveLoan.css'

const SecondHouseRelieveLoan = ({location, dispatch,secondHouseRelieveLoan}) => {
  const{trackJSON,applyModal,promptObj}=secondHouseRelieveLoan;

  return (
    <div className='secondHouseRelieveLoan'>
      {!!applyModal.visible && <SHSellRelieveLoanApplyModal {...applyModal} onOk={(data)=>dispatch({
        type:'secondHouseRelieveLoan/postRelieveLoanApply',
        payload:data,
      })} onCancel={()=>dispatch({
        type:'secondHouseRelieveLoan/closeApplyModal',
      })} upLoadPicListChange={(arr)=>dispatch({
        type:'secondHouseRelieveLoan/changeUpLoadPicList',
        payload:arr,
      })}/>}
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'secondHouseRelieveLoan/closePrompt'})} onCancel={()=>dispatch({type:'secondHouseRelieveLoan/closePrompt'})}/>
      {/*!!trackJSON && <SecondHouseTradeDetails trackJSON={trackJSON} dispatch={dispatch}/>*/}
      {!!trackJSON && <SHSellTradeInfo type='tradeCenter' trackJSON={trackJSON}/>}
      <div className='anzhua_button_bottom'>
        <Button type='primary' onClick={()=>dispatch({
            type:'secondHouseRelieveLoan/getApplyLoanData'
          })}>申请房产解压</Button>
        <Button type='ghost' onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
      </div>
    </div>
  )
}

SecondHouseRelieveLoan.propTypes = {
  secondHouseRelieveLoan: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps({secondHouseRelieveLoan}) {
  return {secondHouseRelieveLoan}
}

export default connect(mapStateToProps)(SecondHouseRelieveLoan)
