import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { routerRedux } from 'dva/router'
import {Table,Timeline,Form,Row,Col,Input,Button,Radio} from 'antd';
import DxPanel from '../../../../commons/components/DxPanel';
import textPic from '../../../assets/yay.jpg'
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const RadioGroup = Radio.Group;
function PayACommission({dispatch,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },
  }) {
  const routePush=(path)=>{
    if(path && path.length!==0){
      dispatch(routerRedux.push({
        pathname: `/dealManagement/secondHouseSellDeal/${path}`,
      }));
    }
  }
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
			render:text=><div className='newhousedeal-operation' onClick={()=>routePush('SecondHouseSalelistingDetails')}>房源详情</div>
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
	const houseRecord=[
    {
      timeStamp:'2010-10-24 19: 00',
      content:'由   林八千 挂牌房源[合作成交]',
    },
		{
      timeStamp:'2010-10-24 19:00',
      content:'由   黄林枫  报成交。',
    },
		{
      timeStamp:'2010-10-24 19:00',
      content:'由 林枫 办理二手房意向金业务。',
    },
  ];
	const goBack=()=>{
    dispatch(routerRedux.goBack());
  }
	const paymentIntentionMoneyTable=[
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
	const paymentIntentionMoneyTableData=[
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
			paymentStatus:'已支付',
		}
	]
  const DownPaymentHasBeenPaid=[
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
		// 	title: '意向金抵扣',
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
  const DownPaymentHasBeenPaidData=[
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
	return (
		<div>
      <DxPanel title='报成交经纪人'>
        <div>
          <div className='agent' style={{backgroundImage:`URL(${textPic})`}}></div>
          <div className='agentword'>
            <div>姓名：黄林枫</div>
            <div>性别：男</div>
            <div>电话：15120050558</div>
          </div>
        </div>
      </DxPanel>
      <DxPanel title='报成交客户'>
        <div>姓名：黄林枫</div>
        <div>性别：男</div>
        <div>电话：15120050558</div>
      </DxPanel>
      <DxPanel title='客户所属经纪人'>
        <div>
          <div className='agent' style={{backgroundImage:`URL(${textPic})`}}></div>
          <div className='agentword'>
            <div>姓名：黄林枫</div>
            <div>性别：男</div>
            <div>电话：15120050558</div>
          </div>
        </div>
      </DxPanel>
			<DxPanel title='合作成交佣金分配比例'>
        <div>买方经纪人：20%</div>
        <div>卖方经纪人：80%</div>
      </DxPanel>
      <DxPanel title='意向房源'>
        <Table dataSource={intentionHousingData} columns={intentionHousing}/>
      </DxPanel>
			<DxPanel title='房源委托信息'>
				<div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
			</DxPanel>
      <DxPanel title='房源报成交记录'>
				<Timeline>
          {houseRecord.map((item,key)=><Timeline.Item key={`timeLine${key}`}>
          <span className='houseRecord-timeStamp'>{item.timeStamp}</span>
          <span className='houseRecord-content'>{item.content}</span>
          </Timeline.Item>)}
        </Timeline>
			</DxPanel>
      <DxPanel title='已支付意向金'>
				<Table dataSource={paymentIntentionMoneyTableData} columns={paymentIntentionMoneyTable}/>
			</DxPanel>
			<DxPanel title='意向合同/协议'>
				<div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
			</DxPanel>
      <DxPanel title='已支付首付款'>
        <Table dataSource={DownPaymentHasBeenPaidData} columns={DownPaymentHasBeenPaid}/>
      </DxPanel>
      <DxPanel title='首付款合同/收据'>
				<div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
			</DxPanel>
      <Form>
        <DxPanel title='佣金支付'>
          <Row>
            <Col sm={24} md={12}>
              <FormItem {...formItemLayout}>
                <RadioGroup>
                  <Radio value={'买方承担'}>买方承担</Radio>
                  <Radio value={'卖方承担'}>卖方承担</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
							<FormItem label='实际成交单价' {...formItemLayout}>
                {getFieldDecorator('实际成交单价', {
                  rules: [{ required: true, message: '请在此输入佣金比例' }],
                })(
                  <Input placeholder="请在此输入佣金比例" addonAfter={<i className="font-normal">元/㎡</i>}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={12}>
              <FormItem label='实际成交总价' {...formItemLayout}>
                {getFieldDecorator('实际成交总价', {
                  rules: [{ required: true, message: '请在此输入佣金比例' }],
                })(
                  <Input placeholder="请在此输入佣金比例"  addonAfter={<i className="font-normal">万元</i>}/>
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
							<FormItem label='成交中介佣金比例' {...formItemLayout}>
                {getFieldDecorator('成交中介佣金比例', {
                  rules: [{ required: true, message: '请在此输入中介佣金占购房总价比例' }],
                })(
                  <Input placeholder="请在此输入中介佣金占购房总价比例" addonAfter={<i className="font-normal">%</i>}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={12}>
              <FormItem label='交易服务费' {...formItemLayout}>
                {getFieldDecorator('交易服务费', {
                  rules: [{ required: true, message: '若有交易服务费则输入' }],
                })(
                  <Input placeholder="若有交易服务费则输入"  addonAfter={<i className="font-normal">元</i>}/>
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
							<FormItem label='需支付中介佣金' {...formItemLayout}>
                {getFieldDecorator('需支付中介佣金', {
                  rules: [{ required: true, message: '总房价*佣金比例=所需支付金额' }],
                })(
                  <Input placeholder="总房价*佣金比例=所需支付金额" addonAfter={<i className="font-normal">元</i>}/>
                )}
              </FormItem>
            </Col>
          </Row>
        </DxPanel>
        <FormItem>
					<div className='buttonsDirection'>
						<Button type="primary">立即支付</Button>
						<Button type='ghost'onClick={goBack}>返回</Button>
					</div>
				</FormItem>
      </Form>
		</div>
	);
}

PayACommission.propTypes = {
}
function mapStateToProps({payACommission}) {
	return { payACommission };
}

export default connect(mapStateToProps)(Form.create()(PayACommission))
