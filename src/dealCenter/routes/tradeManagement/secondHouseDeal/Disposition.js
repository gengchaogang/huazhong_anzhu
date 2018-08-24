import React from 'react'
import {
  Input,
  Form,
  Button,
  Modal
} from 'antd'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import QuickPay from '../../../components/Modals/QuickPay'
import DxPanel from '../../../../commons/components/DxPanel'
const FormItem=Form.Item;

const Disposition=Form.create({})(
  function ({secondDeal,form,dispatch}){
    let {showDispositionPay}=secondDeal;
    const {getFieldDecorator}=form;
    const goBack=()=>{dispatch(routerRedux.goBack())};
    const setState=(payload)=>{
      dispatch({type:'secondDeal/setState',payload});
    };
    return (
      <DxPanel title="支付意向金">
        <Form horizontal onSubmit={()=>{}}>
          <FormItem
            label="意向成交单价："
            >
            {
              getFieldDecorator('price',{})(
                <Input
                  placeholder="请在此输入协商成交单价"
                  addonAfter="元/㎡"
                />
              )
            }
          </FormItem>
          <FormItem
            label="意向成交总价："
            >
            {
              getFieldDecorator('totalPrice',{})(
                <Input
                  placeholder="请在此输入意向成交总价"
                  addonAfter="万"
                />
              )
            }
          </FormItem>
          <FormItem
            label="请输入意向定金金额："
            >
            {
              getFieldDecorator('deposit',{})(
                <Input
                  placeholder="请在此输入客户缴纳意向金金额"
                  addonAfter="元"
                />
              )
            }
          </FormItem>
          <Button type="primary" size="large" onClick={()=>setState({showDispositionPay:true})}>生成意向金订单</Button>
          <Button type="ghost" size="large" onClick={goBack}>返回</Button>
        </Form>
        <QuickPay
          visible={showDispositionPay}
          onCancel={()=>setState({showDispositionPay:false})}
          data={{
            title:'支付意向金',
            largeTitle:'二手房意向金',
            value:'100000',
            orderNum:'124654764564',
            runNum:'214574445',
            requireID:true
          }}
          onSubmit={(e)=>{e.preventDefault();console.log({a:1})}}
        />
      </DxPanel>
    );
  }
)

function mapStateToProps({secondDeal}){
  return {secondDeal}
}

export default connect(mapStateToProps)(Disposition)
