import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { routerRedux } from 'dva/router'

import {Table,Button,Tabs} from 'antd'
const TabPane = Tabs.TabPane;
import DxPanel from '../../commons/components/DxPanel'
import PromptModal from '../../commons/View/PromptModal'

import './Information.css'

function Information({location,dispatch,information}) {
  const {
    tableLoading,
    pagination,
    tableData,
    promptObj,
  }=information;
  const tableProps={
    columns:[
      {
        title: '序号',
        dataIndex: 'listCode',
        key: 'listCode',
        width:'80px',
      },{
        title: '消息标题',
        dataIndex: 'title',
        key: 'title',
        width:'250px',
      },{
        title: '消息内容',
        dataIndex: 'content',
        key: 'content',
        render:text=><span className='anhzu_msg_content'>{text}</span>
      },{
        title: '时间',
        dataIndex: 'timestamp',
        key: 'timestamp',
        width:'160px',
      },{
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render:(text,record)=><p className='anhzu_msg_operation' onClick={()=>dispatch({
          type:'information/markMsgRead',
          payload:{
            noRead:record.noRead,
            listCode:record.listCode,
          },
        })}>详情</p>
      }
    ],
    onRowClick:(record)=>dispatch({
      type:'information/markMsgRead',
      payload:{
        noRead:record.noRead,
        listCode:record.listCode,
      },
    }),
    rowKey:(record)=>`key_${record.listCode}`,
    dataSource:tableData,
    loading:tableLoading,
    pagination:{
      total: pagination.total,
      current:pagination.current,
      pageSize:10,
      onChange:(current)=>dispatch({
        type:'information/changePage',
        payload:current,
      }),
      showQuickJumper:true,
    },
  }
  return (
    <div className='anhzu_msg'>
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'information/closePrompt'})} onCancel={()=>dispatch({type:'information/closePrompt'})}/>
      <DxPanel title='消息管理'>
        <Table className='anhzu_msg_table' {...tableProps} rowClassName={creatColClassName}/>
      </DxPanel>
    </div>
  );
}

Information.propTypes = {
  information: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}
function mapStateToProps({information}) {
  return {information};
}
function creatColClassName(record, index){
  if(!!record.noRead){
    return 'anzhu_table_col_bold information_table_col';
  }else{
    return 'information_table_col';
  }
}
export default connect(mapStateToProps)(Information)
