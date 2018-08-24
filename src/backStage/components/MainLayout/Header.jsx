import React, { PropTypes } from 'react'
import { Menu, Icon,Popover,Button ,Tooltip} from 'antd'

import Notification from '../../../commons/components/Notification'

import './Header.css'
// const SubMenu = Menu.SubMenu

const Header = ({notification,logout,userInfo}) => {
  // console.log(userInfo,'userInfouserInfo');
  const content = (
  <div className='popoverHover'>
    <p className='personInfo'>{!!userInfo?JSON.parse(userInfo).name:''}</p>
    <p className='personInfo'>上次登录：{!!userInfo?JSON.parse(userInfo).loginDateTime:''}</p>
    <p className='personInfo'>登录IP：{!!userInfo?JSON.parse(userInfo).loginAddress:''}</p>
    <p className='popoverPersonal' onClick={logout}>注销登录</p>
  </div>
  );
  return (
    <div className='ant-layout-header'>
      <Notification {...notification}/>
      <div className='dx-layout-information'>
        <div className='index-information'>首页</div>
        {/*<div className='index-information'>消息</div>*/}
        <Tooltip placement="bottom" title={content} overlayClassName='userPopover'>
          <div className='poverUserButton'>{!!userInfo?JSON.parse(userInfo).name:'未登录'}</div>
        </Tooltip>
      </div>
    </div>
  )
}

Header.propTypes = {
}

export default Header
