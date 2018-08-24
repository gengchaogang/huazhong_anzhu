import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import {Button,Radio,Tabs,DatePicker,Form,Input,Modal,message}from 'antd'
import './AgentSettlement.css';
import DxUpLoadPic from '../../../commons/View/DxUpLoadPic'
import DxPanel from '../../../commons/components/DxPanel'
const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group
const { MonthPicker, RangePicker } = DatePicker;
function AgentSettlement({dispatch,form,agentSettlement}) {
	const {
		amount,
		canAmount,
		comanyName,
		id,
		loginName,
		payType,
		money,
		showPicList,
	}=agentSettlement;
	const shopsUplod={
    url:'/miss-anzhu-aliyun-file/putfile',
    maxNum:1,//最大上传数
    maxSize:1,//文件大小限值
    showPicList:showPicList,//state管理图片list
    doCover:true,
    changeList:(data)=>{
      dispatch({
        type:'agentSettlement/initialSuccess',
        payload:data
      })
    },//更新list回调
  }
	const goback=()=>{
    dispatch(routerRedux.goBack());
  }
	//确认结算
	const established=()=>{
		Modal.confirm({
			title: '提示',
	    content: '确认要结算此账户吗？',
	    onOk() {
				if(money=='' || money=='0' ||(showPicList.length==0)){
					message.error('金额必须大于0,且电子凭证必传')
					return
				}
	      dispatch({
					type:'agentSettlement/established',
					payload:{
						id:id,
						money:money,
						credentialsPath:showPicList[0].id
					}
				})
	    },
	    onCancel() {
	      console.log('Cancel');
	    },
		})
	}
	const getNumber=(e)=>{
		console.log(e.target.value);
		dispatch({
			type:'agentSettlement/initialSuccess',
			payload:{
				id:id,
				money:e.target.value
			}
		})
	}
	return(
		<div>
		  <DxPanel title='帐号信息'>
        <p>帐号：{loginName}</p>
        <p>企业名称：{comanyName}</p>
      </DxPanel>
      <DxPanel title='账户余额'>
        <p>账户余额 {amount}元</p>
      </DxPanel>
      <DxPanel title='结算信息'>
				<span>转出金额</span>
        <div className='input'>
          <Input type='number' onBlur={(e)=>{getNumber(e)}}/>
        </div>
				<p>最多可转出{canAmount}元</p>
				<p>结算方式 {payType}</p>
				<p className='gray'>到账时间请以银行为准</p>
				<div>
					电子凭证
					<div className='uploadParent'>
	          <DxUpLoadPic {...shopsUplod}/>
	        </div>
				</div>
      </DxPanel>
			<Button type='primary' onClick={established}>确认结算</Button>
      <Button type='ghost' onClick={goback}>返回</Button>
		</div>
	)
}


AgentSettlement.propTypes = {

};
function mapStateToProps({agentSettlement }) {
	return { agentSettlement }
}

export default connect(mapStateToProps)(Form.create()(AgentSettlement))
