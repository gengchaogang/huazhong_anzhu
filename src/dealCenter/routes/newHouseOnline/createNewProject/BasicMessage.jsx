import './BasicMessage.css';
import React from 'react';
import {connect} from 'dva'
import TitleBar from '../../../../commons/UI/TitleBar';
import CheckableTags from '../../../../commons/UI/CheckableTags';
import GaodeMap from '../../../../commons/components/GaodeMap'
import DxPanel from '../../../../commons/components/DxPanel';
import { routerRedux } from 'dva/router';
import PromptModal from'../../../../commons/View/PromptModal'
import moment from 'moment'
import {Row,Col,Cascader,Select,Input,InputNumber,TimePicker,DatePicker,Tag,Radio,Form,Checkbox,Button
} from 'antd';
//20170807 删除地址树型选择器 表单验证时机 onBlur 解决bug
const FormItem=Form.Item;
const Option=Select.Option;
const CheckableTag = Tag.CheckableTag;
const RadioGroup=Radio.Group;
const CheckboxGroup=Checkbox.Group;
const { MonthPicker, RangePicker } = DatePicker;

const customStyle={
  border:'1px solid #C6C6C6',
  padding:'4px 8px',
  fontSize:'14px',
  active:{
    background:'#42B38B',
    color:'#fff',
    borderColor:'transparent'
  }
};

const radioStyle={
  fontSize:14,
  color:'#333',
}

const anzhuFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6},
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};
const anzhuFormItemLayoutMini = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6},
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
};
const anzhuFormItemLayoutPlus = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6},
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16},
  },
};
const anzhuFormItemLayoutBolck = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3},
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21},
  },
};
const setInitValue=(key,formData,isEidt)=>{
  if(!!isEidt){
    const result={
      initialValue:formData[key],
    }
    return result
  }else{
    return {}
  }
}
function BasicMessage({basicMessage,type,dispatch,form,label,}){
  const {
    address,
    longitude,
    latitude,
    areaPath,
    initAreaCode,
    reEdit=false,
    projectName,
    projectId,
    formData,
    isEdit,
    labelData,
    initMarkers,
    promptObj,
    initHouseTypesTags,
    initCharacteristicTags,
    initFitmentTypeTags,
    initBuildingTypeTags,
    buildingTypeTags,
    houseTypesTags,
    characteristicTags,
    fitmentTypeTags,
    areaAndCode,
  }=basicMessage;
  // console.log('formData111111',formData);
  const handleSubmit=(e)=>{
    e.preventDefault();
    form.validateFields((errors) => {
      dispatch({
        type:"basicMessage/saveTags",
        payload:{
          initHouseTypesTags:[],
          initFitmentTypeTags:[],
          initCharacteristicTags:[],
          initBuildingTypeTags:[]
        }
      })
      if (errors) {
        return;
      }
      const data = { ...form.getFieldsValue()};
      data.longitude=longitude;
      data.latitude=latitude;
      console.log('>>>>>>>>>>>>>>>>>data',data);
      if(!!areaPath){
        data.areaPath=areaPath
      }
      if(!!isEdit){
        data.id=projectId;
        dispatch({
          type:'basicMessage/editMessage',
          payload:data
        })
        dispatch({
          type:"basicMessage/changeMarkers",
          payload:{
            initMarkers:[],
          }
        })
      }else{
        dispatch({
          type:"basicMessage/uploadMessages",
          payload:data
        })
        dispatch({
          type:"basicMessage/changeMarkers",
          payload:{
            initMarkers:[],
          }
        })
      }
    });
  }
  //父级组件传给GaodeMap子组件的点击方法
  const mapClick=(markers)=>{
    dispatch({
      type:'basicMessage/changeMarkers',
      payload:{
        longitude:markers.G.position.lng,
        latitude:markers.G.position.lat,
      }
    })
  }
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };
  const formItemLayout1 = {
    labelCol: { span: 3 },
    wrapperCol: { span: 19 },
  };
  const formItemLayoutPicker = {
    labelCol: { span: 3 },
    wrapperCol: { span: 8 },
  };
  const checkProjectName=(e)=>{
  //   if(e.target.value===projectName){
  //     alert("已存在的项目名称")
  //   }
  }

  const onOkCallBack=()=>{
    if(promptObj.todo==='closeAndToNext'){
      if(promptObj.type==='success'){
        dispatch({
          type:"basicMessage/togglePrompt",
          payload:{
            visible:false
          }
        })
        dispatch(routerRedux.push({
          pathname:'/newHouseOnline/projectManagement/createProject/uploadProjectPhoto',
          state:{
            projectId:projectId,
            isEdit:isEdit,
            reEdit,
          }
        }))
      }
    }else if(promptObj.todo==='closeModal'){
      dispatch({
        type:"basicMessage/togglePrompt",
        payload:{
          visible:false
        }
      })
    }
  }
  const onCancelCallBack=()=>{}
  const changeAddress=(e)=>{
    dispatch({
        type:"basicMessage/saveAddress",
        payload:{
          address:e.target.value
        }})
  }
  return (
    <div className="createNewHouse" id="createNewHouse">
      <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack}/>
      {isEdit===null?<div>加载中</div>:
      <Form onSubmit={handleSubmit}>
      <DxPanel title="项目基本信息">
        <div className='anzhu_form_layout_box'>
          <FormItem
            label="项目名称"
             {...anzhuFormItemLayout}
            >
            {
              form.getFieldDecorator('name',{
                  initialValue: !!formData.name?formData.name:'',
                  validateTrigger: 'onBlur',
                  rules:[{required:true,message:'请填写项目名称!'}],
              })(
                  <Input placeholder="请填写项目名称" onBlur={checkProjectName} type="text" />
              )
            }
          </FormItem>
          <FormItem
            label="项目上线时间"
            {...anzhuFormItemLayout}
            >
            {
              form.getFieldDecorator('onsellDateTime',{
                validateTrigger: 'onBlur',
                initialValue:!!formData.onsellDateTime?moment(new Date(formData.onsellDateTime)):null,
                rules:[{required:true,message:'请选择项目上线时间!'}],})(
                  <DatePicker
                    showTime
                    disabled={reEdit}
                    style={{width:"100%"}}
                    placeholder="请选择项目上线时间"
                    format="YYYY-MM-DD HH时"
                  />
              )
            }
          </FormItem>
          <FormItem label="项目带看保护期"
           {...anzhuFormItemLayoutMini}
            >
            {
              form.getFieldDecorator('protectDays',{
                initialValue: !!formData.protectDays?formData.protectDays:'',
                validateTrigger: 'onBlur',
                rules:[
                  {required:true,message:'请填写项目带看保护期!'},
                ],})(
                <Input addonAfter='天' disabled={reEdit}/>
              )
            }
          </FormItem>
          <FormItem label="项目均价"
           {...anzhuFormItemLayoutMini}
             >
            {
              form.getFieldDecorator('price',{
                initialValue: !!formData.price?formData.price:'',
                validateTrigger: 'onBlur',
                rules:[{required:false,message:'请填写均价!'}]})(
                  <Input  addonAfter='元/㎡' disabled={reEdit}/>
              )
            }
          </FormItem>
          <FormItem label="项目单价"
           {...anzhuFormItemLayoutMini}
             >
            {
              form.getFieldDecorator('unitPrice',{
                initialValue: !!formData.unitPrice?formData.unitPrice:'',
                validateTrigger: 'onBlur',
                rules:[{required:false,message:'请填写均价!'}]})(
                  <Input  addonAfter='万元/套' disabled={reEdit}/>
              )
            }
          </FormItem>
          <FormItem label="项目地址"
            {...anzhuFormItemLayout}
            >
            {
              form.getFieldDecorator('areaCode',{
                initialValue:!!initAreaCode?initAreaCode:[],
                //validateTrigger: 'onBlur',
                rules:[{required:false,message:'请选择项目地址!'}],})(
                <Cascader
                  onChange={(value,selectedOptions)=>{
                    let areaPath=[];
                    selectedOptions.map(item=>{
                      if(!!item.label){
                        areaPath.push(item.label)
                      }
                    })
                    dispatch({
                      type:"basicMessage/saveAreaPath",
                      payload:{
                        areaPath:'/'+areaPath.join('/')
                      }
                    })
                  }}                  
                  options={areaAndCode}
                  expandTrigger="hover"
                  placeholder="请选择"
                  disabled={reEdit}/>
              )
            }
          </FormItem>
          <FormItem label="项目详细地址"
            {...anzhuFormItemLayoutPlus}
            >
            {
              form.getFieldDecorator('address',{
                validateTrigger: 'onBlur',
                initialValue: !!formData.address?formData.address:'',
                rules:[{required:true,message:'请填写项目详细地址!'}],})(
                <Input type="text" disabled={reEdit} onBlur={changeAddress}/>
              )
            }
          </FormItem>
        </div>
        <div style={{height:270,marginBottom:34}}>
          <FormItem label="  "
            {...anzhuFormItemLayoutBolck}
            colon={false}
            >
            <div className="map-area">
              {
                window.AMap?
                <GaodeMap mapClick={mapClick}  isClick={!reEdit} width={700} height={270} address={address} initMarkers={!!initMarkers?initMarkers:[]}/>:
                  <p style={{margin:"100px"}}>地图加载失败</p>
                }
            </div>
          </FormItem>
        </div>
        <div className='anzhu_form_layout_box'>
          <FormItem label="项目联系人"
            {...anzhuFormItemLayout}
            >
            {
              form.getFieldDecorator('contact',{
                validateTrigger: 'onBlur',
                initialValue: !!formData.contact?formData.contact:'',
                rules:[
                  {required:true,message:'请填写项目联系人!'},
                  {max:20,message:'联系人信息超长'},
                ],})(
                <Input type="text"/>
              )
            }
          </FormItem>
          <FormItem label="项目联系电话"
            {...anzhuFormItemLayoutPlus}
            >
            {
              form.getFieldDecorator('phone',{
                validateTrigger: 'onBlur',
                initialValue: !!formData.phone?formData.phone:'',
                rules:[
                  {required:true,message:'请填写项目联系电话!'},
                  {max:30,type:'string',message: '项目联系电话超长' },
                ],})(
                <Input type="text"/>
              )
            }
          </FormItem>
        </div>
      </DxPanel>
      <DxPanel title="楼盘资料">
        <div className='anzhu_form_layout_box'>
          <FormItem label="开盘时间"
            {...anzhuFormItemLayoutPlus}
            >
            {
              form.getFieldDecorator('openingTime',{
                initialValue: !!formData.openingTime?formData.openingTime:'',
                validateTrigger: 'onBlur',
                rules:[
                  {required:true,message:'请填写项目开盘时间！'},
                  {max:30,type:'string',message: '项目开盘时间内容超长' },
                  {type:'string',pattern:/^([\u4e00-\u9fa50-9]|[0-9]|\-)*$/, message: '输入内容异常' },
                ],})(
                <Input type="text" disabled={reEdit}/>
              )
            }
          </FormItem>
          {/*<FormItem label="开盘交房时间"
            {...anzhuFormItemLayout}
            >
            {
              form.getFieldDecorator('openingTime',{
                validateTrigger: 'onBlur',
                initialValue:!!formData.openingTime?[moment(new Date(formData.openingTime)),moment(new Date(formData.deliverTime))]:null,
                rules:[{required:true,message:'请选择开盘时间'}],
              })(
                <RangePicker
                  style={{width:'100%'}}
                  placeholder={['开盘时间','交房时间']}
                  format="YYYY-MM-DD HH:mm:ss"
                />
              )
            }
          </FormItem>*/}
          <FormItem label="交房时间"
            {...anzhuFormItemLayoutPlus}
            >
            {
              form.getFieldDecorator('deliverTime',{
                initialValue: !!formData.deliverTime?formData.deliverTime:'',
                validateTrigger: 'onBlur',
                rules:[
                  {required:true,message:'请填写项目交房时间！'},
                  {max:30,type:'string',message: '项目交房时间内容超长' },
                  {type:'string',pattern:/^([\u4e00-\u9fa50-9]|[0-9]|\-)*$/, message: '输入内容异常' },
                ],})(
                <Input type="text" disabled={reEdit}/>
              )
            }
          </FormItem>
          <div style={{display:'none'}}>
            <FormItem label="物业类型"
              {...formItemLayout}
              >
              {
                form.getFieldDecorator("propertyType",{
                  initialValue:!!houseTypesTags&&houseTypesTags.length!==0?['住宅']:[],
                  validateTrigger: 'onBlur',
                  rules:[{required:true,message:'请选择物业类型!'}]})(
                    <CheckableTags
                      disabled
                      tags={!!houseTypesTags?houseTypesTags:[]}
                      multiple={true}
                      customStyle={customStyle}
                    />
                )
              }
            </FormItem>
          </div>
          <FormItem label="楼盘开发商"
            {...anzhuFormItemLayout}
            >
              {
                form.getFieldDecorator('developers',{
                  initialValue: !!formData.developers?formData.developers:'',
                  validateTrigger: 'onBlur',
                  rules:[{required:false,message:'请填写楼盘开发商!'}]})(
                  <Input disabled={reEdit}/>
                )
              }
          </FormItem>
          <FormItem label="售楼地址"
            {...anzhuFormItemLayoutPlus}
            >
            {
              form.getFieldDecorator('saleAddress',{
                initialValue: !!formData.saleAddress?formData.saleAddress:'',
                validateTrigger: 'onBlur',
                rules:[
                  {required:false,message:'请填写售楼地址!'},
                  {max:30,type:'string',message: '项目售楼地址内容超长'},
                ]})(
                <Input disabled={reEdit}/>
              )
            }
          </FormItem>
          <FormItem label="建筑面积"
            {...anzhuFormItemLayoutMini}
            >
            {
              form.getFieldDecorator("floorArea",{
                initialValue: !!formData.floorArea?formData.floorArea:'',
                validateTrigger: 'onBlur',
                rules:[
                  {required:false,message:'请填写建筑面积!'},
                  {type:'string',pattern:/^\d+(\.\d{1,2})?$/, message: '输入内容非法'},
                ]})(
                <Input addonAfter='㎡'disabled={reEdit}/>
              )
            }
          </FormItem>
          <FormItem label="占地面积"
            {...anzhuFormItemLayoutMini}
            >
            {
              form.getFieldDecorator("landArea",{
                initialValue: !!formData.landArea?formData.landArea:'',
                validateTrigger: 'onBlur',
                rules:[
                  {required:false,message:'请填写占地面积!'},
                  {type:'string',pattern:/^\d+(\.\d{1,2})?$/, message: '输入内容非法'},
                ]})(
                <Input addonAfter='㎡'disabled={reEdit}/>
              )
            }
          </FormItem>
          </div>
          <div>
            <FormItem label="特色"
              {...anzhuFormItemLayoutBolck}
              >
              {
                form.getFieldDecorator("characteristic",{
                  initialValue:!!initCharacteristicTags?initCharacteristicTags:[],
                  validateTrigger: 'onBlur',
                  rules:[{required:true,message:"请选择特色!"}]})(
                  <CheckableTags
                    tags={!!characteristicTags?characteristicTags:[]}
                    multiple={true}
                    customStyle={customStyle}
                    disabled={reEdit}
                    max={3}
                  />
                )
              }
            </FormItem>
            <FormItem label="建筑类型"
            {...anzhuFormItemLayoutBolck}
              >
              {
                form.getFieldDecorator("buildingType",{
                  initialValue:!!initBuildingTypeTags?initBuildingTypeTags:[],
                  validateTrigger: 'onBlur',
                  rules:[{required:true,message:'请选择建筑类型!'}]})(
                  <CheckableTags
                    tags={!!buildingTypeTags?buildingTypeTags:[]}
                    multiple={true}
                    customStyle={customStyle}
                    disabled={reEdit}
                    max={3}
                  />
                )
              }
            </FormItem>
            <FormItem label="装修标准"
            {...anzhuFormItemLayoutBolck}
              >
              {
                form.getFieldDecorator("decoration",{
                  initialValue:!!initFitmentTypeTags?initFitmentTypeTags:[],
                  validateTrigger: 'onBlur',
                  rules:[{required:true,message:'请选择装修标准!'}]})(
                  <CheckableTags
                    tags={!!fitmentTypeTags?fitmentTypeTags:[]}
                    customStyle={customStyle}
                    disabled={reEdit}
                    max={1}
                  />
                )
              }
            </FormItem>
          </div>
          <div className='anzhu_form_layout_box'>
          <FormItem label="容积率"
            {...anzhuFormItemLayoutMini}
            >
            {
              form.getFieldDecorator('capacityRate',{
                initialValue: !!formData.capacityRate?formData.capacityRate:'',
                validateTrigger: 'onBlur',
                rules:[
                  {required:false,message:'请填写容积率!'},
                  {type:'string',pattern:/^\d*\.\d{0,3}$/, message: '输入内容非法'},
                ]})(
                <Input disabled={reEdit}/>
              )
            }
          </FormItem>
          <FormItem label="绿化率"
            {...anzhuFormItemLayoutMini}
            >
            {
              form.getFieldDecorator('greeningRate',{
                initialValue: !!formData.greeningRate?formData.greeningRate:'',
                validateTrigger: 'onBlur',
                rules:[
                  {required:false,message:'请填写绿化率!'},
                  {type:'string',pattern:/^((\d|[123456789]\d)(\.\d+)?|100)$/, message: '输入内容非法'},
                ]})(
                <Input addonAfter='%' disabled={reEdit}/>
              )
            }
          </FormItem>
          <FormItem label="规划户数"
            {...anzhuFormItemLayoutMini}
             >
            {
              form.getFieldDecorator('houses',{
                initialValue: !!formData.houses?formData.houses:'',
                validateTrigger: 'onBlur',
                rules:[
                  {required:false,message:'请填写规划户数!'},
                  {type:'string',pattern:/^\+?[1-9][0-9]*$/, message: '输入内容非法'},
                ]})(
                  <Input addonAfter='户' disabled={reEdit}/>
              )
            }
          </FormItem>
          <FormItem label="规划楼栋数"
            {...anzhuFormItemLayoutMini}
             >
            {
              form.getFieldDecorator('buildingNumber',{
                initialValue: !!formData.buildingNumber?formData.buildingNumber:'',
                validateTrigger: 'onBlur',
                rules:[
                  {required:false,message:'请填写规划楼栋数!'},
                  {type:'string',pattern:/^\+?[1-9][0-9]*$/, message: '输入内容非法'},
                ]})(
                  <Input addonAfter='栋' disabled={reEdit}/>
              )
            }
          </FormItem>
          <FormItem label="规划车位"
            {...anzhuFormItemLayout}
             >
            {
              form.getFieldDecorator('parkingSize',{
                initialValue: !!formData.parkingSize?formData.parkingSize:'',
                validateTrigger: 'onBlur',
                rules:[
                  {required:false,message:'请填写规划车位!'},
                  {type:'string',max:10, message: '输入内容超长'},
                ]})(
                  <Input type='text' disabled={reEdit}/>
              )
            }
          </FormItem>
          <FormItem label="物业公司"
            {...anzhuFormItemLayoutPlus}
           >
           {
             form.getFieldDecorator('estateCompany',{
               initialValue: !!formData.estateCompany?formData.estateCompany:'',
               validateTrigger: 'onBlur',
               rules:[{required:false,message:'请填写物业公司!'}]})(
               <Input disabled={reEdit} />
             )
           }
         </FormItem>
         <FormItem label="物业费"
           {...anzhuFormItemLayoutMini}
         >
           {
             form.getFieldDecorator('propertyCosts',{
               initialValue: !!formData.propertyCosts?`${formData.propertyCosts}`:'',
               validateTrigger: 'onBlur',
               rules:[
                 {required:false,message:'请填写物业费!'},
                 {type:'string',pattern:/^\d+(\.\d{1,2})?$/, message: '输入内容非法'},
               ]})(
               <Input addonAfter='元/㎡' disabled={reEdit}/>
             )
           }
         </FormItem>
         <FormItem label="供暖方式"
           {...anzhuFormItemLayout}
           >
           {
             form.getFieldDecorator('heatingMode',{
               initialValue: !!formData.heatingMode?formData.heatingMode:'',
               validateTrigger: 'onBlur',
               rules:[{required:false,message:'请填写供暖方式'}]})(
               <Input disabled={reEdit}/>
             )
           }
         </FormItem>
         <FormItem label="产权年限"
           {...anzhuFormItemLayoutMini}
           >
           {
             form.getFieldDecorator('ownLength',{
               initialValue: !!formData.ownLength?formData.ownLength:'',
               validateTrigger: 'onBlur',
               rules:[
                 {required:false,message:'请填写产权年限!'},
                 {type:'string',pattern:/^\+?[1-9][0-9]*$/, message: '输入内容非法'},
               ]})(
                 <Input addonAfter='年' disabled={reEdit}/>
             )
           }
         </FormItem>
         <FormItem label="水电燃气"
           {...anzhuFormItemLayout}
           >
           {
             form.getFieldDecorator('waterElectricityGas',{
               initialValue: !!formData.waterElectricityGas?formData.waterElectricityGas:null,
               validateTrigger: 'onBlur',
               rules:[{required:false,message:'请选择水电燃气!'}]})(
               <RadioGroup size="large" disabled={reEdit}>
                 <Radio value='true' style={radioStyle}>有</Radio>
                 <Radio value='false' style={radioStyle}>无</Radio>
               </RadioGroup>
             )
           }
         </FormItem>
        </div>
      </DxPanel>
      <DxPanel title="项目卖点" className='createNewProject_basicMsg_introduced'>
          <FormItem>
          {
            form.getFieldDecorator('introduced',{
              initialValue: !!formData.introduced?formData.introduced:'',
              validateTrigger: 'onBlur',
              rules:[
                {required:false,message:'请填写项目卖点!'},
                {type:'string',max:
                  2000, message: '项目卖点内容超长！'},
              ]})(
              <Input
                 type="textarea"
                 maxLength={2000}
                 autosize={{minRows:8}}
                 placeholder="请输入项目卖点"
               />
            )
          }
          <p style={{textAlign:'right'}}>
            {form.getFieldValue('introduced')?form.getFieldValue('introduced').length:'0'}/2000
          </p>
        </FormItem>
      </DxPanel>
      <div className="anzhu_bottom_area">
        <Button type="primary"  htmlType="submit">下一步添加项目相册</Button>
      </div>
    </Form>}
    </div>
  );
}


function mapStateToProps({basicMessage}){
  return {
    basicMessage,
  }
}

export default connect(mapStateToProps)(Form.create({
  onFieldsChange:(props,fields)=>{},
})(BasicMessage));
