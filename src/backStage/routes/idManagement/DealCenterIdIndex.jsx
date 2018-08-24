import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { Table,Button,Modal,Cascader,Select,Input,Form} from 'antd';
import regionalism from '../../../commons/assets/areas.json';
import { routerRedux } from 'dva/router';
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow'
const Option = Select.Option;
const FormItem=Form.Item;
import './DealCenterIdIndex.css'

function DealCenterIdIndex({dealCenterIdIndex,form,dispatch}) {
	const {getFieldDecorator}=form;
	const {dataSource,totalElements,
		deleteModalStatus,selectedCity,
		pageNo,pageSize,
	}=dealCenterIdIndex;
	const cityOptions = selectedCity.options;
	const columns=[
		{
			title: '序号',
			dataIndex:'number',
		},
		{
			title: '帐号',
			dataIndex:'accountNumber',
		},
		{
			title: '交易中心',
			dataIndex:'dealCenter',
		},
		{
			title: '地区',
			dataIndex:'area',
		},
		// {
		// 	title: '交易服务费(元)',
		// 	dataIndex:'transactionServiceFee',
		// },
		{
			title: '新建时间',
			dataIndex:'creatTime',
		},
		{
			title: '状态',
			dataIndex:'status',
		},
		{
			title: '操作',
			dataIndex:'opration',

			render:(text, record)=>(
				<div>
					<span className='oprationSpan' onClick={()=>{watchClick(record.id)}}>查看</span>
					<span className='oprationSpan' onClick={()=>{editModalClick(record.id)}}>编辑</span>
					{/*暂时禁用删除*/}
				{/*<span className='oprationSpan' onClick={()=>{deleteModalClick(record.id)}}>删除</span>*/}
					<span className='oprationSpan' onClick={()=>{resetPsdClick(record.id)}}>重置密码</span>
				</div>
			)
		},
	];
	//重置密码
	const resetPsdClick=(key)=>{
		Modal.confirm({
	    title: '提示',
	    content: '确定要重置密码吗？',
	    onOk() {
				dispatch({
					type:'dealCenterIdIndex/resetPsd',
					payload:{
						id:key
					}
				})
	    },
	    onCancel() {
	      console.log('Cancel');
	    },
	  });
	}
	const watchClick=(id)=>{
		dispatch(routerRedux.push({
      pathname: `/idManagement/dealCenterIdIndex/dealCenterIdDetail`,
			state: {id:id}
    }));
	}
	const creatZhangHao=()=>{
		dispatch(routerRedux.push({
      pathname: `/idManagement/dealCenterIdIndex/newAccount`,
    }));
	}
	const deleteModalClick=(id)=>{
		dispatch({
			type:'dealCenterIdIndex/deleteModalClick',
			payload: {activeId:id}
		})
	}
	const deleteModalonOk=()=>{
		dispatch({
			type:'dealCenterIdIndex/tryDelete', //deleteModalonOk
		})
	}
	const deleteModalonCancel=()=>{
		dispatch({
			type:'dealCenterIdIndex/deleteModalonCancel'
		})
	}

	const editModalClick=(id)=>{
		dispatch(routerRedux.push({
      pathname: `/idManagement/dealCenterIdIndex/newAccount`,
			state: {id: id}
    }));
	}
	const editModalOk=()=>{
		dispatch({
			type:'dealCenterIdIndex/editModalOk'
		})
	}
	const editModalCancel=()=>{
		dispatch({
			type:'dealCenterIdIndex/editModalCancel'
		})
	}
	const handleSubmit=()=> {
		form.validateFields((err, values) => {
			console.log('Received values of form: ', values);
			if (err) {
				return;
			}
			let params = {};
			if(values.keyword){
				params.name = values.keyword;
			}
			if(values.nameCertificate){
				params.status = values.nameCertificate;
			}
			if(values.area && values.area.length){
				params.businessPath = "/"+values.area.join("/");
			}
			console.log("start search,",params);
			dispatch({type: 'dealCenterIdIndex/query', payload: params});
		});
	}
	const handleReset=()=>{
		form.resetFields();
		console.log("start reset");
		dispatch({type: 'dealCenterIdIndex/query'});
	};
	const pagination={
    total:totalElements,
    current:pageNo,
    pageSize:pageSize,
    showTotal:(data)=>{
       return `共 ${totalElements} 条`
    },
    onChange:(data)=>{
      dispatch({
				type:'dealCenterIdIndex/query',
				payload:{
					pageNo:data,
				},
			})
    },
    // onShowSizeChange:(current, pageSize)=>{
    //   console.log(current, pageSize,'current, pageSize');
    // }
  }
	return(
		<div>
			<Form inline style={{margin:'20px 0'}}>
				<FormItem
					label="关键字"
				>
					{getFieldDecorator('keyword', {
					})(
						<Input placeholder='搜索帐号或名称'/>
					)}
				</FormItem>
				<FormItem label='地区'>
					{getFieldDecorator('area', {
					})(
						<Cascader options={cityOptions} placeholder='河北省 / 保定市' changeOnSelect={true}/>
					)}
				</FormItem>
				<FormItem
					label="状态"
				>
					{getFieldDecorator('nameCertificate', {
						initialValue:"",
					})(
						<Select
							showSearch
							style={{minWidth:'70px'}}
							optionFilterProp='children'
						>
							<Option key='' value=''>全部</Option>
							<Option key='正常' value='正常'>正常</Option>
							<Option key='冻结' value='冻结'>冻结</Option>
						</Select>
					)}
				</FormItem>
				<FormItem>
					<Button type="primary"  style={{margin:'0 6px 0 0'}} onClick={handleSubmit}>搜索</Button>
					<Button type='ghost' onClick={handleReset}>重置</Button>
				</FormItem>
			</Form>
			<div className='creatZhangHao'>
				<Button type='primary' onClick={creatZhangHao}>新建账号</Button>
			</div>
			<Table columns={columns}
				dataSource={dataSource}
				pagination={pagination}
			/>
			<Modal title='提示' visible={deleteModalStatus}
          onOk={deleteModalonOk} onCancel={deleteModalonCancel}
        >
        <p>确认要删除帐号吗？</p>
      </Modal>
			<DxLoadingShadow visible={!!dealCenterIdIndex.loading} zIndex={1001}/>
		</div>
	)
}


DealCenterIdIndex.propTypes = {

};
function mapStateToProps({ dealCenterIdIndex }) {
	return { dealCenterIdIndex }
}

export default connect(mapStateToProps)(Form.create()(DealCenterIdIndex))
