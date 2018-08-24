import React from 'react';
import {connect} from 'dva';
import { routerRedux } from 'dva/router';
import {Row,Col,Input,Button,Form,message,Radio, Modal} from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'
import Panel from '../../../../commons/components/Panel'
import DxUpLoadPic from '../../../../commons/View/DxUpLoadPic'
import './ownerInfos.css'

import '../../../../commons/css/common.css';
import '../../../../commons/css/list.css';

import PromptModal from '../../../../commons/View/PromptModal';
import commonFinalCode from '../../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../../commons/utils/commonUtil.js';
import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow';

const RadioGroup = Radio.Group;
const FormItem=Form.Item;
const confirm = Modal.confirm;

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 7 },
};

function OwnerInfos({dispatch,ownerInfos,form}){
  const {getFieldDecorator}=form;
  const {showIdPicList,showHouseNuPicList,showContractPicList,leaseContractPicList,
    promptObj,loadingShadow,houseOwerInfo,currentIdentity
    }=ownerInfos

  var {houseBaseInfo} = ownerInfos;

  var {resourcesType} = houseBaseInfo;    // 房源类型  住宅、商铺、写字楼
  var {saleWay} = houseBaseInfo;          // 租售方式，如：出租、出售

  const upLoadIdPicProps={  //上传身份证附件
    url: commonFinalCode.addFileApiName,
    maxNum:1,//最大上传数
    maxSize:5,//文件大小限值
    showPicList:showIdPicList,//state管理图片list
    doCover:true,
    hideName:true,
    showDetail:true,
    changeList:(data)=>{
      dispatch({
        type:"ownerInfos/setState",
        payload:{
          showIdPicList:data,
        }
      })
    },//更新list回调
  }

  const upLoadHouseNuPicProps={ //上传房产证附件
    url: commonFinalCode.addFileApiName,
    maxNum:1,//最大上传数
    maxSize:5,//文件大小限值
    showPicList:showHouseNuPicList,//state管理图片list
    doCover:true,
    hideName:true,
    showDetail:true,
    changeList:(data)=>{
      dispatch({
        type:"ownerInfos/setState",
        payload: {
            showHouseNuPicList:data,
        }
      })
    },//更新list回调
  }

  const upLoadContractPicProps={  //上传房源委托合同
    url: commonFinalCode.addFileApiName,
    maxNum:3,//最大上传数
    maxSize:5,//文件大小限值
    showPicList:showContractPicList,//state管理图片list
    doCover:true,
    hideName:true,
    showDetail:true,
    changeList:(data)=>{
      dispatch({
        type:"ownerInfos/setState",
        payload:{
          showContractPicList:data,
        }
      })
    },//更新list回调
  }


  const upLoadLeaseContract={  //上传房源租赁合同
    url: commonFinalCode.addFileApiName,
    maxNum:3,//最大上传数
    maxSize:5,//文件大小限值
    showPicList:leaseContractPicList,//state管理图片list
    doCover:true,
    hideName:false,
    showDetail:true,
    changeList:(data)=>{
      dispatch({
        type:"ownerInfos/setState",
        payload:{
          leaseContractPicList:data,
        }
      })
    },//更新list回调
  }

  const toBack=()=>{
    dispatch(routerRedux.push({
      pathname:'/houseResourceSaleManagement/secondHandHouseSell/createSecondHandSellResource/houseImgs',
      state:{ //这里传入projectId 跳转到下一个页面时监听路由把值存在state中
          houseBaseInfo:houseBaseInfo,
      }
    }))
  }

  const toNext=()=>{

    dispatch(routerRedux.push({
      pathname:'/houseResourceSaleManagement/secondHandHouseSell/createSecondHandSellResource/assignAgent',
      // state:{ //这里传入projectId 跳转到下一个页面时监听路由把值存在state中
      //
      // }
    }))
  }


  const handleSubmit=(e)=>{
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) {
        message.error('请完善必填信息');
        return;
      }else{
          dispatch({
            type:"ownerInfos/submitData",
            payload:fieldsValue,
          })
      }
    })
  }
  const onOkCallBack=()=>{
      if(promptObj.todo==='closeModal'){
        dispatch({
          type:"ownerInfos/togglePrompt",
          payload:{
            visible:false
          }
        })
      }
  }
  const onCancelCallBack=()=>{}

  /** 业主身份 选择状态改变 */
  const ownerIdentityChange=(e)=>{
    dispatch({
      type:"ownerInfos/changeOwnerIdentity",
      payload:{
        currentIdentity:e.target.value
      }
    })
  }

  const deletePic=(id)=>{
      confirm({
          title: "确定删除该图片？",
          onOk() {
            dispatch({
                type:"ownerInfos/deletePic",
                payload:{
                  id:id,
                }
            })
          },
          onCancel() {},
      });
  }

  /** 创建已有的图片信息 */
  const createUpdatePic=(typeName)=>{
    if (houseOwerInfo && houseOwerInfo[typeName] != undefined) {
        const picListData = houseOwerInfo[typeName];
        if (picListData != null && picListData.length > 0) {
            let imgs = picListData.map((item, index)=>{
              return(
                <li key={index}>
                  <img className="showUpdateImg" src={item.path} alt="图片加载失败" key={`${index}a`}/>
                  <div>
                    <label>{item.name}</label>
                    &nbsp;&nbsp;
                    <label onClick={()=>deletePic(item.id)} className="deleteText">删除</label>
                  </div>
                </li>
              )
            })
            return (
              <ul className="imgUl">{imgs}</ul>
            )
        }else {
            return ('')
        }
    }
  }

  return(
    <div className="ownerInfos">

      <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack}/>
      <DxLoadingShadow visible={loadingShadow} />
      <Form onSubmit={handleSubmit}>
          <Panel title="房源归属信息"/>
          <div className="ownerInfos_basicMessage">
            <Row className="firstRow">
              {/*
                <Col sm={24} md={24}>
                  <FormItem label="业主身份" {...formItemLayout}>
                    {getFieldDecorator('ownerType', {
                      initialValue: houseOwerInfo.ownerType||"业主",
                      rules: [{ required: false, message:'请选择业主身份!' }],
                    })(
                      <RadioGroup onChange={ownerIdentityChange}>
                        <Radio value='业主'>业主</Radio>
                        <Radio value='租户'>租户</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
              */}
            </Row>
            <Row>
              <Col sm={24} md={24}>
                <FormItem label="业主姓名" {...formItemLayout}>
                  {getFieldDecorator('ownerName', {
                    initialValue: houseOwerInfo.ownerName,
                    rules: [{ required: true, message:'请输入业主姓名!' }],
                  })(
                    <Input placeholder="请输入业主姓名" maxLength="15"/>
                  )}
                </FormItem>
              </Col>
              <Col sm={24} md={24}>
                <FormItem label="联系电话"
                  {...formItemLayout}
                  >
                  {
                    form.getFieldDecorator('ownerPhone',{
                      initialValue: houseOwerInfo.ownerPhone,
                      rules:[
                        {required:true,message:'请输入联系电话!'},
                        {pattern:/^1[3|4|5|7|8][0-9]{9}$/,message:"请输入正确的联系电话"}
                      ],})(
                        <Input placeholder="请输入联系电话"/>
                    )
                  }
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col sm={24} md={24}>
                <FormItem label="性别" {...formItemLayout}>
                  {getFieldDecorator('gender', {
                    initialValue: houseOwerInfo.gender,
                    rules: [{ required: false, message:'请选择性别' }],
                  })(
                    <RadioGroup>
                      <Radio value='男'>男</Radio>
                      <Radio value='女'>女</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>

              <Col sm={24} md={24}>
                <FormItem label="身份证号"
                  {...formItemLayout}
                  >
                  {
                    form.getFieldDecorator('idNumber',{
                      initialValue: houseOwerInfo.idNumber,
                      rules:[
                        {required:false,message:'请输入身份证号码!'},
                        {pattern:/(^\d{15}$)|(^\d{17}([0-9]|X)$)/,message:"请输入正确的身份证号码"}
                      ],})(
                        <Input placeholder="请输入身份证号码"/>
                    )
                  }
                </FormItem>
              </Col>
            </Row>
          </div>
          <Panel title="身份证附件  (支持1张图片)"/>
          <div className="ownerInfos_idImgs">
            <Row className="firstRow">
              {/*
                <Col>
                    {
                      createUpdatePic('idPicture')
                    }
                </Col>
                */}
            </Row>
            <Row>
              <Col sm={23} md={23} offset={1}>
                <DxUpLoadPic {...upLoadIdPicProps}/>
              </Col>
            </Row>
          </div>
            <div>
                <Panel title="房产证  (支持1张图片)"/>
                    <div className="houseId">
                      {/*
                        <Row>
                            <Col sm={23} md={23} offset={1}>
                                {
                                  createUpdatePic('propertyPicture')
                                }
                            </Col>
                        </Row>
                        */}
                      <Row className="firstRow">
                        <Col span={23} md={23} offset ={1}>
                          <div className="ownerInfos_idImgs">
                            <DxUpLoadPic {...upLoadHouseNuPicProps}/>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm={24} md={24}>
                          <FormItem label="房产证号" {...formItemLayout}>
                            {getFieldDecorator('propertyCarNumber', {
                              initialValue: houseOwerInfo.propertyCarNumber,
                              rules: [{ required: false, message:'请输入房产证号!' }],
                            })(
                              <Input placeholder="请输入房产证号"/>
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                    </div>
                  </div>
          <Panel title="房源委托合同 (支持3张图片)"/>
            <div className="houseReImgs">
              {/*
                <Row>
                    <Col>
                        {
                          createUpdatePic('commissionContractPicture')
                        }
                    </Col>
                </Row>
                */}
            <Row className="firstRow">
              <Col sm={23} md={23} offset={1}>
                <div className="houseImgs">
                  <DxUpLoadPic {...upLoadContractPicProps}/>
                </div>
              </Col>
            </Row>
          </div>
          <div className="operation_button">
            <Row>
              <Col>
                <Button type="ghost" onClick={toBack}>上一步</Button>
                <Button type="primary" htmlType="submit">下一步</Button>
              </Col>
            </Row>
          </div>
      </Form>
    </div>
  )
}

function mapStateToProps({ownerInfos}){
  return{ownerInfos}
}
export default connect(mapStateToProps)(Form.create({})(OwnerInfos));
