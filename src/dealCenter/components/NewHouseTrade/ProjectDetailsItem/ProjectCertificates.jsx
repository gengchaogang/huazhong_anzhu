import React from 'react'
import {Table} from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'
import PicList from '../../../../commons/UI/PicList'
import TimeRecordList from '../../../../commons/UI/TimeRecordList'

import './ProjectCertificates.css'


export default function ProjectCertificates({mainData}){
  const {credentialsPics,auditList}=JSON.parse(mainData);
  console.log('auditList',auditList);
  return(
    <div className='projectDetails_projectCertificates'>
      <DxPanel title='项目资质'>
        <div>
          {!!credentialsPics && <PicList picListData={credentialsPics}/>}
        </div>
      </DxPanel>
      <DxPanel title='项目审核信息'>
        <div>
          {!!auditList && <TimeRecordList listData={auditList}/>}
        </div>
      </DxPanel>
    </div>
  )
}
