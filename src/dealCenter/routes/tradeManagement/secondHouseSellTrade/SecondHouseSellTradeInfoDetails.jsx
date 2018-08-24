import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import {Button} from 'antd'

import DxPanel from '../../../../commons/components/DxPanel'
import PromptModal from '../../../../commons/View/PromptModal'
// import SecondHouseTradeDetails from '../../../components/secondHouseSellTrade/SecondHouseTradeDetails'
import SHSellTradeInfo from '../../../../commons/components/SHSellTradeInfo'


import './SecondHouseSellTradeInfoDetails.css'

const SecondHouseSellTradeInfoDetails=({dispatch,secondHouseSellTradeInfoDetails})=>{
  const{trackJSON}=secondHouseSellTradeInfoDetails;
  return (
    <div className='anzhua_button_bottom'>
      {/*!!trackJSON && <SecondHouseTradeDetails trackJSON={trackJSON} dispatch={dispatch}/>*/}
      {!!trackJSON && <SHSellTradeInfo type='tradeCenter' trackJSON={trackJSON}/>}
      <div className='anzhua_button_bottom'>
        <Button type='ghost' onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
      </div>
    </div>
  )
}

SecondHouseSellTradeInfoDetails.propTypes = {
  secondHouseSellTradeInfoDetails: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps({secondHouseSellTradeInfoDetails}) {
  return {secondHouseSellTradeInfoDetails}
}

export default connect(mapStateToProps)(SecondHouseSellTradeInfoDetails);
