import React from 'react'
import {connect} from 'dva';
import {
  Icon,
  Button,
  Timeline,
  Table,
} from 'antd';
import {routerRedux} from 'dva/router'
import DxPanel from '../../../../../commons/components/DxPanel'
import PromptModal from '../../../../../commons/View/PromptModal'
import SHRentTradeInfo from '../../../../../commons/components/SHRentTradeInfo'
function StoreRentingDeal({dispatch,storeRentingDeal}){
  const {
    promptObj,
    projectId,
    track,
  }=storeRentingDeal;
  const handleCallBackOk=()=>{

  }
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
  //   // console.log(JSON.parse(track).intentsAgreements);
  // }
  const handleCallBackCancel=()=>{

  }
  const toPrve=()=>{
    dispatch(routerRedux.push({
      pathname:'/houseResourceRentManagement/shopsRent/storeRentingNavBar/storeRentingRecord',
      state:{
        projectId:projectId
      }
    }))
  }
  const handeBack=()=>{
    dispatch(routerRedux.push({
      pathname:'/houseResourceRentManagement/shopsRent'
    }))
  }
  return (
    <div className="Renting-strike-hands">
      <PromptModal {...promptObj} onOk={handleCallBackOk} onCancel={handleCallBackCancel}/>
      {!!track && <SHRentTradeInfo type='mentorRole' trackJSON={track}/>}
      <div className="details_buttons">
        <Button type="primary" onClick={toPrve}>上一步</Button>
        <Button type="ghost" onClick={handeBack}>返回</Button>
      </div>
    </div>
  );
}
function mapStateToProps({storeRentingDeal}){
  return{storeRentingDeal}
}
export default connect(mapStateToProps)(StoreRentingDeal)
