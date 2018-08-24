import React, { Component, PropTypes } from 'react'
import {Select,Button,Radio,Modal} from 'antd';
const Option = Select.Option;
import SearchInput from '../../../commons/View/SearchInput'
import './SelectProjectModal.css'

function ProjectListItem({value,label,checked,onChange}){
  return<div className={`selectProjectModal_list_item ${checked?'selectProjectModal_list_item_select':''}`} onClick={()=>onChange(label,value)}>
    <Radio checked={checked} onChange={(e)=>onChange(label,value)} value={value}>{label}</Radio>
  </div>
}



class SelectProjectModal extends React.Component {
  constructor(props){
    super(props);
    this.state={
      list:[],
      selectId:null,
      selectProject:null,
    }
  }
  returnSelect=()=>{
    const {
      selectId,
      selectProject,
    }=this.state;
    this.props.onOk({selectId,selectProject,})
  }
  doSearch=(value)=>{
    const list=[];
    const {
      projectList,
    }=this.props;
    projectList.map(item=>{
      if(item.label.indexOf(value) >= 0){
        list.push(item);
      }
    });
    this.setState({
      ...this.state,
      list,
      selectId:null,
      selectProject:null,
    })
  }
  clearClearSearch=()=>{
    this.setState({
      ...this.state,
      list:this.props.projectList,
      selectId:null,
      selectProject:null,
    })
  }
  optionChange=(label,value)=>{
    this.setState({
      ...this.state,
      selectId:value,
      selectProject:label,
    })
  }
  render(){
    const {
      visible,
      onCancel,
    }=this.props;
    const {
      list,
      selectId,
      selectProject,
    }=this.state;
    return(
      <Modal title='请选择更换项目' visible={visible} onCancel={onCancel} footer={<div>
          <Button type='ghost' onClick={onCancel}>取消</Button>
          <Button type='primary' onClick={this.returnSelect} disabled={selectId===null}>提交</Button>
          </div>}>
        <div className='selectProjectModal_content'>
          <div className='selectProjectModal_search'>
            <SearchInput placeholder='在此输入名称查找' type='button' buttonTitle='查找' searchFuc={this.doSearch} clearFuc={this.clearClearSearch}/>
          </div>
          <div className='selectProjectModal_list'>
            {list.map(item=><ProjectListItem {...item} onChange={this.optionChange} key={`listKey_${item.value}`} checked={item.value===selectId}/>)}
          </div>
        </div>
      </Modal>
    );
  }
  componentWillReceiveProps(nextProps){
    if(!!nextProps.projectList && nextProps.projectList!==this.props.projectList){
      const selectId=!!nextProps.projectId?nextProps.projectId:null;
      this.setState({
        ...this.state,
        ...setListArr(nextProps.projectList,selectId),
      })
    }
  }
}
function setListArr(arr,selectId){
  if(!!selectId){
    const result={
      list:[],
      selectId:null,
      selectProject:null,
    };
    arr.map(item=>{
      if(item.value===selectId){
        result.selectId=selectId;
        result.selectProject=item.label;
        result.list.unshift({...item,label:`当前项目：${item.label}`})
      }else{
        result.list.push(item)
      }
    });
    return result;
  }else{
    return {list:arr};
  }
}
export default SelectProjectModal;
