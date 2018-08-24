import React from 'react'
import './IntentionItem.css'
import DxPanel from '../../components/DxPanel'
function IntentionItem({name,title,flex}){
  return (
    <DxPanel title={!!title?title:'意向项目'}  className={!!flex?'flex_panel':''}>
      <div>{name}</div>
    </DxPanel>
  );
}

export default IntentionItem;
