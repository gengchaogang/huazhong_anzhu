import React from 'react'
import {Table} from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'
// import PicList from '../../../../../../commons/UI/PicList'
import {
  renderTotalMoneyStr,
} from '../../../../commons/utils/publicFunction'
import './SecHouseShopOffceHousingDetails.css'
const isJSONArr=(isArr)=>{
  let rul=[];
  let res;
  try {
    res=JSON.parse(isArr);
  } catch (e) {
    res=isArr;
  } finally {
    let type=typeof res;
    if(type=='string'){
      rul.push(res);
      return rul
    }else if(type=='object'){
      return res
    }
  }
}

export default function SecHouseShopOffceHousingDetails({houseBaseInfo,listOwer,offLineInfos}){
  return(
    <div>
      {!!houseBaseInfo && <div>
        <DxPanel title='房源状态'>
          <p className='detailInformation'>房源状态：下架</p>
          <p className='detailInformation'>下架原因：{!!offLineInfos?offLineInfos.offLineReason:''}</p>
          <p className='detailInformation'>下架时间：{!!offLineInfos?offLineInfos.createDate:''}</p>
          <p className='detailInformation'>操作人员：{!!offLineInfos?offLineInfos.offLineUserName:''}</p>
        </DxPanel>
        <DxPanel title='房源信息'>
          <p className='detailInformation'>挂牌时间：{houseBaseInfo.createDate}</p>
          <p className='detailInformation'>房源编号：{houseBaseInfo.resourcesNumber}</p>
          <p className='detailInformation'>房源标题：{houseBaseInfo.houseName}</p>
          <p className='detailInformation'>
            {houseBaseInfo.resourcesType=='住宅'?'所在小区：':'楼盘名称：'}
            {!!houseBaseInfo.communitiesInfoModel?houseBaseInfo.communitiesInfoModel.name:''}
          </p>
          <p className='detailInformation'>所在地区：
            {houseBaseInfo.areaName}
          </p>
          <p className='detailInformation'>房源户型：{houseBaseInfo.houseType}</p>
          <p className='detailInformation'>建筑面积：{houseBaseInfo.floorArea}㎡</p>
          <div>
            {houseBaseInfo.saleWay=='出售' &&
              <div>
                {houseBaseInfo.resourcesType!=='住宅' && <div className='detailInformation'>
                  使用面积：{houseBaseInfo.innerArea}㎡
                </div>}
                {/*<p className='detailInformation'>
                  {houseBaseInfo.resourcesType!=='住宅'?'套内面积：':'使用面积：'}
                  {houseBaseInfo.innerArea}㎡
                </p>*/}
                <p className='detailInformation'>期望/成交总价：{renderTotalMoneyStr(houseBaseInfo.totlePriceShowName)}</p>
                <p className='detailInformation'>支持贷款：{houseBaseInfo.supportMortgage}</p>
              </div>
            }
          </div>
          <div>
            {houseBaseInfo.resourcesType=='商铺' &&
              <div>
                <p className='detailInformation'>
                  建筑年代：{houseBaseInfo.buildingAge}
                </p>
                {houseBaseInfo.saleWay=='出租' &&
                  <p className='detailInformation'>
                    当前状态：{houseBaseInfo.shopCurrentStatus}
                  </p>
                }
                <div className='detailInformation'>商铺类型：
                  {!!houseBaseInfo.shopType && isJSONArr(houseBaseInfo.shopType).map((item,index)=>(
                    <span key={`item_${index}`}>
                      <span className='tips'>{item}</span>
                    </span>
                  ))}
                </div>
                <div className='detailInformation'>可经营类别：
                  {!!houseBaseInfo.businessCategory && isJSONArr(houseBaseInfo.businessCategory).map((item,index)=>(
                    <span key={`item_${index}`}>
                      <span className='tips'>{item}</span>
                    </span>
                  ))}
                </div>
                <p className='detailInformation'>
                  是否可分割：{houseBaseInfo.split}
                </p>
              </div>
            }
          </div>
          <div>
            {houseBaseInfo.resourcesType=='写字楼' &&
              <div>
                <p className='detailInformation'>
                  建筑年代：{houseBaseInfo.buildingAge}
                </p>
                <div className='detailInformation'>写字楼类型：
                  {!!houseBaseInfo.officeBuildingType && isJSONArr(houseBaseInfo.officeBuildingType).map((item,index)=>(
                    <span key={`item_${index}`}>
                      <span className='tips'>{item}</span>
                    </span>
                  ))}
                </div>
                <p className='detailInformation'>
                  是否可分割：{houseBaseInfo.split}
                </p>
                <p className='detailInformation'>
                  是否可注册：{houseBaseInfo.officeBuildingRegistered}
                </p>
                <p className='detailInformation'>
                  物业费：{houseBaseInfo.propertyCosts}元/㎡/月
                </p>
              </div>
            }
          </div>
          <div>
            {houseBaseInfo.saleWay=='出租' &&
              <div>
                <p className='detailInformation'>出租方式：{houseBaseInfo.rentType}</p>
                <p className='detailInformation'>租金：{houseBaseInfo.totlePrice}元/月</p>
                <p className='detailInformation'>付款方式：{houseBaseInfo.paymentMethod}</p>
              </div>
            }
          </div>
          <p className='detailInformation'>装修情况：{houseBaseInfo.decoration}</p>
          <p className='detailInformation'>房屋朝向：{houseBaseInfo.orientations}</p>
          <p className='detailInformation'>所在楼层：{houseBaseInfo.storey}</p>
          <div className='detailInformation'>房源特色：
            {!!houseBaseInfo.characteristics &&JSON.parse(houseBaseInfo.characteristics).map((item,index)=>(
              <span key={`item_${index}`}>
                <span className='tips'>{item}</span>
              </span>
            ))}
          </div>
          <div className='detailInformation'>
            {houseBaseInfo.saleWay=='出租' &&
            <div>房间配置：
              {!!houseBaseInfo.roomConfiguration &&JSON.parse(houseBaseInfo.roomConfiguration).map((item,index)=>(
                <span key={`item_${index}`}>
                  <span className='tips'>{item}</span>
                </span>
              ))}
            </div>}
          </div>
        </DxPanel>
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
      </div>}
    </div>
  )
}
