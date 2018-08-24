import React from 'react'
import {connect} from 'dva'
import {Button,Steps,message} from 'antd'
import BasicMessage from './BasicMessage'
import UploadProjectPhoto from './UploadProjectPhoto'
import HouseTypeImgManagement from './HouseTypeImgManagement'
import CreateProjectConcessions from './CreateProjectConcessions'
import UploadAptitude from './UploadAptitude'
import moment from 'moment'
import {DxSteps,DxStep}from '../../../../commons/View/DxSteps'
import './CreateProject.css'


const Step = Steps.Step;
function CreateProject(props){
  const {dispatch,createProject,children}=props;
  const {current}=createProject
  const steps =[
    '填写项目信息',
    '上传项目相册',
    '户型图管理',
    '创建项目销控表',
    '创建电商优惠',
    '上传项目资质',
  ]

  return(
    <div className="newHouseProject">
      <div className='newHouseProject_steps_box'>
        <DxSteps current={current} className="navbar" status='finish'>
          {steps.map(item => <DxStep key={`stepKey_${item}`} title={item}/>)}
        </DxSteps>
      </div>
      {children}
    </div>
  )
}
function mapStateToProps({ createProject}) {
  return { createProject }
}

export default connect(mapStateToProps)(CreateProject)
