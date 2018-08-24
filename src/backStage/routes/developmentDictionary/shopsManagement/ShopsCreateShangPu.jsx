import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import moment from 'moment';
import { Button ,Checkbox,Table,Modal,Form,Input,Select,Row,Col,Cascader,DatePicker} from 'antd';
import DxPanel from '../../../../commons/components/DxPanel'
import './ShopsCreateShangPu.css'
import GaodeMap from '../../../../commons/components/GaodeMap'
import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow'
import SearchKeyBox from '../../../components/searchKeyBox/SearchKeyBox'
import DxUpLoadPic from '../../../../commons/View/DxUpLoadPic'
const dateFormat = 'YYYY-MM-DD';
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
const Option = Select.Option;
const FormItem = Form.Item;
const addSeletDanWei = {
  labelCol: { span: 6 },
  wrapperCol: { span: 17 },
};
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
function ShopsCreateShangPu({dispatch,shopsCreateShangPu,form}) {
  const {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }=form;
  const {
    showPicList,
    loading,
    defaultareaCode,
    markers,
    initMarker,
    jianzhuType,
    shangpuType,
    shopLevel,
    initMarkers,
    arrOptions,//获取所有城市级联的数组
		allProvinces,//城市级联原数组(未做处理的后端返回的数组)
    areaCode,//城市当前编码
    areaName,//当前城市
    areaZone,
    address,//地址
		latitude,//纬度
		longitude,//经度
		name,//商铺名字
		propertyCosts,//物业费
		typePrefix,//商铺类别前缀
		typeSuffix,//商铺类别后缀
    numberOfPlies,//总层数
    developers,//开发商
    constructionTime,//建筑年代
    buildingType,//建筑类型
    estateCompany,//建物业公司
    timeOfCompletion,//竣工时间
    floorArea,//占地面积
    areaOfStructure,//建筑面积
    bayArea,//开间面积
    passengerElevatorNumber,//客梯数量
    transferNumber,//货梯数量
    airCondition,//空调数量
    decorateState,//装修状况
    parkingSpaces,//停车位
    id,
    mapOfChangeAddress,
  }=shopsCreateShangPu;
  const shopsUplod={
    url:'/miss-anzhu-aliyun-file/putfile',
    maxNum:20,//最大上传数
    maxSize:2,//文件大小限值
    showPicList:showPicList,//state管理图片list
    doCover:true,
    changeList:(data)=>{
      dispatch({
        type:'shopsCreateShangPu/initialSuccess',
        payload:{showPicList:data}
      })
    },//更新list回调
  }
  let myDate = new Date();
  let months=parseInt(myDate.getMonth())+1;
  const handleSubmit=()=> {
		form.validateFields((err, values) => {
      let timeshijian='';
      if(values.timeOfCompletion){
        timeshijian=values.timeOfCompletion.format(dateFormat)
      }
      const areaCode=values.areaCode[values.areaCode.length-1];
      const areaName=_getNamePathsByCode(allProvinces,areaCode);
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
        if(!!id){
          dispatch({
            type:'shopsCreateShangPu/editShopsShangPu',
            payload:{
              id:id,
              keys:showPicLists,
              address:values.address,
              airCondition:values.airCondition,
              areaCode:areaCode,
              areaName:areaName,
              areaOfStructure:values.areaOfStructure,
              bayArea:values.bayArea,
              areaZone:values.areaZone,
              buildingType:values.buildingType,
              constructionTime:values.constructionTime,
              decorateState:values.decorateState,
              developers:values.developers,
              estateCompany:values.estateCompany,
              floorArea:values.floorArea,
              latitude:latitude,
              longitude:longitude,
              name:values.name,
              numberOfPlies:values.numberOfPlies,
              parkingSpaces:values.parkingSpaces,
              passengerElevatorNumber:values.passengerElevatorNumber,
              propertyCosts:values.propertyCosts,
              timeOfCompletion:timeshijian,
              transferNumber:values.transferNumber,
              typePrefix:values.typePrefix,
              typeSuffix:values.typeSuffix,
            }
          })
        }else{
          dispatch({
            type:'shopsCreateShangPu/creatShopsShangPu',
            payload:{
              keys:showPicLists,
              address:values.address,
              airCondition:values.airCondition,
              areaCode:areaCode,
              areaName:areaName,
              areaOfStructure:values.areaOfStructure,
              bayArea:values.bayArea,
              areaZone:values.areaZone,
              buildingType:values.buildingType,
              constructionTime:values.constructionTime,
              decorateState:values.decorateState,
              developers:values.developers,
              estateCompany:values.estateCompany,
              floorArea:values.floorArea,
              latitude:latitude,
              longitude:longitude,
              name:values.name,
              numberOfPlies:values.numberOfPlies,
              parkingSpaces:values.parkingSpaces,
              passengerElevatorNumber:values.passengerElevatorNumber,
              propertyCosts:values.propertyCosts,
              timeOfCompletion:timeshijian,
              transferNumber:values.transferNumber,
              typePrefix:values.typePrefix,
              typeSuffix:values.typeSuffix,
            }
          })
          resetFields();
        }
      }
		});
	}
  const cancelClick=()=>{
    dispatch(routerRedux.goBack());
    dispatch({
      type:'shopsCreateShangPu/clearState',//清除state中所保存的当条信息

    })
  }
  const positionClick=()=>{

  }
  const mapClick=(markers)=>{
    dispatch({
      type:'shopsCreateShangPu/initialSuccess',
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
      type:'shopsCreateShangPu/initialSuccess',
      payload:{
        mapOfChangeAddress:value.address,
      }
    })
  }
  return(
    <div className='louPan'>
      <DxLoadingShadow visible={loading}/>
      <Form>
        <DxPanel title={!!id?'修改商铺':'创建商铺'}>
          <Row>
            <Col sm={24} md={12}>
              <FormItem
                label='商铺名称'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('name', {
                  initialValue:name,
                  rules: [
                    { required: true, message: '请输入商铺名称，最多20个字' },
                    { max:20, message: '请输入商铺名称，最多20个字' },
                  ],
                })(
                  <Input type='text'  placeholder='请输入商铺名称，最多20个字'/>
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <FormItem
                label='所属地区'
                {...formItemLayout}
              >
                {getFieldDecorator('areaCode', {
                  initialValue:defaultareaCode,
                  rules: [
                    { required: true, message: '必选' },
                  ],
                })(
                  <Cascader placeholder='--' options={arrOptions} changeOnSelect={true}/>
                )}
              </FormItem>
              <FormItem
                label='详细地址'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('address', {
                  initialValue:address,
                  rules: [
                    { required: true, message: '请输入详细地址' },
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
                label='片区'
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
              <Row>
                <Col sm={14} md={14}>
                    <FormItem
                      label='商铺类型'
                      hasFeedback
                      {...addSeletDanWei}
                    >
                      {getFieldDecorator('typePrefix', {
                        initialValue:typePrefix,
                        rules: [
                          { required: true, message: '必选' },
                        ],
                        })(
                        <Select>{/*后端给数据*/}
                          {!!shangpuType && shangpuType.map((item,index)=>(
                            <Option key={`item_${index}`} value={item}>{item}</Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                </Col>
                <Col sm={10} md={10}>
                  <FormItem
                    hasFeedback
                    {...addSeletDanWei}
                  >
                  {getFieldDecorator('typeSuffix', {
                    initialValue:typeSuffix,
                    rules: [
                      { required: true, message: '必选' },
                    ],
                    })(
                      <Select>{/*后端给数据*/}
                        {!!shopLevel && shopLevel.map((item,index)=>(
                          <Option key={`item_${index}`} value={item}>{item}</Option>
                        ))}
                      </Select>
                  )}
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={12}>
              <FormItem
                label='总层数'
                hasFeedback
                {...formItemLayout}
              >
              {getFieldDecorator('numberOfPlies', {
                initialValue:numberOfPlies,
                rules: [
                  { type:'string',pattern:/^-?\d+$/, message: '输入内容非法' },
                ],
                })(
                <Input type='text' addonAfter='层'/>
              )}
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <FormItem
                label='开发商'
                hasFeedback
                {...formItemLayout}
              >
              {getFieldDecorator('developers', {
                initialValue:developers,
                rules: [
                  { max:30, message: '最多30个字符' },
                ],
                })(
                <Input type='text' placeholder='请输入开发商名称，最多30个字'/>
              )}
              </FormItem>
            </Col>
          </Row>
          <Row>
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
                <Input type='text' placeholder='请输入整数'/>
              )}
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <FormItem
                label='建筑类型'
                hasFeedback
                {...formItemLayout}
              >
              {getFieldDecorator('buildingType', {
                initialValue:buildingType,
                })(
                <Select>
                  {!!jianzhuType && jianzhuType.map((item,index)=>(
                    <Option key={`item_${index}`} value={item}>{item}</Option>
                  ))}
                </Select>
              )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={12}>
              <FormItem
                label='物业公司'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('estateCompany', {
                  initialValue:estateCompany,
                  rules: [
                    { max:30, message: '最多30个字符' },
                  ],
                  })(
                  <Input type='text' placeholder='请输入物业公司，最多30个字'/>
                )}
              </FormItem>
            </Col>
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
                    { required: true, message: '请输入数字，支持2位小数' },
                    { type:'string',pattern:/^\d+(?:.\d{1,2})?$/, message: '输入内容非法' },
                  ],
                  })(
                  <Input type='text' placeholder='请输入数字，支持2位小数'
                    addonAfter='元/㎡/月'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={12}>
              <FormItem
                label='竣工时间'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('timeOfCompletion', {
                  initialValue:moment(timeOfCompletion==''?
                  `${myDate.getFullYear()+'-'+months+'-'+myDate.getDate()}`
                  :timeOfCompletion, dateFormat),
                  })(
                  <DatePicker format={dateFormat}/>
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <FormItem
                label='占地面积'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('floorArea', {
                  initialValue:floorArea,
                  validateTrigger: 'onBlur',
                  rules: [
                    { type:'string',pattern:/^\d+(?:.\d{1,2})?$/, message: '请输入数字，支持2位小数' },
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
                label='建筑面积'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('areaOfStructure', {
                  initialValue:areaOfStructure,
                  validateTrigger: 'onBlur',
                  rules: [
                    { type:'string',pattern:/^\d+(?:.\d{1,2})?$/, message: '请输入数字，支持2位小数' },
                  ],
                  })(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <FormItem
                label='开间面积'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('bayArea', {
                  initialValue:bayArea,
                  validateTrigger: 'onBlur',
                  rules: [
                    { type:'string',pattern:/^\d+(?:.\d{1,2})?$/, message: '请输入数字，支持2位小数' },
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
                label='客梯数量'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('passengerElevatorNumber', {
                  initialValue:passengerElevatorNumber,
                  validateTrigger: 'onBlur',
                  rules: [
                    { type:'string',pattern:/^-?\d+$/, message: '请输入整数' },
                  ],
                  })(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <FormItem
                label='货梯数量'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('transferNumber', {
                  initialValue:transferNumber,
                  validateTrigger: 'onBlur',
                  rules: [
                    { type:'string',pattern:/^-?\d+$/, message: '请输入整数' },
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
                label='空调'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('airCondition', {
                  initialValue:airCondition,
                  })(
                  <Input type='text' />
                )}
              </FormItem>
            </Col>
            <Col sm={24} md={12}>
              <FormItem
                label='装修状况'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('decorateState', {
                  initialValue:decorateState,
                  })(
                  <Input type='text'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col sm={24} md={12}>
              <FormItem
                label='停车位'
                hasFeedback
                {...formItemLayout}
              >
                {getFieldDecorator('parkingSpaces', {
                  initialValue:parkingSpaces,
                    rules: [
                      { type:'string',pattern:/^-?\d+$/, message: '仅限整数' },
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
                label='商铺位置'
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
        <div className='newAccountButton'>
  				<Button type='primary' onClick={handleSubmit}>完成</Button>
  				<Button type='ghost' onClick={cancelClick}>返回</Button>
  			</div>
      </Form>
    </div>
  );
}

function mapStateToProps({shopsCreateShangPu}) {
  return {shopsCreateShangPu}
}

export default connect(mapStateToProps)(Form.create()(ShopsCreateShangPu));
