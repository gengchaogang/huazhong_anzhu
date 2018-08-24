import React, { PropTypes } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import {Table,Button,Form,Input,Col,Row,Select} from 'antd'
const Option=Select.Option;
const FormItem = Form.Item;
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

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
import './SecondHouseRentDealIntentsAdd.css'

const SecondHouseRentDealIntentsAdd = ({location, dispatch,secondHouseRentDealIntentsAdd,form: {
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
    transactionMode,
    reEditModalVisible,
    transCode,
    type,
    intentionInfo,
    resourcesType,
  }=secondHouseRentDealIntentsAdd;
  const creatInents=()=>{
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = { ...getFieldsValue()};
      dispatch({
        type:'secondHouseRentDealIntentsAdd/creatInentsOrder',
        payload:data,
      })
      // dispatch({
      //   type:'secondHouseRentDealIntentsAdd/validateCustomerInfo',
      //   payload:data,
      // })
    });
  }
  const payModalProps={
    orderInfo:payModal.orderInfo==null?{}:JSON.parse(payModal.orderInfo),
    loading:payModal.loading,
    serialNumber:payModal.serialNumber,
    orderModal:{
      title:'二手房出租支付意向金',
      visible:payModal.visible,
      okText:'提交订单',
    },
    closeMini:payModal.closeMini,
    payModal:{
      visible:false,
    },
    closeOrder(){
      dispatch({
        type:'secondHouseRentDealIntentsAdd/closePayModal'
      })
    },
    backToList(){
      dispatch(routerRedux.push({
        pathname:'/tradeManagement/secondHouseRentTrade'
      }))
    },
    creatOrder(data){
      dispatch({
        type:'secondHouseRentDealIntentsAdd/payGroupBuy',
        payload:data,
      })
    },
    paySuccess(){
      dispatch(
        routerRedux.push({
          pathname: '/tradeManagement/secondHouseRentTrade/secondHouseRentDealUploadIntentsAgreement',
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
        title:'意向租金',
        dataIndex:'rentPrice',
        key:'rentPrice',
      },
      {
        title:'支付意向金',
        dataIndex:'payAmount',
        key:'payAmount',
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
          type:'secondHouseRentDealIntentsAdd/openComfirmModal',
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
  return (
    <div className='secondHouseRentDealIntentsAdd'>
      <DxConfirmModal visible={reEditModalVisible} title='确认删除该未支付订单？' description='删除之后将重新填写支付信息' onOk={()=>dispatch({
          type:'secondHouseRentDealIntentsAdd/cancelNoPayOrder'
        })} onCancel={()=>dispatch({type:'secondHouseRentDealIntentsAdd/closeComfirmModal'})} />
      {!!loading && <DxLoadingShadow visible={!!loading}/>}
      <PayModal {...payModalProps}/>
      <PromptModal {...promptObj} onOk={()=>dispatch({type:'secondHouseRentDealIntentsAdd/closePrompt'})} onCancel={()=>dispatch({type:'secondHouseRentDealIntentsAdd/closePrompt'})}/>
      {!!trackJSON && <SHRentTradeInfo trackJSON={trackJSON} type='tradeCenter'/>}
      <DxPanel title='支付意向金'>
        <div>
          {type==='new' && <div>
          <Row>
            <Col lg={12} md={24} className='dx_col_addonAfter'>
              <FormItem
                label='房屋意向租金'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('actualRent', {
                  validateTrigger: 'onBlur',
                  rules: [
                    { required: true, message: '房屋意向租金未输入' },
                    { type:'string',pattern:/^\d*$/, message: '输入内容非法' },
                  ],
                })(
                  <Input type='text' placeholder='请在此输入房屋意向租金' addonAfter={renderRentMeonyUnit(resourcesType)}/>
                )}
              </FormItem>
            </Col>
            <Col lg={12} md={24} className='dx_col_addonAfter'>
              <FormItem
                label='需支付的意向定金'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('intentionAmount', {
                  validateTrigger: 'onBlur',
                  rules: [
                    { required: true, message:'意向定金金额未输入'},
                    { type:'string',pattern:/^\d*$/, message: '输入内容非法' },
                  ],
                })(
                  <Input type='text' placeholder='请在此输入意向定金金额' addonAfter='元'/>
                )}
              </FormItem>
            </Col>
          </Row>
          {/*transactionMode==='合作成交' && <div>
            <Row>
              <Col lg={12} md={24}>
                <FormItem
                  label='客户电话'
                  hasFeedback
                  {...formItemLayout}
                >
                  {getFieldDecorator('customerPhone', {
                    validateTrigger: 'onBlur',
                    rules: [
                      { required: true, message: '客户电话未输入' },
                      { type:'string',pattern:/^1\d{10}$/, message: '客户电话必须为11位长度的纯数字' },
                    ],
                  })(
                    <Input type='text' placeholder='请输入客户电话'/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </div>*/}
        </div>}
          {(type==='old' && !!intentionInfo) && <div>
            {/*<DxShowMsgForm msgData={JSON.parse(intentionInfo)}/>*/}
            <Table {...noPayOrderTableProps}/>
          </div>}
        </div>
      </DxPanel>
      <div className='anzhu_bottom_area'>
        {type==='new' && <Button type='primary' onClick={creatInents}>生成租房意向金订单</Button>}
        {type==='old' && <Button type='primary' onClick={()=>dispatch({
          type:'secondHouseRentDealIntentsAdd/openPayModal',
          payload:transCode,
        })}>立即支付</Button>}
        <Button type='ghost' onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
      </div>
    </div>
  )
}

SecondHouseRentDealIntentsAdd.propTypes = {
  secondHouseRentDealIntentsAdd: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

function mapStateToProps({secondHouseRentDealIntentsAdd}) {
  return {secondHouseRentDealIntentsAdd}
}

export default connect(mapStateToProps)(Form.create()(SecondHouseRentDealIntentsAdd));
