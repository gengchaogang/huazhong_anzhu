import React, { PropTypes } from 'react';
import fetch from 'dva/fetch';
import QRCode from 'qrcode.react';
import { routerRedux } from 'dva/router'
import { Form, Input, Modal,Row,Col,Select,Button} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
import DxLoadingShadow from '../../commons/UI/DxLoadingShadow'
import {
  findChargeStatusFetch,
}from '../services/accountFetch'
import './PayModal.css'
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

class PayModal extends React.Component {
  constructor(props){
    super(props);
    this.state={
      payVisible:false,
      // timeStamp:120,
      testTimeStamp:0,
      loading:true,
    }
    this.timer=null;
  }
  //订单modal确认回调
  orderOk=()=>{
    const {
      orderInfo:{
        payId,
      },
      form:{
        validateFields,
        getFieldsValue,
        resetFields,
      },
    }=this.props;
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = { ...getFieldsValue()};
      //返回父级填写的订单信息
      this.props.creatOrder({...data,payId,});
      this.setState({
        payVisible:true,
      });
      this.timer = setInterval(() => this.tick(),1000);
      // resetFields();
    });
  }
  tick=()=>{
    // if(this.state.timeStamp==0){
    //   clearInterval(this.timer);
    //   this.timer=null;
    //   this.setState({
    //     payVisible:false,
    //     timeStamp:120,
    //   });
    // }else{
    //   // const newTimeStamp=this.state.timeStamp-1;
    //   if(newTimeStamp%10===0){
    //     this.findChargeStatus()
    //   }
    //   this.setState({
    //     timeStamp:newTimeStamp,
    //   })
    // }
    const newTestTimeStamp = this.state.testTimeStamp + 1;
    if(newTestTimeStamp%10===0){
      this.findChargeStatus()
    }
    this.setState({
      testTimeStamp:newTestTimeStamp,
    })

  }
  findChargeStatus=()=>{
    const {orderNumber}=this.props.orderInfo;
    const me=this;
    fetch('/miss-anzhu-account/charge/findChargeStatus', {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        credentials:'include',
        body:JSON.stringify({orderNum:orderNumber}),
      }).then(
        (response)=>{
          if (response.status !== 200) return;
          response.json().then((results)=>{
            let login=true;
            try {
              if(results.status==='error' && results.loginState==='NO'){//没有登录
                login=false
              }
            }catch(e){
              let login=true;
            }
            // console.log('login',login);
            if(!!login){
              console.log('results',results);
              let success=false;
              try {
                if(results.data.isSuccess){
                  success=true;
                }
              } catch (e) {
                success=false;
              }
              if(success){
                me.payDone();
              }
            }else{
              clearInterval(me.timer);
              me.timer=null;
              me.setState({
                payVisible:false,
                //timeStamp:120,
                testTimeStamp:0,
              });
              window.dispatch(routerRedux.push('/login'));
            }
          });
        }
      ).catch(function(e) {

      });
  }
  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer=null;
  }
  //订单modal取消回调
  orderCancel=()=>{
    this.props.form.resetFields();
    this.props.closeOrder();
  }
  //重新生成订单
  rePay=()=>{
    //清空定时器关闭支付小模态框
    clearInterval(this.timer);
    this.timer=null;
    this.setState({
      payVisible:false,
      // timeStamp:120,
      testTimeStamp:0,
    });
    // this.props.rePay();
  }
  //点击支付成功
  reChecK=()=>{
    const {orderNumber}=this.props.orderInfo;
    const me=this;
    fetch('/miss-anzhu-account/charge/findChargeStatus', {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        credentials:'include',
        body:JSON.stringify({orderNum:orderNumber}),
      }).then(
        (response)=>{
          if (response.status !== 200) return;
          response.json().then((results)=>{
            let login=true;
            try {
              if(results.status==='error' && results.loginState==='NO'){//没有登录
                login=false
              }
            }catch(e){
              let login=true;
            }
            // console.log('login',login);
            if(!!login){
              console.log('results',results);
              let success=false;
              try {
                if(results.data.isSuccess){
                  success=true;
                }
              } catch (e) {
                success=false;
              }
              if(success){
                me.payDone();
              }else{
                if(!!me.props.backToList){
                  me.props.backToList();
                }else{
                  me.rePay();
                }
              }
            }else{
              clearInterval(me.timer);
              me.timer=null;
              me.setState({
                payVisible:false,
                //timeStamp:120,
                testTimeStamp:0,
              });
              window.dispatch(routerRedux.push('/login'));
            }
          });
        }
      ).catch(function(e) {

      });
  }
  //支付成功回调
  payDone=()=>{
    //清空定时器关闭支付小模态框
    clearInterval(this.timer);
    this.timer=null;
    this.setState({
      payVisible:false,
      // timeStamp:120,
      testTimeStamp:0,
    });
    this.props.form.resetFields();
    //支付成功回调
    this.props.paySuccess();
  }
  //获取支付流水号失败，响应props关闭支付小模态框
  componentWillReceiveProps(nextProps){
    if(!!nextProps.closeMini && !this.props.closeMini){
      this.rePay();
    }
  }
  render(){
    const {
      orderInfo:{//订单详细信息Obj
        discountName,//优惠名字
        amount,//金额
        orderNumber,//订单编号
        customerName,//客户姓名
        phoneNumber,//客户手机号
        idNumber,//客户身份证号
        bankCard,//客户银行卡号
        payId,//支付id
      },
      payUserPlaceHolder='请输入付款客户名字',
      serialNumber,
      loading,//未获得所有数据之前loading
      orderModal,//主体modal
      payModal,//执行支付modal
    }=this.props;
    const {
      getFieldDecorator,
    }=this.props.form;
    // const {countdown,time}=this.state;
    return(
      <Modal
        title={orderModal.title}
        visible={orderModal.visible}
        width='1000px'
        okText={orderModal.okText?orderModal.okText:'立即提交'}
        onOk={this.orderOk}
        onCancel={this.orderCancel}
        >
        <Modal title='银联商务'
          footer={false}
          visible={this.state.payVisible}
          maskClosable={false}
          closable={false}
          >
          <div className='payModal_payContent'>
            {/*this.state.loading && <DxLoadingShadow visible={this.state.loading}/>*/}
            <div className='payModal_contentBox'>
              <div className='payModal_qrCode'>
                {!!orderNumber && <QRCode value={`${orderNumber}`}/>}
              </div>
              <div className='payModal_msg'>
                <p>1、请使用POS机扫描左侧的二维码或将支付流水号：<b style={{color:'#FF6A6A'}}>{orderNumber}</b> 输入POS机内。</p>
                {/*<p>2、请在120秒内完成刷卡支付操作。</p>*/}
                <p>2、POS机支持银行卡类型</p>
                {/*<p>{`流水支付倒计时： ${this.state.timeStamp} 秒`}</p>*/}
              </div>
            </div>
            <div className='payModal_payContent_buttonGrop'>
              <Button type='ghost' onClick={this.rePay}>支付遇到问题，重新生成支付</Button>
              <Button type='primary' onClick={this.reChecK}>支付完成</Button>
            </div>
          </div>
        </Modal>
        <div>
          {
            loading?<DxLoadingShadow visible={loading}/>
            :<Form horizontal>
              {/*<FormItem
                label='支付类型'
                labelCol={{xs: 10,sm:8,md:6,lg:4}}
                wrapperCol={{xs: 12,sm:10,md:8,lg:6}}
              >
               {getFieldDecorator('payType', {
               })(
                 <span className='payModal_type'>{discountName?discountName:''}</span>
               )}
              </FormItem>*/}
              <Row>
                <Col lg={24} md={24}>
                  <span className='payModal_type'>{discountName?discountName:''}</span>
                </Col>
              </Row>
              {/*<FormItem
                label='付款金额'
                labelCol={{xs: 10,sm:8,md:6,lg:4}}
                wrapperCol={{xs: 12,sm:10,md:8,lg:6}}
              >
               {getFieldDecorator('amount', {
               })(
                 <span><b style={{color:'#FF6A6A'}}>{amount?amount:''}</b>元</span>
               )}
              </FormItem>
              <FormItem
                label='支付订单号'
                labelCol={{xs: 10,sm:8,md:6,lg:4}}
                wrapperCol={{xs: 12,sm:10,md:8,lg:6}}
              >
               {getFieldDecorator('amount', {
               })(
                 <span>{orderNumber}</span>
               )}
              </FormItem>
              <FormItem
                label='付款客户'
                hasFeedback
                labelCol={{xs: 10,sm:8,md:6,lg:4}}
                wrapperCol={{xs: 12,sm:10,md:8,lg:6}}
              >
                {getFieldDecorator('customerName', {
                  initialValue: !!customerName?customerName:'',
                  rules: [
                    { required: true, message: '付款客户未填写' },
                    { min: 1, message: '付款客户名字过短' },
                    { max: 12, message: '付款客户名字过长' },
                  ],
                })(
                  <Input type='text' placeholder='请输入付款客户名字'/>
                )}
              </FormItem>
              <FormItem
                label='客户手机号：'
                hasFeedback
                labelCol={{xs: 10,sm:8,md:6,lg:4}}
                wrapperCol={{xs: 12,sm:10,md:8,lg:6}}
              >
                {getFieldDecorator('phoneNumber', {
                  initialValue: !!phoneNumber?phoneNumber:'',
                  rules: [
                    { required: true, message: '客户手机号未填写' },
                    { type:'string',pattern:/^1\d{10}$/, message: '手机号必须为11位数字' },
                  ],
                })(
                  <Input type='text' placeholder='请输入客户手机号'/>
                )}
              </FormItem>*/}
              <Row>
                <Col lg={12} md={24}>
                  <FormItem
                    label='付款金额：'
                    {...formItemLayout}
                  >
                    <span><b style={{color:'#FF6A6A'}}>{amount?amount:''}</b>元</span>
                  </FormItem>
                </Col>
                <Col lg={12} md={24}>
                  <FormItem
                    label='支付订单号：'
                    {...formItemLayout}
                  >
                    <span>{orderNumber}</span>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={24}>
                  <FormItem
                    label='付款客户：'
                    hasFeedback
                    {...formItemLayout}
                  >
                    {getFieldDecorator('customerName', {
                      initialValue: !!customerName?customerName:'',
                      rules: [
                        { required: true, message: '付款客户未填写' },
                        { min: 1, message: '付款客户名字过短' },
                        { max: 12, message: '付款客户名字过长' },
                      ],
                    })(
                      <Input type='text' placeholder={payUserPlaceHolder}/>
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={24}>
                  <FormItem
                    label='客户手机号：'
                    hasFeedback
                    {...formItemLayout}
                  >
                    {getFieldDecorator('phoneNumber', {
                      initialValue: !!phoneNumber?phoneNumber:'',
                      rules: [
                        { required: true, message: '客户手机号未填写' },
                        { type:'string',pattern:/^1\d{10}$/, message: '手机号必须为11位长度的纯数字' },
                      ],
                    })(
                      <Input type='text' placeholder='请输入客户手机号'/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              {/*<Row>
                <Col lg={12} md={24}>
                  <FormItem
                    label='客户身份证号：'
                    hasFeedback
                    {...formItemLayout}
                  >
                    {getFieldDecorator('idNumber', {
                      initialValue: !!idNumber?idNumber:'',
                      rules: [
                        { required: true, message: '身份证号未填写' },
                        { type:'string',pattern:/(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证号长度为18位，输入的内容异常' },
                      ],
                    })(
                      <Input type='text' placeholder='请在此输入18位客户身份证号' />
                    )}
                  </FormItem>
                </Col>
                <Col lg={12} md={24}>
                  <FormItem
                    label='客户银行卡号：'
                    hasFeedback
                    {...formItemLayout}
                  >
                    {getFieldDecorator('bankCard', {
                      initialValue: !!bankCard?bankCard:'',
                      rules: [
                        { required: true, message: '银行卡号未填写' },
                        { type:'string',pattern:/^[0-9]*$/, message: '银行卡号为数字，输入的内容异常' },
                      ],
                    })(
                      <Input type='text' placeholder='请在此输入银行卡号' />
                    )}
                  </FormItem>
                </Col>
              </Row>*/}
              <Row style={{display:'none'}}>
                <Col lg={12} md={24}>
                  <FormItem
                    label='支付方式：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('payWay', {
                      initialValue: 'POS机',
                      rules: [
                        { required: true, message: '未选择支付方式' },
                      ],
                    })(
                      <Select placeholder='请选择支付方式' disabled>
                        <Option value='POS机'>POS机</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          }
        </div>
      </Modal>
    );
  }
}
// SearchInput.propTypes = {
//   creatOrder:PropTypes.func.isRequired,
//
// };
// SearchInput.defaultProps= {
// };

export default Form.create()(PayModal);
