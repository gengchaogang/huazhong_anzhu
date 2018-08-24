import React, { PropTypes } from 'react';
import {Input,Row,Col,Table,Form,Select,Button,Checkbox,Radio} from 'antd';
const CheckboxGroup = Checkbox.Group;
const RadioButton = Radio.Button;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import StepsModal from '../../../commons/UI/StepsModal'
import DxPanelMini from '../../../commons/components/DxPanelMini'
import './SHRentLoanApplyModal.css'
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
const commonsCusTypeOpts=['身份证', '租房合同'];
const workerCusTypeOpts=['劳动合同', '公积金','工卡','工作证明','企业邮箱'];
const applyTableProps={
  columns:[
    // {
    //   title:'房源编号',
    //   dataIndex:'id',
    //   key:'id',
    // },
    {
      title:'所属小区',
      dataIndex:'village',
      key:'village',
    },{
      title:'物业类型',
      dataIndex:'propertyType',
      key:'propertyType',
    },{
      title:'房源信息',
      dataIndex:'info',
      key:'info',
    },{
      title:'房源面积',
      dataIndex:'area',
      key:'area',
    },{
      title:'租金/押金',
      dataIndex:'rentType',
      key:'rentType',
    },{
      title:'租期',
      dataIndex:'rentTerm',
      key:'rentTerm',
    },{
      title:'房租',
      dataIndex:'rentPrice',
      key:'rentPrice',
    },{
      title:'出租方式',
      dataIndex:'rentWay',
      key:'rentWay',
    },
  ],
  pagination:false,
}
const tradeProgressOptions = ['意向金已支付', '租房中介佣金已支付'];
const SHRentLoanApplyModal = ({
  visible,
  houseInfo,
  progress,
  auditorList,
  selectCusType,
  onOk,
  cusTypeValue,
  cusTypeValueChange,
  onCancel,
  onCusTypeChange,
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
        <DxPanelMini title='租赁房源'>
          <Table {...applyTableProps} dataSource={[JSON.parse(houseInfo)]}/>
        </DxPanelMini>
        <DxPanelMini title='客户已完成' hasPadding={true}>
          <CheckboxGroup options={tradeProgressOptions} value={progress?progress:[]} disabled/>
        </DxPanelMini>
        <DxPanelMini title='分期信息' hasPadding={true}>
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
            <Col sm={24} md={12} className='dx_col_addonAfter'>
              <FormItem
                label='贷款金额'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('rentAmount', {
                  rules: [
                    { required: true, message: '贷款金额未填写' },
                    { type:'string',pattern:/\d$/, message: '输入非法' },
                  ],
                })(
                  <Input type='text' addonAfter='元'/>
                )}
              </FormItem>
            </Col>
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
        <div className='secondHouseSellLoanApply_custType'>
          <span className='secondHouseSellLoanApply_custType_label'>客户类型</span>
          <RadioGroup onChange={(e)=>onCusTypeChange(e.target.value)} value={selectCusType}>
            <RadioButton value='已参加工作'>已参加工作</RadioButton>
            <RadioButton value='学生'>学生</RadioButton>
          </RadioGroup>
          <div className='secondHouseSellLoanApply_custType_content'>
            <CheckboxGroup options={commonsCusTypeOpts} value={cusTypeValue} onChange={(value)=>cusTypeValueChange(value)}/>
            {selectCusType==='已参加工作' && <div>
              <span style={{display:'block'}}>已参加工作的用户申请必备材料如下(以下五项至少选择两项)</span>
              <CheckboxGroup options={workerCusTypeOpts} value={cusTypeValue} onChange={(value)=>cusTypeValueChange(value)}/>
            </div>}
          </div>
        </div>
        </DxPanelMini>
      </div>
    </StepsModal>
  )
};

function filterAuditor(input, option){
  return option.props.children.indexOf(input) >= 0;
}
export default Form.create()(SHRentLoanApplyModal);
