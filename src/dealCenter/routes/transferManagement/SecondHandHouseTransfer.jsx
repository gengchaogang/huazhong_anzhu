import React from 'react'
import {connect} from 'dva'
import moment from 'moment';
import {Table,Modal} from 'antd';
import SearchInput from '../../../commons/View/SearchInput'
import ShowDetailsModal from '../../components/transferManagement/ShowDetailsModal'
import PromptModal from '../../../commons/View/PromptModal'
import './SecondHandHouseTransfer.css'
function SecondHandHouseTransfer({dispatch,secondHandHouseTransfer}){
  const {
    tableLoading,
    totalElements,currentPage,
    tableData,detailsModal,promptObj,form,keyWords
  }=secondHandHouseTransfer;
  const searchFunction=(e)=>{
    dispatch({
      type:"secondHandHouseTransfer/getInitTableData",
      payload:{
        pageNo:0,
        pageSize:10,
        keyWords:e
      }
    })
  }
  const clearFuc=()=>{
    dispatch({
      type:"secondHandHouseTransfer/getInitTableData",
      payload:{
        pageNo:0,
        pageSize:10,
        keyWords:''
      }
    })
  }
  const SecondHandHouseTransfer=[
    {
      title: '序号',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: '所属小区',
      dataIndex: 'communityName',
    },
    {
      title: '物业类型',
      dataIndex: 'propertyType',
    },
    {
      title: '贷款房源',
      dataIndex: 'resourcesInfo',
    },
    {
      title: '房源总价',
      dataIndex: 'totalPrice',
    },
    {
      title: '业主姓名',
      dataIndex: 'ownerName',
    },
    {
      title: '联系电话',
      dataIndex: 'ownerPhone',
    },
    {
      title: '购房者姓名',
      dataIndex: 'customerName',
    },
    {
      title: '联系电话',
      dataIndex: 'customerPhone',
    },
    {
      title: '过户申请时间',
      dataIndex: 'applyDateTime',
    },
    {
      title: '过户状态',
      dataIndex: 'auditStatus',
      render:(text, record)=>{
        switch (record.applyAuditStatus) {
          case '过户申请驳回':
            return <div>
              <div>已受理</div>
              <div className='transferHasBeenRejected' onClick={()=>showDetailsModal(record)}>受理过户已驳回</div>
            </div>
          case '已撤回申请':
            return <div>
              <div>已受理</div>
              <div className='transferHasBeenRejected' onClick={()=>showDetailsModal(record)}>已撤回申请</div>
            </div>
          case '等待受理':
            return <div>
              <div>待受理</div>
            </div>
          case '过户驳回':
            return <div>
              <div>已受理</div>
              <div className='transferHasBeenRejected' onClick={()=>showDetailsModal(record)}>过户已驳回</div>
            </div>
          case '已完成过户':
            return <div>
              <div>已受理</div>
              <div className='newhousedeal-operation' onClick={()=>showDetailsModal(record)}>完成过户</div>
            </div>
          case '等待过户':
            return <div>
              <div>已受理</div>
              <div>受理过户</div>
            </div>
          default:
            return
        }
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render:(text,record)=>{
        switch (record.applyAuditStatus) {
          case '等待受理':
            return <div className='newhousedeal-operation' onClick={()=>showDetailsModal(record)}>受理过户</div>
          case '等待过户':
            return <div className='newhousedeal-operation'  onClick={()=>showDetailsModal(record)}>完成过户</div>
          default:
            return
        }
      }
    },
  ];
  const showDetailsModal=(record)=>{
    dispatch({
      type:"secondHandHouseTransfer/getDetailsInfos",
      payload:{
        applyId:record.key
      }
    })
    dispatch({
      type:"secondHandHouseTransfer/saveRecordAndShowModal",
      payload:{
        detailsModal:{
          ...detailsModal,
          currentRecord:record,
        }
      }
    })
  }

  const pagination={
    total:totalElements,
    showTotal:(data)=>{
       return `共 ${totalElements} 条`
    },
    pageSize:10,
    showQuickJumper:true,
    defaultCurrent:1,
    onChange:(page)=>{
      dispatch({
        type:'secondHandHouseTransfer/getInitTableData',
        payload:{
          pageNo:page-1,
          pageSize:10,
          keyWords:keyWords,
        }
      })
    },
  }
  const onOkCallBack=()=>{
    if(promptObj.todo==="closeModalAndInit"){
      if(!!form){
        form.resetFields();
      }
      dispatch({
        type:"secondHandHouseTransfer/togglePrompt",
        payload:{
          visible:false
        }
      })
      dispatch({
        type:"secondHandHouseTransfer/toggleShowDetailsModal",
        payload:{
          visible:false
        }
      })
      dispatch({
        type:"auditPassOrRejectModal/closeModal",
        payload:{
          visible:false
        }
      })
      dispatch({
        type:"secondHandHouseTransfer/getInitTableData",
        payload:{
          pageNo:currentPage,
          pageSize:10,
        }
      })
    }
    if(promptObj.todo==='closeModal'){
      if(!!form){
        form.resetFields();
      }
      dispatch({
        type:"secondHandHouseTransfer/togglePrompt",
        payload:{visible:false}
      })
    }
  }
  const onCancelCallBack=()=>{}
  return (
    <div>
      <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack}/>
      <ShowDetailsModal/>
      <div style={{paddingTop:20}}>
        <SearchInput placeholder='请在此输入筛选关键字进行搜索，所属小区，业主姓名，联系电话，购房者姓名，联系电话'
          clearFuc={clearFuc}
          searchFuc={searchFunction} type='button'
        />
      </div>
      <div style={{paddingTop:20}}>
        <Table dataSource={!!tableData?tableData:[]}
          columns={SecondHandHouseTransfer}
          pagination={pagination}
          className='ant_table_anzhu'
          loading={tableLoading}
        />
      </div>
    </div>
  )
}

function mapStateToProps({secondHandHouseTransfer}){
  return {secondHandHouseTransfer}
}

export default connect(mapStateToProps)(SecondHandHouseTransfer);
