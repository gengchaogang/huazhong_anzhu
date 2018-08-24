import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import {Button,Col,Tabs, Input, Row,Table,Timeline,Checkbox,Form,InputNumber} from 'antd';
import { Link } from 'dva/router'
import { routerRedux } from 'dva/router'
import DxPanel from '../../../../commons/components/DxPanel';
import textPic from '../../../assets/yay.jpg'
import './PaymentCommission.css'
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
function PaymentCommission ({dispatch,paymentCommission,
  form:{
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }
  }) {
  const goBack=()=>{
    dispatch(routerRedux.goBack());
  }
  const doSubmit=()=>{
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = { ...getFieldsValue()};
      console.log(data,'data');
    });
  }
  const routePush=(path)=>{
    if(path && path.length!==0){
      dispatch(routerRedux.push({
        pathname: `/dealManagement/houseLeaseDeal/${path}`,
      }));
    }
  }
  const handleSubmit=(e)=>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  const applicationLeaseTable=[
    {
      title: '房源编号',
      dataIndex: 'inventoryNumber',
      key: 'inventoryNumber',
    },
    {
      title: '所属小区',
      dataIndex: 'residentialArea',
      key: 'residentialArea',
    },
    {
      title: '物业类型',
      dataIndex: 'propertyType',
      key: 'propertyType',
    },
    {
      title: '房源信息',
      dataIndex: 'houseInformation',
      key: 'houseInformation',
    },
    {
      title: '房源面积',
      dataIndex: 'houseArea',
      key: 'houseArea',
    },
    {
      title: '租金/押金',
      dataIndex: 'rentDeposit',
      key: 'rentDeposit',
    },
    {
      title: '租期',
      dataIndex: 'leaseTerm',
      key: 'leaseTerm',
    },
    {
      title: '房租',
      dataIndex: 'rent',
      key: 'rent',
    },
    {
      title: '出租方式',
      dataIndex: 'rentalMode',
      key: 'rentalMode',
    },
    {
      title: '操作',
      dataIndex:'operation',
      key: 'operation',
      render:text=><div className='newhousedeal-operation' onClick={()=>routePush('listingDetails')}>房源详情</div>
    },
  ]
  const applicationLeaseTableData=[
    {
      inventoryNumber:'332005469041',
      residentialArea:'远洋山水',
      propertyType:'住宅',
      houseInformation:'A区域/1号楼/1单元/7层/7002室',
      houseArea:'100㎡',
      rentDeposit:'押1付3',
      leaseTerm:'1年',
      rent:'85000元/月',
      rentalMode:'整租',
    }
  ]
  const houseRecord=[
    {
      timeStamp:'2010-10-24 19:00',
      content:'由 林八千 挂牌出租',
    },{
      timeStamp:'2010-10-24 19:00',
      content:'由 林八千  报出租',
    },{
      timeStamp:'2010-10-24 19:00',
      content:'由 林峰  驳回申请',
    }
  ];
  const rentalCommissionsPaidTable=[
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
      title: '支付方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },

    {
      title: '意向租金',
      dataIndex: 'intentRent',
      key: 'intentRent',
    },
    {
      title: '支付用户',
      dataIndex: 'payUser',
      key: 'payUser',
    },
    {
      title: '支付时间',
      dataIndex: 'paymentTime',
      key: 'paymentTime',
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
  const rentalCommissionsPaidTableData=[
    {
      orderNumber:'332005469041',
      paySerialNumber:'65535',
      paymentMethod:'POS机支付/工商银行',
      intentRent:'6000元/月',
      payUser:'15120050558',
      paymentTime:'2016-10-24 19:00',
      paymentIntentionMoney:'5500元',
      paymentStatus:'已支付',
    }
  ]
	return (
		<div>
      <DxPanel title='报出租经纪人'>
        <div className='agent' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='agentword'>
          <div>姓名：黄林枫</div>
          <div>性别：男</div>
          <div>电话：15120050558</div>
        </div>
      </DxPanel>
      <DxPanel title='租户'>
        <div>姓名：黄林枫</div>
        <div>电话：15120050558</div>
      </DxPanel>
      <DxPanel title='租户所属经纪人'>
        <div className='agent' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='agentword'>
          <div>姓名：黄林枫</div>
          <div>性别：男</div>
          <div>电话：15120050558</div>
        </div>
      </DxPanel>
      <DxPanel title='合作成交佣金分佣比例'>
        <div>佣金协调时间：2015-10-24 19：00</div>
        <div>出租经纪人：20%</div>
        <div>租户经纪人：80%</div>
      </DxPanel>
      <DxPanel title='出租房源'>
        <Table dataSource={applicationLeaseTableData} columns={applicationLeaseTable}/>
      </DxPanel>
      <DxPanel title='房源委托信息'>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
      </DxPanel>
      <DxPanel title='房源出租记录'>
        <Timeline>
          {houseRecord.map((item,key)=><Timeline.Item key={`timeLine${key}`}>
          <span className='houseRecord-timeStamp'>{item.timeStamp}</span>
          <span className='houseRecord-content'>{item.content}</span>
          </Timeline.Item>)}
        </Timeline>
      </DxPanel>
      <DxPanel title='出租意向金'>
        <Table dataSource={rentalCommissionsPaidTableData} columns={rentalCommissionsPaidTable}/>
      </DxPanel>
      <DxPanel title='租房意向金收据'>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
      </DxPanel>
      <DxPanel title='支出租房佣金'>
        <Form  onSubmit={handleSubmit}>
          <Row>
            <Col sm={24} md={12}>
              <FormItem label='请输入租金' {...formItemLayout}>
                {getFieldDecorator('请输入租金', {
                  rules: [{ required: true, message: '请输入租金' }],
                })(
                  <InputNumber placeholder="请输入租金" />
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <FormItem label='请输入比例' {...formItemLayout}>
                {getFieldDecorator('请输入比例', {
                  rules: [{ required: true, message: '请输入比例' }],
                })(
                  <InputNumber placeholder="请输入比例" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={12}>
              <FormItem label='所需支付租房佣金' {...formItemLayout}>
                <InputNumber placeholder="自动计算" disabled/>
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <FormItem label=' ' {...formItemLayout}>
                <div><Checkbox>已支付意向金5500元，是否抵扣中介佣金？</Checkbox></div>
                <div>还需支付佣金：500元</div>
              </FormItem>
            </Col>
          </Row>
          <FormItem>
            <div className='buttonsDirection'>
              <Button type="primary" onClick={doSubmit}>立即支付</Button>
              <Button type='ghost'onClick={goBack}>返回</Button>
            </div>
          </FormItem>
        </Form>
      </DxPanel>
		</div>
	);
}

function mapStateToProps({paymentCommission}) {
	return {paymentCommission};
}
export default connect(mapStateToProps)(Form.create()(PaymentCommission))
