import React, { PropTypes } from 'react';
import { Form, Input, Modal,Row,Col } from 'antd';
const FormItem = Form.Item;
import './GroupBuyPayModal.css'
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const GroupBuyPayModal = ({
  visible,
  item,
  onOk,
  title,
  onCancel,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
    },
  }) => {
  function handleOk() {
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = { ...getFieldsValue()};
      onOk(data);
      resetFields();
    });
  }
  function handleCancel(){
    resetFields();
    onCancel();
  }


  const modalOpts = {
    title,
    visible,
    onOk: handleOk,
    onCancel:handleCancel,
  };
  return (
    <Modal {...modalOpts}>
      <Form horizontal>
        <Row>
          <Col lg={24} md={24}>
            <span className='creatGroupBuy_modal_type'>{item.discount}</span>
          </Col>
          <Col lg={24} md={24}>
            <FormItem
              label='付款金额：'
              hasFeedback
              {...formItemLayout}
            >
              <span><b style={{color:'#FF6A6A'}}>{item.amount}</b>元</span>
            </FormItem>
          </Col>
          <Col lg={24} md={24}>
            <FormItem
              label='支付订单号：'
              hasFeedback
              {...formItemLayout}
            >
              <span>{item.orderNumber}</span>
            </FormItem>
          </Col>
          <Col lg={24} md={24}>
            <FormItem
              label='支付流水号：'
              hasFeedback
              {...formItemLayout}
            >
              <span style={{fontSize:16}}>{item.serialNumber}</span>
            </FormItem>
          </Col>
          <Col lg={24} md={24}>
            <FormItem
              label='付款客户：'
              hasFeedback
              {...formItemLayout}
            >
              {getFieldDecorator('name', {
                initialValue: !!item.name?item.name:'',
                rules: [
                  { required: true, message: '付款客户未填写' },
                  { min: 1, message: '付款客户名字过短' },
                  { max: 12, message: '付款客户名字过长' },
                ],
              })(
                <Input type='text' placeholder='请输入付款客户名字'/>
              )}
            </FormItem>
          </Col>
          <Col lg={24} md={24}>
            <FormItem
              label='客户手机号：'
              hasFeedback
              {...formItemLayout}
            >
              {getFieldDecorator('phoneNumber', {
                initialValue: !!item.phoneNumber?item.phoneNumber:'',
                rules: [
                  { required: true, message: '客户手机号未填写' },
                  { type:'string',pattern:/^1\d{10}$/, message: '手机号必须为11位长度的纯数字' },
                ],
              })(
                <Input type='text' placeholder='请输入客户手机号'/>
              )}
            </FormItem>
          </Col>
          <Col lg={24} md={24}>
            <FormItem
              label='客户身份证号：'
              hasFeedback
              {...formItemLayout}
            >
              {getFieldDecorator('idCart', {
                initialValue: !!item.idNumber?item.idNumber:'',
                rules: [
                  { required: true, message: '身份证号未填写' },
                  { type:'string',pattern:/(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证号长度为18位，输入的内容异常' },
                ],
              })(
                <Input type='text' placeholder='请在此输入18位客户身份证号' />
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};


export default Form.create()(GroupBuyPayModal);
