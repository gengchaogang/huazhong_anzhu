import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import {Table,Modal, Button,Tabs,Form,Select,DatePicker}from 'antd'
import './AccountAgentDetail.css';
import SearchKeyBox from '../../components/searchKeyBox/SearchKeyBox'
import DxPanel from '../../../commons/components/DxPanel'
const FormItem=Form.Item;
const Option=Select.Option;
const TabPane = Tabs.TabPane;
const { MonthPicker, RangePicker } = DatePicker;
function AccountAgentDetail({dispatch,accountAgentDetail,form}) {
  const {getFieldDecorator}=form;
  const {
    amount,
    areaPath,
    // codePath,
    loginName,
    name,
    totalIncome,
    userId,
    userType,
    dataSourceIncome,
    total,pageNo,
    beginTime,endTime,isIncome,incomeLoading,
    dataSourceExpenditure,
    pinzhengStatus,
    certificate,
  }=accountAgentDetail;
  const incomeColumns=[
    {
      title:'序号',
      dataIndex:'number'
    },
    {
      title:'时间',
      dataIndex:'addTime'
    },
    {
      title:'流水号',
      dataIndex:'serialNumber'
    },
    {
      title:'订单号',
      dataIndex:'orderNumber'
    },
    {
      title:'房源编号',
      dataIndex:'houseCode'
    },
    {
      title:'房源类型',
      dataIndex:'houseType'
    },
    {
      title:'租售方式',
      dataIndex:'saleWay'
    },
    {
      title:'资金类型',
      dataIndex:'type'
    },
    {
      title:'支付金额(元)',
      dataIndex:'totalAmt'
    },
    {
      title:'收益',
      dataIndex:'income'
    },
    {
      title:'交易方式',
      dataIndex:'payType'
    },
    {
      title:'操作',
      render:(text,record)=>
      <span className='watchDetails' onClick={()=>{agentDetailIncome(record.key)}}>
        查看
      </span>
    },
  ];
  //查看收入详情
  const agentDetailIncome=(key)=>{
    dispatch(routerRedux.push({
			pathname: `/accountManagement/zhangHuGuanLiAgent/agentDetailIncome`,
      state:{
        id:key,
      }
		}));
  }
  const expenditureColumns=[
    {
      title:'序号',
      dataIndex:'number'
    },
    {
      title:'时间',
      dataIndex:'addTime'
    },
    {
      title:'支出类型',
      dataIndex:'type'
    },
    {
      title:'支出方式',
      dataIndex:'payType'
    },
    {
      title:'支出金额',
      dataIndex:'payMoney'
    },
    {
      title:'支出凭证',
      render:(text,record)=><span className='watchDetails' onClick={()=>{watchPinzheng(record)}}>查看</span>
    },
  ]
  const watchPinzheng=(record)=>{
    dispatch({
      type:'accountAgentDetail/initialSuccess',
      payload:{
        pinzhengStatus:true,
        certificate:record.certificate,
      }
    })
  }
  const pinzhengCancel=()=>{
    dispatch({
      type:'accountAgentDetail/initialSuccess',
      payload:{
        pinzhengStatus:false,
      }
    })
  }
  const onChange=(date, dateString)=>{
    if(date.length!=0){
      if(isIncome=='收入'){
        dispatch({
          type:'accountAgentDetail/initialSuccess',
          payload:{incomeLoading:true}
        })
        dispatch({
          type:'accountAgentDetail/findTCOrOIncomeBudget',
          payload:{
            beginTime:dateString[0],
            endTime:dateString[1],
            pageNo:0,
            isIncome:isIncome,
            userId:userId,
          }
        })
      }else{
        dispatch({
          type:'accountAgentDetail/findTcOrOExpense',
          payload:{
            beginTime:dateString[0],
            endTime:dateString[1],
            pageNo:0,
            isIncome:isIncome,
            userId:userId,
          }
        })
      }
    }else{
      if(isIncome=='收入'){
        dispatch({
          type:'accountAgentDetail/initialSuccess',
          payload:{incomeLoading:true}
        })
        dispatch({
          type:'accountAgentDetail/findTCOrOIncomeBudget',
          payload:{
            beginTime:'',
            endTime:'',
            pageNo:0,
            isIncome:isIncome,
            userId:userId,
          }
        })
      }else{
        dispatch({
          type:'accountAgentDetail/findTcOrOExpense',
          payload:{
            beginTime:'',
            endTime:'',
            pageNo:0,
            isIncome:isIncome,
            userId:userId,
          }
        })
      }
    }
  }
  const callback=(key)=>{
    if(key=='收入'){
      dispatch({
        type:'accountAgentDetail/initialSuccess',
        payload:{incomeLoading:true}
      })
      dispatch({
        type:'accountAgentDetail/findTCOrOIncomeBudget',
        payload:{
          beginTime:beginTime,
          endTime:endTime,
          pageNo:0,
          isIncome:key,
          userId:userId,
        }
      })
    }else{
      dispatch({
        type:'accountAgentDetail/findTcOrOExpense',
        payload:{
          beginTime:beginTime,
          endTime:endTime,
          pageNo:0,
          isIncome:key,
          userId:userId,
        }
      })
    }
  }
  const goback=()=>{
    dispatch(routerRedux.goBack());
  }
  //分页
  const pagination={
    current:pageNo,
    total:total,
    onChange:(page)=>{
      if(isIncome=='收入'){
        dispatch({type:'accountAgentDetail/initialSuccess',payload:{incomeLoading:true}})
        dispatch({
          type:'accountAgentDetail/findTCOrOIncomeBudget',
          payload:{
            beginTime:beginTime,
            endTime:endTime,
            pageNo:page-1,
            userId:userId,
            isIncome:isIncome,
          }
        })
      }else{
        dispatch({
          type:'accountAgentDetail/findTcOrOExpense',
          payload:{
            beginTime:beginTime,
            endTime:endTime,
            pageNo:page-1,
            userId:userId,
            isIncome:isIncome,
          }
        })
      }
    }
  }
  //结算
  const agentSettlement=()=>{
    dispatch(routerRedux.push({
      pathname:`/accountManagement/zhangHuGuanLiAgent/agentSettlement`,
      state:{id:userId}
    }))
  }
	return(
		<div>
      <DxPanel title='账号信息'>
        <p>帐号：{loginName}</p>
        <p>企业名称：{name}</p>
      </DxPanel>
      <DxPanel title='账户信息'>
        <div className='flexPlat'>
          <div>
            <p>账户余额：{amount}元</p>
            <p>累计收益：{totalIncome}元</p>
          </div>
          <Button type='primary' onClick={agentSettlement}>结算</Button>
        </div>
        <div className='rangePicker'>
          <RangePicker onChange={onChange} />
        </div>
        <div className='tabs'>
          <Tabs onChange={callback} type="card">
            <TabPane tab="收入" key="收入">
              <Table columns={incomeColumns} dataSource={dataSourceIncome}
                loading={incomeLoading} pagination={pagination}
              />
            </TabPane>
            <TabPane tab="支出" key="支出">
              <Table columns={expenditureColumns} dataSource={dataSourceExpenditure}
                pagination={pagination}
              />
            </TabPane>
          </Tabs>
        </div>
      </DxPanel>
      <Modal visible={pinzhengStatus} onCancel={pinzhengCancel} footer={null}>
        <span className='certificate' style={{backgroundImage:`URL(${certificate})`}}></span>
      </Modal>
      <Button onClick={goback} type='ghost'>返回</Button>
		</div>
	)
}


AccountAgentDetail.propTypes = {

};
function mapStateToProps({accountAgentDetail }) {
	return { accountAgentDetail }
}

export default connect(mapStateToProps)(Form.create()(AccountAgentDetail))
