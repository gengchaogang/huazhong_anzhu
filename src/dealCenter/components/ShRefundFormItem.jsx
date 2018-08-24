import React, { Component, PropTypes } from 'react'
import {Input,Form,Button,Row,Col,Cascader} from 'antd';
import SelectProvinceCity from '../../commons/components/SelectProvinceCity';
import {
  getAllProvinceAndCityArrFromSession,
} from '../../commons/utils/currencyFunction'
const FormItem = Form.Item;

import './ShRefundFormItem.css'

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
export default function ShRefundFormItem({getFieldDecorator,horizontal=false}){
  if(!horizontal){
    return(
      <div className='ShRefundFormItem'>
        <Row>
          <Col lg={12} md={24}>
            <FormItem
              label='业主姓名'
              hasFeedback
              {...formItemLayout}
            >
              {getFieldDecorator('ownerName', {
                validateTrigger: 'onBlur',
                rules: [
                  { required: true, message: '业主姓名未填写' },
                  { type:'string',max:6,message: '内容过长！' },
                  { type:'string',pattern:/[\u4e00-\u9fa5]/,message: '输入内容无效！' },
                ],
              })(
                <Input type='text' placeholder='请输入业主名字'/>
              )}
            </FormItem>
          </Col>
          <Col lg={12} md={24}>
            <FormItem
              label='业主电话'
              hasFeedback
              {...formItemLayout}
            >
              {getFieldDecorator('ownerPhone', {
                validateTrigger: 'onBlur',
                rules: [
                  { required: true, message: '业主手机号未填写' },
                  { type:'string',pattern:/^1\d{10}$/, message: '手机号必须为11位长度的纯数字' },
                ],
              })(
                <Input type='text' placeholder='请输入业主手机号'/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={24}>
            <FormItem
              label='业主身份证号'
              hasFeedback
              {...formItemLayout}
            >
              {getFieldDecorator('ownerIDNumber', {
                validateTrigger: 'onBlur',
                rules: [
                  { required: true, message: '身份证号未填写' },
                  { type:'string',pattern:/(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证号长度为18位，输入的内容异常' },
                ],
              })(
                <Input type='text' placeholder='请输入业主身份证号'/>
              )}
            </FormItem>
          </Col>
          <Col lg={12} md={24}>
            <FormItem
              label='开户银行'
              hasFeedback
              {...formItemLayout}
            >
              {getFieldDecorator('ownerBank', {
                validateTrigger: 'onBlur',
                rules: [
                  {required: true, message: '业主开户银行未填写' },
                  {type:'string',pattern:/[\u4E00-\u9FA5\uF900-\uFA2D]/, message: '输入内容异常' },
                  {max:20, message: '最多可输入20个中文字符'},
                ],
              })(
                <Input type='text' placeholder='请输入业主开户银行'/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={24}>
            <FormItem
              label='开户银行所属省市'
              {...formItemLayout}
            >
              {getFieldDecorator('ownerBankProvinceCity', {
                rules: [
                  {required: true, message: '开户银行所属省市未选择' },
                ],
              })(
                <Cascader options={getAllProvinceAndCityArrFromSession()} placeholder='请选择业主开户银行所属省市'/>
              )}
            </FormItem>
          </Col>
          <Col lg={12} md={24}>
            <FormItem
              label='开户支行'
              hasFeedback
              {...formItemLayout}
            >
              {getFieldDecorator('ownerSubbranch', {
                validateTrigger: 'onBlur',
                rules: [
                  {required: true, message: '业主开户支行未填写' },
                  {type:'string',pattern:/[\u4E00-\u9FA5\uF900-\uFA2D]/, message: '输入内容异常' },
                  {max:50, message: '最多可输入50个中文字符'},
                ],
              })(
                <Input type='textarea' autosize={{ minRows: 2, maxRows: 2 }} placeholder='请输入开户支行'/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={24}>
            <FormItem
              label='开户银行卡号'
              hasFeedback
              {...formItemLayout}
            >
              {getFieldDecorator('ownerBankCard', {
                validateTrigger: 'onBlur',
                rules: [
                  {required: true, message: '开户银行卡号未填写' },
                  {type:'string',pattern:/^\+?[1-9][0-9]*$/, message: '输入内容异常' },
                  {min:16, message: '银行卡号长度至少为16位'},
                  {max:19, message: '银行卡号长度最多为19位'},
                ],
              })(
                <Input type='text' placeholder='请输入开户银行卡号'/>
              )}
            </FormItem>
          </Col>
        </Row>
      </div>
      )
  }else{
    return(
      <div>
        <FormItem
          hasFeedback
          label='业主姓名'
          labelCol={{xs: 8,sm:6,md:4,lg:3}}
          wrapperCol={{xs: 10,sm:8,md:6,lg:4}}
        >
          {getFieldDecorator('ownerName', {
            validateTrigger: 'onBlur',
            rules: [
              {required: true, message: '退款申请原因未填写' },
              {type:'string',pattern:/[\u4E00-\u9FA5\uF900-\uFA2D]/, message: '输入内容异常' },
              {max:6, message: '最多可输入6个中文字符'},
            ],
          })(
            <Input placeholder='请在此输入业主姓名'/>
          )}
        </FormItem>
        <FormItem
          label='业主电话'
          hasFeedback
          labelCol={{xs: 8,sm:6,md:4,lg:3}}
          wrapperCol={{xs: 10,sm:8,md:6,lg:4}}
        >
          {getFieldDecorator('ownerPhone', {
            validateTrigger: 'onBlur',
            rules: [
              { required: true, message: '业主电话未填写' },
              { type:'string',pattern:/^1\d{10}$/, message: '业主电话必须为11位长度的纯数字' },
            ],
          })(
            <Input type='text' placeholder='请输入业主电话'/>
          )}
        </FormItem>
        <FormItem
          label='业主身份证号'
          hasFeedback
          labelCol={{xs: 8,sm:6,md:4,lg:3}}
          wrapperCol={{xs: 10,sm:8,md:6,lg:4}}
        >
          {getFieldDecorator('ownerIDNumber', {
            validateTrigger: 'onBlur',
            rules: [
              { required: true, message: '身份证号未填写' },
              { type:'string',pattern:/(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '输入的内容异常' },
            ],
          })(
            <Input type='text' placeholder='请输入业主身份证号'/>
          )}
        </FormItem>
        <FormItem
          label='开户银行'
          labelCol={{xs: 8,sm:6,md:4,lg:3}}
          wrapperCol={{xs: 12,sm:10,md:8,lg:6}}
        >
          {getFieldDecorator('ownerBank', {
            validateTrigger: 'onBlur',
            rules: [
              {required: true, message: '业主开户银行未填写' },
              {type:'string',pattern:/[\u4E00-\u9FA5\uF900-\uFA2D]/, message: '输入内容异常' },
              {max:20, message: '最多可输入20个中文字符'},
            ],
          })(
            <Input type='text' placeholder='请输入业主开户银行'/>
          )}
        </FormItem>
        <FormItem
          label='开户银行所属省市'
          labelCol={{xs: 8,sm:6,md:4,lg:3}}
          wrapperCol={{xs: 14,sm:12,md:10,lg:8}}
        >
          {getFieldDecorator('ownerBankProvinceCity', {
            rules: [
              {required: true, message: '开户银行所属省市未选择' },
            ],
          })(
            <Cascader options={getAllProvinceAndCityArrFromSession()} placeholder='请选择开户银行所属省市'/>
          )}
        </FormItem>
        <FormItem
          label='开户支行'
          hasFeedback
          labelCol={{xs: 8,sm:6,md:4,lg:3}}
          wrapperCol={{xs: 16,sm:14,md:12,lg:10}}
        >
          {getFieldDecorator('ownerBankSubbranch', {
            validateTrigger: 'onBlur',
            rules: [
              {required: true, message: '业主开户支行未填写' },
              {type:'string',pattern:/[\u4E00-\u9FA5\uF900-\uFA2D]/, message: '输入内容异常' },
              {max:50, message: '最多可输入50个中文字符'},
            ],
          })(
            <Input type='textarea' autosize={{ minRows: 2, maxRows: 2 }} placeholder='请输入开户支行'/>
          )}
        </FormItem>
        <FormItem
          label='开户银行卡号'
          hasFeedback
          labelCol={{xs: 8,sm:6,md:4,lg:3}}
          wrapperCol={{xs: 12,sm:10,md:8,lg:6}}
        >
          {getFieldDecorator('ownerBankCard', {
            validateTrigger: 'onBlur',
            rules: [
              {required: true, message: '开户银行卡号未填写' },
              {type:'string',pattern:/^\+?[1-9][0-9]*$/, message: '输入内容异常' },
              {min:16, message: '银行卡号长度至少为16位'},
              {max:19, message: '银行卡号长度最多为19位'},
            ],
          })(
            <Input type='text' placeholder='请输入开户银行卡号'/>
          )}
        </FormItem>
      </div>
    )

  }
}
