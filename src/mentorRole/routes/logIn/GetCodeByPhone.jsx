import React from 'react'
import {Form,Button,Row,Col,Input,Icon} from 'antd'
import {routerRedux} from 'dva/router'
import {connect} from 'dva'
import PromptModal from '../../../commons/View/PromptModal'
import CountDown from '../../components/countDown/CountDown'
import img from '../../assets/images/phone.png'
import './getCodeByPhone.css'
const FormItem=Form.Item;
const interval=null;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
function GetCodeByPhone({dispatch,form,getCodeByPhone}){
  const {
    promptObj,
    isClear,
    showPhone,
    phoneNumber,
    id,
    verificationCodeId,
    extUserType,
  }=getCodeByPhone
  const {getFieldDecorator}=form;
  const getVerificationCode=()=>{
    form.validateFields(["loginName"],(errors, values)=>{
      if(errors==null){
        dispatch({ //获取验证码 测试阶段关闭
          type:"getCodeByPhone/getVerificationCode",
          payload:{
             phone:phoneNumber,
          }
        });
      }
    });
  }
  const checkLoginName=()=>{
    dispatch({
      type:"getCodeByPhone/checkLoginName",
      payload:{
        loginName:form.getFieldValue('loginName')
      }
    })
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

  const handleSubmit=(e)=>{
      e.preventDefault();
     form.validateFieldsAndScroll((err, values) => {
       if (err) {
         return
      }else if (verificationCodeId===null){
        dispatch({
          type:"getCodeByPhone/showPrompt",
          payload:{
             description:"请先获取验证码"
          }
        });
        return
      }else{
        const code=form.getFieldValue('code')
        dispatch({
          type:"getCodeByPhone/verifyCode",
          payload:{
            code:code,
            id:verificationCodeId,
            loginName:form.getFieldValue('loginName'),
          }
        })
      }
     });
    }
    const onOkCallBack=()=>{
      if(promptObj.todo==='closeModal'){
        dispatch({
          type:"getCodeByPhone/togglePrompt",
          payload:{
            visible:false
          }
        })
      }
    }
    const onCancelCallBack=()=>{}
  return(
    <div className="getCodeByPhone">
      <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack}/>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col span={14} offset={5}>
            <FormItem label="账号" {...formItemLayout}>
              {getFieldDecorator('loginName', {
                rules: [
                  { required: true, message: '请输入您要找回的账号!'},
                  {pattern:/^[0-9a-zA_Z@.]+$/,message:"帐号仅支持英文,数字,邮箱!!"}
                ],
              })(
                  <Input
                    size='large'
                    placeholder="请输入您要找回的账号!"
                    onBlur={checkLoginName}
                    />
              )}
            </FormItem>
          </Col>
        </Row>
        {
          !!phoneNumber?
          <Row>
            <Col span={14} offset={5}>
              <FormItem label="获取验证码" {...formItemLayout}>
                  <span className='phone_img'><img src={img}/></span>
                  <span className="phone_number">通过手机号 *******{showPhone}</span>
                  <CountDown click={getVerificationCode} isError={checkError} isClear={isClear}/>
              </FormItem>
            </Col>
          </Row>
          :
          null
        }
        <Row>
          <Col span={14} offset={5}>
            <FormItem label="输入验证码" {...formItemLayout}>
              {getFieldDecorator('code', {
                rules: [{ required: true, message:'请输入验证码' }],
              })(
                  <Input  size='large' placeholder="请输入验证码"/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col offset={5}>
            <FormItem label='' {...formItemLayout}>
              <Row>
                <Col offset={6}>
                  <Button
                    className="toNextButton"
                    type="button"
                    htmlType="submit"
                    size="large"
                  >
                    下一步
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
function mapStateToProps({getCodeByPhone}){
  return{getCodeByPhone}
}
export default connect(mapStateToProps)(Form.create({})(GetCodeByPhone))
