import React, { PropTypes } from 'react'
import { Menu, Icon,Popover,Button ,Tooltip,Badge} from 'antd'

import Notification from '../../../commons/components/Notification'

import './Header.css'
// const SubMenu = Menu.SubMenu

const Header = ({notification,logout,userInfo,setting,msgInfo,msgNumber,toIndex}) => {
  console.log('msgNumber',msgNumber);
  function handleClick(item) {
    console.log(item.keyPath);
  }
  const content = (
  <div className='popoverHover'>
    <p className='popoverPersonal' onClick={setting}>账号设置</p>
    <p className='popoverPersonal' onClick={logout}>注销登录</p>
  </div>
  );
  return (
    <div className='ant-layout-header'>
      <Notification {...notification} clickCallBack={msgInfo}/>
      <div className='dx-layout-information'>
        <div className='index-information' onClick={toIndex}>首页</div>
        <div className='index-information'>
          <Badge count={msgNumber} onClick={msgInfo}><span className='head-example' onClick={msgInfo}>消息</span></Badge>
        </div>
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
