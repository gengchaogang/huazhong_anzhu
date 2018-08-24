import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import {message,Table, Icon, Button,Modal,Checkbox,Input,Form,InputNumber}from 'antd'
import './AdvisorIdDetail.css';
import DxPanel from '../../../commons/components/DxPanel'
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow'

import defaultLogo from '../../assets/images/img1.jpg'
import notexist from '../../assets/images/notexist.png'

const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const plainOptions = ['违规操作', '非法信息', '其他'];
const options = [
  { label: '违规操作', value: '违规操作' },
  { label: '非法信息', value: '非法信息' },
  { label: '其他', value: '其他' },
];
function AdvisorIdDetail({dispatch,advisorIdDetail,form}) {
  if(!advisorIdDetail.data){
    return (<DxLoadingShadow visible={false} zIndex={1001}/>)
  }
  const {freezeObj,loading,zhanghaoJieDongStatus,dongJieZhaoHaoStatus}=advisorIdDetail;
  const {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }=form;
  const checkBigPhoto=()=>{
    dispatch({
      type:'advisorIdDetail/advisorIdDetailShowModal'
    })
  }
  const handleOk=()=>{
    dispatch({
      type:'advisorIdDetail/advisorIdDetailHandleOk'
    })
  }
  const handleCancel=()=>{
    dispatch({
      type:'advisorIdDetail/advisorIdDetailHandleCancel'
    })
  }
  const zhanghaoJieDongClick=()=>{
    dispatch({
      type:'advisorIdDetail/zhanghaoJieDongClick'
    })
  }
  const zhanghaoJieDongHandleOk=()=>{
    dispatch({
      type:'advisorIdDetail/tryUnFreeze'
    })
  }
  const zhanghaoJieDongHandleCancel=()=>{
    dispatch({
      type:'advisorIdDetail/zhanghaoJieDongHandleCancel'
    })
  }
  const dongjieReasonClick=()=>{
    dispatch({
      type:'advisorIdDetail/dongjieReasonClick'
    })
  }
  const dongjieReasonHandleOk=()=>{
    // dispatch({
    //   type:'advisorIdDetail/dongjieReasonHandleOk'
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
  			type:'advisorIdDetail/tryFreeze',
        payload: {reason: reason, blockDays:values.blockDays, checkReasons: checkReasons, inputReason: inputReason}
  		})
		});
    form.resetFields();
  }
  const dongjieReasonHandleCancel=()=>{
    dispatch({
      type:'advisorIdDetail/dongjieReasonHandleCancel'
    });
		form.resetFields();
  }
  const zhangHaoDongJieOnChange=(checkedValues)=>{
    console.log('checked = ', checkedValues);
  }
  const goBack=()=>{
      dispatch(routerRedux.goBack());
  }
	return(
		<div className="brokerIdDetail">
			<DxPanel title='帐号信息'>
        <div>
          <span className='leftWords'>帐号：</span>
          <span>{advisorIdDetail.data.accountInfo.loginName}</span>
        </div>
        <div>
          <span className='leftWords'>状态：</span>
          {advisorIdDetail.data.accountInfo.status=='冻结'?
            <span className='statusColor'>
              {advisorIdDetail.data.accountInfo.status}
            </span>:
            <span>
              {advisorIdDetail.data.accountInfo.status}
            </span>
          }
        </div>
        <div>
          <span className='leftWords'>上次登录时间：</span>
          <span>{advisorIdDetail.data.accountInfo.lastLoginDateTime}</span>
        </div>
        <div>
          <span className='leftWords'>登录IP：</span>
          <span>{advisorIdDetail.data.accountInfo.lastLoginAddress}</span>
        </div>
        <div>
          <span className='leftWords'>注册时间：</span>
          <span>{advisorIdDetail.data.accountInfo.createDateTime}</span>
        </div>
        <div>
          <span className='leftWords'>审核时间：</span>
          <span>{advisorIdDetail.data.accountInfo.auditTime}</span>
        </div>
        <div>
          <span className='leftWords'>审核人员：</span>
          <span>运营中心 {advisorIdDetail.data.accountInfo.auditUserName}</span>
        </div>
			</DxPanel>
			<DxPanel title='导师信息'>
        <div className='qiyeLogo' style={{backgroundImage:`URL(${advisorIdDetail.data.tutorInfo.logo||defaultLogo})`}}></div>
        <div>
          <span className='leftWords'>企业名称：</span>
          <span>{advisorIdDetail.data.tutorInfo.companyName}</span>
        </div>
        <div>
          <span className='leftWords'>企业法人：</span>
          <span>{advisorIdDetail.data.tutorInfo.corporation}</span>
        </div>
        <div>
          <span className='leftWords'>营业执照编号：</span>
          <span>{advisorIdDetail.data.tutorInfo.licenseNumber}</span>
        </div>
        <div>
          <div onClick={checkBigPhoto} className='yinyezhizhao' style={{backgroundImage:`URL(${advisorIdDetail.data.tutorInfo.licensePic||notexist})`}}></div>
          {/*<span className='checkClick' onClick={checkBigPhoto}>点击查看大图</span>*/}
        </div>
      </DxPanel>
			{advisorIdDetail.data.accountInfo.status=='冻结'?<DxPanel title='冻结信息'>
        <div>
          <span>冻结时间：</span>
          <span>{advisorIdDetail.data.blockedInfo.blockDateTime}</span>
        </div>
        <div>
          <span>冻结时长：</span>
          <span>{advisorIdDetail.data.blockedInfo.blockDays}天</span>
        </div>
        <div>
          <span>冻结原因：</span>
          <span>{(advisorIdDetail.data.blockedInfo.reasons||[]).join("、")}</span>
        </div>
        <div>
          <span>操作人员：</span>
          <span>运营中心 {advisorIdDetail.data.blockedInfo.optUserName}</span>
        </div>
			</DxPanel>:''}
      <div className='buttonJiedong'>
        {advisorIdDetail.data.accountInfo.status=='冻结'?
          <div>
            <Button type='primary' onClick={zhanghaoJieDongClick}>账号解冻</Button>
            <Button type='ghost' onClick={goBack}>返回</Button>
          </div>:
          <div>
            <Button type='primary' onClick={dongjieReasonClick}>冻结账号</Button>
            <Button type='ghost' onClick={goBack}>返回</Button>
          </div>
        }
      </div>
      <Modal title="查看大图" visible={advisorIdDetail.shawMadolStatus}
        onOk={handleOk} onCancel={handleCancel}
        footer={null}
        >
        <div className='yinyezhizhaoBig' style={{backgroundImage:`URL(${advisorIdDetail.data.tutorInfo.licensePic||notexist})`}}></div>
      </Modal>
      <Modal title="提示" visible={advisorIdDetail.zhanghaoJieDongClickStatus}
        onOk={zhanghaoJieDongHandleOk} onCancel={zhanghaoJieDongHandleCancel}
        >
        <p>提示确认要进行解冻操作吗？</p>
      </Modal>
      <Modal title="冻结原因" visible={advisorIdDetail.dongjieReasonStatus}
        onOk={dongjieReasonHandleOk} onCancel={dongjieReasonHandleCancel}
        >
        <Form inline style={{margin:'20px 0'}}>
          <FormItem
            label='冻结天数'
          >
          {getFieldDecorator('blockDays', {
            initialValue: freezeObj.blockDays||1,
            rules: [
                { type:'number',min:1, message: '输入内容非法',minMessage:"sdf" },
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
              <CheckboxGroup options={plainOptions}/>
            )}
          </FormItem>
          <div className='textareaReason'>
            <FormItem>
              {getFieldDecorator('inputReason', {
                initialValue: freezeObj.inputReason,
              })(
                <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
              )}
            </FormItem>
          </div>
        </Form>
      </Modal>
      <DxLoadingShadow visible={loading} zIndex={1001}/>
		</div>
	)
}


AdvisorIdDetail.propTypes = {

};
function mapStateToProps({advisorIdDetail }) {
	return { advisorIdDetail }
}

export default connect(mapStateToProps)(Form.create()(AdvisorIdDetail))
