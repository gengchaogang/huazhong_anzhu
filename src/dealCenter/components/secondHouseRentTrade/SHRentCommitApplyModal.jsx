import React, { PropTypes } from 'react';
import {Input,Row,Col,Table,Form,Select,Button,Radio,} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import StepsModal from '../../../commons/UI/StepsModal'
import DxShowMsgForm from '../../../commons/UI/DxShowMsgForm'
import DxUpLoadPic from '../../../commons/View/DxUpLoadPic'
import DxPanelMini from '../../../commons/components/DxPanelMini'
import './SHRentCommitApplyModal.css'
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const stepsModalProps={
  title:'二手房-出租成交申请',
  stepList:[
    {
      title:'申请成交'
    },{
      title:'成交审核'
    },{
      title:'财务审核'
    },{
      title:'分佣'
    }
  ],
  width:1000,
  stepStatus:'process',
  current:0,
}
const houseColumns=[
  {
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
  },{
    title:'出租佣金',
    dataIndex:'rentCommission',
    key:'rentCommission',
  },{
    title:'房源经纪人',
    dataIndex:'brokerName',
    key:'brokerName',
  },{
    title:'租户经纪人',
    dataIndex:'customerBrokerName',
    key:'customerBrokerName',
  }
];
const upLoadProps={
  url:'/miss-anzhu-aliyun-file/putfile',
  maxNum:5,
  maxSize:2,
  hideName:true,
  showDetail:true,
  doCover:false,
};
const SHRentCommitApplyModal = ({
  visible,
  houseInfo,
  auditorList,
  commissionInfo,
  upLoadPicList,
  onOk,
  onCancel,
  upPicChange,
  isFailCommit,
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
        <DxPanelMini title='成交房源'>
          <Table pagination={false} columns={houseColumns} dataSource={[JSON.parse(houseInfo)]}/>
        </DxPanelMini>
        <DxPanelMini title='佣金分配' hasPadding={true}>
          <div>
          {!!commissionInfo && <DxShowMsgForm msgData={JSON.parse(commissionInfo)}/>}
          </div>
        </DxPanelMini>
        <DxPanelMini title='成交信息' hasPadding={true}>
        <Form>
          {isFailCommit && <Row>
          <Col sm={24} md={12}>
            <FormItem
              label='失败成交选项'
              {...formItemLayout}
            >
              {getFieldDecorator('failCommitReason', {
                initialValue:'客户违约',
                rules: [
                  { required: true, message: '失败成交选项未选择' },
                ],
              })(
                <RadioGroup>
                  <Radio value={'客户违约'}>客户违约</Radio>
                  <Radio value={'业主违约'}>业主违约</Radio>
                  <Radio value={'交易无法促成'}>交易无法促成</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>}
          <Row>
            <Col sm={24} md={12}>
              <FormItem
                label='成交理由'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('reason', {
                  rules: [
                    { required: true, message: '成交理由未填写' },
                  ],
                })(
                  <Input type='text' placeholder='请在此输入成交理由'/>
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
        <DxUpLoadPic {...upLoadProps} changeList={upPicChange}
        showPicList={upLoadPicList}/>
      </DxPanelMini>
      </div>
    </StepsModal>
  )
};

function filterAuditor(input, option){
  return option.props.children.indexOf(input) >= 0;
}
export default Form.create()(SHRentCommitApplyModal);
