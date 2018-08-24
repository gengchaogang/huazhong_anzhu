import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input,Table,Button,Select,Tabs,DatePicker,Cascader} from 'antd';
import DxPanel from '../../../../commons/components/DxPanel'
import './PlatformFund.css'
const TabPane = Tabs.TabPane;
import moment from 'moment';
const Option = Select.Option;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const dateFormat = 'YYYY-MM-DD';
const { MonthPicker, RangePicker } = DatePicker;
function PlatformFund({dispatch,form,platformFund}) {
  const {getFieldDecorator}=form;
  const {cascaderArr,
    masterSub,
    nowCommission,
    nowFirstpayment,
    nowFree,
    nowGroup,
    nowIntention,
    nowPlatAmount,
    totalCommission,
    totalFirstpayment,
    totalFree,
    totalGroup,
    totalIntention,
    totalPlatAmount,
    waitCommission,
    shouRuTable,//收入列表
    total,
    pageNo,
    isShouRu,
    areaPath,
    beginTime,
    endTime,
    keyword,
    type,
    zhiChuTable,
  }=platformFund;
  //tabs切换
  const callBack=(key)=>{
    form.resetFields();
    if(key=='收入'){
      dispatch({
        type:'platformFund/getShouRuTable',
        payload:{
          isShouRu:'收入',
          areaPath:'',
          beginTime:'',
          endTime:'',
          keyword:'',
          pageNo:0,
          type:'',
        }
      })
    }else{
      dispatch({
        type:'platformFund/getZhiChuTable',
        payload:{
          isShouRu:'支出',
          areaPath:'',
          beginTime:'',
          endTime:'',
          keyword:'',
          pageNo:0,
          type:'',
        }
      })
    }
  }
  //查看详情（收入）
  const watchDetails=(key)=>{
    dispatch(routerRedux.push({
			pathname: `/financeManagement/platformFund/platformFundDetail`,
      state:{id:key}
		}));
  }
  //查看详情 支出
  const watchZhiChuDetails=(key)=>{
    dispatch(routerRedux.push({
			pathname: `/financeManagement/platformFund/expenditureDetail`,
      state:{id:key}
		}));
  }
  ////////////////////////////////////////////////////收入
  const incomeColumns=[
    {
      title:'序号',
      dataIndex:'number',
    },
    {
      title:'时间',
      dataIndex:'addTime',
    },
    {
      title:'流水号',
      dataIndex:'numericalOrder',
    },
    {
      title:'订单号',
      dataIndex:'orderNumber',
    },
    {
      title:'房源编号',
      dataIndex:'houseCode',
    },
    {
      title:'交易中心',
      dataIndex:'tradingCenterName',
    },
    {
      title:'城市',
      dataIndex:'tradingCenterPath',
    },
    {
      title:'房源类型',
      dataIndex:'houseType',
    },
    {
      title:'租售方式',
      dataIndex:'saleWay',
    },
    {
      title:'资金类型',
      dataIndex:'type',
    },
    {
      title:'金额(元)',
      dataIndex:'amount',
    },
    {
      title:'交易方式',
      dataIndex:'payType',
    },
    {
      title:'操作',
      render:(record,text)=><span className='green' onClick={()=>{watchDetails(record.key)}}>查看</span>
    },
  ];
  const handleSubmit=()=>{
    form.validateFields((err,values)=>{
      let beginTime='';
      let endTime='';
      let area='';
      if(values.time){
        beginTime=moment(values.time[0]).format(dateFormat);
        endTime=moment(values.time[1]).format(dateFormat);
      }
      if(values.areaPath){
        area='/'+values.areaPath.join('/')
      }
      if(isShouRu=='收入'){
        dispatch({
          type:'platformFund/getShouRuTable',
          payload:{
            isShouRu:'收入',
            areaPath:area,
            beginTime:beginTime,
            endTime:endTime,
            keyword:values.keyword,
            pageNo:0,
            type:values.type,
          }
        })
      }else{
        dispatch({
          type:'platformFund/getZhiChuTable',
          payload:{
            isShouRu:'支出',
            areaPath:area,
            beginTime:beginTime,
            endTime:endTime,
            keyword:values.keyword,
            pageNo:0,
            type:values.type,
          }
        })
      }
    })
  }
  const handleReset=()=>{
    if(isShouRu=='收入'){
      dispatch({
        type:'platformFund/getShouRuTable',
        payload:{
          isShouRu:'收入',
          areaPath:'',
          beginTime:'',
          endTime:'',
          keyword:'',
          pageNo:0,
          type:'',
        }
      })
    }else{
      dispatch({
        type:'platformFund/getZhiChuTable',
        payload:{
          isShouRu:'支出',
          areaPath:'',
          beginTime:'',
          endTime:'',
          keyword:'',
          pageNo:0,
          type:'',
        }
      })
    }
    form.resetFields();
  }
  //分页
  const pagination={
		total:total,
		showTotal:total => `共 ${total} 项`,
		pageSize:10,
    current:pageNo,
		onChange:(page)=>{
      if(isShouRu=='收入'){
        dispatch({
          type:'platformFund/getShouRuTable',
          payload:{
            isShouRu:'收入',
            areaPath:areaPath,
            beginTime:beginTime,
            endTime:endTime,
            keyword:keyword,
            pageNo:page-1,
            type:type,
          }
        })
      }else{
        dispatch({
          type:'platformFund/getZhiChuTable',
          payload:{
            isShouRu:'支出',
            areaPath:areaPath,
            beginTime:beginTime,
            endTime:endTime,
            keyword:keyword,
            pageNo:page-1,
            type:type,
          }
        })
      }
    },
	};
  //////////////////////////////////////////////////////支出
  const expenditureColumns=[
    {
      title:'序号',
      dataIndex:'number',
    },
    {
      title:'时间',
      dataIndex:'addTime',
    },
    {
      title:'流水号',
      dataIndex:'numericalOrder',
    },
    {
      title:'对应订单号',
      dataIndex:'orderNumber',
    },
    {
      title:'用户角色',
      dataIndex:'userType',
    },
    {
      title:'用户名称',
      dataIndex:'userName',
    },
    {
      title:'城市',
      dataIndex:'areaPath',
    },
    {
      title:'支出类型',
      dataIndex:'expenseType',
    },
    {
      title:'金额(元)',
      dataIndex:'amount',
    },
    {
      title:'交易方式',
      dataIndex:'transType',
    },
    {
      title:'操作',
      render:(record,text)=><span className='green' onClick={()=>{watchZhiChuDetails(record.key)}}>查看</span>
    },
  ];
  return (
    <div>
      <DxPanel title='当前平台资金'>
        <div className='inline'>
          <p className='firstWord'>当前平台资金 {nowPlatAmount||0}元</p>
          <p>佣金 {nowCommission||0}元</p>
          <p className='gary left'>待成交分佣 {waitCommission||0}元(未发放)</p>
          {/*<p className='gary left'>师傅补贴 {masterSub||0}元(转到账户)</p>*/}
          <p>意向金 {nowIntention||0}元</p>
          <p>首付款 {nowFirstpayment||0}元</p>
          <p>电商费用 {nowGroup||0}元</p>
          <p>服务费 {nowFree||0}元</p>
        </div>
        <div className='inline'>
          <p className='gary'>累计资金 {totalPlatAmount||0}元</p>
          <p className='gary'>累计佣金 {totalCommission||0}元</p>
          <p className='heidden'>heidden</p>
          <p className='gary'>累计意向金 {totalIntention||0}元</p>
          <p className='gary'>累计首付款 {totalFirstpayment||0}元</p>
          <p className='gary'>累计电商费用 {totalGroup||0}元</p>
          <p className='gary'>累计服务费 {totalFree||0}元</p>
        </div>
        <Tabs type='card' onChange={callBack}>
          <TabPane tab="收入" key="收入">
            <p className='firstWord'>平台累计收入：{totalPlatAmount||0}元</p>
            <Form inline style={{margin:'20px 0'}}>
              <div className='time'>
                <FormItem>
                  {getFieldDecorator('time', {
                  })(
                    <RangePicker format={dateFormat} allowClear={false}/>
                  )}
                </FormItem>
              </div>
              <FormItem label="类型">
                {getFieldDecorator('type', {
                })(
                  <Select style={{minWidth:'120px'}}>
                    <Option value="团购款">电商费用</Option>
                    <Option value="佣金">佣金</Option>
                    <Option value="意向金">意向金</Option>
                    <Option value="首付款">首付款</Option>
                    <Option value="服务费">交易服务费</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="关键字">
                {getFieldDecorator('keyword', {
      					})(
      						<Input/>
      					)}
              </FormItem>
              <FormItem label="地区">
                {getFieldDecorator('areaPath', {
      					})(
      						<Cascader placeholder='--' options={cascaderArr}
                    changeOnSelect={true}
                  />
      					)}
              </FormItem>
              <Button type="primary"  style={{margin:'0 6px 0 0'}} onClick={handleSubmit}>搜索</Button>
    					<Button type='ghost' onClick={handleReset}>重置</Button>
            </Form>
            <Table columns={incomeColumns} dataSource={shouRuTable}
              pagination={pagination}/>
          </TabPane>
          <TabPane tab="支出" key="支出">
            <p className='firstWord'>平台累计支出：{(totalPlatAmount-nowPlatAmount).toFixed(2)}元</p>
              <Form inline style={{margin:'20px 0'}}>
                <div className='time'>
                  <FormItem>
                    {getFieldDecorator('time', {
                    })(
                      <RangePicker format={dateFormat} allowClear={false}/>
                    )}
                  </FormItem>
                </div>
                <FormItem label="类型">
                  {getFieldDecorator('type', {
                  })(
                    <Select style={{minWidth:'120px'}}>
                      <Option value="意向金">意向金</Option>
                      <Option value="佣金">佣金</Option>
                      <Option value="首付款">首付款</Option>
                      <Option value="团购款">团购款</Option>
                      <Option value="结算">结算</Option>
                      <Option value="提现">提现</Option>
                      <Option value="合作佣金">合作佣金</Option>
                      <Option value="成交佣金">成交佣金</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem label="关键字">
                  {getFieldDecorator('keyword', {
        					})(
        						<Input/>
        					)}
                </FormItem>
                <FormItem label="地区">
                  {getFieldDecorator('areaPath', {
                  })(
                    <Cascader placeholder='--' options={cascaderArr}
                      changeOnSelect={true}
                    />
                  )}
                </FormItem>
                <Button type="primary"  style={{margin:'0 6px 0 0'}} onClick={handleSubmit}>搜索</Button>
                <Button type='ghost' onClick={handleReset}>重置</Button>
              </Form>
            <Table columns={expenditureColumns} dataSource={zhiChuTable}
              pagination={pagination}
              />
          </TabPane>
        </Tabs>
      </DxPanel>
    </div>
  );
}

function mapStateToProps({platformFund}) {
  return {platformFund }
}

export default connect(mapStateToProps)(Form.create()(PlatformFund));
