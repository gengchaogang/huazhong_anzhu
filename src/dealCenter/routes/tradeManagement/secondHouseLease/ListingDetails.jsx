import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import {Button, Tabs, Input, Row,Table,Timeline,Checkbox} from 'antd';
import { Link } from 'dva/router'
import { routerRedux } from 'dva/router'
import DxPanel from '../../../../commons/components/DxPanel';
import textPic from '../../../assets/yay.jpg'

function ListingDetails({dispatch}) {
  const goBack=()=>{
    dispatch(routerRedux.goBack());
  }
  const routePush=(path)=>{
    if(path && path.length!==0){
      dispatch(routerRedux.push({
        pathname: `/dealManagement/houseLeaseDeal/${path}`,
      }));
    }
  }
  const onChange=(e)=>{
  console.log(`checked = ${e.target.checked}`);
  }
	return (
		<div>
      <DxPanel title='房源视频/图片'>
        <div>房源编号:332005469041</div>
        <div>房源视频/图片</div>
        <div>
          <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
          <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        </div>
        <div>房源标题：一二三四五六七八九十一二三那四五六七八九十</div>
        <div>所在区域：北京/海淀区</div>
        <div>楼栋：1栋</div>
        <div>单元：1单元</div>
        <div>楼层：5层/10层</div>
        <div>房间：3001室</div>
        <div>物业类型：</div>
        <div>户型：</div>
        <div>出租方式：</div>
        <div>面积：</div>
        <div>装修：</div>
        <div>朝向：</div>
        <div>租金：</div>
        <div>付款方式：</div>
        <div>租期：</div>
        <div>钥匙：</div>
        <div>房源介绍：一二三四五六七八九十一二三四五六七八九十</div>
      </DxPanel>
      <DxPanel title='房源配置'>
        <Checkbox onChange={onChange}>床</Checkbox>
        <Checkbox onChange={onChange}>衣柜</Checkbox>
        <Checkbox onChange={onChange}>书桌</Checkbox>
        <Checkbox onChange={onChange}>桌椅</Checkbox>
        <Checkbox onChange={onChange}>电视机</Checkbox>
        <Checkbox onChange={onChange}>空调</Checkbox>
        <Checkbox onChange={onChange}>WIFI</Checkbox>
        <Checkbox onChange={onChange}>电热水器</Checkbox>
        <Checkbox onChange={onChange}>洗衣机</Checkbox>
        <Checkbox onChange={onChange}>冰箱</Checkbox>
        <Checkbox onChange={onChange}>燃气灶</Checkbox>
      </DxPanel>
      <DxPanel title='房东信息'>
        <div>房东姓名:黄林枫</div>
        <div>联系电话：15120050558</div>
        <div>性别：男</div>
        <div>身份证：110621198610240038</div>
      </DxPanel>
      <DxPanel title='房东信息'>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
      </DxPanel>
		</div>
	);
}
ListingDetails.propTypes = {
}
function mapStateToProps({listingDetails}) {
	return {listingDetails};
}
export default connect(mapStateToProps)(ListingDetails)
