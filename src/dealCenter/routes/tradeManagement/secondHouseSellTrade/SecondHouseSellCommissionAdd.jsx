import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import {Table,Button,Form,Input,Col,Row,Checkbox,Select,Radio} from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
import DxPanel from '../../../../commons/components/DxPanel'
import DxConfirmModal from '../../../../commons/components/DxConfirmModal'
import PromptModal from '../../../../commons/View/PromptModal'
import DxShowMsgForm from '../../../../commons/UI/DxShowMsgForm'
import PayModal from '../../../components/PayModal'
import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow'
import SHSellTradeInfo from '../../../../commons/components/SHSellTradeInfo'
// import SecondHouseTradeDetails from '../../../components/secondHouseSellTrade/SecondHouseTradeDetails'
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
import './SecondHouseSellCommissionAdd.css'
const proportionArr=[
  {
    label:'一成',
    value:'0.1',
  },{
    label:'二成',
    value:'0.2',
  },{
    label:'三成',
    value:'0.3',
  },{
    label:'四成',
    value:'0.4',
  },{
    label:'五成',
    value:'0.5',
  },{
    label:'六成',
    value:'0.6',
  },{
    label:'七成',
    value:'0.7',
  },{
    label:'八成',
    value:'0.8',
  },{
    label:'九成',
    value:'0.9',
  }
]
const SecondHouseSellCommissionAdd = ({location, dispatch,secondHouseSellCommissionAdd,form: {
  getFieldDecorator,
  validateFields,
  getFieldsValue,
  setFieldsValue,
  resetFields,
}}) => {
  const {
    loading,
    payModal,
    reEditModalVisible,
    trackJSON,
    promptObj,
    intentionInfo,
    transCode,
    type,
    downPaymentInfo,
    transRecord,
  }=secondHouseSellCommissionAdd;
  const creatDownPayment=()=>{
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = { ...getFieldsValue()};
      dispatch({
        type:'secondHouseSellCommissionAdd/creatInentsOrder',
        payload:data,
      })
    });
  }
  const payModalProps={
    orderInfo:payModal.orderInfo==null?{}:JSON.parse(payModal.orderInfo),
    loading:payModal.loading,
    serialNumber:payModal.serialNumber,
    orderModal:{
      title:'二手房出售支付佣金',
      visible:payModal.visible,
      okText:'提交订单',
    },
    closeMini:payModal.closeMini,
    payModal:{
      visible:false,
    },
    closeOrder(){
      dispatch({
        type:'secondHouseSellCommissionAdd/closePayModal'
      })
    },
    backToList(){
      dispatch(routerRedux.push({
        pathname:'/tradeManagement/secondHouseSellTrade'
      }))
    },
    creatOrder(data){
      dispatch({
        type:'secondHouseSellCommissionAdd/payGroupBuy',
        payload:data,
      })
    },
    paySuccess(){
      dispatch(
        routerRedux.push({
          pathname: '/tradeManagement/secondHouseSellTrade/secondHouseSellDealUploadCommissionAgreement',
          state:{
            transCode,
          }
        })
      )
    },
  }
  function handleProportionCharge(e){
    const totalPrice=getFieldsValue(['totalPrice']).totalPrice;
    if(!!totalPrice){
      setFieldsValue({
        commissionAmount: Math.floor(Number(totalPrice)*(Number(e.target.value)*100)),
      })
    }
  }
  function handleTotalPriceCharge(e){
    const proportion=getFieldsValue(['proportion']).proportion;
    if(!!proportion){
      setFieldsValue({
        commissionAmount: Math.floor((Number(proportion)*100)*Number(e.target.value)),
      })
    }
  }
  const noPayOrderTableProps={
    columns:[
      {
        title:'订单编号',
        dataIndex:'orderNumber',
        key:'orderNumber',
      },
      {
        title:'费用承担',
        dataIndex:'undertaker',
        key:'undertaker',
      },
      {
        title:'实际成交单价',
        dataIndex:'unitPrice',
        key:'unitPrice',
      },
      {
        title:'实际成交总价',
        dataIndex:'totalPrice',
        key:'totalPrice',
      },
      {
        title:'居间服务费',
        dataIndex:'commissionRate',
        key:'commissionRate',
      },
      {
        title:'交易服务费',
        dataIndex:'serviceCharge',
        key:'serviceCharge',
      },
      {
        title:'需支付中介佣金',
        dataIndex:'commissionAmount',
        key:'commissionAmount',
      },
      {
        title:'创建时间',
        dataIndex:'createDateTime',
        key:'createDateTime',
      },
      {
        title:'订单状态',
        dataIndex:'status',
        key:'status',
        render:()=><span>未支付</span>,
      },
      {
        title:'操作',
        dataIndex:'operate',
        key:'operate',
        render:(text,record)=><span className='red_cursor' onClick={()=>dispatch({
          type:'secondHouseSellCommissionAdd/openComfirmModal',
        })}>
        取消支付订单
      </span>,
      },
    ],
    dataSource:!!intentionInfo?[JSON.parse(intentionInfo)]:[],
    pagination:false,
    rowKey:(record)=>record.transCode,
  }
  return (
    <div className='secondHouseSellCommissionAdd'>
      <DxConfirmModal visible={reEditModalVisible} title='确认删除该未支付订单？' description='删除之后将重新填写支付信息' onOk={()=>dispatch({
          type:'secondHouseSellCommissionAdd/cancelNoPayOrder'
        })} onCancel={()=>dispatch({type:'secondHouseSellCommissionAdd/closeComfirmModal'})} />
      {!!loading && <DxLoadingShadow visible={!!loading}/>}
      {!!loading && <DxLoadingShadow visible={!!loading}/>}
      <PayModal {...payModalProps}/>
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'secondHouseSellCommissionAdd/closePrompt'})} onCancel={()=>dispatch({type:'secondHouseSellCommissionAdd/closePrompt'})}/>
      {!!trackJSON && <SHSellTradeInfo type='tradeCenter' trackJSON={trackJSON}/>}
      <DxPanel title='缴纳佣金' className='payDownPayment'>
        <div>
          {/*(type==='old' && !!intentionInfo) && <DxShowMsgForm msgData={JSON.parse(intentionInfo)}/>*/}
          {(type==='old' && !!intentionInfo) && <Table {...noPayOrderTableProps}/>}
          {type==='new' && <div>
            <Row>
              <Col lg={12} md={24} className='dx_col_addonAfter'>
                <FormItem
                  label='费用承担'
                  {...formItemLayout}
                >
                  {getFieldDecorator('undertaker',{
                    initialValue:'买方承担',
                    rules: [
                      { required: true, message: '费用承担未选择' },
                    ],
                  })(
                    <RadioGroup>
                      <Radio value='买方承担'>买方承担</Radio>
                      <Radio value='卖方承担'>卖方承担</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
              <Col lg={12} md={24} className='dx_col_addonAfter'>
                <FormItem
                  label='实际成交单价'
                  hasFeedback
                  {...formItemLayout}
                >
                  {getFieldDecorator('unitPrice', {
                    rules: [
                      { required: true, message: '实际成交单价未输入' },
                      { type:'string',pattern:/^[1-9]\d*$/, message: '输入内容非法' },
                    ],
                  })(
                    <Input type='text' placeholder='请在此输入实际成交单价' addonAfter='元/㎡'/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={24} className='dx_col_addonAfter'>
                <FormItem
                  label='实际成交总价'
                  hasFeedback
                  {...formItemLayout}
                >
                  {getFieldDecorator('totalPrice', {
                    onChange:handleTotalPriceCharge,
                    rules: [
                      { required: true, message: '实际成交总价未输入' },
                      { type:'string',pattern:/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/, message: '输入内容非法' },
                    ],
                  })(
                    <Input type='text' placeholder='请在此输入实际成交总价' addonAfter='万元'/>
                  )}
                </FormItem>
              </Col>
              <Col lg={12} md={24} className='dx_col_addonAfter'>
                <FormItem
                  label='居间服务费'
                  hasFeedback
                  {...formItemLayout}
                >
                  {getFieldDecorator('proportion', {
                    onChange:handleProportionCharge,
                    rules: [
                      { required: true, message: '居间服务费未输入' },
                      { type:'string',pattern:/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/, message: '输入内容非法' },
                    ],
                  })(
                    <Input type='text' placeholder='请在此输入居间服务费' addonAfter='%'/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={24} className='dx_col_addonAfter'>
                <FormItem
                  label='交易服务费'
                  hasFeedback
                  {...formItemLayout}
                >
                  {getFieldDecorator('serviceCharge', {
                    rules: [
                      { type:'string',pattern:/^\d*$/, message: '输入内容非法' },
                    ],
                  })(
                    <Input type='text' placeholder='请在此输入交易服务费' addonAfter='元'/>
                  )}
                </FormItem>
              </Col>
              <Col lg={12} md={24} className='dx_col_addonAfter'>
                <FormItem
                  label='需支付中介佣金'
                  hasFeedback
                  {...formItemLayout}
                >
                  {getFieldDecorator('commissionAmount')(
                    <Input disabled type='text' addonAfter='元'/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </div>}
        </div>
      </DxPanel>
      <span>注：佣金结算单笔账户代付手续费2元</span>
      <div className='anzhua_button_bottom'>
        {type==='new' && <Button type='primary' onClick={creatDownPayment}>生成佣金订单</Button>}
        {type==='old' && <Button type='primary' onClick={()=>dispatch({
          type:'secondHouseSellCommissionAdd/openPayModal',
          payload:transCode,
        })}>立即支付</Button>}
        <Button type='ghost' onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
      </div>
    </div>
  )
}

SecondHouseSellCommissionAdd.propTypes = {
  secondHouseSellCommissionAdd: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps({secondHouseSellCommissionAdd}) {
  return {secondHouseSellCommissionAdd}
}

export default connect(mapStateToProps)(Form.create()(SecondHouseSellCommissionAdd));
