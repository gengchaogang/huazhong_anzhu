import React, { PropTypes } from 'react';
import './ContractList.css'
function ContractListItem({name,url}){
  console.log('name',name);
  console.log('url',url);
  return(
    <a href={url} download={'合同模板'} className='dx_contractList_item'>
      <div className='dx_contractList_item_pic'>
        <div className='centerPic dx_contractList_item_pic_content'></div>
      </div>
      <p className='dx_contractList_item_name' title={name}>{name}</p>
    </a>
  )
}
export default function ContractList({contractList,className}){
  console.log('contractList',contractList);
  if(contractList.length===0){
    return(
      <div className={`dx_contractList  ${className?className:''}`} style={{display:'none'}}></div>
    )
  }else{
    return(
      <div className={`dx_contractList  ${className?className:''}`}>
        {contractList.map((item,index)=><ContractListItem {...item} key={`ContractListItem_key_${item.id}`}/>)}
      </div>
    )
  }
}
