import React from 'react'
import {connect} from 'dva'
import {Button,Steps,message} from 'antd'
// import BasicMessage from './BasicMessage'
// import UploadProjectPhoto from './UploadProjectPhoto'
// import HouseTypeImgManagement from './HouseTypeImgManagement'
// import CreateProjectConcessions from './CreateProjectConcessions'
// import UploadAptitude from './UploadAptitude'
import moment from 'moment'

const Step = Steps.Step;
function SecHandRentedNavBar(props){
  const {dispatch,secHandRentedNavBar,children}=props;
  const {current}=secHandRentedNavBar
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
      <Steps current={current} className="navbar">
        {steps.map(item => <Step key={`stepKey_${item}`} title={item}/>)}
      </Steps>
      {children}
    </div>
  )
}
function mapStateToProps({ secHandRentedNavBar}) {
  return { secHandRentedNavBar }
}

export default connect(mapStateToProps)(SecHandRentedNavBar)