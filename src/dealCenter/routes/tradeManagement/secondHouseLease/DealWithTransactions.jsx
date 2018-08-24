import React from 'react'
import {connect} from 'dva'
import {Table,InputNumber,Button,Timeline,Radio,Form,Row,Col} from 'antd'
import DxPanel from '../../../../commons/components/DxPanel';
import textPic from '../../../assets/yay.jpg'
import { routerRedux } from 'dva/router'
import './DealWithTransactions.css'

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
function DealWithTransactions({dispatch,
  form:{
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }
  }){
  const routePush=(path)=>{
    if(path && path.length!==0){
      dispatch(routerRedux.push({
        pathname: `/dealManagement/houseLeaseDeal/${path}`,
      }));
    }
  }
  const goBack=()=>{
    dispatch(routerRedux.goBack());
  }
  const doSubmit=()=>{
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = { ...getFieldsValue()};
      console.log(data,'data');
    });
  }
  const applicationLeaseTable=[
    {
      title: '房源编号',
      dataIndex: 'inventoryNumber',
      key: 'inventoryNumber',
    },
    {
      title: '所属小区',
      dataIndex: 'residentialArea',
      key: 'residentialArea',
    },
    {
      title: '物业类型',
      dataIndex: 'propertyType',
      key: 'propertyType',
    },
    {
      title: '房源信息',
      dataIndex: 'houseInformation',
      key: 'houseInformation',
    },
    {
      title: '房源面积',
      dataIndex: 'houseArea',
      key: 'houseArea',
    },
    {
      title: '租金/押金',
      dataIndex: 'rentDeposit',
      key: 'rentDeposit',
    },
    {
      title: '租期',
      dataIndex: 'leaseTerm',
      key: 'leaseTerm',
    },
    {
      title: '房租',
      dataIndex: 'rent',
      key: 'rent',
    },
    {
      title: '出租方式',
      dataIndex: 'rentalMode',
      key: 'rentalMode',
    },
    {
      title: '操作',
      dataIndex:'operation',
      key: 'operation',
      render:text=><div className='newhousedeal-operation' onClick={()=>routePush('listingDetails')}>房源详情</div>
    },
  ]
  const applicationLeaseTableData=[
    {
      inventoryNumber:'332005469041',
      residentialArea:'远洋山水',
      propertyType:'住宅',
      houseInformation:'A区域/1号楼/1单元/7层/7002室',
      houseArea:'100㎡',
      rentDeposit:'押1付3',
      leaseTerm:'1年',
      rent:'85000元/月',
      rentalMode:'整租',
    }
  ]
  const houseRecord=[
    {
      timeStamp:'2010-10-24 19:00',
      content:'由 林八千 挂牌出租',
    },{
      timeStamp:'2010-10-24 19:00',
      content:'由 林八千  报出租',
    },{
      timeStamp:'2010-10-24 19:00',
      content:'由 林峰  驳回申请',
    }
  ];
  const rentalCommissionsPaidTable=[
    {
      title: '订单编号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
    },
    {
      title: '支付流水号',
      dataIndex: 'paySerialNumber',
      key: 'paySerialNumber',
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },

    {
      title: '意向租金',
      dataIndex: 'intentRent',
      key: 'intentRent',
    },
    {
      title: '支付用户',
      dataIndex: 'payUser',
      key: 'payUser',
    },
    {
      title: '支付时间',
      dataIndex: 'paymentTime',
      key: 'paymentTime',
    },
    {
      title: '支付意向金',
      dataIndex: 'paymentIntentionMoney',
      key: 'paymentIntentionMoney',
    },
    {
      title: '支付状态',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
    },
  ]
  const rentalCommissionsPaidTableData=[
    {
      orderNumber:'332005469041',
      paySerialNumber:'65535',
      paymentMethod:'POS机支付/工商银行',
      intentRent:'6000元/月',
      payUser:'15120050558',
      paymentTime:'2016-10-24 19:00',
      paymentIntentionMoney:'5500元',
      paymentStatus:'已支付 已抵扣佣金',
    }
  ]
  const intentionRentGold=[
    {
      title: '订单编号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: '支付流水号',
      dataIndex: 'paySerialNumber',
      key: 'paySerialNumber',
    },
    {
      title: '实际成交租金',
      dataIndex: 'actualTransactionRent',
      key: 'actualTransactionRent',
    },
    {
      title: '支付用户',
      dataIndex: 'payUser',
      key: 'payUser',
    },
    {
      title: '支付时间',
      dataIndex: 'paymentTime',
      key: 'paymentTime',
    },
    // {
    //   title: '意向金抵扣',
    //   dataIndex: 'intentGoldDeduction',
    //   key: 'intentGoldDeduction',
    // },
    {
      title: '实际支付佣金',
      dataIndex: 'actualCommissionPaid',
      key: 'actualCommissionPaid',
    },
    {
      title: '支付状态',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
    },
  ]
  const intentionRentGoldTable=[
    {
      orderNumber:'332005469041',
      paymentMethod:'POS机支付/工商银行',
      paySerialNumber:'65535',
      actualTransactionRent:'6000元/月',
      payUser:'15120050558',
      paymentTime:'2016-10-24 19:00',
      intentGoldDeduction:'5500元',
      actualCommissionPaid:'500元',
      paymentStatus:'已支付',
    }
  ]
  return(
    <div>
      <DxPanel title='报出租经纪人'>
        <div className='agent' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='agentword'>
          <div>姓名：黄林枫</div>
          <div>性别：男</div>
          <div>电话：15120050558</div>
        </div>
      </DxPanel>
      <DxPanel title='租户'>
        <div>姓名：黄林枫</div>
        <div>性别：男</div>
      </DxPanel>
      <DxPanel title='租户所属经纪人'>
        <div className='agent' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='agentword'>
          <div>姓名：黄林枫</div>
          <div>性别：男</div>
          <div>电话：15120050558</div>
        </div>
      </DxPanel>
      <DxPanel title='合作成交佣金分佣比例'>
        <div>佣金协调时间：2015-10-24 19：00</div>
        <div>出租经纪人：20%</div>
        <div>租户经纪人：80%</div>
      </DxPanel>
      <DxPanel title='出租房源'>
        <Table dataSource={applicationLeaseTableData} columns={applicationLeaseTable}/>
      </DxPanel>
      <DxPanel title='房源委托信息'>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
      </DxPanel>
      <DxPanel title='房源出租记录'>
        <Timeline>
          {houseRecord.map((item,key)=><Timeline.Item key={`timeLine${key}`}>
          <span className='houseRecord-timeStamp'>{item.timeStamp}</span>
          <span className='houseRecord-content'>{item.content}</span>
          </Timeline.Item>)}
        </Timeline>
      </DxPanel>
      <DxPanel title='出租意向金'>
        <Table dataSource={rentalCommissionsPaidTableData} columns={rentalCommissionsPaidTable}/>
      </DxPanel>
      <DxPanel title='租房意向金收据'>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
      </DxPanel>
      <DxPanel title='出租意向金'>
        <Table dataSource={intentionRentGoldTable} columns={intentionRentGold}/>
      </DxPanel>
      <DxPanel title='已上传租房居间合同或收据'>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
      </DxPanel>
      <DxPanel title='租房分期办理进度'>
        <div>贷款信息</div>
        <div>分期客户：黄林峰</div>
        <div>联系点话：15120050558</div>
        <div>贷款金额：5000元</div>
        <div>客户类型：</div>
        <div>已参加工作能提供：身份证、租房合同、劳动合同、公积金、工卡</div>
        <div>办理进度</div>
        <div>2016-10-24 19:00 由黄林枫 申请租房分期    等待  小白  受理。</div>
        <div>2016-10-24 19:00 由小白  已受理租房分期  办理中。</div>
        <div>2016-10-24 21:00 由小白  完成租房分期办理  并由第三方租房分期机构批款。</div>
        <div>
          <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
          <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
          <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        </div>
      </DxPanel>
      <DxPanel title='出租佣金设置'>
        <div>成交佣金总额：20000元</div>
        <div>平台抽佣：10%</div>
        <div>剩余佣金总额：18000元</div>
        <Form>
          <FormItem>
            <RadioGroup>
              <Radio value="a">合作成交</Radio>
              <Radio value="b">自有客户</Radio>
            </RadioGroup>
          </FormItem>
          <Row>
            <Col sm={24} md={12}>
              <FormItem label='买方经纪人' {...formItemLayout}>
                {getFieldDecorator('买方经纪人', {
                  rules: [{ required: true, message: '输入买方经纪人佣金比例' }],
                })(
                  <InputNumber placeholder="输入买方经纪人佣金比例" />
                )}
                <div>佣金收益￥25000元</div>
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <FormItem label='卖方经济人' {...formItemLayout}>
                {getFieldDecorator('卖方经济人', {
                  rules: [{ required: true, message: '输入卖方经纪人佣金比例' }],
                })(
                  <InputNumber placeholder="输入卖方经纪人佣金比例" />
                )}
                <div>佣金收益￥25000元</div>
              </FormItem>
            </Col>
          </Row>
          <FormItem>
            <div className='buttonsDirection'>
              <Button type="primary" onClick={doSubmit}>申请提交</Button>
              <Button type='ghost'onClick={goBack}>返回</Button>
            </div>
          </FormItem>
        </Form>
      </DxPanel>
    </div>
  )
}

function mapStateToProps({dealWithTransactions}){
  return{dealWithTransactions}
}

export default connect(mapStateToProps)(Form.create()(DealWithTransactions))
