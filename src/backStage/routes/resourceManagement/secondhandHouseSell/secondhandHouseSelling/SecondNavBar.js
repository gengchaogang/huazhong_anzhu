import React from 'react'
import { routerRedux } from 'dva/router';
import {connect} from 'dva'
import {Button,Radio} from 'antd'
import './SecondNavBar.css'
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
function SecondNavBar({dispatch,secondNavBar}){
  const {defaultValue}=secondNavBar;
  const HousingDetails=()=>{
    dispatch(routerRedux.push('resourceManagement/secondhandHouseSell/Selling/housingDetails'));
  }
  const VideoAndImg=()=>{
    dispatch(routerRedux.push('resourceManagement/secondhandHouseSell/Selling/videoAndImg'));
  }
  const CheckRecord=()=>{
    dispatch(routerRedux.push('resourceManagement/secondhandHouseSell/Selling/checkRecord'))
  }
  const agentBrokers=()=>{
    dispatch(routerRedux.push('resourceManagement/secondhandHouseSell/Selling/agentBrokers'))
  }
  const strikeHands=()=>{
    dispatch(routerRedux.push('resourceManagement/secondhandHouseSell/Selling/strikeHands'))
  }
  const onChange=(e)=>{
    dispatch({
      type:'secondNavBar/onChange',
      payload:{value:e.target.value}
    })
    // console.log(`radio checked:${e.target.value}`)
  }
  return(
    <div className="secondNavBar">
      <RadioGroup  onChange={onChange} defaultValue={defaultValue}>
        <RadioButton value="房源详情" onClick={HousingDetails}>房源详情</RadioButton>
        <RadioButton value="视屏图片"  onClick={VideoAndImg}>视屏图片</RadioButton>
        <RadioButton value="代理经纪人" onClick={agentBrokers}>代理经纪人</RadioButton>
        <RadioButton value="带看记录" onClick={CheckRecord}>带看记录</RadioButton>
        <RadioButton value="成交" onClick={strikeHands}>成交</RadioButton>
      </RadioGroup>
    </div>
  )
}
function mapStateToProps({ secondNavBar }) {
  return { secondNavBar }
}

export default connect(mapStateToProps)(SecondNavBar);
