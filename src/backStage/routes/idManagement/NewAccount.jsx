import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import {Form, Input,Row,Col,Radio,Select,Button,TreeSelect,Cascader,Upload, Icon, Modal,message} from 'antd';
import { routerRedux } from 'dva/router';
import './NewAccount.css'
import DxPanel from '../../../commons/components/DxPanel'
import DxUpLoadPic from '../../../commons/View/DxUpLoadPic'
import GaodeMap from '../../../commons/components/GaodeMap'
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow'
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const RadioGroup = Radio.Group;
const Option = Select.Option;

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

function NewAccount({newAccount,dispatch,form}) {
	const {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue,
    resetFields,
  }=form;
  const {
    cascaderOptions,
    orginCascader,
    latitude,
    longitude,
    initMarkers,
    cityOptions,
    orgincityOptions,
    areaCity,
    orginareaCity,
    opeartor,
    address,
    agencyId,
    areaAgency,
    areaCode,
    bePartOf,
    businessPath,
    businessPathCode,
    businessPhone,
    commonLicenseNumber,
    companyAddress,
    companyFullPath,
    companyFullPathCode,
    companyName,
    contacts,
    contactsPhone,
    corporation,
    fullPath,
    header,
    licenseNumber,
    licensePic,
    licenseType,
    loginName,
    name,
    tradingCenterPic,
    id,
    defultbusiness,
    defaultCity,
    defaultBePartOf,
    loading,
    mapChangePosition,
  } = newAccount;
  // console.log(mapChangePosition,'mapChangePosition');
  const goback=()=>{
    dispatch(routerRedux.goBack());
  }
  const mapClick=(markers)=>{
    dispatch({
      type:'newAccount/setState',
      payload:{
        latitude:markers.G.position.lat,
        longitude:markers.G.position.lng,
      }
    })
  }
  const upLoadEffectPicProps={
    url:'/miss-anzhu-aliyun-file/putfile',
    maxNum:1,//最大上传数
    maxSize:8,//文件大小限值
    showPicList: licensePic,//state管理图片list
    doCover:false,
    changeList:(data)=>{
      dispatch({
        type:"newAccount/setState",
        payload: {licensePic: data}
      })
    },//更新list回调
  }
  const upLoadDealCenter={
    url:'/miss-anzhu-aliyun-file/putfile',
    maxNum:1,//最大上传数
    maxSize:8,//文件大小限值
    showPicList: tradingCenterPic,//state管理图片list
    doCover:false,
    changeList:(data)=>{
      dispatch({
        type:"newAccount/setState",
        payload: {tradingCenterPic: data}
      })
    },//更新list回调
  }
  //选择交易归属
  const bePartChange=(key)=>{
    resetFields(['areaCode','areaAgency'])
    dispatch({
      type:'newAccount/setState',
      payload:{
        areaAgency:'',
        defaultBePartOf:'',
      }
    })
    if(key.target.value!='总部'){
      dispatch({
        type:'newAccount/getArea',
        payload:{
          bePartOf:key.target.value,
        }
      })
    }
  }
  //地区选择改变
  const cascaderChange=(key)=>{
    resetFields(['areaAgency'])
    dispatch({
      type:'newAccount/setState',
      payload:{
        areaAgency:'',
      }
    })
    if(key.length!=0){
      dispatch({
        type:'newAccount/cascaderChange',
        payload:{
          areaCode:key[key.length-1],
        }
      })
    }
  }
  //完成
  const handleSubmit=()=>{
    form.validateFields((err,values)=>{
      if(err){
        return
      }
      if(!!id){
        let tradingCenterPics;
        if(tradingCenterPic.length!=0){
          tradingCenterPics=tradingCenterPic[0].id;
        }else if(tradingCenterPic.length==0){
          return message.error('交易中心图片不能为空')
        }
        let licensePics;
        if(licensePic.length!=0){
          licensePics=licensePic[0].id;
        }
        let agencyIds='';
        for(let i= 0; i<opeartor.length; i++){
          if(opeartor[i].name==values.areaAgency){
            agencyIds=opeartor[i].id;
          }
        }
        if(latitude==''||longitude==''){
          return message.error('请点击地图，以确定经纬度')
        }
        const fullPath=_getNamePathsByCode(orginareaCity,values.areaCode[values.areaCode.length-1]);
        const businessPath=_getNamePathsByCode(orginCascader,values.businessPathCode[values.businessPathCode.length-1]);
        const companyFullPath=_getNamePathsByCode(orgincityOptions,values.companyFullPathCode[values.companyFullPathCode.length-1]);
        dispatch({
          type:'newAccount/editSubmit',
          payload:{
            id:id,
            address:values.address,
            areaAgency:values.areaAgency,
            agencyId:agencyIds,
            areaCode:values.areaCode[values.areaCode.length-1],
            fullPath:fullPath,
            bePartOf:values.bePartOf,
            businessPathCode:values.businessPathCode[values.businessPathCode.length-1],
            businessPath:businessPath,
            businessPhone:values.businessPhone,
            companyAddress:values.companyAddress,
            companyFullPathCode:values.companyFullPathCode[values.companyFullPathCode.length-1],
            companyFullPath:companyFullPath,
            companyName:values.companyName,
            contacts:values.contacts,
            contactsPhone:values.contactsPhone,
            corporation:values.corporation,
            header:values.header,
            licenseNumber:values.licenseNumber,
            commonLicenseNumber:values.commonLicenseNumber,
            licenseType:values.licenseType,
            loginName:values.loginName,
            name:values.name,
            licensePic:licensePics,
            tradingCenterPic:tradingCenterPics,
            latitude:latitude,
            longitude:longitude,
          }
        })
      }else{
        let tradingCenterPics;
        if(tradingCenterPic.length!=0){
          tradingCenterPics=tradingCenterPic[0].id;
        }else if(tradingCenterPic.length==0){
          return message.error('交易中心图片不能为空')
        }
        let licensePics;
        if(licensePic.length!=0){
          licensePics=licensePic[0].id;
        }
        let agencyIds='';
        for(let i= 0; i<opeartor.length; i++){
          if(opeartor[i].name==values.areaAgency){
            agencyIds=opeartor[i].id;
          }
        }
        if(latitude==''||longitude==''){
          return message.error('请点击地图，以确定经纬度')
        }
        const fullPath=_getNamePathsByCode(orginareaCity,values.areaCode[values.areaCode.length-1]);
        const businessPath=_getNamePathsByCode(orginCascader,values.businessPathCode[values.businessPathCode.length-1]);
        const companyFullPath=_getNamePathsByCode(orgincityOptions,values.companyFullPathCode[values.companyFullPathCode.length-1]);
        dispatch({
          type:'newAccount/addSubmit',
          payload:{
            address:values.address,
            areaAgency:values.areaAgency,
            agencyId:agencyIds,
            areaCode:values.areaCode[values.areaCode.length-1],
            fullPath:fullPath,
            bePartOf:values.bePartOf,
            businessPathCode:values.businessPathCode[values.businessPathCode.length-1],
            businessPath:businessPath,
            businessPhone:values.businessPhone,
            companyAddress:values.companyAddress,
            companyFullPathCode:values.companyFullPathCode[values.companyFullPathCode.length-1],
            companyFullPath:companyFullPath,
            companyName:values.companyName,
            contacts:values.contacts,
            contactsPhone:values.contactsPhone,
            corporation:values.corporation,
            header:values.header,
            licenseNumber:values.licenseNumber,
            commonLicenseNumber:values.commonLicenseNumber,
            licenseType:values.licenseType,
            loginName:values.loginName,
            name:values.name,
            licensePic:licensePics,
            tradingCenterPic:tradingCenterPics,
            latitude:latitude,
            longitude:longitude,
          }
        })
      }

    })
  }
  const mapChange=(value)=>{
    // console.log(selectedOptions,'...');
    let mapChangePosition='';
    mapChangePosition=value;
    // if(selectedOptions.length!=0){
    //   selectedOptions.map((item,index)=>(
    //     mapChangePosition+=(item.label+'/')
    //   ))
      dispatch({
        type:'newAccount/setState',
        payload:{
          mapChangePosition:mapChangePosition,
        }
      })
    // }
  }
	return(
		<Form horizontal>
      {!!id && <DxLoadingShadow visible={loading}/>}
			<DxPanel title='交易中心信息'>
				<Row>
					<Col sm={24} md={12}>
            <FormItem
              label='交易中心名称'
              {...formItemLayout}
            >
              {getFieldDecorator('name', {
                initialValue:name,
                validateTrigger: 'onBlur',
                rules: [
                  { required: true, message: '请输入6-16个字符或11位手机号码' },
                  { min:6, message: '请输入6-16个字符或11位手机号码' },
                  { max:16, message: '请输入6-16个字符或11位手机号码' },
                ],
              })(
                <Input type='text' placeholder='6-16个字符或11位手机号码'
                />
              )}
            </FormItem>
          </Col>
					<Col sm={24} md={12}>
            <FormItem
              label='登录名称'
              {...formItemLayout}
            >
              {getFieldDecorator('loginName', {
                initialValue:loginName,
              })(
                <Input type='text' disabled={!!id?true:false}/>
              )}
            </FormItem>
          </Col>
				</Row>
				<Row>
          <Col sm={24} md={12}>
            <FormItem
              label='默认登陆密码'
              {...formItemLayout}
            >
							<Input type='text' defaultValue='123456' disabled/>
            </FormItem>
          </Col>
					<Col sm={24} md={12}>
            <FormItem
              label='营业地址'
              {...formItemLayout}
            >
              {getFieldDecorator('businessPathCode', {
                initialValue:defultbusiness,
                rules: [
                  { required: true, message: '请选择地址' },
                ],
              })(
                <Cascader type='text'

                  options={cascaderOptions}  placeholder='请选择地址'
                />
              )}
            </FormItem>
          </Col>
				</Row>
				<Row>
          <Col sm={24} md={12}>
            <FormItem
              label='详细地址'
              hasFeedback
              {...formItemLayout}
            >
						{getFieldDecorator('address', {
              initialValue:address,
							rules: [
								{ required: true, message: '详细地址' },
							],
						})(
							<Input type='text' placeholder='详细地址' onChange={(e)=>mapChange(e.target.value)}/>
						)}
            </FormItem>
          </Col>
					<Col sm={24} md={12}>
            <FormItem
              label='营业电话'
              {...formItemLayout}
            >
              {getFieldDecorator('businessPhone', {
                initialValue:businessPhone,
                validateTrigger: 'onBlur',
                rules: [
                  { required: true, message: '请输入联系电话或手机号；格式：区号-号码' },
                  // { type:'string',pattern:/^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/, message: '请输入联系电话或手机号；格式：区号-号码' },
                  { type:'string',pattern:/(^1[34578]\d{9}$)|(^\d{3}-\d{8}$|^\d{4}-\d{7}$|^\d{3}-\d{7}$)/, message: '请输入联系电话或手机号；格式：区号-号码' },
                ],
              })(
                <Input type='text' placeholder='请输入联系电话或手机号；格式：区号-号码'/>
              )}
            </FormItem>
          </Col>
				</Row>
				<Row>
          <Col sm={24} md={12}>
            <FormItem
              label='交易中心负责人'
              {...formItemLayout}
            >
						{getFieldDecorator('header', {
              initialValue:header,
							rules: [
								{ required: true, message: '请输入姓名' },
							],
						})(
							<Input type='text' placeholder='请输入姓名'/>
						)}
            </FormItem>
          </Col>
					<Col sm={24} md={12}>
            <FormItem
              label='业务联系人'
              {...formItemLayout}
            >
              {getFieldDecorator('contacts', {
                initialValue:contacts,
                rules: [
                  { required: true, message: '请输入业务联系人姓名' },
                ],
              })(
                <Input type='text' placeholder='请输入业务联系人姓名'/>
              )}
            </FormItem>
          </Col>
				</Row>
				<Row>
          <Col sm={24} md={12}>
            <FormItem
              label='联系电话'
              {...formItemLayout}
            >
						{getFieldDecorator('contactsPhone', {
              initialValue:contactsPhone,
              validateTrigger: 'onBlur',
							rules: [
                  { required: true, message: '请输入11位有效手机号码' },
                  { type:'string',pattern:/^1(3|4|5|7|8)\d{9}$/, message: '请输入11位有效手机号码' },
                ],
						})(
							<Input type='text' placeholder='请输入11位有效手机号码'/>
						)}

            </FormItem>
          </Col>
					<Col sm={24} md={12}>
            {/*<FormItem
              label='交易服务费（元）'
              hasFeedback
              {...formItemLayout}
            >
              {getFieldDecorator('tradingServiceCharges', {
                initialValue: dataSource.tradingServiceCharges,
                rules: [
                  { required: true, message: '请输入数字，支持2位小数' },
									{ type:'string',pattern:/^\d+(?:\.\d{1,2})?$/, message: '输入内容非法' },
                ],
              })(
                <Input type='text' placeholder='请输入数字，支持2位小数'/>
              )}
            </FormItem>*/}
          </Col>
				</Row>
        <Row>
          <Col sm={24} md={12}>
            <span className='upLoadDealWords'>上传交易中心图片：</span>
            <div className='upLoadDealCenter'>
              <DxUpLoadPic {...upLoadDealCenter}/>
            </div>
          </Col>
          <Col sm={24} md={12}>
            <span>定位：</span>
            <GaodeMap mapClick={mapClick}
              width={400}
              height={300}
              address={!!mapChangePosition?mapChangePosition:businessPath}
              initMarkers={!!initMarkers&&initMarkers.length===0?initMarkers:[{position:['106.2456','29.213'],content:"sasa"}]}
              isClick={true}/>
            <div>坐标展示：{!!latitude?latitude+','+longitude:'请点击上图'}</div>
          </Col>
        </Row>
			</DxPanel>
			<DxPanel title='交易中心归属'>
				<Row>
					<Col sm={24} md={12}>
            <FormItem
              label='交易中心归属'
              hasFeedback
              {...formItemLayout}
            >
              {getFieldDecorator('bePartOf', {
                initialValue:bePartOf,
                rules: [
                  { required: true, message: '必填' },
                ],
              })(
								<RadioGroup onChange={(e)=>{bePartChange(e)}}>
							    <Radio value='总部'>总部</Radio>
							    <Radio value='省级代理商'>省级代理商</Radio>
							    <Radio value='市级代理商'>市级代理商</Radio>
							    <Radio value='区级代理商'>区级代理商</Radio>
							  </RadioGroup>
              )}
            </FormItem>
          </Col>
					<Col sm={24} md={12}>
            <FormItem
              label='地区选择'
              {...formItemLayout}
            >
              {getFieldDecorator('areaCode', {
                initialValue:defaultBePartOf,
              })(
								<Cascader options={areaCity}
                  onChange={(e)=>{cascaderChange(e)}}
                  disabled={form.getFieldValue('bePartOf')=='总部'?true:false}
                />
              )}
            </FormItem>
          </Col>
				</Row>
				<Row>
					<Col sm={24} md={12}>
            <FormItem
              label='地区代理商'
              {...formItemLayout}
            >
              {getFieldDecorator('areaAgency', {
                initialValue:areaAgency,
              })(
                <Select disabled={form.getFieldValue('bePartOf')=='总部'?true:false}>
                  {!!opeartor && opeartor.map((item,index)=>(
                    <Option key={`item_${index}`} value={item.name}>{item.name}</Option>
                  ))}
                </Select>
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
              hasFeedback
              {...formItemLayout}
              className='licenseType'
            >
              {getFieldDecorator('licenseType', {
                initialValue:licenseType,
                rules: [
                  { required: true, message: '必填' },
                ],
              })(
								<RadioGroup>
							    <Radio value='多证合一营业执照'>
										多证合一营业执照
										(原`注册号`字样,调整为18位的`统一社会信用代码`)
									</Radio>
							    <Radio value='普通营业执照'>
										普通营业执照
										(仍然标识为15位的`注册号`)
									</Radio>
							  </RadioGroup>
              )}
            </FormItem>
          </Col>
					<Col sm={24} md={12}>
						<FormItem
              label='营业执照'
              {...formItemLayout}
            >
              <DxUpLoadPic {...upLoadEffectPicProps}/>
            </FormItem>
					</Col>
				</Row>
				<Row>
					<Col sm={24} md={12}>
            <FormItem
              label={form.getFieldValue('licenseType')=='多证合一营业执照'?
                '统一社会信用代码':
                '普通营业执照'
              }
              {...formItemLayout}
            >
              {getFieldDecorator((form.getFieldValue('licenseType')=='多证合一营业执照'?'licenseNumber':'commonLicenseNumber'), {
                initialValue:(form.getFieldValue('licenseType')=='多证合一营业执照'?licenseNumber:commonLicenseNumber),
                validateTrigger: 'onBlur',
                rules: [
                  { required: true, message: '请输入' },
                  { len:(form.getFieldValue('licenseType')=='多证合一营业执照'?18:15),
                    message: ((form.getFieldValue('licenseType')=='多证合一营业执照'?'请输入18位统一社会信用代码':
                    '请输入15位普通营业执照')) },
                ],
              })(
								<Input type='text'
                  placeholder={form.getFieldValue('licenseType')=='多证合一营业执照'?'请输入18位的统一社会信用代码':
                  '请输入普通营业执照'}
                />
              )}
            </FormItem>
          </Col>
					<Col sm={24} md={12}>
            <FormItem
              label='企业名称'
              {...formItemLayout}
            >
              {getFieldDecorator('companyName', {
                initialValue:companyName,
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
              {getFieldDecorator('corporation', {
                initialValue:corporation,
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
              {getFieldDecorator('companyFullPathCode', {
                initialValue:defaultCity,
                rules: [
                  { required: true, message: '请选择' },
                ],
              })(
								<Cascader placeholder='请选择城市' options={cityOptions}/>
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
              {getFieldDecorator('companyAddress', {
                initialValue:companyAddress,
                rules: [
                  { required: true, message: '请与证件上地址严格一致' },
                ],
              })(
								<Input type='text' placeholder='请与证件上地址严格一致'/>
              )}
            </FormItem>
          </Col>
				</Row>
			</DxPanel>
			<div className='newAccountButton'>
				<Button type='primary' onClick={handleSubmit}>完成</Button>
				<Button type='ghost' onClick={goback}>取消</Button>
			</div>
		</Form>
	)
}


NewAccount.propTypes = {

};
function mapStateToProps({ newAccount }) {
	return { newAccount }
}

export default connect(mapStateToProps)(Form.create()(NewAccount))
