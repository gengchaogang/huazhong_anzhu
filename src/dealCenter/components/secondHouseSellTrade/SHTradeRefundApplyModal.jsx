import React, { Component, PropTypes } from 'react'
import {Input,Row,Col,Table,Form,Select,Button,Checkbox,Radio} from 'antd';
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
import StepsModal from '../../../commons/UI/StepsModal'
import DxUpLoadPic from '../../../commons/View/DxUpLoadPic'
import SelectProvinceCity from '../../../commons/components/SelectProvinceCity'
import ShRefundFormItem from '../ShRefundFormItem'

import './SHTradeRefundApplyModal.css'
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
const bankOptions=[
  {
    label:'中国银行',
    value:'中国银行',
  },{
    label:'中国农业银行',
    value:'中国农业银行',
  },{
    label:'中国工商银行',
    value:'中国工商银行',
  },{
    label:'中国建设银行',
    value:'中国建设银行',
  }
];
const stepsModalProps={
  stepList:[
    {
      title:'申请退款',
    },{
      title:'退款审核',
    },{
      title:'财务审核',
    },{
      title:'执行退款',
    }
  ],
  width:1000,
  stepStatus:'process',
  current:0,
}
class SHTradeRefundApplyModal extends React.Component {
  constructor(props){
    super(props);
    this.state={
      refundTo:'客户',
      applyPics:[],
    }
  }
  returnBackApply=()=>{
    const {
      applyCallBack,
      auditorList,
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
      const{auditor}=data;
      let auditorName=null;
      auditorList.map(item=>{
        if(item.id===auditor)auditorName=item.name;
      })
      applyCallBack({
        ...data,
        returnedToOwner:this.state.refundTo==='业主',
        images:this.state.applyPics.map(item=>item.id),
        auditorName,
        transCode,
      })
    });
  }
  closeModal=()=>{
    this.props.closeModal();
    this.props.form.resetFields();
  }
  render(){
    const{
      title,
      visible,
      tableInfo,
      auditorList,
      confirmLoading,
      form:{
        getFieldDecorator,
      },
    }=this.props;
    const tableData=!!tableInfo?JSON.parse(tableInfo):null;
    return(
      <StepsModal {...stepsModalProps} confirmLoading={confirmLoading} title={title} visible={visible} footer={<div>
        <Button type='ghost' onClick={this.closeModal}>取消</Button>
        <Button type='primary' onClick={this.returnBackApply}  loading={confirmLoading}>提交申请</Button>
      </div>} onCancel={this.closeModal}>
        <div className='secondHouseSellLoanApply_modal_content'>
          <b style={{display:'block'}}>订单信息</b>
          {!!tableInfo && <Table pagination={false} columns={tableData.columns} dataSource={[tableData.dataSource]}/>}
          <b style={{display:'block'}}>退款申请信息</b>
          <Form>
            <Row>
              <Col sm={24} md={12}>
                <FormItem
                  label='退款理由'
                  hasFeedback
                  {...formItemLayout}
                >
                  {getFieldDecorator('reason', {
                    rules: [
                      { required: true, message: '退款理由未填写' },
                    ],
                  })(
                    <Input type='text' placeholder='请在此输入退款理由'/>
                  )}
                </FormItem>
              </Col>
              <Col sm={24} md={12}>
                <Row>
                  <Col span={6} className='dhq_label'>收款方：</Col>
                  <Col span={14}>
                    <RadioGroup onChange={(e)=>this.setState({refundTo:e.target.value})} value={this.state.refundTo}>
                      <RadioButton value='客户'>客户</RadioButton>
                      <RadioButton value='业主'>业主</RadioButton>
                    </RadioGroup>
                  </Col>
                </Row>
              </Col>
            </Row>
            {this.state.refundTo==='业主' && <div className='addOwner'>
              {/*<Row>
                <Col sm={24} md={12}>
                  <FormItem
                    label='业主姓名'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('ownerName', {
                      rules: [
                        { required: true, message: '业主姓名未输入' },
                      ],
                    })(
                      <Input placeholder='请在此输入业主姓名'/>
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  <FormItem
                    label='开户银行'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('ownerBank', {
                      rules: [
                        { required: true, message: '开户银行未选择' },
                      ],
                    })(
                      <Select placeholder='请在此选择开户银行'>
                        {bankOptions.map(item=><Option key={`key_${item.value}`} value={item.value}>{item.label}</Option>)}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col sm={24} md={12}>
                  <FormItem
                    label='开户支行'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('ownerBankSubbranch', {
                      rules: [
                        { required: true, message: '开户支行未输入' },
                      ],
                    })(
                      <Input type='text' placeholder='请输入开户支行'/>
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  <FormItem
                    label='开户银行卡号'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('ownerBankCard', {
                      rules: [
                        { required: true, message: '开户银行卡号未输入' },
                      ],
                    })(
                      <Input type='text' placeholder='请输入开户银行卡号'/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col sm={24} md={12}>
                  <FormItem
                    label='业主电话'
                    hasFeedback
                    {...formItemLayout}
                  >
                    {getFieldDecorator('ownerPhone', {
                      rules: [
                        { required: true, message: '业主电话未输入' },
                      ],
                    })(
                      <Input type='text' placeholder='请输入业主电话'/>
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  <FormItem
                    label='业主身份证号码：'
                    hasFeedback
                    {...formItemLayout}
                  >
                    {getFieldDecorator('ownerIDNumber', {
                      rules: [
                        { required: true, message: '业主身份证号未填写' },
                        { type:'string',pattern:/(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证号长度为18位，输入的内容异常' },
                      ],
                    })(
                      <Input type='text' placeholder='请在此输入18位业主身份证号' />
                    )}
                  </FormItem>
                </Col>
              </Row>*/}
              <ShRefundFormItem getFieldDecorator={getFieldDecorator}/>
            </div>}
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
          <DxUpLoadPic {...upLoadProps} changeList={(arr)=>this.setState({applyPics:arr})}
          showPicList={this.state.applyPics}/>
        </div>
      </StepsModal>
    );
  }
}
function filterAuditor(input, option){
  return option.props.children.indexOf(input) >= 0;
}
export default Form.create()(SHTradeRefundApplyModal);
