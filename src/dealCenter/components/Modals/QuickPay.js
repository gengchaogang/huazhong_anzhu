import React,{PropTypes} from 'react'
import {
  Modal,
  Button,
  Form,
  Input
} from 'antd'
import {connect} from 'dva'

const FormItem=Form.Item;

const QuickPay=Form.create({})(
  function({form,visible,onCancel,data,onSubmit,dispatch}){
  const {getFieldDecorator}=form;
  const {title,largeTitle,value,orderNum,runNum,requireID,customer,cellphone,IDNum}=data;
  return (
    <Modal
      visible={visible}
      maskClosable={false}
      closable={false}
      footer={null}
      onCancel={onCancel}
      >
        <div>
          <h3>{title}</h3>
          <div>
            {largeTitle}
          </div>
          <div>
            付款金额：<span>{value}</span>元
          </div>
          <div>
            支付订单号：<span>{orderNum}</span>
          </div>
          <div>
            支付流水号：<span>{runNum}</span>
          </div>
        </div>
        <Form horizontal>
          <FormItem
            label="付款客户"
            >
            {
              getFieldDecorator('customer',{
                initialValue:customer
              })(
                <Input
                  placeholder="请输入付款客户姓名"
                />
              )
            }
          </FormItem>
          <FormItem
            label="客户手机号"
            >
            {
              getFieldDecorator('cellphone',{
                initialValue:cellphone
              })(
                <Input
                  placeholder="请输入付款客户手机号"
                />
              )
            }
          </FormItem>
          {
            requireID?
            <FormItem
              label="客户身份证号"
              >
              {
                getFieldDecorator('IDNum',{
                  initialValue:IDNum
                })(
                  <Input
                    placeholder="请输入付款客户身份证号"
                  />
                )
              }
            </FormItem>
            :null
          }
          <div>
            <Button type="primary" onClick={onSubmit} size="large">立即支付</Button>
            <Button type="ghost" onClick={onCancel} size="large">返回</Button>
          </div>
        </Form>
    </Modal>
  );
})

QuickPay.propTypes={
  data:PropTypes.shape({
    title:PropTypes.string.isRequired,
    largeTitle:PropTypes.string.isRequired,
    value:PropTypes.oneOfType([PropTypes.string,PropTypes.number]).isRequired,
    orderNum:PropTypes.oneOfType([PropTypes.string,PropTypes.number]).isRequired,
    runNum:PropTypes.oneOfType([PropTypes.string,PropTypes.number]).isRequired,
    requireID:PropTypes.bool
  }),
  visible:PropTypes.bool.isRequired,
  onCancel:PropTypes.func.isRequired,
  onSubmit:PropTypes.func.isRequired
}

export default connect()(QuickPay);
