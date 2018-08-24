import React, { PropTypes } from 'react'
import { Row, Col } from 'antd';
import './index.css'

function UserMsg({userMsgData}){
  return(
    <div className='dx-userMsg'>
      {userMsgData.map((item,key)=>
        (<Row type='flex' align='middle' justify='end' key={`userMsgItem${key}`} gutter={5} className='dx-userMsg-item'>
          <Col className="gutter-row" span={12}>
            <div className='dx-userMsg-item-left'>{item.title}</div>
          </Col>
          <Col className="gutter-row" span={12}>
            <div className='dx-userMsg-item-right'>{item.value}</div>
          </Col>
      </Row>))
      }
    </div>
  )
}
UserMsg.propTypes={
  userMsgData:PropTypes.array.isRequired,
}
export default UserMsg
