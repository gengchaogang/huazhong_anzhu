import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input,Table,Tabs,Button,Modal,Cascader,Radio} from 'antd';
import DxPanel from '../../../../commons/components/DxPanel'
import './DealDetailMaster.css'
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
function DealDetailMaster({dispatch,dealDetailMaster,form}) {
  const {
    time,
    result,
    relationBrokerRole,
    relationBrokerName,
    relationBrokerCityNames,
    processTime,
    operationUserInfo,
    description,
    id,
    applyBrokerCityNames,
    applyBrokerRole,
    applyBrokerName,
    masterStatus,
    relationship,
  }=dealDetailMaster;
  const {getFieldDecorator}=form;
  const submitClick=()=>{
    // console.log(relationship,'relationship');
    form.validateFields((err, values) => {
      if (!err) {
        if(relationship=='师徒'){
          dispatch({
            type:'dealDetailMaster/operationApply',
            payload:{
              description:values.description,
              result:values.result,
              id:id,
            }
          })
        }else{
          dispatch({
            type:'dealDetailMaster/operationApplyBroker',
            payload:{
              description:values.description,
              result:values.result,
              id:id,
            }
          })
        }
      }
    });
    form.resetFields();
  }
  const goBack=()=>{
    dispatch(routerRedux.goBack());
    form.resetFields();
  }
  return (
    <div>
      <DxPanel title={!!description? '处理详情':'申请详情' }>
        <p>申请时间：{time}</p>
        <p>关系：师徒</p>
        <p>申请人：{applyBrokerName}</p>
        <p>角色：{applyBrokerRole}</p>
        <p>申请人所在区域：{applyBrokerCityNames}</p>
        <p>关系人：{relationBrokerName}</p>
        <p>角色：{relationBrokerRole}</p>
        <p>关系人所在地区：{relationBrokerCityNames}</p>
      </DxPanel>
      {masterStatus=='待处理'?
        <Form>
          <DxPanel title='处理描述'>
            <FormItem>
              {getFieldDecorator('description', {
              })(
                <Input type='textarea'
                  placeholder='请填写申请内容、处理依据、处理结果'
                />
              )}
            </FormItem>
          </DxPanel>
          <DxPanel title='处理结果'>
            <FormItem>
              {getFieldDecorator('result', {
              })(
                <RadioGroup>
                  <Radio value="AGREE">解除关系</Radio>
                  <Radio value="REFUSE">拒绝申请</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <p>！ 选择处理结果之前请致电相关人员核实信息</p>
          </DxPanel>
          <div className='buttonPositionRight'>
            <Button type='primary' onClick={submitClick}>完成</Button>
            <Button type='ghost' onClick={goBack}>返回</Button>
          </div>
        </Form>
      :
      <div>
        <DxPanel title='处理描述'>
          <p>{description}</p>
        </DxPanel>
        <DxPanel title='处理描述'>
          <p>{result}</p>
        </DxPanel>
        <div className='buttonPositionRight'>
          <Button type='ghost' onClick={goBack}>返回</Button>
        </div>
      </div>}
    </div>
  );
}

function mapStateToProps({dealDetailMaster}) {
  return {dealDetailMaster}
}

export default connect(mapStateToProps)(Form.create({})(DealDetailMaster));
