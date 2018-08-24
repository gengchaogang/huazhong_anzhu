import React from 'react'
import DxPanel from '../../../../../../commons/components/DxPanel'
import PicList from '../../../../../../commons/UI/PicList'

import './ProjectAlbum.css'

export default function ProjectAlbum({mainData}){
  const {designPicture,trafficPicture,matchingPicture}=JSON.parse(mainData);
  return(
    <div className='projectAlbum'>
      <DxPanel title='项目效果图'>
        <PicList picListData={designPicture}/>
      </DxPanel>
      <DxPanel title='项目交通图'>
        <PicList picListData={trafficPicture}/>
      </DxPanel>
      <DxPanel title='项目配套图'>
        <PicList picListData={matchingPicture}/>
      </DxPanel>
    </div>
  )
}
