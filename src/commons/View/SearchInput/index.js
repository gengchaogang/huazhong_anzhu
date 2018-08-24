import React, { PropTypes } from 'react';
import {Input,Icon,Button} from 'antd';
const Search = Input.Search;
import './index.css';

export default class SearchInput extends React.Component {
  constructor(props){
    super(props);
    this.state={
      clearValue:false,
      value:'',
    }
  }
  onHandleChange=(e)=>{
    const value=e.target.value;
    if(value.length==0){
      this.setState({
        value:e.target.value,
        clearValue:false,
      });
    }else{
      this.setState({
        value:e.target.value,
        clearValue:true,
      });
    }
  }
  clearSearchValue=()=>{
    this.setState({
      value:'',
      clearValue:false,
    });
    this.props.clearFuc(this.state.value);
  }
  doSearch=()=>{
    this.props.searchFuc(this.state.value)
  }
  tableTagOnChange1=(e)=>{

  }
  render(){
    const {placeholder,type,buttonTitle,id}=this.props;
    const {clearValue,value}=this.state;
    switch (type) {
      case 'default':
        return(
          <div className='dx-search-input'>
            <Search
              placeholder={placeholder}
              value={value}
              onSearch={this.doSearch}
              onChange={this.onHandleChange}
              />
            <Icon
              className={`dx-search-input-icon ${clearValue?'dx-search-input-icon-show':'dx-search-input-icon-hidden'}`} type='close'
              onClick={this.clearSearchValue}
              />
          </div>
        );
      case 'button':
        return(
          <div className='dx-search-btn-input'>
            <div className='dx-search-btn-input-searchbox'>
              <Search
                placeholder={placeholder}
                value={value}
                onSearch={this.doSearch}
                onChange={this.onHandleChange}
                />
              <Icon
                className={`dx-search-input-icon ${clearValue?'dx-search-input-icon-show':'dx-search-input-icon-hidden'}`} type='close'
                onClick={this.clearSearchValue}
                />
            </div>
            <div className='dx-search-btn-input-btnbox'>
              <Button
                className='dx-search-btn-input-btn anzhu_button'
                onClick={this.doSearch}
                type='default'>
                {buttonTitle}
              </Button>
            </div>
          </div>
        );
      default:
      return(
        <div className='dx-search-input'>
          <Search
            placeholder={placeholder}
            value={value}
            onSearch={this.doSearch}
            onChange={this.onHandleChange}
            />
          <Icon
            className={`dx-search-input-icon ${clearValue?'dx-search-input-icon-show':'dx-search-input-icon-hidden'}`} type='close'
            onClick={this.clearSearchValue}
            />
        </div>
      );
    }
    document.getElementById('example')
  }
}

SearchInput.propTypes = {
  placeholder:PropTypes.string,
  searchFuc:PropTypes.func.isRequired,
  buttonTitle:PropTypes.string,
  clearFuc:PropTypes.func,
  value:PropTypes.string,
  id:PropTypes.string,
};
SearchInput.defaultProps= {
  placeholder:'',
  buttonTitle:'搜索',
  type:'default',
  value:"",
  id:"",
};
