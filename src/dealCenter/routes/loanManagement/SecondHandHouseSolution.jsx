import React from 'react'
import {connect} from 'dva'
import moment from 'moment';
import {Table,Modal} from 'antd';
import SearchInput from '../../../commons/View/SearchInput'
import ShowDetailsModal from '../../components/loanManagement/ShowDetailsModal'
import PromptModal from '../../../commons/View/PromptModal'
function SecondHandHouseSolution({dispatch,secondHandHouseSolution}){
  const {
    tableLoading,
    totalElements,
    currentPage,
    tableData,
    detailsModal,
    promptObj,
    keyWords,
    form,
  }=secondHandHouseSolution;
  const searchFunction=(e)=>{
    dispatch({
      type:"secondHandHouseSolution/getInitTableData",
      payload:{
        pageNo:0,
        pageSize:10,
        keyWords:e
      }
    })
  }
  const clearFuc=()=>{
    dispatch({
      type:"secondHandHouseSolution/getInitTableData",
      payload:{
        pageNo:0,
        pageSize:10,
        keyWords:''
      }
    })
  }
  const columns=[
    {
      title: '序号',
      dataIndex: 'number',
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
      title: '房屋面积',
      dataIndex: 'resourceArea',
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
      title: '解押贷款金额',
      dataIndex: 'loanAmount',
    },
    {
      title: '办理状态',
      dataIndex: 'dealStatus',
      render:(text, record)=>{
        switch (record.applyAuditStatus) {
          case '解押驳回':
            return <div>
              <div>已受理</div>
              <div className='transferHasBeenRejected' onClick={()=>showDetailsModal(record)}>贷款被驳回</div>
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
          case '解押申请驳回':
            return <div>
              <div>已受理</div>
              <div className='transferHasBeenRejected' onClick={()=>showDetailsModal(record)}>贷款被驳回</div>
            </div>
          case '已批款':
            return <div>
              <div>已受理</div>
              <div className='newhousedeal-operation' onClick={()=>showDetailsModal(record)}>贷款已批款</div>
            </div>
          case '等待批款':
            return <div>
              <div>已受理</div>
              <div>待批款</div>
            </div>
          case '已撤回申请':
            return <div>
              <div className='transferHasBeenRejected' onClick={()=>showDetailsModal(record)}>已撤回申请</div>
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
        switch (record.applyAuditStatus){
          case '等待受理':
            return <div className='newhousedeal-operation' onClick={()=>showDetailsModal(record)}>受理</div>
          case '等待批款':
            return <div className='newhousedeal-operation' onClick={()=>showDetailsModal(record)}>批款</div>
          default:
            return
        }
      }
    },
  ];
  const showDetailsModal=(record)=>{
    dispatch({
      type:"secondHandHouseSolution/getDetailsInfos",
      payload:{
        applyId:record.key
      }
    })
    dispatch({
      type:"secondHandHouseSolution/saveRecordAndShowModal",
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
        type:'secondHandHouseSolution/getInitTableData',
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
        form.resetFields()
      }
      dispatch({
        type:"secondHandHouseSolution/togglePrompt",
        payload:{
          visible:false
        }
      })
      dispatch({
        type:"secondHandHouseSolution/toggleShowDetailsModal",
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
        type:"secondHandHouseSolution/getInitTableData",
        payload:{
          pageNo:currentPage,
          pageSize:10,
        }
      })
    }
    if(promptObj.todo==='closeModal'){
      if(!!form){
        form.resetFields()
      }
      dispatch({
        type:"secondHandHouseSolution/togglePrompt",
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
        <SearchInput placeholder='请在此输入筛选关键字进行搜索，支持所属小区，业主姓名，联系电话'
          clearFuc={clearFuc}
          searchFuc={searchFunction} type='button'
        />
      </div>
      <div style={{paddingTop:20}}>
        <Table dataSource={!!tableData?tableData:[]}
          columns={columns}
          className='ant_table_anzhu'
          pagination={pagination}
          loading={tableLoading}
        />
      </div>
    </div>
  )
}

function mapStateToProps({secondHandHouseSolution}){
  return {secondHandHouseSolution}
}

export default connect(mapStateToProps)(SecondHandHouseSolution);
