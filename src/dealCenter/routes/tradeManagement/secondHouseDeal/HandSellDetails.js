import React from 'react'
import {connect} from 'dva'
import DxPanel from '../../../../commons/components/DxPanel'
import { routerRedux } from 'dva/router'
//模拟图片数据
import img4 from '../../../assets/4.jpg'
//测试css
import RejectionReason from './RejectionReason'
import ApplyTransfer from '../../../components/Modals/ApplyTransfer'
import './HandSellDetails.css'
import {Table,Timeline,Row,Col,Button} from 'antd'
function HandSellDetails({dispatch,secondDeal,location}){
  const state=secondDeal;
  const {currentChildDetail}=secondDeal;
  const child=(function(){
    switch(currentChildDetail){
      case 'RejectionReason' : return <RejectionReason/>;
      case 'ApplyTransfer' : return <ApplyTransfer/>
       default :return null
    }
  })();

  const houseResourceDetails=()=>{
    console.log("您点击了房源详情")
    dispatch(routerRedux.push('/dealManagement/secondHouseSellDeal/HouseResourceInfo'))
  }
  //模拟意向房源表格数据
  const columns=[{
    title:'房源编号',
    dataIndex:'houseNumber'
    },{
    title:'所属小区',
    dataIndex:'belongArea'
    },{
    title:'物业类型',
    dataIndex:'propertyType'
    },{
    title:'房源信息',
    dataIndex:"houseDetails"
    },{
    title:'房源面积',
    dataIndex:'houseS'
    },{
    title:'房源单价',
    dataIndex:'housePrice'
    },{
    title:'房源总价',
    dataIndex:'houseTotalPrice'
    },{
    title:'支持付款',
    dataIndex:'pay'
    },{
    title:'操作',
    dataIndex:"operation"
  }]
  const data=[{
    key:"1",
    houseNumber:'332005469041',
    belongArea:'远洋山水',
    propertyType:'住宅',
    houseDetails:'A区域/1号楼/1单元/7层/7002室',
    houseS:'100㎡',
    housePrice:'1000元/㎡',
    houseTotalPrice:'200万/套',
    pay:'支持',
    operation:<span className='newhousedeal-operation' onClick={houseResourceDetails}>房源详情</span>
  }]

  //模拟房源报成交记录数据
  const TimelineData=[{
      key:1,
      data:"2010-10-24 19: 00   由   林八千 挂牌房源[合作成交]",
    },{
      key:2,
      data:'2010-10-24  20:00   由 林枫 办理二手房意向金业务。 ',
    },{
      key:3,
      data:'2010-10-24  20:00   由   黄林枫  报成交。',
    },{
      key:4,
      data:'2010-10-24  20:00   由  张三 办理二手房首付款业务。',
    },{
      key:5,
      data:'2010-10-24  20:00   由  李四 办理二手房中介佣金业务。',
    },{
      key:6,
      data:'2010-10-24  20:00   由  小六 办理二手房贷款业务。',
    },{
      key:7,
      data:'2010-10-24  22:00   由  小七 办理房屋过户业务。',
    },{
      key:8,
      data:'2010-10-24  22:00   由  小八 房屋成交申请。'
    }]

//模拟已支付意向金数据
  const columns1=[{
      title:'订单编号',
      dataIndex:'orderNumber'
    },{
      title:"支付方式",
      dataIndex:'pay'
    },{
      title:'支付流水号',
      dataIndex:'payNubmer'
    },{
      title:'支付时间',
      dataIndex:'payTime'
    },{
      title:"支付客户",
      dataIndex:'payCustomer'
    },{
      title:'支付手机号',
      dataIndex:'payPhoneNumber'
    },{
      title:"意向单价",
      dataIndex:'wantPrice'
    },{
      title:"意向总价",
      dataIndex:'wantTotalPrice'
    },{
      title:'支付意向金',
      dataIndex:"payMoney"
    },{
      title:"支付状态",
      dataIndex:'payState'
    }]
  const payMoney=[{
    key:1,
    orderNumber:332005469041,
    pay:'POS机支付/工商银行',
    payNubmer:65535,
    payTime:'2016-10-24 19:00',
    payCustomer:'张三',
    payPhoneNumber:1120050558,
    wantPrice:'10000元/㎡',
    wantTotalPrice:'200万',
    payMoney:'10000元',
    payState:'已抵扣首付'
  }]

//模拟已支付首付款数据
  const columns2=[{
      title:'订单编号',
      dataIndex:'orderNumber'
    },{
      title:"支付方式",
      dataIndex:'pay'
    },{
      title:'支付流水号',
      dataIndex:'payNubmer'
    },{
      title:'支付时间',
      dataIndex:'payTime'
    },{
      title:'成交总价',
      dataIndex:'dealTotalPrice'
    },{
      title:"支付客户",
      dataIndex:'payCustomer'
    },{
      title:'支付手机号',
      dataIndex:'payPhoneNumber'
    },{
      title:'首付款比例',
      dataIndex:'firstPayRoat'
    },
    // {
    //   title:"意向金抵扣",
    //   dataIndex:'wantMoneyDeduction'
    // },
    {
      title:"支付金额",
      dataIndex:'payMoney'
    },{
      title:"支付状态",
      dataIndex:'payState'
  }]
  const payMoney1=[{
    key:1,
    orderNumber:332005469041,
    pay:'POS机支付/工商银行',
    payNubmer:65535,
    payTime:'2016-10-24 19:00',
    dealTotalPrice:'250万元',
    payCustomer:'张三',
    payPhoneNumber:1120050558,
    firstPayRoat:'1%',
    wantMoneyDeduction:'10000元',
    payMoney:'10000元',
    payState:'已抵扣首付'
  }]

//模拟已支付佣金数据
  const columns3=[{
      title:'订单编号',
      dataIndex:'orderNumber'
    },{
      title:'支付流水号',
      dataIndex:'payNubmer'
    },{
      title:'实际成交单价',
      dataIndex:'actualTransactionPrice'
    },{
      title:'实际成交总价',
      dataIndex:'actualTransactionTotalPrice'
    },{
      title:"支付方式",
      dataIndex:'pay'
    },{
      title:'承担方',
      dataIndex:'bearParty'
    },{
      title:'佣金比例',
      dataIndex:'commissionRate'
    },{
      title:"交易服务费",
      dataIndex:'TransactionServiceFee'
    },{
      title:"支付金额",
      dataIndex:'payMoney'
    },{
      title:'支付时间',
      dataIndex:'payTime'
    },{
      title:"支付状态",
      dataIndex:'payState'
  }]
  const payMoney2=[{
    key:1,
    orderNumber:332205469041,
    pay:'POS机支付/工商银行',
    payNubmer:65535,
    payTime:'2016-10-24 19:00',
    payMoney:'10000元',
    payState:'成功',
    actualTransactionPrice:'20000元/㎡',
    actualTransactionTotalPrice:'200万',
    bearParty:'买方承担',
    commissionRate:'1%',
    TransactionServiceFee:'1%',
  }]

//注册返回按钮点击事件
 const handleBack=()=>{
   dispatch(routerRedux.push('/dealManagement/secondHouseSellDeal/SecondHouseSellIndex'))
 }
  return(
    <div>
      <DxPanel title="报成交经纪人">
        <div className="transactionBroker">
          <img src={img4} className="transactionBroker_img"/>
          <div className="transactionBroker">
            <Row>姓名: 黄林峰</Row>
            <Row>性别: 男</Row>
            <Row>电话: 12345678912</Row>
          </div>
        </div>
      </DxPanel>
      <DxPanel title="报成交客户">
        <div className="transactionBroker">
          <Row>姓名: 黄林峰</Row>
          <Row>电话: 12345678912</Row>
          <Row>身份证: 100000000000000000</Row>
        </div>
      </DxPanel>
      <DxPanel title="客户所属经纪人">
        <div className="transactionBroker">
          <img src={img4} className="transactionBroker_img"/>
          <Row>姓名: 黄林峰</Row>
          <Row>电话: 12345678912</Row>
          <Row>身份证: 100000000000000000</Row>
        </div>
      </DxPanel>
      <DxPanel title="合作成交佣金分配比例">
        <div className="transactionBroker">
          <Row>买方经纪人: 20%</Row>
          <Row>卖方经纪人: 80%</Row>
        </div>
      </DxPanel>
      <DxPanel title="意向房源">
        <div className="transactionBroker">
          <Table columns={columns} dataSource={data} pagination={false}/>
        </div>
      </DxPanel>
      <DxPanel title="房源委托信息">
        <div className="transactionBroker">
          <img src={img4} className="transactionBroker_img"/>
          <img src={img4} className="transactionBroker_img"/>
          <img src={img4} className="transactionBroker_img"/>
        </div>
      </DxPanel>
      <DxPanel title="房源报成交记录">
        <div className="transactionBroker">
          <Timeline>
            {TimelineData.map(item=><Timeline.Item key={item.key}>{item.data}</Timeline.Item>)}
          </Timeline>
        </div>
      </DxPanel>
      {state.showIntentionToPay?<DxPanel title="已支付意向金">
        <div className="transactionBroker">
          <Table columns={columns1} dataSource={payMoney} pagination={false}/>
        </div>
      </DxPanel>:null}
      {state.showIntentionalContractAgreement?<DxPanel title="意向合同/协议">
        <div className="transactionBroker">
          <img src={img4} className="transactionBroker_img"/>
          <img src={img4} className="transactionBroker_img"/>
          <img src={img4} className="transactionBroker_img"/>
          <img src={img4} className="transactionBroker_img"/>
        </div>
      </DxPanel>:null}
      {state.showPayTheFirstPayment?<DxPanel title="已支付首付款">
        <div className="transactionBroker">
          <Table columns={columns2} dataSource={payMoney1} pagination={false}/>
        </div>
      </DxPanel>:null}
      {state.showFirstPaymentAgreement?<DxPanel title="首付款协议/合同">
        <div className="transactionBroker">
            <img src={img4} className="transactionBroker_img"/>
            <img src={img4} className="transactionBroker_img"/>
            <img src={img4} className="transactionBroker_img"/>
        </div>
      </DxPanel>:null}
      {state.showPaidCommission?<DxPanel title="已支付佣金">
        <div className="transactionBroker">
          <Table columns={columns3} dataSource={payMoney2} pagination={false}/>
        </div>
      </DxPanel>:null}
      {state.showTradingCommissionAgreement?<DxPanel title="买卖居间协议/佣金协议">
        <div className="transactionBroker">
          <img src={img4} className="transactionBroker_img"/>
          <img src={img4} className="transactionBroker_img"/>
        </div>
      </DxPanel>:null}
      {state.showHousingLoanInformation?<DxPanel title="房源贷款信息">
        <div className="transactionBroker">
          <Timeline>
            <Timeline.Item>2015-10-24 19:00  由黄林枫  申请贷款  等待张三办理贷款</Timeline.Item>
            <Timeline.Item>2015-10-24 19:00  由张三办理受理 办理贷款</Timeline.Item>
            <Timeline.Item>2015-10-24 19:00  由张三 完成贷款流程并批款。</Timeline.Item>
          </Timeline>
          <img src={img4} className="transactionBroker_img"/>
          <img src={img4} className="transactionBroker_img"/>
          <img src={img4} className="transactionBroker_img"/>
        </div>
      </DxPanel>:null}
      {state.showHousingTransferInformation?<DxPanel title="房屋过户信息">
        <div className="transactionBroker">
          <Timeline>
            <Timeline.Item>2015-10-24 19:00  由黄林枫  申请贷款  等待李四办理过户
              <span className="applicationNotes">申请备注：客户着急过户，得抓紧时间处理</span>
            </Timeline.Item>
            <Timeline.Item>2015-10-24 19:00  由张三办理受理 办理过户</Timeline.Item>
            <Timeline.Item>2015-10-24 19:00  由张三 完成过户流程。</Timeline.Item>
          </Timeline>
          <img src={img4} className="transactionBroker_img"/>
          <img src={img4} className="transactionBroker_img"/>
          <img src={img4} className="transactionBroker_img"/>
        </div>
      </DxPanel>:null}
      {state.showTransactionFundsReleaseAccount?<DxPanel title="成交资金释放账户">
        <div className="transactionBroker">
          <Row>业主姓名: 黄林峰</Row>
          <Row>开户银行: 中国工商银行</Row>
          <Row>开户支行: 海淀区硅谷支行</Row>
          <Row>开户银行卡号: 6223321312312312321231</Row>
          <Row>业主联系电话: 15120050558</Row>
          <Row>释放金额: 65535 元 释放类型: 首付款/意向金</Row>
          <img src={img4} className="transactionBroker_img"/>
          <img src={img4} className="transactionBroker_img"/>
        </div>
      </DxPanel>:null}
      {state.showTransactionSet?<DxPanel title="成交分佣设置">
        <div className="transactionBroker">
          <Row>成交佣金总额: 20000 元</Row>
          <Row>平台抽佣: 10%</Row>
          <Row gutter={4}>
            <Col span={3}>佣金总额: 20000 元</Col>
            <Col span={3}>平台佣金: 10%</Col>
            <Col span={3}>交易服务费: 1000 元</Col>
            <Col span={3}>剩余佣金总额: 18000 元</Col>
          </Row>
          <Row gutter={8}>
            <Col span={3}>成交方式: 合作成交</Col>
            <Col span={3}>房源经纪人: 20% 18000 元</Col>
            <Col span={3}>客户经纪人: 80% 20000 元</Col>
          </Row>
        </div>
      </DxPanel>:null}
      {state.showHousTransactionInformation?<DxPanel title="房屋成交信息">
        <div className="transactionBroker">
          <Timeline>
            <Timeline.Item>2015-10-24 19:00  由黄林枫  申请成交  等待李四审核成交  <span className="applicationNotes">申请备注：客户着急过户，得抓紧时间处理</span></Timeline.Item>
          </Timeline>
          <img src={img4}/>
          <img src={img4}/>
          <img src={img4}/>
          <Timeline>
            <Timeline.Item>2017-10-24  19：00 由张三申请成交 等待李四审核。</Timeline.Item>
            <Timeline.Item>2017-10-25  20：00 由李四审核通过，等待财务 李白审核并执行分佣。</Timeline.Item>
            <Timeline.Item>2017-10-26  21：00 由财务 李白审核通过，佣金将在 1~2 个工作日由第三方代发机构执行分佣。
            </Timeline.Item>
            <Timeline.Item>2017-10-27  22：00 由第三方代付机构执行分佣。</Timeline.Item>
          </Timeline>
          <div className="distributionOfCommission">
            <Row>
              佣金分配明细
            </Row>
            <Row gutter={4}>
              <Col span={3}>佣金总额: 20000 元</Col>
              <Col span={3}>平台佣金: 10%</Col>
              <Col span={3}>剩余佣金总额: 18000 元</Col>
            </Row>
            <Row gutter={4}>
              <Col span={3}>成交方式: 合作成交</Col>
              <Col span={3}>房源经纪人: 20% 18000 元</Col>
              <Col span={3}>客户经纪人: 80% 20000 元</Col>
            </Row>
            <Row gutter={4}>
              <Col span={3}>房源经纪人: 李峰</Col>
              <Col span={3}>佣金比例: 40%</Col>
              <Col span={6}>银行账号: 6222********066[农业银行]</Col>
            </Row>
            <Row gutter={4}>
              <Col span={3}>客户经纪人: 李白</Col>
              <Col span={3}>佣金比例: 60%</Col>
              <Col span={6}>银行账号: 6222********066[招商银行]</Col>
            </Row>
          </div>
          <div className="detailsOfTheReleaseOfFunds">
            <Row>
              资金释放明细
            </Row>
            <Row>释放类型：意向金/首付款</Row>
            <Row>释放金额：65535 元</Row>
            <Row>业主姓名：黄林枫</Row>
            <Row>开户银行：中国支付硅谷支行</Row>
            <Row>开户银行卡户：622232323123213123123</Row>
            <Row>联系电话：15120050058</Row>
            <Row>释放状态：已释放</Row>
          </div>
        </div>
      </DxPanel>:null}
      {child?child:<Button type="ghost" onClick={handleBack}>返回</Button>}
    </div>
  )
}

function mapStateToProps({secondDeal}){
  return{secondDeal}
}

export default connect(mapStateToProps)(HandSellDetails)
