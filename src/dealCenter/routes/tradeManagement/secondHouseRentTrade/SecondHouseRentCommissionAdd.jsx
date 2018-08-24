import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import {Table,Button,Form,Input,Col,Row,Checkbox,Select,Radio} from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
import DxPanel from '../../../../commons/components/DxPanel'
import DxConfirmModal from '../../../../commons/components/DxConfirmModal'
import {
  renderRentMeonyUnit,
} from '../../../../commons/utils/publicFunction'
import PromptModal from '../../../../commons/View/PromptModal'
import DxShowMsgForm from '../../../../commons/UI/DxShowMsgForm'
import PayModal from '../../../components/PayModal'
import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow'
import SHRentTradeInfo from '../../../../commons/components/SHRentTradeInfo'
// import SecondHouseRentTradeDetails from '../../../components/secondHouseRentTrade/SecondHouseRentTradeDetails'

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
import './SecondHouseRentCommissionAdd.css'
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
const SecondHouseRentCommissionAdd = ({location, dispatch,secondHouseRentCommissionAdd,form: {
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
    intentionInfo,
    reEditModalVisible,
    transCode,
    type,
    downPaymentInfo,
    resourcesType,
  }=secondHouseRentCommissionAdd;
  const creatDownPayment=()=>{
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = { ...getFieldsValue()};
      dispatch({
        type:'secondHouseRentCommissionAdd/creatInentsOrder',
        payload:data,
      })
    });
  }
  const payModalProps={
    orderInfo:payModal.orderInfo==null?{}:JSON.parse(payModal.orderInfo),
    loading:payModal.loading,
    serialNumber:payModal.serialNumber,
    orderModal:{
      title:'二手房出租支付佣金',
      visible:payModal.visible,
      okText:'提交订单',
    },
    closeMini:payModal.closeMini,
    payModal:{
      visible:false,
    },
    backToList(){
      dispatch(routerRedux.push({
        pathname:'/tradeManagement/secondHouseRentTrade'
      }))
    },
    closeOrder(){
      dispatch({
        type:'secondHouseRentCommissionAdd/closePayModal'
      })
    },
    creatOrder(data){
      dispatch({
        type:'secondHouseRentCommissionAdd/payGroupBuy',
        payload:data,
      })
    },
    paySuccess(){
      dispatch(
        routerRedux.push({
          pathname: '/tradeManagement/secondHouseRentTrade/secondHouseRentDealUploadCommissionAgreement',
          state:{
            transCode,
          }
        })
      )
    },
  }
  const noPayOrderTableProps={
    columns:[
      {
        title:'订单编号',
        dataIndex:'orderNumber',
        key:'orderNumber',
      },
      {
        title:'房屋实际出租金额',
        dataIndex:'rentAmount',
        key:'rentAmount',
      },
      {
        title:'中介佣金比例',
        dataIndex:'commissionRate',
        key:'commissionRate',
      },
      {
        title:'所需支付租房佣金',
        dataIndex:'commissionAmount',
        key:'commissionAmount',
      },
      {
        title:'交易服务费',
        dataIndex:'serviceCharge',
        key:'serviceCharge',
      },
      {
        title:'已缴纳意向金金额',
        dataIndex:'intentionAmount',
        key:'intentionAmount',
      },
      {
        title:'意向金是否抵押佣金',
        dataIndex:'isDeductedIntention',
        key:'isDeductedIntention',
        render:(bool)=><span>{`${bool?'是':'否'}`}</span>
      },
      {
        title:'创建时间',
        dataIndex:'createDateTime',
        key:'createDateTime',
      },
      {
        title:'操作',
        dataIndex:'operate',
        key:'operate',
        render:(text,record)=><span className='red_cursor' onClick={()=>dispatch({
          type:'secondHouseRentCommissionAdd/openComfirmModal',
          payload:record.transCode,
        })}>
        取消支付订单
      </span>,
      },
    ],
    dataSource:!!intentionInfo?[JSON.parse(intentionInfo)]:[],
    pagination:false,
    rowKey:(record)=>record.transCode,
  }
  function handleProportionChange(e){
    const totalPrice=getFieldsValue(['actualRent']).actualRent;
    if(!!totalPrice){
      setFieldsValue({
        commissionAmount: Math.floor(Number(totalPrice)*(Number(e.target.value)/100)),
      })
    }
  }
  function handleTotalPriceCharge(e){
    const proportion=getFieldsValue(['proportion']).proportion;
    if(!!proportion){
      setFieldsValue({
        commissionAmount: Math.floor((Number(proportion)/100)*Number(e.target.value)),
      })
    }
  }
  return (
    <div className='secondHouseRentCommissionAdd'>
      <DxConfirmModal visible={reEditModalVisible} title='确认删除该未支付订单？' description='删除之后将重新填写支付信息' onOk={()=>dispatch({
          type:'secondHouseRentCommissionAdd/cancelNoPayOrder'
        })} onCancel={()=>dispatch({type:'secondHouseRentCommissionAdd/closeComfirmModal'})} />
      {!!loading && <DxLoadingShadow visible={!!loading}/>}
      <PayModal {...payModalProps}/>
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'secondHouseRentCommissionAdd/closePrompt'})} onCancel={()=>dispatch({type:'secondHouseRentCommissionAdd/closePrompt'})}/>
      {!!trackJSON && <SHRentTradeInfo trackJSON={trackJSON} type='tradeCenter'/>}
      <DxPanel title='支付租房佣金' className='payDownPayment'>
        <div>
          {/*(type==='old' && !!intentionInfo) && <DxShowMsgForm msgData={JSON.parse(intentionInfo)}/>*/}
          {(type==='old' && !!intentionInfo) && <Table {...noPayOrderTableProps}/>}
          {type==='new' && <div>
            <Row>
              <Col lg={12} md={24} className='dx_col_addonAfter'>
                <FormItem
                  label='房屋实际出租金额'
                  hasFeedback
                  {...formItemLayout}
                >
                  {getFieldDecorator('actualRent', {
                    onChange:handleTotalPriceCharge,
                    rules: [
                      { required: true, message: '房屋实际出租金额未输入' },
                      { type:'string',pattern:/^\d*$/, message: '输入内容非法' },
                    ],
                  })(
                    <Input type='text' placeholder='请在此输入租金' addonAfter={renderRentMeonyUnit(resourcesType)}/>
                  )}
                </FormItem>
              </Col>
              <Col lg={12} md={24} className='dx_col_addonAfter'>
                <FormItem
                  label='中介佣金比例'
                  hasFeedback
                  {...formItemLayout}
                >
                  {getFieldDecorator('proportion', {
                    onChange:handleProportionChange,
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
                  label='所需支付租房佣金'
                  hasFeedback
                  {...formItemLayout}
                >
                  {getFieldDecorator('commissionAmount', {
                  })(
                    <Input type='text' disabled placeholder='所需支付租房佣金' addonAfter='元'/>
                  )}
                </FormItem>
              </Col>
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
            </Row>
          </div>}
        </div>
      </DxPanel>
      <span>注：佣金结算单笔账户代付手续费2元</span>
      <div className='anzhu_bottom_area'>
        {type==='new' && <Button type='primary' onClick={creatDownPayment}>生成佣金订单</Button>}
        {type==='old' && <Button type='primary' onClick={()=>dispatch({
          type:'secondHouseRentCommissionAdd/openPayModal',
          payload:transCode,
        })}>立即支付</Button>}
        <Button type='ghost' onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
      </div>
    </div>
  )
}

SecondHouseRentCommissionAdd.propTypes = {
  secondHouseRentCommissionAdd: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps({secondHouseRentCommissionAdd}) {
  return {secondHouseRentCommissionAdd}
}

export default connect(mapStateToProps)(Form.create()(SecondHouseRentCommissionAdd));
