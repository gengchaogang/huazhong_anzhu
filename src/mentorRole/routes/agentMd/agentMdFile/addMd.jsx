// import React from 'react'
// import {connect} from 'dva'
// import {Button,Steps,} from 'antd'
// import './createOfficeRentResource.css'
// import '../../../../commons/css/common.css';
// import '../../../../commons/css/list.css';
//
// import PromptModal from '../../../../commons/View/PromptModal';
// import commonFinalCode from '../../../../commons/utils/commonFinalCode.js';
// import commonUtil from '../../../../commons/utils/commonUtil.js';
// import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow';
// import {DxSteps,DxStep}from '../../../../commons/View/DxSteps'
//
// const Step = Steps.Step;
// function CreateOfficeRentResource(props){
//   const {dispatch,addMd,children,promptObj,loadingShadow,
//   }=props;
//   const {current}=addMd
//
//   const steps =[
//     '房源信息',
//     '房源图片',
//     '业主信息',
//     '指派经纪人',
//   ]
//   return(
//     <div className="mentorCreateHouse">
//       <div className="background">
//         <DxSteps current={current} className="navbar" status='finish'>
//           {steps.map(item => <DxStep key={`stepKey_${item}`} title={item}/>)}
//         </DxSteps>
//       </div>
//       {children}
//     </div>
//   )
// }
// function mapStateToProps({ addMd}) {
//   return { addMd }
// }
//
// export default connect(mapStateToProps)(CreateOfficeRentResource)
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Select, Row, Col, Input, Cascader, Radio, Button, Alert, message } from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'
import Panel from '../../../../commons/components/Panel'
import CheckableTags from '../../../../commons/UI/CheckableTags'
import '../../../../commons/css/common.css';
import '../../../../commons/css/list.css';

import PromptModal from '../../../../commons/View/PromptModal';
import commonFinalCode from '../../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../../commons/utils/commonUtil.js';
import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow';
import labelsFinalCode from '../../../../commons/utils/labelsFinalCode.js';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 7 },
};
const formItemLayoutLabel = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};
const CreateHouseTypeModalLayout = {
  labelCol: { span: 6, push: 18 },
  wrapperCol: { span: 18, pull: 6 },
}

const customStyle = {
  padding: '4px 8px',
  active: {
    background: '#42B38B',
    color: '#fff',
    borderColor: 'transparent'
  }
};

/***************************************************************/
/**************************************************************/
/**********  写字楼出租：基本信息 ******************************/
/*************************************************************/
/*************************************************************/

