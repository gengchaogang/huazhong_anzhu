import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { routerRedux } from 'dva/router'

import {Table,Button} from 'antd'
import DxPanel from '../../../commons/components/DxPanel'
import PromptModal from '../../../commons/View/PromptModal'

import './RemindMsgManagement.css'

function RemindMsgManagement({location,dispatch,remindMsgManagement}) {
  const {
    tableLoading,
    pagination,
    tableData,
    promptObj,
  }=remindMsgManagement;
  const tableProps={
    columns:[
      {
        title: '序号',
        dataIndex: 'listCode',
        key: 'listCode',
      },{
        title: '消息标题',
        dataIndex: 'title',
        key: 'title',
      },{
        title: '消息内容',
        dataIndex: 'content',
        key: 'content',
        render:text=><span className='anhzu_msg_content'>{text}</span>
      },{
        title: '时间',
        dataIndex: 'timestamp',
        key: 'timestamp',
      },{
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render:(text,record)=><p className='anhzu_msg_operation' onClick={()=>dispatch({
          type:'remindMsgManagement/markMsgRead',
          payload:{
            noRead:record.noRead,
            listCode:record.listCode,
          },
        })}>详情</p>
      }
    ],
    rowKey:(record)=>`key_${record.listCode}`,
    dataSource:tableData,
    loading:tableLoading,
    pagination:{
      total: pagination.total,
      current:pagination.current,
      pageSize:10,
      onChange:(current)=>dispatch({
        type:'remindMsgManagement/changePage',
        payload:current,
      }),
      showQuickJumper:true,
    },
  }
  const onRowClick=(record, index)=>{
    dispatch({
      type:'remindMsgManagement/markMsgRead',
      payload:{
        noRead:record.noRead,
        listCode:record.listCode,
      },
    })
  }
  return (
    <div className='anhzu_msg'>
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'remindMsgManagement/closePrompt'})} onCancel={()=>dispatch({type:'remindMsgManagement/closePrompt'})}/>
      <DxPanel title='消息管理'>
        <Table
          className='anhzu_msg_table'
          {...tableProps}
          rowClassName={creatColClassName}
          onRowClick={onRowClick}
          />
      </DxPanel>
    </div>
  );
}

RemindMsgManagement.propTypes = {
  remindMsgManagement: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}
function mapStateToProps({remindMsgManagement}) {
  return {remindMsgManagement};
}

function creatColClassName(record, index){
  if(!!record.noRead){
    return 'anzhu_table_col_bold';
  }else{
    return '';
  }
}
export default connect(mapStateToProps)(RemindMsgManagement)
