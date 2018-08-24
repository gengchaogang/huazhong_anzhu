import React from 'react'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import {Steps,Button,message }from 'antd'
import './mentorRegister.css'
import {DxSteps,DxStep}from '../../../commons/View/DxSteps'
const Step = Steps.Step;
import img from '../../assets/images/toLogin.png'
function MentorRegister({mentorRegister,dispatch,children}){
  const {current}=mentorRegister
  const steps =[
    '填写手机号',
    '完善信息',
    '注册成功',
    ]
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
      <div className="mentorRegister">
        <DxSteps current={current} className="navbar" status='finish'>
          {steps.map(item => <DxStep key={`stepKey_${item}`} title={item}/>)}
        </DxSteps>
        {children}
      </div>
    </div>
  )
}
function mapStateToProps({mentorRegister}){
  return{
    mentorRegister
  }
}
export default connect(mapStateToProps)(MentorRegister)
