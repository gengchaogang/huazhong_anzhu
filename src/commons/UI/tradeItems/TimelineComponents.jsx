import React from 'react'
import './IntentionItem.css'
import DxPanel from '../../components/DxPanel'
import './TimelineComponents.css'
import {Timeline}from 'antd'

function TimelineComponents({timelineData,title,header,footer,remarks,flex}){
  return (
    <DxPanel title={!!title?title:'看房记录'} className={!!flex?'flex_panel':''}>
      <div className='time_line_panel'>
        <div>
          {!!header && <div>{header}</div>}
          <Timeline>
            {timelineData.map((item,key)=><Timeline.Item key={`timeLine${key}`}>
            <span className={getcolor(item.value)}>{item.label}</span>
            <span className={getcolor(item.value)}>{item.value}</span>
            {!!remarks && <span className='houseRecord-content'>{item.remarks}</span>}
            </Timeline.Item>)}
          </Timeline>
          {!!footer && <div>{footer}</div>}
        </div>
      </div>
    </DxPanel>
  );
}
function getcolor(key){
  if(key.indexOf('驳回')>0){
    let a='timeRecordList_content_color';
    return a
  }else{
    let b='timeRecordList_content';
    return b
  }
  // 'timeRecordList_content'
}
export default TimelineComponents;
