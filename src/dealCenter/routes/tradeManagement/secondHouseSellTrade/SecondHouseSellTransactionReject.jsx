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

import './SecondHouseSellTransaction.css'
const testPicUrl='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1485963222457&di=a7fdc66f5e518ea13fcce368e1948300&imgtype=0&src=http%3A%2F%2Fwww.qqwangming.org%2Fuploads%2Fallimg%2F131111%2F1_131111101729_8.png';

const SecondHouseSellTransactionReject = ({location, dispatch,secondHouseSellTransactionReject}) => {

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

  const columns=[
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
  const rejectReason='就是驳回了啊'
  return (
    <div className='secondHouseRelieveLoan'>
      <ReportBroker {...reportBrokerData}/>
      <CustomerInformation {...customerData}/>
      <ReportBroker {...belongBrokerData}/>
      <ReportBroker {...dealCommission}/>
      <DxPanel title='意向房源'>
        <Table pagination={false} columns={columns} dataSource={houseTableData}/>
      </DxPanel>
      <DxPanel title='房源委托信息'>
        <PicList picListData={entrustPicList}/>
      </DxPanel>
      <TimelineComponents timelineData={reportRecordData} title='房源报成交记录' remarks={false}/>
      <DxPanel title='驳回理由'>
        <p>{rejectReason}</p>
      </DxPanel>
      <div className='dx_bottom_buttonBox'>
        <Button type='ghost' onClick={()=>{alert('返回')}}>返回</Button>
      </div>
    </div>
  )
}

SecondHouseSellTransactionReject.propTypes = {
  secondHouseSellTransactionReject: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps({secondHouseSellTransactionReject}) {
  return {secondHouseSellTransactionReject}
}

export default connect(mapStateToProps)(SecondHouseSellTransactionReject)
