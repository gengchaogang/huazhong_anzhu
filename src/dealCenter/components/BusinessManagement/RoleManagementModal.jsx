import React, { PropTypes } from 'react';
import { Form, Input, Modal,TreeSelect } from 'antd';
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const RoleManagementModal = ({
  visible,
  item,
  onOk,
  title,
  onCancel,
  treeData,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
    },
  }) => {
  function handleOk() {
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = { ...getFieldsValue()};
      onOk(data);
      resetFields();
    });
  }
  function handleCancel(){
    resetFields();
    onCancel();
  }


  const modalOpts = {
    title,
    visible,
    maskClosable:false,
    onOk: handleOk,
    onCancel:handleCancel,
  };
  const treeSelectProps={
    treeData,
    multiple: true,
    treeCheckable: true,
    // showCheckedStrategy: TreeSelect.SHOW_ALL, use default SHOW_CHILD
    searchPlaceholder: '请选择角色权限',
    style: {
      width: '100%',
    },
  }
  return (
    <Modal {...modalOpts}>
      <Form horizontal>
        <FormItem
          label='角色名称：'
          hasFeedback
          {...formItemLayout}
        >
          {getFieldDecorator('name', {
            initialValue: !!item.name?item.name:'',
            rules: [
              { required: true, message: '角色名称未填写' },
              { min: 2, message: '角色名称过短' },
              { max: 12, message: '角色名称过长' },
            ],
          })(
            <Input type='text' placeholder='请输入角色名称'/>
          )}
        </FormItem>
        <FormItem
          label='权限控制：'
          hasFeedback
          {...formItemLayout}
        >
          {getFieldDecorator('permissions', {
            initialValue: !!item.permissions?item.permissions:'',
            rules: [
              { required: true, message: '角色权限未填写' },
            ],
          })(
            <TreeSelect {...treeSelectProps}/>
          )}
        </FormItem>
      </Form>
    </Modal>
  );
};

RoleManagementModal.propTypes = {
  visible: PropTypes.bool,
  form: PropTypes.object,
  item: PropTypes.object,
  treeData: PropTypes.array,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(RoleManagementModal);
