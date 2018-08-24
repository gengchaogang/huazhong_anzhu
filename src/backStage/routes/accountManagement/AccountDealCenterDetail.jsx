import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import {Table, Button,Select,Form,Tabs,DatePicker,Modal,Input,Cascader}from 'antd'
import './AccountDealCenterDetail.css';
import SearchKeyBox from '../../components/searchKeyBox/SearchKeyBox'
import DxPanel from '../../../commons/components/DxPanel'
const FormItem=Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { MonthPicker, RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
function AccountDealCenterDetail({dispatch,accountDealCenterDetail,form}) {
  const {getFieldDecorator}=form;
  const {
    amount,
    areaPath,
    codePath,
    avatar,
    bank,
    endNumber,
    logo,
    loginName,
    name,
    totalIncome,
    userId,
    userType,
    isIncome,
    dataSourceIncome,
    total,
    pageNo,
    beginTime,
    endTime,
    incomeLoading,
    changeBankStatus,
    bankArr,
    optionsArr,
    dataSourceExpenditure,
  }=accountDealCenterDetail;
  //变更银行卡
  const changeBank=()=>{
    dispatch({
      type:'accountDealCenterDetail/getBank',
      payload:{
        groups:[
          {
            typeName:'银行',
            areaPath:null,
          },
        ]
      }
    })
    dispatch({
      type:'accountDealCenterDetail/getCity',
    })
    // dispatch({
    //   type:'accountDealCenterDetail/getBankData',
    //   payload:{id:userId}
    // })
    dispatch({
      type:'accountDealCenterDetail/initialSuccess',
      payload:{changeBankStatus:true}
    })
  }
  //确认变更银行卡
  const changeBankok=()=>{
    form.validateFields((err,values)=>{
      if(err){
        return
      }
      let city='';
      let province='';
      if(values.citys){
        province=values.citys[0];
        city=values.citys[1];
      }
      let logos='';
      if(values.bank){
        for(let i=0;i<bankArr.length;i++){
          bankArr[i].value==values.bank?(logos=bankArr[i].url):'';
        }
      }
      dispatch({
        type:'accountDealCenterDetail/changeBankok',
        payload:{
          province:province,
          city:city,
          id:userId,
          bank:values.bank,
          logo:logos,
          branchName:values.branchName,
          code:values.code,
          name:values.name,
        }
      })
    })
    form.resetFields();
  }
  //关闭变更银行卡的模态框
  const changeBankCancel=()=>{
    dispatch({
      type:'accountDealCenterDetail/initialSuccess',
      payload:{changeBankStatus:false}
    })
    form.resetFields();
  }
  //支出
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
      title:'支出流水号',
      dataIndex:'numericalOrder'
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
      title:'支出帐号',
      render:(text,record)=><div>
        <p>{record.bank}</p>
        <p>{record.showCard}</p>
      </div>
    },
    {
      title:'支出金额',
      dataIndex:'payMoney'
    },
    {
      title:'状态',
      dataIndex:'status'
    },
  ]
  //收入
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
      <span className='watchDetails' onClick={()=>{dealCenterDetailIncome(record.key)}}>
        查看
      </span>
    },
  ];
  //查看收入详情
  const dealCenterDetailIncome=(key)=>{
    dispatch(routerRedux.push({
			pathname: `/accountManagement/accountDealCenter/dealCenterDetailIncome`,
      state:{
        id:key,
      }
		}));
  }
  const goback=()=>{
    dispatch(routerRedux.goBack());
  }
  const callback=(key)=>{
    if(key=='收入'){
      dispatch({
        type:'accountDealCenterDetail/initialSuccess',
        payload:{incomeLoading:true}
      })
      dispatch({
        type:'accountDealCenterDetail/findTCOrOIncomeBudget',
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
        type:'accountDealCenterDetail/findTcOrOExpense',
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
  const onChange=(date, dateString)=>{
    if(date.length!=0){
      if(isIncome=='收入'){
        dispatch({
          type:'accountDealCenterDetail/initialSuccess',
          payload:{incomeLoading:true}
        })
        dispatch({
          type:'accountDealCenterDetail/findTCOrOIncomeBudget',
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
          type:'accountDealCenterDetail/findTcOrOExpense',
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
          type:'accountDealCenterDetail/initialSuccess',
          payload:{incomeLoading:true}
        })
        dispatch({
          type:'accountDealCenterDetail/findTCOrOIncomeBudget',
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
          type:'accountDealCenterDetail/findTcOrOExpense',
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
  //分页
  const pagination={
    current:pageNo,
    total:total,
    onChange:(page)=>{
      if(isIncome=='收入'){
        dispatch({type:'accountDealCenterDetail/initialSuccess',payload:{incomeLoading:true}})
        dispatch({
          type:'accountDealCenterDetail/findTCOrOIncomeBudget',
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
          type:'accountDealCenterDetail/findTcOrOExpense',
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
  const dealCenterSettlement=()=>{
    dispatch(routerRedux.push({
			pathname: `/accountManagement/accountDealCenter/dealCenterSettlement`,
      state:{id:userId}
		}));
  }
	return(
		<div>
      <DxPanel title='帐号信息'>
        <p>帐号：{loginName}</p>
        <p>交易中心名称：{name}</p>
      </DxPanel>
      <DxPanel title='银行卡'>
        <div className='flexPlat'>
          <div className='margin marginflexspan'>
            <span>银行卡</span>
            {!!logo && <span className='banklogo' style={{backgroundImage:`URL(${logo})`}}></span>}
            <span>{bank}（{endNumber}）</span>
          </div>
          <Button type='primary' onClick={changeBank}>变更</Button>
        </div>
      </DxPanel>
      <DxPanel title='账户信息'>
        <div className='flexPlat'>
          <div>
            <p>账户余额：{amount}元</p>
            <p>累计收益：{totalIncome}元</p>
          </div>
          <Button className='jiesuan' type='primary' onClick={dealCenterSettlement}>结算</Button>
        </div>
        <div className='rangePicker'>
          <RangePicker onChange={onChange} />
        </div>
        <div className='tabs'>
          <Tabs onChange={callback} type="card">
            <TabPane tab="收入" key="收入">
              <Table columns={incomeColumns} dataSource={dataSourceIncome}
                loading={incomeLoading}
                pagination={pagination}
              />
            </TabPane>
            <TabPane tab="支出" key="支出">
              <Table columns={expenditureColumns}
                dataSource={dataSourceExpenditure}
                pagination={pagination}
              />
            </TabPane>
          </Tabs>
        </div>
      </DxPanel>
      <Button onClick={goback} type='ghost'>返回</Button>
      <Modal title='变更银行卡' visible={changeBankStatus}
        onOk={changeBankok} onCancel={changeBankCancel}
      >
        <Form>
          <FormItem
            label='银行开户名'
            {...formItemLayout}
          >
            {getFieldDecorator('name', {
              // initialValue:codes,
              rules: [
                { required: true, message: '必选' },
              ],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            label='开户银行'
            {...formItemLayout}
          >
            {getFieldDecorator('bank', {
              // initialValue:codes,
              rules: [
                { required: true, message: '必选' },
              ],
            })(
              <Select>
                {!!bankArr && bankArr.map((item,index)=>(
                  <Option key={`item_${index}`} value={item.value}>{item.value}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem
            label='开户行城市'
            {...formItemLayout}
          >
            {getFieldDecorator('citys', {
              // initialValue:codes,
              rules: [
                { required: true, message: '必选' },
              ],
            })(
              <Cascader options={optionsArr}/>
            )}
          </FormItem>
          <FormItem
            label='支行信息'
            {...formItemLayout}
          >
            {getFieldDecorator('branchName', {
              // initialValue:codes,
              rules: [
                { required: true, message: '必选' },
              ],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            label='卡号'
            {...formItemLayout}
          >
            {getFieldDecorator('code', {
              // initialValue:codes,
              rules: [
                { required: true, message: '必选' },
              ],
            })(
              <Input/>
            )}
          </FormItem>
        </Form>
      </Modal>
		</div>
	)
}


AccountDealCenterDetail.propTypes = {

};
function mapStateToProps({accountDealCenterDetail }) {
	return { accountDealCenterDetail }
}

export default connect(mapStateToProps)(Form.create()(AccountDealCenterDetail))
