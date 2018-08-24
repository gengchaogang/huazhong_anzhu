import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { routerRedux } from 'dva/router'

import { Input, Row, Col, Table, Form, Select, Button, Checkbox, Radio } from 'antd';
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;

import PromptModal from '../../commons/View/PromptModal'
import backgroundImage from '../assets/images/login.jpg'

import './Login.css'
function Login({ location, dispatch, login, form: {
  getFieldDecorator,
  validateFields,
  getFieldsValue,
  resetFields,
  setFieldsValue,
},
}) {
  const { promptObj, loginFail, buttonLoading } = login;
  function onSubmit() {
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = { ...getFieldsValue() };
      dispatch({
        type: 'login/postLoginData',
        payload: data,
      })
    });
  }
  return (
    <div className='anzhu_login' id='anzhu_login'>
      <PromptModal {...promptObj} onOk={() => dispatch({ type: 'login/closePrompt' })} onCancel={() => dispatch({ type: 'login/closePrompt' })} />
      {/*<div className='anzhu_login_header'>
        <div className='anzhu_login_header_left'>
          <b className='anzhu_login_logo'>ANZHU</b>
          <span>——欢迎登录</span>
        </div>
        <div className='anzhu_login_header_right'>
          <a href='/'>{`<<返回安住`}</a>
        </div>
      </div>*/}
      <div className='anzhu_login_body' style={{ backgroundImage: `URL(${backgroundImage})` }}>
        <div className='anzhu_login_loginBox'>
          <div className='anzhu_login_loginBox_left'>
            <b className='centerPic'></b>
          </div>
          <div className='anzhu_login_loginBox_right'>
            <h1 className='anzhu_login_loginBox_title'>欢迎登录经纪人交易中心</h1>
            <Form>
              <FormItem>
                {getFieldDecorator('loginName', {
                  rules: [
                    { required: true, message: '登录名未输入' },
                  ],
                })(
                  <Input type='text' placeholder='请输入用户名/手机号' onPressEnter={onSubmit} />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('passWord', {
                  rules: [
                    { required: true, message: '登录密码未输入' },
                  ],
                })(
                  <Input type='passWord' placeholder='请输入密码' onPressEnter={onSubmit} />
                )}
              </FormItem>
            </Form>
            <div style={{ padding: '6px' }}></div>
            <span className='anzhu_login_loginFail'>{!!loginFail ? loginFail : ''}</span>
            <Button type='primary' onClick={onSubmit} className='anzhu_login_loginBtn' loading={buttonLoading}>{buttonLoading ? '' : '登录'}</Button>
          </div>
        </div>
        <div className='anzhu_login_footer'>
          <span>保定市华屹网络科技有限公司    冀ICP备17024190号-1</span>
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {
  indexPage: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}
function mapStateToProps({ login }) {
  return { login };
}
export default connect(mapStateToProps)(Form.create()(Login));
