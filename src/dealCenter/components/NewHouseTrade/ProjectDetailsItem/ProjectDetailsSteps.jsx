import React from 'react'

import './ProjectDetailsSteps.css'

function ProjectDetailsStepsItem({className,title,active,currentChange,listCode}){
  return(
    <div className={`proInfo_item ${active?'proInfo_item_active':'proInfo_item_default'}`} onClick={()=>currentChange(listCode)}>
      <div className='proInfo_item_content'>
        <div className={`centerPic ${className} proInfo_item_pic`}></div>
        <p className='proInfo_item_title'>{title}</p>
      </div>
    </div>
  )
}
const stepsArr=[
  {
    title:'项目信息',
    className:'proInfo_basicInfo',
  },{
    title:'项目相册',
    className:'proInfo_proPics',
  },{
    title:'户型图',
    className:'proInfo_housesPics',
  },{
    title:'项目销控表',
    className:'proInfo_housesTable',
  },{
    title:'项目优惠',
    className:'proInfo_housesDiscount',
  },{
    title:'项目资质',
    className:'proInfo_housesAptitude',
  }
]
export default function ProjectDetailsSteps({current,currentChange}){
  return(
    <div className='projectDetailsSteps_box'>
      {stepsArr.map((item,index)=><ProjectDetailsStepsItem currentChange={currentChange} listCode={index} key={`proInfo_item_key_${index}`} {...item} active={index===current}/>)}
    </div>
  )
}
