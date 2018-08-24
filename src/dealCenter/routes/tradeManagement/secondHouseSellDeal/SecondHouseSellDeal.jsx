import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import {Button, Tabs, Input, Row,Table,Popover} from 'antd';
import { Link } from 'dva/router'
import { routerRedux } from 'dva/router'
import SearchInput from '../../../../commons/View/SearchInput'
const TabPane = Tabs.TabPane;
import './SecondHouseSellDeal.css'

function SecondHouseSellDeal({dispatch}) {
  const routePush=(path)=>{
    if(path && path.length!==0){
      dispatch(routerRedux.push({
        pathname: `/dealManagement/secondHouseSellDeal/${path}`,
      }));
    }
  }
  const searchInputProps={
    type:'button',
    placeholder:'请在此输入项目名称或所在区域名称进行搜索',
    searchFuc:(value)=>{console.log('搜索value',value)},
  }
  const pendingTable=[
    {
      title: '序号',
      dataIndex: 'number',
    },
    {
      title: '经纪人',
      dataIndex: 'booker',
    },
    {
      title: '联系电话',
      dataIndex: 'brokerPhoneNumber',
    },
    {
      title: '所属小区',
      dataIndex: 'belongDistrict',
    },
    {
      title: '物业类型',
      dataIndex: 'propertyType',
    },
    {
      title: '房源信息',
      dataIndex: 'listingInformation',
    },
    {
      title: '客户',
      dataIndex: 'client',
    },
    {
      title: '成交方式',
      dataIndex: 'transactions',
    },
    {
      title: '报成交时间',
      dataIndex: 'reportedTransactionTime',
    },
    {
      title: '状态',
      render:(text,record)=>{
        switch (record.key) {
          case 0:
            return <div className='turnDown'>以驳回</div>
          default:
            return <div>待处理</div>
        }
      }
    },
    {
      title: '操作',
      render:(text,record)=>{
        switch (record.key) {
          case 0:
            return <div className='newhousedeal-operation' onClick={()=>routePush('secondHouseSaleRejectedDetails')}>详情</div>
          default:
            return <div>
              <Popover placement='bottom' content={businessManagement} title={false} trigger="click">
								<span className='newhousedeal-operation'>业务办理</span>
							</Popover>
              <div className='newhousedeal-operation' onClick={()=>routePush('secondHouseSaleDetails')}>详情</div>
            </div>
        }
      }
    },
  ]
  const businessManagement=<div>
		<p className='newhousedeal-operation-item' >驳回申请</p>
		<p className='newhousedeal-operation-item' onClick={()=>routePush('payIntentionMoney')}>缴纳意向金</p>
		<p className='newhousedeal-operation-item' onClick={()=>routePush('payTheDownPayment')}>缴纳首付</p>
		<p className='newhousedeal-operation-item' onClick={()=>routePush('payACommission')}>缴纳佣金</p>
		<p className='newhousedeal-operation-item' onClick={()=>routePush('propertyDetention')}>房产解押</p>
	</div>
  const pendingTableData=[];
  for(let i=0;i<20; i++){
    pendingTableData.push({
      key:i,
      number:i,
      booker:'黄岳',
      brokerPhoneNumber:'联系电话',
      belongDistrict:'远洋山水',
      propertyType:'普通住宅',
      listingInformation:'A区/1号楼/1单元/2003室',
      client:'林八千',
      transactions:'合作成交',
      reportedTransactionTime:'2016-10-24 19:00',
    })
  }
  const dealDoneTable=[
    {
      title: '序号',
      dataIndex: 'number',
    },
    {
      title: '所属经纪人',
      dataIndex: 'affiliatedBroker',
    },
    {
      title: '所属小区',
      dataIndex: 'belongDistrict',
    },
    {
      title: '物业类型',
      dataIndex: 'propertyType',
    },
    {
      title: '房源信息',
      dataIndex: 'listingInformation',
    },
    {
      title: '客户',
      dataIndex: 'client',
    },
    {
      title: '成交方式',
      dataIndex: 'transactions',
    },
    {
      title: '报成交时间',
      dataIndex: 'reportedTransactionTime',
    },
    {
      title: '业务办理',
      dataIndex: 'businessManagement',
    },
    {
      title: '业务状态',
      dataIndex: 'businessStatus',
    },
    {
      title: '业务办理时间',
      dataIndex: 'businessProcessingTime',
    },
    {
      title: '操作',
      render:text=><div className='newhousedeal-operation' onClick={()=>routePush('secondHouseSaleTransactionDetails')}>详情</div>
    },
  ]
  const dealDoneTableData=[];
  for(let i=0;i<20; i++){
    dealDoneTableData.push({
      key:i,
      number:i,
      affiliatedBroker:'黄岳',
      belongDistrict:'远洋山水',
      propertyType:'普通住宅',
      listingInformation:'A区/1号楼/1单元/2003室',
      client:'林枫',
      transactions:'合作成交',
      reportedTransactionTime:'2016-10-24 19:00',
      businessManagement:'张三',
      businessStatus:'已成交 等待佣金分配',
      businessProcessingTime:'2016-10-24 19:00',
    })
  }
	return (
		<div>
      <div className='newhousedeal-sortBox-right'>
				<SearchInput {...searchInputProps}/>
			</div>
			<div>
				<Tabs type="card">
					<TabPane tab='待处理' key='pending'>
            <Table columns={pendingTable} dataSource={pendingTableData}/>
						<span className='export-transaction-report'>导出二手房待处理</span>
					</TabPane>
					<TabPane tab='待成交' key='toBeTraded'>
						<span className='export-transaction-report'>导出二手房待成交列表</span>
					</TabPane>
					<TabPane tab='已成交' key='dealDone'>
            <Table dataSource={dealDoneTableData} columns={dealDoneTable}/>
						<span className='export-transaction-report'>导出二手成交房源记录</span>
					</TabPane>
				</Tabs>
			</div>
		</div>
	);
}

SecondHouseSellDeal.propTypes = {
}
function mapStateToProps({secondHouseSellDeal}) {
	return { secondHouseSellDeal };
}

export default connect(mapStateToProps)(SecondHouseSellDeal)
