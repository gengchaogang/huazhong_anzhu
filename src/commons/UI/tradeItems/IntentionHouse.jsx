import React from 'react'
import './IntentionHouse.css'
import DxPanel from '../../components/DxPanel'
import PicList from '../PicList'
//hasRemark td是否有备注 值为bool
//remark为元素
function IntentionHouse(props){
  const {
    houseInfo:{
      area,
      buildingNumber,
      unit,
      roomNumber,
      houseRoom,
      livingRoom,
      cookRoom,
      bathRoom,
      floorArea,
      imgUrl,
      price,
      totalPrice,
    },
    title,
    footer,
    header,
    remark,
    other,
    hideHead,
  }=props;
  const houseAreaInfo=`${area}/${buildingNumber}/${unit}/${roomNumber}室/${!!houseRoom?houseRoom:0}室${!!livingRoom?livingRoom:0}厅${!!cookRoom?cookRoom:0}厨${!!bathRoom?bathRoom:0}卫/${!!floorArea?floorArea:0}㎡`;
  const priceInfo=`均价：${price}元/㎡  总价：${totalPrice}万元/套`;
  if(!!hideHead){
    return(
      <div className='detailsItemHouse'>
        {!!header && <div>{header}</div>}
        <div className='detailsItemHouse_content'>
          <div className='detailsItemHouse_content_pic'>
            {/*<div className='houseImgInfo' style={{backgroundImage:`URL(${!!imgUrl?imgUrl:''})`}}></div>*/}
            <PicList picListData={[{
                id:`${!!imgUrl?imgUrl:''}`,
                src:`${!!imgUrl?imgUrl:''}`,
                title:'',
              }]}/>
          </div>
          <div className='detailsItemHouse_content_info'>
            <p>{houseAreaInfo}</p>
            <p>{priceInfo}</p>
            {!!remark && remark}
          </div>
          {!!other && <div className='detailsItemHouse_content_status'>{other}</div>}
        </div>
        {!!footer && <div>{footer}</div>}
      </div>
    );
  }else{
    return (
      <DxPanel title={!!title?title:'意向房源'}>
        <div className='detailsItemHouse'>
          {!!header && <div>{header}</div>}
          <div className='detailsItemHouse_content'>
            <div className='detailsItemHouse_content_pic'>
              {/*<div className='houseImgInfo' style={{backgroundImage:`URL(${imgUrl})`}}></div>*/}
              <PicList picListData={[{
                  id:`${!!imgUrl?imgUrl:''}`,
                  src:`${!!imgUrl?imgUrl:''}`,
                  title:'',
                }]}/>
            </div>
            <div className='detailsItemHouse_content_info'>
              <p>{houseAreaInfo}</p>
              <p>{priceInfo}</p>
              {!!remark && remark}
            </div>
            {!!other && <div className='detailsItemHouse_content_status'></div>}
          </div>
          {!!footer && <div>{footer}</div>}
        </div>
      </DxPanel>
    );
  }
}
export default IntentionHouse;
