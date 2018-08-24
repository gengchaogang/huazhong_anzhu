import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import {Button,Modal,Input,message} from 'antd';
import DxPanel from '../../../../commons/components/DxPanel'
import './PlatformSettlement.css'
import DxUpLoadPic from '../../../../commons/View/DxUpLoadPic'
function PlatformSettlement({dispatch,platformSettlement}) {
  const {showPicList,
    amount,
    canAmount,
    comanyName,
    id,
    loginName,
    payType,
    money,
    organization,
  }=platformSettlement;
  // console.log(showPicList,'showPicList');
  const confirmSettlement=()=>{
    Modal.confirm({
      title: '提示',
      content: '确认要结算？',
      onOk() {
        if(money=='' || money=='0' ||(showPicList.length==0)){
					message.error('金额必须大于0,且电子凭证必传')
					return
				}
        dispatch({
          type:'platformSettlement/confirmSettlement',
          payload:{
            credentialsPath:(showPicList.length!=0?showPicList[0].id:''),
            money:money,
          }
        })
      },
      onCancel() {
        console.log('Cancel');
      },
    })
  }
  const shopsUplod={
    url:'/miss-anzhu-aliyun-file/putfile',
    maxNum:1,//最大上传数
    maxSize:2,//文件大小限值
    showPicList:showPicList,//state管理图片list
    doCover:true,
    changeList:(data)=>{
      dispatch({
        type:'platformSettlement/setState',
        payload:data
      })
    },//更新list回调
  }
  const goback=()=>{
    dispatch(routerRedux.goBack());
    dispatch({
			type:'platformSettlement/setState',
			payload:{
				showPicList:[],
			}
		})
  }
  const getNumber=(e)=>{
		dispatch({
			type:'platformSettlement/setState',
			payload:{
				money:e.target.value
			}
		})
	}
  return (
    <div>
      {/*<DxPanel title='企业信息'>
        <p>企业名称 {comanyName}</p>
      </DxPanel>
      <DxPanel title='结算银行卡'>
        <p>银行卡</p>
        <p>开户名 </p>
      </DxPanel>*/}
      <DxPanel title='账户余额'>
        <p>账户余额 {amount||0}元</p>
        <p>可结算余额 {canAmount||0}元</p>
      </DxPanel>
      <DxPanel title='结算信息'>
        <span>转出金额</span>
        <div className='input'>
          <Input type='number' onBlur={(e)=>{getNumber(e)}}/>
        </div>
        {/*<div>服务费<span className='margin spancolor'>100元</span></div>
        <p className='margin'>* 第三方收取单笔服务费xx%</p>*/}
        <p className='margin'>结算机构 {organization}</p>
        <p className='margin'>结算方式 {payType}</p>
        <p className='margin gary'>注：到账时间请以结算机构和银行为准</p>
        <div>
					电子凭证
					<div className='uploadParent'>
	          <DxUpLoadPic {...shopsUplod}/>
	        </div>
				</div>
      </DxPanel>
      <Button type='primary' onClick={confirmSettlement}>确认结算</Button>
      <Button type='ghost' onClick={goback}>返回</Button>
    </div>
  );
}

function mapStateToProps({platformSettlement}) {
  return {platformSettlement }
}

export default connect(mapStateToProps)(PlatformSettlement);
