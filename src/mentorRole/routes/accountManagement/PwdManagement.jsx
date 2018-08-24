import React from 'react'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import DxPanel from '../../../commons/components/DxPanel'
import PromptModal from '../../../commons/View/PromptModal'
import {Table,Row,Col,Button,Tabs,DatePicker,Input,Form,Alert,Radio,} from 'antd'
import CountDown from '../../components/countDown/CountDown'
import './pwdManagement.css'
const FormItem=Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 7 },
};
const formItemLayout1 = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
function PwdManagement({pwdManagement,dispatch,form}){

  const {getFieldDecorator}=form

  const {
    confirmDirty,
    currentActiveKey,
    hasWithdrawPwd,
    promptObj,
    startNum,
    lastNum,
    phoneNumber,
    isClear,
    verificationCodeId,
  }=pwdManagement;

  const handleConfirmBlur = (e) => {
    const value = e.target.value;
    dispatch({
      type:"pwdManagement/changeConfirmDirty",
      payload:{
        confirmDirty:false
      }
    })
  }

  const checkPassword = (rule, value, callback) => {
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致!');
    } else {
      callback();
    }
  }

  const checkConfirm=(rule, value, callback)=>{
    if (value && confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  const handleSubmit=(e)=>{
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type:"pwdManagement/addPwd",
          payload:values
        })
      }
    });
  }

  const handleBackOk=()=>{
    if(promptObj.todo==='closeModal'){
      dispatch({
        type:"pwdManagement/togglePrompt",
        payload:{visible:false}
      })
    }
    if(promptObj.todo==='toBusinessInfos'){
      dispatch({
        type:"pwdManagement/togglePrompt",
        payload:{visible:false}
      })
      dispatch(routerRedux.push({
        pathname:"/businessManagement/businessInfos",
      }));
    }
    if(promptObj.todo==='closeAndToRecord'){
      dispatch({
        type:"pwdManagement/togglePrompt",
        payload:{visible:false}
      })
      dispatch(routerRedux.push({
        pathname:"/accountManagement/commissionRecord",
      }));
    }
  }

  const handleBackCancel=()=>{}

  const showAddPwd=()=>{
    return(
      <DxPanel title="密码管理">
        <Form onSubmit={handleSubmit}>
          <FormItem>
            <Row>
              <Col offset={3}>首次使用请先设置密码!</Col>
            </Row>
          </FormItem>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout1}
                label="提现密码"
                hasFeedback
              >
                {getFieldDecorator('password', 
                {
                  rules: [
                    {max:12,message: '密码长度过长',}, 
                    {required: true, message: '请输入最少6位密码',min:6,}, 
                    {type: 'string',pattern:"^[a-zA-Z0-9]+$",message: '存在特殊字符',},
                    {validator:checkConfirm,}
                  ],
                })(
                    <Input type="password" placeholder="请输入新密码" maxLength='12'/>
                )}
              </FormItem>
            </Col>
            <Col span={6} pull={2}>
              <Alert message="6~12位数字或字母组成" banner />
            </Col>
          </Row>
          <FormItem
            {...formItemLayout}
            label="确认密码"
            hasFeedback
          >
            {getFieldDecorator('confirmPassword', {
              rules: [{
                required: true, message: '密码不一致',
              },{
                type: 'string',pattern:"^[a-zA-Z0-9]+$",message: '存在特殊字符',
              }, {
                validator: checkPassword,
              }],
            })(
              <Input type="password" placeholder="请再次输入密码" onBlur={handleConfirmBlur} maxLength='12'/>
            )}
          </FormItem>
          <FormItem>
            <Row>
              <Col span={3} offset={3}>
                <Button type="primary" htmlType="submit">提交</Button>
              </Col>
            </Row>
          </FormItem>
        </Form>
      </DxPanel>
    )
  }

  const onRadioChange=(e)=>{
    dispatch({
      type:"pwdManagement/changeActiveKey",
      payload:{
        currentActiveKey:e.target.value
      }
    })
  }

  const modifyPassword=(e)=>{
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type:"pwdManagement/modifyPassword",
          payload:{
            values:values
          }
        })
        form.resetFields();
      }
    });
  }

  const checkConfirm_modify=(rule, value, callback)=>{
    if (value && confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  const checkPassword_modify=(rule, value, callback)=>{
    if (value && value !== form.getFieldValue('password_modify')) {
      callback('两次输入的密码不一致!');
    } else {
      callback();
    }
  }

  const checkConfirm_reset=(rule, value, callback)=>{
    if (value && confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  const checkPassword_reset=(rule, value, callback)=>{
    if (value && value !== form.getFieldValue('password_reset')) {
      callback('两次输入的密码不一致!');
    } else {
      callback();
    }
  }

  const getVerificationCode=()=>{
    dispatch({ //获取验证码 测试阶段关闭
      type:"pwdManagement/getVerificationCode",
      payload:{
         phoneNumber: phoneNumber
      }
    });
  }

  const checkError=()=>{
    // let hasError=null;
    // form.validateFields(["phone"],(errors, values)=>{
    //   if(errors==null){
    //     return hasError=false
    //   }else{
    //     return hasError=true
    //   }
    // });
    // return hasError
  }

  const resetPassword=(e)=>{
      e.preventDefault();
     form.validateFieldsAndScroll((err, values) => {
       if (err) {
         return
      }else if (verificationCodeId===null){
        dispatch({
          type:"pwdManagement/showPrompt",
          payload:{
             description:"请先获取验证码"
          }
        });
        return
      }else{
        const code=form.getFieldValue('code')
        dispatch({
          type:"pwdManagement/verifyCode",
          payload:{
            authCode:code,
            authCodeId:verificationCodeId,
            withdrawPwd:form.getFieldValue('password_reset'),
            checkWithdrawPwd:form.getFieldValue('confirmPassword_reset'),
          }
        })
      }
     });
    }

  const showModifyPwd=()=>{
    if(currentActiveKey==="修改密码"){
      return(
        <DxPanel title="密码管理">
          <Row>
            <Col span={5} offset={3}>
              <RadioGroup onChange={onRadioChange} defaultValue="修改密码" size="large">
                <RadioButton value="修改密码">修改密码</RadioButton>
                <RadioButton value="忘记密码">忘记密码</RadioButton>
              </RadioGroup>
            </Col>
          </Row>
          <Row style={{marginTop:"10px"}}>
            <Col>
              <Form onSubmit={modifyPassword}>
                <FormItem label="旧密码" {...formItemLayout} hasFeedback>
                  {getFieldDecorator('oldPassword', {
                    rules: [
                      { required: true, message: '登录密码未输入' },
                      {min:6,message:"原密码过短"}
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
                      hasFeedback>
                      {getFieldDecorator('password_modify', {
                        rules: [{
                          required: true, message: '请输入最少6位密码',
                          min:6,
                        },{
                          type: 'string',pattern:"^[a-zA-Z0-9]+$",message: '存在特殊字符',
                        }, {
                          validator:checkConfirm_modify,
                        }],
                      })(
                          <Input type="password" placeholder="请输入新密码" maxLength="12"/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6} pull={2}>
                    <Alert message="6~12位数字或字母组成" banner />
                  </Col>
                </Row>
                <FormItem
                  {...formItemLayout}
                  label="确认密码"
                  hasFeedback
                >
                  {getFieldDecorator('confirmPassword_modify', {
                    rules: [{
                      required: true, message: '密码不一致',
                    }, {
                          type: 'string',pattern:"^[a-zA-Z0-9]+$",message: '存在特殊字符',
                      },{
                      validator: checkPassword_modify,
                    }],
                  })(
                    <Input type="password" placeholder="请再次输入密码" onBlur={handleConfirmBlur} maxLength='12' />
                  )}
                </FormItem>
                <FormItem>
                  <Row>
                    <Col span={3} offset={3}>
                      <Button type="primary" htmlType="submit">提交</Button>
                    </Col>
                  </Row>
                </FormItem>
              </Form>
            </Col>
          </Row>
        </DxPanel>
      )
    }else if(currentActiveKey=="忘记密码"){
      return  (
          <DxPanel title="密码管理">
            <Row>
              <Col span={5} offset={3}>
                <RadioGroup onChange={onRadioChange} defaultValue="修改密码" size="large">
                  <RadioButton value="修改密码">修改密码</RadioButton>
                  <RadioButton value="忘记密码">忘记密码</RadioButton>
                </RadioGroup>
              </Col>
            </Row>
            <Row style={{marginTop:"10px"}}>
              <Col>
                <Form onSubmit={resetPassword}>
                  <Row>
                    <FormItem {...formItemLayout} label="手机号码">
                      {startNum}****{lastNum}
                    </FormItem>
                    <FormItem label='验证码' {...formItemLayout}>
                      {getFieldDecorator('code', {
                        rules: [{ required: true, message:'请输入验证码' }],
                      })(
                        <Row gutter={6}>
                          <Col span={16}><Input  size='large' placeholder="请输入验证码"/></Col>
                          <Col span={8}>
                            <CountDown click={getVerificationCode} isError={checkError} isClear={isClear}/>
                          </Col>
                        </Row>
                      )}
                    </FormItem>
                    <Col span={12}>
                      <FormItem
                        {...formItemLayout1}
                        label="新密码"
                        hasFeedback>
                        {getFieldDecorator('password_reset', {
                          rules: [{
                            required: true, message: '请输入最少6位密码',
                            min:6,
                          },{
                            type: 'string',pattern:"^[a-zA-Z0-9]+$",message: '存在特殊字符',
                          }, {
                            validator:checkConfirm_reset,
                          }],
                        })(
                            <Input type="password" placeholder="请输入新密码" maxLength="12"/>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={6} pull={2}>
                      <Alert message="6~12位数字或字母组成" banner />
                    </Col>
                  </Row>
                  <FormItem
                    {...formItemLayout}
                    label="确认密码"
                    hasFeedback
                  >
                    {getFieldDecorator('confirmPassword_reset', {
                      rules: [{
                        required: true, message: '密码不一致',
                        min:6,
                      },{
                          type: 'string',pattern:"^[a-zA-Z0-9]+$",message: '存在特殊字符',
                      },{
                        validator: checkPassword_reset,
                      },
                      ],
                    })(
                      <Input type="password" placeholder="请再次输入密码" onBlur={handleConfirmBlur} maxLength='12'/>
                    )}
                  </FormItem>
                  <FormItem>
                    <Row>
                      <Col span={3} offset={3}>
                        <Button type="primary" htmlType="submit">提交</Button>
                      </Col>
                    </Row>
                  </FormItem>
                </Form>
              </Col>
            </Row>
          </DxPanel>
      )
    }
  }

  return(
    <div className='commissionRecord'>
      <PromptModal {...promptObj} onOk={handleBackOk} onCancel={handleBackCancel}/>
      {hasWithdrawPwd?showModifyPwd():showAddPwd()}
    </div>
  )
}
function mapStateToProps({pwdManagement}){
  return{pwdManagement}
}
export default connect(mapStateToProps)(Form.create()(PwdManagement));
