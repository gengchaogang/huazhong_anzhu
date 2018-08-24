import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import {Select,Table,Icon,Timeline,Cascader,Button,Radio,Row,Col}from 'antd'
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import DxPanel from '../../../../commons/components/DxPanel'
import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow'
import PromptModal from '../../../../commons/View/PromptModal'
import SearchInput from '../../../../commons/View/SearchInput'


import IntentionItem from '../../../../commons/UI/tradeItems/IntentionItem'
import CustomerInformation from '../../../../commons/UI/tradeItems/CustomerInformation'
import IntentionHouse from '../../../../commons/UI/tradeItems/IntentionHouse'
import ReportBroker from '../../../../commons/UI/tradeItems/ReportBroker'
import TimelineComponents from '../../../../commons/UI/tradeItems/TimelineComponents'

import ClientInfoList from '../../../components/NewHouseTrade/ClientInfoList'
import GroupBuyPayModal from '../../../components/NewHouseTrade/GroupBuyPayModal'
import ChooseUserModal from '../../../components/NewHouseTrade/ChooseUserModal'
import ProjectInfo from '../../../components/NewHouseTrade/ProjectInfo'
import PayModal from '../../../components/PayModal'
import NHTradeInfo from '../../../../commons/components/NHTradeInfo'

import './CreatGroupBuy.css'



