import React from 'react'
import { Pagination } from 'antd';
import DxPanel from '../../../../commons/components/DxPanel'
import RoomPicList from '../RoomPicList'
import './HouseImgInfo.css'

export default function HouseImgInfo({mainData,current,total,onChange}){
  return(
    <DxPanel title='项目室内图户型图'>
      <div className='projectHouseImgInfo'>
        <RoomPicList listData={mainData}/>
        <div style={{textAlign:'right'}}>
          <Pagination showQuickJumper pageSize={10} current={current} total={total} onChange={onChange}/>
        </div>
      </div>
    </DxPanel>
  )
}
