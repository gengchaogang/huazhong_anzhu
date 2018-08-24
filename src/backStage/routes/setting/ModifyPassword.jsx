import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input,Table,Button,Select} from 'antd';
import DxPanel from '../../../commons/components/DxPanel'
import './ModifyPassword.css'
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 6},
};
function ModifyPassword({dispatch,form ,modifyPassword}) {
  const {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }=form;
  const {confirmDirty}=modifyPassword;
  const editPasswordClick=()=>{
    form.validateFields((err,values)=>{
      if(err){
        return
      }
      dispatch({
        type:'modifyPassword/editPasswordClick',
        payload:{
          confirmPassword:values.confirmPassword,
          oldPassword:values.oldPassword,
          password:values.password,
        }
      })
    })
  }
  const resetClick=()=>{
    resetFields();
  }
  const handleConfirmBlur = (e) => {
    const value = e.target.value;
    dispatch({
      type:'modifyPassword/initail',
      payload:{
        confirmDirty:(confirmDirty || !!value)
      }
    })
    // this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  const checkPassword = (rule, value, callback) => {
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一样');
    } else {
      callback();
    }
  }
  const checkConfirm = (rule, value, callback) => {
    if (value && confirmDirty) {
      form.validateFields(['confirmPassword'], { force: true });
    }
    callback();
  }
  return (
    <div>
      <Form>
        <FormItem
          label='请输入原密码'
          hasFeedback
          {...formItemLayout}
        >
          {getFieldDecorator('oldPassword', {
            validateTrigger: 'onBlur',
          })(
            <Input type='password'/>
          )}
        </FormItem>
        <FormItem
          label='请输入新密码'
          hasFeedback
          {...formItemLayout}
        >
          {getFieldDecorator('password', {
            validateTrigger: 'onBlur',
            rules: [
              { type:'string',pattern:/^[a-zA-Z0-9]{6,18}$/, message: '6-18位 数字、字母或组合' },
              {validator:checkConfirm}
            ],
          })(
            <Input type='password' placeholder='6-18位 数字、字母或组合'/>
          )}
        </FormItem>
        <FormItem
          label='再次输入新密码'
          hasFeedback
          {...formItemLayout}
        >
          {getFieldDecorator('confirmPassword', {
            validateTrigger: 'onBlur',
            rules: [
              { type:'string',pattern:/^[a-zA-Z0-9]{6,18}$/, message: '6-18位 数字、字母或组合' },
              {validator:checkPassword}
            ],
          })(
            <Input type='password' placeholder='6-18位 数字、字母或组合'/>
          )}
        </FormItem>
        <div className='buttonPsd'>
          <Button onClick={editPasswordClick} type="primary">保存</Button>
          <Button type='ghost' onClick={resetClick}>重置</Button>
        </div>
  		</Form>
    </div>
  );
}

function mapStateToProps({modifyPassword}) {
  return {modifyPassword }
}

export default connect(mapStateToProps)(Form.create()(ModifyPassword));
