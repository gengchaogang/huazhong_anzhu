import React, { PropTypes } from 'react';
import {Input,Row,Col,Table,Form,Select,Button,Checkbox,Radio} from 'antd';
import { Link } from 'dva/router'
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import StepsModal from '../../../commons/UI/StepsModal'
import {
  getNumByPersent,
} from '../../../commons/utils/publicFunction'
import DxPanelMini from '../../../commons/components/DxPanelMini'
import './SHSellLoanApplyModal.css'
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const rentTermOptions=[
  {
    label:'5年',
    value:'5年',
  },{
    label:'10年',
    value:'10年',
  },{
    label:'15年',
    value:'15年',
  },{
    label:'20年',
    value:'20年',
  },{
    label:'25年',
    value:'25年',
  },{
    label:'30年',
    value:'30年',
  }
];
const rentRateOptions=[
  {
    label:'一成',
    value:'0.1',
  },{
    label:'二成',
    value:'0.2',
  },{
    label:'三成',
    value:'0.3',
  },{
    label:'四成',
    value:'0.4',
  },{
    label:'五成',
    value:'0.5',
  },{
    label:'六成',
    value:'0.6',
  },{
    label:'七成',
    value:'0.7',
  },{
    label:'八成',
    value:'0.8',
  },{
    label:'九成',
    value:'0.9',
  }
];
const stepsModalProps={
  title:'二手房-申请贷款',
  stepList:[
    {
      title:'申请贷款'
    },{
      title:'办理贷款'
    },{
      title:'批款'
    }
  ],
  width:1000,
  stepStatus:'process',
  current:0,
}
const applyTableProps={
  columns:[
    {
      title:'物业类型',
      dataIndex:'propertyType',
      key:'propertyType',
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
      title:'成交单价',
      dataIndex:'unitPrice',
      key:'unitPrice',
    },{
      title:'成交总价',
      dataIndex:'totalPrice',
      key:'totalPrice',
    },{
      title:'支持贷款',
      dataIndex:'supportLoan',
      key:'supportLoan',
      render:bool=><span>{!!bool?'是':'否'}</span>
    },{
      title:'操作',
      dataIndex:'options',
      key:'options',
      render:(txt,record)=><Link className='deal_operation' to={{
        pathname:'/tradeManagement/secondHouseSellTrade/secondHouseSellTradeInfoDetails',
        state:{
          transCode:record.transCode,
        }
      }}>交易详情</Link>,
    }
  ],
  pagination:false,
}
const tradeProgressOptions = ['意向金已支付', '中介佣金已支付'];
const SHSellLoanApplyModal = ({
  visible,
  houseInfo,
  progress,
  confirmLoading,
  auditorList,
  totalPrice,
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
  function handleProportionChange(e){
    setFieldsValue({
      rentAmount: (totalPrice*(getNumByPersent(Number(e.target.value)))).toFixed(2),
    })
  }
  return(
    <StepsModal {...stepsModalProps} visible={visible} confirmLoading={confirmLoading} footer={<div>
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
        <DxPanelMini title='贷款信息' hasPadding={true}>
        <Form>
          <Row>
            <Col sm={24} md={12}>
              <FormItem
                label='贷款客户'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('customerName', {
                  rules: [
                    { required: true, message: '客户姓名未填写' },
                    { min:1, message: '客户姓名过短' },
                  ],
                })(
                  <Input type='text' placeholder='请在此输入贷款客户姓名'/>
                )}
              </FormItem>
            </Col>
            {/*<Col sm={24} md={12}>
              <FormItem
                label='贷款比例'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('rentRate', {
                  onChange:handleProportionChange,
                  rules: [
                    { required: true, message: '贷款比例未选择' },
                  ],
                })(
                  <Select placeholder='请在此选择贷款比例'>
                    {rentRateOptions.map(item=><Option key={`key_${item.value}`} value={item.value}>{item.label}</Option>)}
                  </Select>
                )}
              </FormItem>
            </Col>*/}
            <Col sm={24} md={12} className='dx_col_addonAfter'>
              <FormItem
                label='贷款比例'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('rentRate', {
                  onChange:handleProportionChange,
                  rules: [
                    { required: true, message: '贷款比例未输入' },
                    { type:'string',pattern:/^(?!0+(?:\.0+)?$)(?:[1-9]\d|0|[1-9])(?:\.\d{1,2})?$/, message: '输入内容非法' },
                  ],
                })(
                  <Input type='text' placeholder='贷款比例' addonAfter='%'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={12} className='dx_col_addonAfter'>
              <FormItem
                label='贷款金额'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('rentAmount', {
                })(
                  <Input type='text' disabled  addonAfter='万元'/>
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <FormItem
                label='贷款人联系电话'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('customerPhone', {
                  rules: [
                    { required: true, message: '手机号未填写' },
                    { type:'string',pattern:/^1\d{10}$/, message: '手机号必须为11位长度的纯数字' },
                  ],
                })(
                  <Input type='text' placeholder='请在此输入11位贷款人手机号' />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={12}>
              <FormItem
                label='贷款年限'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('rentTerm', {
                  rules: [
                    { required: true, message: '贷款年限未选择' },
                  ],
                })(
                  <Select style={{width:'100%'}} placeholder='请在此选择贷款年限'>
                    {rentTermOptions.map(item=><Option key={`key_${item.value}`} value={item.value}>{item.label}</Option>)}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <FormItem
               {...formItemLayout}
                 label='贷款方式'
               >
               {getFieldDecorator('rentType', {
                 initialValue:'商贷',
                 rules: [
                   { required: true, message: '贷款方式未选择' },
                 ],
               })(
                 <RadioGroup>
                   <Radio value='商贷'>商贷</Radio>
                   <Radio value='公积金'>公积金</Radio>
                   <Radio value='组合贷款'>组合贷款</Radio>
                 </RadioGroup>
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
        </Form>
        </DxPanelMini>
      </div>
    </StepsModal>
  )
};

function filterAuditor(input, option){
  return option.props.children.indexOf(input) >= 0;
}
export default Form.create()(SHSellLoanApplyModal);
