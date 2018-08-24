import './CreateNewHouse.css';
import React from 'react';
import {connect} from 'dva'
import TitleBar from '../../../../../commons/UI/TitleBar';
import CheckableTags from '../../../../../commons/UI/CheckableTags';
import AreaAndCode from '../../../../../commons/utils/AreaAndCode';

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
  Collapse,
  Button
} from 'antd';

const FormItem=Form.Item;
const Option=Select.Option;
const CheckableTag = Tag.CheckableTag;
const RadioGruop=Radio.Group;
const CheckboxGroup=Checkbox.Group;
const Panel=Collapse.Panel;

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
  if(type==="new"){ //根据传入属性判断是新建还是编辑;
    // dispatch({type:'createNewHouse/newHouse'});
  }
  else if(type==="modify"){
    // dispatch({type:'createNewHouse/fetchHouseData'});
  }
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
      <Form horizontal onSubmit={(e)=>{
        e.preventDefault();
        let data=form.getFieldsValue();
        onSubmit(data);
      }}>
      <Collapse defaultActiveKey={['1','2','3','4']} activeKey={['1','2','3','4']}>
      {
        type==="new"?
        <Panel header={<div className="panelHeader">新房项目归属</div>} key={'1'} className="panel">
          <FormItem
            label="所在地区"
            labelCol={{lg:8,md:8,sm:8,xs:8}}
            wrapperCol={{lg:8,md:8,sm:12,xs:16}}
                >
                {
                  form.getFieldDecorator('area',{})(
                    <Cascader
                    options={AreaAndCode}
                    style={{fontSize:14}}
                    expandTrigger="hover"
                    placeholder="请选择"
                    notFoundContent="没有任何选项"
                  />
                  )
                }
          </FormItem>
          <FormItem
            label="选择交易中心"
            labelCol={{lg:8,md:8,sm:8,xs:8}}
            wrapperCol={{lg:8,md:8,sm:12,xs:16}}

            >
            {
              form.getFieldDecorator('tradingCenter',{message:'aaa'})(
                <Select placeholder="请选择" onSelect={(center)=>{}}>
                  {exchange_options.map((item,index)=>(<Option value={item.value} key={index}>{item.label}</Option>))}
                </Select>
              )
            }
          </FormItem>
      </Panel>
        :null
      }
    <Panel header={<div className="panelHeader">项目基本信息</div>}  key={['2']} className="panel">
      <FormItem
        label="项目名称"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:12,md:12,sm:12,xs:16}}
        >
        {
          form.getFieldDecorator('programName',{})(
              <Input className="myinput"   type="text" />
          )
        }
      </FormItem>
      <FormItem
        label="项目地址"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:8,md:8,sm:12,xs:16}}
        >
        {
          form.getFieldDecorator('location',{})(
            <Cascader
              options={AreaAndCode}
              expandTrigger="hover"
              placeholder="请选择" />
          )
        }
      </FormItem>
      <FormItem
        label="项目上线时间"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:8,md:8,sm:12,xs:16}}
        >
        {
          form.getFieldDecorator('onlineTime',{})(
            <Select placeholder="请选择" >
              {exchange_options.map((item,index)=>(<Option  key={index}>{item.label}</Option>))}
            </Select>
          )
        }
      </FormItem>
      <FormItem
        label="项目带看保护期"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:4,md:4,sm:12,xs:16}}
        >
        {
          form.getFieldDecorator('protectionPeriod',{})(
            <Input addonAfter={<i className="font-normal">天</i>} className="myinput"/>
          )
        }
      </FormItem>
      <FormItem
        label="项目详细地址"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:12,md:12,sm:12,xs:16}}
        >
        {
          form.getFieldDecorator('detailLocation',{})(
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
            <p className="center-font">高德地图选择X轴Y轴</p>
          </div>
        </Col>
      </Row>
      <FormItem
        label="项目联系人"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:8,md:8,sm:12,xs:16}}
        >
        {
          form.getFieldDecorator('contactPerson',{})(
            <Input className="myinput"  />
          )
        }
      </FormItem>
      <FormItem
        label="项目联系电话"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:8,md:8,sm:12,xs:16}}
        >
        {
          form.getFieldDecorator('contactTel',{})(
            <Input className="myinput"  />
          )
        }
      </FormItem>
    </Panel>
    <Panel header={<div className="panelHeader">楼盘资料</div>} key={['3']} className="panel">
      <FormItem
        label="开盘时间"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:8,md:8,sm:12,xs:16}}
        >
        {
          form.getFieldDecorator('openTradingTime',{})(
            <DatePicker
              placeholder="请选择开盘时间"
            />
          )
        }
      </FormItem>
      <FormItem
        label="交房时间"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:8,md:8,sm:12,xs:16}}
        >
        {
          form.getFieldDecorator('turnOverTime',{})(
              <DatePicker
                placeholder="请选择交房时间"
              />
          )
        }
      </FormItem>
      <FormItem
        label="物业类型"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:16,md:16,sm:16,xs:16}}
        >
        {
          form.getFieldDecorator("houseTypes",{})(
              <CheckableTags
                tags={houseTypesTags}
                multiple={true}
                customStyle={customStyle}
              />
          )
        }
      </FormItem>
      <FormItem
        label="楼盘开发商"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:12,md:12,sm:12,xs:16}}
        >
          {
            form.getFieldDecorator('developer',{})(
              <Input className="myinput"  />
            )
          }
      </FormItem>
      <FormItem
        label="售楼地址"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:12,md:12,sm:12,xs:16}}
        >
        {
          form.getFieldDecorator('saleLocation',{})(
            <Input className="myinput"  />
          )
        }
      </FormItem>
      <FormItem
        label="建筑面积"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:4,md:4,sm:12,xs:16}}
        >
        {
          form.getFieldDecorator("buildingArea",{})(
            <Input className="myinput"  addonAfter={<i className="font-normal">m<sup>2</sup></i>}/>
          )
        }
      </FormItem>
      <FormItem
        label="特色"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:12,md:12,sm:16,xs:16}}
        >
        {
          form.getFieldDecorator("characteristic",{})(
            <CheckableTags
              tags={characteristicTags}
              multiple={true}
              customStyle={customStyle}
            />
          )
        }
      </FormItem>
      <FormItem
        label="产权年限"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:4,md:4,sm:12,xs:16}}
        >
        {
          form.getFieldDecorator('equityYearLimit',{})(
              <Input className="myinput"   addonAfter={<i className="font-normal">年</i>}/>
          )
        }
      </FormItem>
      <FormItem
        label="装修标准"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:12,md:12,sm:16,xs:16}}
        >
        {
          form.getFieldDecorator("fitmentType",{})(
            <CheckableTags
              tags={fitmentTypeTags}
              customStyle={customStyle}
            />
          )
        }
      </FormItem>
      <FormItem
        label="容积率"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:4,md:4,sm:12,xs:16}}
        >
        {
          form.getFieldDecorator('volumeFraction',{})(
            <Input className="myinput" />
          )
        }
      </FormItem>
      <FormItem
        label="绿化率"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:4,md:4,sm:12,xs:16}}
        >
        {
          form.getFieldDecorator('greenPercentage',{})(
            <Input className="myinput"  addonAfter={<i className="font-normal">%</i>}/>
          )
        }
      </FormItem>
      <FormItem
         label="规划户数"
         labelCol={{lg:8,md:8,sm:8,xs:8}}
         wrapperCol={{lg:4,md:4,sm:12,xs:16}}
         >
        {
          form.getFieldDecorator('planedAmount',{})(
              <Input className="myinput"  addonAfter={<i className="font-normal">户</i>} />
          )
        }
      </FormItem>
      <FormItem
        label="物业公司"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:12,md:12,sm:12,xs:16}}
        >
        {
          form.getFieldDecorator('estateManageCompany',{})(
            <Input className="myinput" />
          )
        }
      </FormItem>
      <FormItem
        label="物业费"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:4,md:4,sm:12,xs:16}}
        >
          {
            form.getFieldDecorator('estateManageCost',{})(
              <Input className="myinput"  addonAfter={<i className="font-normal">元/m<sup>2</sup></i>}/>
            )
          }
        </FormItem>
      <FormItem
        label="供暖方式"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:4,md:4,sm:12,xs:16}}
        >
        {
          form.getFieldDecorator('heatingWay',{})(
            <Input className="myinput"  />
          )
        }
      </FormItem>
      <FormItem
        label="水电燃气"
        labelCol={{lg:8,md:8,sm:8,xs:8}}
        wrapperCol={{lg:12,md:12,sm:16,xs:16}}
        >
        {
          form.getFieldDecorator('waterElectricityGasOwn',{})(
            <RadioGruop
              size="large"
              >
              <Radio value={true} style={radioStyle}>有</Radio>
              <Radio value={false} style={radioStyle}>无</Radio>
            </RadioGruop>
          )
        }
      </FormItem>
    </Panel>
    <Panel header={<div className="panelHeader">项目介绍</div>} key={'4'} className="panel">
      <FormItem
        >
        {
          form.getFieldDecorator('introduction',{})(
            <Input
               className="myinput"
               type="textarea"
               maxLength={1000}
               autosize={{minRows:4}}
               placeholder="请输入项目介绍"
             />
          )
        }
        <p style={{textAlign:'right'}}>{form.getFieldValue('introduction')?form.getFieldValue('introduction').length:'0'}/1000</p>
      </FormItem>
      <FormItem>
        <Button type="default" htmlType="submit" className="submitButton">下一步添加项目相册</Button>
      </FormItem>
    </Panel>
    </Collapse>
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
