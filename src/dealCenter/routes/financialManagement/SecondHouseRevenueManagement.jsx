import React from 'react'
import {connect} from 'dva'
const TabPane = Tabs.TabPane;
const Option = Select.Option;
import { routerRedux,Link } from 'dva/router'
import { DatePicker,Tabs,Table,Select,Modal,Button ,Card} from 'antd';
import SearchInput from '../../../commons/View/SearchInput'
import PromptModal from '../../../commons/View/PromptModal';
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../commons/utils/commonUtil.js';
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow';
import './SecondHouseRevenueManagement.css'
/*****************************************************/
/*****************************************************/
/**********  财务管理：二手房交易收支管理 ***************/
/*****************************************************/
/*****************************************************/
//二手房出售 支出
const shSellIncomeColumns=[
  {
    title: '序号',
    dataIndex: 'number',
    key: 'number',
  },{
    title: '房源编号',
    dataIndex: 'inventoryNumber',
    key: 'inventoryNumber',
    render:(text,record)=><Link className='deal_operation' to={{
      pathname:'/tradeManagement/secondHouseSellTrade/secondHouseSellHousesDetails',
      state:{
        transCode:record.transCode,
      }
    }}>{text}</Link>
  },{
    title: '支付类型',
    dataIndex: 'paymentType',
    key: 'paymentType',
  },{
    title: '订单流水号',
    dataIndex: 'orderNumber',
    key: 'orderNumber',
  }, {
    title: '支付流水号',
    dataIndex: 'paymentTransaction',
    key: 'paymentTransaction',
  },{
    title: '支付方式',
    dataIndex: 'paymentMethod',
    key: 'paymentMethod',
  }, {
    title: '支付客户',
    dataIndex: 'payingCustomers',
    key: 'payingCustomers',
  }, {
    title: '支付金额',
    dataIndex: 'paymentAmount',
    key: 'paymentAmount',
  }, {
    title: '支付状态',
    dataIndex: 'paymentStatus',
    key: 'paymentStatus',
  }, {
    title: '支付时间',
    dataIndex: 'paymentTime',
    key: 'paymentTime',
  }
];
//二手房出售 收入
const shSellExpendColumns=[
  {
    title: '序号',
    dataIndex: 'number',
    key: 'number',
  },
  {
    title: '房源编号',
    dataIndex: 'inventoryNumber',
    key: 'inventoryNumber',
    render:(text,record)=><Link className='deal_operation' to={{
      pathname:'/tradeManagement/secondHouseSellTrade/secondHouseSellHousesDetails',
      state:{
        transCode:record.transCode,
      }
    }}>{text}</Link>
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
    title: '支出订单号',
    dataIndex: 'expenditureOrderNumber',
    key: 'expenditureOrderNumber',
  },
  {
    title: '申请时间',
    dataIndex: 'applicationTime',
    key: 'applicationTime',
  },
  {
    title: '支付方式',
    dataIndex: 'paymentMethod',
    key: 'paymentMethod',
  },
  // {
  //   title: '支付账户',
  //   dataIndex: 'paymentAccount',
  //   key: 'paymentAccount',
  // },
  {
    title: '支出金额',
    dataIndex: 'expenditureAmount',
    key: 'expenditureAmount',
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
  },
  {
    title: '支出时间',
    dataIndex: 'spendingTime',
    key: 'spendingTime',
  },
];
//二手房出租 收入
const shRentIncomeColumns=[
  {
    title: '序号',
    dataIndex: 'number',
    key: 'number',
  },
  {
    title: '房源编号',
    dataIndex: 'inventoryNumber',
    key: 'inventoryNumber',
    render:(text,record)=><Link className='deal_operation' to={{
      pathname:'/tradeManagement/secondHouseRentTrade/secondHouseRentHousesDetails',
      state:{
        transCode:record.transCode,
      }
    }}>{text}</Link>
  },
  {
    title: '支付类型',
    dataIndex: 'paymentType',
    key: 'paymentType',
  },
  {
    title: '订单流水号',
    dataIndex: 'orderNumber',
    key: 'orderNumber',
  },
  {
    title: '支付流水号',
    dataIndex: 'paymentTransaction',
    key: 'paymentTransaction',
  },
  {
    title: '支付方式',
    dataIndex: 'paymentMethod',
    key: 'paymentMethod',
  },
  {
    title: '支付客户',
    dataIndex: 'payingCustomers',
    key: 'payingCustomers',
  },
  {
    title: '支付金额',
    dataIndex: 'paymentAmount',
    key: 'paymentAmount',
  },
  {
    title: '支付状态',
    dataIndex: 'paymentStatus',
    key: 'paymentStatus',
  },
  {
    title: '支付时间',
    dataIndex: 'paymentTime',
    key: 'paymentTime',
  },
];
//二手房出租 支出
const shRentExpendColumns=[
  {
    title: '序号',
    dataIndex: 'number',
    key: 'number',
  },
  {
    title: '房源编号',
    dataIndex: 'inventoryNumber',
    key: 'inventoryNumber',
    render:(text,record)=><Link className='deal_operation' to={{
      pathname:'/tradeManagement/secondHouseRentTrade/secondHouseRentHousesDetails',
      state:{
        transCode:record.transCode,
      }
    }}>{text}</Link>
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
    title: '支付订单号',
    dataIndex: 'paymentOrderNumber',
    key: 'paymentOrderNumber',
  },
  {
    title: '申请时间',
    dataIndex: 'applicationTime',
    key: 'applicationTime',
  },
  {
    title: '支付方式',
    dataIndex: 'paymentMethod',
    key: 'paymentMethod',
  },
  // {
  //   title: '支出账户',
  //   dataIndex: 'expenditureAccount',
  //   key: 'expenditureAccount',
  // },
  {
    title: '支付金额',
    dataIndex: 'paymentAmount',
    key: 'paymentAmount',
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
  },
  {
    title: '操作时间',
    dataIndex: 'operationTime',
    key: 'operationTime',
  },
];

