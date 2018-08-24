import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import {Table,Button,Form,Input,Col,Row,Checkbox,Select} from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
import DxPanel from '../../../../commons/components/DxPanel'
import DxConfirmModal from '../../../../commons/components/DxConfirmModal'
import PromptModal from '../../../../commons/View/PromptModal'
import DxShowMsgForm from '../../../../commons/UI/DxShowMsgForm'
import PayModal from '../../../components/PayModal'
import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow'
// import SecondHouseTradeDetails from '../../../components/secondHouseSellTrade/SecondHouseTradeDetails'
import SHSellTradeInfo from '../../../../commons/components/SHSellTradeInfo'
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
import './SecondHouseSellDownPaymentAdd.css'
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
const SecondHouseSellDownPaymentAdd = ({location, dispatch,secondHouseSellDownPaymentAdd,form: {
  getFieldDecorator,
  validateFields,
  getFieldsValue,
  setFieldsValue,
  resetFields,
}}) => {
  const {
    loading,
    payModal,
    trackJSON,
    promptObj,
    transCode,
    type,
    downPaymentInfo,
    reEditModalVisible,
    transRecord,
  }=secondHouseSellDownPaymentAdd;
  const creatDownPayment=()=>{
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = { ...getFieldsValue()};
      dispatch({
        type:'secondHouseSellDownPaymentAdd/creatInentsOrder',
        payload:data,
      })
    });
  }
  const payModalProps={
    orderInfo:payModal.orderInfo==null?{}:JSON.parse(payModal.orderInfo),
    loading:payModal.loading,
    serialNumber:payModal.serialNumber,
    orderModal:{
      title:'二手房出售支付首付款',
      visible:payModal.visible,
      okText:'提交订单',
    },
    closeMini:payModal.closeMini,
    payModal:{
      visible:false,
    },
    backToList(){
      dispatch(routerRedux.push({
        pathname:'/tradeManagement/secondHouseSellTrade'
      }))
    },
    closeOrder(){
      dispatch({
        type:'secondHouseSellDownPaymentAdd/closePayModal'
      })
    },
    creatOrder(data){
      dispatch({
        type:'secondHouseSellDownPaymentAdd/payGroupBuy',
        payload:data,
      })
    },
    paySuccess(){
      dispatch(
        routerRedux.push({
          pathname: '/tradeManagement/secondHouseSellTrade/secondHouseSellDealUploadDownPaymentAgreement',
          state:{
            transCode,
          }
        })
      )
    },
  }
  function handleProportionChange(value){
    if(type==='new'){
      setFieldsValue({
        downPaymenAmount: ((transRecord.totalPrice)*Number(value)).toFixed(2),
      })
    }else if(type==='noIntents'){
      const totalPrice=(getFieldsValue(['totalPrice']).totalPrice)*10000;
      if(!!totalPrice){
        setFieldsValue({
          downPaymenAmount: (Number(totalPrice)*Number(value)).toFixed(2),
        })
      }
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
        title:'意向成交单价',
        dataIndex:'unitPrice',
        key:'unitPrice',
      },
      {
        title:'意向成交总价',
        dataIndex:'totalPrice',
        key:'totalPrice',
      },
      {
        title:'意向金金额',
        dataIndex:'intentionAmount',
        key:'intentionAmount',
      },
      {
        title:'首付款比例',
        dataIndex:'downPaymenRate',
        key:'downPaymenRate',
      },
      {
        title:'首付款金额',
        dataIndex:'downPaymenAmount',
        key:'downPaymenAmount',
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
          type:'secondHouseSellDownPaymentAdd/openComfirmModal',
        })}>
        取消支付订单
      </span>,
      },
    ],
    dataSource:!!downPaymentInfo?[JSON.parse(downPaymentInfo)]:[],
    pagination:false,
    rowKey:(record)=>record.transCode,
  }
  return (
    <div className='secondHouseSellDownPaymentAdd'>
      <DxConfirmModal visible={reEditModalVisible} title='确认删除该未支付订单？' description='删除之后将重新填写支付信息' onOk={()=>dispatch({
          type:'secondHouseSellDownPaymentAdd/cancelNoPayOrder'
        })} onCancel={()=>dispatch({type:'secondHouseSellDownPaymentAdd/closeComfirmModal'})} />
      {!!loading && <DxLoadingShadow visible={!!loading}/>}
      <PayModal {...payModalProps}/>
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'secondHouseSellDownPaymentAdd/closePrompt'})} onCancel={()=>dispatch({type:'secondHouseSellDownPaymentAdd/closePrompt'})}/>
      {!!trackJSON && <SHSellTradeInfo type='tradeCenter' trackJSON={trackJSON}/>}
      <DxPanel title='支付首付款' className='payDownPayment'>
        {transRecord.loading?<DxLoadingShadow visible={!!transRecord.loading}/>:
        <div>
          {type==='new' && <Row>
            <Col lg={12} md={24}>
              <FormItem
                label='意向成交单价：'
                {...formItemLayout}
              >
                {getFieldDecorator('unitPrice', {
                  initialValue:transRecord.unitPrice,
                })(
                  <Input disabled={!(type==='noIntents')} type='text' placeholder='请在此输入协商成交单价' addonAfter='元/㎡'/>
                )}
              </FormItem>
            </Col>
            <Col lg={12} md={24}>
              <FormItem
                label='意向成交总价：'
                {...formItemLayout}
              >
                {getFieldDecorator('totalPrice', {
                  initialValue:(transRecord.totalPrice)/10000,
                })(
                  <Input disabled={!(type==='noIntents')} type='text' placeholder='请在此输入协商成交总价' addonAfter='万元'/>
                )}
              </FormItem>
            </Col>
            <Col lg={12} md={24}>
              <FormItem
                label='意向定金金额：'
                {...formItemLayout}
              >
                {getFieldDecorator('deposit', {
                  initialValue:transRecord.intentionAmount,
                })(
                  <Input disabled={!(type==='noIntents')} type='text' placeholder='请在此输入意向定金金额' addonAfter='元'/>
                )}
              </FormItem>
            </Col>
            <Col lg={12} md={24}>
              <FormItem
                label='首付款支付比例：'
                {...formItemLayout}
              >
                {getFieldDecorator('proportion', {
                  onChange:handleProportionChange,
                  rules: [
                    { required: true, message: '首付款支付比例未选择' },
                  ],
                })(
                  <Select style={{width:'100%'}} placeholder='请在此选择首付款支付比例'>
                    {proportionArr.map(item=><Option key={`key_${item.value}`} value={item.value}>{item.label}</Option>)}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col lg={12} md={24}>
              <FormItem
                label='首付款所需支付金额：'
                {...formItemLayout}
              >
                {getFieldDecorator('downPaymenAmount', {
                  rules: [
                    { required: true, message: '首付款所需支付金额未输入' },
                    { type:'string',pattern:/^\d+\.?\d*$/, message: '输入内容非法' },
                  ],
                })(
                  <Input type='text' disabled placeholder='请在此输入首付款所需支付金额' addonAfter='元'/>
                )}
              </FormItem>
            </Col>
            <Col lg={12} md={24} style={{display:'none'}}>
              <FormItem
                {...formItemLayout}
                >
                {getFieldDecorator('isDeductible', {
                  valuePropName: 'checked',
                  initialValue: false,
                })(
                  <Checkbox disabled>{`已支付意向金${transRecord.intentionAmount?transRecord.intentionAmount:'-'}元，抵扣首付款？`}</Checkbox>
                )}
              </FormItem>
            </Col>
          </Row>}
          {/*(type==='old' && !!downPaymentInfo) && <DxShowMsgForm msgData={JSON.parse(downPaymentInfo)}/>*/}
          {(type==='old' && !!downPaymentInfo) && <Table {...noPayOrderTableProps}/>}
          {type==='noIntents' && <Row>
            <Col lg={12} md={24}>
              <FormItem
                label='意向成交单价：'
                {...formItemLayout}
              >
                {getFieldDecorator('unitPrice', {
                  rules: [
                    { required: true, message: '意向成交单价未输入' },
                    { type:'string',pattern:/^\d+\.?\d*$/, message: '输入内容非法' },
                  ],
                })(
                  <Input type='text' disabled={false} placeholder='请在此输入协商成交单价' addonAfter='元/㎡'/>
                )}
              </FormItem>
            </Col>
            <Col lg={12} md={24}>
              <FormItem
                label='意向成交总价：'
                {...formItemLayout}
              >
                {getFieldDecorator('totalPrice', {
                  rules: [
                    { required: true, message: '意向成交总价未输入' },
                    { type:'string',pattern:/^\d+\.?\d*$/, message: '输入内容非法' },
                  ],
                })(
                  <Input type='text' disabled={false} placeholder='请在此输入协商成交总价' addonAfter='万元'/>
                )}
              </FormItem>
            </Col>
            <Col lg={12} md={24}>
              <FormItem
                label='意向定金金额：'
                {...formItemLayout}
              >
                {getFieldDecorator('deposit', {
                  initialValue:'0',
                })(
                  <Input type='text'  disabled={true} placeholder='请在此输入意向定金金额' addonAfter='元'/>
                )}
              </FormItem>
            </Col>
            <Col lg={12} md={24}>
              <FormItem
                label='首付款支付比例：'
                {...formItemLayout}
              >
                {getFieldDecorator('proportion', {
                  onChange:handleProportionChange,
                  rules: [
                    { required: true, message: '首付款支付比例未选择' },
                  ],
                })(
                  <Select style={{width:'100%'}} placeholder='请在此选择首付款支付比例'>
                    {proportionArr.map(item=><Option key={`key_${item.value}`} value={item.value}>{item.label}</Option>)}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col lg={12} md={24}>
              <FormItem
                label='首付款所需支付金额：'
                {...formItemLayout}
              >
                {getFieldDecorator('downPaymenAmount', {
                  rules: [
                    { required: true, message: '首付款所需支付金额未输入' },
                    { type:'string',pattern:/^\d+\.?\d*$/, message: '输入内容非法' },
                  ],
                })(
                  <Input type='text' disabled={true} placeholder='请在此输入首付款所需支付金额' addonAfter='元'/>
                )}
              </FormItem>
            </Col>
            <Col lg={12} md={24} style={{display:'none'}}>
              <FormItem
                {...formItemLayout}
                >
                {getFieldDecorator('isDeductible', {
                  valuePropName: 'checked',
                  initialValue: false,
                })(
                  <Checkbox disabled>{`已支付意向金${transRecord.intentionAmount?transRecord.intentionAmount:'-'}元，抵扣首付款？`}</Checkbox>
                )}
              </FormItem>
            </Col>
          </Row>}
        </div>}
      </DxPanel>
      <div className='anzhua_button_bottom'>
        {type==='new' && <Button type='primary' onClick={creatDownPayment}>生成首付订单</Button>}
        {type==='noIntents' && <Button type='primary' onClick={creatDownPayment}>生成首付订单</Button>}
        {type==='old' && <Button type='primary' onClick={()=>dispatch({
          type:'secondHouseSellDownPaymentAdd/openPayModal',
          payload:transCode,
        })}>立即支付</Button>}
        <Button type='ghost' onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
      </div>
    </div>
  )
}

SecondHouseSellDownPaymentAdd.propTypes = {
  secondHouseSellDownPaymentAdd: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps({secondHouseSellDownPaymentAdd}) {
  return {secondHouseSellDownPaymentAdd}
}

export default connect(mapStateToProps)(Form.create()(SecondHouseSellDownPaymentAdd));
