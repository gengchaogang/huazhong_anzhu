import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { routerRedux } from 'dva/router'
import {Table,Timeline,Button} from 'antd';
import DxPanel from '../../../../commons/components/DxPanel';
import textPic from '../../../assets/yay.jpg'
function PropertyDetention({dispatch}) {
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
  ];
	const goBack=()=>{
    dispatch(routerRedux.goBack());
  }
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
			<div className='buttonsDirection'>
				<Button type="primary">立即支付</Button>
				<Button type='ghost'onClick={goBack}>返回</Button>
			</div>
		</div>
	);
}

PropertyDetention.propTypes = {
}
function mapStateToProps({propertyDetention}) {
	return { propertyDetention };
}

export default connect(mapStateToProps)(PropertyDetention)
