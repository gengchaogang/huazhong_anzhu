import React from 'react'
import {connect} from 'dva'
import moment from 'moment';
import { DatePicker,Tabs,Table,Select,Modal,Button } from 'antd';

import { routerRedux } from 'dva/router'
import BarCharts from '../../../commons/BarCharts/BarCharts'
import DxPanel from '../../../commons/components/DxPanel'
import BarChartsWithTitle from '../../../commons/components/BarChartsWithTitle'
import PromptModal from '../../../commons/View/PromptModal'
import './TradeStatistics.css'

function TradeStatistics({dispatch,tradeStatistics}){
  const{
    mainData,
    promptObj,
  }=tradeStatistics;
  const {
    projectAdd,
    newHouseTrade,
    visitRecord,
    shSellRecord,
    shRentRecord,
  }=JSON.parse(mainData);
  return (
    <div>
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'tradeStatistics/closePrompt'})} onCancel={()=>dispatch({type:'tradeStatistics/closePrompt'})}/>
      <DxPanel title="新房交易统计数据">
        <div className='barChartBorder'>
          <BarChartsWithTitle data={projectAdd} chartsColor={'#3398DB'} onlyRefs={'beac'} type={'bar'} widths={'320px'} title='项目新增'/>
          <BarChartsWithTitle data={newHouseTrade} onlyRefs={'isDrowChart2'} type={'bar'} widths={'320px'} title='新房交易'/>
          <BarChartsWithTitle data={visitRecord} onlyRefs={'isDrowChart3'} type={'bar'} widths={'320px'} title='确看统计'/>
        </div>
      </DxPanel>
      <DxPanel title="二手房出售交易统计">
        <div className='barChartBorder'>
          <BarCharts {...shSellRecord} onlyRefs={'isDrowChart4'} type={'bar'} widths={'800px'}/>
        </div>
      </DxPanel>
      <DxPanel title="二手房出租交易统计">
        <div className='barChartBorder'>
          <BarCharts {...shRentRecord}  onlyRefs={'isDrowChart5'} type={'bar'} widths={'800px'}/>
        </div>
      </DxPanel>
    </div>
  )
}

function mapStateToProps({tradeStatistics}){
  return {tradeStatistics}
}

export default connect(mapStateToProps)(TradeStatistics);
