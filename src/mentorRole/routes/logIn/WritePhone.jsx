import React from 'react'
import {Form,Button,Row,Col,Input,Icon} from 'antd'
import {routerRedux} from 'dva/router'
import {connect} from 'dva'
import PromptModal from '../../../commons/View/PromptModal'
import CountDown from '../../components/countDown/CountDown'
import './writePhone.css'
const FormItem=Form.Item;
const interval=null;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
function WritePhone({form,dispatch,writePhone}){

  const {getFieldDecorator}=form;
  const {
    loginNameExist,
    passwordDirty,
    verificationCodeId,
    promptObj,
    isClear,
  }=writePhone;
  const getVerificationCode=()=>{
      const phoneNumber =  form.getFieldValue("phone");
      form.validateFields(["phone"],(errors, values)=>{
        if(errors==null){
          dispatch({ //获取验证码 测试阶段关闭
            type:"writePhone/getVerificationCode",
            payload:{
               phoneNumber: phoneNumber
            }
          });
        }
      });
  }

  const handlePasswordBlur=(e)=>{
    const value = e.target.value;
    dispatch({
      type:"writePhone/changePasswordDirty",
      payload:{
         passwordDirty: passwordDirty || !!value
      }
    })
  }
  const checkPassword=(rule, value, callback)=> {
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致!');
    } else {
      callback();
    }
  }
  const checkConfirm=(rule, value, callback)=>{
    if (value && passwordDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }
  const handleSubmit=(e)=>{
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err){
        // if(loginNameExist){
        //   form.validateFields(['loginName'],(err, values) => {
        //     form.setFields({
        //       loginName: {
        //         value: values.phone,
        //         errors: [new Error('账号已存在')],
        //       },
        //      });
        //   })
        // }else
        if(verificationCodeId==null){
          dispatch({
            type:"writePhone/showPrompt",
            payload:{
               description:"请先获取验证码"
            }
          });
          return;
        }else{
          values.id = verificationCodeId;
          //1、先验证验证码
          dispatch({ //测试用 暂时关闭
            type:"writePhone/verifyCode",
            payload:values
          });
        }
      }else{
        if(loginNameExist){
          form.validateFields(['loginName'],(err, values) => {
            form.setFields({
              loginName: {
                value: values.phone,
                errors: [new Error('账号已存在')],
              },
             });
          })
        }
      }
    });
  }

  const checkName=()=>{
    function getTestValue(bool,form){
      if(bool){
        form.validateFields(['loginName'],(err, values) => {
          form.setFields({
            loginName: {
              value: values.phone,
              errors: [new Error('账号已存在')],
            },
           });
           dispatch({
             type:"writePhone/changeLoginNameExist",
             payload:{
               loginNameExist:true
             }
           })
        })
      }
    }
    dispatch({
      type:"writePhone/checkLoginName",
      payload:{
        loginName:form.getFieldValue("loginName"),
        form,
        callBack:getTestValue,
      }
    })
  }
  const onOkCallBack=()=>{
		if(promptObj.todo==='closeModal'){
			dispatch({
				type:"writePhone/togglePrompt",
				payload:{
					visible:false
				}
			})
		}
  }
  const onCancelCallBack=()=>{}
  const checkError=()=>{
    let hasError=null;
    form.validateFields(["phone"],(errors, values)=>{
      if(errors==null){
        return hasError=false
      }else{
        return hasError=true
      }
    });
    return hasError
  }
  return(
    <div className="writePhone">
      <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack}/>
      <Form onSubmit={handleSubmit}>
        <div className="items">
          <Row className="setting">
            <Col span={3} offset={3}><span className="setting_loginName">账号设置</span></Col>
            <Col span={5}><span className="tips">请设置登录名和密码</span></Col>
          </Row>
          <FormItem label="登录名称" {...formItemLayout}>
            {getFieldDecorator('loginName', {
              rules: [
                { required: true, message: '请输入帐号'},{min:4,message:"帐号长度太短"},
                {pattern:/^[0-9a-zA_Z@.]+$/,message:"帐号仅支持英文,数字,邮箱!"}
              ],
            })(
              <Row>
                <Col span={12}>
                  <Input
                    size='large'
                    placeholder="请输入账号"
                    onBlur={checkName}
                    minLenght="4"
                    maxLength="25"               
                    />
                </Col>
                <Col span={11} offset={1}><span className="tips">4-25个字符，可以使用英文，数字，邮箱</span></Col>
              </Row>
            )}
          </FormItem>
          <FormItem label='登录密码' {...formItemLayout}>
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: '请输入密码!',
              },{min:6,message:'密码太短'}, {
                validator: checkConfirm,
              }],
            })(
              <Row>
                <Col span={12}>
                  <Input type="password" size='large' onBlur={handlePasswordBlur} placeholder='请输入密码' minLenght="6" maxLength="16"/>
                </Col>
                <Col span={11} offset={1}>
                  <span className="tips">6-16个字符，区分大小写</span>
                </Col>
              </Row>
            )}
          </FormItem>
          <FormItem label='确认密码' {...formItemLayout}>
            {getFieldDecorator('confirm', {
              rules: [{
                required: true, message: '请确认密码!',
              },{min:6,message:'密码太短'}, {
                validator: checkPassword,
              }],
            })(
              <Row>
                <Col span={12}>
                  <Input type="password" size='large' placeholder='请确认密码' minLenght="6" maxLength="16"/>
                </Col>
              </Row>
            )}
          </FormItem>
          <h1 className="xuxian"></h1>
          <Row className="setting">
            <Col span={3} offset={3}><span className="setting_loginName">基本信息</span></Col>
            <Col span={16}><span className="tips">此手机号码将作为业务变更等操作接受验证码所用，请输入时认真填写！</span></Col>
          </Row>
          <FormItem label='手机号码' {...formItemLayout}>
            {getFieldDecorator('phone', {
              rules: [
                { required: true, message: '请输入11位有效手机号码!',pattern:/^1\d{10}$/},
              ],
            })(
              <Row>
                <Col span={12}>
                  <Input
                    size='large'
                    placeholder="请输入11位有效手机号码"
                    />
                </Col>
              </Row>
            )}
          </FormItem>
          <FormItem label='验证码' {...formItemLayout}>
            {getFieldDecorator('code', {
              rules: [{ required: true, message:'请输入验证码' }],
            })(
              <Row gutter={6}>
                <Col span={7}><Input  size='large' placeholder="请输入验证码"/></Col>
                <Col >
                  <CountDown click={getVerificationCode} isError={checkError} isClear={isClear}/>
                </Col>
              </Row>
            )}
          </FormItem>
          <FormItem>
              <Row gutter={6}>
                <Col span={6} offset={4}>
                  <Button className="toNextButton" type="button" htmlType="submit">下一步</Button>
                </Col>
              </Row>
          </FormItem>
        </div>
      </Form>
    </div>
  )
}
function mapStateToProps({writePhone}){
  return{writePhone}
}
export default connect(mapStateToProps)(Form.create({})(WritePhone))
