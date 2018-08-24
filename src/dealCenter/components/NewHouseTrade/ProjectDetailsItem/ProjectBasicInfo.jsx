import React from 'react'
import {Select} from 'antd'
const Option = Select.Option;
import DxPanel from '../../../../commons/components/DxPanel'
import DxValueList from '../../../../commons/UI/DxValueList'
import GaodeMap from '../../../../commons/components/GaodeMap'

import './ProjectBasicInfo.css'
export default function ProjectBasicInfo({type,onChange,selectProject,projectList,showData}){
  // const children=(!!projectList?projectList.map(item=><Option key={`audit_${item.id}`} value={item.id} checkName={item.name}>{item.name}</Option>):'')
  let showDataObj=!!showData?JSON.parse(showData):null;
  if(!!showDataObj && showDataObj.basicInfo===undefined){
    showDataObj=null;
  }
  let arr=['1','1'];
  if(!!showDataObj){
    arr=showDataObj.coordinates;
  }
  return(
    <div className='projectBasicInfo_container'>
      <DxPanel title='项目基本信息'>
        <div>
          {!!showDataObj && <div className='projectBasicInfo_mian'>
            <DxValueList valueList={!!showDataObj.basicInfo?showDataObj.basicInfo:[]}/>
            <DxValueList valueList={!!showDataObj.address?[{
                label:'项目详细地址',
                value:showDataObj.address,
              }]:[]}/>
            {/*<div className='projectBasicInfo_mian_address'>
              <b>项目详细地址：</b><span>{showDataObj.address}</span>
            </div>*/}
          </div>}
          <GaodeMap width={350} height={200} mapClick={()=>{}} initMarkers={[{position:arr,content:null}]}/>
        </div>
      </DxPanel>
      {!!showDataObj && <DxPanel title='楼盘资料'>
        <div className='buildingInfo'>
          <DxValueList valueList={!!showDataObj.buildingInfo?showDataObj.buildingInfo:[]}/>
        </div>
      </DxPanel>}
      {!!showDataObj && <DxPanel title='项目卖点'>
        <p>{showDataObj.introduced}</p>
      </DxPanel>}
    </div>
  )
}
