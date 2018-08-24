import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { routerRedux } from 'dva/router'

import {Form,Row,Col,Button,Input} from 'antd'
const FormItem=Form.Item;
import DxPanel from '../../commons/components/DxPanel'
import DxTimeButton from '../../commons/components/DxTimeButton'
import ModifyPassword from '../../commons/components/ModifyPassword'
import PromptModal from '../../commons/View/PromptModal'
import './AccountManagement.css'
const anzhuFormItemLayoutPlus = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6},
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10},
  },
};
function AccountManagement({location,dispatch,accountManagement,form:{
  getFieldDecorator,
  getFieldValue,
  validateFields,
  getFieldsValue,
}}){
  const {
    accountModal,
    promptObj,
    needOptPwd,
    isTradingCenter,
    changePhone,
    userPhone,
    codeRight,
    stepBtnLoading,
    changePhoneCode,
    changePhoneDoBtnValue,
    changePhoneDoBtnLoading,
    reGetCode,
    codeId,
  }=accountManagement;
  const modifyPasswordProps={
    ...accountModal,
    okCallBack:(data)=>dispatch({
      type:'accountManagement/doAccountPsw',
      payload:data,
    }),
    onCancelCallBack:()=>dispatch({
      type:'accountManagement/closeAccountPsw',
    }),
  }
  function verificationLoginPsd(){
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = { ...getFieldsValue()};
      console.log('data',data);
      dispatch({
        type:'accountManagement/verificationLoginPsd',
        payload:data.loginPsd,
      })
    });
  }
  function sendVerificationCode(){
    validateFields((errors) => {
      if (errors) {
        console.log('errors',errors);
        dispatch({
          type:'accountManagement/changeReGetCode',
        })
        return;
      }else{
        const data = { ...getFieldsValue()};
        console.log('data',data);
        dispatch({
          type:'accountManagement/doGetCode',
          payload:data.newPhone,
        })
      }
    });
  }
  function doChangePhoneFrom(){
    validateFields((errors) => {
      if (errors) {
        return;
      }else{
        const data = { ...getFieldsValue()};
        console.log('data',data);
        dispatch({
          type:'accountManagement/lastDoChangePhone',
          payload:data,
        })
      }
    });
  }
  function doVerifyCodeFrom(){
    validateFields((errors) => {
      if (errors) {
        return;
      }else{
        const data = { ...getFieldsValue()};
        console.log('data',data);
        dispatch({
          type:'accountManagement/doVerifyCode',
          payload:data,
        })
      }
    });
  }
  return (
    <div className='accountManagement'>
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'accountManagement/closePrompt'})} onCancel={()=>dispatch({type:'accountManagement/closePrompt'})}/>
      <ModifyPassword {...modifyPasswordProps}/>
      {!isTradingCenter && <Button type='primary'
        disabled={!!changePhone} onClick={()=>dispatch({
          type:'accountManagement/readyChangePhone',
        })}>修改手机号</Button>}
      <Button type='primary' onClick={()=>dispatch({
          type:'accountManagement/openAccountModal',
          payload:'login'
        })}>修改登录密码</Button>
      {needOptPwd && <Button type='primary' onClick={()=>dispatch({
          type:'accountManagement/openAccountModal',
          payload:'operation'
        })}>修改审核密码</Button>}
      {
        !!changePhone && <Form>
        {changePhone === 'step1' && <div className='changePhone_formBox'>
            <FormItem label="当前手机号"
              {...anzhuFormItemLayoutPlus}
              >
              <span>{userPhone}</span>
            </FormItem>
            <FormItem label="输入登录密码"
              {...anzhuFormItemLayoutPlus}
              >
              {
                getFieldDecorator('loginPsd',{
                  rules:[
                    {required:true,message:'请输入登录密码'},
                  ],
                  })(
                  <Input type='password' placeholder='请在此输入登录密码'/>
                )
              }
            </FormItem>
            <div>
              <Button type='primary' onClick={verificationLoginPsd} loading={stepBtnLoading}>下一步</Button>
            </div>
        </div>}
        {changePhone === 'step2' && <div className='changePhone_formBox_step2'>
          <div className='changePhone_formBox'>
            <FormItem label="新的手机号"
              {...anzhuFormItemLayoutPlus}
              >
              {
                getFieldDecorator('newPhone',{
                  validateTrigger: 'onBlur',
                  rules:[
                    {required:true,message:'请输入新的手机号'},
                    { type:'string',pattern:/^1\d{10}$/, message: '手机号无效' },
                    { type:'string',pattern:/^(?!userPhone$)/, message: '新手机号不能与原号码一致！' },
                  ],
                  })(
                  <Input disabled={codeRight} type='text' placeholder='请在此输入新的手机号'/>
                )
              }
            </FormItem>
            {!!codeId && <FormItem label="验证码"
              {...anzhuFormItemLayoutPlus}
              >
              {
                getFieldDecorator('code',{
                  validateTrigger: 'onBlur',
                  rules:[
                    {required:true,message:'请输入验证码'},
                    { type:'string',pattern:/^\d{4}$/, message: '验证码无效' },
                  ],
                  })(
                  <Input disabled={codeRight} type='text' placeholder='请在此输入验证码' onBlur={doVerifyCodeFrom}/>
                )
              }
            </FormItem>}
          </div>
          <div className='changePhone_btnBox'>
            {(!!getFieldValue('newPhone') && getFieldValue('newPhone').length === 11) && <DxTimeButton time={120} getCode={sendVerificationCode} reGetCode={reGetCode}/>}
          </div>
          <div>
            {!!codeRight && <Button type='primary' onClick={doChangePhoneFrom} loading={changePhoneDoBtnLoading}>修改</Button>}
            <Button type='ghost' onClick={()=>dispatch({
                type:'accountManagement/returnToStep1',
              })}>返回</Button>
          </div>
        </div>}
      </Form>
      }
    </div>
  );
}

