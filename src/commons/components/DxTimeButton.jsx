import React, { PropTypes } from 'react';
import {Button} from 'antd';
import './DxTimeButton.css'

class DxTimeButton extends React.Component {
  constructor(props){
    super(props);
    this.state={
      timeStamp:props.time,
      type:'step1',
      disabled:false,
    }
    this.timer=null;
  }
  tick=()=>{
    if(this.state.timeStamp === 0){
      clearInterval(this.timer);
      this.timer=null;
      this.setState({
        type:'step3',
        disabled:false,
        timeStamp:120,
      });
    }else{
      const newTimeStamp = this.state.timeStamp - 1;
      this.setState({
        ...this.state,
        timeStamp:newTimeStamp,
      })
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.reGetCode !== this.props.reGetCode){
      clearInterval(this.timer);
      this.timer=null;
      this.setState({
        type:'step3',
        timeStamp:this.props.time,
        disabled:false,
      })
    }
  }
  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer=null;
  }
  getCode=()=>{
    this.setState({
      ...this.state,
      disabled:true,
      type:'step2'
    })
    if(!!this.props.getCode){
      this.props.getCode()
    }
    this.timer = setInterval(() => this.tick(),1000);
  }
  render(){
    const {
      className = '',
    } = this.props;
    const {
      timeStamp,
      disabled,
      type,
    } = this.state;
    if(type === 'step1'){
      return <Button className={`${className} dxTimeButton`} disabled={disabled} onClick={this.getCode} type='primary'>获取验证码</Button>
    }
    else if(type === 'step2'){
      return <Button className={`${className} dxTimeButton`} disabled={disabled} type={disabled?'ghost':'primary'}>{`${timeStamp}秒后重新获取`}</Button>
    }
    else if(type === 'step3'){
      return <Button className={`${className} dxTimeButton`} onClick={this.getCode} disabled={disabled} type='primary'>重新获取</Button>
    }
  }
}
export default DxTimeButton;
