import React from 'react'
import {connect} from 'dva'
import {Car,Button,Row,Col,Card,Form,Modal,Input,Select,Cascader } from 'antd'
import DxPanel from '../../../commons/components/DxPanel'
import PromptModal from '../../../commons/View/PromptModal';
import img from '../../assets/yay.jpg'
import './bankCardManagement.css'
const FormItem=Form.Item;
const Option=Select.Option;
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 9 },
};

function BankCardManagement({bankCardManagement,dispatch,form}){

  const{getFieldDecorator}=form;

  const {
    promptObj,
    upLoadBankLogo,
    showCard,
    defaultCard,
    addCardVisible,
    agreementVisible,
    deleteCardVisible,
    companyinfos,
    bankOptions,
    isWriteBank,
    cityOptions,
    province,
    city,
  }=bankCardManagement;

  const handleDelete=()=>{
    dispatch({
      type:"bankCardManagement/changeModa",
      payload:{
        deleteCardVisible:true,
      }
    })
  }

  const addCard=()=>{
    dispatch({
      type:"bankCardManagement/changeModa",
      payload:{
        addCardVisible:true,
      }
    })
  }

  const addCardCancel=()=>{
    dispatch({
      type:"bankCardManagement/changeModa",
      payload:{
        addCardVisible:false
      }
    })
  }

  const getVerificationCode=()=>{}

  const agreement=()=>{
    dispatch({
      type:"bankCardManagement/changeModa",
      payload:{
        agreementVisible:true
      }
    })
  }

  const agreementCancel=()=>{
    dispatch({
      type:"bankCardManagement/changeModa",
      payload:{
        deleteCardVisible:false
      }
    })
  }

  const handleSubmit=(e)=>{
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(values.bank==='其他银行'){
          values.bank=form.getFieldValue('writeBank')
        }
        values.logo=upLoadBankLogo;
        dispatch({type:"bankCardManagement/bindingCard",payload:{values:values}})
      }
    });
  }

  const deleteBankCard=(e)=>{
    e.preventDefault();
    form.validateFields(['withdrawPwd'],(err, values) => {
      if (!err) {
        dispatch({type:"bankCardManagement/deleteBankCard",payload:{withdrawPwd:values.withdrawPwd}})
      }else{
        console.log("withdrawPwd");
        console.log("err",err);
      }
    });
  }

  const onBankChange=(item)=>{
    if(item==='其他银行'){
      dispatch({type:"bankCardManagement/showBank",payload:{isWriteBank:true}})
    }
  }
  const onBankSelect=(item,option)=>{
    dispatch({
      type:"bankCardManagement/saveBankLogo",
      payload:{
        upLoadBankLogo:option.props.url
      }
    })
        console.log('option',option);
  }
  const onSelectChange=(value, selectedOptions)=>{
    let province = "";
    let city = "";
    if (selectedOptions != null && selectedOptions.length > 0) {
        selectedOptions.map((item,index)=>{
          if(index===0){
            province=item.label
          }else if(index===1){
            city=item.label
          }
        })
    }
    dispatch({
      type:"bankCardManagement/saveAreaName",
      payload:{
        province:province,
        city:city
      }})
  }

  const handleCascaderBlur=(value)=>{
    // form.resetFields(["communityName","buildingName","houseNumber"])
  }

  const onOkCallBack=()=>{
      if(promptObj.todo==='closeModal'){
        dispatch({
          type:"bankCardManagement/togglePrompt",
          payload:{
            visible:false
          }
        })
        dispatch({
          type:"bankCardManagement/showPrompt",
          payload:{
            visible:false
          }
        })
      }
      if(promptObj.todo==='closeModalAndFetch'){
        dispatch({
          type:"bankCardManagement/togglePrompt",
          payload:{
            visible:false
          }
        })
        dispatch({
          type:"bankCardManagement/changeModa",
          payload:{
            addCardVisible:false
          }
        })
        dispatch({
          type:"bankCardManagement/getInitInfos",
          payload:{},
        })
      }
  }

  const onCancelCallBack=()=>{}

  const showBankCard=()=>{
    return(
      <Card
        title={
          <div className="title">
            <Row>
              <Col span={4}>
                <img src={!!defaultCard.bankLogo?defaultCard.bankLogo:img} width="40px" style={{marginTop:"3px"}}/>
              </Col>
              <Col span={11}>
                <h4>{defaultCard.bank}</h4>
              </Col>
              <Col span={5}>
                <h4>尾号 {defaultCard.lastCode}</h4>
              </Col>
              <Col span={4}>
                <h4 className="cardType">
                  储蓄卡
                </h4>
              </Col>
            </Row>
          </div>
        }
        bordered={true}
        style={{ width: 400 }}>
        <div className="content">
          <Row>
            <Col>
              <Row>
                <Col span={4}>持卡人:</Col>
                <Col span={12}>{defaultCard.name}</Col>
              </Row>
            </Col>
            <Col>
              <Row>
                <Col span={4}>手机号:</Col>
                <Col span={16}>{defaultCard.phone}</Col>
                <Col span={4}><Button onClick={handleDelete} type="default">删除</Button></Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Card>
    )
  }

  const showAddCard=()=>{
    return(
      <Row>
        <Col>
          <Button onClick={addCard} type="default" style={{marginTop:'20px'}}>添加银行卡</Button>
        </Col>
      </Row>
    )
  }

  return(
    <div className="bankCardManagement">
      <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack}/>
      {
        showCard?
        <Modal
          title="删除银行卡"
          visible={deleteCardVisible}
          footer={false}
          onCancel={agreementCancel}
          >
          <Form onSubmit={deleteBankCard}>
            <FormItem label="提现密码" {...formItemLayout}>
              {getFieldDecorator('withdrawPwd', {
                rules: [
                  {required: true, message: '请输入最少6位提现密码',min:6,}, 
                  {type: 'string',pattern:"^[a-zA-Z0-9]+$",message: '存在特殊字符',},
                  ],
              })(
                <Input placeholder="请输入提现密码!" type="password"/>
              )}
            </FormItem>
            <FormItem>
              <Row>
                <Col offset={4} >
                  <Button type="primary" htmlType="submit">提交</Button>
                </Col>
              </Row>
            </FormItem>
          </Form>
        </Modal>
        :
        <Modal
          visible={addCardVisible}
          footer={false}
          onCancel={addCardCancel}
          width="750px"
          >
          <DxPanel title="添加银行卡">
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col sm={24} md={24}>
                  <FormItem label="开户名" {...formItemLayout}>
                      {!!companyinfos?companyinfos.companyName:null}
                  </FormItem>
                </Col>
                <Col sm={24} md={24}>
                  <FormItem label="开户银行名称" {...formItemLayout}>
                    {getFieldDecorator('bank', {
                      rules: [
                        { required: true, message:'请输入银行卡号!'},
                      ],
                    })(
                      <Select
                        onSelect={onBankSelect}
                        onChange={onBankChange}
                         placeholder="请输入银行卡号!">
                        {bankOptions.length?bankOptions.map((item,index)=>{
                          return(
                            <Option key={index} value={item.value} url={item.url}>{item.name}</Option>
                          )
                        }):null}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                {
                  isWriteBank?
                  <Col sm={24} md={24}>
                    <FormItem label="输入银行名称" {...formItemLayout}>
                      {getFieldDecorator('writeBank', {
                        rules: [{ required: true, message:'请输入开户银行名称' }],
                      })(
                        <Input placeholder="请输入开户银行名称"/>
                      )}
                    </FormItem>
                  </Col>
                  :
                  null
                }
                <Col sm={24} md={24}>
                  <FormItem label="开户银行归属" {...formItemLayout}>
                    {getFieldDecorator('city', {
                      rules: [{ required: true, message:'请选择开户银行归属!' }],
                    })(
                      <Cascader
                        options={cityOptions}
                        changeOnSelect={false}
                        onChange={onSelectChange}
                        placeholder="请选择开户银行归属!"
                        onBlur={handleCascaderBlur}
                        />
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={24}>
                  <FormItem label="开户支行名称" {...formItemLayout}>
                    {getFieldDecorator('branchName', {
                      rules: [{ required: true, message:'请选择输入开户支行名称!' }],
                    })(
                      <Input placeholder="请输入开户支行名称!"/>
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={24}>
                  <FormItem label="对公账号" {...formItemLayout}>
                    {getFieldDecorator('code', {
                      rules: [
                        { required: true, message:'请输入银行卡号!' },
                        {pattern:/^([1-9]{1})(\d{14}|\d{18})$/,message:"请输入正确的银行卡号!"}
                    ],
                    })(
                      <Input placeholder="请输入企业对公账号!"/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col sm={24} md={24}>
                  <FormItem label="预留手机号码" {...formItemLayout}>
                    {getFieldDecorator('phone', {
                      rules: [
                        { required: true, message:'请输入手机号码!'},
                        {pattern:/^1[3|4|5|7|8][0-9]\d{8}$/,message:"请输入正确的11位手机号码!"}
                      ],
                    })(
                      <Input placeholder="请输入手机号码!"/>
                    )}
                  </FormItem>
                </Col>
                <Col sm={24} md={24}>
                  <FormItem style={{marginTop:"20px"}}>
                    <Row>
                      <Col span={5} offset={4}>
                          <Button type="primary" htmlType="submit">提交</Button>
                      </Col>
                    </Row>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </DxPanel>
        </Modal>
      }
      <DxPanel title="银行卡管理">
        {showCard?showBankCard():showAddCard()}
      </DxPanel>
    </div>
  )
}
function mapStateToProps({bankCardManagement}){
  return{bankCardManagement}
}
export default connect(mapStateToProps)(Form.create({})(BankCardManagement));
