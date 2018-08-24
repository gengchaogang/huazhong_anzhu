import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import {message,Table, Icon, Button,Modal,Checkbox,Input,Form,InputNumber}from 'antd'
import './brokerIdDetail.css';
import DxPanel from '../../../commons/components/DxPanel'
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow'

import defaultBrokerLogo from '../../assets/images/img1.jpg'
import notexist from '../../assets/images/notexist.png'

const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const plainOptions = ['违规操作', '非法信息', '其他'];
const options = [
  { label: '违规操作', value: '违规操作' },
  { label: '非法信息', value: '非法信息' },
  { label: '其他', value: '其他' },
];
function BrokerIdDetail({dispatch,brokerIdDetail,form}) {
	const {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }=form;
	const {freezeObj,loading,zhanghaoJieDongStatus,dongJieZhaoHaoStatus}=brokerIdDetail;
  if(!brokerIdDetail.data){
    return (<DxLoadingShadow visible={true}/>)
  }

	const zhanghaoJieDongHandleOk=()=>{
		dispatch({
			type:'brokerIdDetail/tryUnFreeze'
		})
	}
	const zhanghaoJieDongHandleCancel=()=>{
		dispatch({
			type:'brokerIdDetail/zhanghaoJieDongHandleCancel'
		})
	}
	const dongJieZhaoHaoHandleOk=()=>{
		// dispatch({
		// 	type:'brokerIdDetail/dongJieZhaoHaoHandleOk'
		// })
		form.validateFields((err, values) => {
			console.log('Received values of form: ', values);
			if (err) {
				return;
			}
      let reason=[],checkReasons,inputReason;
      if(values.checkReasons){
        checkReasons = values.checkReasons.slice(0);
        for(let i=0; i<checkReasons.length; i++){
          if(checkReasons[i] != "其他"){
            reason.push(checkReasons[i]);
          }
        }
      }else{
        checkReasons = [];
      }
      inputReason = values.inputReason;
      if(inputReason){
        reason.push(inputReason);
      }
      if(!reason.length){
        message.info('请选择或填写冻结原因！',6);
        return;
      }
      dispatch({
  			type:'brokerIdDetail/tryFreeze',
        payload: {reason: reason, blockDays:values.blockDays, checkReasons: checkReasons, inputReason: inputReason}
  		})
		});

    form.resetFields();
	}
	const dongJieZhaoHaoHandleCancel=()=>{
		dispatch({
			type:'brokerIdDetail/dongJieZhaoHaoHandleCancel'
		})
		form.resetFields();
	}
	const onChange=(checkedValues)=>{
  	console.log('checked = ', checkedValues);
	}
  const otherReasonChange=(v, e)=>{
    console.log("otherReasonChange>",e);
  };
	return(
		<div className="brokerIdDetail">
			<DxPanel title='帐号信息'>
				<div>
					<span>帐号：</span>
					<span>{brokerIdDetail.data.loginName}</span>
				</div>
				<div>
					<span>状态：</span>
					{brokerIdDetail.data.status=='冻结'?
            <span className='statusColor'>
              冻结
            </span>:
            <span>
              {brokerIdDetail.data.status}
            </span>
          }
				</div>
				<div>
					<span>注册时间：</span>
					<span>{brokerIdDetail.data.createTime}</span>
				</div>
				<div>
					<span>上次登录：</span>
					<span>{brokerIdDetail.data.lastLoginDateTime}</span>
				</div>
				<div>
					<span>登录IP：</span>
					<span>{brokerIdDetail.data.loginIp}</span>
				</div>
			</DxPanel>
			<DxPanel title='经纪人信息'>
				<div className='jinjirenImg' style={{backgroundImage:`URL(${brokerIdDetail.data.logo||defaultBrokerLogo})`}}></div>
				<div className='xinxiMiaoShu'>
					<p>姓名：{brokerIdDetail.data.name}</p>
					<p>地区：{(brokerIdDetail.data.cityNames||"").replace(/\//g,'-').replace(/^-/,"")}</p>
				</div>
			</DxPanel>
			<DxPanel title='实名认证'>
				{brokerIdDetail.data.realNameCertifiedState!='已认证'?<div>
					<p>真实姓名：</p>
					<p>身份证号码：</p>
          <div className='iDCardImg' style={{backgroundImage:`URL(${brokerIdDetail.data.realNameAuthentication.pic1||notexist})`}}></div>
				</div>:
				<div>
					<div>
						<span>认证时间：</span>
						<span>{brokerIdDetail.data.realNameAuthentication.auditDateTime}</span>
					</div>
					<div>
						<span>真实姓名：</span>
						<span>{brokerIdDetail.data.realNameAuthentication.realName}</span>
					</div>
					<div>
						<span>身份证号码：</span>
						<span>{brokerIdDetail.data.realNameAuthentication.idNumber}</span>
					</div>
          {brokerIdDetail.data.realNameAuthentication.pic1 ? <div className='iDCardImg' style={{backgroundImage:`URL(${brokerIdDetail.data.realNameAuthentication.pic1})`}}></div> : ''}
          {brokerIdDetail.data.realNameAuthentication.pic2 ? <div className='iDCardImg' style={{backgroundImage:`URL(${brokerIdDetail.data.realNameAuthentication.pic2})`}}></div> : ''}
          {brokerIdDetail.data.realNameAuthentication.pic3 ? <div className='iDCardImg' style={{backgroundImage:`URL(${brokerIdDetail.data.realNameAuthentication.pic3})`}}></div> : ''}
				</div>}
			</DxPanel>
			{/*<DxPanel title='职业认证'>
				{brokerIdDetail.data.certificationRofessionalState!='已认证'?<div>
					<p>证书编号：</p>
          <div className='iDCardImg' style={{backgroundImage:`URL(${notexist})`}}></div>
				</div>:
				<div>
					<div>
						<span>认证时间：</span>
						<span>{brokerIdDetail.data.professionalCertification.auditDateTime}</span>
					</div>
					<div>
						<span>证书编号：</span>
						<span>{brokerIdDetail.data.professionalCertification.certificateNumber}</span>
					</div>
          {brokerIdDetail.data.professionalCertification.certificatePic?
            <div className='iDCardImg' style={{backgroundImage:`URL(${brokerIdDetail.data.professionalCertification.certificatePic||notexist})`}}></div>:
            <div className='iDCardImg'></div>
          }
				</div>}
			</DxPanel>*/}
			{brokerIdDetail.data.status=='冻结'?<DxPanel title='冻结信息'>
				<div>
					<span>冻结时间：</span>
					<span>{brokerIdDetail.data.blockedInfo.optTime}</span>
				</div>
				<div>
					<span>冻结时长：</span>
					<span>{brokerIdDetail.data.blockedInfo.blockDays}天</span>
				</div>
				<div>
					<span>冻结原因：</span>
					<span>
            {brokerIdDetail.data.blockedInfo.reason
            }
          </span>
				</div>
				<div>
					<span>操作人员：</span>
					<span>{brokerIdDetail.data.blockedInfo.optUser}</span>
				</div>
			</DxPanel>:''}
			<div className='groupButton'>
				{brokerIdDetail.data.status=='冻结'?
          <Button type='primary' onClick={()=>{dispatch({type:'brokerIdDetail/zhanghaoJieDongClick'})}}>账号解冻</Button>:
          <Button type='primary' onClick={()=>{dispatch({type:'brokerIdDetail/dongJieZhaoHaoClick'})}}>冻结账号</Button>
        }
				<Button type='ghost' onClick={()=>{dispatch(routerRedux.goBack())}}>返回</Button>
			</div>
			{/*以下为账号解冻的模态框*/}
			<Modal title="提示" visible={zhanghaoJieDongStatus}
          onOk={zhanghaoJieDongHandleOk} onCancel={zhanghaoJieDongHandleCancel}
        >
          <p>确认要进行解冻操作吗？</p>
      </Modal>
			{/*以下为冻结账号的模态框*/}
			<Modal title="冻结原因" visible={dongJieZhaoHaoStatus}
          onOk={dongJieZhaoHaoHandleOk} onCancel={dongJieZhaoHaoHandleCancel}
        >
				<Form inline style={{margin:'20px 0'}}>
          <FormItem
            label='冻结天数'
          >
          {getFieldDecorator('blockDays', {
            initialValue: freezeObj.blockDays||1,
            rules: [
                { type:'number',min:1, message: '输入内容非法',minMessage:'必填' },
              ],
          })(
            <InputNumber placeholder='请输入冻结天数'/>
          )}
          </FormItem>
          <FormItem
            label="冻结原因"
          >
            {getFieldDecorator('checkReasons', {
              initialValue: freezeObj.checkReasons,
            })(
              <CheckboxGroup options={plainOptions} onChange={onChange} />
            )}
          </FormItem>
          <div className='textareaReason'>
            <FormItem>
              {getFieldDecorator('inputReason', {
                initialValue: freezeObj.inputReason,
              })(
                <Input type="textarea" onChange={otherReasonChange} autosize={{ minRows: 2, maxRows: 6 }} />
              )}
            </FormItem>
          </div>
        </Form>
      </Modal>
      <DxLoadingShadow visible={loading} zIndex={1001}/>
		</div>
	)
}


BrokerIdDetail.propTypes = {

};
function mapStateToProps({ brokerIdDetail }) {
	return { brokerIdDetail }
}

export default connect(mapStateToProps)(Form.create()(BrokerIdDetail))
