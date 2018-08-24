import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input,Table,Button,Select,Tabs,DatePicker,Cascader} from 'antd';
import DxPanel from '../../../../commons/components/DxPanel'
import './PlatformEarningBalance.css'
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';
const { MonthPicker, RangePicker } = DatePicker;
function PlatformEarningBalance({dispatch,form,platformEarningBalance}) {
  const {getFieldDecorator}=form;
  const {cascaderArr,
    accountBalance,
    totalExpense,
    totalFund,
    areaPath,
    beginTime,
    endTime,
    keyword,
    pageNo,
    type,
    isShouru,
    shouruTable,
    total,
    zhichuTable,
  }=platformEarningBalance;
  //tabs切换
  const callBack=(key)=>{
    form.resetFields();
    if(key=='收入'){
      dispatch({
        type:'platformEarningBalance/getShouruTable',
        payload:{
          isShouru:'收入',
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
        type:'platformEarningBalance/getZhichuTable',
        payload:{
          pageNo:0,
          isShouru:'支出',
        }
      })
    }
  }
  //查看详情（收入）
  const watchDetails=(key)=>{
    dispatch(routerRedux.push({
			pathname: `/financeManagement/platformEarningBalance/platformEarningBalanceDetail`,
      state:{id:key}
		}));
  }
  //结算
  const settlementClick=()=>{
    dispatch(routerRedux.push({
			pathname: `/financeManagement/platformEarningBalance/platformSettlement`,
		}));
  }
  const dataSource=[
    {
      number:1,
      key:'1',
    }
  ]
  ////////////////////////////////////////////////////收入
  const incomeColumns=[
    {
      title:'序号',
      dataIndex:'number',
    },
    {
      title:'时间',
      dataIndex:'time',
    },
    {
      title:'订单号',
      dataIndex:'orderNum',
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
      dataIndex:'transType',
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
      render:(record,text)=><span className='green' onClick={()=>watchDetails(record.key)}>查看</span>
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
      if(isShouru=='收入'){
        dispatch({
          type:'platformEarningBalance/getShouruTable',
          payload:{
            isShouru:'收入',
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
    dispatch({
      type:'platformEarningBalance/getShouruTable',
      payload:{
        isShouru:'收入',
        areaPath:'',
        beginTime:'',
        endTime:'',
        keyword:'',
        pageNo:0,
        type:'',
      }
    })
    form.resetFields();
  }
  //////////////////////////////////////////////////////支出
  const expenditureColumns=[
    {
      title:'序号',
      dataIndex:'number',
    },
    {
      title:'时间',
      dataIndex:'time',
    },
    // {
    //   title:'支出流水号',
    //   dataIndex:'payItemIdx',
    // },
    {
      title:'支出类型',
      dataIndex:'type',
    },
    {
      title:'支出方式',
      dataIndex:'payType',
    },
    // {
    //   title:'支出账号',
    //   render:(record,text)=><div>
    //     <p>{record.bank}</p>
    //     <p>{record.showCode}</p>
    //   </div>
    // },
    {
      title:'支出金额',
      dataIndex:'amount',
    },
  ];
  //分页
  const pagination={
		total:total,
		showTotal:total => `共 ${total} 项`,
		pageSize:10,
    current:pageNo,
		onChange:(page)=>{
      if(isShouru=='收入'){
        dispatch({
          type:'platformEarningBalance/getShouruTable',
          payload:{
            isShouru:'收入',
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
          type:'platformEarningBalance/getZhichuTable',
          payload:{
            isShouRu:'支出',
            pageNo:page-1,
          }
        })
      }
    },
	};
  return (
    <div>
      <DxPanel title='当前平台资金'>
        <div className='flexPlat'>
          <div className='inline'>
            <p>账户余额  {accountBalance||0}元</p>
            <p className='gary'>累计资金 {totalFund||0}元</p>
          </div>
          <Button type='primary' onClick={settlementClick}>结算</Button>
        </div>
        <Tabs type='card' onChange={callBack}>
          <TabPane tab="收入" key="收入">
            <p className='firstWord'>累计收入：{totalFund||0}元</p>
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
                    {/*<Option value="团购款">电商费用</Option>*/}
                    <Option value="佣金">佣金</Option>
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
            <Table columns={incomeColumns} dataSource={shouruTable}
              pagination={pagination}
            />
          </TabPane>
          <TabPane tab="支出" key="支出">
            <Table columns={expenditureColumns} dataSource={zhichuTable}/>
          </TabPane>
        </Tabs>
      </DxPanel>
    </div>
  );
}

function mapStateToProps({platformEarningBalance}) {
  return {platformEarningBalance }
}

export default connect(mapStateToProps)(Form.create()(PlatformEarningBalance));
