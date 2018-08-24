import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import { Link } from 'dva/router'
import DxUpLoadPic from '../../../commons/View/DxUpLoadPic'
import {Tabs,Button,Table,Modal,Row,Input,Select,Form, Cascader} from 'antd';
const confirm = Modal.confirm;
const FormItem = Form.Item;
const Option=Select.Option;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
function TableContent({location, dispatch, labelManagement,form}) {
	const {status,labelListData,loading, currentEditRecord, currentEditValue,totalType,currentType,
		editTagContentModal,id,typeName,value,name,labelTypesNameList,typeId,
    showPicList,
	}=labelManagement;
	const {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }=form;
  const shopsUplod={
    url:'/miss-anzhu-aliyun-file/putfile',
    maxNum:1,//最大上传数
    maxSize:2,//文件大小限值
    showPicList:showPicList,//state管理图片list
    doCover:true,
    changeList:(data)=>{
      dispatch({
        type:'labelManagement/setState',
        payload:{showPicList:data}
      })
    },//更新list回调
  }
	const handleOkeditModal=()=>{
		form.validateFields((err, values) => {
      let typeIds='';
      if(!!labelTypesNameList){
        for(let i =0 ;i<labelTypesNameList.length ;i++){
          if(values.typeName==labelTypesNameList[i].name){
            typeIds=labelTypesNameList[i].id;
          }
        }
      }
			dispatch({
				type:'labelManagement/handleOkeditModal',
				payload:{
					id:id,
					name:values.name,
					typeId:typeIds,
					value:values.value,
          key:(showPicList.length!=0?showPicList[0].id:''),
				}
			})
		})
    resetFields()
	}
	const handleCanceleditModal=()=>{
    dispatch({
      type:'labelManagement/setState',
      payload:{
        editTagContentModal:false,
        showPicList:[],
      }
    })
	}
	const tableColumns=[
		{
			title: '序号',
			dataIndex:'number',
		}, {
			title: '标签名称',
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
			title:'标签值',
			dataIndex:'value',
		},
		{
			title: '标签类别',
			dataIndex:'labelType',
		}, {
			title: '更新时间',
			dataIndex:'openDateTime',
		},{
			title: '更新人员',
			dataIndex:'updataPerson',
		},
    {
      title: '地区',
			dataIndex:'aerasName',
    },
    {
			title: '状态',
			dataIndex:'status',
		}, {
			title: '操作',
			render:(text,record,index)=>{
				let showConfirm_delete=()=>{
					confirm({
						title: '确认要删除此标签吗？',
						onOk:()=>{dispatch({
							type:'labelManagement/deleteLabel',
							payload:record.serialNumber,
						})},
						onCancel(){},
					});
				};
				const modifyName=()=>{
					dispatch({
						type:'labelManagement/getEidtTagContent',
						payload:record.serialNumber,
					})
          dispatch({
            type:'labelManagement/findAllBriefArr',
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
						type:'labelManagement/eidtLabel',
					})
				};
				return(
					<span className='operation'>
						<a className='operation_color' onClick={modifyName}>编辑</a>
						<a className='operation_color' onClick={showConfirm_delete}>删除</a>
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
			dispatch({
				type:'labelManagement/changeLabelCurrent',
				payload:{
          name:name,
          status:status,
          typeName:typeName,
          value:value,
          pageNumber:current-1,
        },
			})
		},
	};
	return (
		<div>
			<Table
				loading={loading}
				columns={tableColumns}
				dataSource={labelListData}
				rowKey={record => record.serialNumber}
				pagination={pagination}
			/>
		<Modal title='编辑标签内容' visible={editTagContentModal}
			onOk={handleOkeditModal} onCancel={handleCanceleditModal}
			>
			<Form>
				<FormItem
					label='标签名称'
					{...formItemLayout}
				>
					{getFieldDecorator('name', {
						initialValue:name,
					})(
						<Input placeholder='请输入标签名称'/>
					)}
				</FormItem>
				<FormItem
					label='标签类别'
					{...formItemLayout}
				>
					{getFieldDecorator('typeName', {
						initialValue:typeName,
					})(
						<Select>
              {!!labelTypesNameList && labelTypesNameList.map((item,index)=>(
                <Option value={item.name} key={`key_${index}`}>{item.name}</Option>
              ))}
            </Select>
					)}
				</FormItem>
				<FormItem
					label='标签值'
					{...formItemLayout}
				>
					{getFieldDecorator('value', {
						initialValue:value,
					})(
						<Input placeholder='请输入标签值'/>
					)}
				</FormItem>
        <div className='uploadParent'>
          <DxUpLoadPic {...shopsUplod}/>
        </div>
			</Form>
		</Modal>
		</div>
	);
}

TableContent.propTypes = {

}

function mapStateToProps({ labelManagement }) {
	return { labelManagement }
}

export default connect(mapStateToProps)(Form.create()(TableContent))
