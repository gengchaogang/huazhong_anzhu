import React, { PropTypes } from 'react';
import { Input, Modal,Row,Col,Steps,Table,Form,Select,Icon} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const Step = Steps.Step;
import DxShowMsgForm from '../../../commons/UI/DxShowMsgForm'
import DxUpLoadPic from '../../../commons/View/DxUpLoadPic'
import './CreatTransactionsModal.css'

const tableProps={
  columns:[
    {
      title: '所属项目',
      dataIndex: 'project',
      key: 'project',
    },{
      title: '物业类型',
      dataIndex: 'propertyType',
      key: 'propertyType',
    },{
      title: '成交房源',
      dataIndex: 'intentionHouse',
      key: 'intentionHouse',
      render:(text,obj)=><span>{`${obj.houseArea}/${obj.houseType}/${obj.houseMeasure}`}</span>,
    },{
      title: '团购优惠',
      dataIndex: 'groupBuyType',
      key: 'groupBuyType',
    },{
      title: '实际成交单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
    },{
      title: '实际成交总价',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
    },{
      title: '成交佣金',
      dataIndex: 'commission',
      key: 'commission',
    },{
      title: '成交经纪人',
      dataIndex: 'agent',
      key: 'agent',
    },{
      title: '申请时间',
      dataIndex: 'time',
      key: 'time',
    },{
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render:text=><span>交易详情</span>
    }
  ],
  pagination:false,
}

const CreatTransactionsModal = ({
  visible,
  item,
  onOk,
  onCancel,
  tableData,
  showPicList,
  transactionData,
  auditingModal,
  uploadChange,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },
  }) => {
  const modalOpts = {
    title:'新房-成交申请',
    visible,
    onOk: onOk,
    okText:'选择审核负责人',
    onCancel:onCancel,
    width:1000
  };
  const auditingModalProps={
    visible:auditingModal.visible,
    onOk:auditingModal.onOk,
    onCancel:auditingModal.onCancel,
    title:'请选择审核对象',
  }
  const children=auditingModal.staffData.map((item,key)=><Option key={`audit_${key}`} value={item.value} checkName={item.name}><Icon type='user' />{item.name}</Option>)
  const {staffData}=auditingModal;
  const upLoadProps={
    url:'/miss-anzhu-aliyun-file/putfile',
    maxNum:5,
    maxSize:2,
    hideName:true,
    showDetail:true,
    changeList:uploadChange,
    doCover:false,
    showPicList,
  };
  return (
    <Modal {...modalOpts}>
      <Steps current={0}>
        <Step title='申请成交'/>
        <Step title='成交审核'/>
        <Step title='财务审核'/>
        <Step title='执行分佣'/>
      </Steps>
      <Table dataSource={tableData} {...tableProps}/>
      <DxShowMsgForm msgData={transactionData}/>
      <Form horizontal>
        <Row>
          <Col lg={24} md={24}>
            <FormItem
              label='申请说明：'
              hasFeedback
              labelCol={{span: 6}}
              wrapperCol={{span: 14}}
            >
              {getFieldDecorator('explain', {
                rules: [
                  { required: true, message: '申请说明未填写' },
                  { max: 20, message: '申请说明过长' },
                ],
              })(
                <Input type='textarea' placeholder='请输入申请说明，最多20个字'/>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
      <DxUpLoadPic {...upLoadProps}/>
      <Modal {...auditingModalProps} maskClosable={false} width={300}>
        <Select showSearch
           optionFilterProp='children'
           multiple={true}
           style={{ width: '100%' }}
           placeholder='请选择审核对象'
           notFoundContent='没有匹配的内容'
           onChange={(value)=>auditingModal.onChange}
           value={auditingModal.slectValue}
         >
           {children}
         </Select>
      </Modal>
    </Modal>
  );
};
export default Form.create()(CreatTransactionsModal);
