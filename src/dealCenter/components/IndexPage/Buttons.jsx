import React, { PropTypes } from 'react'
import { Menu, Icon,Card } from 'antd'
import { Link } from 'react-router'
import './Buttons.css'

function Buttons({clickButtons,buttonsData,buttonWord}){

  return(
    <Card className='cardMain anhzu_card' onClick={clickButtons}>
      <p className='cardNumber'>{buttonsData}</p>
      <p className='cardWord'>{buttonWord}</p>
    </Card>
  )
}
// function mapStateToProps({ }) {
//   return {  }
// }

export default Buttons
