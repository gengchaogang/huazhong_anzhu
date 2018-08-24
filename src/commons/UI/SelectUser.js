import React,{Component,PropTypes} from 'react'

import {
  Checkbox,
  Input,
  Row,
  Col,
  Modal
} from 'antd'

const CheckboxGroup=Checkbox.Group;

class SelectUser extends Component{
  constructor(props){
    super(props);
    this.state={
      value:[],
      dataSource:[]
    };
  }

  componentDidMount(){
    const {data,value}=this.props;
    this.setState({
      dataSource:data,
      value
    })
  }

  onChange=(e,index)=>{

    var value=[...this.state.value];
    let exists=false;
    let i=0;
    for(;i<value.length;++i){
      if(value[i]===e.target.value){
        exists=true;
      }
      else{
        exists=false;
      }
    }

    if(e.target.checked){
      if(exists){
        return;
      }
      else{
        value.push(e.target.value);
      }
    }
    else{
      if(exists){
        value.splice(index,1);
      }
      else{
        return;
      }
    }
    this.setState({value});
    this.props.onChange&&this.props.onChange(value);
  }

  build=(data)=>{
    var out=data.map((item,index)=>{
      return (
        <label key={index}>
          <Row type="flex" justify="space-between" align="midlle">
            <Col>{item.label}</Col>
            <Col>
              <Checkbox
                key={index}
                value={item.value}
                checked={this.isChecked(item.value)}
                onChange={(e)=>this.onChange(e,index)}
              />
            </Col>
          </Row>
        </label>
      );
    })
    return out;
  }

  isChecked=(check)=>{
    let i=0;
    let {value}=this.state;
    for(;i<value.length;++i){
      if(value[i]===check){
        return true;
      }
    }
    return false;
  }

  render(){

    return (
      <div>
        <Input.Search placeholder="搜索成员"/>
        <div>
          {this.build(this.state.dataSource)}
        </div>
      </div>
    );
  }
}

export default SelectUser;
