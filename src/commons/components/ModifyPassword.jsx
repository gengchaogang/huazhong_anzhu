import React, { Component, PropTypes } from 'react'
import {Input,Row,Col,Form,Button,Modal} from 'antd';
const FormItem = Form.Item;

import './ModifyPassword.css'
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
class ModifyPassword extends React.Component {
  constructor(props){
    super(props);
    this.state={
    }
  }
  submitPsw=()=>{
    const {
      okCallBack,
      form:{
        getFieldsValue,
        validateFields,
      }
    }=this.props;
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = { ...getFieldsValue()};
      okCallBack(data)
    });
  }
  checkPassword=(rule,value,callback)=> {
    const form=this.props.form;
    if (value && value !== form.getFieldValue('newPsw')) {
      callback('新密码前后不一致！');
    }else{
      callback();
    }
  }
  render(){
    const{
      title,
      visible,
      confirmLoading,
      okCallBack,
      onCancelCallBack,
      form:{
        getFieldDecorator,
        resetFields,
      },
    }=this.props;
    return(
      <Modal visible={visible} title={!!title?title:'修改密码'} afterClose={()=>resetFields()} confirmLoading={confirmLoading} onOk={this.submitPsw} onCancel={onCancelCallBack} okText='修改密码'>
        <Form>
          <FormItem
            label='原始密码'
            {...formItemLayout}>
            {getFieldDecorator('oldPsw', {
              rules: [
                { required: true, message: '原始密码未输入' },
              ],
            })(
              <Input type='passWord' placeholder='请在此输入原始密码'/>
            )}
          </FormItem>
          <FormItem
            label='新密码'
            {...formItemLayout}>
            {getFieldDecorator('newPsw', {
              rules: [
                { required: true, message: '原始密码未输入' },
                { min:6, message: '密码过短' },
                { max:12, message: '密码过长' },
                {validator: this.checkPassword},
              ],
            })(
              <Input type='passWord' placeholder='请在此输入新密码'/>
            )}
          </FormItem>
          <FormItem
            label='确认密码'
            {...formItemLayout}>
            {getFieldDecorator('confirmPsw', {
              rules: [
                { required: true, message: '确认密码未输入' },
                { min:6, message: '密码过短' },
                { max:12, message: '密码过长' },
                {validator: this.checkPassword},
              ],
            })(
              <Input type='passWord' placeholder='请再次输入新密码'/>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
export default Form.create()(ModifyPassword);
