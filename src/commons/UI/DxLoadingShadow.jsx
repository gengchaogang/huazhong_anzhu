import React, { PropTypes } from 'react'
import { Icon } from 'antd'
import './DxLoadingShadow.css'

const DxLoadingShadow=({visible,zIndex=5000,loadText})=>{
  return (
    <div className='dxLoadingShadow' style={{display:!!visible?'block':'none',zIndex:zIndex}}>
      <div className='dxLoadingShadow_content'>
        <Icon type='loading' />
        {!!loadText && <span className='dxLoadingShadow_title'>{loadText}</span>}
      </div>
    </div>
  );
}
DxLoadingShadow.propTypes={
  visible:PropTypes.bool.isRequired,
}
export default DxLoadingShadow;
