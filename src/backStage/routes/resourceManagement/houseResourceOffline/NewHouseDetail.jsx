import React from 'react'
import {Table} from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'
// import PicList from '../../../../../../commons/UI/PicList'

import './NewHouseDetail.css'


export default function NewHouseDetail({newHouseDetailObj}){
  console.log(newHouseDetailObj,'newHouseDetailObj');
  return(
    <div>
      {!!newHouseDetailObj && <div>
        <DxPanel title='项目基本信息'>
          <p className='projects'>项目名称：{newHouseDetailObj.name}</p>
          <p className='projects'>项目地址：{newHouseDetailObj.areaPath}</p>
          <p className='projects'>项目上线时间：{newHouseDetailObj.onsellDateTime}</p>
          <p className='projects'>项目带看保护期：{newHouseDetailObj.protectDays}</p>
          <p className='projects'>项目详细地址：{newHouseDetailObj.address}</p>
          <p className='projects'>项目联系人：{newHouseDetailObj.contact}</p>
          <p className='projects'>项目联系电话：{newHouseDetailObj.phone}</p>
        </DxPanel>
        <DxPanel title='楼盘资料'>
          <p className='projects'>开盘时间：{newHouseDetailObj.openingTime}</p>
          <p className='projects'>交房时间：{newHouseDetailObj.deliverTime}</p>
          <div className='projects'>
            <span>物业类型：</span>
            {newHouseDetailObj.propertyType.length!=0 &&
              newHouseDetailObj.propertyType.map((item,index)=>(
                <span key={`item_${index}`}>{item} </span>
              ))
            }
          </div>
          <p className='projects'>楼盘开发商：{newHouseDetailObj.developers}</p>
          <p className='projects'>售楼地址：{newHouseDetailObj.saleAddress}</p>
          <p className='projects'>建筑面积：{newHouseDetailObj.floorArea}㎡</p>
          <div className='projects'>
            <span>特色：</span>
            {newHouseDetailObj.characteristic.length!=0 &&
              newHouseDetailObj.characteristic.map((item,index)=>(
                <span key={`item_${index}`}>{item}，</span>
              ))
            }
          </div>
          <p className='projects'>产权年限：{newHouseDetailObj.ownLength}年</p>
          <p className='projects'>装修标准：{newHouseDetailObj.decoration}</p>
          <p className='projects'>容积率：{newHouseDetailObj.capacityRate}%</p>
          <p className='projects'>绿化率：{newHouseDetailObj.greeningRate}%</p>
          <p className='projects'>规划户数：{newHouseDetailObj.houses}户</p>
          <p className='projects'>规划车位：{newHouseDetailObj.parkingSize}</p>
          <p className='projects'>物业公司：{newHouseDetailObj.estateCompany}</p>
          <p className='projects'>物业费：{newHouseDetailObj.propertyCosts}元/㎡</p>
          <p className='projects'>供暖方式：{newHouseDetailObj.heatingMode}</p>
          <p className='projects'>水电燃气：{newHouseDetailObj.waterElectricityGas==='true'?'有':'无'}</p>
        </DxPanel>
        <DxPanel title='项目介绍'>
          <p>项目介绍：{newHouseDetailObj.introduced}</p>
        </DxPanel>
      </div>}
    </div>
  )
}
