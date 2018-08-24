import React, { PropTypes } from 'react'
import { Menu, Icon } from 'antd'
import { Link } from 'react-router'
import logo from '../../assets/navBarImgs/logo_2.png'
import './NavMenu.css'

const SubMenu = Menu.SubMenu
const MenuItem = Menu.Item

const NavMenu = ({ menus, onSelectCallBack, selectKeys, openKeys, openChange }) => {
  // function menuClickHandle(item,key,selectKeys) {
  //   updateNavPath(item.keyPath, item.key)
  // }
  const menuNode = menus.map((item) => {
    if (item.child) {
      return (
        <SubMenu key={item.key} title={
          <span className="anzhu_menu_title">
            <span className='anzhu_menu_icon_mentor' style={{ backgroundImage: `URL(${item.icon})` }}></span>
            {item.title}
          </span>}
        >
          {item.child.map((ti) => {
            return (<MenuItem key={ti.key}>{ti.title}</MenuItem>)
          })}
        </SubMenu>
      )
    } else {
      return (
        <MenuItem key={item.key}>
          <span className="anzhu_menu_title">
            <span className='anzhu_menu_icon_mentor' style={{ backgroundImage: `URL(${item.icon})` }}>
            </span>
            {item.title}
          </span>
        </MenuItem>
      )
    }
  })
  const onSelect = (item) => {
    onSelectCallBack(item.selectedKeys)
  };
  return (
    <aside className='ant-layout-sider'>
      <div className='ant-layout-logo-mentor' style={{ backgroundImage: `URL(${logo})` }}></div>
      <Menu mode='inline'
        theme='dark'
        defaultSelectedKeys={['/']}
        onSelect={onSelect}
        selectedKeys={selectKeys}
        openKeys={openKeys}
        onOpenChange={openChange}
      >
        {menuNode}
      </Menu>
    </aside>
  )
}
// onClick={menuClickHandle}
NavMenu.propTypes = {
  menus: PropTypes.array,
  // updateNavPath: PropTypes.func
}

export default NavMenu
