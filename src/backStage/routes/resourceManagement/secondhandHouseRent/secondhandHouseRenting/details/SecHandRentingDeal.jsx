import React from 'react'
import {connect} from 'dva';
import {
  Icon,
  Button,
  Timeline,
  message,
  Table,
} from 'antd';
import {routerRedux} from 'dva/router'
import './secHandRentingDetails.css'
import DxPanel from '../../../../../../commons/components/DxPanel'
import PromptModal from '../../../../../../commons/View/PromptModal'
import SHRentTradeInfo from '../../../../../../commons/components/SHRentTradeInfo'
function SecHandRentingDeal({dispatch,secHandRentingDeal}){
  const {
    promptObj,
    projectId,
    transCode,
    trackJSON,
  }=secHandRentingDeal;
  const intentsInfocolumns=[
    {
      title:'订单编号',
      dataIndex:'id',
    },
    {
      title:'支付方式',
      dataIndex:'payWay',
    },
    {
      title:'支付流水号',
      dataIndex:'paySerialNumber',
    },
    {
      title:'意向租金',
      dataIndex:'commissionAmount',
    },
    {
      title:'支付用户',
      dataIndex:'customer',
    },
    {
      title:'支付时间',
      dataIndex:'payTime',
    },
    {
      title:'支付意向金（元）',
      dataIndex:'rentCommission',
    },
    {
      title:'支付状态',
      dataIndex:'payStatus',
    },
  ]
  const commissionInfocolumns=[
    {
      title:'订单编号',
      dataIndex:'id',
    },
    {
      title:'支付方式',
      dataIndex:'payWay',
    },
    {
      title:'支付流水号',
      dataIndex:'paySerialNumber',
    },
    {
      title:'实际成交租金',
      dataIndex:'',
    },
    {
      title:'支付用户',
      dataIndex:'customer',
    },
    {
      title:'支付时间',
      dataIndex:'payTime',
    },
    {
      title:'意向金抵扣',
      dataIndex:'',
    },
    {
      title:'实际支付佣金',
      dataIndex:'',
    },
    {
      title:'支付状态',
      dataIndex:'payStatus',
    },
  ];
  const intentsInfo=[];
  const commissionInfo=[];
  // if(!!track){
  //   let intentsInfoObj=JSON.parse(track).intentsInfo;
  //   intentsInfoObj.key=1;
  //   intentsInfo.push(intentsInfoObj);
  //   let commissionInfoObj=JSON.parse(track).commissionInfo;
  //   commissionInfoObj.key=1;
  //   commissionInfo.push(intentsInfoObj);
  //   console.log(JSON.parse(track).intentsAgreements);
  // }
  const handleCallBackOk=()=>{

  }
  const handleCallBackCancel=()=>{

  }
  const toPrve=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/secondhandHouseRent/secHandRentingNavBar/secHandRentingRecord',
      state:{
        projectId:projectId
      }
    }))
  }
  const handeBack=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/secondhandHouseRent'
    }))
  }
  return (
    <div className="Renting-strike-hands">
      <PromptModal {...promptObj} onOk={handleCallBackOk} onCancel={handleCallBackCancel}/>
      {!!trackJSON?<SHRentTradeInfo type='backStage' trackJSON={trackJSON}/>:
      <div className="no-info-box">
        <p>
          <Icon type="picture"/>
        </p>
        <div>暂无成交信息</div>
      </div>}
    {/*!!track?
        <div>
          {!!JSON.parse(track).tradingCenterInfo &&<DxPanel title='交易中心'>
              <div>
                {JSON.parse(track).tradingCenterInfo.map((item,index)=>(
                  <div key={`item_${index}`}>
                    <span>{item.label}：</span>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
          </DxPanel>}
          {!!JSON.parse(track).brokerInfo &&<DxPanel title='报出租经纪人'>
            <div className='flexStart'>
              <span className='logo' style={{background:`URL(${JSON.parse(track).brokerInfo.picUrl})`}}></span>
              <div className='flexBetween'>
                {JSON.parse(track).brokerInfo.data.map((item,index)=>(
                  <div key={`item_${index}`}>
                    <span>{item.label}：</span>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </DxPanel>}
          {!!JSON.parse(track).customerInfo &&<DxPanel title='租户'>
            <div className='flexBetween'>
              {JSON.parse(track).customerInfo.map((item,index)=>(
                <div key={`item_${index}`}>
                  <span>{item.label}：</span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          </DxPanel>}
          {!!JSON.parse(track).customerBrokerInfo &&<DxPanel title='客户所属经纪人'>
            <div className='flexStart'>
              <span className='logo' style={{background:`URL(${JSON.parse(track).brokerInfo.picUrl})`}}></span>
              <div className='flexBetween'>
                {JSON.parse(track).customerBrokerInfo.data.map((item,index)=>(
                  <div key={`item_${index}`}>
                    <span>{item.label}：</span>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </DxPanel>}
          {!!JSON.parse(track).dealCommissionProportion &&<DxPanel title='合作成交佣金分配比例'>
            <div className='flexBetween'>
              {JSON.parse(track).dealCommissionProportion.map((item,index)=>(
                <div key={`item_${index}`}>
                  <span>{item.label}：</span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          </DxPanel>}
          {!!JSON.parse(track).intentsInfo &&<DxPanel title='出租意向金'>
            <Table dataSource={intentsInfo} columns={intentsInfocolumns}/>
          </DxPanel>}
          {!!JSON.parse(track).intentsAgreements &&<DxPanel title='租房意向金收据'>
            <div>
              {JSON.parse(track).intentsAgreements.map((item,index)=>(
                <span key={`item_${index}`} className='intentsAgreements' style={{background:`URL(${item.src})`}}></span>
              ))}
            </div>
          </DxPanel>}
          {!!JSON.parse(track).commissionInfo &&<DxPanel title='已支付租房佣金'>
            <Table dataSource={commissionInfo} columns={commissionInfocolumns}/>
          </DxPanel>}
          {!!JSON.parse(track).commissionAgreements &&<DxPanel title='已上传租房居间合同或收据'>
            <div>
              {JSON.parse(track).commissionAgreements.map((item,index)=>(
                <span key={`item_${index}`} className='intentsAgreements' style={{background:`URL(${item.src})`}}></span>
              ))}
            </div>
          </DxPanel>}
          {!!JSON.parse(track).commitCommissionInfo &&<DxPanel title='成交分佣设置'>
            <div className='flexBetween'>
              {JSON.parse(track).commitCommissionInfo.map((item,index)=>(
                <div key={`item_${index}`}>
                  <span>{item.label}：</span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          </DxPanel>}
          {!!JSON.parse(track).reportRecord &&<DxPanel title='房源出租记录'>
            <Timeline>
              {JSON.parse(track).reportRecord.map((item,index)=>(
                <Timeline.Item key={`item_${index}`}>{item.date} {item.content}</Timeline.Item>
              ))}
            </Timeline>
          </DxPanel>}
        </div>
        :<div className="no-info-box">
          <p>
            <Icon type="picture"/>
          </p>
          <div>暂无成交信息</div>
        </div>
      */}
      <div>
        <Button type="primary" onClick={toPrve}>上一步</Button>
        <Button type="ghost" onClick={handeBack}>返回</Button>
      </div>
    </div>
  );
}
function mapStateToProps({secHandRentingDeal}){
  return{secHandRentingDeal}
}
export default connect(mapStateToProps)(SecHandRentingDeal)
