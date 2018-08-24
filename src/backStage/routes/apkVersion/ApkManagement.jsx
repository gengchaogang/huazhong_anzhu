import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input,Table,Modal,Button,Select} from 'antd';
import './ApkManagement.css'
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 6},
};
function ApkManagement({dispatch,form ,apkManagement}) {
  const {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }=form;
  const {dataSource,addStatus}=apkManagement;
  const Option = Select.Option;
  const columns=[
    {
      title:'版本号',
      dataIndex:'versionNumber',
    },
    {
      title:'APK类型',
      dataIndex:'apkType',
      render:(text,record,index)=>{
        let apkText="经纪人APP";
        if(text==="customer"){
          apkText="客户APP";
        }
        return (
          <span>{apkText}</span>
        )
      }
    },
    {
      title:'创建时间',
      dataIndex:'createDate',
    },
    {
      title:'文件地址',
      dataIndex:'url',
    },
    {
      title:'版本信息描述',
      dataIndex:'description',
    },
  ];
  const openModal=()=>{
    dispatch({
      type:'apkManagement/initailSuccess',
      payload:{
        addStatus:true,
      }
    })
  }
  const addOk=()=>{
    form.validateFields((err, values)=>{
      if(err){
        return
      }
      dispatch({
        type:'apkManagement/add',
        payload:{
          description:values.description,
          key:values.key,
          versionNumber:values.versionNumber,
          versionId:values.versionId,
          apkType:values.apkType,
        }
      })
    })
  }
  const addCancel=()=>{
    dispatch({
      type:'apkManagement/initailSuccess',
      payload:{
        addStatus:false,
      }
    })
    form.resetFields();
  }

  return (
    <div>
      <Button type='primary' onClick={openModal}>添加</Button>
      <Table columns={columns} dataSource={dataSource} pagination={false}/>
      <Modal title='添加' onOk={addOk} onCancel={addCancel} visible={addStatus}>
        <Form>
          <FormItem
            label='版本号'
          >
            {getFieldDecorator('versionNumber', {
              rules: [
                { required: true, message: '必填' },
              ],
            })(
              <Input type='text'  placeholder='请输入版本号'/>
            )}
          </FormItem>

          <FormItem label="APK类型">
            {getFieldDecorator('apkType', {rules: [{ required: true, message: '必填' }]})(
              <Select
                style={{minWidth:'70px'}}
                placeholder='选择APK类型'
                >
                <Option value='broker'>经纪人APP</Option>
                <Option value='customer'>客户APP</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            label='版本地址'
          >
            {getFieldDecorator('key', {
              rules: [
                { required: true, message: '必填' },
              ],
            })(
              <Input type='text'  placeholder='请输入版本url地址'/>
            )}
          </FormItem>
          <FormItem
            label='版本描述'
          >
            {getFieldDecorator('description', {
              rules: [
                { required: true, message: '必填' },
              ],
            })(
              <Input type='textarea'  placeholder='请输入版本信息描述'/>
            )}
          </FormItem>
          <FormItem
            label='版本编号'
          >
            {getFieldDecorator('versionId', {
              rules: [
                { required: true, message: '请输入版本编号，限整数' },
                { type:'string',pattern:/^\+?[1-9][0-9]*$/, message: '限整数且必须大于0' },
              ],
            })(
              <Input type='text'  placeholder='请输入版本编号，限整数'/>
            )}
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}

function mapStateToProps({apkManagement}) {
  return {apkManagement }
}

export default connect(mapStateToProps)(Form.create()(ApkManagement));
