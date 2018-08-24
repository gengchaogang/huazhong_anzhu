import React from 'react'
import {
  Row,
  Col
} from 'antd'

function TitleBar({title,bgColor,color}){

  return (
    <Row type="flex" justify="flex-start" align="middle">
      <Col span={24}>
        <div style={{
          padding:'4px 8px',
          backgroundColor:bgColor?bgColor:'#ddd',
          border:'1px solid #bbb',
          borderRadius:2,
          color:color?color:'#666',
          fontSize:14,
          margin:'8px 0px',

        }}>{title}</div>
      </Col>
    </Row>
  );
}

export default TitleBar;
