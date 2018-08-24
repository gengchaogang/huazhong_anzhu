import React, { PropTypes } from 'react';
import {Modal,Button} from 'antd';
import './index.css';
export class DxStep extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    const {
      stepNumber,
      title,
      description,
      status,
    }=this.props;
    return(
      <div className={`dxStepsItem dxStepsItem_type_${status}`}>
        <div className='dxStepsItem_circular'>
          <span className='dxStepsItem_number'>{stepNumber+1}</span>
        </div>
        <span className='dxStepsItem_title'>{title}</span>
        <span className='dxStepsItem_description'>{description}</span>
      </div>
    )
  }
}
DxStep.propTypes = {
  title:PropTypes.string.isRequired,
  description:PropTypes.string,
  status:PropTypes.string,//process error wait
};
export class DxSteps extends React.Component {
  constructor(props){
    super(props);
  }
  renderChildren=(props)=>{
  //遍历所有子组件
    let index=-1;
    const {current,status}=props;
    return React.Children.map(props.children, child => {
      index++;
      if (child.type === DxStep){
        const newItemProps={
          status:'process',
          stepNumber: index,
        }
        if(current===index){
          if(status==='error'){
            newItemProps.status='error'
          }else{
            newItemProps.status='process';
          }
        }else if(index<current){
          newItemProps.status='process'
        }else{
          newItemProps.status='wait'
        }
        return React.cloneElement(child,newItemProps)
      }else{
        return child
      }
    })
  }
  renderChildrenLine=(props)=>{
  //遍历所有子组件
    let index=-1;
    const {current,status}=props;
    return React.Children.map(props.children, child => {
      index++;
      if (child.type === DxStep && index!==(props.children.length-1)){
        let leftLineItemClass='';
        let rightLineItemClass='';
        if(index<(current-1)){
          leftLineItemClass='dxStepsItem_line_item_finish';
          rightLineItemClass='dxStepsItem_line_item_finish';
        }else if(index===(current-1)){
          if(status==='error'){
            leftLineItemClass='dxStepsItem_line_item_finish';
            rightLineItemClass='dxStepsItem_line_item_error';
          }else if(status==='process' || status==='wait'){
            leftLineItemClass='dxStepsItem_line_item_process';
            rightLineItemClass='';
          }else{
            leftLineItemClass='dxStepsItem_line_item_finish';
            rightLineItemClass='dxStepsItem_line_item_finish';
          }
        }else if(current===0 && index===0){
          if(status==='error'){
            leftLineItemClass='dxStepsItem_line_item_finish';
            rightLineItemClass='dxStepsItem_line_item_error';
          }else if(status==='process' || status==='wait'){
            leftLineItemClass='dxStepsItem_line_item_process';
            rightLineItemClass='';
          }else{
            leftLineItemClass='dxStepsItem_line_item_finish';
            rightLineItemClass='dxStepsItem_line_item_finish';
          }
        }else{
          leftLineItemClass='';
          rightLineItemClass='';
        }
        return <div className='dxStepsItem_line'>
          <div className={`dxStepsItem_line_item ${leftLineItemClass}`}></div>
          <div className={`dxStepsItem_line_item ${rightLineItemClass}`}></div>
        </div>
      }
    })
  }
  render(){
    return(
      <div className='dxSteps'>
        <div className='dxSteps_itemBigBox'>
          <div className='dxSteps_itemBox'>{this.renderChildren(this.props)}</div>
        </div>
        <div className='dxSteps_linesBigBox'>
          <div className='dxSteps_linesBox'>{this.renderChildrenLine(this.props)}</div>
        </div>
      </div>
    )
  }
}
DxSteps.propTypes = {
  current:PropTypes.number.isRequired,
  width:PropTypes.number,
  status:PropTypes.string.isRequired,
};
