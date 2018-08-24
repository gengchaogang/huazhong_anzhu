import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { routerRedux } from 'dva/router'

import { Badge,Card,Row,Col} from 'antd'

import IndexLogin from '../components/IndexPage/IndexLogin'
import Buttons from '../components/IndexPage/Buttons'
import Badges from '../../commons/UI/Badges'
import DxPanel from '../../commons/components/DxPanel'
import BarCharts from '../../commons/BarCharts/BarCharts'
import IndexEntrance from '../components/IndexPage/IndexEntrance'
import PromptModal from '../../commons/View/PromptModal'

import badgesImg from '../assets/images/index_icon.png'
import styles from './IndexPage.css'

const chartWidth='475px';

import './IndexPage.css'
function IndexPage({location,dispatch,indexPage,main}) {
  const {entranceState,globalData,promptObj,echartsRecordListProps}=indexPage;
  const {
    secVolumeProps,
    secRentProps,
    newECommerceProps,
    newDealProps,
  }=JSON.parse(echartsRecordListProps);
  const {userInfo}=main;
  const userMsg=!!userInfo?JSON.parse(userInfo):null;
  //从顶层组件传来的用户相关信息
  const indexLoginProps=!!userMsg?{
    address:`${userMsg.fullPath}-${userMsg.centerName}`,
    loginName:userMsg.name,
    department:userMsg.deptName,
    lastLoginTime:userMsg.lastLoginTime,
    ip:userMsg.lastLoginIp,
    position:userMsg.position,
  }:{
    address:'-',
    loginName:'-',
    department:'-',
    lastLoginTime:'-',
    ip:'-',
    position:'-',
  }
  function bageClickCallBack(bageItem){
    console.log('bageItem',bageItem);
    if(!!bageItem.tabKey){
      sessionStorage.setItem(`${bageItem.tabKey.name}`,`${bageItem.tabKey.value}`)
    }
    dispatch(routerRedux.push({
      pathname: `/${bageItem.path}`,
    }));
  }
  //首页入口组件props
  const indexEntranceProps={
    ...entranceState,
    bageClick:bageClickCallBack,
  }
  //入口与柱状图之间的所有tags展示数据
  //目前无跳转，无权限过滤，采取全部显示
  const globalDataClickCallBack=(path)=>{
    //预留跳转事件接口
    // dispatch(routerRedux.push({
    //   pathname: `/${path}`,
    // }));
  }

  return (
    <div className={`${styles.normal} indexPage`}>
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'indexPage/closePrompt'})} onCancel={()=>dispatch({type:'indexPage/closePrompt'})}/>
      <div className='indexLogin_box'>
        <IndexLogin {...indexLoginProps}/>
      </div>
      <div className='bageOutSide'>
        <IndexEntrance {...indexEntranceProps}/>
      </div>
      <DxPanel title='今日新房项目动态' className='dxpanel_noPadding_top'>
        <div className='buttonsDiv'>
          <Buttons clickButtons={()=>globalDataClickCallBack('')} buttonsData={globalData.newHouseViewed} buttonWord='新房确看（次）'/>
          <Buttons clickButtons={()=>globalDataClickCallBack('')} buttonsData={globalData.groupBuying} buttonWord='新房团购（个）'/>
          <Buttons clickButtons={()=>globalDataClickCallBack('')} buttonsData={globalData.newHouseTransaction} buttonWord='新房成交数（个）'/>
          <Buttons clickButtons={()=>globalDataClickCallBack('')} buttonsData={globalData.newHouseTransactionCommission} buttonWord='新房成交佣金（元）'/>
        </div>
      </DxPanel>
      <DxPanel title='今日二手房出售动态'>
        <div className='buttonsDiv'>
          <Buttons clickButtons={()=>globalDataClickCallBack('')} buttonsData={globalData.secondHandHouseReportTransaction} buttonWord='二手房报成交数（次）'/>
          <Buttons clickButtons={()=>globalDataClickCallBack('')} buttonsData={globalData.secondHandHouseTransaction} buttonWord='二手房成交数（套）'/>
          <Buttons clickButtons={()=>globalDataClickCallBack('')} buttonsData={globalData.secondHandHouseLoan} buttonWord='二手房办理贷款（个）'/>
          <Buttons clickButtons={()=>globalDataClickCallBack('')} buttonsData={globalData.secondHandHouseTransactionCommission} buttonWord='二手房成交佣金（元）'/>
        </div>
      </DxPanel>
      <DxPanel title='今日二手房租赁动态'>
        <div className='buttonsDiv'>
          <Buttons clickButtons={()=>globalDataClickCallBack('')} buttonsData={globalData.secondHandHouseReportRent} buttonWord='二手房报出租数（次）'/>
          <Buttons clickButtons={()=>globalDataClickCallBack('')} buttonsData={globalData.secondHandHouseRent} buttonWord='二手房出租数（套）'/>
          <Buttons clickButtons={()=>globalDataClickCallBack('')} buttonsData={globalData.secondHandHouseRentStage} buttonWord='二手房出租分期（个）'/>
          <Buttons clickButtons={()=>globalDataClickCallBack('')} buttonsData={globalData.secondHandHouseRentCommission} buttonWord='二手房出租佣金（元）'/>
        </div>
      </DxPanel>
      <DxPanel title='最近交易数据统计'>
        <div className='barChartBorder'>
          <Card>
            <BarCharts {...secVolumeProps} type={'bar'} widths={chartWidth} onlyRefs={'refsrefs'} chartsColor='#70AD47'/>
          </Card>
          <Card>
            <BarCharts {...secRentProps} type={'bar'} widths={chartWidth} onlyRefs={'secRent'} chartsColor='#5B9BD5'/>
          </Card>
          <Card>
            <BarCharts {...newECommerceProps} type={'bar'} widths={chartWidth} onlyRefs={'newECommerce'} chartsColor='#ED7D31'/>
          </Card>
          <Card>
            <BarCharts {...newDealProps} type={'bar'} widths={chartWidth} onlyRefs={'newDeal'} chartsColor='#ED4630'/>
          </Card>
        </div>
      </DxPanel>
    </div>
  );
}

IndexPage.propTypes = {
  indexPage: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}
function mapStateToProps({indexPage,main}) {
  return { indexPage,main };
}

export default connect(mapStateToProps)(IndexPage)
