import React, { PropTypes } from 'react';
import { Form, Input, Modal,Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {span: 6,},
  wrapperCol: {span: 14,},
};

const BandHouseTypeModal = ({
  houseTypeNames,
  visible,
  item,
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
    onOk: handleOk,
    onCancel:handleCancel,
  };
  return (
    <Modal {...modalOpts} title="绑定户型">
      <Form horizontal>
        <FormItem
          label='户型名称：'
          hasFeedback
          {...formItemLayout}
        >
          {getFieldDecorator('houseTypeId', {
            rules: [
              { required: true, message: '请选择要绑定的户型名称' },
            ],
          })(
            <Select >
              {!!houseTypeNames?houseTypeNames.map(item=><Option key={`${item.id}`} value={`${item.id}`}>{item.name}</Option>):''}
            </Select>
          )}
        </FormItem>
      </Form>
    </Modal>
  );
};

BandHouseTypeModal.propTypes = {
  visible: PropTypes.bool,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(BandHouseTypeModal);
