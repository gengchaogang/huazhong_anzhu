import React, { PropTypes } from 'react'
import { Icon } from 'antd'
import './Notification.css'
// import labaSvg from '../assets/images/xiaolaba.svg'

const Notification = ({content,timestamp,clickCallBack,className}) => {
  return (
    <div className={`dx-notification ${className?className:''}` }onClick={clickCallBack}>
      <b className={`${className?className:'centerPic'} dx-notification-icon`}></b>
      <span className='dx-notification-content'>{content}</span>
      <span className='dx-notification-time'>{timestamp}</span>
    </div>
  )
}

Notification.propTypes = {
  content:PropTypes.string.isRequired,
  timestamp:PropTypes.string.isRequired,
}

export default Notification
