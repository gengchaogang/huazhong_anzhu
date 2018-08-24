import React from 'react';
import './LabelValueList.css'

export default function LabelValueList({list}){
  return (
    <div className='labelValueList'>
      {list.map((item,index)=><span className='labelValueList_item' key={`labelValueList_item_key${index}`}>
        <span className='labelValueList_item_label'>{`${item.label}：`}</span>
        <span className='labelValueList_item_value'>{item.value}</span>
      </span>)}
    </div>
  );
};
