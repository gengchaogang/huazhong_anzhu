import React, { PropTypes } from 'react';
import {
  Form, 
  Radio, 
  Button,
  Modal,
  Input, 
  DatePicker,
  Checkbox,
  InputNumber,
  Row,
} from 'antd';
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;
function CreateGroupBuying(props){
  const {
    submitLoading,
    modalVisible,
    changeVisible,

    applicability,
    changeApplicability,
    changeSubmitLoading,
    form,
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
      console.log('err{}',err);
      console.log('values{}',values);
      if (err) {
        return;
      }
      if (values.areaStart>values.areaEnd) {
        setFields({
          areaStart:{value:null},
          areaEnd:{value:null}
        });
        // let error='fuck233';
        // callback(new Error(error));
        return ;
      };
      changeSubmitLoading(true);
      console.log('Received values of form: ', values);
      setTimeout(() => {
        changeSubmitLoading(false);
        changeVisible(false);
      }, 3000);
      form.resetFields();
    });
  };

  //多选框选项
  const options = [
    { label: 'A户型', value: 'A户型' },
    { label: 'B户型', value: 'B户型' },
    { label: 'C户型', value: 'C户型' },
    { label: 'D户型', value: 'D户型' },
    { label: 'E户型', value: 'E户型' },
    { label: 'F户型', value: 'F户型' },
  ];
  return (
    <Modal
      visible={modalVisible}
      maskClosable={false}
      title="创建电商优惠"
      onCancel={()=>{changeVisible(false)}}
      footer={[
        <Button key="back" type="ghost" size="large" onClick={()=>{changeVisible(false)}}>取消</Button>,
        <Button key="submit" type="primary" size="large" loading={submitLoading} onClick={handleSubmit}>
          保存
        </Button>,
      ]}
    >
      <Form horizontal>
        <FormItem
          label="团购优惠名称"
        >
          {getFieldDecorator('concessionsName', {
            rules: [{ required: true, message: '请输入电商优惠名称!' }],
          })(
            <Input placeholder="如:(5万低10万)"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="优惠金额"
        >
          {getFieldDecorator('concessionsAmount', {
            rules: [{ required: true, message: '请输入优惠金额!' }],
          })(
            <Input placeholder="请输入优惠金额(如:6万)"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="购买金额"
        >
          {getFieldDecorator('buyAmount', {
            rules: [{ required: true, message: '请输入购买金额!' }],
          })(
            <Input placeholder="请输入购买金额(如:8万)"/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="优惠活动期"
        >
          {getFieldDecorator('active-stage', {
            rules: [{ type: 'array', required: true, message: '请选择活动期时间范围!' }],
          })(
            <RangePicker />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="团购锁定房源时间"
        >
          {getFieldDecorator('lockDays', {
            // initialValue:null,
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
          label="适用范围"
        >
          {getFieldDecorator('applicability', {
            rules: [{ required: true, message: '请选择适用范围!' }],
          })(
            <RadioGroup onChange={onChange}>
              <Radio value={'houseArea'}>适用面积</Radio>
              <Radio value={'houseType'}>适用户型</Radio>
            </RadioGroup>
          )}
        </FormItem> 
        {
          (applicability==='houseArea')?
            <FormItem
              labelCol={{ span: 6 }}
              label="适用面积"
            >
              <Row type="flex" justify="start">
                <FormItem >
                  {getFieldDecorator('areaStart', {
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
                  {getFieldDecorator('areaEnd', {
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
          :(applicability==='houseType')?
            <FormItem
              {...formItemLayout}
              label="适用户型"
            >
              {getFieldDecorator('houseType', {
                rules: [{ required: true, type:'array', message: '请选择适用户型!' }],
              })(
                <CheckboxGroup options={options}/>
              )}
            </FormItem>
          :null
        }
      </Form>
    </Modal>
  );
};
CreateGroupBuying.propTypes = {
  submitLoading: PropTypes.bool,
  modalVisible: PropTypes.bool,
  changeVisible: PropTypes.func,
  applicability:PropTypes.string,
  changeApplicability: PropTypes.func,
  changeSubmitLoading: PropTypes.func,
};
CreateGroupBuying = Form.create({})(CreateGroupBuying);

export default CreateGroupBuying;
