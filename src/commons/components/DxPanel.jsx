import React, { PropTypes } from 'react'
import { Icon } from 'antd'
import './DxPanel.css'

const DxPanel = ({children,title,footer,className}) => {
  return (
    <div className={`dx-panel ${className?className:''}`}>
      <div className='dx-panel-title-box'>
        <span className='dx-panel-title'>
          {title}
        </span>
      </div>
      <div className={`dx-panel-content ${!!footer?'dx-panel-hasfooter-content':'dx-panel-nofooter-content'}`}>
        {children}
      </div>
      <div className={`dx-panel-footer ${!!footer?'dx-panel-hasfooter-footer':'dx-panel-nofooter-footer'}`}>
        {footer}
      </div>
    </div>
  )
}

DxPanel.propTypes = {
  children:PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element),PropTypes.element]),
  footer:PropTypes.element,
  title:PropTypes.oneOfType([PropTypes.element,PropTypes.string]).isRequired,
}

export default DxPanel
