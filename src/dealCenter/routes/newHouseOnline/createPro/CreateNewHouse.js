import './CreateNewHouse.css';
import React from 'react';
import {connect} from 'dva'
import TitleBar from '../../../../commons/UI/TitleBar';
import CheckableTags from '../../../../commons/UI/CheckableTags';
import AreaAndCode from '../../../../commons/utils/AreaAndCode';
import GaodeMap from '../../../../commons/components/GaodeMap'
import DxPanel from '../../../../commons/components/DxPanel';
import moment from 'moment'
import {
  Row,
  Col,
  Cascader,
  Select,
  Input,
  InputNumber,
  TimePicker,
  DatePicker,
  Tag,
  Radio,
  Form,
  Checkbox,
  Button
} from 'antd';

const FormItem=Form.Item;
const Option=Select.Option;
const CheckableTag = Tag.CheckableTag;
const RadioGruop=Radio.Group;
const CheckboxGroup=Checkbox.Group;

const customStyle={
  border:'1px solid #C6C6C6',
  padding:'4px 8px',
  fontSize:'16px',
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

function CreateNewHouse({createNewHouse,type,dispatch,form,onSubmit}){
  const {markers}=createNewHouse;
  const {openingTime}=createNewHouse;
  const {deliverTime}=createNewHouse;
  const {timeToOnline}=createNewHouse;
  const {current}=createNewHouse;
  const coordinates=markers.join(',')
  const addOrModify=()=>{
    // console.log("当前current is",current)
    dispatch({
      type:'createNewHouse/changeValue',
      payload:{
        current:current+1
      }
    })
  }
  const handleSubmit=(e)=>{
    e.preventDefault();
    form.validateFields((err, values) => {
        if (!err) {
          values.coordinates=coordinates;
          values.openingTime=openingTime;
          values.deliverTime=deliverTime;
          values.timeToOnline=timeToOnline;
          // console.log('Received values of form: ', values);
          onSubmit(values,current)
        }
      })
  }
  //父级组件传给GaodeMap子组件的点击方法
  const mapClick=(markers)=>{
    dispatch({
      type:'createNewHouse/changeValue',
      payload:{
        markers:markers
      }
    })
  }

  // if(type==="new"){ //根据传入属性判断是新建还是编辑;
  //   // dispatch({type:'createNewHouse/newHouse'});
  // }
  // else if(type==="modify"){
  //   // dispatch({type:'createNewHouse/fetchHouseData'});
  // }
  const onChange=()=>{};

  const exchange_options=[
    {
      id:1,
      label:'北京交易中心（房山区）',
      value:'bj_fsh'
    }
  ];//交易中心

  const {houseTypes,characteristic,fitmentType}=createNewHouse;
  const houseTypesTags=[
    {
      name:'住宅',
      value:'住宅',
    },
    {
      name:'别墅',
      value:'别墅',
    },
    {
      name:'商业',
      value:'商业',
    },
    {
      name:'商铺',
      value:'商铺',
    },
    {
      name:'写字',
      value:'写字',
    },
  ];
  const characteristicTags=['小户型','精装修','低总价','品牌地产','地铁盘'];
  const fitmentTypeTags=['毛坯','精装修'];
  return (
    <div className="createNewHouse" id="createNewHouse">
      <Form vertical onSubmit={handleSubmit}>
      <DxPanel title="项目基本信息">
      <FormItem label="项目名称"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:12,md:12,sm:12,xs:16}}
        >
        {
          form.getFieldDecorator('name',{
              rules:[{required:false,message:'请填写项目名称!'}],
          })(
              <Input className="myinput" placeholder="请填写项目名称" type="text" />
          )
        }
      </FormItem>
      <FormItem label="项目地址"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:8,md:8,sm:12,xs:16}}
        >
        {
          form.getFieldDecorator('areaId',{rules:[{required:false,message:'请选择项目地址!'}],})(
            <Cascader
              options={AreaAndCode}
              expandTrigger="hover"
              placeholder="请选择" />
          )
        }
      </FormItem>
      <FormItem label="项目上线时间"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:8,md:8,sm:12,xs:16}}
        >
        {
          form.getFieldDecorator('timeToOnline',{rules:[{required:false,message:'请选择项目上线时间!'}],})(
            <DatePicker
              placeholder="请选择项目上线时间"
              format="YYYY-MM-DD HH:mm:ss"
              onChange={(date: moment, dateString: string)=>{dispatch({
                type:"createNewHouse/changeValue",
                payload:{
                  timeToOnline:dateString
                }
              })}}
            />
          )
        }
      </FormItem>
      <FormItem label="项目带看保护期"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:4,md:4,sm:12,xs:16}}
        >
        {
          form.getFieldDecorator('protectDays',{rules:[{required:false,message:'请填写项目带看保护期!'}],})(
            <Input addonAfter={<i className="font-normal">天</i>} className="myinput"/>
          )
        }
      </FormItem>
      <FormItem label="项目详细地址"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:12,md:12,sm:12,xs:16}}
        >
        {
          form.getFieldDecorator('detailAddress',{rules:[{required:false,message:'请填写项目详细地址!'}],})(
            <Input className="myinput"  type="text" />
          )
        }
      </FormItem>
      <Row>
        <Col
          lg={{span:16,offset:8}}
          md={{span:16,offset:8}}
          sm={{span:20,offset:4}}
          xs={{span:24}}
          >
          <div className="map-area">
            {window.AMap?<GaodeMap mapClick={mapClick}/>:<p style={{margin:"100px"}}>地图加载失败</p>}
          </div>
        </Col>
      </Row>
      <FormItem label="均价"
         labelCol={{lg:8,md:8,sm:8,xs:8}}
         wrapperCol={{lg:4,md:4,sm:12,xs:16}}
         >
        {
          form.getFieldDecorator('averagePrice',{rules:[{required:false,message:'请填写均价!'}]})(
              <Input className="myinput"  addonAfter={<i className="font-normal">元</i>} />
          )
        }
      </FormItem>
      <FormItem label="项目联系人"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:8,md:8,sm:12,xs:16}}>
        {
          form.getFieldDecorator('contact',{rules:[{required:false,message:'请填写项目联系人!'}],})(
            <Input className="myinput"  />
          )
        }
      </FormItem>
      <FormItem label="项目联系电话"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:8,md:8,sm:12,xs:16}}
        >
        {
          form.getFieldDecorator('phone',{rules:[{required:false,message:'请填写项目联系电话!'}],})(
            <Input className="myinput"  />
          )
        }
      </FormItem>
    </DxPanel>
      <DxPanel title="楼盘资料">
      <FormItem label="开盘时间"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:8,md:8,sm:12,xs:16}}
        >
        {
          form.getFieldDecorator('openingTime',{rules:[{required:false,message:'请选择开盘时间'}]})(
            <DatePicker
              placeholder="请选择开盘时间"
              format="YYYY-MM-DD HH:mm:ss"
              onChange={(date: moment, dateString: string)=>{dispatch({
                type:"createNewHouse/changeValue",
                payload:{
                  openingTime:dateString
                }
              })}}
            />
          )
        }
      </FormItem>
      <FormItem label="交房时间"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:8,md:8,sm:12,xs:16}}

        >
        {
          form.getFieldDecorator('deliverTime',{rules:[{required:false,message:'请选择交房时间!'}]})(
              <DatePicker
                placeholder="请选择交房时间"
                format="YYYY-MM-DD HH:mm:ss"
                onChange={(date: moment, dateString: string)=>{dispatch({
                  type:"createNewHouse/changeValue",
                  payload:{
                    deliverTime:dateString
                  }
                })}}
              />
          )
        }
      </FormItem>
      <FormItem label="物业类型"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:16,md:16,sm:16,xs:16}}
        >
        {
          form.getFieldDecorator("propertyType",{rules:[{required:false,message:'请选择物业类型!'}]})(
              <CheckableTags
                tags={houseTypesTags}
                multiple={true}
                customStyle={customStyle}
              />
          )
        }
      </FormItem>
      <FormItem label="楼盘开发商"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:12,md:12,sm:12,xs:16}}
        >
          {
            form.getFieldDecorator('developers',{rules:[{required:false,message:'请填写楼盘开发商!'}]})(
              <Input className="myinput"  />
            )
          }
      </FormItem>
      <FormItem label="售楼地址"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:12,md:12,sm:12,xs:16}}
        >
        {
          form.getFieldDecorator('salesAddress',{rules:[{required:false,message:'请填写售楼地址!'}]})(
            <Input className="myinput"  />
          )
        }
      </FormItem>
      <FormItem label="建筑面积"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:4,md:4,sm:12,xs:16}}
        >
        {
          form.getFieldDecorator("floorArea",{rules:[{required:false,message:'请填写建筑面积!'}]})(
            <Input className="myinput"  addonAfter={<i className="font-normal">m<sup>2</sup></i>}/>
          )
        }
      </FormItem>
      <FormItem label="特色"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:12,md:12,sm:16,xs:16}}
        >
        {
          form.getFieldDecorator("characteristic",{rules:[{required:false,message:"请选择特色!"}]})(
            <CheckableTags
              tags={characteristicTags}
              multiple={true}
              customStyle={customStyle}
            />
          )
        }
      </FormItem>
      <FormItem label="产权年限"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:4,md:4,sm:12,xs:16}}
        >
        {
          form.getFieldDecorator('ownLength',{rules:[{required:false,message:'请填写产权年限!'}]})(
              <Input className="myinput"   addonAfter={<i className="font-normal">年</i>}/>
          )
        }
      </FormItem>
      <FormItem label="装修标准"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:12,md:12,sm:16,xs:16}}
        >
        {
          form.getFieldDecorator("decoration",{rules:[{required:false,message:'请选择装修标准!'}]})(
            <CheckableTags
              tags={fitmentTypeTags}
              customStyle={customStyle}
            />
          )
        }
      </FormItem>
      <FormItem label="容积率"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:4,md:4,sm:12,xs:16}}
        >
        {
          form.getFieldDecorator('rateOfCapacity',{rules:[{required:false,message:'请填写容积率!'}]})(
            <Input className="myinput" />
          )
        }
      </FormItem>
      <FormItem label="绿化率"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:4,md:4,sm:12,xs:16}}
        >
        {
          form.getFieldDecorator('greeningRate',{rules:[{required:false,message:'请填写绿化率!'}]})(
            <Input className="myinput"  addonAfter={<i className="font-normal">%</i>}/>
          )
        }
      </FormItem>
      <FormItem label="规划户数"
         labelCol={{lg:8,md:8,sm:8,xs:8}}
         wrapperCol={{lg:4,md:4,sm:12,xs:16}}
         >
        {
          form.getFieldDecorator('planningHouseHolds',{rules:[{required:false,message:'请填写规划户数!'}]})(
              <Input className="myinput"  addonAfter={<i className="font-normal">户</i>} />
          )
        }
      </FormItem>
      <FormItem label="规划车位"
         labelCol={{lg:8,md:8,sm:8,xs:8}}
         wrapperCol={{lg:4,md:4,sm:12,xs:16}}
         >
        {
          form.getFieldDecorator('planningParkingSpaces',{rules:[{required:false,message:'请填写规划车位!'}]})(
              <Input className="myinput"  addonAfter={<i className="font-normal">个</i>} />
          )
        }
      </FormItem>
      <FormItem label="物业公司"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:12,md:12,sm:12,xs:16}}
        >
        {
          form.getFieldDecorator('estateCompany',{rules:[{required:false,message:'请填写物业公司!'}]})(
            <Input className="myinput" />
          )
        }
      </FormItem>
      <FormItem label="物业费"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:4,md:4,sm:12,xs:16}}
        >
          {
            form.getFieldDecorator('propertyCosts',{rules:[{required:false,message:'请填写物业费!'}]})(
              <Input className="myinput"  addonAfter={<i className="font-normal">元/m<sup>2</sup></i>}/>
            )
          }
        </FormItem>
      <FormItem label="供暖方式"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:4,md:4,sm:12,xs:16}}
        >
        {
          form.getFieldDecorator('heatingMode',{rules:[{required:false,message:'请填写供暖方式'}]})(
            <Input className="myinput"  />
          )
        }
      </FormItem>
      <FormItem label="水电燃气"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:12,md:12,sm:16,xs:16}}
        >
        {
          form.getFieldDecorator('waterElectricityGas',{rules:[{required:false,message:'请选择水电燃气!'}]})(
            <RadioGruop
              size="large"
              >
              <Radio value={true} style={radioStyle}>有</Radio>
              <Radio value={false} style={radioStyle}>无</Radio>
            </RadioGruop>
          )
        }
      </FormItem>
    </DxPanel>
      <DxPanel title="项目介绍">
      <FormItem>
        {
          form.getFieldDecorator('introduced',{rules:[{required:false,message:'请填写项目介绍!'}]})(
            <Input
               className="myinput"
               type="textarea"
               maxLength={1000}
               autosize={{minRows:4}}
               placeholder="请输入项目介绍"
             />
          )
        }
        <p style={{textAlign:'right'}}>
          {form.getFieldValue('introduction')?form.getFieldValue('introduction').length:'0'}/1000
        </p>
      </FormItem>
    <Button type="primary"  htmlType="submit" onClick={addOrModify}>下一步添加项目相册</Button>
    </DxPanel>
    </Form>
    </div>
  );
}


function mapStateToProps({createNewHouse}){
  return {
    createNewHouse,
  }
}

export default connect(mapStateToProps)(Form.create({
  onFieldsChange:(props,fields)=>{
    if(props.editable===true){
      let payload={};
      for(let key in fields){
        payload[key]=fields[key].value;
      }
      props.dispatch({
        type:'createNewHouse/changeValue',
        payload
      });
    }
    else{
      props.dispatch({
        type:'createNewHouse/changeValue',
        payload:{}
      });
    }
  },
  mapPropsToFields:(props)=>{
    let {createNewHouse}=props;
    let obj={};
    for(let key in createNewHouse){
      obj[key]={
        dirty:false,
        name:key,
        value:createNewHouse[key]===''?undefined:createNewHouse[key]
      };
    }
    return obj;
  }
})(CreateNewHouse));
