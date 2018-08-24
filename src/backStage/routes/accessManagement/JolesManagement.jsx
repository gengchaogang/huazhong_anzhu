import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import {Input,Table,Button,Modal,Form,Tree,TreeSelect} from 'antd';
import DxPanel from '../../../commons/components/DxPanel'
import DxTree from '../../../commons/View/DxTree'
import './JolesManagement.css'
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const removeByValue=(arr, val)=>{
  for(var i=0; i<arr.length; i++) {
    if(arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }
  return arr
}
function JolesManagement({dispatch,jolesManagement,form}) {
  const {createRoleNameStatus,dataSource,
    pageNo,total,loading,treeData,name,id,codes,
  }=jolesManagement;
  // console.log(treeData,'treeDatatreeData>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  const {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }=form;
  // console.log(codes,treeData,'codes');
  const dxTreeProps = {
    treeData: [],
    loadData: loadData,
    treeProps: {
      onSelect: onTreeSelect,
      draggable: true,
      // onDragStart,
      // onDragEnter,
      // onDragOver,
      // onDragLeave,
      // onDragEnd,
      // onDrop,
      // onMouseEnter,
      // ...treeProps,
    },
  };
  const loadData=()=>{

  }
  const onTreeSelect=()=>{

  }
  const columns=[
    {
      title:'序号',
      dataIndex:'number',
    },
    {
      title:'角色名称',
      dataIndex:'name',
    },
    {
      title:'更新时间',
      dataIndex:'updateTime',
    },
    {
      title:'更新人员',
      dataIndex:'updateUser',
    },
    {
      title:'添加时间',
      dataIndex:'createTime',
    },
    {
      title:'操作',
      dataIndex:'operation',
      render:(index,record)=><div>
        <span className='operationColor' onClick={()=>{editData(record.key)}}>编辑</span>
        <span className='operationColor' onClick={()=>{deleteData(record.key)}}>删除</span>
      </div>
    },
  ]
  const deleteData=(key)=>{
    Modal.confirm({
      title: '提示',
      content: '确认要删除选中角色吗？',
      okText: '确定',
      cancelText: '关闭',
      onOk(){
        dispatch({
          type:'jolesManagement/initailSuccess',
          payload:{loading:true}
        })
        dispatch({
          type:'jolesManagement/deleteData',
          payload:{id:key}
        })
      },
      onCancel() {},
    });
  }
  //创建
  const createUser=()=>{
    dispatch({
      type:'jolesManagement/searchPower',
    })
  }
  //编辑
  const editData=(key)=>{
    dispatch({
      type:'jolesManagement/searchPower',
    })
    dispatch({
      type:'jolesManagement/findOneBeforEdit',
      payload:{
        id:key,
      }
    })
  }
  //创建角色名称点击确定
  const createRoleNameOk=()=>{
    form.validateFields((err,values)=>{
      if(err){
        return
      }
      const codes=[];
      if(values.power){
        values.power.map((item,index)=>(
          codes.push({
            name:item.label,
            code:item.value,
          })
        ))
      }
      // console.log(values.power,'values.powervalues.power');
      if(!!id){
        dispatch({
          type:'jolesManagement/editRole',
          payload:{
            name:values.name,
            codes:codes,
            id:id,
          }
        })
      }else{
        dispatch({
          type:'jolesManagement/addRole',
          payload:{
            name:values.name,
            codes:codes,
          }
        })
      }
    })
    form.resetFields();
  }
  const createRoleNameCancel=()=>{
    dispatch({
      type:'jolesManagement/initailSuccess',
      payload:{
        createRoleNameStatus:false,
        name:'',
        codes:[],
        id:'',
      }
    })
    form.resetFields();
  }
  const pagination={
		total:total,
		showTotal:total => `共 ${total} 项`,
		pageSize:10,
    current:pageNo,
		onChange:(page)=>{
      dispatch({type:'jolesManagement/initailSuccess',
        payload:{loading:true}
      })
      dispatch({
        type:'jolesManagement/initail',
        payload:{
          pageNo:page-1,
          pageSize:10,
        }
      })
    },
	};
  const treeSelectProps={
    treeData,
    multiple: true,
    treeCheckable: true,
    // showCheckedStrategy: TreeSelect.SHOW_ALL,
    searchPlaceholder: '请选择角色权限',
    style: {
      width: '100%',
    },
  }
  // const treeChange=(value, label, extra)=>{
  //   // console.log(value, label, extra,'value, label, extra');
  // }
  return (
    <div>
      <Button type='primary' onClick={createUser}>+添加角色</Button>
      <DxTree {...dxTreeProps}/>
      <Table columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}/>
      <Modal title='添加权限' visible={createRoleNameStatus}
        onOk={createRoleNameOk} onCancel={createRoleNameCancel}
      >
        <Form>
          <FormItem
            label='姓名'
            {...formItemLayout}
          >
            {getFieldDecorator('name', {
              initialValue:name,
              rules: [
                { required: true, message: '请输入名称' },
              ],
            })(
              <Input type='text' placeholder='请输入名称'/>
            )}
          </FormItem>
          <FormItem
            label='权限'
            {...formItemLayout}
          >
            {getFieldDecorator('power', {
              initialValue:codes,
              rules: [
                { required: true, message: '请选择权限' },
              ],
            })(
              <TreeSelect {...treeSelectProps} labelInValue={true} treeCheckStrictly={false}/>
            )}
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}

function mapStateToProps({jolesManagement}) {
  return {jolesManagement}
}

export default connect(mapStateToProps)(Form.create()(JolesManagement));
