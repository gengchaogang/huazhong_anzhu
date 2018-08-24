import React from 'react'

import {
  Input,
  Form,
  Button,
  Checkbox
} from 'antd'

import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import QuickPay from '../../../components/Modals/QuickPay'
import DxPanel from '../../../../commons/components/DxPanel'

const FormItem=Form.Item;


const FirstPay=Form.create({})(
  function ({secondDeal,form,dispatch}){
    const {getFieldDecorator}=form;
    const {showFirstPay}=secondDeal;
    return (
      <DxPanel title="支付首付款">
        <Form horizontal>
          <FormItem
            label="首付款比例"
            >
            {
              getFieldDecorator('firstPayPercent',{})(
                <Input placeholder="请在此输入首付款比例" addonAfter="%"/>
              )
            }
          </FormItem>
          <FormItem
            label="首付款所需支付金额"
            >
            {
              getFieldDecorator('firstPayTotal',{})(
                <Input disabled addonAfter="元"/>
              )
            }
          </FormItem>
          <FormItem
            >
            {
              getFieldDecorator('makesure',{})(
                <Checkbox>已支付意向金10000元，抵扣首付款？</Checkbox>
              )
            }
          </FormItem>
          <Button type="primary" onClick={()=>{
            dispatch({type:'secondDeal/setState',payload:{showFirstPay:true}})
          }}>立即支付</Button>
          <Button type="ghost" onClick={()=>{
            dispatch(routerRedux.goBack());
          }}>返回</Button>
        </Form>

        <QuickPay
          visible={showFirstPay}
          onCancel={()=>{
            dispatch({
              type:'secondDeal/setState',
              payload:{showFirstPay:false}
            })
          }}
          onSubmit={()=>alert('支付成功')}
          data={{
            title:'支付首付款',
            largeTitle:'二手房首付款',
            value:'10000',
            orderNum:'45654646545',
            runNum:'521321',
            customer:'',
            cellphone:'',
          }}

        />
      </DxPanel>
    );
  }
)

function mapStateToProps({secondDeal}){
  return {secondDeal};
}

export default connect(mapStateToProps)(FirstPay);
