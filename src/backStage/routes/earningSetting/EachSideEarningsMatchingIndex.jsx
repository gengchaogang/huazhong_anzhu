import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import { Link } from 'dva/router'
import {Tabs,Button,Table,Modal,Row,Input,Select,Form, Cascader} from 'antd';
import DxPanel from '../../../commons/components/DxPanel'
import SearchBox from '../../components/earningSetting/SearchBox_EachSide'
import TableEachSide from '../../components/earningSetting/TableEachSide'
import './earningSetting.css'
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const _toCascaderOptions=(arr)=>{
  var options = [];
  var map = {};
  arr.forEach(({code,pCode,lable})=>{
    var option = {value: code, label:lable}, children;
    map[code] = option;
    if(pCode){
      children = map[pCode];
      if(!children.children){
        children.children = [];
      }
      children.children.push(option);
    }else {
      options.push(option);
    }
  });
  return options;
}
const _getCode=(arr, code)=>{
  var nameArr = [], item;
  for(var i=arr.length-1; i>=0; i--){
    item = arr[i];
    if(item.code == code){
      nameArr.push(item.code);
      if(item.pCode){
        code = item.pCode;
      }else {
        break;
      }
    }
  }
  nameArr.reverse();
  return nameArr;
}
const _getName=(arr, code)=>{
  var nameArr = [], item;
  for(var i=arr.length-1; i>=0; i--){
    item = arr[i];
    if(item.code == code){
      nameArr.push(item.lable);
      if(item.pCode){
        code = item.pCode;
      }else {
        break;
      }
    }
  }
  nameArr.reverse();
  return nameArr;
}

