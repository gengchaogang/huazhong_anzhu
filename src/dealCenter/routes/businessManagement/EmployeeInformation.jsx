import React, { PropTypes } from 'react';
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Link } from 'dva/router'

import { Button ,Table,Modal} from 'antd'

import DxPanel from '../../../commons/components/DxPanel'
import PromptModal from '../../../commons/View/PromptModal'

import './EmployeeInformation.css'

const EmployeeInformation = ({location,dispatch,employeeInformation})=>{
  const {loading,data,employeeId,promptObj}=employeeInformation;
  const columns = [
    {
      title: '描述',
      dataIndex: 'name',
      key: 'name',
      width:'30%',
    },{
      title: '值',
      dataIndex: 'value',
      key: 'value',
      width:'70%',
    }
  ];
  const reSetOperatPassWord=()=>{
    Modal.warning({
      title: '提示',
      content: '密码重置成功，请联系用户再次登录，修改初始密码。初始密码[88888888]',
      okText: '知道了',
    });
  }
  const confirmModal=(type)=>{
    if(type=='reSetOperatPassWord'){
      Modal.confirm({
        title: '提示',
        content: '确认重置该员工的操作密码？',
        okText: '重置',
        cancelText: '取消',
        onOk:()=>{
          console.log('执行重置');
        }
      });
    }else if(type=='reSetLoginPassWord'){
      Modal.confirm({
        title: '提示',
        content: '确认重置该员工的登录密码？',
        okText: '重置',
        cancelText: '取消',
        onOk:()=>{
          console.log('执行重置');
        }
      });
    }else if(type=='delete'){
      Modal.confirm({
        title: '提示',
        content: '确认删除该员工？',
        okText: '删除',
        cancelText: '取消',
        onOk:()=>{
          console.log('执行删除');
        }
      });
    }
  }
  return(
    <div className='employeeInformation'>
      <PromptModal {...promptObj} onOk={()=>{
          dispatch({
            type:'employeeInformation/switchPrompt',
            payload:{
              visible:false,
              onOk:()=>{},
            },
          });
        }}/>
      <DxPanel title='员工信息'>
        <Table pagination={false} loading={loading} dataSource={data} columns={columns} showHeader={false} size='small'/>
        <div className='employeeInformation_footer'>
          <Button type='ghost' onClick={()=>{confirmModal('reSetOperatPassWord')}}>操作密码重置</Button>
          <Button type='ghost' onClick={()=>{confirmModal('reSetLoginPassWord')}}>登录密码重置</Button>
          <Button className='anzhu_redButton' onClick={()=>{confirmModal('delete')}}>删除员工</Button>
          <Button type='primary' onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
        </div>
      </DxPanel>
    </div>
  )
};

EmployeeInformation.propTypes = {
  employeeInformation:PropTypes.object.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}
function mapStateToProps({employeeInformation}) {
  return {employeeInformation};
}

export default connect(mapStateToProps)(EmployeeInformation)
