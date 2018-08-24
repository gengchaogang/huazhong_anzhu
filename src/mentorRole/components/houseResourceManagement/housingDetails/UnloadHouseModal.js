import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';


import {
  Form,
  Button,
  Modal,
  Input,
  Checkbox,
} from 'antd';
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
function UnloadHouseModal(props){
  const {
    modalVisible,
    form,
    changeVisible,
    offLine,
  }=props;
  const { getFieldDecorator, setFields } =form;
  //创建团购中的保存按钮
  const handleSubmit=()=> {
    form.validateFields((err, values) => {
      offLine(values)
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
      form.resetFields();
    });
  };

  //多选框选项
  const options = [
    { label: '房源线下已售', value: '房源线下已售' },
    { label: '房源信息错误', value: '房源信息错误' },
    { label: '包含非法信息', value: '包含非法信息' },
    { label: '其它', value: '其它' },
  ];
  return (
    <Modal
      visible={modalVisible}
      maskClosable={false}
      title="下架原因"
      onCancel={()=>{changeVisible(false)}}
      footer={[
        <Button key="back" type="ghost" size="large" onClick={()=>{changeVisible(false)}}>取消</Button>,
        <Button key="submit" type="primary" size="large" onClick={handleSubmit}>
          保存
        </Button>,
      ]}
    >
      <Form horizontal>
        <FormItem>
          {getFieldDecorator('unloadReason', {
            rules: [{ required: true, type:'array', message: '请选择下架原因!' }],
          })(
            <CheckboxGroup options={options}/>
          )}
        </FormItem>
        <FormItem
        >
          {getFieldDecorator('otherReason', {
            rules: [{ required: false,}],
          })(
            <Input placeholder='在此输入其它原因' type="textarea" rows={4} />
          )}
        </FormItem>
      </Form>
    </Modal>
  );
};
UnloadHouseModal.propTypes = {
  // submitLoading: PropTypes.bool,
  // modalVisible: PropTypes.bool,
  // changeVisible: PropTypes.func,
  // applicability:PropTypes.string,
  // changeApplicability: PropTypes.func,
  // changeSubmitLoading: PropTypes.func,
};
UnloadHouseModal = Form.create({})(UnloadHouseModal);
export default UnloadHouseModal;
