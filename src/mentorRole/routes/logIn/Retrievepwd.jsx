import React from 'react'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import {Steps,Button,message }from 'antd'
import './retrievePwd.css'
import {DxSteps,DxStep}from '../../../commons/View/DxSteps'
const Step = Steps.Step;
import img from '../../assets/images/toLogin_2.png'
function Retrievepwd({retrievePwd,dispatch,children}){
  const {current}=retrievePwd
  const steps =[
    '获取验证码',
    '找回密码',
  ];
  const toLogin=()=>{
    dispatch(routerRedux.push({
      pathname:"/login"
    }));
  }
  return(
    <div>
      <div className="toLogin">
        <img onClick={toLogin} src={img}/>
      </div>
      <div className="retrievePwd">
        <DxSteps current={current} className="navbar" status='finish'>
          {steps.map(item => <DxStep key={`stepKey_${item}`} title={item}/>)}
        </DxSteps>
        {children}
      </div>
    </div>
  )
}
function mapStateToProps({retrievePwd}){
  return{
    retrievePwd
  }
}
export default connect(mapStateToProps)(Retrievepwd)
