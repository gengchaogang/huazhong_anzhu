import React, { PropTypes } from 'react';
import {Modal}from 'antd'

import SearchInput from '../../../commons/View/SearchInput'
import BrokerInfoList from './BrokerInfoList'
import ClientInfoList from './ClientInfoList'
import './ChooseUserModal.css'


export default function ChooseUserModal({
  title,
  visible,
  onOk,
  onCancel,
  okText,
  cancelText,
  doSearch,
  userList,
  type,
  doSelectUser,
}){
  const modalOpts = {
    title:!!title?title:'选择经纪人',
    visible,
    onOk: onOk,
    okText:!!okText?okText:'选定',
    cancelText:!!cancelText?cancelText:'取消',
    onCancel:onCancel,
  };
  const userInfoListProps={
    listData:userList,
    doSelect:doSelectUser,
  }
  return (
    <Modal {...modalOpts} wrapClassName='chooseBrokerModal'>
      <SearchInput placeholder='请在此输入手机号' searchFuc={doSearch} buttonTitle='检索' type='button'/>
      {userList.length===0 && <p style={{textAlign:'center',fontSize:'14px'}}>请输入手机号检索已确看用户</p>}
      {type==='broker' && <BrokerInfoList {...userInfoListProps}/>}
      {type==='customer' && <ClientInfoList {...userInfoListProps}/>}
    </Modal>
  );
};