const _getNamePathsByCode=(arr, code)=>{
  var nameArr = _getName(arr, code);
  return "/"+nameArr.join("/");
}
import './earningSetting.css'
function EachSideEarningsMatchingIndex({location, dispatch, form,eachSideEarningsMatchingIndex}) {
	const { getFieldDecorator,resetFields,setFields } =form;
	const {dataSource,loading,total,pageNo,options,
		editModalStatus,
		keyWord,
		areaPath,
		areaCode,
		originalArray,
    id,
    tcId,
    tradingCenterName,
    commissionName,
    tradingServiceChargesName,
    originalTraingArr,
    traingArr,
    tradingServiceList,
    allocationPlansList,
	}=eachSideEarningsMatchingIndex;
	const columns=[
		{
			title:'序号',
			dataIndex:'number',
		},
		{
			title:'省份',
			dataIndex:'province',
		},
		{
			title:'城市',
			dataIndex:'city',
		},
		{
			title:'区县',
			dataIndex:'county',
		},
		{
			title:'交易中心',
			dataIndex:'tradingCenterName',
		},
		{
			title:'配比方案',
			dataIndex:'commissionName',
		},
		{
			title:'佣金配比',
			dataIndex:'commissionRatio',
			render:(text,record)=>(
				<div>
					<p>经纪人：{record.commissionBroker}%</p>
					<p>平台：{record.commissionPlatform}%</p>
					<p>省级代理：{record.commissionProvinceAgency}%</p>
					<p>市级代理：{record.commissionCityAgency}%</p>
					<p>区县代理：{record.commissionCountyAgency}%</p>
					<p>师傅角色：{record.commissionMaster}%</p>
					<p>交易中心：{record.commissionTradingCenter}%</p>
				</div>
			)
		},
		{
			title:'配比方案',
			dataIndex:'tradingServiceChargesName',
		},
		{
			title:'交易服务费配比',
			dataIndex:'transactionServiceFeeRatio',
			render:(text,record)=>(
				<div>
					<p>平台：{record.tradingServiceChargesPlatform}%</p>
					<p>省级代理：{record.tradingServiceChargesProvinceAgency}%</p>
					<p>市级代理：{record.tradingServiceChargesCityAgency}%</p>
					<p>区县代理：{record.tradingServiceChargesCountyAgency}%</p>
					<p>交易中心：{record.tradingServiceChargesTradingCenter}%</p>
				</div>
			)
		},
		{
			title:'操作',
			dataIndex:'operation',
			render:(text,record)=><div>
				<span className='operationColor' onClick={()=>{editOcations(record)}}>编辑</span>
				<span className='operationColor' onClick={()=>{deletOcations(record.id)}}>删除</span>
			</div>
		},
	]
	//编辑
	const editOcations=(key)=>{
		dispatch({
			type:'eachSideEarningsMatchingIndex/editBeforeOcations',
			payload:{
				id:key.id,
			}
		})
    dispatch({
      type:'eachSideEarningsMatchingIndex/findTraingArr',
      payload:{
        code:key.areaCode,
      }
    })
    dispatch({
      type:'eachSideEarningsMatchingIndex/findtradingServiceChargesList',
      payload:{pageSize:100000}
    })
    dispatch({
      type:'eachSideEarningsMatchingIndex/findallocationPlansList',
      payload:{pageSize:100000}
    })
	}
	//删除
	const deletOcations=(record)=>{
		Modal.confirm({
			title: '提示',
			content: '确认要删佣金配比吗？',
			okText: '确定',
			cancelText: '取消',
			onOk:()=>{
				dispatch({
					type:'eachSideEarningsMatchingIndex/initail',
					payload:{loading:true}
				})
				dispatch({
					type:'eachSideEarningsMatchingIndex/deletOcations',
					payload:{
						id:record,
					}
				})
			}
		});
	}
	const handleReset=()=>{
		form.resetFields();
		dispatch({
			type:'eachSideEarningsMatchingIndex/initail',
			payload:{loading:true}
		})
		dispatch({
			type:'eachSideEarningsMatchingIndex/handleReset',
		})
	};
	const handleSubmit=()=> {
		form.validateFields((err, values) => {
			// console.log('Received values of form: ', values);
			let areaPath;
			if(values.areaPath){
				areaPath='/'+values.areaPath.join('/');
			}else{
				areaPath='/'
			}
			dispatch({
				type:'eachSideEarningsMatchingIndex/handleSubmit',
				payload:{
					keyWord:values.keyWord,
					areaPath:areaPath,
				}
			})
		});
	};
	const pagination={
		total:total,
		showTotal:total => `共 ${total} 项`,
		current:pageNo,
		onChange:(page)=>{
			dispatch({type:'eachSideEarningsMatchingIndex/initail',
				payload:{loading:true}
			})
			dispatch({
				type:'eachSideEarningsMatchingIndex/pageOnchange',
				payload:{
					pageNo:page,
					keyWord:keyWord,
					areaPath:areaPath,
				}
			})
		}
	};
	const createCommission=()=>{
		dispatch(routerRedux.push({
			pathname: `/earningSetting/allEarningsMatching/newCreateMatchProject`,
		}));
	}
	const editModalOk=()=>{
		form.validateFields((err, values) => {
			if (err) {
				return;
			}
      let tcIds='';
      traingArr.map((item)=>(
        (item.name==values.tradingCenterName)?tcIds=item.id:''
      ))
      console.log(values,traingArr);
			dispatch({
				type:'eachSideEarningsMatchingIndex/initail',
				payload:{loading:true}
			})
			dispatch({
				type:'eachSideEarningsMatchingIndex/editAllOcationsOk',
				payload:{
					tradingServiceChargesName:values.tradingServiceChargesName,
					tradingCenterName:values.tradingCenterName,
					commissionName:values.commissionName,
					areaCode:(!!values.path && values.path[values.path.length-1]),
					areaPath:(!!values.path && _getNamePathsByCode(originalArray,values.path[values.path.length-1])),
					id:id,
					tcId:tcIds,
				}
			})
			resetFields();
		})
	}
	const editModalCancel=()=>{
		dispatch({
			type:'eachSideEarningsMatchingIndex/initail',
			payload:{
				editModalStatus:false,
				areaPath:'',
				keyWord:'',
			}
		})
		resetFields();
	}
  const cascaderChange=(value)=>{
    // console.log(value,'value');
    dispatch({
      type:'eachSideEarningsMatchingIndex/findcascaderChange',
      payload:{
        code:(!!value && value[value.length-1])
      }
    })
  }
	return (
		<DxPanel title='各方收益配比'>
			<Form inline style={{margin:'20px 0'}}>
				<Row type="flex" align="middle" >
					<FormItem
						label="关键字"
					>
						{getFieldDecorator('keyWord', {
						})(
							<Input placeholder="搜索交易中心名称或配比方案"/>
						)}
					</FormItem>
					<FormItem
						label="城市"
					>
						{getFieldDecorator('areaPath', {
						})(
							<Cascader placeholder="请选择城市" options={options} changeOnSelect={true}/>
						)}
					</FormItem>
					<Button style={{margin:'0 6px 0 0'}}  onClick={handleSubmit} type="primary" icon="search">搜索</Button>
					<Button  onClick={handleReset} type='default'>重置</Button>
				</Row>
			</Form>
			<Button type='primary' onClick={createCommission}>新建</Button>
			<Table columns={columns} dataSource={dataSource} loading={loading}
				pagination={pagination}
			/>
			<Form>
				<Modal title='编辑' visible={editModalStatus}
	        onOk={editModalOk} onCancel={editModalCancel}
	      >
					<FormItem
						label='省份、城市、区县'
						{...formItemLayout}
					>
						{getFieldDecorator('path', {
							initialValue:_getCode(originalArray,areaCode),
						})(
							<Cascader style={{width:'284px'}}
								options={_toCascaderOptions(originalArray)}
							  changeOnSelect={true}
                onChange={(value,selectedOptions)=>{cascaderChange(value)}}
              />
						)}
					</FormItem>
					<FormItem
						label='交易中心名'
						{...formItemLayout}
					>
						{getFieldDecorator('tradingCenterName', {
							initialValue:tradingCenterName,
						})(
              <Select className='selectTradingCenter'
      				placeholder='请选择' className='selectTrading'>
      					<Option value=''>全部</Option>
                {!!traingArr &&
                  traingArr.map((item,index)=>(
                    <Option key={`${index}_item`} value={item.name}>{item.name}</Option>
                ))}
      				</Select>
						)}
					</FormItem>
					<FormItem
						label='佣金分配方案名'
						{...formItemLayout}
					>
						{getFieldDecorator('commissionName', {
							initialValue:commissionName,
						})(
              <Select style={{width:'284px'}}>
                {!!allocationPlansList && allocationPlansList.map((item,index)=>(
                  <Option key={`item_${index}`} value={item}>{item}</Option>
                ))}
              </Select>
						)}
					</FormItem>
					<FormItem
						label='交易服务费分配方案'
						{...formItemLayout}
					>
						{getFieldDecorator('tradingServiceChargesName', {
							initialValue:tradingServiceChargesName,
						})(
							<Select style={{width:'284px'}}>
                {!!tradingServiceList && tradingServiceList.map((item,index)=>(
                  <Option key={`item_${index}`} value={item}>{item}</Option>
                ))}
              </Select>
						)}
					</FormItem>
				</Modal>
			</Form>
		</DxPanel>
	);
}

EachSideEarningsMatchingIndex.propTypes = {

};
EachSideEarningsMatchingIndex = Form.create({})(EachSideEarningsMatchingIndex);
function mapStateToProps({ eachSideEarningsMatchingIndex }) {
	return { eachSideEarningsMatchingIndex }
}

export default connect(mapStateToProps)(EachSideEarningsMatchingIndex)
