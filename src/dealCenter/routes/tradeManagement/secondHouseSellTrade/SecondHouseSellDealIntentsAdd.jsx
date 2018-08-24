import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import {Table,Button,Form,Input,Col,Row,Select} from 'antd'
const FormItem = Form.Item;
const Option=Select.Option;
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
import './SecondHouseSellDealIntentsAdd.css'

const SecondHouseSellDealIntentsAdd = ({location, dispatch,secondHouseSellDealIntentsAdd,form: {
  getFieldDecorator,
  validateFields,
  getFieldsValue,
  resetFields,
}}) => {
  const {
    loading,
    payModal,
    trackJSON,
    promptObj,
    transCode,
    type,
    transactionMode,
    reEditModalVisible,
    intentionInfo,
  }=secondHouseSellDealIntentsAdd;
  const creatInents=()=>{
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = { ...getFieldsValue()};
      dispatch({
        type:'secondHouseSellDealIntentsAdd/creatInentsOrder',
        payload:data,
      })
      // dispatch({
      //   type:'secondHouseSellDealIntentsAdd/validateCustomerInfo',
      //   payload:data,
      // })
    });
  }
  const payModalProps={
    payUserPlaceHolder:'请输入意向金实际支付客户姓名',
    orderInfo:payModal.orderInfo==null?{}:JSON.parse(payModal.orderInfo),
    loading:payModal.loading,
    serialNumber:payModal.serialNumber,
    orderModal:{
      title:'二手房出售支付意向金',
      visible:payModal.visible,
      okText:'提交订单',
    },
    closeMini:payModal.closeMini,
    payModal:{
      visible:false,
    },
    closeOrder(){
      dispatch({
        type:'secondHouseSellDealIntentsAdd/closePayModal'
      })
    },
    backToList(){
      dispatch(routerRedux.push({
        pathname:'/tradeManagement/secondHouseSellTrade'
      }))
    },
    creatOrder(data){
      dispatch({
        type:'secondHouseSellDealIntentsAdd/payGroupBuy',
        payload:data,
      })
    },
    paySuccess(){
      dispatch(
        routerRedux.push({
          pathname: '/tradeManagement/secondHouseSellTrade/secondHouseSellDealUploadIntentsAgreement',
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
        title:'意向单价',
        dataIndex:'unitPrice',
        key:'unitPrice',
      },
      {
        title:'意向总价',
        dataIndex:'totalPrice',
        key:'totalPrice',
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
          type:'secondHouseSellDealIntentsAdd/openComfirmModal',
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
    <div className='secondHouseSellDealIntentsAdd'>
      <DxConfirmModal visible={reEditModalVisible} title='确认删除该未支付订单？' description='删除之后将重新填写支付信息' onOk={()=>dispatch({
          type:'secondHouseSellDealIntentsAdd/cancelNoPayOrder'
        })} onCancel={()=>dispatch({type:'secondHouseSellDealIntentsAdd/closeComfirmModal'})} />
      {!!loading && <DxLoadingShadow visible={!!loading}/>}
      <PayModal {...payModalProps}/>
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'secondHouseSellDealIntentsAdd/closePrompt'})} onCancel={()=>dispatch({type:'secondHouseSellDealIntentsAdd/closePrompt'})}/>
      {!!trackJSON && <SHSellTradeInfo type='tradeCenter' trackJSON={trackJSON}/>}
      <DxPanel title='支付意向金'>
        <div>
          {type==='new' && <div><Row>
            <Col lg={12} md={24} className='dx_col_addonAfter'>
              <FormItem
                label='意向成交单价：'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('price', {
                  validateTrigger: 'onBlur',
                  rules: [
                    { required: true, message: '意向成交单价未输入' },
                    { type:'string',pattern:/^\d+\.?\d*$/, message: '输入内容非法' },
                  ],
                })(
                  <Input type='text' placeholder='请在此输入协商成交单价' addonAfter='元/㎡'/>
                )}
              </FormItem>
            </Col>
            <Col lg={12} md={24} className='dx_col_addonAfter'>
              <FormItem
                label='意向成交总价：'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('totalPrice', {
                  validateTrigger: 'onBlur',
                  rules: [
                    { required: true, message: '意向成交总价未输入' },
                    { type:'string',pattern:/^\d+\.?\d*$/, message: '输入内容非法' },
                  ],
                })(
                  <Input type='text' placeholder='请在此输入协商成交总价' addonAfter='万元'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={24} className='dx_col_addonAfter'>
              <FormItem
                label='意向定金金额：'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('deposit', {
                  validateTrigger: 'onBlur',
                  rules: [
                    { required: true, message: '意向定金金额未输入' },
                    { type:'string',pattern:/^\d+\.?\d*$/, message: '输入内容非法' },
                  ],
                })(
                  <Input type='text' placeholder='请在此输入意向定金金额' addonAfter='元'/>
                )}
              </FormItem>
            </Col>
            {/*transactionMode==='合作成交' && <Col lg={12} md={24}>
              <FormItem
                label='购房人验证'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('customerPhone', {
                  validateTrigger: 'onBlur',
                  rules: [
                    { required: true, message: '购房人电话未输入' },
                    { type:'string',pattern:/^1\d{10}$/, message: '购房人电话必须为11位长度的纯数字' },
                  ],
                })(
                  <Input type='text' placeholder='请在此输入购房人11位手机号'/>
                )}
              </FormItem>
            </Col>*/}
          </Row>
          {/*transactionMode==='合作成交' && <div>
            <Row>
            <Col sm={24} md={12}>
              <FormItem
                label='客户姓名'
                {...formItemLayout}
              >
                {getFieldDecorator('customerName', {
                  rules: [
                    { required: true, message: '客户姓名未输入' },
                  ],
                })(
                  <Input placeholder='请在此输入客户姓名'/>
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <FormItem
                {...formItemLayout}
                label='性别：'
              >
                {getFieldDecorator('gender', {
                  rules: [{ type: 'string', required: true, message: '客户性别未填写' }],
                })(
                  <Select placeholder='请选择客户性别' style={{width:'100%'}}>
                    <Option value='男'>男</Option>
                    <Option value='女'>女</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={12}>
              <FormItem
                label='客户电话'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('customerPhone', {
                  rules: [
                    { required: true, message: '客户电话未输入' },
                  ],
                })(
                  <Input type='text' placeholder='请输入客户电话'/>
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <FormItem
                label='客户身份证号码：'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('customerIDNumber', {
                  rules: [
                    { required: true, message: '客户身份证号码：未填写' },
                    { type:'string',pattern:/(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证号长度为18位，输入的内容异常' },
                  ],
                })(
                  <Input type='text' placeholder='请在此输入18位客户身份证号码：' />
                )}
              </FormItem>
            </Col>
          </Row>
        </div>*/}
        </div>}
          {/*(type==='old' && !!intentionInfo) && <DxShowMsgForm msgData={JSON.parse(intentionInfo)}/>*/}
          {(type==='old' && !!intentionInfo) &&
          <Table {...noPayOrderTableProps}/>}
        </div>
      </DxPanel>
      <div className='anzhua_button_bottom'>
        {type==='new' && <Button type='primary' onClick={creatInents}>生成意向金订单</Button>}
        {type==='old' && <Button type='primary' onClick={()=>dispatch({
          type:'secondHouseSellDealIntentsAdd/openPayModal',
          payload:transCode,
        })}>立即支付</Button>}
        <Button type='ghost' onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
      </div>
    </div>
  )
}

SecondHouseSellDealIntentsAdd.propTypes = {
  secondHouseSellDealIntentsAdd: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps({secondHouseSellDealIntentsAdd}) {
  return {secondHouseSellDealIntentsAdd}
}

export default connect(mapStateToProps)(Form.create()(SecondHouseSellDealIntentsAdd));
