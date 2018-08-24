import React, { PropTypes } from 'react'
import { Menu, Icon } from 'antd'
import { Link } from 'react-router'
import {Row,Col}from 'antd'
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow'
import Badges from '../../../commons/UI/Badges'
import badgesImg from '../../assets/images/index_icon.png'
import './IndexEntrance.css'

function IndexEntrance({loading,entranceData,bageClick}){
  return(
    <div className='indexEntrance'>
      <DxLoadingShadow visible={!!loading}/>
      {!loading && <Row>
        {entranceData.map((item)=><Col key={`col_${item.path}`} className='indexEntrance_item' sm={12} md={8} lg={6} style={{padding:'4px 8px'}}>
          <Badges title={item.title} onBageClick={()=>bageClick(item)} path={item.path} number={item.number} pic={badgesImg} className={item.className} bgcolor={item.bgcolor}/>
        </Col>)}
      </Row>}
    </div>
  )
}

export default IndexEntrance
