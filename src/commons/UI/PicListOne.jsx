import React, { PropTypes } from 'react';
import {Modal,Button,} from 'antd';
import {
  isNull,
} from '../utils/currencyFunction'
import './PicList.css';
class PicListItem extends React.Component{
  constructor(props){
    super(props);
  };
  picOnClick=()=>{
    if(this.props.showBig){
      this.props.handlePreview(this.props.src.split('?')[0]);
    }
  }
  render(){
    const {src,showBig}=this.props;
    return(
      <div className={`dx_picList_item 'dx_picList_item_noTitle' ${showBig?'dx_picList_item_showBig':''}`} onClick={this.picOnClick}>
        <div className='dx_picList_item_pic' style={{backgroundImage:`URL(${src})`}}></div>
      </div>
    );
  }
}

export default class PicListOne extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
    };
  }
  handlePreview = (url) => {
    this.setState({
      previewImage: url,
      previewVisible: true,
    });
  }
  handleCancel=()=>{
    this.setState({
      ...this.state,
      previewVisible: false,
    });
  }
  clearUrl=()=>{
    this.setState({
      ...this.state,
      previewImage: '',
    });
  }
  render(){
    const {picListData,hideName,hideBig}=this.props;
    console.log('picListData',picListData);
    const { previewVisible, previewImage} = this.state;
    let hideTitle=false;
    if(!!hideName){
      hideTitle=true;
    }
    return(
      <div className='dx_picList'>
        <PicListItem  src={picListData} handlePreview={this.handlePreview} showBig={!hideBig}/>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} afterClose={this.clearUrl}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
