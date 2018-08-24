import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import { Link } from 'dva/router'
import {Tabs,Button,Table,Modal,Row,Input,Select,Form, Cascader} from 'antd';
const confirm = Modal.confirm;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
function _getNameArrByCode(arr, code){
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

function _getNamePathsByCode(arr, code){
  var nameArr = _getNameArrByCode(arr, code);
  return "/"+nameArr.join("/");
}

function TableCategory({location, dispatch, labelManagement,form}) {
	const {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }=form;
	const {
		status,
		loading,
		currentEditRecord,
		currentEditValue,
		labelTypesData,
		totalType,
		currentType,
		editTagLeiBieModal,
		options,
		leiBieName,
		editOptions,
		leiBieId,
		areaCityOptions,
		arrOption,
    areaPath,
    name,
	}=labelManagement;
	const tableColumns=[
		{
			title: '序号',
			dataIndex:'number',
		}, {
			title: '类别名称',
			dataIndex:'name',
			render:(text,record,index)=>{
				const onValueChange=(e)=>{
					dispatch({
						type:'labelManagement/setState',
						payload:{
							currentEditValue:e.target.value,
						}
					});
				};
				if(currentEditRecord==index){
					return(
						<Input value={currentEditValue} onChange={onValueChange}/>
					);
				}else {
					return (
						<span>{record.name}</span>
					);
				}
			}
		},
		{
			title:'区域',
			dataIndex:'areaPath',
		},
		{
			title: '更新时间',
			dataIndex:'openDateTime',
		},{
			title: '更新人员',
			dataIndex:'updataPerson',
		},{
			title: '状态',
			dataIndex:'status',
		}, {
			title: '操作',
			render:(text,record,index)=>{
				let showConfirm_stop=()=>{
					confirm({
						title: '确认要停用此类别吗？',
						// content: 'When clicked the OK button, this dialog will be closed after 1 second',
						onOk() {
							return new Promise((resolve, reject) => {
								//在此发送请求
								dispatch({
									type:'labelManagement/stopCategory',
									payload:{
										resolve:resolve,
										id:record.serialNumber,
									}
								})
							}).catch(() => console.log('errors!'));
						},
						onCancel() {},
					});
				};
				let showConfirm_start=()=>{
					confirm({
						title: '确认要启用此类别吗？',
						onOk() {
							return new Promise((resolve, reject) => {
								//在此发送请求
								dispatch({
									type:'labelManagement/stopCategory',
									payload:{
										resolve:resolve,
										reject:reject,
										id:record.serialNumber,
									}
								})
							}).catch(() => console.log('errors!'));
						},
						onCancel() {},
					});
				};
				let showConfirm_delete=()=>{
					confirm({
						title: '确认要删除此类别吗？',
						// content: 'When clicked the OK button, this dialog will be closed after 1 second',
						onOk:()=>{dispatch({
							type:'labelManagement/deleteLabelType',
							payload:record.serialNumber
						})},
						onCancel() {},
					});
				};
				let modifyName=()=>{
					dispatch({
						type:'labelManagement/setState',
						payload:{
							leiBieId:'',
							leiBieName:'',
							editOptions:[],
						}
					})
					dispatch({
						type:'labelManagement/editTagLeiBie',
						payload:{
							id:record.serialNumber,
						}
					})
				};

				let handleCancel=()=>{
					dispatch({
						type:'labelManagement/setState',
						payload:{
							currentEditRecord:null,
							currentEditValue:record.name,
						}
					})
				};
				let handleSubmit=()=>{
					//发起异步请求保存
						//成功后保存&&重新拉去次数据
						dispatch({
							type:'labelManagement/eidtLabelType',
						})
				};
				return(
					<span>
						{record.status=='启用'?
						<div className='operation'>
							<a className='operation_color' onClick={showConfirm_stop}>停用</a>
							<a className='operation_color' onClick={modifyName}>编辑</a>
						</div>:
						<div className='operation'>
							<a className='operation_color' onClick={modifyName}>编辑</a>
							<a className='operation_color' onClick={showConfirm_start}>启用</a>
							<a className='operation_color' onClick={showConfirm_delete}>删除</a>
						</div>}
					</span>
				)
			}
		}
	];
	const pagination = {
		total:totalType,
		showQuickJumper: true,
		current:currentType,
		pageSize:10,
		onChange: (current) => {
      console.log(areaPath,name,status,current);
			dispatch({
				type:'labelManagement/changeLabelTypeCurrent',
				payload:{
          pageNo:current-1,
          name:name,
          status:status,
          pageSize:10,
          areaPath:areaPath,
        },
			})
		},
	};
	const handleCancelLeiBieModal=()=>{
		dispatch({
			type:'labelManagement/setState',
			payload:{
				editTagLeiBieModal:false,
				leiBieId:'',
				leiBieName:'',
				editOptions:'',
			}
		})
	}
	const handleOkLeiBieModal=()=>{
		form.validateFields((err, values) => {
			let areaPath='';
			let areaCodes='';
			if(values.areaCode){
				areaPath=_getNamePathsByCode(arrOption,values.areaCode[values.areaCode.length-1])
				areaCodes=values.areaCode[values.areaCode.length-1];
			}
			if (err) {
				return;
			}
			dispatch({
				type:'labelManagement/handleOkLeiBie',
				payload:{
					areaPath:areaPath,
					areaCode:areaCodes,
					id:leiBieId,
					name:values.name,
				}
			})
			resetFields()
		});
	}
	return (
		<div>
			<Modal title='编辑标签内容' visible={editTagLeiBieModal}
				onOk={handleOkLeiBieModal} onCancel={handleCancelLeiBieModal}
				>
				<Form>
					<FormItem
						label='类别名称'
						{...formItemLayout}
					>
						{getFieldDecorator('name', {
							initialValue:leiBieName,
							rules: [{ required: true, message: '请输入类别名称!' }],
						})(
							<Input placeholder='请输入类别名称'/>
						)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="区域"
					>
						{getFieldDecorator('areaCode', {
							initialValue:editOptions,
						})(
							<Cascader options={options} placeholder='--'/>
						)}
					</FormItem>
				</Form>
			</Modal>
			<Table
				loading={loading}
				columns={tableColumns}
				dataSource={labelTypesData}
				rowKey={record => record.key}
				pagination={pagination}
			/>
		</div>
	);
}

TableCategory.propTypes = {

}

function mapStateToProps({ labelManagement }) {
	return { labelManagement }
}

export default connect(mapStateToProps)(Form.create()(TableCategory))
