import React from 'react'
import LabelValueList from '../../../commons/UI/LabelValueList'
import './ProjectInfo.css'
const initProjectInfo={
  name:'加载中',
  img:'',
  basicInfos:[
    {
      label:'项目负责人',
      value:'',
    },{
      label:'联系电话',
      value:'',
    }
  ],
  tradeInfos:[
    {
      label:'已售团购',
      value:'',
    },{
      label:'已成交',
      value:'',
    },{
      label:'剩余套数',
      value:'',
    },{
      label:'项目结束时间',
      value:'',
    }
  ],
}
export default function ProjectInfo({projectInfo}){
  const projectInfoData=!!projectInfo?JSON.parse(projectInfo):initProjectInfo;
  return(
    <div className='nh_project_box'>
      <div className='nh_showProject' style={{padding:0}}>
        <div className='nh_showProject_pic' style={{backgroundImage:`URL(${projectInfoData.img})`}}></div>
        <div className='nh_showProject_msg'>
          <div className='nh_showProject_projectName'>
            <span>项目名称：</span>
            <span>{projectInfoData.name}</span>
          </div>
          <LabelValueList list={projectInfoData.basicInfos}/>
          <LabelValueList list={projectInfoData.tradeInfos}/>
        </div>
        <div className='nh_showProject_opt'>
        </div>
      </div>
    </div>
  )
}
