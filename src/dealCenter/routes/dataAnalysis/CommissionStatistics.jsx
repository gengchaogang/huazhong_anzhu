import React from 'react'
import {connect} from 'dva'
import moment from 'moment';
import {Table,Modal} from 'antd';

import DxPanel from '../../../commons/components/DxPanel'
import BarCharts from '../../../commons/BarCharts/BarCharts'
import PieCharts from '../../../commons/PieCharts/PieCharts'
import PromptModal from '../../../commons/View/PromptModal'

function CommissionStatistics({dispatch,commissionStatistics}){
  const{
    promptObj,
    mainData,
  }=commissionStatistics;
  const{
    nhTradeData,
    nhGroupBuyData,
    nhGroupBuyCharge,
    shSellTradeData,
    shSellCheckout,
    shSellCharge,
    shRentTradeData,
    shRentCheckout,
    shRentCharge,
  }=JSON.parse(mainData);
  return (
    <div className='commissionStatistics'>
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'commissionStatistics/closePrompt'})} onCancel={()=>dispatch({type:'commissionStatistics/closePrompt'})}/>
      <DxPanel title="新房佣金收益">
        <div className='barChartBorder'>
          <BarCharts {...nhTradeData}
            onlyRefs={'isDrowChart1'}
            type={'bar'} widths={'320px'} chartsColor='#5B9BD5'
          />
          <PieCharts {...nhGroupBuyData}
            onlyRefs={'isDrowChart2'} type={'bar'}
            widths={'320px'}
          />
          <BarCharts {...nhGroupBuyCharge}
            onlyRefs={'isDrowChart3'} type={'bar'} widths={'320px'}
            chartsColor='#5B9BD5'
          />
        </div>
      </DxPanel>
      <DxPanel title="二手房出售佣金收益">
        <div className='barChartBorder'>
          <BarCharts {...shSellTradeData}
            onlyRefs={'isDrowChart4'}
            type={'bar'} widths={'320px'}
          />
        <PieCharts {...shSellCheckout}
            onlyRefs={'isDrowChart5'} type={'bar'}
            widths={'320px'}
          />
          <BarCharts {...shSellCharge}
            onlyRefs={'isDrowChart6'}
            type={'bar'} widths={'320px'} chartsColor='#5B9BD5'
          />
        </div>
      </DxPanel>
      <DxPanel title="二手房出租佣金收益">
        <div className='barChartBorder'>
          <BarCharts {...shRentTradeData}
            onlyRefs={'isDrowChart7'}
            type={'bar'} widths={'320px'}
          />
          <PieCharts {...shRentCheckout}
            onlyRefs={'isDrowChart8'} type={'bar'}
            widths={'320px'}
          />
          <BarCharts {...shRentCharge}
            onlyRefs={'isDrowChart9'}
            type={'bar'} widths={'320px'} chartsColor='#5B9BD5'
          />
        </div>
      </DxPanel>
    </div>
  )
}

function mapStateToProps({commissionStatistics}){
  return {commissionStatistics}
}

export default connect(mapStateToProps)(CommissionStatistics);
