import React, { PropTypes } from 'react';
import {Tag} from 'antd';
import './DxValueList.css'
function DxValueListItem({label,value,isElem}){
  if(!!isElem){
    return(
      <div className='dx_valueList_item'>
        <span className='dx_valueList_item_label'>{`${label}：`}</span>
        <div className='dx_valueList_item_value'>{value}</div>
      </div>
    )
  }else{
    if(typeof(value)==='object'){
      return(
        <div className='dx_valueList_item'>
          <span className='dx_valueList_item_label'>{`${label}：`}</span>
          <div className='dx_valueList_item_value'>{
              value.map(item=><Tag className='dx_valueList_item_value_tag' key={item.id}>{item.name}</Tag>)
            }</div>
        </div>
      )
    }else{
      return(
        <p className='dx_valueList_item'>
          <span className='dx_valueList_item_label'>{`${label}：`}</span>
          <span className='dx_valueList_item_value'>{value}</span>
        </p>
      )
    }
  }
}
export default function DxValueList({valueList,className,isElem=false}){
  // console.log('valueList',valueList);
  if(valueList.length===0){
    return(
    <div className={`dx_valueList  ${className?className:''}`} style={{display:'none'}}></div>
    )
  }else{
    return(
      <div className={`dx_valueList  ${className?className:''}`}>
        {valueList.map((item,index)=><DxValueListItem {...item} key={`DxValueListItem_key_${item.label}_${index}`} isElem={isElem}/>)}
      </div>
    )
  }
}
