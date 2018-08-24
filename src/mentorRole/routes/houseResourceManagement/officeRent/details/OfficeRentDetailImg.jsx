import React from 'react'
import {Table} from 'antd'
import DxPanel from '../../../../../commons/components/DxPanel'
// import PicList from '../../../../../../commons/UI/PicList'
import touxiangDefult from '../../../../assets/images/mentorRole.png'
import './OfficeRentDetailOne.css'


export default function OfficeRentDetailImg({houseBaseInfo}){
  console.log(houseBaseInfo,'houseBaseInfo');
  return(
    <DxPanel title='经纪人上传'>
      <div>
        {!!houseBaseInfo &&<div>
          {houseBaseInfo.outFiles.length!=0 &&houseBaseInfo.outFiles.map((item,index)=>(
            <div key={`item_${index}`}>
              <div className='line'>
                <div className='flex'>
                  <span className='outFilesLogo' style={{backgroundImage:`URL(${item.addUserLogo||touxiangDefult})`}}></span>
                  <span>{item.addUserName}</span>
                  <span>上传：{houseBaseInfo.outFiles.length} 张</span>
                  <span>上传时间：{item.createDate}</span>
                </div>
              </div>
              <span className='outFiles' style={{backgroundImage:`URL(${item.path})`}}></span>
            </div>
          ))}
        </div>}
      </div>
    </DxPanel>
  )
}
