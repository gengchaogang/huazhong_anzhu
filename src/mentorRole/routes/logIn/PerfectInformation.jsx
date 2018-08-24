import React from 'react'
import { connect } from 'dva'
import { Car, Button, Row, Col, Card, Form, Modal, Input, Radio, Cascader } from 'antd'
import { routerRedux } from 'dva/router'
import DxPanel from '../../../commons/components/DxPanel'
import DxUpLoadPic from '../../../commons/View/DxUpLoadPic'
import img from '../../assets/yay.jpg'
import PromptModal from '../../../commons/View/PromptModal'
import './perfectInformation.css'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const formItemLayout1 = {
  labelCol: { span: 3 },
  wrapperCol: { span: 14 },
};

function PerfectInformation({ dispatch, form, perfectInformation }) {
  const { getFieldDecorator } = form;
  const {
    showBusinessLicenseList,
    certificatesType,
    userInfo,
    promptObj,
    eopOptions,
    cityNames
  } = perfectInformation

  const onRadioChange = (e) => {
    dispatch({
      type: "perfectInformation/changeRadioValue",
      payload: {
        certificatesType: e.target.value
      }
    })
  }
  const onCascaderChange = (value, selectedOptions) => {
    let namePath = "";
    if (selectedOptions.length) {
      const nameArray = selectedOptions.map((item) => {
        return item.label;
      });
      namePath = "/" + nameArray.join("/");
    }
    dispatch({
      type: "perfectInformation/setStatePramas",
      payload: {
        cityNames: namePath,
      }
    })

  }
  const upLoadBusinessLicenseListPicProps = {
    url: '/miss-anzhu-aliyun-file/putfile',
    maxNum: 1,//最大上传数
    maxSize: 8,//文件大小限值
    showPicList: showBusinessLicenseList,//state管理图片list
    doCover: true,
    hideName: true,
    showDetail: false,
    changeList: (data) => {
      dispatch({
        type: "perfectInformation/showBusinessLicenseListac",
        payload: data
      })
    },//更新list回调
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      } else {
        //
        const citys = fieldsValue.citys;
        if (citys && citys.length) {
          fieldsValue.codePath = citys[citys.length - 1];
        }
        fieldsValue.fullPath = cityNames;
        const certificateType = fieldsValue.certificateType;
        if (certificateType == 1) {
          fieldsValue.licenseType = "多证合一营业执照";
          fieldsValue.licenseNumber = fieldsValue.socialCreditCode;
        } else {
          fieldsValue.licenseType = "普通营业执照";
          fieldsValue.licenseNumber = fieldsValue.registerNumber;
        }

        fieldsValue.phoneNumber = userInfo.phone;
        fieldsValue.password = userInfo.password;
        fieldsValue.loginName = userInfo.loginName;
        fieldsValue.licensePicKey = showBusinessLicenseList[0].id;

        //注册导师
        dispatch({
          type: "perfectInformation/addTutors",
          payload: {
            formData: fieldsValue,
          }
        });
      }
    })
  }
  const onOkCallBack = () => {
    if (promptObj.todo === 'closeModal') {
      dispatch({
        type: "perfectInformation/togglePrompt",
        payload: {
          visible: false
        }
      })
    }
  }

  const onCancelCallBack = () => { }
  return (
    <div className="perfectInformation">
      <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack} />
      <Form onSubmit={handleSubmit}>
        <div>
          <Row>
            <Col sm={24} md={24} style={{ 'marginTop': "20px" }}>
              <FormItem label="企业名称" {...formItemLayout}>
                {
                  getFieldDecorator('name', {
                    rules: [
                      { required: true, message: '请填写企业名称' }
                    ],
                  })
                    (
                    <Input placeholder="请填写企业名称" maxLength='30' />
                    )
                }
              </FormItem>
            </Col>
            <Col sm={24} md={24}>
              <FormItem label="证件类型" {...formItemLayout}>
                {getFieldDecorator('certificateType', {
                  initialValue: certificatesType,
                  rules: [{ required: true, message: '' }],
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
              <FormItem label="营业执照" {...formItemLayout}>
                {getFieldDecorator('businessLicense', {
                  rules: [{ required: true, message: '必须上传营业执照' }],
                })(
                  <div>
                    <Row>
                      <Col span={11}>
                        <DxUpLoadPic {...upLoadBusinessLicenseListPicProps} />
                      </Col>
                      <Col span={13}>
                        <span className="tips">
                          照片所有信息需清晰可见，内容真实有效，不得做任何修改。照片支持 .jpg .jpeg .bmp .gif .png格式
                        </span>
                      </Col>
                    </Row>
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            {certificatesType == 1 ?
              <Col sm={24} md={24}>
                <FormItem label="统一社会信用代码" {...formItemLayout}>
                  {getFieldDecorator('socialCreditCode', {
                    rules: [
                      { required: true, pattern: "[1-9A-GY]{1}[1239]{1}[1-5]{1}[0-9]{5}[0-9A-Z]{10}", message: "请输入18位有效的统一社会信用代码" },
                    ],
                  })(
                    <Input placeholder="请输入18位的统一社会信用代码" maxLength='18' />
                  )}
                </FormItem>
              </Col>
              :
              <Col sm={24} md={24}>
                <FormItem label="注册号" {...formItemLayout}>
                  {getFieldDecorator('registerNumber', {
                    rules: [{ required: true, message: '请输入15位工商注册号', len: 15 }],
                  })(
                    <Input placeholder="请输入15位工商注册号" maxLength='15' />
                  )}
                </FormItem>
              </Col>
            }
            <Col sm={24} md={24}>
              <FormItem label="企业名称" {...formItemLayout}>
                {getFieldDecorator('companyName', {
                  rules: [{ required: true, message: '请填写营业执照上的名称' }],
                })(
                  <Input placeholder="请填写营业执照上的名称" maxLength='50' />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={24}>
              <FormItem label="法人代表" {...formItemLayout}>
                {getFieldDecorator('corporation', {
                  rules: [{ required: true, message: '请输入法人代表' }],
                })(
                  <Input placeholder="请输入法人代表" maxLength='50' />
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={24}>
              <FormItem label="所在城市" {...formItemLayout}>
                {getFieldDecorator('citys', {
                  rules: [{ required: true, message: '请选择城市列表' }],
                })(
                  <Cascader
                    options={eopOptions}
                    onChange={onCascaderChange}
                    placeholder="请选择城市列表"
                    showSearch
                    changeOnSelect
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={24}>
              <FormItem label="详细地址" {...formItemLayout}>
                {getFieldDecorator('companyAddress', {
                  rules: [{ required: true, message: '请与证件上地址严格一致' }],
                })(
                  <Input placeholder="请与证件上地址严格一致" maxLength='50' />
                )}
              </FormItem>
            </Col>
          </Row>
          <FormItem>
            <Row>
              <Col span={6} offset={6}>
                <Button type="button" htmlType="submit" className="toNextButton">注册</Button>
              </Col>
            </Row>
          </FormItem>
        </div>
      </Form>
    </div>
  )
}
function mapStateToProps({ perfectInformation }) {
  return { perfectInformation }
}
export default connect(mapStateToProps)(Form.create({})(PerfectInformation))
