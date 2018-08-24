import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { Table,Button,Modal,Form,Input,Checkbox,Row,Col} from 'antd';
import regionalism from '../../../commons/assets/areas.json';
import { routerRedux } from 'dva/router';
import './AgentIdDetail.css'
import DxPanel from '../../../commons/components/DxPanel'
import notexist from '../../assets/images/notexist.png'
function AgentIdDetail({dispatch,agentIdDetail}) {
  const {
    id,
		address,
		businessLicense,
		businessLicenseCode,
		city,
		createTime,
		currentUser,
		freezingTime,
		legalPerson,
		loginAddress,
		loginDateTime,
		loginName,
		name,
		optReason,
		phoneNumber,
		principal,
		status,
    watchBigImgStatus,
  }=agentIdDetail;
  //查看大图
  const watchBigImgClick=()=>{
    dispatch({
      type:'agentIdDetail/querySuccess',
      payload:{watchBigImgStatus:true}
    })
  }
  //关闭查看大图模态框
  const watchBigImgCancel=()=>{
    dispatch({
      type:'agentIdDetail/querySuccess',
      payload:{watchBigImgStatus:false}
    })
  }
  //删除
  const deletDetail=()=>{
    Modal.confirm({
	    title: '提示',
	    content: '确认要删除？',
	    onOk() {
				dispatch({type:'agentIdDetail/deletDetail',payload:{id:id}})
	    },
	    onCancel() {},
	  });
  }
  //重置密码
  const resetPassword=()=>{
    Modal.confirm({
	    title: '提示',
	    content: '确认要删除？',
	    onOk() {
				dispatch({type:'agentIdDetail/resetPassword',payload:{id:id}})
	    },
	    onCancel() {},
	  });
  }
	return(
		<div>
			<DxPanel title='帐号信息'>
        <p className='feedbackP'>帐号：{loginName}</p>
        <p className='feedbackP'>状态：{status}</p>
        <p className='feedbackP'>上次登录：{loginDateTime}</p>
        <p className='feedbackP'>登录IP：{loginAddress}</p>
        <p className='feedbackP'>开通时间：{createTime}</p>
        <p className='feedbackP'>操作人员：{currentUser}</p>
      </DxPanel>
      <DxPanel title='代理商信息'>
        <p className='feedbackP'>企业名称：{name}</p>
        <p className='feedbackP'>法人代表：{legalPerson}</p>
        <p className='feedbackP'>所在城市：{city}</p>
        <p className='feedbackP'>详细地址：{address}</p>
        <p className='feedbackP'>营业执照编号：{businessLicenseCode}</p>
        <div>
          {!!businessLicense?
            <div>
              <span span={8} style={{backgroundImage:`URL(${businessLicense})`}}
                onClick={watchBigImgClick}  className='feedbackUrl'>
              </span>
              {/*<span className='watchBigImg' onClick={watchBigImgClick}>点击查看大图
            </span>*/}
            </div>
            :<div>
            <span span={8} style={{backgroundImage:`URL(${notexist})`}}
              className='feedbackUrl'>
            </span>
          </div>}
        </div>
        <p className='feedbackP'>负责人：{principal}</p>
        <p className='feedbackP'>手机号码：{phoneNumber}</p>
      </DxPanel>
      <div className='groupButton'>
        <Button type='primary' onClick={resetPassword}>重置密码</Button>
        <Button type='primary'>编辑</Button>
        <Button type='primary' onClick={deletDetail}>删除</Button>
        <Button type='ghost' onClick={()=>{dispatch(routerRedux.goBack())}}>返回</Button>
      </div>
      {/*查看大图的模态框*/}
      <Modal visible={watchBigImgStatus}
        onCancel={watchBigImgCancel}
        wrapClassName='watchBigImgWrap'
      >
        <span span={8} style={{backgroundImage:`URL(${businessLicense})`}}
          className='watchfeedbackUrl'>
        </span>
      </Modal>
		</div>
	)
}


AgentIdDetail.propTypes = {

};
function mapStateToProps({ agentIdDetail }) {
	return { agentIdDetail }
}

export default connect(mapStateToProps)(AgentIdDetail)
