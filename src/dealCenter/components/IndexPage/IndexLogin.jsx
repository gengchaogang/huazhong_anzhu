import React, { PropTypes } from 'react'
import { Menu, Icon } from 'antd'
import { Link } from 'react-router'
import './IndexLogin.css'

function IndexLogin({address,department,ip,loginName,lastLoginTime,position}){
  return(
    <div className='indexLogin'>
      <p className='indexLogin_address'>{address}</p>
      <p className='indexLogin_department'>
        {`当前账号：${loginName}  部门：${department}  职位：${position}`}
      </p>
      <p className='indexLogin_ip'>
        {`上次登录时间：${lastLoginTime}  登录IP：${ip}`}
      </p>
    </div>
  )
}
// function mapStateToProps({ }) {
//   return {  }
// }

export default IndexLogin
