import React from 'react';
import {connet} from 'dva';
import {Input,Row,Col} from 'antd';
const InputGroup=Input.Group;
function InputGroups({area}){
  return(
    <InputGroup name="houseAreaType">
      <Col span={8}>
        <Input onChange={(e)=>{
          let value=e.target.value;
          area[0]=value;
        }}/>
      </Col>
      <Col span={8}>
        <Input onChange={(e)=>{
          let value=e.target.value;
          area[1]=value;
          console.log("area >>>",area)
        }}/>
      </Col>
    </InputGroup>
  )
}
export default InputGroups;
