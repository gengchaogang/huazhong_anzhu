import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { routerRedux } from 'dva/router'
import DxPanel from '../../../../commons/components/DxPanel';
import textPic from '../../../assets/yay.jpg'
function SecondHouseSalelistingDetails({dispatch}) {

	return (
		<div>
			<DxPanel title='报成交房源'>
				<div>房源编号：332005469041</div>
	      <div>房源视频/图片</div>
	      <div>
					<div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
	        <div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
				</div>
				<div>房源标题：一二三四五六七八九十</div>
	      <div>所在小区：一二四五六七八九十</div>
	      <div>物业类型：</div>
	      <div>房源户型：</div>
	      <div>建筑面积</div>
	      <div>使用面积</div>
	      <div>出售总价：</div>
	      <div>支持贷款：</div>
	      <div>装修情况</div>
	      <div>房屋朝向：</div>
	      <div>房屋用途：</div>
	      <div>所在楼层</div>
	      <div>房源年代：</div>
	      <div>供暖方式：</div>
	      <div>配备电梯：</div>
	      <div>看房时间：</div>
	      <div>核心卖点：</div>
			</DxPanel>
			<DxPanel title='委托协议'>
				<div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
				<div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
				<div className='listingInformation' style={{backgroundImage:`URL(${textPic})`}}></div>
			</DxPanel>
		</div>
	);
}

SecondHouseSalelistingDetails.propTypes = {
}
function mapStateToProps({secondHouseSalelistingDetails}) {
	return { secondHouseSalelistingDetails };
}

export default connect(mapStateToProps)(SecondHouseSalelistingDetails)
