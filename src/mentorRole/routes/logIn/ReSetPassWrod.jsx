import React from 'react'
import {Form,Button,Row,Col,Input,Icon,Alert} from 'antd'
import {routerRedux} from 'dva/router'
import {connect} from 'dva'
import PromptModal from '../../../commons/View/PromptModal'
import './reSetPassWrod.css'
const FormItem=Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};
function ReSetPassWrod({dispatch,reSetPassWrod,form}){
  const {getFieldDecorator}=form;
  const {
    promptObj,
    confirmDirty,
    code,
    id,
    loginName,
  }=reSetPassWrod;
  const onOkCallBack=()=>{
    if(promptObj.todo==='closeModal'){
      dispatch({
        type:"reSetPassWrod/togglePrompt",
        payload:{
          visible:false
        }
      })
    }
    if(promptObj.todo==='closeAndToLogin'){
      dispatch(routerRedux.push({
        pathname:'/login'
      }))
    }
  };
  const onCancelCallBack=()=>{};
  const handleConfirmBlur = (e) => {
    const value = e.target.value;
    dispatch({
      type:"reSetPassWrod/changeConfirmDirty",
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
  const checkLoginName=(e)=>{
    const name=form.getFieldValue('password');
    if(loginName===name){
      form.validateFields(['password'],(err, values) => {
        form.setFields({
          password: {
            value: values.password,
            errors: [new Error('密码不能与帐号一致!')],
          },
         });
      })
    }
  }
  const handleSubmit=(e)=>{
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
     }else{
       values.codeId=id;
       values.code=code;
       values.loginName=loginName;
        dispatch({
          type:"reSetPassWrod/savePassWord",
          payload:values
        })
     }
    });
  }
  return(
    <div className="reSetPassWrod">
      <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack}/>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col span={11} offset={5}>
            <FormItem
              {...formItemLayout}
              label="新密码"
              hasFeedback
            >
              {getFieldDecorator('password', {
                rules: [{
                  required: true, message: '请输入密码',
                }, {
                  validator:checkConfirm,
                },{
                  pattern:/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/,message:"请按照提示输入正确的密码"
                }],
              })(
                  <Input type="password" placeholder="请输入新密码" onBlur={checkLoginName}/>
              )}
            </FormItem>
          </Col>
          <Col span={8} pull={2}>
            <Alert message="新密码必须包含数字和字母，长度不低于6位，且不能与账号相同" banner />
          </Col>
        </Row>
        <Row>
          <Col span={11} offset={5}>
            <FormItem
              {...formItemLayout}
              label="确认密码"
              hasFeedback
            >
              {getFieldDecorator('confirmPassword', {
                rules: [{
                  required: true, message: '密码不一致',
                }, {
                  validator: checkPassword,
                },{
                  pattern:/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/,message:"请按照提示输入正确的密码"
                }],
              })(
                <Input type="password" placeholder="请再次输入密码" onBlur={handleConfirmBlur} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={11} offset={5}>
            <FormItem label=''>
              <Row>
                <Col offset={6} span={12}>
                  <Button
                    className="toNextButton"
                    type="button"
                    htmlType="submit"
                    size="large"
                  >
                    保存
                  </Button>
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
function mapStateToProps({reSetPassWrod}){
  return{reSetPassWrod}
}
export default connect(mapStateToProps)(Form.create({})(ReSetPassWrod))
