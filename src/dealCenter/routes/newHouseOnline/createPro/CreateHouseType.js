import React from 'react'
import {connect} from 'dva'
import TitleBar from '../../../../commons/UI/TitleBar'
import "./CreateHouseType.css"
import CheckableTags from '../../../../commons/UI/CheckableTags'
import { Upload, Icon, Modal,Checkbox,Form,Input,Select,Row,Col,Button,InputNumber} from 'antd'
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const SelectGroup=Select.Group;
const InputGroup=Input.Group;
const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 5 },
    }
    const formItemLayout1 = {
          labelCol: { span: 6 },
          wrapperCol: { span: 1 },
        }
  const formItemLayout2 = {
      labelCol: { span: 6 },
        wrapperCol: { span: 12 },
        }
const area=[];
function CreateHouseType({dispatch,CreateHouseType,form}){
  const { previewVisible, previewImage, fileList } = CreateHouseType;
  const { getFieldDecorator } = form;
  const handleCancel = () => {
    dispatch({
      type:'CreateHouseType/handleCancel'
    })
  }

  const handlePreview=(file)=>{
    dispatch({
      type:'CreateHouseType/handlePreview',
      payload:file
    })
  }

  const handleChange=(file)=>{
    console.log("flie is" ,file)
    dispatch({
      type:'CreateHouseType/handleChange',
      payload:file
    })
  }
const handleClose=()=>{
  dispatch({
    type:'ImgManagement/handleClose'
  })
}
  const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    )
  const handleSubmit=(e)=>{
    e.preventDefault();
    form.validateFields((err,values)=>{
      if(!err){
        console.log('Received values of form: ', values)
      }
    })
  }
  const hauseTypeSales=[
    {name:"南北通透",
      value:"南北通透"
    },
    {name:"主卧带卫",
      value:"主卧带卫"
    },
    {name:"户型方正",
      value:"户型方正"
    },
    {name:"观景飘窗",
      value:"观景飘窗"
    },
    {name:"厨卫不对门",
      value:"厨卫不对门"
    },
    {name:"全明格局",
      value:"全明格局"
    },
    {name:"主卧朝南",
      value:"主卧朝南"
    }
  ]
  return (
    <div>
      <TitleBar title="创建户型" />
      <div className="clearfix">
        <Upload
          action="/upload.do"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}>
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
      <TitleBar title="户型信息" />
      <div>
        <Form horizontal onSubmit={handleSubmit}>
          <FormItem {...formItemLayout} label="户型名称">
                    {getFieldDecorator('houseTypeName', {
                        rules: [
                          { required: true, message: '请填写户型名称!'},
                        ],
                        initialValue:"ddk"
                      })(<Input /> )}
          </FormItem>
          <FormItem {...formItemLayout} label="户型居室">
            {getFieldDecorator('houseTypeSize',{
                rules: [
                  { required: true,len:4,type:"array",message: '请选择户型居室!' },
                ],
              })(
                <Row gutter={8} style={{width:"290px"}}>
                  <Select style={{ width: 50 }} name="houseTypeSize" onChange={(v)=>{
                        let size=form.getFieldValue('houseTypeSize');
                        size=size?size:[];
                        size[0]=v;
                        form.setFieldsValue({houseTypeSize:size})
                      }}>
                    <Option  value="1">1</Option >
                    <Option  value="2">2</Option >
                    <Option  value="3">3</Option >
                    <Option  value="4">4</Option >
                    <Option  value="5">5</Option >
                  </Select>
                  <span className="itemName">室</span>
                    <Select style={{ width: 50 }} name="houseTypeSize" onChange={(v)=>{
                          let size=form.getFieldValue('houseTypeSize');
                          size=size?size:[];
                          size[1]=v;
                          form.setFieldsValue({houseTypeSize:size})
                        }}>
                      <Option  value="1">1</Option >
                      <Option  value="2">2</Option >
                      <Option  value="3">3</Option >
                      <Option  value="4">4</Option >
                      <Option  value="5">5</Option >
                    </Select>
                    <span className="itemName">厅</span>
                      <Select style={{ width: 50 }} name="houseTypeSize" onChange={(v)=>{
                            let size=form.getFieldValue('houseTypeSize');
                            size=size?size:[];
                            size[2]=v;
                            form.setFieldsValue({houseTypeSize:size})
                          }}>
                        <Option  value="1">1</Option >
                        <Option  value="2">2</Option >
                        <Option  value="3">3</Option >
                        <Option  value="4">4</Option >
                        <Option  value="5">5</Option >
                      </Select>
                      <span className="itemName">厨</span>
                      <Select style={{ width: 50 }} name="houseTypeSize" onChange={(v)=>{
                            let size=form.getFieldValue('houseTypeSize');
                            size=size?size:[];
                            size[3]=v;
                            form.setFieldsValue({houseTypeSize:size})
                          }}>
                        <Option  value="1">1</Option >
                        <Option  value="2">2</Option >
                        <Option  value="3">3</Option >
                        <Option  value="4">4</Option >
                        <Option  value="5">5</Option >
                      </Select>
                      <span className="itemName">卫</span>
                </Row>
                 )}
          </FormItem>
          <FormItem {...formItemLayout} label="建筑面积区间">
            <Row gutter={8}>
              <Col span={11}>
              <FormItem >
                {getFieldDecorator('BuildAreaStart', {
                  rules: [
                    { required: true,
                              type:'number',
                              validator:(rule,value,callback)=>{
                                if(value>0){
                                  return callback();
                                }else if(value==null){
                                  let error='请输入面积范围!';
                                  callback(new Error(error));
                                }else{
                                  let error='输入值必须大于0!';
                                  callback(new Error(error));
                                }
                              },
                          }],
                })(
                  <InputNumber/>
                )}
                </FormItem>
              </Col>
              <Col span={1}><p className="ant-form-text"> ~ </p></Col>
              <Col span={11}>
              <FormItem>
                {getFieldDecorator('BuildAreaEnd', {
                  rules: [{ required: true,
                              type:'number',
                              min:0,
                              validator:(rule,value,callback)=>{
                                if(value>0){
                                  return callback();
                                  // return;
                                }else if(value==null){
                                  let error='请输入面积范围!';
                                  callback(new Error(error));
                                }else{
                                  let error='输入值必须大于0!';
                                  callback(new Error(error));
                                }
                              },
                          }],
                })(
                  <InputNumber/>
                )}
              </FormItem>
              </Col>
              <Col span={1}><p className="ant-form-text">㎡</p></Col>
            </Row>
          </FormItem>
          <FormItem {...formItemLayout} label="套内面积">
              <Row gutter={8}>
                <Col span={11}>{getFieldDecorator('houseInArea',{
                    rules:[
                      {required:true,message:"请输入套内面积!"}
                    ]
                  })(<InputNumber/>)}
                  </Col>
                <Col span={1}><span> ㎡ </span></Col>
              </Row>
          </FormItem>
          <FormItem {...formItemLayout} label="参考均价">
              <Row gutter={8}>
                <Col span={11}>
                  {getFieldDecorator('houseReferencePrice',{
                      rules:[
                        {required:true,message:"请输入参考均价!"}
                      ]
                    })(<InputNumber/>)}
                  </Col>
                <Col span={4}><span> 元/㎡ </span></Col>
              </Row>
          </FormItem>
          <FormItem {...formItemLayout} label="参考总价">
            <Row gutter={8}>
              <Col span={11}>
              <FormItem >
                {getFieldDecorator('TotalPriceAreaStart', {
                  rules: [
                    { required: true,
                              type:'number',
                              validator:(rule,value,callback)=>{
                                if(value>0){
                                  return callback();
                                }else if(value==null){
                                  let error='请输入面积范围!';
                                  callback(new Error(error));
                                }else{
                                  let error='输入值必须大于0!';
                                  callback(new Error(error));
                                }
                              },
                          }],
                })(
                  <InputNumber/>
                )}
                </FormItem>
              </Col>
              <Col span={1}><p className="ant-form-text"> ~ </p></Col>
              <Col span={11}>
              <FormItem>
                {getFieldDecorator('TotalPriceAreaEnd', {
                  rules: [{ required: true,
                              type:'number',
                              min:0,
                              validator:(rule,value,callback)=>{
                                if(value>0){
                                  return callback();
                                  // return;
                                }else if(value==null){
                                  let error='请输入面积范围!';
                                  callback(new Error(error));
                                }else{
                                  let error='输入值必须大于0!';
                                  callback(new Error(error));
                                }
                              },
                          }],
                })(
                  <InputNumber/>
                )}
              </FormItem>
              </Col>
              <Col span={1}><p className="ant-form-text">㎡</p></Col>
            </Row>
          </FormItem>
          <FormItem {...formItemLayout2} label="户型卖点">
              <Row gutter={8}>
                {getFieldDecorator('hauseTypeSales',{rules: [
                  { required: true, message: '请选择户型卖点!' },
                ],})(
                      <CheckableTags
                        tags={hauseTypeSales}
                        multiple={true}
                        customStyle={{
                          border:'1px solid #ddd',
                          padding:'4px 8px',
                          fontSize:'16px',
                          active:{
                            background:'rgb(0,150,0)',
                            color:'#fff'
                          }
                        }}/>
                    )}
              </Row>
          </FormItem>
          <FormItem wrapperCol={{ span: 16, offset: 6 }}>
              <Button type="primary" htmlType="submit" size="large">增加户型</Button>
              <Button type="primary" size="large" onClick={handleClose}>关闭</Button>
          </FormItem>
        </Form>
      </div>
    </div>
  )
}
CreateHouseType = Form.create({})(CreateHouseType);


function mapStateToProps({ CreateHouseType }) {
  return { CreateHouseType }
}
export default connect(mapStateToProps)(CreateHouseType);
