import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import {Button, Tabs, Input, Row,Table,Timeline} from 'antd';
import { Link } from 'dva/router'
import { routerRedux } from 'dva/router'
import DxPanel from '../../../commons/components/DxPanel';
import textPic from '../../assets/yay.jpg'
import './index.css'
function SecondHouseRentDetails({dispatch,
  rentalBroker,
  tenant,
	tenantOwnedBroker,
	proportionCommissionsCommission,
	rentalListings,
	listingInformation,
	housingRentalRentalRecords,
  listingRecords,
  intentionRentGold,
  intentionRentRentalReceipt,
  rentalCommissionsPaid,
  uploadedRentalContractReceipt,
  rentalContract,
  rentAgreement,
  reasonsRefusal,
  progressRentalInstallments,
  setTransactionSubCommissioned,
  secondHandHouseTransactions,
  }) {
  const goBack=()=>{
    dispatch(routerRedux.goBack());
  }
  const rentalListing=[
    {
      title: '房源编号',
      dataIndex: 'listingNumber',
      key: 'listingNumber',
    },
    {
      title: '所属小区',
      dataIndex: 'belongsDistrict',
      key: 'belongsDistrict',
    },
    {
      title: '物业类型',
      dataIndex: 'propertyType',
      key: 'propertyType',
    },
    {
      title: '房源信息',
      dataIndex: 'listingInformation',
      key: 'listingInformation',
    },
    {
      title: '房源面积',
      dataIndex: 'listingArea',
      key: 'listingArea',
    },
    {
      title: '租金/押金',
      dataIndex: 'rentDeposit',
      key: 'rentDeposit',
    },
    {
      title: '租期',
      dataIndex: 'term',
      key: 'term',
    },
    {
      title: '房租',
      dataIndex: 'rent',
      key: 'rent',
    },
    {
      title: '出租方式',
      dataIndex: 'rentalMethod',
      key: 'rentalMethod',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render:text=><div>房源详情</div>
    },
  ]
  const rentalListingData=[
    {
      key:'1',
      listingNumber:'332005469041',
      belongsDistrict:'远洋山水',
      propertyType:'住宅',
      listingInformation:'A区域/1号楼/1单元/7层/7002室',
      listingArea:'100㎡',
      rentDeposit:'押1付3',
      term:'1年',
      rent:'85000元/月',
      rentalMethod:'整租',
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

	return (
		<div>
      {!!rentalBroker && <DxPanel title='报出租经纪人'>
        <div>
          <div className='agent' style={{backgroundImage:`URL(${textPic})`}}></div>
          <div className='agentword'>
            <div>姓名：黄林枫</div>
            <div>性别：男</div>
            <div>电话：15120050558</div>
          </div>
        </div>
      </DxPanel>}
      {!!tenant && <DxPanel title='租户'>
        <div>
          <div>姓名：黄林枫</div>
          <div>电话：15120050558</div>
        </div>
      </DxPanel>}
      {!!tenantOwnedBroker && <DxPanel title='租户所属经纪人'>
        <div>
          <div className='agent' style={{backgroundImage:`URL(${textPic})`}}></div>
          <div className='agentword'>
            <div>姓名：黄林枫</div>
            <div>性别：男</div>
            <div>电话：15120050558</div>
          </div>
        </div>
      </DxPanel>}
      {!!proportionCommissionsCommission && <DxPanel title='合作成交佣金分佣比例'>
        <div>
          <div>佣金协调时间：2015-10-24 19：00</div>
          <div>出租经纪人：20%</div>
          <div>租户经纪人：80%</div>
        </div>
      </DxPanel>}
      {!!rentalListings && <DxPanel title='出租房源'>
        <Table dataSource={rentalListingData} columns={rentalListing}/>
      </DxPanel>}
      {!!listingInformation && <DxPanel title='房源委托信息'>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
      </DxPanel>}
      {!!listingRecords && <DxPanel title='房源出租记录'>
        <Timeline>
          {houseRecord.map((item,key)=><Timeline.Item key={`timeLine${key}`}>
          <span className='houseRecord-timeStamp'>{item.timeStamp}</span>
          <span className='houseRecord-content'>{item.content}</span>
          </Timeline.Item>)}
        </Timeline>
      </DxPanel>}
      {!!housingRentalRentalRecords && <DxPanel title='房源报出租记录'>
        <Timeline>
          {houseRecord.map((item,key)=><Timeline.Item key={`timeLine${key}`}>
          <span className='houseRecord-timeStamp'>{item.timeStamp}</span>
          <span className='houseRecord-content'>{item.content}</span>
          </Timeline.Item>)}
        </Timeline>
      </DxPanel>}
      {!!intentionRentGold && <DxPanel title='出租意向金'>
        <Table dataSource={rentalListingData} columns={rentalListing}/>
      </DxPanel>}
      {!!intentionRentRentalReceipt && <DxPanel title='租房意向金收据'>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
      </DxPanel>}
      {!!rentalCommissionsPaid && <DxPanel title='已支付租房佣金'>
        <Table dataSource={rentalListingData} columns={rentalListing}/>
      </DxPanel>}
      {!!uploadedRentalContractReceipt && <DxPanel title='已上传租房居间合同或收据'>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
      </DxPanel>}
      {!!progressRentalInstallments && <DxPanel title='租房分期办理进度'>
        <div>贷款信息</div>
        <div>分期客户：黄林枫</div>
        <div>联系电话：15120050558</div>
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
      </DxPanel>}
      {!!setTransactionSubCommissioned && <DxPanel title='成交分佣设置'>
        <div>成交佣金总额：20000元</div>
        <div>平台抽佣：10%</div>
        <div>佣金总额：20000元 平台抽佣：10% 交易服务费：1000元 剩余佣金总额：18000元</div>
        <div>成交方式：合作成交    房源经纪人：20%  18000元  客户经纪人：80%  20000元</div>
      </DxPanel>}
      {!!secondHandHouseTransactions && <DxPanel title='二手房出成交'>
        <div>成交理由：一二三四五六七八九十、一二三四五六七八九十</div>
        <div>
          <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
          <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        </div>
        <div>成交审核信息</div>
        <div>2015-10-24 19:00 由黄林枫申请成交  等待林八千 成交审核</div>
        <div>2015-10-24 19:00  由林八千 审核通过  等待 财务 小白审核并执行分佣</div>
        <div>2015-10-24 19:00 财务 王颖 审核通过 执行分佣  2个工作日内由第三方代发机构进行分佣。</div>
        <div>2015-10-24 19:00 已由第三方代付金钩进行分佣。</div>
        <div>佣金分配明细</div>
        <div>佣金总额：10000元   平台交易抽佣10%   实付佣金:9000元</div>
        <div>房源经纪人：林枫 佣金比例：40%   银行账号：6222********066[农业银行]</div>
        <div>客源经纪人：李白 佣金比例：60%   银行账号：62202*******066[招商银行]</div>
      </DxPanel>}
      {!!rentalContract && <DxPanel title='租房居间合同'>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
      </DxPanel>}
      {!!rentAgreement && <DxPanel title='租房意向金协议'>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
      </DxPanel>
      }
      {!!reasonsRefusal && <DxPanel title='驳回理由'>
        <div>驳回理由一二三四五六七八九十</div>
      </DxPanel>}
      <div className='goBack'>
        <Button onClick={goBack}>返回</Button>
      </div>
		</div>
	);
}
SecondHouseRentDetails.propTypes = {
}
function mapStateToProps({secondHouseRentDetails}) {
	return { secondHouseRentDetails };
}
export default connect(mapStateToProps)(SecondHouseRentDetails)