AccountManagement.propTypes = {
  accountManagement: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}
function mapStateToProps({accountManagement}) {
  return {accountManagement};
}
export default connect(mapStateToProps)(Form.create()(AccountManagement));
/*{!!changePhone && <div className='accountManagement_panel'>
  {changePhone === 'step1' && <div className='accountManagement_step1'>
    <div className='changePhone_step1_content'>
      <p>{`当前手机号：${userPhone}`}</p>
      <span>输入登录密码：</span>
      <div className='changePhone_loginPsd'>
        <Input value={changePhoneInputValue} onChange={(e)=>dispatch({
            type:'accountManagement/changePhoneChangeLoginPsd',
            payload:e.target.value,
          })} placeholder='请在此输入登录密码' type='password'/>
      </div>
    </div>
    <div>
      <Button type={(changePhoneInputValue.length === 0)?'ghost':'primary'} disabled={changePhoneInputValue.length === 0} onClick={()=>dispatch({
          type:'accountManagement/verificationLoginPsd',
          payload:changePhoneInputValue,
        })} loading={stepBtnLoading}>下一步</Button>
    </div>
  </div>}
  {changePhone === 'step2' && <div className='accountManagement_step1'>
    <div className='changePhone_step1_content'>
      <div className='changePhone_row'>
        <span>新的手机号：</span>
        <div className='changePhone_loginPsd'>
          <Input value={changePhoneInputValue} onChange={(e)=>dispatch({
              type:'accountManagement/changePhoneChangeLoginPsd',
              payload:e.target.value,
            })} placeholder='请在此输入新的手机号'/>
        </div>
        {changePhoneInputValue.length !== 0 && <DxTimeButton time={120} getCode={()=>dispatch({
            type:'accountManagement/doGetCode'
          })}/>}
      </div>
      <div className='changePhone_row'>
        <span>输入验证码：</span>
        <div className='changePhone_loginPsd'>
          <Input value={changePhoneCode} onBlur={(e)=>dispatch({
              type:'accountManagement/changePhoneChangeCode',
              payload:e.target.value,
            })} placeholder='请在此输入验证码'/>
        </div>
      </div>
      <div>
        <Button type={changePhoneDoBtnValue?'ghost':'primary'} disabled={changePhoneDoBtnValue} loading={changePhoneDoBtnLoading} onClick={()=>dispatch({
            type:'accountManagement/doChangePhone'
          })}>修改</Button>
      </div>
    </div>
  </div>}
</div>}*/
