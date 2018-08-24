import React, { Component, PropTypes } from 'react'
import {Timeline}from 'antd'
import PicList from './PicList'
import {
  isNull,
  renderCommitCommissionInfo,
  parseTrackJSON,
  isNullRate,
} from '../utils/currencyFunction'
import {renderTotalMoneyStr } from '../utils/publicFunction'
import DxShowMsgForm from './DxShowMsgForm'
import './TimeRecordList.css'

export default function TimeRecordList({listData}){
  console.log('listData',listData);
  return(
    <div className='timeRecordList'>
      <Timeline>
        {creatElem(listData)}
      </Timeline>
    </div>
  )
}
function creatElem(listData){
  // console.log(listData,'listDatalistData');
  const childrenElems=listData.map((item,index)=>{
    if(!!item.type && item.type==='formData'){
      console.log('进入try');
      let formData=null;
      // console.log('JSON.parse(item.content)',JSON.parse(item.content));
      try{
        formData=checkFromElemType(item.content,item.formDataType);
      }catch(e){
        formData=null;
      }
      return(
        <Timeline.Item key={`${item.date}_${index}`}>
          {!!item.date && <span className='timeRecordList_date'>{item.date}</span>}
          {!!formData && <DxShowMsgForm msgData={formData}/>}
          {!!item.images && <div className='timeRecordList_images'>
            <PicList picListData={creatPicArr(item.images)}/>
          </div>}
        </Timeline.Item>
      )
    }else{
      return(
        <Timeline.Item key={`${item.date}_${index}`}>
        {!!item.date && <span className={getcolor(item.content)}>{item.date}</span>}
        {!!item.content && <span className={getcolor(item.content)}>{item.content}</span>}
        {!!item.remarks && <div className={getcolor(item.content)}><span className='fontweight'>审核说明：</span>{item.remarks}</div>}
        {!!item.customerCommit && <div className={getcolor(item.content)}><span className='fontweight'>客户已完成：</span>{item.customerCommit}</div>}
        {!!item.refund && <div className='timeRecordList_remarks'><span className='fontweight'>退款说明：</span>{item.refund}</div>}
        {!!item.orderObj && <DxShowMsgForm msgData={checkFromElemType(item.orderObj,item.formDataType)}/>}
        {!!item.ownerObj && <DxShowMsgForm msgData={checkFromElemType(item.ownerObj,item.formDataType)}/>}
        {!!item.images && <div className='timeRecordList_images'>
          <PicList picListData={creatPicArr(item.images)}/>
        </div>}
      </Timeline.Item>
      )
    }
  })
  return childrenElems;
}
function getcolor(key){
  if(key.indexOf('驳回')>0){
    let a='timeRecordList_content_color';
    return a
  }else{
    let b='timeRecordList_content';
    return b
  }
  // 'timeRecordList_content'
}
function creatPicArr(arr){
  let resultArr=[];
  arr.map((item,index)=>{
    if(!!item && item.length!==0){
      resultArr.push({
        src:item,
        title:'',
        id:`key_${index}`,
      })
    }
  });
  return resultArr;
}
function checkFromElemType(dataObj,formDataType){
  if(formDataType==='租房分期办理进度'){
    return [
      {
        label:'分期客户',
        value:isNull(dataObj.CustomerName,'-'),
      },{
        label:'联系电话',
        value:isNull(dataObj.CustomerPhone,'-'),
      },{
        label:'贷款金额',
        value:isNull(dataObj.LoanAmount,'-'),
      },{
        label:'客户类型',
        value:isNull(dataObj.CustomerType,'-'),
      },{
        label:'提供证件',
        value:isNull(dataObj.CustomerMaterials,'-'),
      }
    ]
  }
  else if(formDataType==='出售解押办理'){
    return [
      {
        label:'解押业主',
        value:isNull(dataObj.ownerName,'-'),
      },{
        label:'业主电话',
        value:isNull(dataObj.ownerPhone,'-'),
      },{
        label:'解押金额',
        value:`${isNull(dataObj.releaseAmount,'-')}元`,
      },{
        label:'解押说明',
        value:isNull(dataObj.releaseMemo,'-'),
      }
    ]
  }
  else if(formDataType==='意向金退款办理'){
    return [
      {
        label:'退款原因',
        value:isNull(dataObj.refundReason,'-'),
      },
    ]
  }
  else if(formDataType==='出售意向金退款办理'){
    console.log('dataObj',dataObj);
    return [
      {
        label:'退款原因',
        value:isNull(dataObj.refundReason,'-'),
      },
    ]
  }
  else if(formDataType==='首付款退款办理'){
    console.log('dataObj',dataObj);
    return [
      {
        label:'退款原因',
        value:isNull(dataObj.refundReason,'-'),
      },
    ]
  }
  else if(formDataType==='二手房出租成交执行分佣'){
    let resultsData = [];
    const assignInfo = parseTrackJSON(dataObj.assignInfo)
    console.log('assignInfo',assignInfo);
    if(!!assignInfo){
      resultsData = renderCommitCommissionInfo(assignInfo,'shRent')
      console.log('resultsData',resultsData);
    }

    return resultsData;
    // return [
    //   {
    //     label:'退款原因',
    //     value:isNull(dataObj.refundReason,'-'),
    //   },
    // ]
  }
  else if(formDataType==='房屋成交信息'){
    let resultsData = [];
    const assignInfo = parseTrackJSON(dataObj.assignInfo)
    console.log('assignInfo',assignInfo);
    if(!!assignInfo){
      resultsData = renderCommitCommissionInfo(assignInfo,'nh')
      console.log('resultsData',resultsData);
    }
    return resultsData;
  }
  else if(formDataType==='二手房出售成交执行分佣'){
    console.log('dataObj',dataObj);
    // let resultsData=[
    //   {
    //     label:isNull(dataObj.title),
    //     value:'',
    //   },
    //   {
    //     label:'居间服务费',
    //     value:`${isNull(dataObj.commissionAmount/100,'-')}元`,
    //   },
    //   // {
    //   //   label:'平台抽佣',
    //   //   value:`${isNull(dataObj.platformCommissionRate,0)*100}%`,
    //   // },
    //   {
    //     label:'平台抽佣金额',
    //     value:`${isNull(dataObj.platformMoney/100,'-')}元`,
    //   },
    //   {
    //     label:'剩余佣金总额',
    //     value:`${isNull(dataObj.platformMoney/100,'-')}元`,
    //   },
    //   {
    //     label:'成交方式',
    //     value:isNull(dataObj.transactionMode,'-'),
    //   },
    // ];
    // //房源经纪人信息
    // let brokerInfoArr=null;
    // const {brokerInfo}=dataObj;
    // if(!!brokerInfo){
    //   brokerInfoArr=[
    //     {
    //       label:'房源经纪人',
    //       value:isNull(brokerInfo.brokerName,'-'),
    //     },
    //     {
    //       label:'房源经纪人分佣金额',
    //       value:`${isNull(dataObj.aBrokerMoney/100,'-')}元`
    //     },
    //   ];
    // }
    // //客源经纪人信息
    // let customerBrokerInfoArr=null;
    // const {customerBrokerInfo}=dataObj;
    // if(!!customerBrokerInfo){
    //   customerBrokerInfoArr=[
    //     {
    //       label:'客源经纪人',
    //       value:isNull(customerBrokerInfo.brokerName),
    //     },
    //     {
    //       label:'客源经纪人分佣金额',
    //       value:`${isNull(dataObj.bBrokerMoney/100,'-')}元`
    //     },
    //   ];
    // }
    // let assignInfo = null;
    // try {
    //   assignInfo = JSON.parse(dataObj.assignInfo);
    // } catch (e) {
    //   assignInfo = null;
    // }
    // if(!!assignInfo){
    //   console.log('assignInfo',assignInfo);
    //   const detaiResult = renderCommitCommissionInfo(assignInfo,'shSell')
    //   console.log('detaiResult',detaiResult);
    //
    // }
    let resultsData = [];
    const assignInfo = parseTrackJSON(dataObj.assignInfo)
    console.log('assignInfo',assignInfo);
    if(!!assignInfo){
      resultsData = renderCommitCommissionInfo(assignInfo,'shSell')
      console.log('resultsData',resultsData);
    }



    // console.log('brokerInfoArr',brokerInfoArr);
    // if(!!brokerInfoArr){
    //   resultsData=resultsData.concat(brokerInfoArr);
    // }
    // if(!!customerBrokerInfoArr){
    //   resultsData=resultsData.concat(customerBrokerInfoArr);
    // }
    return resultsData;
    // return [
    //   {
    //     label:'退款原因',
    //     value:isNull(dataObj.refundReason,'-'),
    //   },
    // ]
  }
  else if(formDataType==='佣金退款协议办理'){
    return [
      {
        label:'退款原因',
        value:isNull(dataObj.refundReason,'-'),
      },
    ]
  }
  else if(formDataType==='解押贷款申请'){
    let dataKey=Object.keys(dataObj);
    let dataArr=[];
    if(dataKey.includes('amount')){
      dataArr.push({
        label:'解押所需金额',
        value:`${isNull(dataObj.amount,'-')}元`,
      })
    }
    if(dataKey.includes('ownerName')){
      dataArr.push({
        label:'业主姓名',
        value:isNull(dataObj.ownerName,'-'),
      })
    }
    if(dataKey.includes('ownerPhone')){
      dataArr.push({
        label:'业主电话',
        value:isNull(dataObj.ownerPhone,'-'),
      })
    }
    return dataArr
  }
  else if(formDataType==='购房分期贷款申请'){
    let dataKey=Object.keys(dataObj);
    let dataArr=[];
    if(dataKey.includes('loanCustomer')){
      dataArr.push({
        label:'贷款客户',
        value:isNull(dataObj.loanCustomer,'-'),
      })
    }
    if(dataKey.includes('customerPhone')){
      dataArr.push({
        label:'联系电话',
        value:isNull(dataObj.customerPhone,'-'),
      })
    }
    if(dataKey.includes('loanType')){
      dataArr.push({
        label:'贷款类型',
        value:isNull(dataObj.loanType,'-'),
      })
    }
    if(dataKey.includes('amount')){
      dataArr.push({
        label:'贷款金额',
        value:`${isNullRate(dataObj.loanRate,'-')} ${renderTotalMoneyStr(dataObj.loanAmount)}`,
      })
    }
    if(dataKey.includes('loanTerm')){
      dataArr.push({
        label:'贷款期限',
        value:isNull(dataObj.loanTerm,'-'),
      })
    }
    return dataArr
  }
  else if(formDataType==='租房分期'){
    let dataKey=Object.keys(dataObj);
    let dataArr=[];
    if(dataKey.includes('loanCustomer')){
      dataArr.push({
        label:'分期客户',
        value:isNull(dataObj.loanCustomer,'-'),
      })
    }
    if(dataKey.includes('customerPhone')){
      dataArr.push({
        label:'联系电话',
        value:isNull(dataObj.customerPhone,'-'),
      })
    }
    if(dataKey.includes('rentPayment')){
      dataArr.push({
        label:'分期方式',
        value:isNull(dataObj.rentPayment,'-'),
      })
    }
    if(dataKey.includes('customerType')){
      dataArr.push({
        label:'客户类型',
        value:isNull(dataObj.customerType,'-'),
      })
    }
    if(dataKey.includes('customerMaterials')){
      dataArr.push({
        label:'提供资料',
        value:isNull(dataObj.customerMaterials,'-'),
      })
    }
    return dataArr
  }
  else if(formDataType==='房屋过户申请'){
    let dataKey=Object.keys(dataObj);
    let dataArr=[];
    if(dataKey.includes('ownerName')){
      dataArr.push({
        label:'业主姓名',
        value:isNull(dataObj.ownerName,'-'),
      })
    }
    if(dataKey.includes('ownerPhone')){
      dataArr.push({
        label:'业主电话',
        value:isNull(dataObj.ownerPhone,'-'),
      })
    }
    if(dataKey.includes('customerName')){
      dataArr.push({
        label:'购房者姓名',
        value:isNull(dataObj.customerName,'-'),
      })
    }
    if(dataKey.includes('customerPhone')){
      dataArr.push({
        label:'购房者电话',
        value:isNull(dataObj.customerPhone,'-'),
      })
    }
    if(dataKey.includes('customerMaterials')){
      dataArr.push({
        label:'提供资料',
        value:isNull(dataObj.customerMaterials,'-'),
      })
    }
    return dataArr
  }
  else if(formDataType==='电商优惠动态'){
    let dataKey=Object.keys(dataObj);
    let dataArr=[];
    if(dataKey.includes('orderNumber')){
      dataArr.push({
        label:'订单编号',
        value:isNull(dataObj.orderNumber,'-'),
      })
    }
    if(dataKey.includes('amount')){
      dataArr.push({
        label:'支付金额',
        value:`${isNull(dataObj.amount,'-')}元`,
      })
    }
    if(dataKey.includes('paymentMethod')){
      dataArr.push({
        label:'支付方式',
        value:isNull(dataObj.paymentMethod,'-'),
      })
    }
    if(dataKey.includes('customerName')){
      dataArr.push({
        label:'支付人姓名',
        value:isNull(dataObj.customerName,'-'),
      })
    }
    if(dataKey.includes('customerPhone')){
      dataArr.push({
        label:'联系电话',
        value:isNull(dataObj.customerPhone,'-'),
      })
    }
    if(dataKey.includes('serialNumber')){
      dataArr.push({
        label:'联系电话',
        value:isNull(dataObj.serialNumber,'-'),
      })
    }
    return dataArr
  }
  else if(formDataType==='佣金支付动态'){
    let dataCommissionKey=Object.keys(dataObj);
    let dataCommissionArr=[];
    if(dataCommissionKey.includes('orderNumber')){
      dataCommissionArr.push({
        label:'订单编号',
        value:isNull(dataObj.orderNumber,'-'),
      })
    }
    if(dataCommissionKey.includes('amount')){
      dataCommissionArr.push({
        label:'支付金额',
        value:`${isNull(dataObj.amount,'-')}元`,
      })
    }
    if(dataCommissionKey.includes('paymentMethod')){
      dataCommissionArr.push({
        label:'支付方式',
        value:isNull(dataObj.paymentMethod,'-'),
      })
    }
    if(dataCommissionKey.includes('serialNumber')){
      dataCommissionArr.push({
        label:'支付流水号',
        value:isNull(dataObj.serialNumber,'-'),
      })
    }
    if(dataCommissionKey.includes('payType')){
      if(dataObj.payType){
        dataCommissionArr.push({
          label:'承担方',
          value:isNull(dataObj.payType,'-'),
        })
      }
    }
    if(dataCommissionKey.includes('customerName')){
      dataCommissionArr.push({
        label:'支付人姓名',
        value:isNull(dataObj.customerName,'-'),
      })
    }
    if(dataCommissionKey.includes('customerPhone')){
      dataCommissionArr.push({
        label:'联系电话',
        value:isNull(dataObj.customerPhone,'-'),
      })
    }
    if(dataCommissionKey.includes('refundType')){
      dataCommissionArr.push({
        label:'退款方式',
        value:isNull(dataObj.refundType,'-'),
      })
    }

    return dataCommissionArr
  }
  else if(formDataType==='意向金支付动态' || formDataType==='意向金支付信息'){
    let dataKey=Object.keys(dataObj);
    let dataArr=[];
    if(dataKey.includes('orderNumber')){
      dataArr.push({
        label:'订单编号',
        value:isNull(dataObj.orderNumber,'-'),
      })
    }

    if(dataKey.includes('amount')){
      dataArr.push({
        label:'支付金额',
        value:`${isNull(dataObj.amount,'-')}元`,
      })
    }
    if(dataKey.includes('paymentMethod')){
      dataArr.push({
        label:'支付方式',
        value:isNull(dataObj.paymentMethod,'-'),
      })
    }
    if(dataKey.includes('refundType')){
      dataArr.push({
        label:'退款方式',
        value:isNull(dataObj.refundType,'-'),
      })
    }
    if(dataKey.includes('releaseType')){
      dataArr.push({
        label:'释放方式',
        value:isNull(dataObj.releaseType,'-'),
      })
    }
    if(dataKey.includes('serialNumber')){
      dataArr.push({
        label:'支付流水号',
        value:isNull(dataObj.serialNumber,'-'),
      })
    }
    if(dataKey.includes('customerName')){
      dataArr.push({
        label:'支付人姓名',
        value:isNull(dataObj.customerName,'-'),
      })
    }
    if(dataKey.includes('customerPhone')){
      dataArr.push({
        label:'联系电话',
        value:isNull(dataObj.customerPhone,'-'),
      })
    }

    if(dataKey.includes('ownerName')){
      dataArr.push({
        label:'业主姓名',
        value:isNull(dataObj.ownerName,'-'),
      })
    }
    if(dataKey.includes('ownerPhone')){
      dataArr.push({
        label:'业主电话',
        value:isNull(dataObj.ownerPhone,'-'),
      })
    }
    if(dataKey.includes('ownerIDNumber')){
      dataArr.push({
        label:'业主身份证号',
        value:isNull(dataObj.ownerIDNumber,'-'),
      })
    }
    if(dataKey.includes('ownerBank')){
      dataArr.push({
        label:'开户银行',
        value:isNull(dataObj.ownerBank,'-'),
      })
    }
    if(dataKey.includes('ownerBankCity')){
      dataArr.push({
        label:'开户银行所属城市',
        value:isNull(dataObj.ownerBankCity,'-'),
      })
    }
    if(dataKey.includes('ownercardNumber')){
      dataArr.push({
        label:'开户银行卡号',
        value:isNull(dataObj.ownercardNumber,'-'),
      })
    }
    if(dataKey.includes('ownerSubbranch')){
      dataArr.push({
        label:'开户支行',
        value:isNull(dataObj.ownerSubbranch,'-'),
      })
    }
    if(dataKey.includes('refundSerialNumber')){
      dataArr.push({
        label:'退款流水号',
        value:isNull(dataObj.refundSerialNumber,'-'),
      })
    }
    if(dataKey.includes('relseaseSerialNumber')){
      dataArr.push({
        label:'释放流水号',
        value:isNull(dataObj.relseaseSerialNumber,'-'),
      })
    }
    return dataArr
  }
}
