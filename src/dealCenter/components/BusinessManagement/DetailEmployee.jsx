import React, { PropTypes } from 'react';
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Link } from 'dva/router'

import { Form,Input,Row,Col,Button ,Table,Modal} from 'antd'

import DxPanel from '../../../commons/components/DxPanel'

import './DetailEmployee.css'

const noop=()=>{};
const getName = ({name})=>name;

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const DetailEmployee = ({
  visible,
  userItem={},
  noGoback,
  data=[],
  onBackClick=noop,
  onResetOptPwdClick=noop,
  onResetLoginPwdClick=noop,
  onEditUserClick=noop,
  onDeleteUserClick=noop,
  changeAgentDepartCallBack=noop,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },
})=>{
  if(!visible) return null;
  console.log("DetailEmployee>userItem>",userItem);
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

  const comfirmResetOptPwd=()=>{
    Modal.confirm({
      title: '提示',
      content: '确认重置该员工的操作密码？',
      okText: '重置',
      cancelText: '取消',
      onOk:()=>{
        onResetOptPwdClick(userItem);
      }
    });
  };
  const comfirmResetLoginPwd=()=>{
    Modal.confirm({
      title: '提示',
      content: '确认重置该员工的登陆密码？',
      okText: '重置',
      cancelText: '取消',
      onOk:()=>{
        onResetLoginPwdClick(userItem);
      }
    });
  };
  const comfirmDelete=()=>{
    Modal.confirm({
      title: '提示',
      content: '确认删除该员工？',
      okText: '删除',
      cancelText: '取消',
      onOk:()=>{
        onDeleteUserClick(userItem);
      }
    });
  };
  const preEdit=()=>{
    onEditUserClick(userItem);
  };
  const backClick=()=>{
    onBackClick();
  };
  const changeAgentDepart=()=>{
    changeAgentDepartCallBack();
  }
  return(
    <div className='employeeInformation' style={{display: !visible?'none':'block'}}>
      <DxPanel title='员工信息'>
        <Form horizontal>
          <Row>
            <Col sm={24} md={12}>
              <FormItem
                label='员工姓名：'
                hasFeedback
                {...formItemLayout}
              >
                <label>{userItem.name}</label>
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <FormItem
                label='员工工号：'
                hasFeedback
                {...formItemLayout}
              >
              <label>{userItem.number}</label>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={12}>
              <FormItem
                label='手机号：'
                hasFeedback
                {...formItemLayout}
              >
                <label>{userItem.phone}</label>
              </FormItem>
            </Col>
              <Col sm={24} md={12}>
                <FormItem
                  label='职位：'
                  hasFeedback
                  {...formItemLayout}
                >
                  <label>{userItem.position}</label>
                </FormItem>
              </Col>
          </Row>
          <Row>
            <Col sm={24} md={12}>
              <FormItem
                label='分机号：'
                hasFeedback
                {...formItemLayout}
              >
                <label>{userItem.extensionNumber}</label>
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <FormItem
                {...formItemLayout}
                label='邮箱：'
                hasFeedback
              >
                <label>{userItem.email}</label>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={12}>
              <FormItem
                label='办公地址：'
                hasFeedback
                {...formItemLayout}
              >
                <label>{userItem.officeAddress}</label>
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <FormItem
                label='备注：'
                hasFeedback
                {...formItemLayout}
              >
                <label>{userItem.comments}</label>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={12}>
              <FormItem
                {...formItemLayout}
                label='权限组：'
              >
                <label>{(userItem.groupItems || []).map(getName)}</label>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div className='employeeInformation_footer'>
          <Button type='ghost' disabled={!userItem.needOptPwd} onClick={comfirmResetOptPwd}>操作密码重置</Button>
          <Button type='ghost' onClick={comfirmResetLoginPwd}>登录密码重置</Button>
          <Button type='ghost' onClick={preEdit}>编辑员工信息</Button>
          <Button type='ghost' onClick={changeAgentDepart}>调整员工所属部门</Button>
          <Button type='ghost' onClick={comfirmDelete}>删除员工</Button>
          {noGoback?null:<Button type='primary' onClick={backClick}>返回</Button>}
        </div>
      </DxPanel>
    </div>
  )
};

DetailEmployee.propTypes = {
  visible:PropTypes.bool,
  userItem: PropTypes.object,
  onResetOptPwdClick: PropTypes.func,
  onResetLoginPwdClick: PropTypes.func,
  onEditUserClick: PropTypes.func,
  onDeleteUserClick: PropTypes.func,
  onBackClick: PropTypes.func,
}

export default Form.create()(DetailEmployee)
