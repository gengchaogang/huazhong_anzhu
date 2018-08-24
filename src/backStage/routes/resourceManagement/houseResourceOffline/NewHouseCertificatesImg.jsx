import React from 'react'
import {Table} from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'
// import PicList from '../../../../../../commons/UI/PicList'
import './NewHouseImg.css'
export default function NewHouseCertificatesImg({certificatesImgArr}){
  return(
    <DxPanel title='电商优惠'>
      <div className='line'>
        {certificatesImgArr.length!=0 &&certificatesImgArr.map((item,index)=>(
          <span key={`item_${index}`} className='showImg certificates' style={{backgroundImage:`URL(${item.path})`}}>
          </span>
        ))}
      </div>
    </DxPanel>
  )
}
