import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import {message,Table,Form,Checkbox,Tree,Row,Col,Button,Modal,
  Input,Select}from 'antd'
import './PersonnelManage.css';
import notexist from '../../assets/images/notexist.png'
import DxTree from '../../../commons/View/DxTree'
import DxPanel from '../../../commons/components/DxPanel'
const CheckboxGroup = Checkbox.Group;
const Option=Select.Option;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
function PersonnelManage({dispatch,personnelManage,form}) {
  const {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }=form;
  const {treeData,treeProps,
    dataSource,name,id,type,addMemberStatus,editBMStatus,
    addBMStatus,selectedArr,bMidArr,roleNameArr,adjustmentStatus,
    selectedRowKeys,loading,total,pageNo,
  }=personnelManage;
  const onTreeSelect=(selectedKeys, e)=>{
    const {isRoot, isDept, id ,name} = e.node.props;
    // console.log(,'selectedKeys');
    const selectId=e.node.props.id;
    let types='';
    if(selectedKeys=='root'){
      types='root'
    }else if(selectedKeys.length!=0){
      types=selectedKeys[0].split('_')[0];
    }
    dispatch({
      type:'personnelManage/initail',
      payload:{name:name,id:selectId,type:types}
    })
    if(selectId=='root'){
      dispatch({type:'personnelManage/initail',payload:{loading:true}})
      dispatch({
        type:'personnelManage/findAll',
      });
    }else{
      let isdept='';
      if(selectedKeys.length!=0){
        isdept=selectedKeys[0].split('_')[0]
      }
      if(isdept=='dept'){
        dispatch({type:'personnelManage/initail',payload:{loading:true}})
        dispatch({
          type:'personnelManage/updateBySelectedTreeItem',
          payload:{
            id:selectId,
            name:name,
          }
        });
      }else if(isdept=='user'){
        dispatch({type:'personnelManage/initail',payload:{loading:true,pageNo:1}})
        dispatch({
          type:'personnelManage/findUersTable',
          payload:{id:selectId}
        })
      }
    }
  }

  const loadTreeData=(treeNode)=>{
    let res;
    const promise = new Promise(r=>{
      res = r;
    });
    dispatch({
      type:`personnelManage/queryTreeSubItems`,
      payload: {id: treeNode.props.id, title: treeNode.props.title},
      res
    });
    return promise;

  }
  const dxTreeProps = {
    treeData: treeData,
    loadData: loadTreeData,
    treeProps: {
      onSelect: onTreeSelect,
      // draggable: true,
      // onDragStart,
      // onDragEnter,
      // onDragOver,
      // onDragLeave,
      // onDragEnd,
      // onDrop,
      // // onMouseEnter,
      ...treeProps,
    },
  };
  const columns=[
    // {
    //   title:'头像',
    //   dataIndex:'url',
    //   render:text=>{
    //     if(text){
    //       return <span className='feedbackUrl' style={{backgroundImage:`URL(${text})`}}></span>
    //     }else{
    //       return <span className='personnelManageUrl' style={{backgroundImage:`URL(${notexist})`}}></span>
    //     }
    //   }
    // },
    {
      title:'帐号',
      dataIndex:'loginName'
    },
    {
      title:'真实姓名',
      dataIndex:'name'
    },
    {
      title:'手机号码',
      dataIndex:'phoneNumber',
    },
    {
      title:'员工角色',
      dataIndex:'role',
    }
  ]
  //添加成员
  const addMember=()=>{
    dispatch({
      type:'personnelManage/addBeforeSearch',
    })
    dispatch({
      type:'personnelManage/initail',
      payload:{addMemberStatus:true}
    })
  }
  //确定添加成员并继续添加
  const addMemberOk=()=>{
    form.validateFields((err,values)=>{
      dispatch({
        type:'personnelManage/initail',
        payload:{loading:true}
      })
      dispatch({
        type:'personnelManage/addMemberAndadd',
        payload:{
          departmentId:values.departmentId,
          loginName:values.loginName,
          name:values.name,
          password:values.password,
          phoneNumber:values.phoneNumber,
          roleId:values.roleIds,
        }
      })
    })
    form.resetFields();
  }
  //添加员工后直接关闭模态框
  const addEmployeesAndCancel=()=>{
    form.validateFields((err,values)=>{
      dispatch({
        type:'personnelManage/initail',
        payload:{loading:true}
      })
      dispatch({
        type:'personnelManage/addEmployeesAndCancel',
        payload:{
          departmentId:values.departmentId,
          loginName:values.loginName,
          name:values.name,
          password:values.password,
          phoneNumber:values.phoneNumber,
          roleId:values.roleIds,
        }
      })
    })
    form.resetFields();
  }
  //关闭添加成员模态框
  const addMemberCancel=()=>{
    dispatch({
      type:'personnelManage/initail',
      payload:{loading:true}
    })
    dispatch({type:'personnelManage/findAll'})
    form.resetFields();
  }
  //编辑部门名字
  const editBM=()=>{
    dispatch({
      type:'personnelManage/initail',
      payload:{
        editBMStatus:true,
      }
    })
  }
  //确定编辑部门名字
  const editBMok=()=>{
    form.validateFields((err,values)=>{
      if(values.bmName){
        dispatch({
          type:'personnelManage/initail',
          payload:{loading:true}
        })
        dispatch({
          type:'personnelManage/editBMok',
          payload:{
            id:id,
            name:values.bmName,
          }
        })
      }else{
        message.error('请输入需要编辑的名字');
      }
    })
    form.resetFields();
  }
  const editBMcancel=()=>{
    dispatch({type:'personnelManage/initail',payload:{editBMStatus:false}});
    form.resetFields();
  }
  //删除部门
  const deleteBM=()=>{
    Modal.confirm({
      title:'删除',
      content: '确定要删除吗',
      onOk() {
        dispatch({
          type:'personnelManage/initail',
          payload:{loading:true}
        })
        dispatch({
          type:'personnelManage/deleteBM',
          payload:{
            id:id,
          }
        })
      },
      onCancel() {},
    });
  }
  const addChildBM=()=>{
    dispatch({
      type:'personnelManage/initail',
      payload:{addBMStatus:true},
    })
  }
  const addBMok=()=>{
    form.validateFields((err,values)=>{
      if(err){
        return message.error('请填写名称')
      }
      if(id=='' || id=='root'){
        dispatch({
          type:'personnelManage/initail',
          payload:{loading:true}
        })
        dispatch({
          type:'personnelManage/addBMok',
          payload:{
            name:values.addBmName,
          }
        })
      }else{
        dispatch({
          type:'personnelManage/initail',
          payload:{loading:true}
        })
        dispatch({
          type:'personnelManage/addBMok',
          payload:{
            name:values.addBmName,
            parentId:id,
          }
        })
      }
    })
    form.resetFields();
  }
  const addBMcancel=()=>{
    dispatch({
      type:'personnelManage/initail',
      payload:{addBMStatus:false},
    })
    form.resetFields();
  }
  const rowSelection={
    selectedRowKeys:selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows,selected) => {
      // console.log(selectedRowKeys,'selectedRowKeys');
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      const selectedArrs=[];
      if(selectedRows.length!==0){
        selectedRows.map((item,index)=>(
          selectedArrs.push(item.key)
        ))
      }
      dispatch({
        type:'personnelManage/initail',
        payload:{
          selectedArr:selectedArrs,
          selectedRowKeys:selectedRowKeys,
        }
      })
    },
  }
  //调整部门
  const adjustmentDepartment=()=>{
    dispatch({
      type:'personnelManage/adjustmentDepartment',
    })
  }
  //确定调整部门
  const adjustmentOk=()=>{
    form.validateFields((err,values)=>{
      dispatch({
        type:'personnelManage/initail',
        payload:{loading:true}
      })
      dispatch({
        type:'personnelManage/adjustmentOk',
        payload:{
          departmentId:values.choseId,
          ids:selectedArr,
        }
      })
    })
    form.resetFields();
  }
  //关闭调整部门
  const adjustmentCancel=()=>{
    dispatch({
      type:'personnelManage/initail',
      payload:{loading:true}
    })
    dispatch({type:'personnelManage/initail',
      payload:{adjustmentStatus:false}
    });
    form.resetFields();
  }
  //删除成员
  const deleteMember=()=>{
    dispatch({
      type:'personnelManage/initail',
      payload:{loading:true}
    })
    Modal.confirm({
      title: '提示',
      content: '确定要删除？',
      onOk() {
        dispatch({
          type:'personnelManage/deleteMember',
          payload:{
            ids:selectedArr,
          }
        })
      },
      onCancel() {
        dispatch({
          type:'personnelManage/initail',
          payload:{loading:false}
        })
      },
    });
  }
  //分页
  const pagination={
    total:total,
		showTotal:total => `共 ${total} 项`,
		// pageSize:2,
    current:pageNo,
		onChange:(page)=>{
      // console.log(page,id,type,'type');
      dispatch({type:'personnelManage/initail',
        payload:{loading:true}
      })
      if(type=='root'){
        dispatch({
          type:'personnelManage/findAll',
          payload:{
            pageNo:page-1,
          }
        })
      }else if(type=='dept'){
        dispatch({
          type:'personnelManage/updateBySelectedTreeItem',
          payload:{pageNo:page-1,id:id}
        })
      }else{
        dispatch({
          type:'personnelManage/initail',
          payload:{total:1,pageNo:1}
        })
      }
      // dispatch({
      //   type:'personnelManage/pagination',
      //   payload:{
      //     pageNo:page-1,
      //     pageSize:2,
      //   }
      // })
    },
  }
	return(
		<div className='personnelManage'>
      <Row>
        <Col span={5}>
          <div className='personnelManageDxTree'>
            <DxTree{...dxTreeProps}/>
          </div>
        </Col>
        <Col span={19}>
          <div className='personnelManageRight'>
            <div className='personnelManageBottom'>
              <span className='personnelManageBM'>{name}</span>
              {type=='root' || type=='user'?
                <div className='rootBm'>
                  <Button type='ghost' disabled>编辑</Button>
                  <Button type='ghost' disabled>删除部门</Button>
                </div>
                :
                <div className='rootBm'>
                  <Button type='primary' onClick={editBM}>编辑</Button>
                  <Button type='primary' onClick={deleteBM}>删除部门</Button>
                </div>
              }
              {type=='user'?<Button type='ghost' disabled>添加子部门</Button>:
              <Button type='primary' onClick={addChildBM}>添加子部门</Button>}
            </div>
            <div>
              {type=='root' || type=='user'?<Button type='ghost' disabled>添加成员</Button>:
              <Button type='primary' onClick={addMember}>添加成员</Button>}

              {selectedArr.length==0?<div className='rootBm'>
                <Button type='ghost' disabled>删除成员</Button>
                <Button type='ghost' disabled>调整部门</Button>
              </div>:
              <div className='rootBm'>
                <Button type='primary' onClick={deleteMember}>删除成员</Button>
                <Button type='primary' onClick={adjustmentDepartment}>调整部门</Button>
              </div>
              }
            </div>
            <Table columns={columns} dataSource={dataSource}
              rowSelection={rowSelection} loading={loading}
              pagination={type=='user'?false:pagination}
            />
          </div>
        </Col>
      </Row>
      <Form>
      {/*添加员工*/}
      <Modal title='添加' onOk={addMemberOk}
        visible={addMemberStatus}
        onCancel={addMemberCancel}
        okText="保存并继续添加" cancelText="取消"
      >
        <FormItem label='员工角色'
          {...formItemLayout}
        >
          {getFieldDecorator('roleIds', {
          })(
            <Select style={{width:'284px'}}>
              {!!roleNameArr && roleNameArr.map((item,index)=>(
                <Option key={item.roleIds} value={item.roleIds.toString()}>{item.name}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label='登录帐号'
          {...formItemLayout}
        >
          {getFieldDecorator('loginName', {
          })(
            <Input placeholder='英文、数字和组合，三位以上'/>
          )}
        </FormItem>
        <FormItem label='登录密码'
          {...formItemLayout}
        >
          {getFieldDecorator('password', {
          })(
            <Input type='password'/>
          )}
        </FormItem>
        <FormItem label='选择部门'
          {...formItemLayout}
        >
          {getFieldDecorator('departmentId', {
          })(
            <Select style={{width:'284px'}}>
              {!!bMidArr && bMidArr.map((item,index)=>(
                <Option key={item.departmentId} value={item.departmentId.toString()}>{item.name}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label='真实姓名'
          {...formItemLayout}
        >
          {getFieldDecorator('name', {
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem label='手机号码'
          {...formItemLayout}
        >
          {getFieldDecorator('phoneNumber', {
          })(
            <Input/>
          )}
        </FormItem>
        <div className='saveUser'>
          <Button type='primary' onClick={addEmployeesAndCancel}>保存</Button>
        </div>
      </Modal>
      {/*编辑部门名称的模态框*/}
      <Modal title='编辑' onOk={editBMok}
        visible={editBMStatus}
        onCancel={editBMcancel}
      >
        <FormItem label='名称' {...formItemLayout}>
          {getFieldDecorator('bmName', {
            initialValue:name,
          })(
            <Input type='text'/>
          )}
        </FormItem>
      </Modal>
      {/*添加部门的模态框*/}
      <Modal title='添加' onOk={addBMok}
        visible={addBMStatus}
        onCancel={addBMcancel}
      >
        <FormItem label='名称' {...formItemLayout}>
          {getFieldDecorator('addBmName', {
            rules: [
              { required: true, message: '必填' },
            ],
          })(
            <Input type='text'/>
          )}
        </FormItem>
      </Modal>
      {/*调整部门*/}
      <Modal title='调整部门' onOk={adjustmentOk}
        onCancel={adjustmentCancel} visible={adjustmentStatus}
      >
        <FormItem label='选择部门'
          {...formItemLayout}
        >
          {getFieldDecorator('choseId', {
          })(
            <Select style={{width:'284px'}}>
              {!!bMidArr && bMidArr.map((item,index)=>(
                <Option key={item.departmentId} value={item.departmentId.toString()}>{item.name}</Option>
              ))}
            </Select>
          )}
        </FormItem>
      </Modal>
      </Form>
		</div>
	)
}


PersonnelManage.propTypes = {

};
function mapStateToProps({ personnelManage}) {
	return { personnelManage }
}

export default connect(mapStateToProps)(Form.create()(PersonnelManage))
