import React from 'react'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import {
  Form,
  Input,
  Button,
  Radio
} from 'antd'

import QuickPay from '../../../components/Modals/QuickPay'
import DxPanel from '../../../../commons/components/DxPanel'
const FormItem=Form.Item
const RadioGroup=Radio.Group;

const RakeOffPay=Form.create({})(function ({secondDeal,dispatch,form}){
  const {showRakeOffPay}=secondDeal;
  const {getFieldDecorator}=form;
  return (
    <DxPanel title="佣金支付">
      <Form horizontal>
        <FormItem
          >
          {
            getFieldDecorator('whoPay',{
              initialValue:0
            })(
              <RadioGroup>
                <Radio value={0}>买方承担</Radio>
                <Radio value={1}>卖方承担</Radio>
              </RadioGroup>
            )
          }
        </FormItem>
        <FormItem
          label="实际成交单价"
          >
          {
            getFieldDecorator('reachPrice',{})(
              <Input
                placeholder="请在此输入实际成交单价"
                addonAfter="元/㎡"
              />
            )
          }
        </FormItem>
        <FormItem
          label="实际成交总价"
          >
          {
            getFieldDecorator('reachTotalPrice',{})(
              <Input
                placeholder="请在此输入实际成交总价"
                addonAfter="万元"
              />
            )
          }
        </FormItem>
        <FormItem
          label="成交中介佣金比例"
          >
          {
            getFieldDecorator('rakeOffPercent',{})(
              <Input
                placeholder="请在此输入佣金占购房总价的比例"
                addonAfter="%"
              />
            )
          }
        </FormItem>
        <FormItem
          label="交易服务费"
          >
          {
            getFieldDecorator('servePrice',{})(
              <Input
                placeholder="若有交易服务费则输入"
                addonAfter="元"
              />
            )
          }
        </FormItem>
        <FormItem
          label="需支付中介佣金"
          >
          {
            getFieldDecorator('rakeOffPrice',{})(
              <Input
                placeholder="总房价*佣金比例=所需支付金额"
                addonAfter="元"
              />
            )
          }
        </FormItem>
        <Button type="primary" onClick={
          ()=>dispatch({
            type:'secondDeal/setState',
            payload:{showRakeOffPay:true}
          })
        } size="large">立即支付</Button>
        <Button type="ghost" onClick={
          ()=>dispatch(routerRedux.goBack())
        } size="large">返回</Button>
      </Form>
      <QuickPay
        visible={showRakeOffPay}
        onCancel={
          ()=>dispatch({
            type:'secondDeal/setState',
            payload:{showRakeOffPay:false}
          })
        }
        data={{
          title:'支付佣金',
          largeTitle:'二手房佣金',
          value:'10',
          orderNum:'45654646545',
          runNum:'521321',
          customer:'',
          cellphone:'',
        }}
        onSubmit={()=>alert('保存成功')}
      />
    </DxPanel>
  );
})

function mapStateToProps({secondDeal}){
  return {secondDeal};
}

export default connect(mapStateToProps)(RakeOffPay)
