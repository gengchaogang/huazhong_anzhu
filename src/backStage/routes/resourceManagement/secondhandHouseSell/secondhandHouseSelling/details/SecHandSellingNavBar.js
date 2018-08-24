import React from 'react'
import {connect} from 'dva'
import {Button,Steps,message} from 'antd'
import { routerRedux } from 'dva/router'
// import BasicMessage from './BasicMessage'
// import UploadProjectPhoto from './UploadProjectPhoto'
// import HouseTypeImgManagement from './HouseTypeImgManagement'
// import CreateProjectConcessions from './CreateProjectConcessions'
// import UploadAptitude from './UploadAptitude'
import moment from 'moment'

const Step = Steps.Step;
function SecHandSellingNavBar(props){
  const {dispatch,secHandSellingNavBar,children}=props;
  const {current}=secHandSellingNavBar;
  const steps =[
    '房源详情',
    '视频图片',
    '代理经纪人',
    '带看记录',
    '成交',
  ]
// console.log('current',current);
  const stepwatch=(key)=>{
    if(key=='房源详情'){
      dispatch(routerRedux.push({
        pathname:'/resourceManagement/secondhandHouseSell/secHandSellingNavBar/secHandSellingDetails',
        state:{
          projectId:secHandSellingNavBar.projectId,
        }
      }))
    }else if (key=='视频图片') {
      dispatch(routerRedux.push({
        pathname:'/resourceManagement/secondhandHouseSell/secHandSellingNavBar/secHandSellingVideoAndImgs',
        state:{
          projectId:secHandSellingNavBar.projectId,
        }
      }))
    }else if(key=='代理经纪人'){
      dispatch(routerRedux.push({
        pathname:'/resourceManagement/secondhandHouseSell/secHandSellingNavBar/secHandSellingAgentBroker',
        state:{
          projectId:secHandSellingNavBar.projectId,
        }
      }))
    }else if(key=='带看记录'){
      dispatch(routerRedux.push({
        pathname:'/resourceManagement/secondhandHouseSell/secHandSellingNavBar/secHandSellingRecord',
        state:{
          projectId:secHandSellingNavBar.projectId,
        }
      }))
    }else if(key=='成交'){
      dispatch(routerRedux.push({
        pathname:'/resourceManagement/secondhandHouseSell/secHandSellingNavBar/secHandSellingDeal',
        state:{
          projectId:secHandSellingNavBar.projectId,
        }
      }))
    }
  }
  return(
    <div className="newHouseProject">
      <Steps current={current} className="navbar">
        {steps.map(item => <Step key={`stepKey_${item}`} style={{cursor:'pointer'}} title={item} onClick={()=>stepwatch(item)}/>)}
      </Steps>
      {children}
    </div>
  )
}
function mapStateToProps({ secHandSellingNavBar}) {
  return { secHandSellingNavBar }
}

export default connect(mapStateToProps)(SecHandSellingNavBar)