function addMd({ dispatch, form, addMd }) {
  const { getFieldDecorator } = form;

  const {
    tagsValue,
    shopsTypeTags,
    operateTypeTags,
    promptObj,
    loadingShadow,
    eopOptions,
    labels,
    houseBaseInfo,
    currentArea,
    communityData,
    buildingsData,
    roomsData,
    isAreaSelected,
    isCommunitied,
    isBuilded,
    buildingId,
    communityId,
    houseNumberId,
    } = addMd

  const checkHouseUnique = (value) => {
    //buildingsData  roomsData  communityData
    let buildingId = "";
    let communityId = "";
    let houseNumberId = "";
    const saleWay = "出租";
    if (communityData.length) {
      communityData.map(item => {
        if (item.name === form.getFieldValue("communityName")) {
          communityId = item.id;
        }
      })
    }
    if (buildingsData.length) {
      buildingsData.map(item => {
        if (item.name === form.getFieldValue("buildingName")) {
          buildingId = item.id;
        }
      })
    }
    if (roomsData.length) {
      roomsData.map(item => {
        if (item.houseNumber === value) {
          houseNumberId = item.id;
        }
      })
    }
    dispatch({
      type: "addMd/saveHouseUnique",
      payload: {
        buildingId: buildingId,
        communityId: communityId,
        houseNumberId: houseNumberId,
      }
    })
    dispatch({
      type: "addMd/checkHouseUnique",
      payload: {
        buildingId: buildingId,
        communityId: communityId,
        houseNumberId: houseNumberId,
        saleWay: saleWay,
        resourcesType: "写字楼"
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) {
        message.error('请完善必填信息');
        return;
      } else {
        //整理数据发起请求
        fieldsValue.buildingId = buildingId;
        fieldsValue.communityId = communityId;
        fieldsValue.houseNumberId = houseNumberId;
        let storey = parseInt(fieldsValue.storey);
        let totalFloors = parseInt(fieldsValue.totalFloors);
        if (storey > totalFloors) {
          message.error('房源楼层大于总楼层!');
          return;
        }
        dispatch({
          type: 'addMd/submitData',
          payload: fieldsValue,
        });
      }
    })
  }
  const onSelectChange = (value, selectedOptions) => {
    let valLen=value.length;
    if (valLen && valLen>2) {
    // if (value.length) {
      dispatch({
        type: "addMd/changeDisabled",
        payload: {
          isAreaSelected: false
        }
      })
    } else {
      dispatch({
        type: "addMd/changeDisabled",
        payload: {
          isAreaSelected: true,
          isCommunitied: true,
          isBuilded: true,
        }
      })
    }
    let areaName = "";
    if (selectedOptions != null && selectedOptions.length > 0) {
      selectedOptions.map((item, index) => {
        areaName = areaName + "/" + item['label'];
      })
    }
    if (currentArea !== areaName) {
      form.resetFields(["communityName", "buildingName", "houseNumber"])
    }
    dispatch({
      type: 'addMd/setState',
      payload: {
        areaName: areaName,
        currentArea: areaName,
      },
    });
    dispatch({
      type: "addMd/searchCommunities",
      payload: {
        areaName: areaName,
        type: "商铺"
      }
    })
  }
  const decorationCondition = () => {

  }
  const houseOrientation = () => {

  }
  const mortgageInformation = () => {

  }
  const supportLoan = () => {

  }
  const registerChange = (e) => {

  }
  const handleSelectChange = (value) => {

  }
  const tagsChange = (checked) => {
    dispatch({
      type: "addMd/changeTagsValue",
      payload: {
        tagsValue: checked
      }
    })
  }
  const shopsTypeTagsChange = (checked) => {
    dispatch({
      type: "addMd/changeTagsValue",
      payload: {
        shopsTypeTags: checked
      }
    })
  }
  const operateTypeTagsChange = (checked) => {
    dispatch({
      type: "addMd/changeTagsValue",
      payload: {
        operateTypeTags: checked
      }
    })
  }
  const onOkCallBack = () => {
    if (promptObj.todo === 'closeModal') {
      dispatch({
        type: "addMd/togglePrompt",
        payload: {
          visible: false
        }
      })
    }
  }
  const onCancelCallBack = () => { }

  const getlabelsByTypeName = (typeName) => {
    var _array = [];
    if (labels != null && labels[typeName]) {
      _array = labels[typeName];
    }
    return _array;
  }

  /** 创建下拉框选择项 */
  const getSelectOptionsByLabelName = (typeName) => {
    if (labels != null && labels[typeName]) {
      const _array = labels[typeName];
      return _array.map((item, index) => {
        return (
          <Option key={index} value={item.value}>{item.name}</Option>
        )
      })
    }
  }

  /** 单选 */
  const getSelectRadioByLabelName = (typeName) => {
    if (labels != null && labels[typeName]) {
      const _array = labels[typeName];
      return _array.map((item, index) => {
        return (
          <Radio key={index} value={item.value}>{item.name}</Radio>
        )
      })
    }
  }

  /**  返回列表 */
  const goBack = () => {
    dispatch(routerRedux.push({
      pathname: '/houseResourceRentManagement/officeRent',
      state: {

      }
    }))
  };
  const showCommunityData = (data) => {
    if (data.length) {
      return data.map((item, index) => {
        return (<Option key={index} value={item.name}>{item.name}</Option>)
      })
    }
  }
  const showRoomsData = (data) => {
    if (data.length) {
      return data.map((item, index) => {
        return (<Option key={index} value={item.houseNumber}>{item.houseNumber}</Option>)
      })
    }
  }
  const handleSelectBlur = (value) => {
    form.resetFields(["buildingName", "houseNumber"])
    if (communityData.length) {
      communityData.map((item, index) => {
        if (item.name === value) {
          dispatch({
            type: "addMd/getBuildingsData",
            payload: {
              id: item.id
            }
          })
        }
      })
    }
  }
  const handleSelect = (value, option) => {
    dispatch({
      type: "addMd/getBuildingsData",
      payload: {
        id: value
      }
    })
  }
  const handleBuildingNameSelect = (value, option) => {
    dispatch({
      type: "addMd/getRoomsData",
      payload: {
        id: value
      }
    })
  }
  const handleBuildingBlur = (value) => {
    form.resetFields(["houseNumber"])
    if (buildingsData.length) {
      buildingsData.map((item, index) => {
        if (item.name === value) {
          dispatch({
            type: "addMd/getRoomsData",
            payload: {
              id: item.id
            }
          })
        }
      })
    }
  }
  const handleCommunityChange = (value) => {
    if (value.length) {
      dispatch({
        type: "addMd/changeDisabled",
        payload: {
          isCommunitied: false
        }
      })
    } else {
      dispatch({
        type: "addMd/changeDisabled",
        payload: {
          isCommunitied: true,
          isBuilded: true,
        }
      })
    }
  }
  const handleBuildChange = (value) => {
    if (value.length) {
      dispatch({
        type: "addMd/changeDisabled",
        payload: {
          isBuilded: false
        }
      })
    } else {
      dispatch({
        type: "addMd/changeDisabled",
        payload: {
          isBuilded: true,
        }
      })
    }
  }

  const splitArea = (value) => {
    let areaLet = value;
    if (!!areaLet) {
      areaLet = areaLet.split('/');
      areaLet = areaLet.filter(function (index) {
        return !!index;
      });
    } else {
      areaLet = '';
    }
    return areaLet;
  }

  return (
    <div className="houseResource">
      <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack} />
      <DxLoadingShadow visible={loadingShadow} />
      <Form onSubmit={handleSubmit}>
        <Panel title="房源信息" />
        <div className="houseInfos">
          <Row className="firstRow">
            <Col sm={24} md={24}>
              <FormItem label="所在区域" {...formItemLayout}>
                {getFieldDecorator('area', {
                  //initialValue:!!houseBaseInfo.area?houseBaseInfo.area.split('/'):'',
                  initialValue: splitArea(houseBaseInfo.area),
                  rules: [{ required: true, message: '请选择区域' }],
                })(
                  <Cascader
                    options={eopOptions}
                    changeOnSelect={true}
                    onChange={onSelectChange}
                    placeholder="请选择城市列表"
                  />
                  )}
              </FormItem>
            </Col>
            <Col sm={24} md={24}>
              <FormItem label="写字楼名称"
                {...formItemLayout}
                extra={isAreaSelected ? <div className="houseDetailAddress">(请先选择城市!)</div> : null}
              >
                {
                  form.getFieldDecorator('communityName', {
                    initialValue: houseBaseInfo.communityName,
                    rules: [{ required: true, message: '请输入楼盘名称!' }, { max: 30, message: "长度过长" }],
                  })(
                    <Select
                      disabled={isAreaSelected}
                      combobox={true}
                      onChange={handleCommunityChange}
                      optionFilterProp="children"
                      optionLabelProp="children"
                      onSelect={handleSelect}
                      onBlur={handleSelectBlur}
                      placeholder="请选择或输入商铺名称!"
                    >
                      {showCommunityData(communityData)}
                    </Select>
                    )
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={24}>
              <FormItem label="楼栋单元" {...formItemLayout}
                extra={isCommunitied ? <div className="houseDetailAddress">(请先选择或输入商铺!)</div> : null}
              >
                {getFieldDecorator('buildingName', {
                  initialValue: houseBaseInfo.buildingName,
                  rules: [{ required: true, message: '请输入楼栋单元' }, { max: 30, message: "长度过长" }],
                })(
                  <Select
                    disabled={isCommunitied}
                    combobox={true}
                    optionFilterProp="children"
                    optionLabelProp="children"
                    onChange={handleBuildChange}
                    onSelect={handleBuildingNameSelect}
                    onBlur={handleBuildingBlur}
                    placeholder="请选择或输入楼栋单元!"
                  >
                    {showCommunityData(buildingsData)}
                  </Select>
                  )}
              </FormItem>
            </Col>
            <Col sm={24} md={24}>
              <FormItem label="房号" {...formItemLayout}
                extra={isBuilded ? <div className="houseDetailAddress">(请先选择楼栋单元!)</div> : null}
              >
                {getFieldDecorator('houseNumber', {
                  initialValue: houseBaseInfo.houseNumber,
                  rules: [{ required: true, message: '请输入房号' }, { max: 30, message: "长度过长" }],
                })(
                  <Select
                    disabled={isBuilded}
                    combobox={true}
                    optionFilterProp="children"
                    optionLabelProp="children"
                    placeholder="请选择或输入房号!"
                    onChange={checkHouseUnique}
                  >
                    {showRoomsData(roomsData)}
                  </Select>
                  )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={24}>
              <FormItem label="写字楼类型"
                {...formItemLayoutLabel}
              >
                {
                  form.getFieldDecorator('officeBuildingType', {
                    initialValue: houseBaseInfo.officeBuildingTypeArray,
                    rules: [{ required: true, message: '请选择写字楼类型!' }],
                  })(
                    <CheckableTags
                      multiple={false}
                      tags={labelsFinalCode.getlabelsByTypeName(labels, labelsFinalCode.labelHouseOffice_xzllx)}
                      customStyle={customStyle}
                      onChange={shopsTypeTagsChange}
                    // value={houseBaseInfo.officeBuildingTypeArray}
                    />
                    )
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={24}>
              <FormItem label="写字楼级别"
                {...formItemLayoutLabel}
              >
                {
                  form.getFieldDecorator('shopOfficeType', {
                    initialValue: houseBaseInfo.shopOfficeTypeArray,
                    rules: [{ required: true, message: '请选择写写字楼级别!' }],
                  })(
                    <CheckableTags
                      multiple={false}
                      tags={labelsFinalCode.getlabelsByTypeName(labels, labelsFinalCode.labelHouseOffice_xzljb)}
                      customStyle={customStyle}
                      onChange={shopsTypeTagsChange}
                    />
                    )
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={24}>
              <FormItem label="建筑面积" {...formItemLayout}>
                {getFieldDecorator('floorArea', {
                  initialValue: !!houseBaseInfo.floorArea ? houseBaseInfo.floorArea.toString() : null,
                  rules: [
                    { required: true, message: '请输入建筑面积' },
                    { type: 'string', pattern:/^([1-9]\d*|)(\.\d{1,2})?$/,message:"建筑面积，支持2位小数" },
                  ],
                })(
                  <Input placeholder="请输入建筑面积" addonAfter="㎡" maxLength="15" />
                  )}
              </FormItem>
            </Col>
            <Col sm={24} md={24}>
              <Row>
                <Col span={3} style={{ textAlign: 'right' }}>
                  <span className="formLabel ant-form-item-required">房源楼层:</span>
                </Col>
                <Col span={7}>
                  <Row className='houseType' gutter={6}>
                    <Col md={12} lg={12}>
                      <FormItem>
                        {getFieldDecorator('storey', {
                          initialValue: houseBaseInfo.storey,
                          rules: [
                            { required: true, message: '请输入楼层!' },
                            { type: 'string', pattern: /^[1-9]\d*$/, message: "房源楼层只能输入正整数" },
                          ],
                        })(<Input placeholder="楼层" addonAfter='层' maxLength="10" />)}
                      </FormItem>
                    </Col>
                    <Col md={12} lg={12}>
                      <FormItem >
                        {getFieldDecorator('totalFloors', {
                          initialValue: houseBaseInfo.totalFloors,
                          rules: [
                            { required: true, message: '请输入楼层!' },
                            { type: 'string', pattern: /^[1-9]\d*$/, message: "房源楼层只能输入正整数" },
                          ],
                        })(<Input placeholder="总楼层" addonAfter='层' maxLength="10" />)}
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={24}>
              <Row>
                <Col span={3} style={{ textAlign: 'right' }}>
                  <span className="formLabel ant-form-item-required">租金:</span>
                </Col>
                <Col span={7}>
                  <Row className='houseType' gutter={6}>
                    <Col md={12} lg={12}>
                      <FormItem>
                        {getFieldDecorator('totlePrice', {
                          initialValue: !!houseBaseInfo.totlePrice ? houseBaseInfo.totlePrice.toString() : null,
                          rules: [
                            { required: true, message: '请输入租金!' },
                            { type: 'string', pattern: /^[1-9]\d*$/, message: "租金只能输入正整数" },
                          ],
                        })(<Input placeholder="请输入租金" maxLength="15" />)}
                      </FormItem>
                    </Col>
                    <Col md={12} lg={12}>
                      <FormItem >
                        {getFieldDecorator('uintPirce', {
                          initialValue: houseBaseInfo.uintPirce,
                          rules: [{ required: true, message: '请选择单位!' },],
                        })(
                          <Select placeholder="请选择" onChange={handleSelectChange}>
                            {
                              labelsFinalCode.getSelectOptionsByLabelName(labels, labelsFinalCode.labelShops_czzjdw)
                            }
                          </Select>
                          )}
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col sm={24} md={24}>
              <FormItem label="建筑年代"
                {...formItemLayout}
              >
                {
                  form.getFieldDecorator('buildingAge', {
                    initialValue: houseBaseInfo.buildingAge,
                    rules: [{ required: true, message: '请输入建筑年代!' }],
                  })(
                    <Input placeholder="请输入建筑年代" addonAfter="年" maxLength="4" />
                    )
                }
              </FormItem>
            </Col>
          </Row>
          {/*
              <Row>
                <Col sm={24} md={24}>
                  <FormItem label="当前状态"
                    {...formItemLayout}
                    >
                    {
                      form.getFieldDecorator('shopCurrentStatus',{
                        initialValue: houseBaseInfo.shopCurrentStatus,
                        rules:[{required: true, message:'请选择当前状态!'}],})(
                          <RadioGroup onChange={decorationCondition}>
                             <Radio value="营业中">营业中</Radio>
                             <Radio value="闲置中">闲置中</Radio>
                             <Radio value="新铺">新铺</Radio>
                          </RadioGroup>
                      )
                    }
                  </FormItem>
                </Col>
              </Row>
              */}
          <Row>
            <Col sm={24} md={24}>
              <FormItem label="支付方式"
                {...formItemLayout}
              >
                {
                  form.getFieldDecorator('paymentMethod', {
                    initialValue: houseBaseInfo.paymentMethod,
                    rules: [{ required: true, message: '请选择支付方式!' }],
                  })(
                    <RadioGroup >
                      {
                        labelsFinalCode.getSelectRadioByLabelName(labels, labelsFinalCode.labelZzzpfs)
                      }
                    </RadioGroup>
                    )
                }
              </FormItem>
            </Col>
            <Col sm={24} md={24}>
              <FormItem label="是否可注册" {...formItemLayout}>
                {getFieldDecorator('officeBuildingRegistered', {
                  initialValue: houseBaseInfo.officeBuildingRegistered,
                  rules: [{ required: true, message: '请选择是否可注册' }],
                })(
                  <RadioGroup onChange={registerChange}>
                    <Radio value='可注册'>可注册</Radio>
                    <Radio value='不可注册'>不可注册</Radio>
                  </RadioGroup>
                  )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={24}>
              <FormItem label="是否可分割" {...formItemLayout}>
                {getFieldDecorator('split', {
                  initialValue: houseBaseInfo.split,
                  rules: [{ required: true, message: '请选择是否可分割' }],
                })(
                  <RadioGroup onChange={decorationCondition}>
                    <Radio value="不可分割">不可分割</Radio>
                    <Radio value="可分割">可分割</Radio>
                  </RadioGroup>
                  )}
              </FormItem>
            </Col>
            <Col sm={24} md={24}>
              <FormItem label="装修状况" {...formItemLayout}>
                {getFieldDecorator('decoration', {
                  initialValue: houseBaseInfo.decoration,
                  rules: [{ required: true, message: '请选择装修情况' }],
                })(
                  <RadioGroup onChange={decorationCondition}>
                    {
                      labelsFinalCode.getSelectRadioByLabelName(labels, labelsFinalCode.labelZxqk)
                    }
                  </RadioGroup>
                  )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={24}>
              <FormItem label="物业费" {...formItemLayout}>
                {getFieldDecorator('propertyCosts', {
                  initialValue: houseBaseInfo.propertyCosts,
                  rules: [{ required: true, message: '请输入物业费' }],
                })(
                  <Input placeholder="请输入物业费" addonAfter='元/㎡/月' />
                  )}
              </FormItem>
            </Col>
            <Col sm={24} md={24}>
              <FormItem label="详细地址" {...formItemLayout}>
                {getFieldDecorator('address', {
                  initialValue: houseBaseInfo.address,
                  rules: [{ required: true, message: '请输入详细地址' }],
                })(
                  <Input placeholder="请输入详细地址" />
                  )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            {/*
                <Col sm={24} md={24}>
                  <FormItem label="房源标题" {...formItemLayout}>
                      {
                        form.getFieldDecorator('houseName',{
                          initialValue: houseBaseInfo.houseName,
                          rules:[{required: true,message:'请输入房源标题!'}],})(
                            <Input placeholder="请输入房源标题"/>
                        )
                      }
                  </FormItem>
                </Col>
                */}
          </Row>
        </div>
        <Panel title={<div className='ant-form-item-required'>房源特色<span className="upperLimit">（最多选择3个标签）</span></div>} />
        <div className="houseCharacteristics">
          <Row>
            <Col sm={23} md={23} offset={1}>
              <FormItem {...formItemLayoutLabel}>
                {getFieldDecorator('characteristics', {
                  initialValue: houseBaseInfo.characteristicsArray,
                  rules: [
                    { required: true, message: '请选择房源特色' },
                    { type: "array", min: 1, message: '请至少选择一个标签!' },
                    { type: "array", max: 3, message: "最多只能选择三项!" },
                  ],
                })(
                  <CheckableTags
                    multiple={true}
                    tags={labelsFinalCode.getlabelsByTypeName(labels, labelsFinalCode.labelXzlczts)}
                    customStyle={customStyle}
                    onChange={tagsChange}
                    // value={houseBaseInfo.characteristicsArray}
                    max={3}
                  />
                  )}
              </FormItem>
            </Col>
          </Row>
        </div>

        <Panel title={<div className="ant-form-item-required">核心卖点</div>} />
        <div className="coreSelling">
          <Row className="firstRow">
            <Col sm={23} md={23} offset={1}>
              <FormItem {...formItemLayoutLabel}>
                {/*                <Alert
                                  message=''
                                  type="warning"
                                  description='不能出现任意联系方式(包含但不限于QQ,微信,网址,MSN,邮箱等);
                                    请勿添加其他小区广告,请勿输入与出售房源无关内容或非法信息.'
                                  showIcon
                                  />*/}
                {
                  form.getFieldDecorator('coreSellingPoint', {
                    initialValue: houseBaseInfo.coreSellingPoint,
                    rules: [{ required: true, message: '请输入内容，500字以内!' }],
                  })(
                    <Input type="textarea" rows={4} maxLength={200} placeholder='请输入内容，500字以内!' />
                    )
                }
              </FormItem>
              <FormItem>
                <div className="tips">
                  <Row>
                    <Col>
                      例如：
                    </Col>
                    <Col className="coreSellingPoint_tips">
                      1. 房屋特点：户型方正布局合理、黄金楼层、南北通透采光充足、装修精致即可入住
                    </Col>
                    <Col className="coreSellingPoint_tips">
                      2. 价格优势：此房满五年无税，房东诚意出售，此单价与本小区房屋相比已是最低
                    </Col>
                    <Col className="coreSellingPoint_tips">
                      3. 环境优势：此房位于小区中心位置，景观好，周边生活便利，紧临地铁
                    </Col>
                    <Col className="coreSellingPoint_tips">
                      4. 服务介绍：我最大的优点是真实、诚信！对于房子的优缺点，绝不隐瞒，房源信息100%真实，给您一个干净真实的房产世界。客户为尊，诚信为本！因为专业，所以值得信赖！选择我，选择专业！
                    </Col>
                  </Row>
                </div>
              </FormItem>
            </Col>
          </Row>
        </div>

        <div className="operation_button">
          <Button type="primary" onClick={goBack}>返回</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" htmlType="submit">下一步</Button>
        </div>
      </Form>
    </div>
  )

}

function mapStateToProps({ addMd }) {
  return { addMd }
}

export default connect(mapStateToProps)(Form.create({})(addMd));
