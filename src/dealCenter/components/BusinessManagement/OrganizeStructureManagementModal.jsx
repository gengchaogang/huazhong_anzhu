import React, { PropTypes } from 'react';
import { Form, Input, Modal } from 'antd';
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const OrganizeStructureManagementModal = ({
  visible = false,
  item = {},
  onOk,
  title,
  onCancel,
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
      const data = { ...getFieldsValue(), key: item.key };
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
    onOk: handleOk,
    onCancel:handleCancel,
  };

  return (
    <Modal {...modalOpts}>
      <Form horizontal>
        <FormItem
          label='部门名称：'
          hasFeedback
          {...formItemLayout}
        >
          {getFieldDecorator('name', {
            initialValue: item._beUpdateName||item.name||'',
            rules: [
              { required: true, message: '部门名称未填写' },
            ],
          })(
            <Input type='text' />
          )}
        </FormItem>
      </Form>
    </Modal>
  );
};

OrganizeStructureManagementModal.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(OrganizeStructureManagementModal);
