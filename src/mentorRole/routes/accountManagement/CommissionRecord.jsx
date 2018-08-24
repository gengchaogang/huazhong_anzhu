import React from 'react'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import {Table,Row,Col,Button,Tabs,DatePicker,Modal,Form,Input} from 'antd'
import DxPanel from '../../../commons/components/DxPanel'
import PromptModal from '../../../commons/View/PromptModal'
import './commissionRecord.css'
const RangePicker = DatePicker.RangePicker;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
function CommissionRecord({commissionRecord,dispatch,form}){

  const {getFieldDecorator} = form;

  const {
    promptObj,
    canMoney,
    name,
    card,
    InitMoney,
    totalElements,
    currentTime,
    activeKey,
    currentPage,
    tableLoading,
    tableData,
    getMoneyVisible,
    pageInfo,
  }=commissionRecord;

  const columns =[{
      title:"序号",
      dataIndex:"number",
    },{
      title:"时间",
      dataIndex:"addTime"
    },{
      title:"流水号",
      dataIndex:"serialNumber"
    },{
      title:"订单号",
      dataIndex:"orderNumber"
    },{
      title:"房源编号",
      dataIndex:'houseCode',
      render:(text,record,index)=>{
        if(record.houseType==="新房"){
          return("--")
        }else{
          return(record.houseCode)
        }
      }
    },{
      title:"房源类型",
      dataIndex:"houseType"
    },{
      title:"租售方式",
      dataIndex:"saleWay"
    },{
      title:"资金类型",
      dataIndex:"type"
    },{
      title:"支付金额(元)",
      dataIndex:"totalAmt"
    },{
      title:"收益",
      dataIndex:"income"
    },{
      title:"交易方式",
      dataIndex:"payType"
    },{
      title:"操作",
      render:(text,record,index)=>{
        return(
          <span onClick={()=>checkOneData(record)} className="broker_check"></span>
        )
      }
    }]

  const checkOneData=(record)=>{
    dispatch(routerRedux.push({
      pathname:"/accountManagement/commissionRecord/commissionRecordDetails",
      state:{
        id:record.id
      }
    }))
  }

  const onTimeChange=(value, dateString)=>{
    dispatch({
      type:"commissionRecord/changeCurrentTime",
      payload:{
        currentTime:dateString
      }
    })
  }

  const timeCheck=()=>{
    if(currentTime.length){
      // if(activeKey==='all'){
        dispatch({
          type:"commissionRecord/getCommissionRecordData",
          payload:{
            pageSize:10,
            pageNo:0,
            beginTime:currentTime[0],
            endTime:currentTime[1],
          }
        })
      // }
      // else if(activeKey==='settling'){
      //   dispatch({
      //     type:"commissionRecord/getCommissionRecordData",
      //     payload:{
      //       pageSize:10,
      //       pageNo:0,
      //       status:"结算中",
      //       beginTime:currentTime[0],
      //       endTime:currentTime[1],
      //     }
      //   })
      // }
      // if(activeKey==='issued'){
      //   dispatch({
      //     type:"commissionRecord/getCommissionRecordData",
      //     payload:{
      //       pageSize:10,
      //       pageNo:0,
      //       status:"已发放",
      //       beginTime:currentTime[0],
      //       endTime:currentTime[1],
      //     }
      //   })
      // }
      // if(activeKey==='fail'){
      //   dispatch({
      //     type:"commissionRecord/getCommissionRecordData",
      //     payload:{
      //       pageSize:10,
      //       pageNo:0,
      //       status:"失败",
      //       beginTime:currentTime[0],
      //       endTime:currentTime[1],
      //     }
      //   })
      // }
    }
  }

  const onTabsChange=(key)=>{
    dispatch({
      type:"commissionRecord/changeActiveKey",
      payload:{activeKey:key}
    })
    if(key==='all'){
      dispatch({
        type:"commissionRecord/getCommissionRecordData",
        payload:{
          pageSize:10,
          pageNo:0,
          status:""
        }
      })
    }else if(key==="settling"){
      dispatch({
        type:"commissionRecord/getCommissionRecordData",
        payload:{
          pageSize:10,
          pageNo:0,
          status:"结算中"
        }
      })
    }else if(key==="issued"){
      dispatch({
        type:"commissionRecord/getCommissionRecordData",
        payload:{
          pageSize:10,
          pageNo:0,
          status:"已发放"
        }
      })
    }else if(key==="fail"){
      dispatch({
        type:"commissionRecord/getCommissionRecordData",
        payload:{
          pageSize:10,
          pageNo:0,
          status:"失败"
        }
      })
    }
  }
  const pagination={
    showQuickJumper:true,
    total:totalElements,
    showTotal:(totalElements)=>{return(`共 ${totalElements}项`)},
    pageSize:10,
    onChange:(page)=>{
      // if(activeKey==='全部'){
        dispatch({
          type:"commissionRecord/findTutorCommissionBudget",
          payload:{
            pageSize:10,
            pageNo:page-1,
            sort:{
              id:"DESC"
            }
          }
        })
      // }
      // else if(activeKey==='结算中'){
      //   dispatch({
      //     type:"commissionRecord/findTutorCommissionBudget",
      //     payload:{
      //       pageSize:10,
      //       pageNo:page-1,
      //       status:"结算中"
      //     }
      //   })
      // }else if(activeKey==='已发放'){
      //   dispatch({
      //     type:"commissionRecord/findTutorCommissionBudget",
      //     payload:{
      //       pageSize:10,
      //       pageNo:page-1,
      //       status:"已发放"
      //     }
      //   })
      // }else if(activeKey==='失败'){
      //   dispatch({
      //     type:"commissionRecord/findTutorCommissionBudget",
      //     payload:{
      //       pageSize:10,
      //       pageNo:page-1,
      //       status:"失败"
      //     }
      //   })
      // }
    }
  }

  const getMoney=()=>{
    // dispatch(routerRedux.push({
    //   pathname:"/accountManagement/commissionRecord/pwdManagement",
    // }))
    dispatch({
      type:"commissionRecord/getInitAccountDetails",
      payload:{}
    })
  }

  const pwdManagement=()=>{
    dispatch(routerRedux.push({
      pathname:"/accountManagement/commissionRecord/pwdManagement",
    }))
  }

  const getMoneyCancel=()=>{
    dispatch({
      type:"commissionRecord/changeModal",
      payload:{
        getMoneyVisible:false
      }
    })
  }

  const handleSubmit=(e)=>{
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type:"commissionRecord/tutCloseAccount",
          payload:{...values}
        })
      }
    });
  }

  const checkMoney = (rule, value, callback) => {
    if (value && value >canMoney ) {
      callback('提现金额超过可提现金额!');
    } else {
      callback();
    }
  }
  const handleBackOk=()=>{
      console.log('promptObj.todo',promptObj.todo)
    if(promptObj.todo==='closeModalAll'){
      dispatch({
          type:"commissionRecord/changeModal",payload:{getMoneyVisible:false}
      })
      form.resetFields();
      // dispatch({
      //   type:"commissionRecord/getInitAccountDetails",
      //   payload:{},
      // })
      dispatch({
        type:'commissionRecord/togglePrompt',
        payload:{
          visible:false
        }
      })
    }
    if(promptObj.todo==='pwdError' || promptObj.todo==='closeModal'){
      dispatch({
        type:'commissionRecord/togglePrompt',
        payload:{
          visible:false
        }
      })
    }
    if(promptObj.todo==='toCardBinding'){
      dispatch({
        type:'commissionRecord/togglePrompt',
        payload:{
          visible:false
        }
      })
      dispatch(routerRedux.push({
        pathname:"/accountManagement/bankCardManagement",
      }))
    }
  }
  const handleBackCancel=()=>{}
  return(
    <div className='commissionRecord'>
      <PromptModal {...promptObj} onOk={handleBackOk} onCancel={handleBackCancel}/>
      <Modal title="提现申请" visible={getMoneyVisible} footer={null} onCancel={getMoneyCancel}>
        <Form onSubmit={handleSubmit}>
          <FormItem {...formItemLayout} label="开户机构">
            <div>{!!name?name:''}</div>
          </FormItem>
          <FormItem {...formItemLayout} label="账号">
            <div>{!!card?card:''}</div>
          </FormItem>
          <hr className="dividingLine"/>
          <FormItem {...formItemLayout} label="可提现金额">
            <div>{!!canMoney?canMoney:'0'}元</div>
          </FormItem>
          <FormItem {...formItemLayout} label="提现金额">
            {getFieldDecorator('withdrawMoney', {
              rules: [{
                required: true,pattern:/^([1-9]\d*|0)(\.\d{1,2})?$/, message: '请输入提现金额!',
              },{
                validator:checkMoney
              }],
            })(
              <Input placeholder="请输入金额,支持两位小数!"/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="手续费">
            <div>2元</div>
          </FormItem>
          <FormItem {...formItemLayout} label="提现密码">
            {getFieldDecorator('withdrawPwd', {
              rules: [{
                required: true, message: '请输入提现密码!',
              }],
            })(
              <Input placeholder="请输入提现密码!" type="password"/>
            )}
          </FormItem>
          <FormItem>
            <Row>
              <Col offset={5}>
                <span>说明：</span>
              </Col>
              <Col offset={6}><span>1. 提现手续费将由银行收取。</span></Col>
              <Col offset={6}><span>2. 提现到账时间为T+1，具体到账时间请以银行为准。</span></Col>
            </Row>
          </FormItem>
          <FormItem>
            <Row>
              <Col offset={6}>
                <Button type="primary" htmlType="submit">提现</Button>
              </Col>
            </Row>
          </FormItem>
        </Form>
      </Modal>
      <DxPanel title="佣金记录" >
        <div className="money">
          <h2>{InitMoney.totalCommission}元</h2>
          {/*    <Row>王杰说暂时没有了
                      <Col span={4}><h3>未发放 {InitMoney.notIssue}元</h3></Col>
                      <Col span={4}><h3>累计发放 {InitMoney.totalIssue}元</h3></Col>
                    </Row>*/}
          <Row style={{marginTop:"10px"}}>
            <Col span={2}><Button type="primary" onClick={getMoney}>提现</Button></Col>
            <Col span={4}><Button type="primary" onClick={pwdManagement}>密码管理</Button></Col>
          </Row>
          <hr></hr>
        </div>
        <div className="detaileInfors">
          <span className="label">时间：</span>
          <RangePicker onChange={onTimeChange} size="large"/>
          <Button type="primary" onClick={timeCheck} className="searchByTime">查询</Button>
        </div>
        <div className="table">
          <Table
            columns={columns}
            dataSource={tableData}
            loading={tableLoading}
            pagination={pagination}/>
{/*          <Tabs
            activeKey={activeKey}
            onChange={onTabsChange}
            type="card"
            defaultActivKey="all"
            className="tabs"
            animated={false}
            >
              <TabPane tab="全部" key="all">
                <Table
                  columns={columns}
                  dataSource={tableData}
                  loading={tableLoading}
                  pagination={pagination}/>
              </TabPane>
              <TabPane tab="结算中" key="settling">
                <Table
                  columns={columns}
                  dataSource={tableData}
                  loading={tableLoading}
                  pagination={pagination}/>
              </TabPane>
              <TabPane tab="已发放" key="issued">
                <Table
                  columns={columns}
                  dataSource={tableData}
                  loading={tableLoading}
                  pagination={pagination}/>
              </TabPane>
              <TabPane tab="失败" key="fail">
                <Table
                  columns={columns}
                  dataSource={tableData}
                  loading={tableLoading}
                  pagination={pagination}/>
              </TabPane>
            </Tabs>
            */}
        </div>
      </DxPanel>
    </div>
  )
}
function mapStateToProps({commissionRecord}){
  return{commissionRecord}
}
export default connect(mapStateToProps)(Form.create()(CommissionRecord));
