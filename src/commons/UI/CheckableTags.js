import React,{PropTypes} from 'react'
import {
  Tag,
} from 'antd'

import './CheckableTags.css'

const CheckableTag=Tag.CheckableTag;

export class CheckTag extends React.Component{
  constructor(props){
    super(props);
  }


  onChange=(checked)=>{
    this.props.onChange(this.props.val,checked);
  }

  render(){
    const {children,val,checked,customStyle}=this.props;
    let style=customStyle?customStyle:{};
    const {active,...other}=style;
    return (
      <CheckableTag
        checked={checked}
        style={checked?{...other,...active}:{...other}}
        className={checked?"tag active":"tag"}
        onChange={this.onChange}>
        {children}
      </CheckableTag>
    );
  }
}

export default class CheckableTags extends React.Component{
  constructor(props){
    super(props);
    this.state={
      fieldValue:[]
    };
  }

  static propTypes={
    tags:PropTypes.array.isRequired,
    multiple:PropTypes.bool,
    customStyle:PropTypes.object,
    name:PropTypes.string,
    value:PropTypes.array||undefined,
    onChange:PropTypes.func,
    disabled:PropTypes.bool,
  };

  componentDidMount(){
    let fieldValue=this.state.fieldValue;
    if(this.props.value!==undefined){ //如果传了选中项
      let jus=null;
      this.props.tags.map((item,index)=>{
        let checked=this.props.value.some((sub,i)=>{
          jus=typeof item==="string"?item:typeof item==="object"?(item.value?item.value:item.name):null;
          if(jus!==null){
            if(sub===jus){
              return true;
            }
            else{
              return false;
            }
          }
          return false;
        });
        if(checked){
          if(this.props.multiple){
            fieldValue.push(jus);
          }
          else{
            fieldValue=[jus];
          }

        }
      });
    }
    this.setState({fieldValue},()=>{
      if(this.props.value&&this.props.value.length>0){
        this.props.onChange&&this.props.onChange(fieldValue);
      }
    });
  }

  onChange=(name,checked)=>{
    console.log('this.props.max,',this.props.max);
    if(this.props.disabled){
      return
    }else{
      let fieldValue=this.state.fieldValue;
      if(checked){
        // console.log('选中时触发',fieldValue.length);
        if(this.props.multiple){
          if(this.props.max===undefined){
            let exists=false;
            for(let i=0;i<fieldValue.length;i++){
              if(fieldValue[i]===name){
                exists=true;
                break;
              }
            }
            if(!exists){
              fieldValue.push(name);
            }
          }else{
            if(this.props.max===fieldValue.length){
              return
            }else{
              let exists=false;
              for(let i=0;i<fieldValue.length;i++){
                if(fieldValue[i]===name){
                  exists=true;
                  break;
                }
              }
              if(!exists){
                fieldValue.push(name);
              }
            }
          }
        }
        else{
          fieldValue=[name];
        }
        this.setState({fieldValue},()=>{
          this.props.onChange&&this.props.onChange(fieldValue);
        });
      }
      else{
        // console.log('取消选中时触发');
        if(this.props.multiple){
          for(let i=0;i<fieldValue.length;i++){
            if(fieldValue[i]===name){
              fieldValue.splice(i,1);
              break;
            }
          }
        }
        else{
          let isSelf=fieldValue.some((it,i)=>it===name);
          if(!isSelf){
            fieldValue=[name];
          }
        }
        this.setState({fieldValue},()=>{
          this.props.onChange&&this.props.onChange(fieldValue);
        });
      }
    }

  }
  componentWillReceiveProps(nextProps){
    if(this.props.value!==nextProps.value){
      if(nextProps.value===undefined){
        this.setState({fieldValue:[]})
      }else{
        this.setState({fieldValue:nextProps.value})
      }
    }
  }
  render(){
    const {tags,customStyle}=this.props;
    var children=tags.map((item,index)=>{
      let name,val;
      if(typeof item==="string"){
        name=item;
        val=item;
      }
      else if(typeof item==="object"){
        name=item.name;
        if(item.value===undefined){
          val=name;
        }
        else{
          val=item.value;
        }
      }
      else{
        let err=new Error('tag的类型错误');
        throw err;
      }
      return (
        <CheckTag
           checked={this.state.fieldValue.some((sub,i)=>sub===val)}
           onChange={this.onChange}
           val={val}
           key={index}
           customStyle={customStyle}
           >
            {name}
         </CheckTag>
      )
    });
    return (
      <div className="checkable-tags">
        {children}
      </div>
    );
  }
}
