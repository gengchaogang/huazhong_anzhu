import React from 'react'
import {connect} from 'dva'
import { routerRedux,Link } from 'dva/router'
import { DatePicker,Tabs,Table,Select,Modal,Button,Card } from 'antd';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
import SearchInput from '../../../commons/View/SearchInput'
import PromptModal from '../../../commons/View/PromptModal';
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../commons/utils/commonUtil.js';
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow'
import './ServiceFeeRevenueManagement.css'

/*****************************************************/
/*****************************************************/
/**********  财务管理：服务费收益管理 ******************/
/*****************************************************/
/*****************************************************/
//服务费收益
const serviceChargeIncomeColumns=[
  {
    title: '序号',
    dataIndex: 'number',
    key: 'number',
  },{
    title: '收益类型',
    dataIndex: 'incomeType',
    key: 'incomeType',
  },{
    title: '交易房源',
    dataIndex: 'tradingHouses',
    key: 'tradingHouses',
  },{
    title: '交易佣金',
    dataIndex: 'commission',
    key: 'commission',
  }, {
    title: '交易收费比例',
    dataIndex: 'transactionChargeRatio',
    key: 'transactionChargeRatio',
  },{
    title: '收益流水',
    dataIndex: 'returnFlow',
    key: 'returnFlow',
  }, {
    title: '收益方式',
    dataIndex: 'incomeApproach',
    key: 'incomeApproach',
  }, {
    title: '收益佣金',
    dataIndex: 'incomeCommission',
    key: 'incomeCommission',
  }, {
    title: '收益时间',
    dataIndex: 'incomeTime',
    key: 'incomeTime',
  }
];
//服务费支出
const serviceChargeExpendColumns=[
  {
    title: '序号',
    dataIndex: 'number',
    key: 'number',
  },
  {
    title: '支出类型',
    dataIndex: 'expenditureType',
    key: 'expenditureType',
  },
  {
    title: '支出流水号',
    dataIndex: 'serialNumberExpenditure',
    key: 'serialNumberExpenditure',
  },
  {
    title: '支出方式',
    dataIndex: 'expenditurePattern',
    key: 'expenditurePattern',
  },
  {
    title: '支出帐号',
    dataIndex: 'expenditureAccount',
    key: 'expenditureAccount',
  },
  {
    title: '支出金额',
    dataIndex: 'expenditureAmount',
    key: 'expenditureAmount',
  },
  {
    title: '支出时间',
    dataIndex: 'spendingTime',
    key: 'spendingTime',
  }
];

function ServiceFeeRevenueManagement({dispatch,serviceFeeRevenueManagement:{
  activeTableData,
  showTotalDataJSON,
  pagination,
  tabActiveKey,
  tableLoading,
}}){
  const placeholdershow=(key)=>{
		// console.log(key,'keykey');
		let _key='';
		if(key=='serviceChargeIncome'){
			_key='请在此输入筛选关键字进行搜索，支持交易房源，收益流水'
			return _key
		}else{
      // _key='请在此输入筛选关键字进行搜索，支持支出流水号，支出帐号'
      _key='请在此输入筛选关键字进行搜索，支持支出流水号'
			return _key
    }
	}
  const searchInputProps={
    placeholder:placeholdershow(tabActiveKey),
		searchFuc:(value)=>dispatch({
			type:'serviceFeeRevenueManagement/changeKeyWords',
			payload:value,
		}),
		clearFuc:(value)=>dispatch({
			type:'serviceFeeRevenueManagement/changeKeyWords',
			payload:'',
		}),
		type:'button',
		buttonTitle:'搜索',
  }
  const tableProps={
    dataSource:activeTableData,
    loading:tableLoading,
    pagination:{
      total: pagination.total,
      current:pagination.current,
      pageSize:10,
      onChange:(newPage)=>dispatch({
        type:'serviceFeeRevenueManagement/changePage',
        payload:newPage,
      }),
      showQuickJumper:true,
    },
  }
  const showTotalData=JSON.parse(showTotalDataJSON);
  return (
    <div>
      <div className="newHouseAdd">
        {showTotalData.map((value,index)=>(
          <div key={index} className="cardnewHouseAdd">
            <Card title={value.title}>
              <p>新房佣金收益（元）：{value.newHouseCommissionIncome}</p>
              <p>二手房出售收益（元）：{value.secondHandHouseSalesRevenue}</p>
              <p>二手房出租收益（元）：{value.secondHandHouseRentalIncome}</p>
            </Card>
          </div>
        ))}
      </div>
      <div style={{paddingTop:20,paddingBottom:20}}>
        <SearchInput {...searchInputProps}/>
      </div>
      <Tabs
        className='ant_tabs_anzhu'
        activeKey={tabActiveKey}
        onChange={(value)=>dispatch({
          type:'serviceFeeRevenueManagement/changeTab',
          payload:value,
        })}
        type='card'>
        <TabPane tab='交易服务费收益' key='serviceChargeIncome'>
          <Table columns={serviceChargeIncomeColumns} {...tableProps}/>
          {/*<span className='export-transaction-report'>导出交易中心服务费收益记录</span>*/}
        </TabPane>
        <TabPane tab='交易服务费支出' key='serviceChargeExpend'>
          <Table columns={serviceChargeExpendColumns} {...tableProps}/>
          {/*<span className='export-transaction-report'>导出交易中心服务费支出记录</span>*/}
        </TabPane>
      </Tabs>
    </div>
  )
}

function mapStateToProps({serviceFeeRevenueManagement}){
  return {serviceFeeRevenueManagement}
}

export default connect(mapStateToProps)(ServiceFeeRevenueManagement);
