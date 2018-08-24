import React from 'react'
import {Table} from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'
// import PicList from '../../../../../../commons/UI/PicList'

import './NewHouseImg.css'


export default function NewHouseImg({newHouseImgArr}){
  const effectImg=[];
  const trafficImg=[];
  const supportingImg=[];
  if(newHouseImgArr.length!=0){
    for(let i=0 ;i<newHouseImgArr.length;i++){
      for(let j=0;j<newHouseImgArr[i].pictures.length;j++){
        if(newHouseImgArr[i].pictures[j].type=='1'){
          effectImg.push({
            path:newHouseImgArr[i].pictures[j].path,
            title:newHouseImgArr[i].pictures[j].title,
          })
        }else if(newHouseImgArr[i].pictures[j].type=='2'){
          trafficImg.push({
            path:newHouseImgArr[i].pictures[j].path,
            title:newHouseImgArr[i].pictures[j].title,
          })
        }else{
          supportingImg.push({
            path:newHouseImgArr[i].pictures[j].path,
            title:newHouseImgArr[i].pictures[j].title,
          })
        }
      }
    }
  }
  return(
    <div>
      <DxPanel title='项目效果图'>
        <div>
          {effectImg.length!=0 &&effectImg.map((item,index)=>(
            <div className='imgDiv' key={`item_${index}`}>
              <span className='showImg' style={{backgroundImage:`URL(${item.path})`}}></span>
              <p>{item.title}</p>
            </div>
          ))}
        </div>
      </DxPanel>
      <DxPanel title='项目交通图'>
        <div>
          {trafficImg.length!=0 &&effectImg.map((item,index)=>(
            <div className='imgDiv' key={`item_${index}`}>
              <span className='showImg' style={{backgroundImage:`URL(${item.path})`}}></span>
              <p>{item.title}</p>
            </div>
          ))}
        </div>
      </DxPanel>
      <DxPanel title='项目配套图'>
        <div>
          {supportingImg.length!=0 &&effectImg.map((item,index)=>(
            <div className='imgDiv' key={`item_${index}`}>
              <span className='showImg' style={{backgroundImage:`URL(${item.path})`}}></span>
              <p>{item.title}</p>
            </div>
          ))}
        </div>
      </DxPanel>
    </div>
  )
}
