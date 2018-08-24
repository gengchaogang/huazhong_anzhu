import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { routerRedux } from 'dva/router'

import {Button} from 'antd'
import DxPanel from '../../../commons/components/DxPanel'
import PromptModal from '../../../commons/View/PromptModal'

import './RemindMsgInfo.css'

function RemindMsgInfo({location,dispatch,remindMsgInfo}) {
  const {
    title,
    timestamp,
    content,
    promptObj,
  }=remindMsgInfo;
  return (
    <div className='anzhu_msgInfo'>
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'remindMsgInfo/closePrompt'})} onCancel={()=>dispatch({type:'remindMsgInfo/closePrompt'})}/>
      <DxPanel title='消息管理'>
        <div>
          <span className='anzhu_msgInfo_title'>{title}</span>
          <span className='anzhu_msgInfo_timer'>{timestamp}</span>
          <p className='anzhu_msgInfo_content'>{content}</p>
        </div>
      </DxPanel>
      <div className='anzhu_bottom_area'>
        <Button type='primary' onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
      </div>
    </div>
  );
}

RemindMsgInfo.propTypes = {
  remindMsgInfo: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}
function mapStateToProps({remindMsgInfo}) {
  return {remindMsgInfo};
}

export default connect(mapStateToProps)(RemindMsgInfo)
