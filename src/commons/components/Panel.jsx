import React, { PropTypes } from 'react'
import { Icon } from 'antd'
import './panel.css'

const Panel = ({title,className}) => {
  return (
    <div className={`panel ${className?className:''}`}>
      <div className='panel-title-box'>
        <span className='panel-title'>
          {title}
        </span>
      </div>
    </div>
  )
}

Panel.propTypes = {
  title:PropTypes.oneOfType([PropTypes.element,PropTypes.string]).isRequired,
}

export default Panel
