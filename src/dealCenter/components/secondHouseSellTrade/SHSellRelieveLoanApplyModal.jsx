import React, { PropTypes } from 'react';
import {Input,Row,Col,Table,Form,Select,Button,Checkbox,Radio} from 'antd';
import { Link } from 'dva/router'
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import StepsModal from '../../../commons/UI/StepsModal'
import DxUpLoadPic from '../../../commons/View/DxUpLoadPic'
import DxPanelMini from '../../../commons/components/DxPanelMini'
import './SHSellRelieveLoanApplyModal.css'
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const stepsModalProps={
  title:'二手房-解押申请',
  stepList:[
    {
      title:'解押申请'
    },{
      title:'解押办理'
    },{
      title:'已批款'
    }
  ],
  width:1000,
  stepStatus:'process',
  current:0,
}
const houseColumns=[
  {
    title:'房源编号',
    dataIndex:'resourcesNumber',
    key:'resourcesNumber',
  },{
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
    title:'房源单价',
    dataIndex:'price',
    key:'price',
  },{
    title:'房源总价',
    dataIndex:'totalPrice',
    key:'totalPrice',
  },{
    title:'支持贷款',
    dataIndex:'loan',
    key:'loan',
    render:bool=><span>{!!bool?'支持':'不支持'}</span>,
  },{
    title:'操作',
    dataIndex:'operation',
    key:'operation',
    render:(text,record)=><Link className='deal_operation' to={{
      pathname:'/tradeManagement/secondHouseSellTrade/secondHouseSellTradeInfoDetails',
      state:{
        transCode:record.transCode,
      }
    }}>交易详情</Link>,
  },
];
const upLoadProps={
  url:'/miss-anzhu-aliyun-file/putfile',
  maxNum:5,
  maxSize:2,
  hideName:true,
  showDetail:true,
  doCover:false,
};
const SHSellRelieveLoanApplyModal = ({
  visible,
  houseInfo,
  auditorList,
  upLoadPicListChange,
  upLoadPicList,
  confirmLoading,
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
  console.log(';houseInfo',houseInfo);
  return(
    <StepsModal {...stepsModalProps} confirmLoading={confirmLoading} onCancel={closeModal} visible={visible} footer={<div>
      <Button type='ghost' onClick={closeModal}>取消</Button>
      <Button type='primary' onClick={updateApplyForm}>提交申请</Button>
    </div>} onCancel={closeModal}>
      <div className='secondHouseSellLoanApply_modal_content'>
        <DxPanelMini title='解押房源'>
          <Table pagination={false} columns={houseColumns} dataSource={[JSON.parse(houseInfo)]}/>
        </DxPanelMini>
        <DxPanelMini title='解押申请信息' hasPadding={true}>
        <Form>
          <Row>
            <Col sm={24} md={12} className='dx_col_addonAfter'>
              <FormItem
                label='解押贷款金额'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('loanAmount', {
                  rules: [
                    { required: true, message: '解押贷款金额未填写' },
                    { type:'string',pattern:/\d$/, message: '格式不正确' },
                  ],
                })(
                  <Input type='text' placeholder='请在此输入解押贷款金额' addonAfter='元'/>
                )}
              </FormItem>
            </Col>
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
          </Row>
          <Row>
            <Col sm={24} md={12}>
              <FormItem
                label='业主联系电话'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('ownerPhone', {
                  rules: [
                    { required: true, message: '业主联系电话未填写' },
                    { type:'string',pattern:/^1\d{10}$/, message: '联系方式格式不正确！' },
                  ],
                })(
                  <Input type='text' placeholder='请在此输入业主联系电话' />
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <FormItem
                label='解押说明'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('explain', {
                  rules: [
                    { required: true, message: '解押说明未填写' },
                  ],
                })(
                  <Input type='text' placeholder='请在此输入解押说明'/>
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
        <DxUpLoadPic {...upLoadProps} changeList={upLoadPicListChange}
        showPicList={upLoadPicList}/>
        </DxPanelMini>
      </div>
    </StepsModal>
  )
};

function filterAuditor(input, option){
  return option.props.children.indexOf(input) >= 0;
}
export default Form.create()(SHSellRelieveLoanApplyModal);
