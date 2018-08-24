import React from 'react'
import {connect} from 'dva'
import './CreateHouseTypeModal.css'
import DxPanel from '../../../../commons/components/DxPanel';
import CheckableTags from '../../../../commons/UI/CheckableTags';
import moment from 'moment';
import { Upload, Icon, Modal,Checkbox,Form,Input,Select,Row,Col,Button,InputNumber,Radio} from 'antd'
import PromptModal from'../../../../commons/View/PromptModal'
import DxUpLoadPic from '../../../../commons/View/DxUpLoadPic'
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const InputGroup=Input.Group;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const CreateHouseTypeModalLayout={
  labelCol:{span:6,push:18},
  wrapperCol:{span:18,pull:6},
}
function CreateHouseTypeModal({dispatch,houseTypeImgManagement,form,label}){
  const { previewVisible, previewImage,projectId,hauseTypeSales,residentialRoom, fileList,visible,confirmLoading,id,houseTypeNames,showHouseTypePicList} = houseTypeImgManagement;
  const upLoadHouseTypePicProps={
    url:'/miss-anzhu-aliyun-file/putfile',
    maxNum:1,//最大上传数
    maxSize:2,//文件大小限值
    showPicList:showHouseTypePicList,//state管理图片list
    doCover:false,
    changeList:(data)=>{
      dispatch({
        type:"houseTypeImgManagement/changePicList",
        payload:data
      })
    },//更新list回调
  }
  const { getFieldDecorator } = form;
  const handleCancel = () => {
    dispatch({
      type:'houseTypeImgManagement/handleCancel'
    })
  }
  const handlePreview=(file)=>{
    dispatch({
      type:'houseTypeImgManagement/handlePreview',
      payload:file
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
        const pictures=[]
        showHouseTypePicList.map(item=>{
          pictures.push({accessCode:item.id})
        })
        const createTime=new Date();
        const createDateTime=moment(createTime).format('YYYY-MM-DD HH:mm:ss');
        delete values.houseTypeSize;
        values.createDateTime=createDateTime;
        values.pictures=pictures;
        values.projectId=projectId;
        dispatch({
          type:'houseTypeImgManagement/uploadHouseType',
          payload:{
            ...values
          }
        });
        form.resetFields()
        dispatch({
          type:"houseTypeImgManagement/changePicList",
          payload:[],
        })
      }
    })
  }
  const showModal=()=>{
    dispatch({
      type:"houseTypeImgManagement/setState",
      payload:{
        visible:true
      }
    })
  }
  const closeModal=()=>{
    dispatch({
      type:'houseTypeImgManagement/setState',
      payload:{
        visible:false
      }
    })
    form.resetFields()
    dispatch({
      type:'houseTypeImgManagement/changePicList',
      payload:[],
    })
  }
  const handleOk=()=>{
    dispatch({
      type:'houseTypeImgManagement/setState',
      payload:{
        confirmLoading:true
      }
    })
    setTimeout(() => {
      dispatch({
        type:'houseTypeImgManagement/setState',
        payload:{
          confirmLoading:false,
          visible:false
        }
      })
    }, 2000);
  }
  const handleDelete=()=>{

  }
  return (
    <div className="houseTypeModal">
      <Button type="primary" onClick={showModal}>创建户型</Button>
       <Modal
         visible={visible}
         onOk={handleOk}
         confirmLoading={confirmLoading}
         onCancel={closeModal}
         width="60%"
         footer=''
       >
      <div>
        <DxPanel title="创建户型">
          <div className="clearfix">
            <DxUpLoadPic {...upLoadHouseTypePicProps}/>
            <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </div>
        </DxPanel>
        <DxPanel title="户型信息">
          <div>
            <Form horizontal onSubmit={handleSubmit}>
              <Row>
                <Col sm={24} md={12}>
                  <FormItem {...formItemLayout} label="户型名称">
                      {getFieldDecorator('name', {
                          rules: [
                            { required: true, message: '请填写户型名称!'},
                          ],
                        })(<Input type="text"/> )}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  <Row>
                    <Col span={6} style={{textAlign:'right'}}>
                      <span style={{marginRight:8}}><i style={{color:'red'}}>*</i>户型居室:</span>
                    </Col>
                    <Col span={14}>
                      <Row className='createhouse_modal_clearlaber'>
                        <Col  md={12} lg={12}>
                          <FormItem {...CreateHouseTypeModalLayout} label="室">
                          {getFieldDecorator('houseRoom', {
                               rules: [
                                 { required: true, message: '请选择几室!'},
                               ],
                             })(<Select>
                                      {residentialRoom.map((item,index)=>{
                                        return(
                                          <Option key={index} value={item}>{item}</Option >
                                        )
                                      })}
                                 </Select> )}
                          </FormItem>
                        </Col>
                          <Col  md={12} lg={12}>
                          <FormItem {...CreateHouseTypeModalLayout} label="厅">
                          {getFieldDecorator('livingRoom', {
                               rules: [
                                 { required: true, message: '请选择几厅!'},
                               ],
                             })(<Select>
                               {residentialRoom.map((item,index)=>{
                                 return(
                                   <Option key={index} value={item}>{item}</Option >
                                 )
                               })}
                                 </Select> )}
                          </FormItem>
                        </Col>
                          <Col  md={12} lg={12}>
                          <FormItem {...CreateHouseTypeModalLayout} label="厨">
                          {getFieldDecorator('cookRoom', {
                               rules: [
                                 { required: true, message: '请选择几室!'},
                               ],
                             })(<Select >
                               {residentialRoom.map((item,index)=>{
                                 return(
                                   <Option key={index} value={item}>{item}</Option >
                                 )
                               })}
                                 </Select> )}
                          </FormItem>
                        </Col>
                          <Col  md={12} lg={12}>
                          <FormItem {...CreateHouseTypeModalLayout} label="卫">
                          {getFieldDecorator('bathRoom', {
                               rules: [
                                 { required: true, message: '请选择几室!'},
                               ],
                             })(<Select>
                               {residentialRoom.map((item,index)=>{
                                 return(
                                   <Option key={index} value={item}>{item}</Option >
                                 )
                               })}
                                 </Select> )}
                          </FormItem>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col sm={24} md={12}>
                  <FormItem {...formItemLayout} label="建筑面积区间">
                  {getFieldDecorator('jianzhu',{
                      rules:[
                        {required:true,message:"请输入参考均价!"}
                      ]
                    })(<span></span>)}
                   <Row gutter={8}>
                     <Col span={12}>
                     <FormItem >
                       {getFieldDecorator('floorAreaStart', {
                         rules: [
                           { required: true,message:'请输入面积范围',
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
                         <Input addonAfter={<i className="font-normal">~</i>}/>
                       )}
                       </FormItem>
                     </Col>
                     <Col span={12}>
                     <FormItem>
                       {getFieldDecorator('floorAreaEnd', {
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
                         <Input addonAfter={<i className="font-normal">㎡</i>}/>
                       )}
                     </FormItem>
                     </Col>
                   </Row>
                 </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  {/*
                    <FormItem {...formItemLayout} label="套内面积">
                      {getFieldDecorator('innerArea',{
                            rules:[
                              {required:true,message:"请输入套内面积!"}
                            ]
                          })(<Input addonAfter={<i className="font-normal">㎡</i>}/>)}
                  </FormItem>
                    */}
                    <FormItem label="主力户型"
                      {...formItemLayout}
                      >
                      {
                        form.getFieldDecorator('isLead',{
                          rules:[{required:true,message:'请选择是否为主力户型!'}]})(
                          <RadioGroup
                            size="large"
                            >
                            <Radio value={'是'}>是</Radio>
                            <Radio value={'否'}>否</Radio>
                          </RadioGroup>
                        )
                      }
                    </FormItem>
                </Col>
              </Row>
              <Row>
                <Col sm={24} md={12}>
                  <FormItem {...formItemLayout} label="参考均价">
                        {getFieldDecorator('referencePrice',{
                            rules:[
                              {required:true,message:"请输入参考均价!"}
                            ]
                          })(<Input addonAfter={<i className="font-normal">元/㎡</i>}/>)}
                  </FormItem>
                </Col>
                <Col sm={24} md={12}>
                  <FormItem {...formItemLayout} label="参考总价">
                  {getFieldDecorator('cankao',{
                      rules:[
                        {required:true,message:"请输入参考均价!"}
                      ]
                    })(<span></span>)}
                    <Row gutter={8}>
                      <Col span={12}>
                      <FormItem >
                        {getFieldDecorator('referenceTotalPriceStart', {
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
                    <Input addonAfter={<i className="font-normal">~</i>}/>
                    )}
                  </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem>
                      {getFieldDecorator('referenceTotalPriceEnd', {
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
                                <Input addonAfter={<i className="font-normal">万</i>}/>
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col sm={24} md={24}>
                  <FormItem
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 17 }} label="户型卖点">
                    {getFieldDecorator('characteristics',{rules: [
                      { required: true, message: '请选择户型卖点!' },
                      ],})(
                          <CheckableTags
                            tags={!!hauseTypeSales?hauseTypeSales:[]}
                            multiple={true}
                            customStyle={{
                              border:'1px solid #ddd',
                              padding:'4px 8px',
                              fontSize:'14px',
                              active:{
                                background:'rgb(0,150,0)',
                                color:'#fff'
                              }
                            }}/>
                        )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <FormItem>
                    <div className="modaClose">
                      <Button type="primary" htmlType="submit" size="large">增加户型</Button>
                      <Button type="ghost" size="large" onClick={closeModal}>关闭</Button>
                    </div>
                </FormItem>
              </Row>
            </Form>
          </div>
        </DxPanel>
      </div>
    </Modal>
  </div>
  )
}
CreateHouseTypeModal = Form.create({})(CreateHouseTypeModal);

function mapStateToProps({ houseTypeImgManagement }) {
  return { houseTypeImgManagement }
}
export default connect(mapStateToProps)(CreateHouseTypeModal);
