import React from 'react'
import {connect} from 'dva'
import moment from 'moment';
import { DatePicker,Tabs,Table,Select,Modal,Button ,Card} from 'antd';
import SearchInput from '../../../commons/View/SearchInput'
import './NewHouseRevenueManagement.css'
import PromptModal from '../../../commons/View/PromptModal';
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../commons/utils/commonUtil.js';
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow';
const TabPane = Tabs.TabPane;

const Option = Select.Option;

/*****************************************************/
/*****************************************************/
/**********  财务管理：新房交易收支管理 *****************/
/*****************************************************/
/*****************************************************/


const newHousePurchaseIncome = [{
  title: '序号',
  dataIndex: 'number',
  key: 'number',
},{
  title: '电商项目',
  dataIndex: 'electricitySuppliersProject',
  key: 'electricitySuppliersProject',
},{
  title: '电商优惠',
  dataIndex: 'electricitySuppliersPreferential',
  key: 'electricitySuppliersPreferential',
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
  title: '支付时间',
  dataIndex: 'paymentTime',
  key: 'paymentTime',
}, {
  title: '支付金额',
  dataIndex: 'paymentAmount',
  key: 'paymentAmount',
}, {
  title: '状态',
  dataIndex: 'state',
  key: 'state',
}];
const newHousePurchaseIncomeData=[];
for (let i = 0; i < 50; i++) {
  newHousePurchaseIncomeData.push({
    key: '1'+i,
    number: 1,
    electricitySuppliersProject:"远洋山水",
    electricitySuppliersPreferential:"5万抵10万",
    orderNumber:"332005469041",
    paymentTransaction:"65535",
    paymentMethod:"POS机支付/工商银行",
    payingCustomers:"15120050558",
    paymentTime:"2015-10-24 19:00",
    paymentAmount:"50000元",
    state:"支付成功",
  });
}

const newHomePurchaseExpenses=[
  {
    title: '序号',
    dataIndex: 'number',
    key: 'number',
  },
  {
    title: '电商项目',
    dataIndex: 'electricitySuppliersProject',
    key: 'electricitySuppliersProject',
  },
  {
    title: '支出类型',
    dataIndex: 'expenditureType',
    key: 'expenditureType',
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
    title: '申请时间',
    dataIndex: 'applicationTime',
    key: 'applicationTime',
  },
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
    title: '支出时间',
    dataIndex: 'spendingTime',
    key: 'spendingTime',
  },
];
const newHomePurchaseExpensesData=[];
for (let i = 0; i < 50; i++) {
  newHomePurchaseExpensesData.push({
    key: '1'+i,
    number: i,
    electricitySuppliersProject:"远洋山水",
    expenditureType:"申请退款",
    orderNumber:"332005469041",
    paymentTransaction:"65535",
    paymentMethod:"中国支付第三方代付",
    applicationTime:"2015-10-24 19:00",
    paymentAmount:"50000元",
    state:"已退款",
    spendingTime:"2015-10-24 19:00"
  });
}
function NewHouseRevenueManagement({dispatch,newHouseRevenueManagement}){
  const {
    promptObj,
    tabActiveKey,
    historyRecordData,
    activeTableData,
    keyword,
    total,
    pageNo,
  }=newHouseRevenueManagement;
  const newHouseAddData=JSON.parse(historyRecordData);
  const searchFunction=(value)=>{
    dispatch({
      type:'newHouseRevenueManagement/getUpdateData',
      payload:{keyword:value,pageNo:1}
    })
  }
  const clearFuc=()=>{
    dispatch({
      type:'newHouseRevenueManagement/getUpdateData',
      payload:{keyword:''}
    })
  }
  //表格上方tag切换回调
  const tableTagOnChange=(key)=>{
    dispatch({
      type:'newHouseRevenueManagement/updateTabsActiveKey',
      payload:key,
    });
  }
  const placeholdershow=(key)=>{
		// console.log(key,'keykey');
		let _key='';
		if(key=='income'){
			_key='请在此输入筛选关键字进行搜索，支持电商项目，订单流水号，支付流水号，支付客户'
			return _key
		}else{
			_key='请在此输入筛选关键字进行搜索，支持电商项目，订单流水号，支付流水号'
			return _key
		}
	}
  const pagination={
    total:total,
    current:pageNo,
    onChange:(newPage)=>dispatch({
      type:'newHouseRevenueManagement/getUpdateData',
      payload:{pageNo:newPage,keyword:keyword},
    }),
    showQuickJumper:true,
  }
  return (
    <div className='newHouseRevenueManagement'>
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'newHouseRevenueManagement/closePrompt'})} onCancel={()=>dispatch({type:'accountManagement/closePrompt'})}/>
      <div className="newHouseAdd">
        {newHouseAddData.map((value,index)=>(
          <div key={index} className="cardnewHouseAdd">
            <Card title={value.title}>
              <p>新房电商优惠（个）：{value.newHomeElectricitySuppliersDiscount}</p>
              <p>电商优惠金额（元）：{value.electricitySuppliersDiscountAmount}</p>
              <p>成交套数（套）：{value.transactionNumber}</p>
              <p>电商退款（笔）：{value.electronicBusinessRefund}</p>
              <p>退款金额（元）：{value.refundAmount}</p>
            </Card>
          </div>
        ))}
      </div>
      <div className='newHouseRevenueManagement_search' style={{paddingTop:20}}>
        <SearchInput
          placeholder={placeholdershow(tabActiveKey)}
          searchFuc={searchFunction}
          clearFuc={clearFuc}
          type="button"
        />
      </div>
      <div style={{paddingTop:20}}>
        <Tabs onChange={tableTagOnChange} className='ant_tabs_anzhu' type='card' activeKey={tabActiveKey}>
          <TabPane tab="新房团购收入" key='income'>
            <Table dataSource={activeTableData} columns={newHousePurchaseIncome} pagination={pagination}/>
            {/*<span className='export-transaction-report'>导出新房团购收入记录</span>*/}
          </TabPane>
          <TabPane tab="新房团购支出" key='expenditure'>
            <Table dataSource={activeTableData} columns={newHomePurchaseExpenses} pagination={pagination}/>
            {/*<span className='export-transaction-report'>导出新房团购支出记录</span>*/}
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

function mapStateToProps({newHouseRevenueManagement}){
  return {newHouseRevenueManagement}
}

export default connect(mapStateToProps)(NewHouseRevenueManagement);
