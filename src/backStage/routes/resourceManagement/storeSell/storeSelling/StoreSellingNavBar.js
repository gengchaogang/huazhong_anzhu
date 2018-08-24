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
function StoreSellingNavBar(props){
  const {dispatch,storeSellingNavBar,children}=props;
  const {current}=storeSellingNavBar
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
        pathname:'/resourceManagement/storeSell/storeSellingNavBar/storeSellingDetails',
        state:{
          projectId:storeSellingNavBar.projectId,
        }
      }))
    }else if (key=='视频图片') {
      dispatch(routerRedux.push({
        pathname:'/resourceManagement/storeSell/storeSellingNavBar/storeSellingVideoAndImgs',
        state:{
          projectId:storeSellingNavBar.projectId,
        }
      }))
    }else if(key=='代理经纪人'){
      dispatch(routerRedux.push({
        pathname:'/resourceManagement/storeSell/storeSellingNavBar/storeSellingAgentBroker',
        state:{
          projectId:storeSellingNavBar.projectId,
        }
      }))
    }else if(key=='带看记录'){
      dispatch(routerRedux.push({
        pathname:'/resourceManagement/storeSell/storeSellingNavBar/storeSellingRecord',
        state:{
          projectId:storeSellingNavBar.projectId,
        }
      }))
    }else if(key=='成交'){
      dispatch(routerRedux.push({
        pathname:'/resourceManagement/storeSell/storeSellingNavBar/storeSellingDeal',
        state:{
          projectId:storeSellingNavBar.projectId,
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
function mapStateToProps({ storeSellingNavBar}) {
  return { storeSellingNavBar }
}

export default connect(mapStateToProps)(StoreSellingNavBar)
