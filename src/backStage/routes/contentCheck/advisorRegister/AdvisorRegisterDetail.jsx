import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import {Form,Input,Table,Tabs,Button,Modal,Cascader,Checkbox,message} from 'antd';
import DxPanel from '../../../../commons/components/DxPanel'
import './AdvisorRegisterDetail.css'
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
function AdvisorRegisterDetail({dispatch,advisorRegisterDetail,form}) {
  const {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }=form;
  const {auditStatus,reasons,auditTime,
    auditUserName,createDateTime,phoneNumber,companyName,
    corporation,licenseNumber,licensePic,id,refuseModal,labelArr,
    watchBigStatus,
  }=advisorRegisterDetail;
  const plainOptions=[];
  if(labelArr){
    labelArr.map(item=>(
      plainOptions.push(item.value)
    ))
  }
  const passClick=()=>{
    Modal.confirm({
      title: '提示',
      content: '确认要通过吗？',
      onOk() {
        dispatch({type:'advisorRegisterDetail/passSure',
          payload:{
            id:id,
            result:'审核通过',
          }
        })
      },
      onCancel() {},
    });
  }
  const refuseClick=()=>{
    dispatch({
      type:'advisorRegisterDetail/findeLabel',
      payload:{
        groups:[
          {areaPath:null,typeName:'拒绝原因'}
        ]
      }
    })
    dispatch({
      type:'advisorRegisterDetail/initailSuccess',
      payload:{refuseModal:true}
    })
  }

  const refuseOk=()=>{
    form.validateFields((err, values) => {
      let reasons;
      if(!!values.refuseReason && !!values.writeReason){
        reasons=(values.refuseReason.concat(values.writeReason))
      }else if(!!values.refuseReason){
        reasons=values.refuseReason;
      }else if(!!values.writeReason){
        reasons=values.writeReason;
      }else{
        return message.error('请选择或者输入理由');
      }
      dispatch({
        type:'advisorRegisterDetail/submitRefuse',
        payload:{
          id:id,
          result:'审核失败',
          reasons:reasons,
        }
      })
    })
    resetFields();
  }
  const refuseCancel=()=>{
    dispatch({
      type:'advisorRegisterDetail/initailSuccess',
      payload:{refuseModal:false}
    })
    resetFields();
  }
  const goBack=()=>{
    dispatch(routerRedux.goBack());
  }
  const watchClickBigImg=()=>{
    dispatch({
      type:'advisorRegisterDetail/initailSuccess',
      payload:{
        watchBigStatus:true,
      }
    })
  }
  const watchBigStatusCancel=()=>{
    dispatch({
      type:'advisorRegisterDetail/initailSuccess',
      payload:{
        watchBigStatus:false,
      }
    })
  }
  return (
    <div>
      <DxPanel title='审核信息'>
        <div>
          {auditStatus=='审核失败'?
            <div>
              <p>审核状态：<span className='pColor'>{auditStatus}</span></p>
              <p>失败原因：<span className='pColor'>{reasons}</span></p>
              <p>审核时间：{auditTime}</p>
              <p>审核人员：{auditUserName}</p>
            </div>
          :<p>审核状态：<span>{auditStatus}</span></p>}
        </div>
      </DxPanel>
      <DxPanel title='注册信息'>
        <p>注册时间：{createDateTime}</p>
        <p>手机号码：{phoneNumber}</p>
        <p>企业名称：{companyName}</p>
        <p>企业法人：{corporation}</p>
        <p>营业执照编号：{licenseNumber}</p>
        <div>
          <p>营业执照附件：</p>
          <span className='picShow' onClick={watchClickBigImg} style={{backgroundImage:`URL(${licensePic})`}}></span>
          {/*<p className='watchClickImg' onClick={watchClickBigImg}>点击查看大图</p>*/}
        </div>
        <div>
          {(auditStatus=='待审核')?
          <div>
            <Button type='primary' onClick={passClick}>通过</Button>
            <Button type='ghost' onClick={refuseClick}>拒绝</Button>
          </div>:''}
        </div>
        <Modal title='拒绝原因' visible={refuseModal}
          onCancel={refuseCancel} onOk={refuseOk}
        >
          <Form>
            <FormItem
              label='拒绝原因'
            >
              {getFieldDecorator('refuseReason', {
              })(
                <CheckboxGroup options={plainOptions}/>
              )}
            </FormItem>
            <FormItem
            >
              {getFieldDecorator('writeReason', {
              })(
                <Input type="textarea" placeholder="请输入拒绝原因，20字以内" autosize={{ minRows: 2, maxRows: 6 }} />
              )}
            </FormItem>
          </Form>
        </Modal>
        <Modal title='查看大图' visible={watchBigStatus}
          footer={null}
          onCancel={watchBigStatusCancel}>
          <span className='picBigShow' style={{backgroundImage:`URL(${licensePic})`}}></span>
        </Modal>
      </DxPanel>
      <Button type='ghost' onClick={goBack}>返回</Button>
    </div>
  );
}

function mapStateToProps({advisorRegisterDetail}) {
  return {advisorRegisterDetail}
}

export default connect(mapStateToProps)(Form.create()(AdvisorRegisterDetail));
