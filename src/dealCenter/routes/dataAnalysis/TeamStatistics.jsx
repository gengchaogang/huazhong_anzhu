import React from 'react'
import {connect} from 'dva'
import moment from 'moment';
import {Table,Modal} from 'antd';

import DxPanel from '../../../commons/components/DxPanel'
import BarChartsWithTitle from '../../../commons/components/BarChartsWithTitle'
import PromptModal from '../../../commons/View/PromptModal'

function TeamStatistics({dispatch,teamStatistics}){
  const{
    promptObj,
    mainData,
  }=teamStatistics;
  const{
    newVisit,
    newGroupBuy,
    shSellAccept,
    shSellLoan,
    shSellTransfer,
    shRentAccept,
    shRentLoan,
  }=JSON.parse(mainData);
  return (
    <div>
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'teamStatistics/closePrompt'})} onCancel={()=>dispatch({type:'teamStatistics/closePrompt'})}/>
      <DxPanel title="新房项目">
        <div className='barChartBorder'>
          <BarChartsWithTitle data={newVisit} onlyRefs={'isDrowChart1'} type={'bar'} widths={'500px'} title='新房项目确看'/>
          <BarChartsWithTitle data={newGroupBuy} onlyRefs={'isDrowChart2'} type={'bar'} widths={'500px'} title='新房团购销售'/>
        </div>
      </DxPanel>
      <DxPanel title="二手房出售统计">
        <div className='barChartBorder'>
          <BarChartsWithTitle data={shSellAccept} onlyRefs={'isDrowChart3'} type={'bar'} widths={'500px'} title='二手房交易受理'/>
          <BarChartsWithTitle data={shSellLoan} onlyRefs={'isDrowChart4'} type={'bar'} widths={'500px'} title='二手房贷款办理'/>
          <BarChartsWithTitle data={shSellTransfer} onlyRefs={'isDrowChart5'} type={'bar'} widths={'500px'} title='二手房过户办理'/>
        </div>
      </DxPanel>
      <DxPanel title="二手房出租统计">
        <div className='barChartBorder'>
          <BarChartsWithTitle data={shRentAccept} onlyRefs={'isDrowChart6'} type={'bar'} widths={'500px'} title='二手房出租交易受理'/>
          <BarChartsWithTitle data={shRentLoan} onlyRefs={'isDrowChart7'} type={'bar'} widths={'500px'} title='二手房出租分期办理'/>
        </div>
      </DxPanel>
    </div>
  )
}

function mapStateToProps({teamStatistics}){
  return {teamStatistics}
}

export default connect(mapStateToProps)(TeamStatistics);
