import React from 'react'
import {connect} from 'dva'
import {Button,Steps,message} from 'antd'
import moment from 'moment'
const Step = Steps.Step;
import {DxSteps,DxStep}from '../../../../../commons/View/DxSteps'
function OfficeSellingNavBar(props){
  const {dispatch,officeSellingNavBar,children}=props;
  const {current}=officeSellingNavBar
  const steps =[
    '房源详情',
    '视频图片',
    '代理经纪人',
    '带看记录',
    '成交',
  ]
console.log('current',current);
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
function mapStateToProps({ officeSellingNavBar}) {
  return { officeSellingNavBar }
}

export default connect(mapStateToProps)(OfficeSellingNavBar)