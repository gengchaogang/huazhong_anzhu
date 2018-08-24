import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Link } from 'dva/router'

import { Form, Input,Row,Col,Radio,Select,Button,TreeSelect} from 'antd';
const RadioGroup = Radio.Group;
const Option = Select.Option;
import DxPanel from '../../../commons/components/DxPanel'
import PromptModal from '../../../commons/View/PromptModal'
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow'
import {
  isNull,
}from '../../../commons/utils/currencyFunction'
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
import './SaveEmployee.css'
const noop=()=>{};
function SaveEmployee({
  visible,
  isUpdate,
  item={},
  groups=[],
  onSubmitClick=noop,
  onBackClick=noop,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },
}){
  if(!visible) return null;
  // console.log("SaveEmployee>item>",item);
  // console.log("SaveEmployee>groups>",groups);
  const doSubmit=()=>{
    validateFields((errors, values) => {
      if (errors) {
        return;
      }
      onSubmitClick(values);
      resetFields();
      // const data = { ...getFieldsValue()};
      // dispatch({
      //   type:'creatEmployee/addEmployee',
      //   payload:data,
      // });
    });
  }
  const doBack=()=>{
    onBackClick(isUpdate);
    resetFields();
  };
  /*
  const onOkCallBack=()=>{
    dispatch({
      type:'creatEmployee/switchPrompt',
      payload:{
        visible:false,
      },
    });
    if(promptObj.type=='confirm' && promptObj.promptFor=='addEmployee'){
      resetFields();
    }
  }
  const onCancelCallBack=()=>{
    dispatch({
      type:'creatEmployee/switchPrompt',
      payload:{
        visible:false,
      },
    });
    if(promptObj.type=='confirm' && promptObj.promptFor=='addEmployee'){
      dispatch(routerRedux.goBack());
    }
  }
  */
  return (
    <div className='creatEmployee' style={{display: !visible?'none':'block'}}>
      <DxPanel title='增加员工'>
        <Form horizontal>
          <Row>
            <Col sm={24} md={12}>
              <FormItem
                label='员工姓名：'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('name', {
                  initialValue: item.name,
                  rules: [
                    { required: true, message: '员工姓名未填写' },
                    { min:1, message: '员工姓名过短' },
                    { max:6, message: '员工姓名过长' },
                  ],
                })(
                  <Input type='text' placeholder='请在此输入1~6位员工姓名'/>
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <FormItem
                label='员工工号：'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('number', {
                  initialValue: item.number,
                  rules: [
                    { min:1, message: '员工工号过短' },
                    { max:6, message: '员工工号过长' },
                  ],
                })(
                  <Input type='text' placeholder='请在此输入1~6位员工编号' />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={12}>
              <FormItem
                label='手机号：'
                hasFeedback
                extra='注：员工手机号将作为员工登录账号，请仔细核对正确。'
                {...formItemLayout}
              >
                {getFieldDecorator('phone', {
                  initialValue: item.phone,
                  rules: [
                    { required: true, message: '手机号未填写' },
                    { type:'string',pattern:/^1\d{10}$/, message: '手机号必须为11位长度的纯数字' },
                  ],
                })(
                  <Input type='text' disabled={isUpdate} placeholder='请在此输入11位员工手机号' />
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={12} style={{visibility:'hidden'}}>
              <FormItem
                {...formItemLayout}
                label='部门：'
              >
                {getFieldDecorator('departmentName', {
                  initialValue: item.departmentName,
                  // rules: [{ type: 'string', required: true, message: '员工所属部门不能为空' }],
                })(
                  <Input type='text' disabled/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={12}>
              <FormItem
                label='职位：'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('position', {
                  initialValue: item.position,
                  rules: [
                    { type:'string',message: '职位名称在1到12位之间' },
                    { min:1, message: '职位名称过短' },
                    { max:12, message: '职位名称过长' },
                  ],
                })(
                  <Input type='text' placeholder='请输入1~12位员工职位名称' />
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <FormItem
                {...formItemLayout}
                label='业务审核密码：'
                extra={<p>
                  <span>为保障交易中心资金流安全，可对财务人员或管理人员在进行项目审核时设置审核密码，初始化审核密码为</span>
                  <b style={{color:'#46B38D'}}>888888</b>
                  <span>;若选择无需设定，则管理人员在审核项目时无需密码即可审核，您的初始登陆密码为  <b style={{color:'#46B38D'}}>123456</b></span>
                </p>}
              >
                {getFieldDecorator('needOptPwd',{
                    initialValue: isNull(item.needOptPwd,false),
                    rules: [{type:'boolean'}]
                })(
                  <RadioGroup>
                    <Radio value={true}>需设定</Radio>
                    <Radio value={false}>无需设定</Radio>
                  </RadioGroup>
                )}
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
                {getFieldDecorator('extensionNumber', {
                  initialValue: item.extensionNumber,
                  rules: [
                    { type:'string',pattern:/^\d{1,11}$/, message: '分机号为1~11位的纯数字' },
                  ],
                })(
                  <Input type='text' placeholder='请输入1~11位员工分机号' />
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <FormItem
                {...formItemLayout}
                label='邮箱：'
                hasFeedback
              >
                {getFieldDecorator('email', {
                  initialValue: item.email,
                  rules: [{ type: 'email', message: '请输入正确的邮箱格式'}],
                })(
                  <Input placeholder='请在此输入员工邮箱地址' />
                )}
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
                {getFieldDecorator('officeAddress', {
                  initialValue: item.officeAddress,
                  rules: [
                    { max:100, message: '办公地址过长' },
                  ],
                })(
                  <Input type='text' placeholder='请输入员工办公地址'/>
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <FormItem
                label='备注：'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('comments', {
                  initialValue: item.comments,
                  rules: [
                    { min:1, message: '员工备注过短' },
                    { max:20, message: '员工备注过长' },
                  ],
                })(
                  <Input type='text' placeholder='请在此输入1~20个字的员工备注' />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={12}>
              <FormItem
                {...formItemLayout}
                label='权限组：'
              >
                {getFieldDecorator('groups', {
                  initialValue:item.groups,
                  rules: [{ type: 'array', required: true, message: '员工权限不能为空' }],
                })(
                  <Select multiple placeholder='请选择员工权限组'>
                    {groups.map(({id,name})=><Option value={`${id}`} key={`group_${id}`}>{name}</Option>)}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div className='creatEmployee_buttonBox'>
          <Button type='primary' onClick={doSubmit}>保存</Button>
          <Button type='ghost' onClick={doBack}>返回</Button>
        </div>
      </DxPanel>
    </div>
  );
}

SaveEmployee.propTypes = {
  visible: PropTypes.bool,
  // creatEmployee:PropTypes.object.isRequired,
  item: PropTypes.object,
  groups: PropTypes.array,
  onSubmitClick: PropTypes.func,
  onBackClick: PropTypes.func,
}

export default Form.create()(SaveEmployee);
