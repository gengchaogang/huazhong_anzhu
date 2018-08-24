import React from 'react'
import {Table} from 'antd'
import DxPanel from '../../../../../../commons/components/DxPanel'
import PicList from '../../../../../../commons/UI/PicList'

import './ProjectCertificates.css'


export default function ProjectCertificates(props){
  console.log('props>>>>>',props.picCredentialsList);
  // const {certificateList,auditingList}=JSON.parse(mainData);
  // const certificateList=[
  //
  // ];
  // const auditingList
  return(
    <div className='projectDetails_projectCertificates'>
      <DxPanel title='项目资质'>
        <div>
          {props.picCredentialsList.map((item,index)=>(
            <span key={`ietm_${index}`} className='spanImg' style={{backgroundImage:`URL(${item})`}}></span>
          ))}
        </div>
      </DxPanel>
      {/*
        <DxPanel title='项目审核信息'>

        </DxPanel>
        */}
    </div>
  )
}
