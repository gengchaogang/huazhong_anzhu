import React, { PropTypes } from 'react';
import { Form, Input, Modal,Row,Col,Select,Radio,Button} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const HouseEdit = ({
  projectId,
  houseResourceId,
  houseTypeNames,
  tableOneData,
  houseTypeData,
  decoration,
  stairType,
  visible,
  disabled,
  houseEditTitle,
  item,
  onOk,
  handleSelectChange,
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
      data.projectId=projectId;
      data.id=houseResourceId;
      onOk(data);
      resetFields();
    });
  }
  function handleCancel(){
    resetFields();
    onCancel();
  }
  const modalOpts = {
    visible,
    onOk: handleOk,
    onCancel:handleCancel,
  };
  const handleSelectSelected=(e,option)=>{
    handleSelectChange(option)
  }
  console.log('tableOneData',tableOneData);
  return (
    <Modal {...modalOpts} title={houseEditTitle} width="700px" footer="">
      <Form horizontal>
        <Row>
          <Col sm={24} md={12}>
            <FormItem {...formItemLayout} label="房源类型">
              {getFieldDecorator('housingType', {
                initialValue:!!disabled&&!!tableOneData?tableOneData.housingType:tableOneData.housingType,
                rules: [
                  { required: true, message: '请填写房源类型' },
                ],
              })(
                <Select disabled={disabled}>
                  {!!houseTypeData?houseTypeData.map(function(item){
                    return(<Option key={`${item}`}>{item}</Option>)
                  }):null}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col sm={24} md={12}>
            <FormItem {...formItemLayout} label="区域">
              {getFieldDecorator('area', {
                initialValue:!!disabled&&!!tableOneData?tableOneData.area:tableOneData.area,
                rules: [
                  { required: true, message: '请填写区域' },
                ],
              })(
                <Input type='text' placeholder='请在此输入区域' disabled={disabled}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col sm={24} md={12}>
            <FormItem {...formItemLayout} label="楼号">
              {getFieldDecorator('buildingNumber', {
                initialValue:!!disabled&&!!tableOneData?tableOneData.buildingNumber:tableOneData.buildingNumber,
                rules: [
                  { required: true, message: '请填写楼号' },
                ],
              })(
                <Input type='text' placeholder='请在此输入楼号' disabled={disabled}/>
              )}
            </FormItem>
          </Col>
          <Col sm={24} md={12}>
            <FormItem {...formItemLayout} label="单元">
              {getFieldDecorator('unit', {
                initialValue:!!disabled&&!!tableOneData?tableOneData.unit:tableOneData.unit,
                rules: [
                  { required: true, message: '请填写单元' },
                ],
              })(
                <Input type='text' placeholder='请在此输入房源所在单元号' disabled={disabled}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col sm={24} md={12}>
            <FormItem {...formItemLayout} label="楼梯类型">
              {getFieldDecorator('stairType', {
                initialValue:!!disabled&&!!tableOneData?tableOneData.stairType:tableOneData.stairType,
                rules: [
                  { required: true, message: '请选择楼梯类型' },
                ],
              })(
                <Select disabled={disabled}>
                  {!!stairType?stairType.map(function(item){
                    return(<Option key={`${item}`}>{item}</Option>)
                  }):null}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col sm={24} md={12}>
            <FormItem {...formItemLayout} label="楼层">
              {getFieldDecorator('floor', {
                initialValue:!!disabled&&!!tableOneData?tableOneData.floor:tableOneData.floor,
                rules: [
                  { required: true, message: '请填写楼层' },
                ],
              })(
                <Input type='text' placeholder='请在此输入楼层' disabled={disabled}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col sm={24} md={12}>
            <FormItem {...formItemLayout} label="总楼层">
              {getFieldDecorator('totalFloor', {
                initialValue:!!disabled&&!!tableOneData?tableOneData.totalFloor:tableOneData.totalFloor,
                rules: [
                  { required: true, message:'请填写总楼层'},
                ],
              })(
                <Input type='text' placeholder='请在此输入总楼层' disabled={disabled}/>
              )}
            </FormItem>
          </Col>
          <Col sm={24} md={12}>
            <FormItem {...formItemLayout} label="房号">
              {getFieldDecorator('roomNumber', {
                initialValue:!!disabled&&!!tableOneData?tableOneData.roomNumber:tableOneData.roomNumber,
                rules: [
                  { required: true, message: '请填写房号' },
                ],
              })(
                <Input type='text' placeholder='请在此输入房号' disabled={disabled}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col sm={24} md={12}>
            <FormItem {...formItemLayout} label="装修状况">
              {getFieldDecorator('decoration', {
                initialValue:!!disabled&&!!tableOneData?tableOneData.decoration:tableOneData.decoration,
                rules: [
                  { required: true, message:'请选择装修状况'},
                ],
              })(
                <Select disabled={disabled}>
                  {!!decoration?decoration.map(item=><Option key={`${item}`}>{item}</Option>):null}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col sm={24} md={12}>
            <FormItem {...formItemLayout} label="建筑面积">
              {getFieldDecorator('floorArea', {
                initialValue:!!disabled&&!!tableOneData?tableOneData.floorArea:tableOneData.floorArea,
                rules: [
                  { required: true, message: '请填写建筑面积' },
                ],
              })(
                <Input type='text' placeholder='请在此输入建筑面积' disabled={disabled}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col sm={24} md={12}>
            <FormItem {...formItemLayout} label="销售单价">
              {getFieldDecorator('price', {
                initialValue:!!disabled&&!!tableOneData?tableOneData.price:tableOneData.price,
                rules: [
                  { required: true, message: '请填写销售单价' },
                ],
              })(
                <Input type='text' placeholder='请在此输入销售单价' disabled={disabled}/>
              )}
            </FormItem>
          </Col>
          <Col sm={24} md={12}>
            <FormItem {...formItemLayout} label="销售总价">
              {getFieldDecorator('totalPrice', {
                initialValue:!!disabled&&!!tableOneData?tableOneData.totalPrice:tableOneData.totalPrice,
                rules: [
                  { required: true, message: '请填写销售总价' },
                ],
              })(
                <Input type='text' placeholder='请在此输入销售总价' disabled={disabled}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col sm={24} md={12}>
            <FormItem {...formItemLayout} label="所属户型">
              {getFieldDecorator('houseTypeId', {
                initialValue:!!disabled&&!!tableOneData?tableOneData.houseTypeName:tableOneData.houseTypeName,
                rules: [
                  { required: true, message: '请选择所属户型' },
                ],
              })(
                <Select disabled={disabled} onSelect={handleSelectSelected}>
                  {!!houseTypeNames?houseTypeNames.map(function(item){
                    return(<Option key={`${item.id}`} value={item.id}>{item.name}</Option>)
                  }):null}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col sm={24} md={12}>
            <FormItem {...formItemLayout} label="销售状态">
              {getFieldDecorator('state', {
                initialValue:!!disabled&&!!tableOneData?tableOneData.state:tableOneData.state,
                rules: [
                  { required: true, message: '请选择销售状态' },
                ],
              })(
                <RadioGroup disabled={disabled}>
                  <Radio value='待售'>待售</Radio>
                  <Radio value='锁定'>锁定</Radio>
                  <Radio value='已售'>已售</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div style={{textAlign:'left'}}>
        {!disabled?<Button type="primary" onClick={handleOk}>确定</Button>:null}
        <Button type="ghost" onClick={onCancel}>取消</Button>
      </div>
    </Modal>
  );
};

HouseEdit.propTypes = {
  visible: PropTypes.bool,
  form: PropTypes.object,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(HouseEdit);
