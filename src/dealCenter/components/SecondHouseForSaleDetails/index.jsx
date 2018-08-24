import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import {Button, Tabs, Input,Table,Timeline} from 'antd';
import { Link } from 'dva/router'
import { routerRedux } from 'dva/router'
import DxPanel from '../../../commons/components/DxPanel';
import textPic from '../../assets/yay.jpg'
import './index.css'
function SecondHouseForSaleDetails({dispatch,
  reportedBrokers,
	reportedTransactionCustomers,
	customerBroker,
	proportionCommissions,
	intentionHouse,
	listingInformation,
	houseSourceReportedTransactionRecords,
	reasonsRefusal,

  hasBeenPaidIntentionMoney,
  intentContractAgreement,
  downPaymentPaid,
  downPaymentAgreementContract,
  commissionsPaid,
  interimAgreementCommissionAgreement,
  housingLoanInformation,
  houseTransferInformation,
  transactionFundsReleaseAccount,
  setTransactionSubCommissioned,
  houseTransactionInformation,
  }) {
  const goBack=()=>{
    dispatch(routerRedux.goBack());
  }
  const routePush=(path)=>{
    if(path && path.length!==0){
      dispatch(routerRedux.push({
        pathname: `/dealManagement/secondHouseSellDeal/${path}`,
      }));
    }
  }
  const houseRecord=[
    {
      timeStamp:'2010-10-24 19:00',
      content:'由 林八千 挂牌出售',
    },
    {
      timeStamp:'2010-10-24 19:00',
      content:'由 林八千  驳回报成交',
    }
  ];
  const intentionHousing=[
		{
			title: '房源编号',
      dataIndex: 'listingNumber',
      key: 'listingNumber',
		},
		{
			title: '所属小区',
      dataIndex: 'belongDistrict',
      key: 'belongDistrict',
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
			title: '房源面积',
      dataIndex: 'listingArea',
      key: 'listingArea',
		},
		{
			title: '房源单价',
      dataIndex: 'listingPrice',
      key: 'listingPrice',
		},
		{
			title: '房源总价',
      dataIndex: 'totalListings',
      key: 'totalListings',
		},
		{
			title: '支持贷款',
      dataIndex: 'supportLoan',
      key: 'supportLoan',
		},
		{
			title: '操作',
      key: 'operation',
			render:text=><div className='newhousedeal-operation' onClick={()=>routePush('secondHouseSalelistingDetails')}>房源详情</div>
		},
	]
	const intentionHousingData=[
		{
			key:1,
			listingNumber:332005469041,
			belongDistrict:'远洋山水',
			propertyType:'住宅',
			listingInformation:'A区域/1号楼/1单元/7层/7002室',
			listingArea:'100㎡',
			listingPrice:'1000元/㎡',
			totalListings:'200万/套',
			supportLoan:'支持',
		}
	]
  const hasBeenPaidIntentionMoneyTable=[
    {
      title: '订单编号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: '支付流水号',
      dataIndex: 'paySerialNumber',
      key: 'paySerialNumber',
    },
    {
      title: '支付时间',
      dataIndex: 'paymentTime',
      key: 'paymentTime',
    },
    {
      title: '支付客户',
      dataIndex: 'payingCustomers',
      key: 'payingCustomers',
    },
    {
      title: '支付手机号',
      dataIndex: 'payPhoneNumber',
      key: 'payPhoneNumber',
    },
    {
      title: '意向单价',
      dataIndex: 'intentionUnitPrice',
      key: 'intentionUnitPrice',
    },
    {
      title: '意向总价',
      dataIndex: 'intentionTotalPrice',
      key: 'intentionTotalPrice',
    },
    {
      title: '支付意向金',
      dataIndex: 'paymentIntentionMoney',
      key: 'paymentIntentionMoney',
    },
    {
      title: '支付状态',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
    },
  ]
  const hasBeenPaidIntentionMoneyTableData=[
    {
      key:1,
      orderNumber:'332005469041',
      paymentMethod:'POS机支付/工商银行',
      paySerialNumber:'65535',
      paymentTime:'2016-10-24 19:00',
      payingCustomers:'张三',
      payPhoneNumber:'15120050558',
      intentionUnitPrice:'10000元/㎡',
      intentionTotalPrice:'200万',
      paymentIntentionMoney:'10000元',
      paymentStatus:'已抵扣首付',
    }
  ]
  const downPaymentPaidTable=[
    {
      title: '订单编号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: '支付流水号',
      dataIndex: 'paySerialNumber',
      key: 'paySerialNumber',
    },
    {
      title: '支付时间',
      dataIndex: 'paymentTime',
      key: 'paymentTime',
    },
    {
      title: '成交总价',
      dataIndex: 'totalTransactionPrice',
      key: 'totalTransactionPrice',
    },
    {
      title: '支付客户',
      dataIndex: 'payingCustomers',
      key: 'payingCustomers',
    },
    {
      title: '支付手机号',
      dataIndex: 'payPhoneNumber',
      key: 'payPhoneNumber',
    },
    {
      title: '首付款比例',
      dataIndex: 'downPaymentRatio',
      key: 'downPaymentRatio',
    },
    // {
    //   title: '意向金抵扣',
    //   dataIndex: 'intentGoldDeduction',
    //   key: 'intentGoldDeduction',
    // },
    {
      title: '支付金额',
      dataIndex: 'amountPaid',
      key: 'amountPaid',
    },
    {
      title: '支付状态',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
    },
  ]
  const downPaymentPaidTableData=[
    {
      key:1,
      orderNumber:'332005469041',
      paymentMethod:'POS机支付/工商银行',
      paySerialNumber:'65535',
      paymentTime:'2016-10-24 19:00',
      totalTransactionPrice:'250万元',
      payingCustomers:'250万元',
      payPhoneNumber:'1120050558',
      downPaymentRatio:'1%',
      intentGoldDeduction:'10000元',
      amountPaid:'10000元',
      paymentStatus:'已支付',
    }
  ]
  const commissionsPaidTable=[
    {
      title: '订单编号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
    },
    {
      title: '支付流水号',
      dataIndex: 'paySerialNumber',
      key: 'paySerialNumber',
    },
    {
      title: '实际成交单价',
      dataIndex: 'actualTransactionPrice',
      key: 'actualTransactionPrice',
    },
    {
      title: '实际成交总价',
      dataIndex: 'actualTransactionTotalPrice',
      key: 'actualTransactionTotalPrice',
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: '承担方',
      dataIndex: 'bearParty',
      key: 'bearParty',
    },
    {
      title: '佣金比例',
      dataIndex: 'commissionRate',
      key: 'commissionRate',
    },
    {
      title: '交易服务费',
      dataIndex: 'transactionServiceFee',
      key: 'transactionServiceFee',
    },
    {
      title: '支付金额',
      dataIndex: 'amountPaid',
      key: 'amountPaid',
    },
    {
      title: '支付时间',
      dataIndex: 'paymentTime',
      key: 'paymentTime',
    },
    {
      title: '支付状态',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
    },
  ]
  const commissionsPaidTableData=[
    {
      key:1,
      orderNumber:'332205469041',
      paySerialNumber:'65535',
      actualTransactionPrice:'20000元/㎡',
      actualTransactionTotalPrice:'200万',
      paymentMethod:'POS机支付/工商银行',
      bearParty:'买方承担',
      commissionRate:'1%',
      transactionServiceFee:'1%',
      amountPaid:'10000元',
      paymentTime:'2017-10-24 19:00',
      paymentStatus:'成功',
    }
  ]
	return (
		<div>
      {!!reportedBrokers && <DxPanel title='报成交经纪人'>
        <div>
          <div className='agent' style={{backgroundImage:`URL(${textPic})`}}></div>
          <div className='agentword'>
            <div>姓名：黄林枫</div>
            <div>性别：男</div>
            <div>电话：15120050558</div>
          </div>
        </div>
      </DxPanel>}
      {!!reportedTransactionCustomers && <DxPanel title='报成交经客户'>
        <div>姓名：黄林枫</div>
        <div>性别：男</div>
        <div>电话：15120050558</div>
      </DxPanel>}
      {!!customerBroker && <DxPanel title='客户所属经纪人'>
        <div>
          <div className='agent' style={{backgroundImage:`URL(${textPic})`}}></div>
          <div className='agentword'>
            <div>姓名：黄林枫</div>
            <div>性别：男</div>
            <div>电话：15120050558</div>
          </div>
        </div>
      </DxPanel>}
      {!!proportionCommissions && <DxPanel title='合作成交佣金分配比例'>
        <div>买方经纪人：20%</div>
        <div>卖方经纪人：80%</div>
      </DxPanel>}
      {!!intentionHouse && <DxPanel title='意向房源'>
        <Table dataSource={intentionHousingData} columns={intentionHousing}/>
      </DxPanel>}
      {!!listingInformation && <DxPanel title='房源委托信息'>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
      </DxPanel>}
      {!!houseSourceReportedTransactionRecords && <DxPanel title='房源报成交记录'>
        <Timeline>
          {houseRecord.map((item,key)=><Timeline.Item key={`timeLine${key}`}>
          <span className='houseRecord-timeStamp'>{item.timeStamp}</span>
          <span className='houseRecord-content'>{item.content}</span>
          </Timeline.Item>)}
        </Timeline>
      </DxPanel>}
      {!!reasonsRefusal && <DxPanel title='驳回理由'>
        <div>证件不全，核验不通过</div>
      </DxPanel>}
      {!!hasBeenPaidIntentionMoney &&<DxPanel title='已支付意向金'>
        <Table dataSource={hasBeenPaidIntentionMoneyTableData} columns={hasBeenPaidIntentionMoneyTable}/>
      </DxPanel>}
      {!!intentContractAgreement &&<DxPanel title='意向合同/协议'>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
      </DxPanel>}
      {!!downPaymentPaid &&<DxPanel title='已支付首付款'>
        <Table dataSource={downPaymentPaidTableData} columns={downPaymentPaidTable}/>
      </DxPanel>}
      {!!downPaymentAgreementContract &&<DxPanel title='首付款协议/合同'>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
      </DxPanel>}
      {!!commissionsPaid &&<DxPanel title='已支付佣金'>
        <div>已支付佣金</div>
        <Table dataSource={commissionsPaidTableData} columns={commissionsPaidTable}/>
      </DxPanel>}
      {!!interimAgreementCommissionAgreement &&<DxPanel title='买卖居间协议/佣金协议'>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
      </DxPanel>}
      {!!housingLoanInformation &&<DxPanel title='房源贷款信息'>
        <div>2015-10-24 19:00  由黄林枫  申请贷款  等待张三办理贷款</div>
        <div>2015-10-24 19:00  由张三办理受理 办理贷款</div>
        <div>2015-10-24 19:00  由张三 完成贷款流程并批款。</div>
        <div>
          <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
          <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
          <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        </div>
      </DxPanel>}
      {!!houseTransferInformation &&<DxPanel title='房屋过户信息'>
        <div>2015-10-24 19:00  由黄林枫  申请贷款  等待李四办理过户 <span className='informationColor'>申请备注：客户着急过户，得抓紧时间处理</span></div>
        <div>2015-10-24 19:00  由张三办理受理 办理过户</div>
        <div>2015-10-24 19:00  由张三 完成过户流程。</div>
        <div>
          <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
          <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
          <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        </div>
      </DxPanel>}
      {!!transactionFundsReleaseAccount &&<DxPanel title='成交资金释放账户'>
        <div>业主姓名：黄林枫</div>
        <div>开户银行：中国工商银行</div>
        <div>开户支行：海淀区硅谷支行</div>
        <div>开户银行卡号：6223321312312312321231</div>
        <div>业主联系电话：15120050558</div>
        <div>释放金额：65535元 释放类型：首付款/意向金</div>
        <div>
          <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
          <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        </div>
      </DxPanel>}
      {!!setTransactionSubCommissioned &&<DxPanel title='成交分佣设置'>
        <div>成交佣金总额：20000元</div>
        <div>平台抽佣：10%</div>
        <div>佣金总额：20000元 平台抽佣：10% 交易服务费：1000元 剩余佣金总额：18000元</div>
        <div>成交方式：合作成交    房源经纪人：20%  18000元  客户经纪人：80%  20000元</div>
      </DxPanel>}
      {!!houseTransactionInformation &&<DxPanel title='房屋成交信息'>
        <div>2015-10-24 19:00  由黄林枫  申请成交  等待李四审核成交</div>
        <div className='informationColor'>申请备注：客户着急过户，得抓紧时间处理</div>
        <div>
          <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
          <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
          <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        </div>
        <div>2017-10-24  19：00 由张三申请成交 等待李四审核。</div>
        <div>2017-10-25  20：00 由李四审核通过，等待财务 李白审核并执行分佣。</div>
        <div>2017-10-26  21：00 由财务 李白审核通过，佣金将在1~2个工作日由第三方代发机构执行分佣。</div>
        <div>2017-10-27  22：00 由第三方代付机构执行分佣。</div>
        <div>佣金分配明细</div>
        <div>佣金总额：20000元  平台抽佣：10%  剩余佣金总额：18000元</div>
        <div>成交方式：合作成交  房源经纪人：20% 18000元  客户经纪人：80% 20000元</div>
        <div>房源经纪人：林枫 佣金比例：40%   银行账号：6222********066[农业银行]</div>
        <div>客源经纪人：李白 佣金比例：60%   银行账号：62202*******066[招商银行]</div>
        <div>资金释放明细</div>
        <div>释放类型：意向金/首付款</div>
        <div>释放金额：65535元</div>
        <div>业主姓名：黄林枫</div>
        <div>开户银行：中国支付硅谷支行</div>
        <div>开户银行卡户：622232323123213123123</div>
        <div>联系电话：15120050058</div>
        <div>释放状态：已释放</div>
      </DxPanel>}
      <div className='buttonsDirection'>
        <Button type='ghost' onClick={goBack}>返回</Button>
      </div>
		</div>
	);
}
SecondHouseForSaleDetails.propTypes = {
}
function mapStateToProps({secondHouseForSaleDetails}) {
	return { secondHouseForSaleDetails };
}
export default connect(mapStateToProps)(SecondHouseForSaleDetails)
