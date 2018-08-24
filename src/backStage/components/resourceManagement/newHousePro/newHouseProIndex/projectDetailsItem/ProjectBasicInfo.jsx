import React from 'react'
import {Select} from 'antd'
const Option = Select.Option;
import DxPanel from '../../../../../../commons/components/DxPanel'
import DxShowMsgFormBackState from '../../../../../../commons/UI/DxShowMsgFormBackState'
import GaodeMap from '../../../../../../commons/components/GaodeMap'

import './ProjectBasicInfo.css'

export default function ProjectBasicInfo({type,onChange,selectProject,projectList,showData}){
  // const children=(!!projectList?projectList.map(item=><Option key={`audit_${item.id}`} value={item.id} checkName={item.name}>{item.name}</Option>):'')
  const showDataObj=!!showData?JSON.parse(showData):null;
  // console.log('showDataObj',showDataObj);
  let arr=['1','1'];
  if(!!showDataObj){
    arr=['156.62634','39.912214'];
  }
  // console.log('arr',arr);
  console.log('showDataObj.basicInfo',showDataObj);
  return(
    <div className='projectBasicInfo_container'>
      <DxPanel title='项目基本信息'>
        <div>
          <span></span>
          {!!showDataObj && <div className='projectBasicInfo_mian'>
            <DxShowMsgFormBackState msgData={!!showDataObj.basicInfo?showDataObj.basicInfo:[]}/>
            <div className='projectBasicInfo_mian_address'>
              <b>项目详细地址：</b><span>{showDataObj.address}</span>
            </div>
          </div>}
          <GaodeMap width={350} height={200} mapClick={()=>{}} initMarkers={[{position:arr,content:null}]}
            address={!!showDataObj?showDataObj.address:''}
          />
        </div>
      </DxPanel>
      {!!showDataObj && <DxPanel title='楼盘资料'>
        <div className='buildingInfo'>
          <DxShowMsgFormBackState msgData={!!showDataObj.buildingInfo?showDataObj.buildingInfo:[]}/>
        </div>
      </DxPanel>}
      {!!showDataObj && <DxPanel title='项目介绍'>
        <p>{showDataObj.introduced}</p>
      </DxPanel>}
    </div>
  )
}
