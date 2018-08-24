import React from 'react';
import {connect} from 'dva';
import {Form,Row,Col,Input,Button,Alert} from 'antd'
import PromptModal from '../../commons/View/PromptModal'
import {routerRedux} from 'dva/router'
import './accountSetting.css'
const FormItem=Form.Item;
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 7 },
};
const formItemLayout1 = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
function AccountSetting({dispatch,accountSetting,form}){
  const {
    confirmDirty,
    promptObj,
  }=accountSetting;
  const {getFieldDecorator}=form;
  const handleConfirmBlur = (e) => {
    const value = e.target.value;
    dispatch({
      type:"accountSetting/changeConfirmDirty",
      payload:{
        confirmDirty:false
      }
    })
  }
  const checkConfirm=(rule, value, callback)=>{
    if (value && confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }
const checkPassword = (rule, value, callback) => {
  if (value && value !== form.getFieldValue('password')) {
    callback('两次输入的密码不一致!');
  } else {
    callback();
  }
}
const handleSubmit=(e)=>{
  e.preventDefault();
  form.validateFieldsAndScroll((err, values) => {
    if (!err) {
      dispatch({
        type:"accountSetting/modifyPassword",
        payload:values
      })
    }
  });
}
const handleBackOk=()=>{
  if(promptObj.todo==='closeModal'){
    dispatch({
      type:"accountSetting/togglePrompt",
      payload:{visible:false}
    })
  }
  if(promptObj.todo==='closeModalAndToLogoIn'){
    dispatch({
      type:"accountSetting/togglePrompt",
      payload:{visible:false}
    })
    dispatch(routerRedux.push({
      pathname:'/login'
    }))
  }
}
const handleBackCancel=()=>{}
  return(
    <div className="accountSetting">
      <PromptModal {...promptObj} onOk={handleBackOk} onCancel={handleBackCancel}/>
      <Form onSubmit={handleSubmit}>
        <FormItem label="当前密码" {...formItemLayout} hasFeedback>
          {getFieldDecorator('oldPassword', {
            rules: [
              { required: true, message: '登录密码未输入' },
              {min:6,message:"原密码过短"},
            ],
          })(
            <Input type='passWord' placeholder='请输入当前密码'/>
          )}
        </FormItem>
        <Row>
          <Col span={12}>
            <FormItem
              {...formItemLayout1}
              label="新密码"
              hasFeedback
            >
              {getFieldDecorator('password', {
                rules: [{
                  required: true, message: '密码长度过短!',
                  min:6,
                }, {
                  validator:checkConfirm,
                },{
                  pattern:/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/,message:"请按照提示输入正确的密码"
                }],
              })(
                  <Input type="password" placeholder="请输入新密码" />
              )}
            </FormItem>
          </Col>
          <Col span={9} pull={2}>
            <Alert message="新密码必须包含数字和字母，长度不低于6位，且不能与账号相同" banner />
          </Col>
        </Row>
        <FormItem
          {...formItemLayout}
          label="确认密码"
          hasFeedback
        >
          {getFieldDecorator('confirmPassword', {
            rules: [{
              required: true, message: '密码不一致!',
            }, {
              validator: checkPassword,
            },{
              pattern:/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/,message:"请按照提示输入正确的密码"
            }],
          })(
            <Input type="password" placeholder="请再次输入密码" onBlur={handleConfirmBlur} />
          )}
        </FormItem>
        <FormItem>
          <Row>
            <Col span={3} offset={3}>
              <Button type="primary" htmlType="submit">保存</Button>
            </Col>
          </Row>
        </FormItem>
      </Form>
    </div>
  )
}
function mapStateToProps({accountSetting}){
  return{accountSetting}
}
export default connect(mapStateToProps)(Form.create()(AccountSetting));
