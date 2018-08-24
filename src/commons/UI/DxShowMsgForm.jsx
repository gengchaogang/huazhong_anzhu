import React, { PropTypes } from 'react';
import { Form, Input, Modal,Row,Col,Tag} from 'antd';
const FormItem = Form.Item;
import './DxShowMsgForm.css'

const creatChild=(arr,layout)=>{
  if(!!arr){
    const children=arr.map((item,key)=>{
      if(!!item.layout){
        return(
          <Col {...item.layout}  key={`DxShowMsgFormKey_${key}`}>
            <div className='DxShowMsgForm_item'>
              <span className='DxShowMsgForm_item_label'>{`${item.label}：`}</span>
              <div className='DxShowMsgForm_item_elm'>{item.value.map((item,index)=><Tag className='DxShowMsgForm_item_tag' key={index}>{item.name}</Tag>)}</div>
            </div>
          </Col>
        )
      }else{
        return(
          <Col {...layout}  key={`DxShowMsgFormKey_${key}`}>
            <div className='DxShowMsgForm_item'>
              <span className='DxShowMsgForm_item_label'>{`${item.label}：`}</span>
              <span className='DxShowMsgForm_item_value'>{item.value}</span>
            </div>
          </Col>
        )
      }
    });
    return children;
  }else{
    return <div></div>
  }

}
const DxShowMsgForm = ({msgData,colLayout}) => {
  const layout=(!!colLayout?colLayout:{
    lg:6,
    md:8,
    sm:12,
  })
  return (
    <div className='DxShowMsgForm'>
      <Row>
        {creatChild(msgData,layout)}
      </Row>
    </div>
  );
};


export default Form.create()(DxShowMsgForm);
