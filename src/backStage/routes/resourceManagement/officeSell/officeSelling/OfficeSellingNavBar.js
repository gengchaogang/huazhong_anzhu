import React from 'react'
import {connect} from 'dva'
import {Button,Steps,message} from 'antd'
import { routerRedux } from 'dva/router';
// import BasicMessage from './BasicMessage'
// import UploadProjectPhoto from './UploadProjectPhoto'
// import HouseTypeImgManagement from './HouseTypeImgManagement'
// import CreateProjectConcessions from './CreateProjectConcessions'
// import UploadAptitude from './UploadAptitude'
import moment from 'moment'

const Step = Steps.Step;
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
  const stepwatch=(key)=>{
    if(key=='房源详情'){
      dispatch(routerRedux.push({
        pathname:'/resourceManagement/officeBuildingSell/officeSellingNavBar/officeSellingDetails',
        state:{
          projectId:officeSellingNavBar.projectId,
        }
      }))
    }else if (key=='视频图片') {
      dispatch(routerRedux.push({
        pathname:'/resourceManagement/officeBuildingSell/officeSellingNavBar/officeSellingVideoAndImgs',
        state:{
          projectId:officeSellingNavBar.projectId,
        }
      }))
    }else if(key=='代理经纪人'){
      dispatch(routerRedux.push({
        pathname:'/resourceManagement/officeBuildingSell/officeSellingNavBar/officeSellingAgentBroker',
        state:{
          projectId:officeSellingNavBar.projectId,
        }
      }))
    }else if(key=='带看记录'){
      dispatch(routerRedux.push({
        pathname:'/resourceManagement/officeBuildingSell/officeSellingNavBar/officeSellingRecord',
        state:{
          projectId:officeSellingNavBar.projectId,
        }
      }))
    }else if(key=='成交'){
      dispatch(routerRedux.push({
        pathname:'/resourceManagement/officeBuildingSell/officeSellingNavBar/officeSellingDeal',
        state:{
          projectId:officeSellingNavBar.projectId,
        }
      }))
    }
  }
  return(
    <div className="newHouseProject" >
      <Steps current={current} className="navbar">
        {steps.map(item => <Step key={`stepKey_${item}`} style={{cursor:'pointer'}} title={item} onClick={()=>stepwatch(item)}/>)}
      </Steps>
      {children}
    </div>
  )
}
function mapStateToProps({ officeSellingNavBar}) {
  return { officeSellingNavBar }
}

export default connect(mapStateToProps)(OfficeSellingNavBar)
