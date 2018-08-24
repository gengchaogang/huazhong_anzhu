import React from 'react'
import {connect} from 'dva'
import { DatePicker,Table,Select,Modal,Button,Row,Col} from 'antd';
const { MonthPicker, RangePicker } = DatePicker;
import DxPanel from '../../../commons/components/DxPanel'
import PromptModal from '../../../commons/View/PromptModal'
import './operationLog.css';

function OperationLog({dispatch,operationLog}){
  const {
    promptObj,
    tableLoading,
    totalElements,
    currentPage,
    tableData,
  }=operationLog;

  const columns=[
    {
      title: '序号',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: '时间',
      dataIndex: 'logTime',
      key: 'logTime',
    },
    {
      title: '登录IP',
      dataIndex: 'ipAddr',
      key: 'ipAddr',
    },
    {
      title: '登录用户',
      dataIndex: 'logUserName',
      key: 'logUserName',
    },
    {
      title: '操作内容',
      dataIndex: 'logContent',
      key: 'logContent',
    },
  ];
  const onChange=(date,dateString)=> {
    dispatch({
      type:"operationLog/getInitTableData",
      payload:{
        pageSize:10,
        pageNo:0,
        startTime:dateString[0],
        endTime:dateString[1],
      }
    })
	};
	const pagination={
    showTotal:()=>{return(`共${totalElements}项`)},
    pageSize:10,
    defaultCurrent:1,
    showQuickJumper:true,
    total:totalElements,
    onChange:(page)=>{
      dispatch({
        type:"operationLog/changeTableLoading",
        payload:{tableLoading:true}
      })
      dispatch({
        type:"operationLog/getInitTableData",
        payload:{pageSize:10,pageNo:page-1,}
      })
    }
	};
  const handleCallBackOk=()=>{
    if(promptObj.todo==='closeModal'){
      dispatch({
        type:"operationLog/togglePrompt",
        payload:{visible:false}
      })
    }
  }
  const handleCallBackCancel=()=>{}
  return (
    <div className="operationLog">
      <PromptModal {...promptObj} onOk={handleCallBackOk} onCancel={handleCallBackCancel}/>
      <div className="search"  style={{paddingTop:20}}>
        <span>时间维度:</span>
        <RangePicker
          size="large"
          format="YYYY-MM-DD HH:mm:ss"
          onChange={onChange}
        />
      </div>
      <div style={{paddingTop:20}}>
        <Table
          loading={tableLoading}
          dataSource={tableData}
          className='ant_tabs_anzhu'
          columns={columns}
          pagination={pagination}
        />
      </div>
    </div>
  )
}

function mapStateToProps({operationLog}){
  return {operationLog}
}

export default connect(mapStateToProps)(OperationLog);
