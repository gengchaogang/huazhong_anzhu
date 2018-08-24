import React, { PropTypes } from 'react'
import { Icon } from 'antd'
import './DxPanelMini.css'

const DxPanelMini = ({children,title,className,hasPadding=false}) => {
  return (
    <div className={`dx_panel_mini ${className?className:''} ${hasPadding?'dx_panel_mini_hasPadding':''}`}>
      <div className='dx_panel_mini_title_box'>
        <span className='dx_panel_mini_title'>
          {title}
        </span>
      </div>
      <div className='dx_panel_mini_content'>
        {children}
      </div>
    </div>
  )
}

DxPanelMini.propTypes = {
  children:PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element),PropTypes.element]),
  title:PropTypes.oneOfType([PropTypes.element,PropTypes.string]).isRequired,
}

export default DxPanelMini
