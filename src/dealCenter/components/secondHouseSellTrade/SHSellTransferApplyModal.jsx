import React, { PropTypes } from 'react';
import {Input,Row,Col,Table,Form,Select,Button,Checkbox,Radio} from 'antd';
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import StepsModal from '../../../commons/UI/StepsModal'
import DxPanelMini from '../../../commons/components/DxPanelMini'
import './SHSellTransferApplyModal.css'
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const stepsModalProps={
  title:'二手房-申请过户',
  stepList:[
    {
      title:'申请过户'
    },{
      title:'办理过户'
    },{
      title:'完成过户'
    }
  ],
  width:1000,
  stepStatus:'process',
  current:0,
}
const applyTableProps={
  columns:[
    {
      title:'房源编号',
      dataIndex:'houseCode',
      key:'houseCode',
    },{
      title:'所属小区',
      dataIndex:'communityName',
      key:'communityName',
    },{
      title:'房源信息',
      dataIndex:'houseInfo',
      key:'houseInfo',
    },{
      title:'房源面积',
      dataIndex:'houseArea',
      key:'houseArea',
    },{
      title:'房源单价',
      dataIndex:'unitPrice',
      key:'unitPrice',
    },{
      title:'房源总价',
      dataIndex:'totalPrice',
      key:'totalPrice',
    },{
      title:'支持贷款',
      dataIndex:'supportLoan',
      key:'supportLoan',
      render:bool=><span>{!!bool?'支持':'不支持'}</span>
    }
  ],
  pagination:false,
}
const tradeProgressOptions = ['意向金已支付', '中介佣金已支付','贷款已批'];
const SHSellTransferApplyModal = ({
  visible,
  houseInfo,
  progress,
  auditorList,
  onOk,
  onCancel,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
    setFieldsValue,
    },
  }) => {
  function closeModal(){
    resetFields();
    onCancel();
  }
  function updateApplyForm(){
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = { ...getFieldsValue()};
      onOk(data);
    });
  }
  return(
    <StepsModal {...stepsModalProps} visible={visible} footer={<div>
      <Button type='ghost' onClick={closeModal}>取消</Button>
      <Button type='primary' onClick={updateApplyForm}>提交申请</Button>
    </div>} onCancel={closeModal}>
      <div className='secondHouseSellLoanApply_modal_content'>
        <DxPanelMini title='贷款房源'>
          <Table {...applyTableProps} dataSource={[JSON.parse(houseInfo)]}/>
        </DxPanelMini>
        <DxPanelMini title='客户已完成' hasPadding={true}>
          <CheckboxGroup options={tradeProgressOptions} value={progress?progress:[]} disabled/>
        </DxPanelMini>
        <Form>
          <DxPanelMini title='过户信息' hasPadding={true}>
            <Row>
              <Col sm={24} md={12}>
                <FormItem
                  label='业主姓名'
                  hasFeedback
                  {...formItemLayout}
                >
                  {getFieldDecorator('ownerName', {
                    rules: [
                      { required: true, message: '客户姓名未填写' },
                      { min:1, message: '客户姓名过短' },
                    ],
                  })(
                    <Input type='text' placeholder='请在此输入业主姓名'/>
                  )}
                </FormItem>
              </Col>
              <Col sm={24} md={12}>
                <FormItem
                  label='业主联系方式'
                  hasFeedback
                  {...formItemLayout}
                >
                  {getFieldDecorator('ownerPhone', {
                    rules: [
                      { required: true, message: '业主联系方式未填写' },
                      { type:'string',pattern:/\d$/, message: '联系方式格式不正确！' },
                    ],
                  })(
                    <Input type='text' placeholder='请在此输入业主联系方式' />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col sm={24} md={12}>
                <FormItem
                  label='业主证件'
                  {...formItemLayout}
                >
                  {getFieldDecorator('ownerCertificates')(
                    <CheckboxGroup options={['房产证','身份证原件']}/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col sm={24} md={12}>
                <FormItem
                  label='购房人姓名'
                  hasFeedback
                  {...formItemLayout}
                >
                  {getFieldDecorator('customerName', {
                    rules: [
                      { required: true, message: '购房人姓名未填写' },
                      { min:1, message: '购房人姓名过短' },
                    ],
                  })(
                    <Input type='text' placeholder='请在此输入购房人姓名'/>
                  )}
                </FormItem>
              </Col>
              <Col sm={24} md={12}>
                <FormItem
                  label='购房人联系方式'
                  hasFeedback
                  {...formItemLayout}
                >
                  {getFieldDecorator('customerPhone', {
                    rules: [
                      { required: true, message: '购房人联系方式未填写' },
                      { type:'string',pattern:/\d$/, message: '联系方式格式不正确！' },
                    ],
                  })(
                    <Input type='text' placeholder='请在此输入购房人联系方式' />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col sm={24} md={12}>
                <FormItem
                  label='购房人证件'
                  {...formItemLayout}
                >
                  {getFieldDecorator('customerCertificates')(
                    <CheckboxGroup options={['户口本原件','结婚证原件','身份证原件']}/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col sm={24} md={12}>
                <FormItem
                 {...formItemLayout}
                   label='审核对象'
                 >
                 {getFieldDecorator('auditor', {
                   rules: [
                     { required: true, message: '审核对象未选择' },
                   ],
                 })(
                   <Select
                     showSearch
                     placeholder='请选择或搜索审核对象'
                     optionFilterProp='children'
                     filterOption={(input,option)=>filterAuditor(input,option)}
                   >
                     {auditorList.map(item=><Option value={item.id} key={`auditor_${item.id}`}>{item.name}</Option>)}
                   </Select>
                 )}
                </FormItem>
              </Col>
            </Row>
          </DxPanelMini>
        </Form>
      </div>
    </StepsModal>
  )
};

function filterAuditor(input, option){
  return option.props.children.indexOf(input) >= 0;
}
export default Form.create()(SHSellTransferApplyModal);
