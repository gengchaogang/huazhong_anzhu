import React, { Component, PropTypes } from 'react'
import {Table, Icon, Form, Input, Button,Cascader,filter}from 'antd'
import { routerRedux } from 'dva/router';
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow'
import { connect } from 'dva'
import './AdvisorIdIndex.css'
import defaultBrokerLogo from '../../assets/images/img1.jpg'
const FormItem=Form.Item;

function CustomerIndex({dispatch,customerIndex,form}) {
    const {getFieldDecorator}=form;    

    console.log("customerIndex",customerIndex);

	const {tableData,totalElements,pageNo,pageSize}=customerIndex;
    	
	const columns=[
		{
			title: '序号',
			dataIndex:'key',
		}, {
			title: '头像',
            dataIndex:'avatar',
            render:(text,record)=>{
				return(
                    <img src={text||defaultBrokerLogo} width="60px" height="60px" style={{borderRadius:"50%"}}/>
				)
			}            
		},{
			title: '登陆账号',
			dataIndex:'loginName',
		},{
			title: '昵称',
			dataIndex:'name',
		},{
			title: '创建时间',
			dataIndex:'createDate',
		}
	];
	const handleReset=()=>{
		form.resetFields();
		dispatch({type: 'customerIndex/query'});
	};
	const handleSubmit=()=> {
		form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
            if (err) {
				return;
			}
			let params = {};			
			if(values.keyWord){
				params.keyWord = values.keyWord;
			}
			dispatch({type: 'customerIndex/query', payload: params});
		});
	}

	const pagination={
        total:totalElements,
        current: pageNo,
        pageSize: pageSize,
        showTotal:(data)=>{
       return `共 ${totalElements} 条`
    },

    onChange:(data)=>{
      dispatch({
				type:'customerIndex/query',
				payload:{
					pageNo:data,
				},
			})
    },
  }

	return(
		<div className="customerIndex">
			<Form inline style={{margin:'20px 0'}}>
				<FormItem
					label="关键字"
				>
					{getFieldDecorator('keyWord', {
					})(
						<Input placeholder='支持昵称和登陆账号'/>
					)}
				</FormItem>
				<FormItem>
					<Button type="primary"  style={{margin:'0 6px 0 0'}} onClick={handleSubmit}>搜索</Button>
					<Button type='ghost' onClick={handleReset}>重置</Button>
				</FormItem>
			</Form>
			<Table dataSource={tableData} columns={columns} pagination={pagination}/>
		</div>
	)
}


CustomerIndex.propTypes = {

};
function mapStateToProps({ customerIndex }) {
	return { customerIndex }
}

export default connect(mapStateToProps)(Form.create()(CustomerIndex))