import React, { PropTypes } from 'react';
import './housingDetails.css';
import TitleBar from '../UI/TitleBar';
function HousingDetails({housingDetailData}) {
  return (
    <div className='housingDetails'>
      <TitleBar title='房源状态'/>
      <ul className='housingInfo'>
        <li><span>房源状态：</span><span>{housingDetailData.fyzt}</span></li>
      </ul>
      <TitleBar title='房源信息'/>
      <ul className='housingInfo'>
        <li><span>挂牌时间：</span><span>{housingDetailData.gpsj}</span></li>
        <li><span>房源编号：</span><span>{housingDetailData.fybh}</span></li>
        <li><span>房源标题：</span><span>{housingDetailData.fybt}</span></li>
        <li><span>所在小区：</span><span>{housingDetailData.szxq}</span></li>
        <li><span>所在地区：</span><span>{housingDetailData.szdq}</span></li>
        <li><span>房源户型：</span><span>{housingDetailData.fyhx}</span></li>
        <li><span>建筑面积：</span><span>{housingDetailData.jzmj}</span></li>
        <li><span>套内面积：</span><span>{housingDetailData.tlmj}</span></li>
        <li><span>期望/成交总价：</span><span>{housingDetailData.totalMount}</span></li>
        <li><span>支持贷款：</span><span>{housingDetailData.zcdk}</span></li>
        <li><span>装修情况：</span><span>{housingDetailData.zxqk}</span></li>
        <li><span>房屋朝向：</span><span>{housingDetailData.fwcx}</span></li>
        <li><span>所在楼层：</span><span>{housingDetailData.szlc}</span></li>
        <li><span>房源年代：</span><span>{housingDetailData.fynd}</span></li>
        <li><span>房源特色：</span><span>{housingDetailData.fyts}</span></li>
      </ul>
      <TitleBar title='委托协议'/>
      <div><img src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'/></div>
      <TitleBar title='房产证'/>
      <div><img src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'/></div>
      <TitleBar title='业主身份证'/>
      <div>
        <img src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'/>
        <img src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'/>
      </div>
    </div>
  );
}

// NewHousePro.propTypes = {
  // users: PropTypes.object,
  // location: PropTypes.object,
  // dispatch: PropTypes.func,
// };

export default HousingDetails;
