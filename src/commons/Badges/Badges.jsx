import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import textPic from '../assets/yay.jpg'
import { Badge ,Card} from 'antd'
import './Badges.css'
function Badges({word,onBageClick,bgcolor}) {
  return (
    <div className='badgesDivMain' style={{backgroundColor:`${bgcolor}`}}>
      <div className='dx-table-pic' style={{backgroundImage:`URL(${textPic})`}}></div>
      <div className='dxBages'>
        <div className='dxBagesWord'>{word}</div>
        <div className='dxBagesNumber'>+25</div>
      </div>
    </div>
  );
}



export default Badges
