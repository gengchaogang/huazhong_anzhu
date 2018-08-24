import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import {Table,Button,Form,Input,Cascader,Select,Modal} from 'antd';
import { routerRedux } from 'dva/router';
import './AgentIdIndex.css'
const FormItem=Form.Item;
function AgentIdIndex({dispatch,agentIdIndex,form}) {
	const {getFieldDecorator}=form;
	const {dataSource,total,pageNo,optionsArr,
		keyWord,areaName,loading
	}=agentIdIndex
	const columns=[
		{
			title: '序号',
			dataIndex:'number',
		},
		{
			title: '代理商级别',
			dataIndex:'role',
		},
		{
			title: '帐号',
			dataIndex:'loginName',
		},
		{
			title: '区域',
			dataIndex:'areaName',
		},
		{
			title: '开通时间',
			dataIndex:'createTime',
		},
		{
			title: '状态',
			dataIndex:'status',
		},
		{
			title: '操作',
			dataIndex:'opration',
			render:(text,record)=><div>
				<span className='oprationSpan' onClick={()=>{agentIdIndexWatch(record.key)}}>查看</span>
				<span className='oprationSpan' onClick={()=>{agentIdIndexEdit(record.key)}}>编辑</span>
				<span className='oprationSpan' onClick={()=>{agentIdIndexDelete(record.key)}}>删除</span>
				<span className='oprationSpan' onClick={()=>(congZhiPsd(record.key))}>重置密码</span>
			</div>
		},
	];
	const agentIdIndexWatch=(key)=>{
		dispatch(routerRedux.push({
			pathname: `/idManagement/agentIdIndex/agentIdDetail`,
			state:{id:key}
		}));
	}
	const createNewZhangHao=()=>{
		dispatch(routerRedux.push({
      pathname: `/idManagement/agentIdIndex/agentIdIndexNewAccount`,
    }));
	}
	const agentIdIndexEdit=(key)=>{
		dispatch(routerRedux.push({
      pathname: `/idManagement/agentIdIndex/agentIdIndexNewAccount`,
			state:{id:key}
    }));
	}
	//删除
	const agentIdIndexDelete=(key)=>{
		Modal.confirm({
	    title: '提示',
	    content: '确认要删除？',
	    onOk() {
				dispatch({type:'agentIdIndex/querySuccess',payload:{loading:true}})
				dispatch({
					type:'agentIdIndex/agentIdIndexDelete',
					payload:{id:key}
				})
	    },
	    onCancel() {},
	  });
	}
	const congZhiPsd=(key)=>{
		Modal.confirm({
	    title: '提示',
	    content: '确认要重置密码吗？',
	    onOk() {
				dispatch({type:'agentIdIndex/querySuccess',payload:{loading:true}})
				dispatch({
					type:'agentIdIndex/agentIdIndexresetPassword',
					payload:{id:key}
				})
	    },
	    onCancel() {},
	  });
	}
	const handleReset=()=>{
		form.resetFields();
	};
	const handleSubmit=()=> {
		form.validateFields((err, values) => {
			if (err) {
				return;
			}
			let areaNames;
			if(values.areaName){
				areaNames='/'+values.areaName.join('/')
			}
			dispatch({type:'agentIdIndex/querySuccess',payload:{loading:true}})
			dispatch({
				type:'agentIdIndex/findAll',
				payload:{
					areaName:areaNames,
					keyWord:values.keyWord,
				}
			})
		});
	}
	const pagination={
		total:total,
		showTotal:total => `共 ${total} 项`,
		current:pageNo,
		onChange:(page)=>{
			dispatch({type:'agentIdIndex/querySuccess',payload:{loading:true}})
			dispatch({type:'agentIdIndex/findAll',
				payload:{
					pageNo:page-1,
					keyWord:keyWord,
					areaName:areaName,
				}
			})
		},
	}

	return(
		<div>
			<Form inline style={{margin:'20px 0'}}>
				<FormItem
					label="关键字"
				>
					{getFieldDecorator('keyWord', {
					})(
						<Input placeholder='搜索帐号或名称'/>
					)}
				</FormItem>
				<FormItem label='地区'>
					{getFieldDecorator('areaName', {
					})(
						<Cascader placeholder='河北省 / 保定市' options={optionsArr}
							changeOnSelect={true}
						/>
					)}
				</FormItem>
				<FormItem>
					<Button type="primary"  style={{margin:'0 6px 0 0'}} onClick={handleSubmit}>搜索</Button>
					<Button type='ghost' onClick={handleReset}>重置</Button>
				</FormItem>
			</Form>
			<Button type='primary' onClick={createNewZhangHao}>新建帐号</Button>
			<Table columns={columns} dataSource={dataSource}
				pagination={pagination} loading={loading}
			/>
		</div>
	)
}


AgentIdIndex.propTypes = {

};
function mapStateToProps({ agentIdIndex }) {
	return { agentIdIndex }
}

export default connect(mapStateToProps)(Form.create()(AgentIdIndex))
