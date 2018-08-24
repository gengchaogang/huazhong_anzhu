import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import { Link } from 'dva/router'
import {Tabs,Button,Table,Checkbox,Row,Col,Input,InputNumber,Modal,Select,Form, Cascader} from 'antd';
import SearchInput from '../../../commons/View/SearchInput'
const confirm = Modal.confirm;
const Option = Select.Option;
import DxPanel from '../../../commons/components/DxPanel'
import './NewCreateMatchProject.css'
const commissionColumns=[
	{
		title:'佣金方案名称',
		dataIndex:'commissionName',
	},
	{
		title:'经纪人',
		dataIndex:'commissionAgent',
	},
	{
		title:'平台',
		dataIndex:'commissionPlatform',
	},
	{
		title:'省级代理',
		dataIndex:'commissionProvince',
	},
	{
		title:'市级代理',
		dataIndex:'commissionCity',
	},
	{
		title:'区县代理',
		dataIndex:'commissionCounty',
	},
	{
		title:'交易中心',
		dataIndex:'commissionTradingCenter',
	},
	{
		title:'师傅角色',
		dataIndex:'commissionMaster',
	},
]
const tradingServiceChargesColumns=[
	{
		title:'交易服务费名称',
		dataIndex:'tradingServiceChargesName',
	},
	{
		title:'平台',
		dataIndex:'tradingServiceChargesPlatform',
	},
	{
		title:'省级代理',
		dataIndex:'tradingServiceChargesProvince',
	},
	{
		title:'市级代理',
		dataIndex:'tradingServiceChargesCity',
	},
	{
		title:'区县代理',
		dataIndex:'tradingServiceChargesCounty',
	},
	{
		title:'交易中心',
		dataIndex:'tradingServiceChargesTradingCenter',
	},
]
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
function NewCreateMatchProject({dispatch,newCreateMatchProject,form}) {
	const {options,
		originalArray,
		commissionSchemeStatus,
		commissionDataSource,
		commissionName,
		commissionTotal,
		commissionKeyWord,
		commissionPage,
		commissionAgent,
		commissionCity,
		commissionCounty,
		commissionMaster,
		commissionPlatform,
		commissionProvince,
		commissionTradingCenter,
		showCommission,
		tradingServiceChargesStatus,//交易服务费模态框状态
		tradingServiceChargesDataSource,
		tradingServiceChargesName,
		tradingServiceChargesCity,
		tradingServiceChargesCounty,
		tradingServiceChargesPlatform,
		tradingServiceChargesProvince,
		tradingServiceChargesTradingCenter,
		tradingServiceChargesTotal,
		tradingServiceChargesPage,
		tradingServiceChargesKeyWord,
		showTradingServiceCharges,
		areaCode,
		areaPath,
		tradingArr,
		tradingCenterName,
		tcId,
		CommissionRatioStatus,//创建佣金配比方案
		servicesRatioStatus,//创建交易服务费配比方案
	}=newCreateMatchProject;
	const showCommissionDatasource=[
		{
			key:'001',
			commissionName:commissionName,
			commissionAgent:commissionAgent,
			commissionCity:commissionCity,
			commissionCounty:commissionCounty,
			commissionMaster:commissionMaster,
			commissionPlatform:commissionPlatform,
			commissionProvince:commissionProvince,
			commissionTradingCenter:commissionTradingCenter,
		}
	]
	const showTradingServiceChargesDataSource=[
		{
			key:'001',
			tradingServiceChargesName:tradingServiceChargesName,
			tradingServiceChargesCity:tradingServiceChargesCity,
			tradingServiceChargesCounty:tradingServiceChargesCounty,
			tradingServiceChargesPlatform:tradingServiceChargesPlatform,
			tradingServiceChargesProvince:tradingServiceChargesProvince,
			tradingServiceChargesTradingCenter:tradingServiceChargesTradingCenter,
		}
	]

	const { getFieldDecorator, getFieldValue,setFields,resetFields} =form;
//动态加载交易中心名字
	const cascaderOnChange=(value,key)=>{
		if(value){
			dispatch({type:'newCreateMatchProject/cascaderGetAreaTrading',
				payload:{code:value[value.length-1]}
			})
		}
	}
	//获取佣金分配方案列表
	const yongjinClick=()=>{
		dispatch({
			type:'newCreateMatchProject/commissionChose'
		})
	}
	//查询分配佣金方案名称
	const searchInputProps={
    type:'button',
    placeholder:'请输入需要查找的佣金方案名称',
    searchFuc:(value)=>{
			dispatch({
				type:'newCreateMatchProject/searchFucCommission',
				payload:{name:value}
			})
		},
  }
	//选择分配佣金方案关闭
	const commissionSchemeCancel=()=>{
		dispatch({
			type:'newCreateMatchProject/setState',
			payload:{
				commissionSchemeStatus:false,
				commissionKeyWord:'',
				commissionPage:0,
			}
		})
	}
	//选择分配佣金方案确定
	const commissionSchemeOk=()=>{
		dispatch({
			type:'newCreateMatchProject/commissionSchemeOk',
			payload:{
				commissionSchemeStatus:false,
				showCommission:true,
			}
		})
	}
	//获取选择分配佣金方案列表的选项
	const rowSelection = {
		type:'radio',
	  onChange: (record, selected, selectedRows) => {
	    dispatch({
				type:'newCreateMatchProject/setState',
				payload:{
					commissionName:selected[0].commissionName,
					commissionAgent:selected[0].commissionAgent,
					commissionCity:selected[0].commissionCity,
					commissionCounty:selected[0].commissionCounty,
					commissionMaster:selected[0].commissionMaster,
					commissionPlatform:selected[0].commissionPlatform,
					commissionProvince:selected[0].commissionProvince,
					commissionTradingCenter:selected[0].commissionTradingCenter,
				}
			})
	  },
	};
	//创建
	const createProfit=()=>{
		dispatch({
			type:'newCreateMatchProject/createProfit',
			payload:{
				areaCode:areaCode,
				areaPath:areaPath,
				commissionName:commissionName,
				tradingCenterName:tradingCenterName,
				tcId:tcId,
				tradingServiceChargesName:tradingServiceChargesName,
			}
		})
	}
	const goback=()=>{
		dispatch({
			type:'setState',
			payload:{
				areaCode:'',
				areaPath:'',
				commissionName:'',
				tcId:'',
				tradingCenterName:'',
				tradingServiceChargesName:'',
				showTradingServiceChargesDataSource:[],
				showCommissionDatasource:[],
			}
		})
		dispatch(routerRedux.goBack());
	}
	//分配佣金配比分页
	const pagination={
		total:commissionTotal,
		showTotal:commissionTotal => `共 ${commissionTotal} 项`,
		current:commissionPage,
		onChange:(page)=>{
			dispatch({
				type:'newCreateMatchProject/pageOnchangeCommission',
				payload:{
					pageNo:page-1,
          name:commissionKeyWord,
				}
			})
		}
	};
	//交易服务费
	const jioayiClick=()=>{
		dispatch({type:'newCreateMatchProject/tradingServiceChose'})
	}
	//交易服务费方案搜索
	const searchtradingServiceCharges={
		type:'button',
    placeholder:'请输入需要查找的交易服务费方案名称',
    searchFuc:(value)=>{
			dispatch({
				type:'newCreateMatchProject/searchFucService',
				payload:{name:value}
			})
		},
	}
	const tradingServiceChargesSchemeOk=()=>{
		dispatch({
			type:'newCreateMatchProject/setState',
			payload:{
				tradingServiceChargesStatus:false,
				showTradingServiceCharges:true,
			}
		})
	}
	const tradingServiceChargesCancel=()=>{
		dispatch({
			type:'newCreateMatchProject/setState',
			payload:{
				tradingServiceChargesStatus:false,
				tradingServiceChargesKeyWord:'',
				tradingServiceChargesPage:0,
			}
		})
	}
	//获取选择交易服务费列表的选项
	const tradingServiceChargesRowSelection = {
		type:'radio',
	  onChange: (record, selected, selectedRows) => {
	    dispatch({
				type:'newCreateMatchProject/setState',
				payload:{
					tradingServiceChargesName:selected[0].tradingServiceChargesName,
					tradingServiceChargesCity:selected[0].tradingServiceChargesCity,
					tradingServiceChargesCounty:selected[0].tradingServiceChargesCounty,
					tradingServiceChargesPlatform:selected[0].tradingServiceChargesPlatform,
					tradingServiceChargesProvince:selected[0].tradingServiceChargesProvince,
					tradingServiceChargesTradingCenter:selected[0].tradingServiceChargesTradingCenter,
				}
			})
	  },
	};
	//交易服务费分页
	const tradingServiceChargesPagination={
		total:tradingServiceChargesTotal,
		showTotal:tradingServiceChargesTotal => `共 ${tradingServiceChargesTotal} 项`,
		current:tradingServiceChargesPage,
		onChange:(page)=>{
			dispatch({
				type:'newCreateMatchProject/pageOnchangeTradingServiceCharges',
				payload:{
					pageNo:page-1,
          name:tradingServiceChargesKeyWord,
				}
			})
		}
	}
	const selecOnChage=(value)=>{
		let tcId='';
		if(tradingArr){
			for(let i=0;i<tradingArr.length;i++){
				(tradingArr[i].name==value)?(tcId=tradingArr[i].id):'';
			}
		}
		dispatch({type:'newCreateMatchProject/setState',
			payload:{
				tradingCenterName:value,
				tcId:tcId,
			}
		})
	}
	//打开新建佣金的模态框
	const creatCommissionRatio=()=>{
		dispatch({
			type:'newCreateMatchProject/setState',
			payload:{CommissionRatioStatus:true}
		})
	}
	//确定创建佣金配比方案
	const creatCommissionModalOk=()=>{
		form.validateFields((err, values) => {
			console.log(values,'values');
      if (err) {
        return;
      }
			dispatch({type:'newCreateMatchProject/creatCommissionModalOk',
				payload:{
					name:values.commissionName,
					broker:values.commissionBroker,
					cityAgency:values.commissionCity,
					countyAgency:values.commissionCounty,
					master:values.commissionMaster,
					platform:values.commissionPlatform,
					provinceAgency:values.commissionProvince,
					tradingCenter:values.commissionTradingCenter,
				}
			})
			resetFields();
		})
	}
	const creatCommissionModalCancel=()=>{
		dispatch({type:'newCreateMatchProject/setState',
			payload:{CommissionRatioStatus:false}
		})
		resetFields();
	}
	//创建交易服务费配比方案
	const creatServices=()=>{
		dispatch({
			type:'newCreateMatchProject/setState',
			payload:{servicesRatioStatus:true,}
		})
	}
	const creatServicesModalOk=()=>{
		form.validateFields((err, values) => {
			console.log(values,'values');
      if (err) {
        return;
      }
			dispatch({type:'newCreateMatchProject/creatServicesModalOk',
				payload:{
					name:values.servicesName,
					cityAgency:values.servicesCity,
					countyAgency:values.servicesCounty,
					platform:values.servicesPlatform,
					provinceAgency:values.servicesProvince,
					tradingCenter:values.servicesTradingCenter,
				}
			})
			resetFields();
		})
	}
	const creatServicesModalCancel=()=>{
		dispatch({
			type:'newCreateMatchProject/setState',
			payload:{servicesRatioStatus:false}
		})
		form.resetFields();
	}
	return (
		<DxPanel title='新建佣金配比'>
			<div className='divCascader'>
				<span>城市区域</span>
				<Cascader className='cascaderTradingCenter' changeOnSelect={true}
					options={options}
					placeholder='请选择,若不选则默认全部'
					onChange={cascaderOnChange}
				/>
			</div>
			<div className='divCascader'>
				<span>交易中心</span>
				<Select className='selectTradingCenter'
				placeholder='请选择' onChange={selecOnChage}>
					<Option value=''>全部</Option>
					{!!tradingArr && tradingArr.map((item,index)=>(
					<Option key={index} value={item.name}>
						{item.name}
					</Option>))}
				</Select>
			</div>
			<div className='divCascader'>
				<p>佣金配比方案</p>
				<Button type='primary' onClick={yongjinClick}>选择方案</Button>
				<Button type='primary' onClick={creatCommissionRatio}>新建方案</Button>
			</div>
			<div>
				{(!!commissionName && !!showCommission) &&<Table
					columns={commissionColumns}
					pagination={false}
					dataSource={showCommissionDatasource}
				/>}
			</div>
			<div className='divCascader'>
				<p>交易服务费配比方案</p>
				<p className='grayWord'>交易服务费按实际缴纳金额计算</p>
				<Button type='primary' onClick={jioayiClick}>选择方案</Button>
				<Button type='primary' onClick={creatServices}>新建方案</Button>
			</div>
			{/*佣金分配方案模态框*/}
			<Modal title='佣金配比方案' visible={commissionSchemeStatus}
        onOk={commissionSchemeOk} onCancel={commissionSchemeCancel}
      >
				<SearchInput {...searchInputProps}/>
				<Table columns={commissionColumns}
					dataSource={commissionDataSource}
					rowClassName={()=>'rowName'}
					rowSelection={rowSelection}
					pagination={pagination}
				/>
      </Modal>
			{/*交易服务费方案模态框*/}
			<Modal title='交易服务费方案' visible={tradingServiceChargesStatus}
        onOk={tradingServiceChargesSchemeOk} onCancel={tradingServiceChargesCancel}
      >
				<SearchInput {...searchtradingServiceCharges}/>
				<Table columns={tradingServiceChargesColumns}
					dataSource={tradingServiceChargesDataSource}
					rowClassName={()=>'rowName'}
					rowSelection={tradingServiceChargesRowSelection}
					pagination={tradingServiceChargesPagination}
				/>
      </Modal>
			<div>
				{(!!tradingServiceChargesName && !!showTradingServiceCharges) &&<Table
					columns={tradingServiceChargesColumns}
					pagination={false}
					dataSource={showTradingServiceChargesDataSource}
				/>}
			</div>
			{/*新建佣金的模态框*/}
			<Modal title='新建佣金配比方案' visible={CommissionRatioStatus}
				onOk={creatCommissionModalOk} onCancel={creatCommissionModalCancel}
      >
				<Form>
					<FormItem
						label='方案名称'
						{...formItemLayout}
					>
						{getFieldDecorator('commissionName', {
						})(
							<Input placeholder='请输入方案名称'/>
						)}
					</FormItem>
					<p className='potionsSet'>配比设置</p>
					<p className='potionsSet'>所有组成项目比例之和必须等于100%</p>
					<FormItem
						label='经纪人'
						{...formItemLayout}
					>
						{getFieldDecorator('commissionBroker', {
							initialValue:0,
						})(
							<InputNumber min={0} max={100} style={{width:'255px'}}/>
						)}
						<span className="ant-form-text"> %</span>
					</FormItem>
					<FormItem
						label='平台'
						{...formItemLayout}
					>
						{getFieldDecorator('commissionPlatform', {
							initialValue:0,
						})(
							<InputNumber min={0} max={100} style={{width:'255px'}}/>
						)}
						<span className="ant-form-text"> %</span>
					</FormItem>
					<FormItem
						label='省级代理'
						{...formItemLayout}
					>
						{getFieldDecorator('commissionProvince', {
							initialValue:0,
						})(
							<InputNumber min={0} max={100} style={{width:'255px'}} />
						)}
						<span className="ant-form-text"> %</span>
					</FormItem>
					<FormItem
						label='市级代理'
						{...formItemLayout}
					>
						{getFieldDecorator('commissionCity', {
							initialValue:0,
						})(
							<InputNumber min={0} max={100} style={{width:'255px'}} />
						)}
						<span className="ant-form-text"> %</span>
					</FormItem>
					<FormItem
						label='区县代理'
						{...formItemLayout}
					>
						{getFieldDecorator('commissionCounty', {
							initialValue:0,
						})(
							<InputNumber min={0} max={100} style={{width:'255px'}} />
						)}
						<span className="ant-form-text"> %</span>
					</FormItem>
					<FormItem
						label='交易中心'
						{...formItemLayout}
					>
						{getFieldDecorator('commissionTradingCenter', {
							initialValue:0,
						})(
							<InputNumber min={0} max={100} style={{width:'255px'}} />
						)}
						<span className="ant-form-text"> %</span>
					</FormItem>
					<FormItem
						label='师傅角色'
						{...formItemLayout}
					>
						{getFieldDecorator('commissionMaster', {
							initialValue:0,
						})(
							<InputNumber min={0} max={100} style={{width:'255px'}}/>
						)}
						<span className="ant-form-text"> %</span>
					</FormItem>
					<h3 className='postionsCenter'>总计：
						{getFieldValue('commissionBroker')+
						getFieldValue('commissionPlatform')+
						getFieldValue('commissionProvince')+
						getFieldValue('commissionCity')+
						getFieldValue('commissionCounty')+
						getFieldValue('commissionTradingCenter')+
						getFieldValue('commissionMaster')}%
					</h3>
				</Form>
      </Modal>
			{/*新建交易服务费方案配比*/}
			<Modal title='新建交易服务费配比方案' visible={servicesRatioStatus}
				onOk={creatServicesModalOk} onCancel={creatServicesModalCancel}
      >
				<Form>
					<FormItem
						label='方案名称'
						{...formItemLayout}
					>
						{getFieldDecorator('servicesName', {
						})(
							<Input placeholder='请输入方案名称'/>
						)}
					</FormItem>
					<p className='potionsSet'>配比设置</p>
					<p className='potionsSet'>所有组成项目比例之和必须等于100%</p>
					<FormItem
						label='平台'
						{...formItemLayout}
					>
						{getFieldDecorator('servicesPlatform', {
							initialValue:0,
						})(
							<InputNumber min={0} max={100} style={{width:'255px'}}/>
						)}
						<span className="ant-form-text"> %</span>
					</FormItem>
					<FormItem
						label='省级代理'
						{...formItemLayout}
					>
						{getFieldDecorator('servicesProvince', {
							initialValue:0,
						})(
							<InputNumber min={0} max={100} style={{width:'255px'}} />
						)}
						<span className="ant-form-text"> %</span>
					</FormItem>
					<FormItem
						label='市级代理'
						{...formItemLayout}
					>
						{getFieldDecorator('servicesCity', {
							initialValue:0,
						})(
							<InputNumber min={0} max={100} style={{width:'255px'}} />
						)}
						<span className="ant-form-text"> %</span>
					</FormItem>
					<FormItem
						label='区县代理'
						{...formItemLayout}
					>
						{getFieldDecorator('servicesCounty', {
							initialValue:0,
						})(
							<InputNumber min={0} max={100} style={{width:'255px'}} />
						)}
						<span className="ant-form-text"> %</span>
					</FormItem>
					<FormItem
						label='交易中心'
						{...formItemLayout}
					>
						{getFieldDecorator('servicesTradingCenter', {
							initialValue:0,
						})(
							<InputNumber min={0} max={100} style={{width:'255px'}} />
						)}
						<span className="ant-form-text"> %</span>
					</FormItem>
					<h3 className='postionsCenter'>总计：
						{getFieldValue('servicesPlatform')+
						getFieldValue('servicesProvince')+
						getFieldValue('servicesCity')+
						getFieldValue('servicesCounty')+
						getFieldValue('servicesTradingCenter')}%
					</h3>
				</Form>
      </Modal>

			<Button type='primary' onClick={createProfit}>确定</Button>
			<Button type='ghost' onClick={goback}>返回</Button>
		</DxPanel>
	);
}

NewCreateMatchProject.propTypes = {

};

function mapStateToProps({ newCreateMatchProject }) {
	return { newCreateMatchProject }
}
NewCreateMatchProject = Form.create({})(NewCreateMatchProject);
export default connect(mapStateToProps)(NewCreateMatchProject)
