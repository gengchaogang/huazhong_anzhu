import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import {Button,Table,Modal}from 'antd'
import DxPanel from '../../../commons/components/DxPanel'
import PromptModal from '../../../commons/View/PromptModal'
import RoleManagementModal from '../../components/BusinessManagement/RoleManagementModal'

import './RoleManagement.css'

const RoleManagement=({location,dispatch,roleManagement})=>{
  const {tableData,treeData,loading,modalState,tableSelectKeys,promptObj}=roleManagement;
  const deleteRoleCallBack=()=>{
    if(tableSelectKeys.length==0){
      Modal.warning({
        title: '提示',
        content: '您未选中内容！',
        okText: '关闭',
      });
    }else{
      Modal.confirm({
        title: '提示',
        content: '确认删除选中的角色？',
        okText: '删除',
        cancelText: '取消',
        onOk:()=>{
          dispatch({
            type:'roleManagement/tryDelete',
          })
        }
      });
    }
  }
  const editRoleCallBack=(id)=>{
    console.log('id',id);
    dispatch({
      type:'roleManagement/tableSelectChange',
      payload:[id],
    })
    dispatch({
      type:'roleManagement/preShowEditModel',
      id: id,
    })
  }
  console.log('tableData',tableData);
  const tableProps={
    columns:[
      {
        title: '角色名',
        dataIndex: 'name',
        // render:(obj)=>obj.name,
      },
      // {
      //   title: '角色权限',
      //   dataIndex: 'permissions',
      //   className:'roolItems',
      //   render:(arr)=>arr.map((item)=><span key={item.code} className='permissions'>{item.name}</span>),
      // },
      {
        title: '用户列表',
        dataIndex: 'employees',
        className:'roolItems',
        render:(arr)=>arr.map((item,index)=><span key={`${item.name}_${index}`}>{item}</span>),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render:(id)=><Button className='anzhu_button' onClick={()=>editRoleCallBack(id)}>编辑</Button>
      }
    ],
    dataSource:tableData,
    pagination:false,
    loading,
    rowSelection:{
      selectedRowKeys:tableSelectKeys,
      onChange: (selectedRowKeys)=>{
        dispatch({
          type:'roleManagement/tableSelectChange',
          payload:selectedRowKeys,
        })
      },
    },
    title:()=><div className='roleManagement_tableTitle'><span>角色列表</span><Button onClick={deleteRoleCallBack} size='small' className='anzhu_redButton'>{`${tableSelectKeys.length>1?'批量':''}删除`}</Button></div>,
  }
  const modalOkCallBack=({name,permissions})=>{
    dispatch({
      type:`roleManagement/preSaveGroup`,
      payload: {name,permissions}
    });
  }
  const modalProps={
    visible:modalState.visible,
    treeData,
    title:modalState.type=='addRole'?'添加角色':'编辑角色',
    item:modalState.item||{},
    onOk:modalOkCallBack,
    onCancel:()=>{
      dispatch({
        type:`roleManagement/closeModal`,
      });
    },
  }
  console.log("update view");
  return (
    <div className='roleManagement'>
      <PromptModal {...promptObj} onOk={()=>{
          dispatch({
            type:'roleManagement/switchPrompt',
            payload:{
              visible:false,
              onOk:()=>{},
            },
          });
        }} onCancel={()=>{}}/>
      <DxPanel title='角色管理'>
        <RoleManagementModal {...modalProps}/>
        <Button type='primary' onClick={()=>dispatch({
            type:'roleManagement/initModal',
            payload:{
              type: 'addRole',
              item: {},
              activeId: 0
            },
          })}>添加角色</Button>
        <Table {...tableProps}/>
      </DxPanel>
    </div>
  );
}
RoleManagement.propTypes = {
  roleManagement:PropTypes.object.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}
function mapStateToProps({roleManagement}) {
  return {roleManagement};
}

export default connect(mapStateToProps)(RoleManagement)
