import React from 'react'
import {connect} from 'dva'
import {Button,Steps,message} from 'antd'
import moment from 'moment'
const Step = Steps.Step;
import {DxSteps,DxStep}from '../../../../../commons/View/DxSteps'
function SecHandRentingNavBar(props){
  const {dispatch,secHandRentingNavBar,children}=props;
  const {current}=secHandRentingNavBar
  const steps =[
    '房源详情',
    '视频图片',
    '代理经纪人',
    '带看记录',
    '成交',
  ]
  return(
    <div className="newHouseProject">
      <div className="background">
        <DxSteps current={current} className="navbar" status='finish'>
          {steps.map(item => <DxStep key={`stepKey_${item}`} title={item}/>)}
        </DxSteps>
      </div>
      {children}
    </div>
  )
}
function mapStateToProps({ secHandRentingNavBar}) {
  return { secHandRentingNavBar }
}

export default connect(mapStateToProps)(SecHandRentingNavBar)