function CreatGroupBuy({dispatch,creatGroupBuy}){

  const {
    loading,
    type,
    promptObj,
    trackJSON,
    projectInfo,
    groupKey,
    projectId,
    projectList,
    chooseCustomerModal,
    payModal,
    groupBuyId,
    lockProject,
    projectName,
    houseTreeData,
    houseTreeMap,
    selectHouseKey,
    showHouseObj,
    discountList,
    discountMap,
    selectDiscount,
  }=creatGroupBuy;
  const selectProject=(key)=>{
    console.log('请选择客户意向项目',key);
  }
  const intentionBuyBouseSelectDataProps ={
    options:houseTreeData,
    onChange:(arr)=>{dispatch({type:'creatGroupBuy/doSelectHouseKey',payload:arr})},
    value:selectHouseKey,
  }
  //报错提示框回调判断
  const promptOk=()=>{
    const {todo}=promptObj;
    switch (todo) {
      case 'default':
        dispatch({
          type:'creatGroupBuy/onlyClosePrompt',
        })
        break;
      default:
        dispatch({
          type:'creatGroupBuy/onlyClosePrompt',
        });
        break;
    }
  }
  const promptCancel=()=>{
    dispatch({type:'creatGroupBuy/onlyClosePrompt'})
  }
  const groupBuyHouseProps={
    houseInfo:showHouseObj,
    other:!!showHouseObj.cellStatus?showHouseObj.cellStatus:'',
    hideHead:true,
    footer:selectDiscount.id==null?<span>{''}</span>:<span className='creatGroupBuy_highNight'>{`注:客户选择意向房源，完成支付后，会在房源销控表内锁定房源${selectDiscount.holdDays}天。`}</span>,
  }

  const payModalProps={
    orderInfo:payModal.orderInfo==null?{}:JSON.parse(payModal.orderInfo),
    loading:payModal.loading,
    serialNumber:payModal.serialNumber,
    orderModal:{
      title:'电商优惠订单',
      visible:payModal.visible,
      okText:'提交订单',
    },
    payModal:{
      visible:false,
    },
    type:'customer',
    closeOrder(){
      dispatch({
        type:'creatGroupBuy/closeBuyModal'
      })
    },
    backToList(){
      dispatch(routerRedux.push({
        pathname:'/tradeManagement/newHouseTrade'
      }))
    },
    creatOrder(data){
      dispatch({
        type:'creatGroupBuy/payGroupBuy',
        payload:data,
      })
    },
    paySuccess(){
      dispatch(
        routerRedux.push({
          pathname: '/tradeManagement/newHouseTrade/uploadGroupBuyAgreement',
          state:{
            groupKey,
            groupBuyId,
            projectId,
          },
        })
      )
    },
  }
  const chooseCustomerModalProps={
    title:'请选择确看客户',
    type:'customer',
    visible:chooseCustomerModal.visible,
    userList:chooseCustomerModal.customerList,
    doSelectUser:(selectId)=>dispatch({
      type:'creatGroupBuy/selectCustomerKey',
      payload:selectId,
    }),
    doSearch:(searchValue)=>dispatch({
      type:'creatGroupBuy/searchCustomer',
      payload:searchValue,
    }),
    onOk:()=>dispatch({
      type:'creatGroupBuy/sureDoSelectCustomer',
    }),
    onCancel:()=>dispatch({
      type:'creatGroupBuy/giveUpSelectCustomer',
    }),
  }
  return(
    <div className='creatGroupBuy'>
      <PromptModal {...promptObj} onOk={promptOk} onCancel={promptCancel}/>
      <ChooseUserModal {...chooseCustomerModalProps}/>
      {!!loading && <DxLoadingShadow visible={loading}/>}
      {(type==='normal' && !!trackJSON) && <NHTradeInfo trackJSON={trackJSON} projectInfo={projectInfo}/>}
      {type ==='quick' && <div>
        {/*<DxPanel title={!!lockProject?'客户意向项目':'请选择客户意向项目'}>
          {!!lockProject?<span>{!!projectName?projectName:''}</span>:<Select  placeholder='请选择项目' style={{ width: 250 }} value={projectId} onChange={(key)=>dispatch({type:'creatGroupBuy/selectProject',payload:key})}>
            {projectList.map(item=><Option key={`creatGroupBuyProject_${item.id}`} value={item.id}>{item.name}</Option>)}
          </Select>
          }
          </DxPanel>*/}
        <DxPanel title='客户意向项目'>
          <ProjectInfo projectInfo={projectInfo}/>
        </DxPanel>
        <DxPanel title='客户信息'>
          <div className='dealCenter-userMsgBox'>
            <div className='dealCenter-userMsgBox-checkUserBox'>
              <span><span style={{color:'red'}}>* </span>请选择确看客户：</span>
              <Button size='small' className='anzhu_button' onClick={()=>dispatch({type:'creatGroupBuy/openChooseCustomerModal'})}>{(!!chooseCustomerModal.selectCustomerInfo && !!chooseCustomerModal.selectCustomerInfo.show)?'重选确看客户':'选择确看客户'}</Button>
            </div>
            {(!!chooseCustomerModal.selectCustomerInfo && !!chooseCustomerModal.selectCustomerInfo.show) && <ClientInfoList listData={[chooseCustomerModal.selectCustomerInfo]} doSelect={()=>{}}/>}
          </div>
        </DxPanel>
        {(groupKey !== null && trackJSON) && <NHTradeInfo trackJSON={trackJSON}/>}
      </div>}
        {!!groupKey && <DxPanel title='选择客户团购房源'>
          <div className='dealCenter-intentionBuyBouse'>
            <div className='sort-address-msg'>
              <span><span style={{color:'red'}}>* </span>意向房源：</span>
              <Cascader {...intentionBuyBouseSelectDataProps} placeholder='请选择团购意向房源' style={{width:'250px'}}/>
              <span style={{paddingLeft:'15px'}}>{selectHouseKey.length==0?'':`已选择：${selectHouseKey.join('/')}`}</span>
            </div>
            {showHouseObj.key!='defalut' &&
            <IntentionHouse {...groupBuyHouseProps}/>}
          </div>
        </DxPanel>}
        {(discountList.length!==0 && !!groupKey) && <DxPanel title=' 请选择客户团购类型'>
          <div className='dealCenter-chooseGroupBuyType'>
            <RadioGroup onChange={(e)=>{dispatch({
                type:'creatGroupBuy/selectDiscountType',
                payload:e.target.value,
              })}} value={selectDiscount.id?selectDiscount.id:''}>
              {discountList.map(item=><RadioButton value={item.value} key={`key_${item.value}`}>{item.title}</RadioButton>)}
            </RadioGroup>
          </div>
        </DxPanel>}
        <PayModal {...payModalProps}/>
        <div className='anzhua_button_bottom'>
          {(discountList.length!==0 && !!groupKey) && <Button type='primary' onClick={()=>dispatch({type:'creatGroupBuy/sendGroupBuyInfo'})}>立即支付</Button>}
          <Button type='ghost' onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
        </div>
    </div>
  )
}
CreatGroupBuy.propTypes={

}
function mapStateToProps({creatGroupBuy}) {
  return {creatGroupBuy}
}

export default connect(mapStateToProps)(CreatGroupBuy)
