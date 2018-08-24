import React from 'react'
import DxPanel from '../../../../commons/components/DxPanel'
import {Row,Button} from 'antd'
import img4 from '../../../assets/4.jpg'
import {routerRedux} from 'dva/router';
import {connect} from 'dva';
function HouseResourceInfo({dispatch}){
  return(
    <div className=''>
      <DxPanel title="报成交房源">
        <div>
          <Row>房源编号：332005469041</Row>
          <Row>房源视频/图片</Row>
          <img src={img4}/>
          <img src={img4}/>
          <Row>房源标题：一二三四五六七八九十</Row>
          <Row>所在小区：一二四五六七八九十</Row>
          <Row>物业类型：</Row>
          <Row>房源户型：</Row>
          <Row>建筑面积：</Row>
          <Row>使用面积：</Row>
          <Row>出售总价：</Row>
          <Row>支持贷款：</Row>
          <Row>装修情况：</Row>
          <Row>房屋朝向：</Row>
          <Row>房屋用途:</Row>
          <Row>所在楼层：</Row>
          <Row>房源年代：</Row>
          <Row>供暖方式：</Row>
          <Row>配备电梯：</Row>
          <Row>看房时间：</Row>
          <Row>核心卖点：</Row>
        </div>
      </DxPanel>
      <DxPanel title="委托协议">
        <div>
          <img src={img4}/>
          <img src={img4}/>
          <img src={img4}/>
        </div>
      </DxPanel>
      <Button type="ghost" onClick={()=>{
        dispatch(routerRedux.goBack());
      }}>返回</Button>
    </div>
  )
}

export default connect()(HouseResourceInfo);
