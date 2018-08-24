import React, { PropTypes } from 'react';
import { connect } from 'dva'
import { Link } from 'dva/router'

import { Button,Modal,TreeSelect } from 'antd'
import './ChangeDepartModal.css'
export default class ChangeDepartModal extends React.Component {
  constructor(props){
    super(props);
    this.state={
      value:null,
    }
  }
  onChange=(value)=>{
    this.setState({ value });
  }
  postValue=()=>{
    if(this.state.value !== null){
      this.props.onOk(this.state.value)
    }
  }
  afterClose=()=>{
    this.setState({value:null})
  }
  render(){
    const {
      visible,
      treeArr,
      title='调整员工所属部门',
      onCancel,
      className='',
    }=this.props;
    const modalProps = {
      visible,
      title,
      width:334,
      wrapClassName:`changeDepartModal ${className}`,
      onOk:this.postValue,
      onCancel,
      afterClose:this.afterClose,
    }
    return(
      <Modal {...modalProps}>
        <TreeSelect
          style={{ width: 300 }}
          value={this.state.value}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={treeArr}
          placeholder='请选择员工所属部门'
          treeDefaultExpandAll
          onChange={this.onChange}
        />
      </Modal>
    );
  }
}
