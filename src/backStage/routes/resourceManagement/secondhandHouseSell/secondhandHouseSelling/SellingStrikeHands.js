import React from 'react'
import connect from 'dva';
import {
  Icon
} from 'antd';
import SecondNavBar from './SecondNavBar';
import './sellingStrikeHands.css'

function SellingStrikeHands(){
  return (
    <div className="selling-strike-hands">
      <SecondNavBar/>
      <div className="no-info-box">
        <p>
          <Icon type="picture"/>
        </p>
        <div>暂无成交信息</div>
      </div>
    </div>
  );
}

export default SellingStrikeHands;