function SecondHouseRevenueManagement({dispatch,secondHouseRevenueManagement:{
  activeTableData,
  showTotalDataJSON,
  pagination,
  tabActiveKey,
  tableLoading,
}}){
  const placeholdershow=(key)=>{
		// console.log(key,'keykey');
		let _key='';
		if(key=='shSellIncome'){
			_key='请在此输入筛选关键字进行搜索，支持房源编号，订单流水号，支付流水号，支付客户'
			return _key
		}else if(key=='shSellExpend'){
			_key='请在此输入筛选关键字进行搜索，支持房源编号，支出流水号，支出订单号'
			return _key
		}else if(key=='shRentIncome'){
      _key='请在此输入筛选关键字进行搜索，支持房源编号，订单流水号，支付流水号，支付客户'
			return _key
    }else{
      _key='请在此输入筛选关键字进行搜索，支持房源编号，支出流水号，支付订单号'
			return _key
    }
	}
  const searchInputProps={
    placeholder:placeholdershow(tabActiveKey),
		searchFuc:(value)=>dispatch({
			type:'secondHouseRevenueManagement/changeKeyWords',
			payload:value,
		}),
		clearFuc:(value)=>dispatch({
			type:'secondHouseRevenueManagement/changeKeyWords',
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
        type:'secondHouseRevenueManagement/changePage',
        payload:newPage,
      }),
      showQuickJumper:true,
    },
  }
  const showTotalData=JSON.parse(showTotalDataJSON);
  return (
    <div className='secondHouseRevenueManagement'>
      <p className='secondHouseRevenueManagement_title'>二手房出售</p>
      <div className="newHouseAdd">
        {showTotalData.sellData.map((value,index)=>(
          <div key={index} className="cardnewHouseAdd">
            <Card title={value.title}>
              <p>定金（元）：{value.deposit}</p>
              {/*<p>首付款（元）：{value.firstPayment}</p>*/}
              <p>中介费（元）：{value.agencyFee}</p>
              <p>退款金额（元）：{value.refundAmount}</p>
            </Card>
          </div>
        ))}
      </div>
      <p className='secondHouseRevenueManagement_title'>二手房出租</p>
      <div className="newHouseAdd">
        {showTotalData.rentData.map((value,index)=>(
          <div key={index} className="cardnewHouseAdd">
            <Card title={value.title}>
              <p>定金（元）：{value.deposit}</p>
              <p>中介费（元）：{value.agencyFee}</p>
              <p>退款金额（元）：{value.refundAmount}</p>
            </Card>
          </div>
        ))}
      </div>
      <div style={{paddingTop:20,paddingBottom:20,}}>
        <SearchInput {...searchInputProps}/>
      </div>
      <Tabs
      className='ant_tabs_anzhu'
      activeKey={tabActiveKey}
      onChange={(value)=>dispatch({
        type:'secondHouseRevenueManagement/changeTab',
        payload:value,
      })}
      type="card">
        <TabPane tab="二手房出售收入" key='shSellIncome'>
          <Table columns={shSellIncomeColumns} {...tableProps}/>
          {/*<span className='export-transaction-report'>导出二手房出售收入记录</span>*/}
        </TabPane>
        <TabPane tab="二手房出售支出" key='shSellExpend'>
          <Table columns={shSellExpendColumns} {...tableProps}/>
          {/*<span className='export-transaction-report'>导出二手房出售支出记录</span>*/}
        </TabPane>
        <TabPane tab="二手房出租收入" key='shRentIncome'>
          <Table columns={shRentIncomeColumns} {...tableProps}/>
          {/*<span className='export-transaction-report'>导出二手房出租收入记录</span>*/}
        </TabPane>
        <TabPane tab="二手房出租支出" key='shRentExpend'>
          <Table columns={shRentExpendColumns} {...tableProps}/>
          {/*<span className='export-transaction-report'>导出二手房出售支出</span>*/}
        </TabPane>
      </Tabs>
    </div>
  )
}

function mapStateToProps({secondHouseRevenueManagement}){
  return {secondHouseRevenueManagement}
}

export default connect(mapStateToProps)(SecondHouseRevenueManagement);
