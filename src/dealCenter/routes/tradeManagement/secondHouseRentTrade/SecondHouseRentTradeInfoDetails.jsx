import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import {Button} from 'antd'

import DxPanel from '../../../../commons/components/DxPanel'
import PromptModal from '../../../../commons/View/PromptModal'
import SHRentTradeInfo from '../../../../commons/components/SHRentTradeInfo'
// import SecondHouseRentTradeDetails from '../../../components/secondHouseRentTrade/SecondHouseRentTradeDetails'

import './SecondHouseRentTradeInfoDetails.css'

const SecondHouseRentTradeInfoDetails=({dispatch,secondHouseRentTradeInfoDetails})=>{
  const{trackJSON}=secondHouseRentTradeInfoDetails;
  return (
    <div className='secondHouseRentTradeInfoDetails'>
      {!!trackJSON && <SHRentTradeInfo trackJSON={trackJSON} type='tradeCenter'/>}
      {/*<div className='dx_bottom_buttonBox'>*/}
      <div>
        <Button type='ghost' onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
      </div>
    </div>
  )
}

SecondHouseRentTradeInfoDetails.propTypes = {
  secondHouseRentTradeInfoDetails: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps({secondHouseRentTradeInfoDetails}) {
  return {secondHouseRentTradeInfoDetails}
}

export default connect(mapStateToProps)(SecondHouseRentTradeInfoDetails);
