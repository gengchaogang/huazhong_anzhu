import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { Badge ,Card} from 'antd'
import './Badges.css'
function Badges({title,number,onBageClick,bgcolor,pic,className,path}) {
  let showNum='';
  if(!!number){
    if(number>0){
      showNum=`+${number}`
    }
  }
  const picStyle={};
  if(!!pic){
    picStyle.backgroundImage=`URL(${pic})`;
  }
  function clickCallBack(){
    onBageClick(path)
  }
  return (
    <div className={`badgesDivMain ${!!className?className:''}`} style={{backgroundColor:`${bgcolor}`}} onClick={clickCallBack}>
      <div className='dx-table-pic' style={picStyle}>
      </div>
      <div className='dxBages'>
        <div className='dxBagesWord'>{title}</div>
        <div className='dxBagesNumber'>{showNum}</div>
      </div>
    </div>
  );
}



export default Badges
