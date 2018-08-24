import React, { Component, PropTypes } from 'react'
import {Input,Row,Col,Form,Button,Modal} from 'antd';
const FormItem = Form.Item;
import DxUpLoadPic from '../../commons/View/DxUpLoadPic'

import './RevokeRefundModal.css'
const upLoadProps={
  url:'/miss-anzhu-aliyun-file/putfile',
  maxNum:10,
  maxSize:2,
  hideName:true,
  showDetail:true,
  doCover:false,
};
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
class RevokeRefundModal extends React.Component {
  constructor(props){
    super(props);
    this.state={
      applyPics:[],
    }
  }
  returnBackApply=()=>{
    const {
      applyCallBack,
      type,
      transCode,
      form:{
        getFieldsValue,
        validateFields,
      }
    }=this.props;
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = { ...getFieldsValue()};
      applyCallBack({
        ...data,
        images:this.state.applyPics.map(item=>item.id),
        transCode,
        type,
      })
    });
  }
  render(){
    const{
      title,
      visible,
      closeModal,
      confirmLoading,
      form:{
        getFieldDecorator,
        resetFields,
      },
    }=this.props;
    return(
      <Modal visible={visible} width={700} title={title} afterClose={()=>resetFields()} okText='撤回申请' onOk={this.returnBackApply} onCancel={closeModal} confirmLoading={confirmLoading}>
        <Form>
          <Row>
            <Col sm={24} md={24}>
              <FormItem
                label='撤回理由'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('cancelReason', {
                  rules: [
                    { required: true, message: '撤回理由未填写' },
                  ],
                })(
                  <Input type='text' placeholder='请在此输入撤回理由'/>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <DxUpLoadPic {...upLoadProps} changeList={(arr)=>this.setState({applyPics:arr})}
        showPicList={this.state.applyPics}/>
      </Modal>
    );
  }
}
export default Form.create()(RevokeRefundModal);
