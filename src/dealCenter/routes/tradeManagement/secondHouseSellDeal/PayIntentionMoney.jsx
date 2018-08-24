import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { routerRedux } from 'dva/router'
import {Table,Timeline,Form,Row,Col,Input,Button} from 'antd';
import DxPanel from '../../../../commons/components/DxPanel';
import textPic from '../../../assets/yay.jpg'
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
function PayIntentionMoney({dispatch,
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
      timeStamp:'2010-10-24 19:00',
      content:'由    林八千 挂牌房源[合作成交]',
    },
		{
      timeStamp:'2010-10-24 19:00',
      content:'由   黄林枫  报成交。',
    }
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
			<Form horizontal>
				<DxPanel title='支付意向金'>
					<Row>
            <Col sm={24} md={12}>
              <FormItem label='意向成交单价：' {...formItemLayout}>
                {getFieldDecorator('意向成交单价：', {
                  rules: [{ required: true, message: '请在此输入协商成交单价' }],
                })(
                  <Input placeholder="请在此输入协商成交单价"  addonAfter={<i className="font-normal">元/㎡</i>}/>
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
							<FormItem label='意向成交总价：' {...formItemLayout}>
                {getFieldDecorator('意向成交总价：', {
                  rules: [{ required: true, message: '请在此输入协商成交总价' }],
                })(
                  <Input placeholder="请在此输入协商成交总价" addonAfter={<i className="font-normal">万</i>}/>
                )}
              </FormItem>
            </Col>
          </Row>
					<Row>
						<Col sm={24} md={12}>
							<FormItem label='请输入意向定金金额' {...formItemLayout}>
                {getFieldDecorator('请输入意向定金金额', {
                  rules: [{ required: true, message: '请在此输入客户缴纳意向金金额' }],
                })(
                  <Input placeholder="请在此输入客户缴纳意向金金额" addonAfter={<i className="font-normal">元</i>}/>
                )}
              </FormItem>
            </Col>
					</Row>
				</DxPanel>
				<FormItem>
					<div className='buttonsDirection'>
						<Button type="primary">生成意向金订单</Button>
						<Button type='ghost'onClick={goBack}>返回</Button>
					</div>
				</FormItem>
			</Form>
		</div>
	);
}

PayIntentionMoney.propTypes = {
}
function mapStateToProps({payIntentionMoney}) {
	return { payIntentionMoney };
}

export default connect(mapStateToProps)(Form.create()(PayIntentionMoney))
