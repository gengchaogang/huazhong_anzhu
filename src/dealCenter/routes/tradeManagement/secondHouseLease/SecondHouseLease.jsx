import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import {Button, Tabs, Input, Row,Table,Popover} from 'antd';
const TabPane = Tabs.TabPane;
import { Link } from 'dva/router'
import { routerRedux } from 'dva/router'
import SearchInput from '../../../../commons/View/SearchInput'
function SecondHouseLease({dispatch}) {
	//表格上方tag切换回调
	const routePush=(path)=>{
    if(path && path.length!==0){
      dispatch(routerRedux.push({
        pathname: `/dealManagement/secondHouseLease/${path}`,
      }));
    }
  }
  const pendingTableData=[];
  for(let i = 0; i < 50; i++){
    pendingTableData.push({
      key:i,
      number:i,
      leasingBroker:'黄岳',
      contactNumber:'15120050558',
      client:'黄林枫',
      clientContactNumber:'151******558',
      propertyType:'商铺',
      listingInformation:'A区/1号楼/1单元/2003室',
      transactions:'合作成交',
      reportedRentalTime:'2016-10-24 19:00',
      businessProcessingTime:'2016-10-24 19:00',
      status:'待处理',
    })
  }
  const pendingTable=[
    {
			title: '序号',
			dataIndex: 'number',
			key: '1',
		},
    {
			title: '报出租经纪人',
			dataIndex: 'leasingBroker',
			key: 'leasingBroker',
		},
    {
			title: '联系电话',
			dataIndex: 'contactNumber',
			key: 'contactNumber',
		},
    {
			title: '客户',
			dataIndex: 'client',
			key: 'client',
		},
    {
			title: '联系电话',
			dataIndex: 'clientContactNumber',
			key: 'clientContactNumber',
		},
    {
			title: '物业类型',
			dataIndex: 'propertyType',
			key: 'propertyType',
		},
    {
			title: '房源信息',
			dataIndex: 'listingInformation',
			key: 'listingInformation',
		},
    {
			title: '成交方式',
			dataIndex: 'transactions',
			key: 'transactions',
		},
    {
			title: '报出租时间',
			dataIndex: 'reportedRentalTime',
			key: 'reportedRentalTime',
		},
    {
			title: '业务办理时间',
			dataIndex: 'businessProcessingTime',
			key: 'businessProcessingTime',
		},
    {
			title: '状态',
			dataIndex: 'status',
			key: 'status',
		},
    {
			title: '操作',
			key: 'operation',
      render:(text,record)=>{
        switch (record.key) {
          case 0:
            return <div>
							<Popover placement='bottom' content={businessManagement} title={false} trigger="click">
								<span className='newhousedeal-operation'>业务办理</span>
							</Popover>
              <div className='newhousedeal-operation' onClick={()=>routePush('rentPendingDetails')}>详情</div>
            </div>
          case 1:
            return <div>
							<Popover placement='bottom' content={businessManagement} title={false} trigger="click">
								<span className='newhousedeal-operation'>业务办理</span>
							</Popover>
              <div className='newhousedeal-operation' onClick={()=>routePush('rentPendingDetails')}>详情</div>
            </div>
          default:
            return <div className='newhousedeal-operation' onClick={()=>routePush('rentDetails')}>详情</div>
        }
      }
		},
  ];
	const waitingDealData=[];
	for (let i = 0; i < 50; i++) {
		waitingDealData.push({
			key: i,
			number:i,
			agent:'黄岳',
			agentContactNumber:'15120050558',
			customer:'黄林枫',
			customerContactNumber:'151*****558',
			propertyType: '商铺',
			housingInformation: 'A区/1号楼/1单元/2003室',
			transactionMode:'自有客户',
			reportedTransactionTime:'2016-10-24 19:00',
			businessProcessingTime:'2016-10-24 19:00',
		});
	}
	const hasReportedTablePropsPopoverContent=<div>
		<p className='newhousedeal-operation-item' onClick={()=>routePush('applicationStaging')}>申请分期</p>
		<p className='newhousedeal-operation-item' onClick={()=>routePush('paymentCommission')}>支付佣金</p>
		<p className='newhousedeal-operation-item' onClick={()=>routePush('dealWithTransactions')}>办理成交</p>
	</div>
	const businessManagement=<div>
		<p className='newhousedeal-operation-item' >驳回申请</p>
		<p className='newhousedeal-operation-item' onClick={()=>routePush('handleIntention')}>办理意向</p>
		<p className='newhousedeal-operation-item' onClick={()=>routePush('applicationStaging')}>申请分期</p>
		<p className='newhousedeal-operation-item' onClick={()=>routePush('paymentCommission')}>支付佣金</p>
		<p className='newhousedeal-operation-item' onClick={()=>routePush('dealWithTransactions')}>办理成交</p>
	</div>
	const waitingDeal={
		columns:[
			{
				title: '序号',
				dataIndex: 'number',
				key: '1',
			},
			{
				title: '经纪人',
				dataIndex: 'agent',
				key: 'agent',
			},
			{
				title: '联系电话',
				dataIndex: 'agentContactNumber',
				key: 'agentContactNumber',
			},
			{
				title: '客户',
				dataIndex: 'customer',
				key: 'customer',
			},
			{
				title: '联系电话',
				dataIndex: 'customerContactNumber',
				key: 'customerContactNumber',
			},
			{
				title: '物业类型',
				dataIndex: 'propertyType',
				key: 'propertyType',
			},
			{
				title: '房源信息',
				dataIndex: 'housingInformation',
				key: 'housingInformation',
			},
			{
				title: '成交方式',
				dataIndex: 'transactionMode',
				key: 'transactionMode',
			},
			{
				title: '报成交时间',
				dataIndex: 'reportedTransactionTime',
				key: 'reportedTransactionTime',
			},
			{
				title: '业务状态',
				dataIndex: 'serviceStatus',
				key: 'serviceStatus',
				render:(text,record)=>{
					switch (record.key) {
						case 0:
							return <div>
								<div className='newhousedeal-operation ywbl'>已缴纳意向金</div>
								<div className='newhousedeal-operation ywbl' onClick={()=>routePush('supplementalAgreement')}>补传协议</div>
							</div>;
						case 1:
							return <div>
								<div className='newhousedeal-operation ywbl'>已缴纳意向金</div>
								<div className='newhousedeal-operation ywbl' onClick={()=>routePush('')}>申请退款-等待审核</div>
							</div>;
						case 2:
							return <div>
								<div className='newhousedeal-operation ywbl'>已缴纳意向金</div>
								<div className='newhousedeal-operation ywbl' onClick={()=>routePush('')}>申请退款-等待财务审核</div>
							</div>;
						case 3:
							return <div>
								<div className='newhousedeal-operation ywbl'>申请分期</div>
								<div className='newhousedeal-operation ywbl' onClick={()=>routePush('')}>已受理</div>
							</div>;
						case 4:
							return <div>
								<div className='newhousedeal-operation ywbl'>已缴纳意向金</div>
								<div className='newhousedeal-operation ywbl' onClick={()=>routePush('secondHouseLeaseDetails')}>已退款</div>
							</div>;
						default:
							return <div className='newhousedeal-operation' onClick={()=>routePush('secondHouseLeaseDetails')}>待审核</div>;
					}
				}
			},
			{
				title: '业务办理时间',
				dataIndex: 'businessProcessingTime',
				key: 'businessProcessingTime',
			},
			{
				title: '操作',
				dataIndex: 'operation',
				key: 'operation',
				render:(text,record)=>{
					switch (record.key) {
						case 1:
							return <div>
								<Popover placement='bottom' content={hasReportedTablePropsPopoverContent} title={false} trigger="click">
		              <span className='newhousedeal-operation'>业务办理</span>
		            </Popover>
								<span className='newhousedeal-operation ywbl'>退款</span>
								<span className='newhousedeal-operation ywbl' onClick={()=>routePush('secondHouseLeaseDetails')}>详情</span>
							</div>;
						default:
							return <div className='newhousedeal-operation' onClick={()=>routePush('secondHouseLeaseDetails')}>详情</div>;
					}
				}
			},
		],
		dataSource:waitingDealData,
	}
  const hasGroupPurchaseTable=[
    {
      title: '序号',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: '经纪人',
      dataIndex: 'broker',
      key: 'broker',
    },
    {
      title: '联系电话',
      dataIndex: 'brokerContactNumber',
      key: 'brokerContactNumber',
    },
    {
      title: '客户',
      dataIndex: 'client',
      key: 'client',
    },
    {
      title: '联系电话',
      dataIndex: 'clientContactNumber',
      key: 'clientContactNumber',
    },
    {
      title: '物业类型',
      dataIndex: 'propertyType',
      key: 'propertyType',
    },
    {
      title: '房源信息',
      dataIndex: 'listingInformation',
      key: 'listingInformation',
    },
    {
      title: '成交方式',
      dataIndex: 'transactions',
      key: 'transactions',
    },
    {
      title: '报成交时间',
      dataIndex: 'reportedTransactionTime',
      key: 'reportedTransactionTime',
    },
    {
      title: '业务状态',
      dataIndex: 'businessStatus',
      key: 'businessStatus',
    },
    {
      title: '业务办理时间',
      dataIndex: 'businessProcessingTime',
      key: 'businessProcessingTime',
    },
    {
      title: '操作',
      key: 'operation',
      render:text=><div className='newhousedeal-operation' onClick={()=>routePush('dealDoneDetails')}>详情</div>
    },
  ]
  const hasGroupPurchaseTableData=[];
  for (let i = 0; i < 50; i++) {
    hasGroupPurchaseTableData.push({
      key:i,
      number:i,
      broker:'黄岳',
      brokerContactNumber:'15120050558',
      client:'黄林枫',
      clientContactNumber:'151*****558',
      propertyType:'商铺',
      listingInformation:'A区/1号楼/1单元/2003室',
      transactions:'自有客户',
      reportedTransactionTime:'2016-10-24 19:00',
      businessStatus:'已成交 待分佣',
      businessProcessingTime:'2016-10-24 19:00',
    })
  }
	const searchInputProps={
    type:'button',
    placeholder:'请在此输入项目名称或所在区域名称进行搜索',
    searchFuc:(value)=>{console.log('搜索value',value)},
  }
	return (
		<div>
			<div className='newhousedeal-sortBox-right'>
				<SearchInput {...searchInputProps}/>
			</div>
			<div>
				<Tabs type="card">
					<TabPane tab='待处理' key='hasReported'>
            <Table columns={pendingTable} dataSource={pendingTableData}/>
						<span className='export-transaction-report'>导出待出租记录</span>
					</TabPane>
					<TabPane tab='待成交' key='waitingDeal'>
            <Table {...waitingDeal}/>
						<span className='export-transaction-report'>导出待成交记录</span>
					</TabPane>
					<TabPane tab='已成交' key='hasGroupPurchase'>
            <Table dataSource={hasGroupPurchaseTableData} columns={hasGroupPurchaseTable}/>
						<span className='export-transaction-report'>导出已成交记录</span>
					</TabPane>
				</Tabs>
			</div>
		</div>
	);
}

SecondHouseLease.propTypes = {
}
function mapStateToProps({secondHouseLease}) {
	return { secondHouseLease };
}

export default connect(mapStateToProps)(SecondHouseLease)
