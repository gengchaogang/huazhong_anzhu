import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import {Button, Timeline,Tabs,Form ,InputNumber,Table,Popover,Row,Col} from 'antd';
import { Link } from 'dva/router'
import { routerRedux } from 'dva/router'

import DxPanel from '../../../../commons/components/DxPanel';
import textPic from '../../../assets/yay.jpg'
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

function HandleIntention({dispatch,
  form:{
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },
  }) {
  const rentalListings=[
    {
      title: '房源编号',
      dataIndex: 'listingNumber',
      key: 'listingNumber',
    },
    {
      title: '所属小区',
      dataIndex: 'belongsDistrict',
      key: 'belongsDistrict',
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
      title: '租金/押金',
      dataIndex: 'rentDeposit',
      key: 'rentDeposit',
    },
    {
      title: '租期',
      dataIndex: 'term',
      key: 'term',
    },
    {
      title: '房租',
      dataIndex: 'rent',
      key: 'rent',
    },
    {
      title: '出租方式',
      dataIndex: 'rentalMethod',
      key: 'rentalMethod',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render:text=><div>房源详情</div>
    },
  ]
  const rentalListingsData=[
    {
      key:'1',
      listingNumber:'332005469041',
      belongsDistrict:'远洋山水',
      propertyType:'住宅',
      listingInformation:'A区域/1号楼/1单元/7层/7002室',
      listingArea:'100㎡',
      rentDeposit:'押1付3',
      term:'1年',
      rent:'85000元/月',
      rentalMethod:'整租',
    }
  ]
  const houseRecord=[
    {
      timeStamp:'2010-10-24 19:00',
      content:'由 林八千 挂牌出租',
    },
    {
      timeStamp:'2010-10-24 19:00',
      content:'由 林峰  驳回 报出租',
    }
  ];
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
	return (
		<div>
		  <DxPanel title='报出租经纪人'>
        <div>
          <div className='agent' style={{backgroundImage:`URL(${textPic})`}}></div>
          <div className='agentword'>
            <div>姓名：黄林枫</div>
            <div>性别：男</div>
            <div>电话：15120050558</div>
          </div>
        </div>
      </DxPanel>
      <DxPanel title='租户'>
        <div>姓名：黄林枫</div>
        <div>性别：男</div>
      </DxPanel>
      <DxPanel title='租户所属经纪人'>
        <div>
          <div className='agent' style={{backgroundImage:`URL(${textPic})`}}></div>
          <div className='agentword'>
            <div>姓名：黄林枫</div>
            <div>性别：男</div>
            <div>电话：15120050558</div>
          </div>
        </div>
      </DxPanel>
      <DxPanel title='合作成交佣金分佣比例'>
        <div>
          <div>佣金协调时间：2015-10-24 19：00</div>
          <div>出租经纪人：20%</div>
          <div>租户经纪人：80%</div>
        </div>
      </DxPanel>
      <DxPanel title='出租房源'>
        <Table dataSource={rentalListingsData} columns={rentalListings}/>
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
      <DxPanel title='支付出租意向金'>
        <Form>
          <Row>
            <Col sm={24} md={12}>
              <FormItem label='房屋意向租金' {...formItemLayout}>
                {getFieldDecorator('房屋意向租金', {
                  rules: [{ required: true, message: '请输入' }],
                })(
                  <InputNumber placeholder="房屋意向租金" />
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <FormItem label='请输入需支付的意向定金' {...formItemLayout}>
                {getFieldDecorator('请输入需支付的意向定金', {
                  rules: [{ required: true, message: '请输入' }],
                })(
                  <InputNumber placeholder="请输入需支付的意向定金" />
                )}
              </FormItem>
            </Col>
          </Row>
          <FormItem>
            <div className='buttonsDirection'>
              <Button type="primary" onClick={doSubmit}>支付租房意向金</Button>
              <Button type='ghost'onClick={goBack}>返回</Button>
            </div>
          </FormItem>
        </Form>
      </DxPanel>
		</div>
	);
}

HandleIntention.propTypes = {
}
function mapStateToProps({handleIntention}) {
	return { handleIntention };
}

export default connect(mapStateToProps)(Form.create()(HandleIntention))
