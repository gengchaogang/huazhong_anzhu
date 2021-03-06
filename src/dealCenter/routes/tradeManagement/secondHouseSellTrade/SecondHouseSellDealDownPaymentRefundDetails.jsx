import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import {Table,Button} from 'antd'

import DxPanel from '../../../../commons/components/DxPanel'
import PromptModal from '../../../../commons/View/PromptModal'

import ReportBroker from '../../../../commons/UI/tradeItems/ReportBroker'
import CustomerInformation from '../../../../commons/UI/tradeItems/CustomerInformation'
import TimelineComponents from '../../../../commons/UI/tradeItems/TimelineComponents'
import PicList from '../../../../commons/UI/PicList'
import DxShowMsgForm from '../../../../commons/UI/DxShowMsgForm'

import './SecondHouseSellDealDownPaymentRefundDetails.css'
const testPicUrl='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1485963222457&di=a7fdc66f5e518ea13fcce368e1948300&imgtype=0&src=http%3A%2F%2Fwww.qqwangming.org%2Fuploads%2Fallimg%2F131111%2F1_131111101729_8.png';

const SecondHouseSellDealDownPaymentRefundDetails = ({location, dispatch,secondHouseSellDealDownPaymentRefundDetails}) => {

  const reportBrokerData={
    mainBrokerData:[
      {
        label:'姓名',
        value:'黄林峰',
      },{
        label:'性别',
        value:'男',
      },{
        label:'电话',
        value:'15120050558',
      }
    ],
    hasPic:true,
    title:'报成交经纪人',
    picUrl:testPicUrl,
  }
  const customerData={
    mainInformationData:[
      {
        label:'姓名',
        value:'张三',
      },{
        label:'电话',
        value:'15120050558',
      },{
        label:'身份证',
        value:'430621198610264435',
      }
    ],
    title:'报成交客户',
  }
  const belongBrokerData={
    mainBrokerData:[
      {
        label:'姓名',
        value:'黄林峰',
      },{
        label:'性别',
        value:'男',
      },{
        label:'电话',
        value:'15120050558',
      }
    ],
    hasPic:true,
    title:'客户所属经纪人',
    picUrl:testPicUrl,
  }
  const dealCommission={
    mainBrokerData:[
      {
        label:'买方经纪人',
        value:'20%',
      },{
        label:'卖方经纪人',
        value:'80%',
      }
    ],
    hasPic:false,
    title:'合作成交佣金分配比例',
  }

  const houseTableData=[
    {
      id:'111',
      key:`22`,
      village:'111',
      propertyType:'111',
      info:'111',
      area:'111',
      price:'111',
      totalPrice:'111',
      loan:false,
    }
  ]

  const houseColumns=[
    {
      title:'房源编号',
      dataIndex:'id',
      key:'id',
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
      render:(text,house)=><span>房源详情</span>,
    },
  ];
  const entrustPicList=[
    {
      src:testPicUrl,
      title:'出售委托书',
      isCover:false,
      id:'2',
    },{
      src:testPicUrl,
      title:'房产证',
      isCover:false,
      id:'21',
    },{
      src:testPicUrl,
      title:'业主身份证',
      isCover:false,
      id:'23',
    }
  ];
  const reportRecordData=[
    {
      label:'2010-10-24 19: 00',
      value:'由 林八千 挂牌房源[合作成交]',
    },{
      label:'2010-10-24 20: 00',
      value:'由   黄林枫  报成交。',
    },
  ]
  const intentsColumns=[
    {
      title:'订单编号',
      dataIndex:'id',
      key:'id',
    },{
      title:'支付方式',
      dataIndex:'payWay',
      key:'payWay',
    },{
      title:'支付流水号',
      dataIndex:'paySerialNumber',
      key:'paySerialNumber',
    },{
      title:'支付时间',
      dataIndex:'payTime',
      key:'payTime',
    },{
      title:'支付客户',
      dataIndex:'customer',
      key:'customer',
    },{
      title:'支付手机号',
      dataIndex:'phoneNumber',
      key:'phoneNumber',
    },{
      title:'意向单价',
      dataIndex:'price',
      key:'price',
    },{
      title:'意向总价',
      dataIndex:'totalPrice',
      key:'totalPrice',
    },{
      title:'支付意向金',
      dataIndex:'intentsPrice',
      key:'intentsPrice',
    },{
      title:'支付状态',
      dataIndex:'payStatus',
      key:'payStatus',
    }
  ];
const intentsTableData=[
  {
    id:'222',
    payWay:'222',
    paySerialNumber:'222',
    payTime:'222',
    customer:'222',
    phoneNumber:'222',
    price:'222',
    totalPrice:'222',
    intentsPrice:'222',
    payStatus:'222',
  }
]
  const agreementPicList=[
    {
      src:testPicUrl,
      title:'意向合同',
      isCover:false,
      id:'2',
    },{
      src:testPicUrl,
      title:'意向合同',
      isCover:false,
      id:'21',
    },{
      src:testPicUrl,
      title:'意向合同',
      isCover:false,
      id:'23',
    }
  ]
  const refundData={
    timeData:[
      {
        label:'2010-10-24 19: 00',
        value:'由 林八千 挂牌房源[合作成交]',
      },{
        label:'2010-10-24 20: 00',
        value:'由   黄林枫  报成交。',
      },
    ],
    msgData:[
      {
        label:'退款理由',
        value:'就是要亏款',
      }
    ],
    picList:[
      {
        src:testPicUrl,
        title:'',
        isCover:false,
        id:'2',
      },{
        src:testPicUrl,
        title:'',
        isCover:false,
        id:'21',
      },{
        src:testPicUrl,
        title:'',
        isCover:false,
        id:'23',
      }
    ]
  }
  const intentsAgreementList=[
    {
      src:testPicUrl,
      title:'意向合同',
      isCover:false,
      id:'2',
    },{
      src:testPicUrl,
      title:'意向合同',
      isCover:false,
      id:'21',
    },{
      src:testPicUrl,
      title:'意向合同',
      isCover:false,
      id:'23',
    }
  ];
  const downPaymentTableData=[
    {
      id:'11',
      payWay:'11',
      paySerialNumber:'11',
      payTime:'11',
      dealTotalPrice:'11',
      customer:'11',
      phoneNumber:'11',
      proportion:'11',
      intentsDeductible:'11',
      payAmount:'11',
      payStatus:'11',
    }
  ]
  const downPaymentTableColumns=[
    {
      title:'订单编号',
      key:'id',
      dataIndex:'id',
    },{
      title:'支付方式',
      key:'payWay',
      dataIndex:'payWay',
    },{
      title:'支付流水号',
      key:'paySerialNumber',
      dataIndex:'paySerialNumber',
    },{
      title:'支付时间',
      key:'payTime',
      dataIndex:'payTime',
    },{
      title:'成交总价',
      key:'dealTotalPrice',
      dataIndex:'dealTotalPrice',
    },{
      title:'首付款比例',
      key:'proportion',
      dataIndex:'proportion',
    },
    // {
    //   title:'意向金抵扣',
    //   key:'intentsDeductible',
    //   dataIndex:'intentsDeductible',
    // },
    {
      title:'支付金额',
      key:'payAmount',
      dataIndex:'payAmount',
    },{
      title:'支付状态',
      key:'payStatus',
      dataIndex:'payStatus',
    }
  ]
  return (
    <div className='secondHouseSellDealDownPaymentRefundDetails'>
      <ReportBroker {...reportBrokerData}/>
      <CustomerInformation {...customerData}/>
      <ReportBroker {...belongBrokerData}/>
      <ReportBroker {...dealCommission}/>
      <DxPanel title='意向房源'>
        <Table pagination={false} columns={houseColumns} dataSource={houseTableData}/>
      </DxPanel>
      <DxPanel title='房源委托信息'>
        <PicList picListData={entrustPicList}/>
      </DxPanel>
      <TimelineComponents timelineData={reportRecordData} title='房源报成交记录' remarks={false}/>
      <DxPanel title='已支付意向金'>
        <Table pagination={false} columns={intentsColumns} dataSource={intentsTableData}/>
      </DxPanel>
      <DxPanel title='意向合同/协议'>
        <PicList picListData={intentsAgreementList}/>
      </DxPanel>
      <DxPanel title='已支付首付款'>
        <Table pagination={false} columns={downPaymentTableColumns} dataSource={downPaymentTableData}/>
      </DxPanel>
      <TimelineComponents timelineData={refundData.timeData} header={
          <div>
            <DxShowMsgForm msgData={refundData.msgData}/>
            <PicList picListData={refundData.picList}/>
            <span>审核信息</span>
          </div>
        } title='首付款退款办理' remarks={false}/>
      <div className='dx_bottom_buttonBox'>
        <Button type='ghost' onClick={()=>{alert('返回')}}>返回</Button>
      </div>
    </div>
  )
}

SecondHouseSellDealDownPaymentRefundDetails.propTypes = {
  secondHouseSellDealDownPaymentRefundDetails: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps({secondHouseSellDealDownPaymentRefundDetails}) {
  return {secondHouseSellDealDownPaymentRefundDetails}
}

export default connect(mapStateToProps)(SecondHouseSellDealDownPaymentRefundDetails)
