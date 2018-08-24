import React from 'react'
import {connect} from 'dva'
import moment from 'moment';
import {Table,Modal} from 'antd';
import SearchInput from '../../../commons/View/SearchInput'
import ShowRentalLoansDetailsModal from '../../components/loanManagement/ShowRentalLoansDetailsModal'
import PromptModal from '../../../commons/View/PromptModal'
function SecondHandHouseRentalLoans({dispatch,secondHandHouseRentalLoans}){
  const {
    tableLoading,
    totalElements,
    currentPage,
    tableData,
    detailsModal,
    promptObj,
    form,
    keyWords,
  }=secondHandHouseRentalLoans;
  const searchFunction=(e)=>{
    dispatch({
      type:"secondHandHouseRentalLoans/getInitTableData",
      payload:{
        pageNo:0,
        pageSize:10,
        keyWords:e
      }
    })
  }
  const clearFuc=()=>{
    dispatch({
      type:"secondHandHouseRentalLoans/getInitTableData",
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
    title:"租金",
    dataIndex:"actualRent"
    },
    {
      title: '租金/押金',
      dataIndex: 'paymentMethod',
    },
    {
      title: '贷款客户',
      dataIndex: 'customerName',
    },
    {
      title: '联系电话',
      dataIndex: 'customerPhone',
    },
    {
      title: '申请时间',
      dataIndex: 'applyDateTime',
    },
    {
      title: '客户类型',
      dataIndex: 'customerType',
    },
    {
      title: '贷款金额',
      dataIndex: 'loanAmount',
    },
    {
      title: '贷款状态',
      dataIndex: 'dealStatus',
      render:(text, record)=>{
        switch (record.applyAuditStatus) {
          case '批款驳回':
            return <div>
              <div>已受理</div>
              <div className='transferHasBeenRejected' onClick={()=>showDetailsModal(record)}>分期已驳回</div>
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
          case '贷款申请驳回':
            return <div>
              <div>已受理</div>
              <div className='transferHasBeenRejected' onClick={()=>showDetailsModal(record)}>分期已驳回</div>
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
      type:"secondHandHouseRentalLoans/getDetailsInfos",
      payload:{
        applyId:record.key
      }
    })
    dispatch({
      type:"secondHandHouseRentalLoans/saveRecordAndShowModal",
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
        type:'secondHandHouseRentalLoans/getInitTableData',
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
        type:"secondHandHouseRentalLoans/togglePrompt",
        payload:{
          visible:false
        }
      })
      dispatch({
        type:"secondHandHouseRentalLoans/toggleShowDetailsModal",
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
        type:"secondHandHouseRentalLoans/getInitTableData",
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
        type:"secondHandHouseRentalLoans/togglePrompt",
        payload:{visible:false}
      })
    }
  }
  const onCancelCallBack=()=>{}
  return (
    <div>
      <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack}/>
      <ShowRentalLoansDetailsModal/>
      <div style={{paddingTop:20}}>
        <SearchInput placeholder='请在此输入筛选关键字进行搜索，支持所属小区，客户姓名，联系电话'
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

function mapStateToProps({secondHandHouseRentalLoans}){
  return {secondHandHouseRentalLoans}
}

export default connect(mapStateToProps)(SecondHandHouseRentalLoans);
