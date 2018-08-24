import React from 'react'
import {Table,Tag} from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'
// import PicList from '../../../../../../commons/UI/PicList'

import './OfficeRentDetailOne.css'


export default function OfficeRentDetailOne({houseBaseInfo,listOwer}){
  console.log(houseBaseInfo,'houseBaseInfo.officeBuildingType');
  return(
    <div className='projectDetails_projectCertificates'>
      {houseBaseInfo &&<div>
        <DxPanel title='房源状态'>
          <p>房源状态：{houseBaseInfo.houseStateShowName}</p>
        </DxPanel>
        <DxPanel title='房源信息'>

          <div className='flexbtween'>
            <div>
              <p className='datailP'>挂牌时间：{houseBaseInfo.createDate}</p>
              <p className='datailP'>房源编号：{houseBaseInfo.resourcesNumber}</p>
              <p className='datailP'>房源标题：{houseBaseInfo.houseName}</p>
              <p className='datailP'>楼盘名称：{houseBaseInfo.communityName}</p>
              <p className='datailP'>所在地区：{houseBaseInfo.areaName}</p>
            </div>
            <div>
              <p className='datailP'>建筑面积：{houseBaseInfo.floorArea}㎡</p>
              <p className='datailP'>使用面积：{houseBaseInfo.innerArea}㎡</p>
              <p className='datailP'>租金：{houseBaseInfo.totlePrice}元/㎡/月</p>
              <p className='datailP'>支付方式：{houseBaseInfo.paymentMethod}</p>
              <p className='datailP'>写字楼类型：{houseBaseInfo.officeBuildingType}</p>
            </div>
          {/*<div className='datailP'>
            写字楼类型：!!houseBaseInfo.officeBuildingType && JSON.parse(houseBaseInfo.officeBuildingType).map((item,index)=>(
              <span key={`item_${index}`}> {item}</span>
            ))
          </div>*/}

            <div>
              <p className='datailP'>是否可分割：{houseBaseInfo.split}</p>
              <p className='datailP'>是否可注册：{houseBaseInfo.officeBuildingRegistered}</p>
              <p className='datailP'>装修情况：{houseBaseInfo.decoration}</p>
              <p className='datailP'>楼层：{houseBaseInfo.storey}</p>
              <p className='datailP'>物业费：{houseBaseInfo.propertyCosts}元/㎡/月</p>
            </div>
          </div>
          {/*<p className='datailP'>详细地址：{houseBaseInfo.address}</p>*/}
          <div className='datailP'>房源特色：
            {!!houseBaseInfo.characteristics?JSON.parse(houseBaseInfo.characteristics).map((item,index)=>{
              return(
                <Tag color="#87d068" key={`item_${index}`}>{item}</Tag>
              )
            }):null}
            {/*houseBaseInfo.characteristics && JSON.parse(houseBaseInfo.characteristics).join(',')*/}
          </div>
          <div>
            <div>
              房源视频/图片：
            </div>
            {houseBaseInfo.outFiles.length!=0 &&houseBaseInfo.outFiles.map((item,index)=>(
              <span key={`item_${index}`} className='outFiles' style={{backgroundImage:`URL(${item.path})`}}></span>
            ))}
          </div>
        </DxPanel>
      </div>}
      {!!listOwer &&
      <div>
        <DxPanel title='委托协议'>
          <div>
            {(listOwer.length!=0 && listOwer[0].commissionContractPicture.length!=0) && listOwer[0].commissionContractPicture.map((item,index)=>(
              <span key={`item_${index}`} className='outFiles' style={{backgroundImage:`URL(${item.path})`}}></span>
            ))}
          </div>
        </DxPanel>
        <DxPanel title='房产证/租房合同'>
          <div>
            {listOwer.length!=0 && listOwer[0].propertyPicture.length!=0 && listOwer[0].propertyPicture.map((item,index)=>(
              <span key={`item_${index}`} className='outFiles' style={{backgroundImage:`URL(${item.path})`}}></span>
            ))}
          </div>
        </DxPanel>
        <DxPanel title='业主身份证'>
          <div>
            {listOwer.length!=0 && listOwer[0].idPicture.length!=0 && listOwer[0].idPicture.map((item,index)=>(
              <span key={`item_${index}`} className='outFiles' style={{backgroundImage:`URL(${item.path})`}}></span>
            ))}
          </div>
        </DxPanel>
      </div>}
    </div>
  )
}
