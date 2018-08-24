import React from 'react'
import {connect} from 'dva'
import {Table,Popover,Modal,Input,Tooltip} from 'antd'
import { routerRedux } from 'dva/router'
import './PendingTreatment.css'
function PendingTreatment({dispatch,secondDeal}){
  const {showRejectApplicationModal}=secondDeal
  const showModal=()=>{
    console.log(secondDeal)
    dispatch({
      type:'secondDeal/showRejectApplicationModal'
    })
  }
  //模拟数据
  const hasReportedTablePropsData=[];
  hasReportedTablePropsData.push({
    key: 0,
    agent: '黄岳',
    phoneNumber: '120533253555',
    residentialArea:'远洋山水',
    propertyType: '普通住宅',
    houseResourceInfo: 'A区域/1号楼/1单元/1003室',
    customer:<span className='newhousedeal-operation'>林八千</span>,
    transactionMode:<span className='newhousedeal-operation'>合作成交</span>,
    reportedTransactionTime:'2016-10-24 17:00',
    status: <span className="reject" onClick={showModal}>已驳回</span>,
    operation:"业务办理"
  });

  //模拟点击状态为已驳回的房源跳转到报成交-驳回的详情页
 const toReportReject=()=>{
   dispatch({
     type:'secondDeal/setState',
     payload:{
       currentChildDetail:'RejectionReason'
     }
   })
   dispatch(routerRedux.push({
     pathname:'/dealManagement/secondHouseSellDeal/HandSellDetails',
   }))
 }

 //模拟点击状态为待处理的房源跳转到报成交的详情页
 const toReportedTransaction=()=>{
   dispatch(routerRedux.push({
     pathname:'/dealManagement/secondHouseSellDeal/HandSellDetails',
   }))
 }
  for (let i = 1; i < 50; i++) {
    hasReportedTablePropsData.push({
      key: i,
      agent: '黄岳',
      phoneNumber: '120533253555',
      residentialArea:'远洋山水',
      propertyType: '商铺',
      houseResourceInfo: 'A区域/1号楼/1单元/1003室',
      customer:'林八千',
      transactionMode:<span>自有客户</span>,
      reportedTransactionTime:'2016-10-24 19:00',
      status: <span>待处理</span>,
      operation: '业务办理',
    });
  }
  //模拟序号跟pageSize相关联
  let aaa=1
  let pageSize=10
  const pendingTreatmentPopoverContent=<div>
    <p className='newhousedeal-operation-item' onClick={showModal}>驳回申请</p>
    <p className='newhousedeal-operation-item' >缴纳意向金</p>
    <p className='newhousedeal-operation-item' >缴纳首付</p>
    <p className='newhousedeal-operation-item' >缴纳佣金</p>
    <p className='newhousedeal-operation-item' >房产解押</p>
  </div>
  const hasReportedTableProps={
    columns:[
      {
        title: '序号',
        render:(text,record,index)=>{
          if(aaa<1){
            return(aaa+1)
          }else{
            return(pageSize*(aaa-1)+(index+1))
          }
        }
      }, {
        title: '经纪人',
        dataIndex: 'agent',
      },{
        title: '联系电话',
        dataIndex: 'phoneNumber',
      },{
        title:'所属小区',
        dataIndex:'residentialArea',
      },{
        title:'物业类型',
        dataIndex:'propertyType',
        filters:[{
          text:'普通住宅',
          value:'普通住宅'
        },{
          text:'商铺',
          value:'商铺'
        },{
          text:'写字楼',
          value:'写字楼'
        }],
        onFilter: (value, record) =>record.propertyType.indexOf(value) === 0,
      },{
        title:'房源信息',
        dataIndex:'houseResourceInfo',
      },{
        title:'客户',
        dataIndex:'customer'
      },{
        title:'成交方式',
        dataIndex:'transactionMode',
        filters:[{
          text:'合作成交',
          value:'合作成交'
        },{
          text:'自有客户',
          value:'自有客户'
        }],
        onFilter: (value, record) =>record.transactionMode.props.children.indexOf(value) === 0,
      },{
        title:'报成交时间',
        dataIndex:'reportedTransactionTime',
        sorter: (a, b) =>
        a.reportedTransactionTime.replace(/[^0-9]+/g, '')>b.reportedTransactionTime.replace(/[^0-9]+/g,'')?1:-1
      },{
        title:'状态',
        dataIndex:'status',
        filters:[{
          text:'已驳回',
          value:'已驳回'
        },{
          text:'待处理',
          value:'待处理'
        }],
        onFilter:(value,record)=>record.status.props.children.indexOf(value)===0
      },{
        title:'操作',
        dataIndex:'operation',
        onCellClick:function(record,e){
        },
        render:(text,record,index)=>{
          if(record.status.props.children==='已驳回'){
            return(
                    text=<div>
                              <span className='newhousedeal-operation' onClick={toReportReject}>详情</span>
                            </div>
            )
          }else if(record.status.props.children==='待处理'){
            return(
              text=<div>
                       <Popover placement='bottom' content={pendingTreatmentPopoverContent} title={false} trigger="click">
                         <span className='newhousedeal-operation'>业务办理</span>
                       </Popover>
                      <span className='newhousedeal-operation' onClick={toReportedTransaction}>详情</span>
                    </div>
            )
          }
        },
      }
    ],
    dataSource:hasReportedTablePropsData,
    pagination:{
      total: hasReportedTablePropsData.length,
      onShowSizeChange: (current, pageSize) => {
        console.log('Current: ', current, '; PageSize: ', pageSize);
      },
      onChange: (current) => {
        console.log('Current: ', current);
        aaa=current
      },
      showQuickJumper:true,
    },
  }
//modal点击OK事件
  const handleOk=()=>{
    dispatch({type:"secondDeal/showRejectApplicationModal"})
  }
  //modal点击关闭事件
  const handleCancel=()=>{
    dispatch({type:"secondDeal/showRejectApplicationModal"})
  }
  return(
    <div>
      <Table className='newhousedeal-table' {...hasReportedTableProps} />
        <Modal title="驳回理由" visible={showRejectApplicationModal} onOk={handleOk} onCancel={handleCancel}>
          <Tooltip placement="top" title="您最多可以输入50个字符">
            <Input type="textarea" maxLength="50"/>
          </Tooltip>
        </Modal>
    </div>
  )
}


function mapStateToProps({secondDeal}){
  return{secondDeal}
}

export default connect(mapStateToProps)(PendingTreatment)
