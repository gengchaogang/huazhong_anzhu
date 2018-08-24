import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Link } from 'dva/router'
import {Button,Table,Modal } from 'antd'

import DxTree from '../../../commons/View/DxTree'
import PromptModal from '../../../commons/View/PromptModal'

import OrganizeStructureManagementModal from '../../components/BusinessManagement/OrganizeStructureManagementModal'
import ChangeDepartModal from '../../components/BusinessManagement/ChangeDepartModal'

import SaveEmployee from '../../components/BusinessManagement/SaveEmployee'
import DetailEmployee from '../../components/BusinessManagement/DetailEmployee'

import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow'

import './OrganizeStructureManagement.css'

const noop=()=>{};

const loop=(data, key, callback)=>{
  data.forEach((item, index, arr) => {
    if (item.key === key) {
      return callback(item, index, arr);
    }
    if (item.children) {
      return loop(item.children, key, callback);
    }
  });
};

const toObj=(p)=>{
  var o = {};
  for(var k in p){
    o[k] = p[k];
  }
  return o;
};

function OrganizeStructureManagement({location,dispatch,organizeStructureManagement}) {
  const{
    loading,
    showType,
    treeProps,
    treeData,
    treeSelectItem,
    promptObj,
    saveDeptModelState,
    tableData,
    // treeSelectId,
    tableSelectKeys,
    saveUserModelState,
    userItem,
    changeDepartModal,
  }=organizeStructureManagement;

  const selectDeptItem = treeSelectItem.isLeaf ? treeSelectItem.parent : treeSelectItem;
  console.log('tableData',tableData);
  const modalOkCallBack=(obj)=>{
    if(saveDeptModelState.type=='addBM'){
      dispatch({
        type:'organizeStructureManagement/creatBM',
        payload:obj.bmName,
      });
    }else{
      dispatch({
        type:'organizeStructureManagement/editBM',
        payload:obj.bmName,
      });
    }
  }

  const deleteEmployeeCallBack=()=>{
    if(tableSelectKeys.length==0){
      Modal.warning({
        title: '提示',
        content: '您未选中内容！',
        okText: '关闭',
      });
    }else{
      Modal.confirm({
        title: '提示',
        content: '确认删除选中的人员？',
        okText: '删除',
        cancelText: '取消',
        onOk:()=>{
          dispatch({
            type:'organizeStructureManagement/tryDeleteUsers',
            userIds: tableSelectKeys,
          });
          console.log("delete tableSelectKeys>",tableSelectKeys);
        }
      });
    }
  }
  const deleteBMCallBack=()=>{
    Modal.confirm({
      title: '提示',
      content: '确认删除这个部门？',
      okText: '删除',
      cancelText: '取消',
      onOk:()=>{
        console.log('执行删除');
      }
    });
  }

  const loadTreeData=(treeNode)=>{
    let res;
    const promise = new Promise(r=>{
      res = r;
    });
    dispatch({
      type:`organizeStructureManagement/queryTreeSubItems`,
      payload: {id: treeNode.props.id, title: treeNode.props.title},
      res
    });
    return promise;
    // return Promise.resolve();

    //return new Promise((resolve) => {
      // setTimeout(() => {
      //   const treeData = [...this.state.treeData];
      //   getNewTreeData(treeData, treeNode.props.eventKey, generateTreeNodes(treeNode), 2);
      //   this.setState({ treeData });
      //   resolve();
      // }, 1000);
    //});
  }

  const onTreeSelect = (selectedKeys, e)=>{
    // console.log("selectedKeys>",selectedKeys);
    // console.log("e.node.>",e.node);
    const {isRoot, isDept, id} = e.node.props;
    dispatch({
      type:'organizeStructureManagement/updateBySelectedTreeItem',
      item: {isRoot, isDept, id},
      selected: e.selected,
      // showType: "list"
    });
  };

  let moveItem = {};

  const onDragStart=(info)=>{
    // console.group("onDragStart");
    // console.log("onDragStart>info>",info);
    const {event, node} = info;
    // event.dataTransfer.dropEffect = "null";
    if (node.props.isRoot) {
      event.dataTransfer.effectAllowed = "none";
      // event.dataTransfer.dropEffect = "none";
    }
    moveItem = {
      id: node.props.id,
      isRoot: node.props.isRoot,
      isDept: node.props.isDept,
      isLeaf: node.props.isLeaf,
      parent: node.props.parent,
    };

    // console.log("node.props>",moveItem);
    // console.log("event.dataTransfer>",toObj(event).dataTransfer);
    // console.groupEnd();
    return false;
  };

  const onDragEnter=(info)=>{
    if(moveItem.isRoot)return;
    // console.group("onDragEnter");
    // console.log("onDragEnter>info>",info);

    const {event, node} = info;
    let allow = false;
    if(moveItem.id != node.props.id){
      if(moveItem.isDept){
        if(node.props.isDept && (node.props.parent == moveItem.parent)){
          allow = true;
        }
      }else {
        allow = !node.props.isRoot;
      }
    }

    moveItem.allow = allow;

    // console.log("node.props>",node.props);
    // console.log("event.dataTransfer>",toObj(event).dataTransfer);
    // console.groupEnd();
  };
  const onDragOver=(info)=>{
    if(moveItem.isRoot)return;
    // console.group("onDragOver");
    // console.log("onDragOver>info>",info);
    const {event, node} = info;


    if(!moveItem.allow){
      event.dataTransfer.effectAllowed = "none";
      event.dataTransfer.dropEffect = "none";
    }

    // console.log("event.dataTransfer>",toObj(event).dataTransfer);
    // console.groupEnd();
  };
  const onDragLeave=(info)=>{
    // console.group("onDragLeave");
    // console.log("onDragLeave>info>",info);
    // console.groupEnd();
    return false;
  };
  const onDragEnd=(info)=>{
    // console.group("onDragEnd");
    // console.log("onDragEnd>info>",info);
    const {event, node} = info;
    // for(var key in event){
    //   console.log(key,event[key]);
    // }
    // console.log("node.props>",node.props);
    // console.log("event.dataTransfer>",toObj(event).dataTransfer);
    // console.groupEnd();
    moveItem = null;
  };

  const onDrop=(info)=>{
    if(moveItem.isRoot)return;
    console.group("onDrop");
    // console.log("onDrop>info>",info);
    const {event, node, dragNode, dropToGap} = info;
    const dropKey = node.props.eventKey;
    const dragKey = dragNode.props.eventKey;
    const data = [...treeData];
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      // arr.splice(index, 1);
      dragObj = item;
    });
    // console.log("dragObj>",dragObj);
    if (info.dropToGap) {
      // console.log("info.dropToGap>",info.dropToGap);
      // let ar;
      // let i;
      // loop(data, dropKey, (item, index, arr) => {
      //   ar = arr;
      //   i = index;
      // });
      // ar.splice(i, 0, dragObj);
    } else {
      console.log("dragObj>",dragObj);
      console.log("node.props>",node.props);
      if(!dragObj.isDept && !!node.props.isDept){
        console.log("员工移动到部门");
        // dispatch({
        //   type:'organizeStructureManagement/changeAgentToDepart',
        //   payload:{
        //     departmentId:node.props.id,
        //     agentId:dragObj.id,
        //   }
        // })
      }
      // loop(data, dropKey, (item) => {
      //   item.children = item.children || [];
      //   // where to insert 示例添加到尾部，可以是随意位置
      //   item.children.push(dragObj);
      // });
    }
    // console.log("node.props>",node.props);
    // console.log("event.dataTransfer>",toObj(event).dataTransfer);
    console.groupEnd();
  };

  const onMouseEnter=({event, node})=>{
    var e = toObj(event);
    console.log("event>",e);
    event.target.setAttribute("draggable", false);
    event.target.parentNode.setAttribute("draggable", false);
  };

  const dxTreeProps = {
    treeData: treeData,
    loadData: loadTreeData,
    treeProps: {
      onSelect: onTreeSelect,
      draggable: true,
      onDragStart,
      onDragEnter,
      onDragOver,
      onDragLeave,
      onDragEnd,
      onDrop,
      // onMouseEnter,
      ...treeProps,
    },
  };

  const saveDeptOnOk=({name})=>{
    dispatch({
      type:'organizeStructureManagement/preSaveDept',
      name,
    });
  };
  const saveDeptOnCancel=()=>{
    dispatch({
      type:'organizeStructureManagement/closeModal',
    });
  };
  //编辑部门
  const onEditDeptClick=()=>{
    dispatch({
      type: `organizeStructureManagement/openModal`,
      isUpdate: true,
      item: selectDeptItem
    });
  };
  //添加子部门
  const onAddSubDeptClick=()=>{
    let parent = selectDeptItem;
    const item = {};
    if(!parent.isRoot){
      item.parentId = parent.id;
    }
    dispatch({
      type:`organizeStructureManagement/openModal`,
      isUpdate: false,
      item
    });
  };
  const onAddUserClick=()=>{
    dispatch({
      type: `organizeStructureManagement/prepareAddUser`,
    });
  };
  //删除部门
  const onDeleteDept=()=>{
    Modal.confirm({
      title: '提示',
      content: '确认删除这个部门？',
      okText: '删除',
      cancelText: '取消',
      onOk:()=>{
        dispatch({
          type: `organizeStructureManagement/tryDeleteDept`,
          item: selectDeptItem,
        });
      }
    });
  };
  const onUserNameClick=(item)=>{
    dispatch({
      type: `organizeStructureManagement/getDetailUser`,
      id: item.id
    });
    return false;
  };
  const onActivateClick=()=>{};
  const onTableSelectChange=()=>{};
  const onDeleteEmployeeClick=()=>{};

  const deptProps = {
    visible: false,
    saveDeptModelState: modalProps,
    saveDeptOnOk,
    saveDeptOnCancel,
    // item,
    // isRoot,
    onAddSubDeptClick,
    onEditDeptClick,
    onAddUserClick,
    onDeleteDept,
    onUserNameClick,
    onActivateClick,

    tableData,
    tableSelectKeys,
    onTableSelectChange,
    onDeleteEmployeeClick,
  };

  const onSubmitClick=(values)=>{
    console.log(values);
    dispatch({
      type:'organizeStructureManagement/trySaveUser',
      values: values,
    });
  };

  const onBackClick=(isUpdate)=>{
    dispatch({
      type:'organizeStructureManagement/updateBySelectedTreeItem',
      item: selectDeptItem,
      selected: true,
    });
  };

  const onSaveBackClick=(isUpdate)=>{
    if(isUpdate){
      dispatch({
        type:'organizeStructureManagement/getDetailUser',
        id: userItem.id,
      });
    }else {
      dispatch({
        type:'organizeStructureManagement/updateBySelectedTreeItem',
        item: selectDeptItem,
        selected: true,
      });
    }
  };


  const onActiveButtonClick=(item)=>{
    console.log('item',item);
    dispatch({
      type:'organizeStructureManagement/tryActive',
      id: item.id,
    });
    console.log('active', item);
  };

    const onResetOptPwdClick=()=>{
      dispatch({
        type:'organizeStructureManagement/tryResetUserOptPassword',
        item: userItem,
      });
    };
    const onResetLoginPwdClick=()=>{
      dispatch({
        type:'organizeStructureManagement/tryResetUserLoginPassword',
        item: userItem,
      });
    };
    const onEditUserClick=()=>{
      dispatch({
        type:'organizeStructureManagement/prepareUpdateUser',
        id: userItem.id,
      });
    };
    const onDeleteUserClick=()=>{
      dispatch({
        type:'organizeStructureManagement/tryDeleteUser',
        item: userItem,
      });
    };

  const modalProps={
    visible: saveDeptModelState.visible,
    title: saveDeptModelState.item.id ? '编辑部门':'添加子部门',
    item: saveDeptModelState.item,
    onOk: saveDeptOnOk,
    //onOk:modalOkCallBack,
    onCancel: saveDeptOnCancel,
    // onCancel:()=>{
    //   dispatch({
    //     type:`organizeStructureManagement/closeModal`,
    //   });
    // },
  }


  const tableProps={
    visible: showType=="list",
    columns:[
      {
        title: '姓名',
        dataIndex: 'name',
        // render:(obj)=><Link to={{pathname:'/businessManagement/employeeInformation',state:{employeeId:obj.id}}}>{obj.name}</Link>
        render: (value, obj)=><Link onClick={()=>{onUserNameClick(obj)}}>{value}</Link>
      },{
        title: '职位',
        dataIndex: 'position',
      },{
        title: '工号',
        dataIndex: 'number',
      },{
        title: '手机号',
        dataIndex: 'phone',
      },{
        title: '邮箱',
        dataIndex: 'email',
      },{
        title: '操作',
        dataIndex: 'operation',
        render:(value,obj)=><div>
        {!!obj.isLogin && ''}
        {(obj.isLogin===false) && <Button type='primary' onClick={()=>{onActiveButtonClick(obj)}}>激活</Button>}
      </div>
      }
    ],
    dataSource:tableData,
    pagination:false,
    rowSelection:{
      selectedRowKeys:tableSelectKeys,
      onChange: (selectedRowKeys)=>{
        dispatch({
          type:'organizeStructureManagement/tableSelectChange',
          payload:selectedRowKeys,
        })
      },
    },
    title:()=><div className='organizeStructureManagement_tableTitle'><span>部门人员</span><Button onClick={deleteEmployeeCallBack} size='small' className='anzhu_redButton'>{`${tableSelectKeys.length>1?'批量':''}删除`}</Button></div>,
  }

  const createEmployeeProps = {
    visible: showType=="save",
    isUpdate: saveUserModelState.isUpdate,
    onSubmitClick,
    onBackClick: onSaveBackClick,
    groups:saveUserModelState.groups,
    item: saveUserModelState.item,
  };

  const detailEmployeeProps={
    visible: showType=="detail",
    userItem,
    noGoback: treeSelectItem.isLeaf,
    onBackClick,
    onResetOptPwdClick,
    onResetLoginPwdClick,
    onEditUserClick,
    onDeleteUserClick,
    changeAgentDepartCallBack:()=>dispatch({
      type:'organizeStructureManagement/openChangeDepartModal',
    })
  };

  const getDeleteDeptProps = ()=>{
    const item = treeSelectItem;
    if(!item.id || item.isRoot || item.isLeaf || item.children && item.children.length || item.count > 0){
      return {disabled: true};
    }
    return {onClick: onDeleteDept};
  };
  const changeDepartModalProps = {
    ...changeDepartModal,
    onOk:(v)=>dispatch({
      type:'organizeStructureManagement/changeAgentToDepart',
      payload:v,
    }),
    onCancel:()=>dispatch({
      type:'organizeStructureManagement/closeChangeDepartModal',
    })
  }
  return (
    <div className='organizeStructureManagement'>
      <DxLoadingShadow visible={loading>0} zIndex={1001}/>
      <ChangeDepartModal {...changeDepartModalProps}/>
      <PromptModal {...promptObj} onOk={()=>{
          dispatch({
            type:'organizeStructureManagement/switchPrompt',
            payload:{
              visible:false,
              // onOk:()=>{},
            },
          });
        }}  onCancel={()=>{}}/>
      <div className='organizeStructureManagement_left'>
        <DxTree {...dxTreeProps}/>
      </div>
      <div className='organizeStructureManagement_right'>
        <OrganizeStructureManagementModal {...modalProps}/>
        <span className='operationObjectName'>{selectDeptItem.name}</span>
        <div className='button_group'>
          <div className='anzhu_buttonGroup'>
            <Button type='primary' onClick={onEditDeptClick} disabled={!treeSelectItem.id || treeSelectItem.isRoot || treeSelectItem.isLeaf}>编辑部门</Button>
            <Button type='primary' onClick={onAddSubDeptClick} disabled={!treeSelectItem.id || treeSelectItem.isLeaf}>添加子部门</Button>
            <Button type='primary' onClick={onAddUserClick} disabled={!treeSelectItem.id || treeSelectItem.isRoot || treeSelectItem.isLeaf}>添加成员</Button>
            <Button type='primary' {...getDeleteDeptProps()}>删除部门</Button>
          </div>
        </div>
        <Table {...tableProps} style={{display: !tableProps.visible?'none':'block'}}/>
        <SaveEmployee {...createEmployeeProps}/>
        <DetailEmployee {...detailEmployeeProps}/>
      </div>
    </div>
  );
}
OrganizeStructureManagement.propTypes = {
  organizeStructureManagement:PropTypes.object.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}
function mapStateToProps({organizeStructureManagement}) {
  return {organizeStructureManagement};
}

export default connect(mapStateToProps)(OrganizeStructureManagement)
