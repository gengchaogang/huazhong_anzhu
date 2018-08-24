import React, { PropTypes } from 'react'
import { Menu, Icon,Popover,Button ,Tooltip,Badge} from 'antd'

import Notification from '../../../commons/components/Notification'

import './Header.css'
// const SubMenu = Menu.SubMenu

const Header = ({notification,msgInfo,logout,userInfo,doAccountManagement,msgNumber,indexClick}) => {
  const content = (
  <div className='popoverHover'>
    <p className='popoverPersonal' onClick={doAccountManagement}>账号设置</p>
    <p className='popoverPersonal' onClick={logout}>注销登录</p>
  </div>
  );
  return (
    <div className='ant-layout-header'>
      <Notification {...notification} clickCallBack={msgInfo}/>
      <div className='dx-layout-information'>
        <div className='anzhu_header_index' onClick={indexClick}>
          <i className='centerPic anzhu_header_index_icon'></i>
          首页
        </div>
        <div className='index-information'>
          <Badge count={msgNumber} onClick={msgInfo}><span className='head-example ' onClick={msgInfo}><i className='centerPic anzhu_header_msg'></i>消息</span></Badge></div>
        <Tooltip placement="bottom" title={content} overlayClassName='userPopover'>
          <div className='poverUserButton'>
            <i className='centerPic anzhu_header_user_icon'></i>
            {!!userInfo?JSON.parse(userInfo).name:'-'}
          </div>
        </Tooltip>
      </div>
    </div>
  )
}

Header.propTypes = {
}

export default Header
