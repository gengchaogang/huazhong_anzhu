// PictueBtn
/*
*上面是图片，下面是文字，整体绑点击事件
*/
import React, { PropTypes } from 'react'
import './PictureBtn.css'

function PictureBtn({title,pic,clickFuc,bid}){
  const onHandleClick=(e)=>{
    clickFuc(e,bid)
  }
  return(
    <div className='dx-pictuebtn' onClick={onHandleClick}>
      <div className='dx-pictuebtn-pic' style={{backgroundImage:`URL(${pic})`}}></div>
      <span className='dx-pictuebtn-title'>{title}</span>
    </div>
  )
}
PictureBtn.propTypes={
  title:PropTypes.string.isRequired,
  pic:PropTypes.string.isRequired,
  bid:PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  clickFuc:PropTypes.func.isRequired,
}
export default PictureBtn
