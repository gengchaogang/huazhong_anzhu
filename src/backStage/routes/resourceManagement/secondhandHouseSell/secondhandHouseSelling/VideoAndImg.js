import React, { PropTypes } from 'react';
import { connect } from 'dva';
import {Button} from 'antd'
import SecondNavBar from './SecondNavBar'
import img3 from '../../../../assets/images/3.png';
import img5 from '../../../../assets/images/5.jpg';
import img6 from '../../../../assets/images/6.jpg';
import img7 from '../../../../assets/images/7.jpg';
import img8 from '../../../../assets/images/8.jpg';
import img9 from '../../../../assets/images/9.jpg';
import './VideoAndImg.css'
import TitleBar from '../../../../../commons/UI/TitleBar';
function VideoAndImg() {
  const data=[{
    key:1,
    img:img3,
    name:'王小明',
    uploadNumber:'15',
    uploadTime:'2016-12-12 14：54：45',
    img5:img5,
    img6:img6,
    img7:img7,
    img8:img8,
    img9:img9,
  },{
    key:2,
    img:img3,
    name:'王小明',
    uploadNumber:'15',
    uploadTime:'2016-12-12 14：54：45',
    img5:img5,
    img6:img6,
    img7:img7,
    img8:img8,
    img9:img9,
  }];
  const handleBack=()=>{

  }
  return (
    <div>
      <SecondNavBar/>
      <TitleBar title="经纪人上传"/>
      <div>{data.map(item=><div key={item.key}><img src={item.img}/><span>{item.name}</span><span>上传 {item.uploadNumber} 张</span><span>上传时间 : {item.uploadTime}</span><Button type='primary'>采纳视频图片</Button><div>
        <img src={item.img5}/>  <img src={item.img6}/>  <img src={item.img7}/>  <img src={item.img8}/>  <img src={item.img9}/></div><hr className="splitLine"/></div>)}
      </div>
      <Button type="primary" onClick={handleBack}>返回</Button>
    </div>
  );
}

// NewHousePro.propTypes = {
  // users: PropTypes.object,
  // location: PropTypes.object,
  // dispatch: PropTypes.func,
// };
function mapStateToProps({ main }) {
  return { main }
}

export default connect(mapStateToProps)(VideoAndImg);
