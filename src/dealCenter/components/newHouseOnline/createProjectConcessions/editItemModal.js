import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import moment from 'moment';
// import { Modal, Button } from 'antd';

import {
  Form,
  Radio,
  Slider,
  Button,
  Upload,
  Modal,
  Input,
  DatePicker,
  Col,
  Checkbox,
  InputNumber,
  Row,
} from 'antd';
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;
function EditItem(props){
  const {
    onOk,
    edit_submitLoading,
    edit_modalVisible,
    edit_applicability,
    houseTypeNames,
    changeEditVisible,
    changeApplicability,
    changeSubmitLoading,
    edit_record,
    form,
    tableOneData,
  }=props;
  const { getFieldDecorator, setFields } =form;
  //布局控制
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };
  //适用范围的单选框
  const onChange=(e)=> {
    changeApplicability(e.target.value);
  };
  //创建团购中的保存按钮
  const handleSubmit=()=> {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (values.areaStart>values.areaEnd) {
        setFields({
          areaStart:{value:null},
          areaEnd:{value:null}
        });
        return ;
      };
      const date=new Date()
      values.createDatetime=date;
      changeEditVisible(false);
      onOk(values);
      form.resetFields();
  })
}
  //多选框选项
  const options=[];
  if(!!houseTypeNames){
    houseTypeNames.map(item=>{options.push({
      label:item.name,value:item.name,id:item.id,key:item.id
    })});
  }
  return (
    <Modal
      visible={edit_modalVisible}
      maskClosable={false}
      title="编辑团购电商优惠"
      onCancel={()=>{changeEditVisible(false)}}
      footer={[
        <Button key="back" type="ghost" size="large" onClick={()=>{changeEditVisible(false);form.resetFields()}}>取消</Button>,
        <Button key="submit" type="primary" size="large" loading={edit_submitLoading} onClick={handleSubmit}>
          保存
        </Button>,
      ]}
    >
      <Form horizontal>
        <FormItem
          {...formItemLayout}
          label="团购优惠名称"
        >
          {getFieldDecorator('name', {
            // initialValue:edit_record.yhmc,
            initialValue:!!tableOneData?tableOneData.name:'',
            rules: [{ required: true, message: '请输入电商优惠名称!' }],
          })(
            <Input placeholder="例如一万抵十万"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="团购抵扣金额"
        >
          {getFieldDecorator('originalPrice', {
            // initialValue:edit_record.yhje,
            initialValue:!!tableOneData?tableOneData.originalPrice:'',
            rules: [
              { required: true, message: '请输入优惠金额!' },
              {type:'string',pattern:/^\+?[1-9][0-9]*$/, message: '输入内容非法'},
            ],
          })(
            <Input placeholder="请输入优惠金额" addonAfter='元'/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="购买团购金额"
        >
          {getFieldDecorator('price', {
            // initialValue:edit_record.sxje,
            initialValue:!!tableOneData?tableOneData.price:'',
            rules: [
              { required: true, message: '请输入优惠金额!' },
              {type:'string',pattern:/^\+?[1-9][0-9]*$/, message: '输入内容非法'},
            ],
          })(
            <Input placeholder="请输入购买金额" addonAfter='元'/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="团购电商优惠有效期"
        >
          {getFieldDecorator('validDate', {
            initialValue:!!tableOneData.validDate?[moment(new Date(tableOneData.validDate[0])), moment(new Date(tableOneData.validDate[1]))]:null,
            rules: [{ type: 'array', required: true, message: '请选择活动期时间范围!' }],
          })(
            <RangePicker/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="电商团购锁定意向房源有效期"
          extra='注：团购锁定房源有效期是指购房人支付团购锁定房源时间，房源锁定后其他经纪人或客户不能带看或成交该房源。'
        >
          {getFieldDecorator('holdDays', {
            initialValue:!!tableOneData?tableOneData.holdDays:'',
            rules: [{ required: true,
                      type:'number',
                      min:0,
                      validator:(rule,value,callback)=>{
                        if(value>0){
                          return callback();
                          // return;
                        }else if(value==null){
                          let error='请输入天数!';
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
          <span className="ant-form-text"> 天</span>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="电商团购活动适用房源类型"
        >
          {getFieldDecorator('applicability', {
            initialValue:!!tableOneData?tableOneData.applicability:'',
            // initialValue:!!disabled&&!!tableOneData?tableOneData.state:'',
            rules: [{ required: true, message: '请选择适用范围!' }],
          })(
            <RadioGroup onChange={onChange}>
              <Radio value={'houseArea'}>适用面积</Radio>
              <Radio value={'houseType'}>适用户型</Radio>
            </RadioGroup>
          )}
        </FormItem>
        {
          (edit_applicability==='houseArea')?
            <FormItem
              labelCol={{ span: 6 }}
              label="适用面积"
            >
              <Row type="flex" justify="start">
                <FormItem >
                  {getFieldDecorator('areaFrom', {
                    initialValue:!!tableOneData&&!!tableOneData.areaFrom?tableOneData.areaFrom:'',
                    rules: [{ required: true,
                                type:'number',
                                min:0,
                                validator:(rule,value,callback)=>{
                                  if(value>0){
                                    return callback();
                                    // return;
                                  }else if(value==null){
                                    let error='请输入面积范围';
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
                <p className="ant-form-text">㎡</p>
                <p className="ant-form-text">至</p>
                <FormItem>
                  {getFieldDecorator('areaTo', {
                    initialValue:!!tableOneData&&!!tableOneData.areaTo?tableOneData.areaTo:'',
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
                <p className="ant-form-text">㎡</p>
              </Row>
            </FormItem>
          :(edit_applicability==='houseType')?
            <FormItem
              {...formItemLayout}
              label="适用户型"
            >
              {getFieldDecorator('houseType', {
                initialValue:!!tableOneData?tableOneData.houseType:null,
                rules: [{ required: true, type:'array', message: '请选择适用户型!' }],
              })(
                <CheckboxGroup key={options} options={options} />
              )}
            </FormItem>
          :null
        }
      </Form>
    </Modal>
  );
};
EditItem.propTypes = {
  edit_submitLoading: PropTypes.bool,
  edit_modalVisible: PropTypes.bool,
  changeEditVisible: PropTypes.func,
  edit_applicability:PropTypes.string,
  changeApplicability: PropTypes.func,
  changeSubmitLoading: PropTypes.func,
};
EditItem = Form.create({})(EditItem);
export default EditItem;
