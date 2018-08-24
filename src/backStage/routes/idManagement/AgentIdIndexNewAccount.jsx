import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import {Table, Icon, Button,Modal,Checkbox,Cascader,
  Input,Form,Select,Radio,Row,Col,message}from 'antd'
import './agentIdIndexNewAccount.css';
import DxUpLoadPic from '../../../commons/View/DxUpLoadPic'
import DxPanel from '../../../commons/components/DxPanel'
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const _getNameArrByCode=(arr, code)=>{
  var nameArr = [], item;
  for(var i=arr.length-1; i>=0; i--){
    item = arr[i];
    if(item.code == code){
      nameArr.push(item.lable);
      if(item.pCode){
        code = item.pCode;
      }else {
        break;
      }
    }
  }
  nameArr.reverse();
  return nameArr;
}

const _getNamePathsByCode=(arr, code)=>{
  var nameArr = _getNameArrByCode(arr, code);
  return "/"+nameArr.join("/");
}

const RadioGroup = Radio.Group;
const Option = Select.Option;
function AgentIdIndexNewAccount({dispatch,form,agentIdIndexNewAccount}) {
  const {
    documentType,
    showPicList,
    address,
		areaCode,
		areaName,
		businessLicense,
		businessLicenseCode,
		certificateType,
		city,
		cityCode,
		id,
		legalPerson,
		loginName,
		name,
		phoneNumber,
		principal,
		role,
    cascaderOptions,
    orginOptions,
    defaultAreaCode,
    defaultOptionalArea,
    roleLevel,
    roleCity,
    orginRoleCity,
  }=agentIdIndexNewAccount;
	const {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }=form;
  const handleSubmit=()=> {
		form.validateFields((err, values) => {
      const areaCode=values.areaCode[values.areaCode.length-1];
      const cityCode=values.cityCode[values.cityCode.length-1];
      const city=_getNamePathsByCode(orginOptions,values.cityCode[values.cityCode.length-1]);
      if (err) {
				return;
			}
      if(!!id){
        const areaName=_getNamePathsByCode(orginOptions,values.areaCode[values.areaCode.length-1]);
        if(showPicList.length==0){
          return message.error('请上传营业执照')
        }
        dispatch({
          type:'agentIdIndexNewAccount/editAgent',
          payload:{
            id:id,
            businessLicense:(showPicList.length!=0?showPicList[0].id:''),
            address:values.address,
            cityCode:cityCode,
            city:city,
            areaName:areaName,
            areaCode:areaCode,
            businessLicenseCode:values.businessLicenseCode,
            certificateType:values.certificateType,
            legalPerson:values.legalPerson,
            loginName:values.loginName,
            name:values.name,
            phoneNumber:values.phoneNumber,
            principal:values.principal,
            role:role,
          }
        })
      }else{
        const areaName=_getNamePathsByCode(orginRoleCity,values.areaCode[values.areaCode.length-1]);
        if(showPicList.length==0){
          return message.error('请上传营业执照')
        }
        dispatch({
          type:'agentIdIndexNewAccount/addAgent',
          payload:{
            businessLicense:(showPicList.length!=0?showPicList[0].id:''),
            address:values.address,
            cityCode:cityCode,
            city:city,
            areaName:areaName,
            areaCode:areaCode,
            businessLicenseCode:values.businessLicenseCode,
            certificateType:values.certificateType,
            legalPerson:values.legalPerson,
            loginName:values.loginName,
            name:values.name,
            phoneNumber:values.phoneNumber,
            principal:values.principal,
            role:values.role,
          }
        })
      }
		});
	}
  const cancelClick=()=>{
    dispatch({
      type:'agentIdIndexNewAccount/cancelClick'
    })
    dispatch(routerRedux.goBack());
  }
  const shopsUplod={
    url:'/miss-anzhu-aliyun-file/putfile',
    maxNum:1,//最大上传数
    maxSize:8,//文件大小限值
    showPicList:showPicList,//state管理图片list
    doCover:true,
    changeList:(data)=>{
      dispatch({
        type:'agentIdIndexNewAccount/querySuccess',
        payload:{showPicList:data}
      })
    },//更新list回调
  }
  const selectChange=(key)=>{
    dispatch({
      type:'agentIdIndexNewAccount/selectChange',
      payload:{role:key},
    })
  }
  const changetype=(e)=>{
    // console.log(e.target.value,'e.target.value');
    form.resetFields(['businessLicenseCode'])
  }
	return(
		<div>
      <Form>
        <DxPanel title='账号类型'>
          <Row>
  					<Col sm={24} md={12}>
              <FormItem
                label='账号角色'
                {...formItemLayout}
              >
                {getFieldDecorator('role', {
                  initialValue:role,
                  rules: [
                    { required: true, message: '必选' },
                  ],
                })(
                  <Select disabled={!!id?true:false} onChange={(value)=>{selectChange(value)}}>
                    {!!roleLevel && roleLevel.map((item,index)=>(
                      <Option key={`key_${index}`} value={item}>{item}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <FormItem
                label='可选区域'
                {...formItemLayout}
              >
                {getFieldDecorator('areaCode', {
                  initialValue:defaultOptionalArea,
                  rules: [
                    { required: true, message: '必选' },
                  ],
                })(
                  !!id?
                    <Cascader options={cascaderOptions} placeholder='请选择'
                      disabled={true} />
                  :<Cascader options={roleCity} placeholder='请选择'
                    disabled={!!id?true:false}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
  					<Col sm={24} md={12}>
              <FormItem
                label='登录账号'
                {...formItemLayout}
              >
                {getFieldDecorator('loginName', {
                  initialValue:loginName,
                  validateTrigger: 'onBlur',
                  rules: [
                    { required: true, message: '必选' },
                    { type:'string',pattern:/^1(3|4|5|7|8)\d{9}$/, message: '请输入11位有效手机号码' },
                  ],
                })(
                  <Input placeholder='请输入手机号码' disabled={!!loginName?true:false}/>
                )}
              </FormItem>
            </Col>
          </Row>
        </DxPanel>
        <DxPanel title='企业信息'>
          <Row>
  					<Col sm={24} md={12}>
              <FormItem
                label='证件类型'
                {...formItemLayout}
              >
                {getFieldDecorator('certificateType', {
                  initialValue:certificateType,
                  rules: [
                    { required: true, message: '必填' },
                  ],
                })(
  								<RadioGroup onChange={(e)=>changetype(e)}>
  							    {!!documentType && documentType.map((item,index)=>(
                        <Radio value={item} key={`item_${index}`}>{item}</Radio>
                    ))}
  							  </RadioGroup>
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <div className='uploadLicense'>
                <span>*营业执照：</span>
                <DxUpLoadPic {...shopsUplod}/>
              </div>
  						{/*<FormItem
                label='营业执照'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('businessLicense', {
                })(
  								<div className="clearfix">
  					        123
  					      </div>
                )}
              </FormItem>*/}
  					</Col>
  				</Row>
          <Row>
  					<Col sm={24} md={12}>
              {form.getFieldValue('certificateType')==
                `普通营业执照(仍然标识为15位的"注册号")`?
              <FormItem label='注册号'
                {...formItemLayout}
              >
                {getFieldDecorator('businessLicenseCode', {
                  initialValue:businessLicenseCode,
                  validateTrigger: 'onBlur',
                  rules: [
                    { required: true, message: '请输入15位的普通营业执照' },
                    { len:15,message: '请输入15位的普通营业执照'},
  									{/* type:'string',pattern:/^\d{15}[\w\d]$/, message: '输入内容非法' */},
                  ],
                })(
  								<Input type='text' placeholder='请输入15位的普通营业执照'/>
                )}
              </FormItem>:
              <FormItem
                label='统一社会信用代码'
                {...formItemLayout}
              >
                {getFieldDecorator('businessLicenseCode', {
                  initialValue:businessLicenseCode,
                  validateTrigger: 'onBlur',
                  rules: [
                    { required: true, message: '请输入18位的统一社会信用代码' },
                    { len:18, message: '请输入18位的统一社会信用代码'},
  									 { /*type:'string',pattern:/^\d{18}[\w\d]$/, message: '输入内容非法' */},
                  ],
                })(
  								<Input type='text' placeholder='请输入18位的统一社会信用代码'/>
                )}
              </FormItem>}
            </Col>
  					<Col sm={24} md={12}>
              <FormItem
                label='企业名称'
                {...formItemLayout}
              >
                {getFieldDecorator('name', {
                  initialValue:name,
                  rules: [
                    { required: true, message: '请填写营业执照上的名称' },
                  ],
                })(
  								<Input type='text' placeholder='请填写营业执照上的名称'/>
                )}
              </FormItem>
            </Col>
  				</Row>
  				<Row>
  					<Col sm={24} md={12}>
              <FormItem
                label='法人代表'
                {...formItemLayout}
              >
                {getFieldDecorator('legalPerson', {
                  initialValue:legalPerson,
                  rules: [
                    { required: true, message: '必填' },
                  ],
                })(
  								<Input type='text'/>
                )}
              </FormItem>
            </Col>
  					<Col sm={24} md={12}>
              <FormItem
                label='所在城市'
                {...formItemLayout}
              >
                {getFieldDecorator('cityCode', {
                  initialValue:defaultAreaCode,
                  rules: [
                    { required: true, message: '请选择' },
                  ],
                })(
  								<Cascader options={cascaderOptions} placeholder='请选择'/>
                )}
              </FormItem>
            </Col>
  				</Row>
  				<Row>
  					<Col sm={24} md={12}>
              <FormItem
                label='详细地址'
                {...formItemLayout}
              >
                {getFieldDecorator('address', {
                  initialValue:address,
                  rules: [
                    { required: true, message: '请与证件上地址严格一致' },
                  ],
                })(
  								<Input type='text' placeholder='请与证件上地址严格一致'/>
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <FormItem
                label='负责人'
                {...formItemLayout}
              >
                {getFieldDecorator('principal', {
                  initialValue:principal,
                  rules: [
                    { required: true, message: '请输入' },
                  ],
                })(
  								<Input type='text'/>
                )}
              </FormItem>
            </Col>
  				</Row>
          <Row>
            <Col sm={24} md={12}>
              <FormItem
                label='手机号码'
                {...formItemLayout}
              >
                {getFieldDecorator('phoneNumber', {
                  initialValue:phoneNumber,
                  validateTrigger: 'onBlur',
                  rules: [
                    { required: true, message: '请输入11位手机号' },
                    { type:'string',pattern:/^1(3|4|5|7|8)\d{9}$/, message: '请输入11位有效手机号码' },
                  ],
                })(
  								<Input type='text'/>
                )}
              </FormItem>
            </Col>
          </Row>
        </DxPanel>
      </Form>
      <div className='newAccountButton'>
				<Button type='primary' onClick={handleSubmit}>完成</Button>
				<Button type='ghost' onClick={cancelClick}>取消</Button>
			</div>
		</div>
	)
}


AgentIdIndexNewAccount.propTypes = {

};
function mapStateToProps({ agentIdIndexNewAccount }) {
	return { agentIdIndexNewAccount }
}

export default connect(mapStateToProps)(Form.create()(AgentIdIndexNewAccount))
