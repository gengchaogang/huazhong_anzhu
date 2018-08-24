import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input,Row,Col,Radio,Select,Button,TreeSelect,Cascader,Checkbox } from 'antd';
import SearchInput from '../../../../commons/View/SearchInput'
import DxPanel from '../../../../commons/components/DxPanel'
import GaodeMap from '../../../../commons/components/GaodeMap'
import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow'
import DxUpLoadPic from '../../../../commons/View/DxUpLoadPic'
import './CreateCell.css'
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const fallCityName=(arr)=>{
  const result=[];
  arr.map(item=>{
    result.push(item.label)
  })
  const results=result.join('/');
  return results
}
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

function CreateCell({dispatch,form,createCell }) {
  const {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }=form;
  const {
    loading,
    showPicList,
    arrOptions,//后端未处理的级联数组
    areaAndCode,//地区(前端)
    areaCode,//	区域编号
    areaName,//区域名称
    address,//小区详细地址
    buildingType,//建筑类型
    constructionTime,//建筑年代
    developers,//开发商
    estateCompany,//物业公司
    greeningRate,//绿化率
    heatingMode,//供暖方式
    latitude,//小区位置(纬度)
    longitude,//小区位置(经度)
    name,//小区名称
    numberOfBuilding,//楼栋数
    ownType,//产权类型
    parkingFees,//停车费
    parkingSpaces,//停车位
    propertyCosts,//物业费
    rateOfCapacity,//容积率
    ratioOfParkingSpaces,//车位配比
    totalHouseholds,//总户数
    totalOfBuilding,//楼栋总数
    position,//定位(前端)
    id,//小区id,
    buildingTypes,
    heatingModes,
    markers,
    initMarkers,
    defaultAreaName,
    areaZone,
    mapOfChangeAddress,
  }=createCell;
  const positionClick=()=>{

  }
  const shopsUplod={
    url:'/miss-anzhu-aliyun-file/putfile',
    maxNum:20,//最大上传数
    maxSize:2,//文件大小限值
    showPicList:showPicList,//state管理图片list
    doCover:true,
    changeList:(data)=>{
      dispatch({
        type:'createCell/inint',
        payload:{showPicList:data}
      })
    },//更新list回调
  }
  const handleSubmit=()=> {
		form.validateFields((err, values) => {
			const areaCode=values.areaCode[values.areaCode.length-1];
      const areaName=_getNamePathsByCode(arrOptions,values.areaCode[values.areaCode.length-1]);
      const showPicLists=[];
      if(!showPicList.length==0){
        let bool=showPicList.every((item,index)=>item.isCover===false);
        if(bool){
           showPicList[0].isCover=true
        }
        showPicList.map(item=>(
          showPicLists.push({
            url:item.id,
            comment:item.isCover,
          })
        ))
      }
      if (err) {
				return;
			}else{
        if(id){
          // console.log(values.buildingType,'values.buildingType');
          dispatch({
            type:'createCell/editXiaoQu',
            payload:{
              name:values.name,
              keys:showPicLists,
              areaCode:areaCode,
              areaName:areaName,
              address:values.address,
              areaZone:values.areaZone,
              developers:values.developers,
              constructionTime:values.constructionTime,
              buildingType:values.buildingType,
              numberOfBuilding:values.numberOfBuilding,
              totalHouseholds:values.totalHouseholds,
              greeningRate:values.greeningRate,
              rateOfCapacity:values.rateOfCapacity,
              ratioOfParkingSpaces:values.ratioOfParkingSpaces,
              heatingMode:values.heatingMode,
              estateCompany:values.estateCompany,
              parkingFees:values.parkingFees,
              ownType:values.ownType,
              propertyCosts:values.propertyCosts,
              totalOfBuilding:values.totalOfBuilding,
              parkingSpaces:values.parkingSpaces,
              latitude:latitude,
              longitude:longitude,
              id:id,
            }
          })
        }else{
          dispatch({
            type:'createCell/createXiaoQu',
            payload:{
              name:values.name,
              areaCode:areaCode,
              keys:showPicLists,
              areaName:areaName,
              address:values.address,
              areaZone:values.areaZone,
              developers:values.developers,
              constructionTime:values.constructionTime,
              buildingType:values.buildingType,
              numberOfBuilding:values.numberOfBuilding,
              totalHouseholds:values.totalHouseholds,
              greeningRate:values.greeningRate,
              rateOfCapacity:values.rateOfCapacity,
              ratioOfParkingSpaces:values.ratioOfParkingSpaces,
              heatingMode:values.heatingMode,
              estateCompany:values.estateCompany,
              parkingFees:values.parkingFees,
              ownType:values.ownType,
              propertyCosts:values.propertyCosts,
              totalOfBuilding:values.totalOfBuilding,
              parkingSpaces:values.parkingSpaces,
              latitude:latitude,
              longitude:longitude,
            }
          })
        }
      }
		});
	}
  const goBack=()=>{
    dispatch(routerRedux.goBack());
    dispatch({
      type:'createCell/cnaCelClick'
    })
  }
  const mapClick=(markers)=>{
    // console.log(markers,'markers');
    dispatch({
      type:'createCell/inintMap',
      payload:{
        latitude:markers.G.position.lat,
        longitude:markers.G.position.lng,
      }
    })
  }
  //详细地址改变时的地图大概位置
  const onBlur=(e,value)=>{
    // console.log(value,'e');
    dispatch({
      type:'createCell/inint',
      payload:{
        mapOfChangeAddress:value.address,
      }
    })
  }
  return (
    <div className='louPan'>
      <DxLoadingShadow visible={loading}/>
      <Form>
        <DxPanel title={!!id?'编辑小区':'创建小区'}>
          <Row>
  					<Col sm={24} md={12}>
              <FormItem
                label='小区名称'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('name', {
                  initialValue:name,
                  rules: [
                    { required: true, message: '必填' },
                    { max:20, message: '请输入开发商名称，最多20个字' },
                  ],
                })(
                  <Input type='text'  placeholder='请输入小区名字'/>
                )}
              </FormItem>
            </Col>
  					<Col sm={24} md={12}>
              <FormItem
                label='小区地址'
                {...formItemLayout}
              >
                {getFieldDecorator('areaCode', {
                  initialValue:!!defaultAreaName?defaultAreaName:[],
                  rules: [
                    { required: true, message: '必选' },
                  ],
                })(
                  <Cascader placeholder='--' options={areaAndCode} changeOnSelect={true}/>
                )}
              </FormItem>
            </Col>
  				</Row>
          <Row>
            <Col sm={24} md={12}>
              <FormItem
                label='片区'
                hasFeedback
                {...formItemLayout}
              >
              {getFieldDecorator('areaZone', {
                initialValue:areaZone,
              })(
                <Input type='text' placeholder='请输入片区'/>
              )}
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <FormItem
                label='详细地址'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('address', {
                  initialValue:address,
                  rules: [
                    { required: true, message: '必填' },
                  ],
                })(
                  <Input onBlur={(e)=>{onBlur(e,getFieldsValue(['address']))}} type='text' placeholder='请输入详细地址'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
  					<Col sm={24} md={12}>
              <FormItem
                label='开发商'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('developers', {
                  initialValue:developers,
                  rules: [
                    { max:30, message: '请输入开发商名称，最多30个字' },
                  ],
                })(
                  <Input type='text' placeholder='请输入开发商名称，最多30个字'/>
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <FormItem
                label='建筑年代'
                hasFeedback
                {...formItemLayout}
              >
              {getFieldDecorator('constructionTime', {
                initialValue:constructionTime,
                rules: [
									{ type:'string',pattern:/^-?\d+$/, message: '输入内容非法' },
                ],
              })(
                <Input type='text' placeholder='请输入整数' addonAfter='年'/>
              )}
              </FormItem>
            </Col>
  				</Row>
          <Row>
            <Col sm={24} md={12}>
              <FormItem
                label='建筑类型'
                {...formItemLayout}
              >
                {getFieldDecorator('buildingType', {
                  initialValue:buildingType,
                })(
                  <CheckboxGroup options={buildingTypes}/>
                )}
              </FormItem>
            </Col>
            {/*<Col sm={24} md={12}>
              <FormItem
                label='楼栋数'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('numberOfBuilding', {
                  initialValue:numberOfBuilding,
                  rules: [
  									{ type:'string',pattern:/^-?\d+$/, message: '输入内容非法' },
                  ],
                })(
                  <Input type='text' placeholder='请输入整数'/>
                )}
              </FormItem>
            </Col>*/}
          </Row>
          <Row>
            <Col sm={24} md={12}>
              <FormItem
                label='总户数'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('totalHouseholds', {
                  initialValue:totalHouseholds,
                  rules: [
  									{ type:'string',pattern:/^-?\d+$/, message: '输入内容非法' },
                  ],
                })(
                  <Input type='text' placeholder='请输入整数' addonAfter='户'/>
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <FormItem
                label='绿化率'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('greeningRate', {
                  initialValue:greeningRate,
                  validateTrigger: 'onBlur',
                  rules: [
  									{ type:'string',pattern:/^\d+(?:.\d{1,2})?$/, message: '输入内容非法' },
                  ],
                })(
                  <Input type='text' placeholder='请输入数字，支持2位小数'
                    addonAfter='%'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={12}>
              <FormItem
                label='容积率'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('rateOfCapacity', {
                  initialValue:rateOfCapacity,
                  validateTrigger: 'onBlur',
                  rules: [
  									{ type:'string',pattern:/^\d+(?:.\d{1,2})?$/, message: '输入内容非法' },
                  ],
                })(
                  <Input type='text' placeholder='请输入数字，支持2位小数'/>
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <FormItem
                label='车位配比'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('ratioOfParkingSpaces', {
                  initialValue:ratioOfParkingSpaces,
                  rules: [
  									{ type:'string', message: '输入内容非法' },
                  ],
                })(
                  <Input type='text' placeholder='请输入车位配比,如1:3'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={12}>
              <FormItem
                label='供暖方式'
                {...formItemLayout}
              >
                {getFieldDecorator('heatingMode', {
                  initialValue:heatingMode,
                })(
                  <RadioGroup>
                    {!!heatingModes &&
                      heatingModes.map((item,index)=>(
                        <Radio value={item} key={`item_${index}`}>{item}</Radio>
                      ))
                    }
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <FormItem
                label='物业公司'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('estateCompany', {
                  initialValue:estateCompany,
                  rules: [
                    {max:30, message: '请输入开发商名称，最多30个字'}
                  ],
                })(
                  <Input type='text' placeholder='请输入物业公司，最多30个字'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={12}>
              <FormItem
                label='物业费'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('propertyCosts', {
                  initialValue:propertyCosts,
                  validateTrigger: 'onBlur',
                  rules: [
                    { type:'string',pattern:/^\d+(?:.\d{1,2})?$/, message: '输入内容非法' },
                  ],
                })(
                  <Input type='text' placeholder='请输入数字，支持2位小数'
                    addonAfter='元/㎡/月'/>
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <FormItem
                label='产权类型'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('ownType', {
                  initialValue:ownType,
                  rules: [
                    { type:'string',pattern:/^[0-9]*$/, message: '输入内容非法' },
                  ],
                })(
                  <Input type='text' placeholder='请输入数字'  addonAfter='年'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={12}>
              <FormItem
                label='楼栋总数'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('totalOfBuilding', {
                  initialValue:totalOfBuilding,
                  rules: [
                    { type:'string',pattern:/^[0-9]*$/, message: '输入内容非法' },
                  ],
                })(
                  <Input type='text' placeholder='请输入数字'
                    addonAfter='栋'/>
                )}
              </FormItem>

            </Col>
            <Col sm={24} md={12}>
              <FormItem
                label='停车位'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('parkingSpaces', {
                  initialValue:parkingSpaces,
                  rules: [
                    { type:'string',pattern:/^[0-9]*$/, message: '输入内容非法' },
                  ],
                })(
                  <Input type='text' placeholder='请输入数字'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={12}>
              <FormItem
                label='停车费'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('parkingFees', {
                  initialValue:parkingFees,
                  rules: [
                    { type:'string',pattern:/^[0-9]*$/, message: '输入内容非法' },
                  ],
                })(
                  <Input type='text' placeholder='例如：地上车位，150元/月/位'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={12}>
              {/*<Button onClick={positionClick} className='positionClick' type='primary' >
                定位
              </Button>*/}
              <FormItem
                label='小区位置'
                {...formItemLayout}
              >
                {getFieldDecorator('markers', {
                  initialValue:markers,
                })(
                  <GaodeMap mapClick={mapClick} width={600} height={500} initMarkers={!!initMarkers&&initMarkers.length===0?initMarkers:[{position:['106.2456','29.213'],content:"sasa"}]}
                  address={!!mapOfChangeAddress?mapOfChangeAddress:address}
                  isClick={true}/>
                )}
                  <div>坐标展示：{!!latitude?latitude+','+longitude:'请点击上图'}</div>
              </FormItem>
            </Col>
          </Row>
          <div className='uploadParent'>
            <DxUpLoadPic {...shopsUplod}/>
          </div>
        </DxPanel>
        <div>
          <Button type='primary' onClick={handleSubmit}>保存</Button>
          <Button onClick={goBack}>返回</Button>
        </div>
      </Form>
    </div>
  );
}

function mapStateToProps({createCell}) {
  return {createCell }
}

export default connect(mapStateToProps)(Form.create()(CreateCell));
