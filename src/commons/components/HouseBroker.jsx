
import React, { PropTypes } from 'react'
import textPic from '../assets/yay.jpg'
import './HouseBroker.css'

function HouseBroker({brokerName,brokerNumber}){
  return(
    <div>
      <div className='takeLookingAtBroker' style={{backgroundImage:`URL(${textPic})`}}></div>
      <div className='takeLookingMainInformation'>
        <div>姓名：{brokerName}</div>
        <div>联系电话：{brokerNumber}</div>
      </div>
    </div>
  )
}
HouseBroker.propTypes={
  brokerName:PropTypes.string.isRequired,
  brokerNumber:PropTypes.number.isRequired,
}
export default HouseBroker
