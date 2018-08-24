import React,{Component,PropTypes} from 'react'
import {
  Icon
} from 'antd'

export default class TextWithIconLeft extends Component{
  constructor(props){
    super(props);
  }
  static propTypes={
    data:PropTypes.array.isRequired,
    type:PropTypes.string
  };
  renderItem(){
    const {data,type}=this.props;
    let items=data.map((item,index)=>{
      return (
        <span key={index}>
          <Icon type={type?type:"check"}/>
          {
            item
          }
        </span>
      );
    });
    return items;
  }

  render(){
    var children=this.renderItem();
    return (
      <div>
        {children}
      </div>
    );
  }
}
