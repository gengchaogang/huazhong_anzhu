import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Select, Row, Col, Input, Cascader, Radio, Button, Alert, message, Checkbox, Modal } from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'
import Panel from '../../../../commons/components/Panel'
import GaodeMap from '../../../../commons/components/GaodeMap'
import CheckableTags from '../../../../commons/UI/CheckableTags'
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

import '../../../../commons/css/common.css';
import '../../../../commons/css/list.css';

import PromptModal from '../../../../commons/View/PromptModal';
import commonFinalCode from '../../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../../commons/utils/commonUtil.js';
import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow';
import labelsFinalCode from '../../../../commons/utils/labelsFinalCode.js';
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
const houseHXJS = [
  { name: 1, value: '1' },
  { name: 2, value: '2' },
  { name: 3, value: '3' },
  { name: 4, value: '4' },
  { name: 5, value: '5' },
  { name: 6, value: '6' },
  { name: 7, value: '7' },
  { name: 8, value: '8' },
  { name: 9, value: '9' },
  { name: 10, value: '10' },
]

/***************************************************************/
/**************************************************************/
/**********  二手房出售：添加房源基本信息 ***********************/
/*************************************************************/
/*************************************************************/

function HouseResourceInfos({ dispatch, form, houseResourceInfos }) {
  const { getFieldDecorator } = form;
  const {
    isAreaSelected,
    isBuilded,
    isCommunitied,
    currentArea,
    currentCommunity,
    currentBuilding,
    tagsValue,
    buildingsData,
    houseBaseInfo,
    roomsData,
    promptObj,
    loadingShadow,
    eopOptions,
    labels,
    houseFyhxOptions,
    communityData,
    buildingId,
    communityId,
    houseNumberId,
    checkBoxFlag,
    editVisibles,
    editVisibless,
    optionss,
    userTypes,
    selectKey,
  } = houseResourceInfos
  const handleSubmit = (e) => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) {
        message.error('请完善必填信息');
        return;
      } else {
        fieldsValue.totlePrice = parseFloat(fieldsValue.totlePrice) * 10000;
        if (selectKey) { fieldsValue.selectKey = selectKey.selectKey; }

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
        console.log(fieldsValue);
        dispatch({
          type: 'houseResourceInfos/submitData',
          payload: fieldsValue,
        });
      }
    })
  }
  // 所在区域 选择
  const onSelectChange = (value, selectedOptions) => {
    let valLen = value.length;
    if (valLen && valLen > 2) {
      dispatch({
        type: "houseResourceInfos/changeDisabled",
        payload: {
          isAreaSelected: false
        }
      })
    } else {
      dispatch({
        type: "houseResourceInfos/changeDisabled",
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
      type: 'houseResourceInfos/setState',
      payload: {
        areaName: areaName,
        currentArea: areaName
      },
    });
    dispatch({
      type: "houseResourceInfos/searchCommunities",
      payload: {
        areaName: areaName,
        type: "小区"
      }
    })
  }
  const onChangeKey = () => { }
  const decorationCondition = () => { }
  const houseStructure = () => { }
  const houseOrientation = () => { }
  const buildingType = () => { }
  const heatingType = () => { }
  const elevator = () => { }
  const onChangeCheck = () => {
    dispatch({
      type: "houseResourceInfos/checkBox",
      payload: {
        checkBoxFlag: !checkBoxFlag
      }
    })
  }



  const mortgageInformation = () => { }
  const supportLoan = () => { }
  const showHXJS = (data) => {
    const househxjsInfos = houseHXJS.map((item, index) => {
      return (
        <Option value={item.value} key={item.value}>{item.name} {data}</Option>
      )
    })
    return househxjsInfos
  }

  const tagsChange = (checked) => {
    dispatch({
      type: "houseResourceInfos/changeTagsValue",
      payload: {
        tagsValue: checked
      }
    })
  }

  const onOkCallBack = () => {
    if (promptObj.todo === 'closeModal') {
      dispatch({
        type: "houseResourceInfos/togglePrompt",
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

  /**  返回列表 */
  const goBack = () => {
    dispatch(routerRedux.push({
      pathname: '/houseResourceSaleManagement/secondHandHouseSell',
      state: {

      }
    }))
  };
  // 显示小区列表
  const showCommunityData = (data) => {
    if (data.length) {
      return data.map((item, index) => {
        return (<Option key={item.id} value={item.name}>{item.name}</Option>)
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


  const handleCascaderBlur = (value) => {
    // form.resetFields(["communityName","buildingName","houseNumber"])
  }
  const handleSelect = (value, option) => {
    dispatch({
      type: "houseResourceInfos/getBuildingsData",
      payload: {
        id: value
      }
    })
  }
  const handleSelectBlur = (value) => {
    form.resetFields(["buildingName", "houseNumber"])
    if (communityData.length) {
      communityData.map((item, index) => {
        if (item.name === value) {
          dispatch({
            type: "houseResourceInfos/getBuildingsData",
            payload: {
              id: item.id
            }
          })
        }
      })
    }
  }
  const handleBuildingNameSelect = (value, option) => {
    dispatch({
      type: "houseResourceInfos/getRoomsData",
      payload: {
        id: value
      }
    })
  }
  const handleCommunityChange = (value) => {
    if (value.length) {
      dispatch({
        type: "houseResourceInfos/changeDisabled",
        payload: {
          isCommunitied: false
        }
      })
    } else {
      dispatch({
        type: "houseResourceInfos/changeDisabled",
        payload: {
          isCommunitied: true,
          isBuilded: true,
        }
      })
    }
  }

  const handleBuildingBlur = (value) => {
    form.resetFields(["houseNumber"])
    if (buildingsData.length) {
      buildingsData.map((item, index) => {
        if (item.name === value) {
          dispatch({
            type: "houseResourceInfos/getRoomsData",
            payload: {
              id: item.id
            }
          })
        }
      })
    }
  }
  const checkHouseUnique = (value) => {
    //buildingsData  roomsData  communityData
    let buildingId = "";
    let communityId = "";
    let houseNumberId = "";
    const saleWay = "出售";
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
      type: "houseResourceInfos/saveHouseUnique",
      payload: {
        buildingId: buildingId,
        communityId: communityId,
        houseNumberId: houseNumberId,
      }
    })
    dispatch({
      type: "houseResourceInfos/checkHouseUnique",
      payload: {
        buildingId: buildingId,
        communityId: communityId,
        houseNumberId: houseNumberId,
        saleWay: saleWay,
        resourcesType: "住宅"
      }
    })
  }
  const handleBuildChange = (value) => {
    if (value.length) {
      dispatch({
        type: "houseResourceInfos/changeDisabled",
        payload: {
          isBuilded: false
        }
      })
    } else {
      dispatch({
        type: "houseResourceInfos/changeDisabled",
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
  const mapClick = () => { }
  const initMarkers = [];
  const handleSearch = (e) => {
    e.preventDefault();
    form.validateFields(["selectKey"], (err, values) => {
      console.log('Received values of form: ', values);
      dispatch({
        type: "houseResourceInfos/setState",
        payload: {
          selectKey: values
        }
      })
      //  form.resetFields(["selectKey"]);


    });
  }
  return (
    <div className="houseResource">
      <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack} />


      <DxLoadingShadow visible={loadingShadow} />
      <Form onSubmit={handleSubmit}>
        <Panel title="房源信息" className="panel" />
        <div className="houseInfos">
          <Row className="firstRow">
            {/*
                  <Col sm={24} md={24}>
                    <FormItem label="房源标题" {...formItemLayout}>
                      {
                        getFieldDecorator('houseName',{
                          initialValue: houseBaseInfo.houseName,
                          rules:[{required: true,message:'请输入房源标题!'}],})(
                            <Input placeholder="请输入房源标题"/>
                        )
                      }
                    </FormItem>
                  </Col>
                  */}
          </Row>
          <Row>
            <Col sm={24} md={24}>
              <FormItem label="所在区域" {...formItemLayout}>
                {getFieldDecorator('area', {
                  initialValue: splitArea(houseBaseInfo.area),
                  rules: [{ required: true, message: '请选择城市!' }],
                })(
                  <Cascader
                    options={eopOptions}
                    changeOnSelect={true}
                    onChange={onSelectChange}
                    placeholder="请选择城市!"
                    onBlur={handleCascaderBlur}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={24}>
              <FormItem label="小区名称"
                {...formItemLayout}
                extra={isAreaSelected ? <div className="houseDetailAddress">(请先选择城市!)</div> : null}
              >
                {
                  getFieldDecorator('communityName', {
                    initialValue: houseBaseInfo.communityName,
                    rules: [{ required: true, message: '请选择或输入小区名称!' }, { max: 30, message: "长度过长" }],
                  })(
                    <Select
                      onChange={handleCommunityChange}
                      disabled={isAreaSelected}
                      combobox={true}
                      optionFilterProp="children"
                      optionLabelProp="children"
                      onSelect={handleSelect}
                      onBlur={handleSelectBlur}
                      placeholder='请选择或输入小区名称!'
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
                extra={isCommunitied ? <div className="houseDetailAddress">(请先选择小区!)</div> : null}
              >
                {getFieldDecorator('buildingName', {
                  initialValue: houseBaseInfo.buildingName,
                  rules: [{ required: true, message: '请选择或输入楼栋单元!' }, { max: 30, message: "长度过长" }],
                })(
                  <Select
                    disabled={isCommunitied}
                    onChange={handleBuildChange}
                    combobox={true}
                    optionFilterProp="children"
                    optionLabelProp="children"
                    onSelect={handleBuildingNameSelect}
                    onBlur={handleBuildingBlur}
                    placeholder="请选择或输入楼栋单元!"
                  >
                    {showCommunityData(buildingsData)}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={24}>
              <FormItem label="房号" {...formItemLayout}
                extra={isBuilded ? <div className="houseDetailAddress">(请先选择楼栋单元!)</div> : null}
              >
                {getFieldDecorator('houseNumber', {
                  initialValue: houseBaseInfo.houseNumber,
                  rules: [{ required: true, message: '请选择或输入房号!' }, { max: 30, message: "长度过长" }],
                })(
                  <Select
                    disabled={isBuilded}
                    combobox={true}
                    optionFilterProp="children"
                    optionLabelProp="children"
                    placeholder='请选择或输入房号!'
                    onChange={checkHouseUnique}
                  >
                    {showRoomsData(roomsData)}
                  </Select>
                )}
              </FormItem>
            </Col>

            <Col sm={24} md={24}>
              <Row>
                <Col span={3} style={{ textAlign: 'right' }}>
                  <span className="formLabel ant-form-item-required">户型居室:</span>
                </Col>
                <Col span={7}>
                  <Row className='houseType' gutter={6}>
                    <Col md={6} lg={6}>
                      <FormItem>
                        {getFieldDecorator('houseRoom', {
                          initialValue: !!houseBaseInfo.houseRoom ? `${houseBaseInfo.houseRoom}室` : null,
                          rules: [{ required: true, message: '请选择几室!' },],
                        })(
                          <Select placeholder="几室" allowClear={true}>
                            {houseHXJS.length ? showHXJS("室") : <Option value={1} key={1}>1</Option>}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col md={6} lg={6}>
                      <FormItem >
                        {getFieldDecorator('livingRoom', {
                          initialValue: !!houseBaseInfo.livingRoom ? `${houseBaseInfo.livingRoom}厅` : null,
                          rules: [{ required: true, message: '请选择几厅!' },],
                        })(
                          <Select placeholder="几厅" allowClear={true}>
                            {showHXJS("厅")}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col md={6} lg={6}>
                      <FormItem>
                        {getFieldDecorator('cookRoom', {
                          initialValue: !!houseBaseInfo.cookRoom ? `${houseBaseInfo.cookRoom}厨` : null,
                          rules: [{ required: true, message: '请选择几厨!' },],
                        })(
                          <Select placeholder="几厨" allowClear={true}>
                            {showHXJS("厨")}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col md={6} lg={6}>
                      <FormItem >
                        {getFieldDecorator('bathRoom', {
                          initialValue: !!houseBaseInfo.bathRoom ? `${houseBaseInfo.bathRoom}卫` : null,
                          rules: [{ required: true, message: '请选择几卫!' },],
                        })(
                          <Select placeholder="几卫" allowClear={true}>
                            {showHXJS("卫")}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={24}>
              <FormItem label="建筑面积" {...formItemLayout}>
                {getFieldDecorator('floorArea', {
                  initialValue: !!houseBaseInfo.floorArea ? houseBaseInfo.floorArea.toString() : null,
                  rules: [
                    { required: true, message: '请输入建筑面积' },
                    { type: 'string', pattern: /^([1-9]\d*|0)(\.\d{1,2})?$/, message: "建筑面积，支持2位小数" },
                  ],
                })(
                  <Input placeholder="请输入建筑面积" addonAfter="㎡" maxLength="15" />
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={24}>
              <FormItem label="期望售价"
                {...formItemLayout}
              >
                {
                  getFieldDecorator('totlePrice', {
                    initialValue: !!houseBaseInfo.totlePrice ? (houseBaseInfo.totlePrice / 10000).toString() : null,
                    rules: [
                      { required: true, message: '请输入期望售价!' },
                      { type: 'string', pattern: /^([1-9]\d*|0)(\.\d{1,2})?$/, message: "期望售价，支持2位小数" },
                    ],
                  })(
                    <Input placeholder="请输入期望售价" addonAfter="万元" maxLength="15" />
                  )
                }
              </FormItem>
            </Col>
          </Row>

          <Row>
            {/* <Col sm={24} md={12}>
                <FormItem label="佣金" {...formItemLayout}>
                  {getFieldDecorator('maxCommission', {
                    // initialValue:xxx,
                    rules: [{ required: true, message:'请输入售价佣金' }],
                  })(
                    <Input placeholder="请输入售价佣金" addonAfter="元"/>
                  )}
                </FormItem>
              </Col> */}
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
                            { required: true, message: '请输入房源所在楼层!' },
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
                            { required: true, message: '请输入总楼层!' },
                            { type: 'string', pattern: /^[1-9]\d*$/, message: "房源楼层只能输入正整数" },
                          ],
                        })(<Input placeholder="总楼层" addonAfter='层' maxLength="10" />)}
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>

            <Col sm={24} md={24}>
              <Row>
                <Col span={3} style={{ textAlign: 'right' }}>
                  <span className="formLabel ant-form-item-required">建筑年代:</span>
                </Col>
                <Col span={7}>
                  <Row className='houseType' gutter={6}>
                    <Col md={12} lg={12}>
                      <FormItem>
                        {getFieldDecorator('buildingAge', {
                          initialValue: houseBaseInfo.buildingAge,
                          rules: [
                            { required: true, message: '请输入建筑年代!' },
                            { type: 'string', pattern: /^[1-9]\d*$/, message: "建筑年代只能输入正整数" },
                          ],
                        })(<Input placeholder="年" addonAfter='年' maxLength="10" />)}
                      </FormItem>
                    </Col>

                  </Row>
                </Col>
              </Row>
            </Col>



          </Row>
          {/*
              <Row>
                <Col sm={24} md={24}>
                    <FormItem label="房源户型" {...formItemLayout}>
                      {getFieldDecorator('houseType', {
                        initialValue: houseBaseInfo.houseType,
                        rules: [{ required: true, message:'请选择居室' }],
                      })(
                        <Select placeholder="请选择居室">
                          {
                            labelsFinalCode.getSelectOptionsByLabelName(labels, labelsFinalCode.labelSecondHouseFyhx)
                          }
                        </Select>
                      )}
                    </FormItem>
                </Col>
              </Row>
              */}
          <Row>
            <Col sm={24} md={24}>
              <FormItem label="户型结构" {...formItemLayoutLabel}>
                {getFieldDecorator('houseStructure', {
                  initialValue: houseBaseInfo.houseStructure,
                  rules: [{ required: true, message: '请选择户型结构' }],
                })(
                  <RadioGroup onChange={houseStructure}>
                    {
                      labelsFinalCode.getSelectRadioByLabelName(labels, labelsFinalCode.labelHxjg)
                    }
                  </RadioGroup>
                )}
              </FormItem>
            </Col>

            <Col sm={24} md={24}>
              <FormItem label="建筑类型"
                {...formItemLayoutLabel}
              >
                {getFieldDecorator('buildingType', {
                  initialValue: houseBaseInfo.buildingType,
                  rules: [{ required: true, message: '请选择建筑类型!' }],
                })(
                  <RadioGroup onChange={buildingType}>
                    {
                      labelsFinalCode.getSelectRadioByLabelName(labels, labelsFinalCode.labelJzlx)
                    }
                  </RadioGroup>
                )
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={24}>
              <FormItem label="供暖方式" {...formItemLayoutLabel}>
                {getFieldDecorator('heatingType', {
                  initialValue: houseBaseInfo.heatingType,
                  rules: [{ required: true, message: '请选择供暖方式' }],
                })(
                  <RadioGroup onChange={heatingType}>
                    {
                      labelsFinalCode.getSelectRadioByLabelName(labels, labelsFinalCode.labelGnfs)
                    }
                  </RadioGroup>
                )}
              </FormItem>
            </Col>

            <Col sm={24} md={24}>
              <FormItem label="电梯方式"
                {...formItemLayoutLabel}
              >
                {getFieldDecorator('elevator', {
                  initialValue: houseBaseInfo.elevator,
                  rules: [{ required: true, message: '请选择电梯类型!' }],
                })(
                  <RadioGroup onChange={elevator}>

                    <Radio value='有电梯'>有电梯</Radio>
                    <Radio value='无电梯'>无电梯</Radio>
                  </RadioGroup>

                )
                }
              </FormItem>
            </Col>
          </Row>

          <Row>
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

            <Col sm={24} md={24}>
              <FormItem label="房屋朝向"
                {...formItemLayoutLabel}
              >
                {
                  getFieldDecorator('orientations', {
                    initialValue: houseBaseInfo.orientations,
                    rules: [{ required: true, message: '请选择房屋朝向!' }],
                  })(
                    <RadioGroup onChange={houseOrientation}>
                      {
                        labelsFinalCode.getSelectRadioByLabelName(labels, labelsFinalCode.labelFwcx)
                      }
                    </RadioGroup>
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={24}>
              <FormItem label="是钥匙房" {...formItemLayout}>
                {getFieldDecorator('yaoshifang', {

                })(
                  <div>
                    <Col sm={1} md={1}>
                      <Checkbox onChange={onChangeCheck} checked={checkBoxFlag}>

                      </Checkbox>
                    </Col>
                    {
                      checkBoxFlag ? <Col sm={23} md={23}>
                        <FormItem
                          {...formItemLayout}
                          label="选择"
                          hasFeedback
                        >
                          {getFieldDecorator('selectKey', { initialValue: houseBaseInfo.selectKey, })(
                            <Cascader options={optionss} />
                          )}
                        </FormItem>
                      </Col> : null
                    }
                  </div>

                )}

              </FormItem>

            </Col>


          </Row>
          <Row>
            <Col sm={24} md={24}>
              <FormItem label="房源归属人" {...formItemLayout}>
                {getFieldDecorator('guishurenLabel', {
                  initialValue: houseBaseInfo.guiShuRen,
                  rules: [{ required: false, message: '房源归属人' }],
                })(
                  <div>
                    {
                      !userTypes ? <Col>
                        <FormItem
                          {...formItemLayout}
                          label="选择"
                          hasFeedback
                        >
                          {getFieldDecorator('guishuren', {
                            initialValue: houseBaseInfo.guiShuRen,
                            rules: [
                              { required: true, message: '选择归属人!' },
                            ],
                          })(
                            <Cascader options={optionss} />
                          )}
                        </FormItem>
                      </Col> : null
                    }
                  </div>
                )}


              </FormItem>

            </Col>


          </Row>

          <Row>
            <Col sm={24} md={24}>
              <FormItem label="抵押信息" {...formItemLayout}>
                {getFieldDecorator('mortgage', {
                  initialValue: houseBaseInfo.mortgage,
                  rules: [{ required: true, message: '请选择抵押信息' }],
                })(
                  <RadioGroup onChange={mortgageInformation}>
                    <Radio value='无抵押'>无抵押</Radio>
                    <Radio value='有抵押'>有抵押</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={24}>
              <FormItem label="支持贷款"
                {...formItemLayout}
              >
                {
                  getFieldDecorator('supportMortgage', {
                    initialValue: houseBaseInfo.supportMortgage,
                    rules: [{ required: true, message: '请选择贷款信息!' }],
                  })(
                    <RadioGroup onChange={supportLoan}>
                      <Radio value='支持'>支持</Radio>
                      <Radio value='不支持'>不支持</Radio>
                    </RadioGroup>
                  )
                }
              </FormItem>
            </Col>
          </Row>
        </div>
        {/*<Panel title="房源特色 （最多选择3个标签）"/>*/}
        <Panel title={<div className='ant-form-item-required'>房源特色<span className="upperLimit">（最多选择3个标签）</span></div>} />
        <div className="houseCharacteristics">
          <Row>
            <Col sm={23} md={23} offset={1}>
              <FormItem {...formItemLayoutLabel}>
                {getFieldDecorator('characteristics', {
                  initialValue: houseBaseInfo.characteristicsArray,
                  // rules: [{ required: true, message:'请选择房源特色',type:"array"},
                  rules: [
                    { required: true, message: '请至少选择一个标签!' },
                    { type: "array", min: 1, message: '请至少选择一个标签!' },
                    { type: "array", max: 3, message: "最多只能选择三项!" },
                    {
                      validator(rule, value, callback, source, options) {
                        var errors = [];
                        callback(errors);
                      }
                    }
                  ],
                })(
                  <CheckableTags
                    multiple={true}
                    tags={getlabelsByTypeName(labelsFinalCode.labelSecondHouseFyts)}
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
        {/*<Panel title="核心卖点"/>*/}
        <Panel title={<div className="ant-form-item-required">核心卖点</div>} />
        <div className="coreSelling">
          <Row className="firstRow">
            <Col sm={22} md={22} offset={1}>
              <FormItem {...formItemLayoutLabel}>
                {/*<Alert
                      message=''
                      type="warning"
                      description='不能出现任意联系方式(包含但不限于QQ,微信,网址,MSN,邮箱等);
                        请勿添加其他小区广告,请勿输入与出售房源无关内容或非法信息.'
                      showIcon
                      />*/}
                {
                  getFieldDecorator('coreSellingPoint', {
                    initialValue: houseBaseInfo.coreSellingPoint,
                    rules: [
                      { required: true, message: '请输入内容，500字以内!' },
                    ],
                  })(
                    <Input type="textarea" rows={4} maxLength={500} placeholder='请输入内容，500字以内!' />
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

function mapStateToProps({ houseResourceInfos }) {
  return { houseResourceInfos }
}

export default connect(mapStateToProps)(Form.create({})(HouseResourceInfos));
