import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import {Button, Tabs, Input, Row,Table,Popover,Timeline} from 'antd';
import { Link } from 'dva/router'
import { routerRedux } from 'dva/router'
import SearchInput from '../../../../commons/View/SearchInput'
import DxPanel from '../../../../commons/components/DxPanel';
import textPic from '../../../assets/yay.jpg'

function SupplementalAgreement({dispatch}) {
  const goBack=()=>{
    dispatch(routerRedux.goBack());
  }
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
    },{
      timeStamp:'2010-10-24 19:00',
      content:'由 林八千  报出租',
    },{
      timeStamp:'2010-10-24 19:00',
      content:'由 林峰  驳回申请',
    }
  ];
  const paymentIntentionMoney=[
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
  const paymentIntentionMoneyData=[];
  for (let i = 0; i < 2; i++) {
    paymentIntentionMoneyData.push({
      key:i,
      orderNumber:'332005469041',
      paySerialNumber:'65535',
      paymentMethod:'POS机支付/工商银行',
      intentRent:'1000元/月',
      payUser:'15120050558',
      paymentTime:'2016-10-24 19:00',
      paymentIntentionMoney:'10000元',
      paymentStatus:'已支付',
    })
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
        <div>
          <div>姓名：黄林枫</div>
          <div>电话：15120050558</div>
        </div>
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
      <DxPanel title='支付意向金'>
        <Table dataSource={paymentIntentionMoneyData} columns={paymentIntentionMoney}/>
      </DxPanel>
      <DxPanel title='请上传出租意向金收据'>
        <div>注：最多可上传10张图/单张不超过2M</div>
      </DxPanel>
      <div className='buttonsDirection'>
        <Button type="primary">保存</Button>
        <Button type='ghost' onClick={goBack}>返回</Button>
      </div>
    </div>
	);
}
SupplementalAgreement.propTypes = {
}
function mapStateToProps({supplementalAgreement}) {
	return { supplementalAgreement };
}

export default connect(mapStateToProps)(SupplementalAgreement)
