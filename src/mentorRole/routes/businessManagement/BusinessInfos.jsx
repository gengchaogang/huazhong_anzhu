import React from 'react'
import {connect} from 'dva'
import {Form,Input,Button,Row,Col,Radio,Cascader} from 'antd'
import DxPanel from '../../../commons/components/DxPanel'
import DxUpLoadPic from '../../../commons/View/DxUpLoadPic'
import PromptModal from '../../../commons/View/PromptModal'
const FormItem=Form.Item;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const formItemLayout1 = {
  labelCol: { span: 3 },
  wrapperCol: { span: 7 },
};

function BusinessInfos({dispatch,form,businessInfos}){
  const {getFieldDecorator}=form;
  const {
    showLogoList,
    isAuthentication,
    certificatesType,
    showBusinessLicenseList,
    tutorInfo,
    eopOptions,
    enterpriseInfo,
    promptObj,
    codePath,
    cityNames,
    currentAreaCode,
  }=businessInfos
  const upLoadPicProps={
    url:'/miss-anzhu-aliyun-file/putfile',
    maxNum:1,//最大上传数
    maxSize:5,//文件大小限值
    showPicList:showLogoList,//state管理图片list
    doCover:true,
    hideName:true,
    showDetail:false,
    changeList:(data)=>{
      dispatch({
        type:"businessInfos/setStatePramas",
        payload:{showLogoList:data},
      })
    },//更新list回调
  }
  const upLoadBusinessLicenseListPicProps={
    url:'/miss-anzhu-aliyun-file/putfile',
    maxNum:1,//最大上传数
    maxSize:5,//文件大小限值
    showPicList:showBusinessLicenseList,//state管理图片list
    doCover:true,
    hideName:true,
    showDetail:false,
    changeList:(data)=>{
      dispatch({
        type:"businessInfos/setStatePramas",
        payload:{showBusinessLicenseList:data},
      })
    },//更新list回调
  }

  const uploadBusinessInfos=()=>{
    form.validateFields((err, fieldsValue) => {
      if(err){
        return
      }else{
        const {name,contacts,contactsPhone} = fieldsValue;
        let editTutorValue = {name,contacts,contactsPhone};
        editTutorValue.id=tutorInfo.toturId;
        if(showLogoList.length ){
          if(showLogoList[0].id){
            editTutorValue.logoKey =showLogoList[0].id;
          }else{
            editTutorValue.logoKey =showLogoList[0].src;
          }
        }else{
          editTutorValue.logoKey = "";
        }
        //编辑导师信息
        dispatch({
          type:"businessInfos/editTutors",
          payload:{
            formData:editTutorValue,
          }
        });
      }
    })
  }

  const handleSubmit=()=>{
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }else{
        if(!isAuthentication){
          const {companyAddress,companyName,corporation} = fieldsValue;
          let enterpriseValue = {companyAddress,companyName,corporation};
          const citys = fieldsValue.citys;
          if(fieldsValue.citys && fieldsValue.citys.length){
            // enterpriseValue.codePath = fieldsValue.citys.join("/");
            enterpriseValue.codePath = citys[citys.length-1];
          }
          enterpriseValue.fullPath = cityNames;
          const certificateType = fieldsValue.certificatesType;
          if(certificateType === 1){
            enterpriseValue.licenseType = "多证合一营业执照";
            enterpriseValue.licenseNumber = fieldsValue.socialCreditCode;
          }else{
            enterpriseValue.licenseType = "普通营业执照";
            enterpriseValue.licenseNumber = fieldsValue.registerNumber;
          }
          if(showBusinessLicenseList.length ){
            if(showBusinessLicenseList[0].id){
              enterpriseValue.licensePicKey =showBusinessLicenseList[0].id;
            }else{
              enterpriseValue.licensePicKey =showBusinessLicenseList[0].src;
            }
          }else{
            enterpriseValue.licensePicKey = "";
          }

          //提交企业信息
          dispatch({
            type:"businessInfos/submitAuthentication",
            payload:{
              formData:enterpriseValue,
            }
          });

        }
      }
    });

  }
  const onRadioChange=(e)=>{
    dispatch({
      type:"businessInfos/setStatePramas",
      payload:{
        certificatesType:e.target.value
      }
    })
  }
  const onCascaderChange=(value,selectedOptions)=>{
    let namePath = "";
    if(selectedOptions.length){
      const nameArray = selectedOptions.map((item)=>{
        return item.label;
      });
      namePath = "/"+nameArray.join("/");
    }
    dispatch({
      type:"businessInfos/setStatePramas",
      payload:{
        cityNames:namePath,
      }
    })

  }
  const onOkCallBack=()=>{
		if(promptObj.todo==='closeModal'){
			dispatch({
				type:"businessInfos/togglePrompt",
				payload:{
					visible:false
				}
			})
		}
		if(promptObj.todo==='reReviewed'){
			dispatch({
				type:"main/logout"
			})
		}

  }
  const onCancelCallBack=()=>{}
  const handleCheckDetails=()=>{
    dispatch({
      type:"businessInfos/changeAuthentication",
      payload:{
        isAuthentication:false
      }
    })
  }
  return(
    <div className="businessInfos">
      <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack}/>
      <Form>
        <DxPanel title="企业信息">
          <Row>
            <Col sm={24} md={24}>
              <FormItem label="企业LOGO" {...formItemLayout1}>
                  <div>
                    <DxUpLoadPic {...upLoadPicProps}/>
                  </div>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={24}>
              <FormItem label="导师编号" {...formItemLayout1}>
                  <div>{tutorInfo.code}</div>
              </FormItem>
            </Col>
            <Col sm={24} md={24}>
              <FormItem label="安住合伙人企业名称" {...formItemLayout1}>
                {getFieldDecorator('name', {
                  initialValue:tutorInfo.name,
                  rules: [{ required: true, message:'请输入安住合伙人企业名称！' }],
                })(
                  <Input placeholder="请输入安住合伙人企业名称" disabled/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={24}>
              <FormItem label="联系人" {...formItemLayout1}>
                {getFieldDecorator('contacts', {
                  initialValue:tutorInfo.contacts,
                  rules: [{ required: false, message:'' }],
                })(
                  <Input placeholder="请输入联系人"/>
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={24}>
              <FormItem label="联系电话" {...formItemLayout1}>
                {getFieldDecorator('contactsPhone', {
                  initialValue:tutorInfo.contactsPhone,
                  rules: [{ required: false, message:'' },{pattern:/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,message:"请输入正确的联系电话,例(010-12345678 / 13098765432)"}],
                })(
                  <Input placeholder="请输入联系电话"/>
                )}
              </FormItem>
            </Col>
            <Col sm={16} md={16} offset={3}>
              <FormItem label="" {...formItemLayout1}>
                  <Button type="primary" onClick={uploadBusinessInfos}>保存</Button>
              </FormItem>
            </Col>
          </Row>
        </DxPanel>
        <DxPanel title="企业认证">
          {isAuthentication?
            <div>
              {tutorInfo.auditStatus==='审核通过'?
                <div>
                  企业认证已通过&nbsp;&nbsp;&nbsp;&nbsp;
                  <Button type="default" onClick={handleCheckDetails}>查看</Button>
              </div>:
                <div>企业认证已提交,等待审核&nbsp;&nbsp;&nbsp;&nbsp;<Button type="default">查看</Button></div>
            }
          </div>
          :
          <div>
          <Row>
            <Col sm={24} md={24}>
              <FormItem label="证件类型" {...formItemLayout1}>
                  {getFieldDecorator('certificatesType', {
                    initialValue :certificatesType,
                  rules: [{ required: false, message:'' }],
                })(
                  <RadioGroup onChange={onRadioChange}>
                    <Radio value={1} >
                      多证合一营业执照(原''注册号''字样,调整为18位的''统一社会信用代码'')
                    </Radio>
                    <Radio value={2}>普通营业执照(仍然标识为15位的''注册号'')</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={24}>
              <FormItem label="营业执照" {...formItemLayout1}>
                {getFieldDecorator('showBusinessLicenseList', {
                  rules: [{ required: false, message:'' }],
                })(
                  <div>
                    <DxUpLoadPic {...upLoadBusinessLicenseListPicProps}/>
                    <span>
                      照片所有信息需清晰可见，内容真实有效，不得做任何修改。照片支持 .jpg .jpeg .bmp .gif .png格式
                    </span>
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            {certificatesType===1?
            <Col sm={24} md={24}>
              <FormItem label="统一社会信用代码" {...formItemLayout1}>
                {getFieldDecorator('socialCreditCode', {
                  initialValue:enterpriseInfo.licenseNumber,
                  rules: [{ required: false, message:'请输入18位的统一社会信用代码' }],
                })(
                  <Input placeholder="请输入18位的统一社会信用代码"/>
                )}
              </FormItem>
            </Col>
            :
            <Col sm={24} md={24}>
              <FormItem label="注册号" {...formItemLayout1}>
                {getFieldDecorator('registerNumber', {
                  initialValue:enterpriseInfo.licenseNumber,
                  rules: [{ required: true, message:'请输入15位工商注册号',len:15 }],
                })(
                  <Input placeholder="请输入15位工商注册号"/>
                )}
              </FormItem>
            </Col>
          }
            <Col sm={24} md={24}>
              <FormItem label="企业名称" {...formItemLayout1}>
                {getFieldDecorator('companyName', {
                  initialValue:enterpriseInfo.companyName,
                  rules: [{ required: false, message:'请填写营业执照上的名称' }],
                })(
                  <Input placeholder="请填写营业执照上的名称"/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={24}>
              <FormItem label="法人代表" {...formItemLayout1}>
                {getFieldDecorator('corporation', {
                  initialValue:enterpriseInfo.corporation,
                  rules: [{ required: false, message:'请输入法人代表' }],
                })(
                  <Input placeholder="请输入法人代表"/>
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={24}>
              <FormItem label="所在城市" {...formItemLayout1}>
                {getFieldDecorator('citys', {
                  initialValue:currentAreaCode,
                  rules: [{ required: false, message:'请选择城市列表' }],
                })(
                  <Cascader
                    options={eopOptions}
                    onChange={onCascaderChange}
                    placeholder="请选择城市列表"
                    showSearch/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={24}>
              <FormItem label="详细地址" {...formItemLayout1}>
                {getFieldDecorator('companyAddress', {
                  initialValue:enterpriseInfo.companyAddress,
                  rules: [{ required: false, message:'请与证件上地址严格一致' }],
                })(
                  <Input placeholder="请与证件上地址严格一致"/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col offset={3}>
              <Button type="primary" onClick={handleSubmit}>提交</Button>
            </Col>
          </Row>
        </div>
        }
        </DxPanel>
      </Form>
    </div>
  )
}
function mapStateToProps({businessInfos}){return{businessInfos}}
export default connect(mapStateToProps)(Form.create({})(BusinessInfos));
