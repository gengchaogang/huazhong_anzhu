import React,{ PropTypes }from 'react'
import {Row,Col,Tag} from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'

function HouseDetails(props){
  const {
    detailsData,
    type,
    houseImgs
  }=props;
  console.log(detailsData,'detailsData');
  switch (type) {
    case '二手房出售':
    return(
      <DxPanel title="房源信息">
        <Row className="row">
          <Col span={8}>挂牌时间：{detailsData.createDate}</Col>
          <Col span={8}>房源编号：{detailsData.resourcesNumber}</Col>
          <Col span={8}>房源标题：{detailsData.communityName} {detailsData.houseType} {detailsData.floorArea}㎡</Col>
        </Row>
        <Row className="row">
          <Col span={8}>所在小区：{detailsData.communityName}</Col>
          <Col span={8}>所在地区：{detailsData.areaName}</Col>
          <Col span={8}>房源户型：{detailsData.houseType}</Col>
        </Row>
        <Row className="row">
          <Col span={8}>建筑面积：{detailsData.floorArea}㎡</Col>
          {/*<Col span={8}>套内面积：{detailsData.innerArea}㎡</Col>*/}
          <Col span={8}>期望/成交总价：{detailsData.totlePrice||0}万</Col>
        </Row>
        <Row className="row">
          <Col span={8}>支持贷款：{detailsData.supportMortgage}</Col>
          <Col span={8}>装修情况：<Tag color="#87d068">{detailsData.decoration}</Tag></Col>
          <Col span={8}>房屋朝向：{!!detailsData.orientations?<Tag color="#87d068">{detailsData.orientations}</Tag>:null}</Col>
        </Row>
        <Row className="row">
          <Col span={8}>所在楼层：{detailsData.storey}</Col>
          {/*<Col span={8}>房源年代：{detailsData.buildingAge}</Col>*/}
          <Col span={8}>房源特色：
            {!!detailsData.characteristics?detailsData.characteristics.map((item,index)=>{
              return(
                <Tag color="#87d068" key={index}>{item}</Tag>
              )
            }):null}
          </Col>
        </Row>
      </DxPanel>
    );break;
    case '二手房出租':
    return(
      <DxPanel title="房源信息">
        <Row className="row">
          <Col span={8}>挂牌时间：{detailsData.createDate}</Col>
          <Col span={8}>房源编号：{detailsData.resourcesNumber}</Col>
          <Col span={8}>房源标题：{detailsData.communityName} {detailsData.houseType} {detailsData.floorArea}㎡</Col>
        </Row>
        <Row className="row">
          <Col span={8}>所在小区：{detailsData.communityName}</Col>
          <Col span={8}>房源户型：{detailsData.houseType}</Col>
          <Col span={8}>建筑面积：{detailsData.floorArea}㎡</Col>
        </Row>
        <Row className="row">
          <Col span={8}>出租方式：{detailsData.rentType}</Col>
          <Col span={8}>租金：{detailsData.totlePrice||0}元/月</Col>
          <Col span={8}>所在楼层：{detailsData.storey}</Col>
        </Row>
        <Row className="row">
          <Col span={8}>装修情况：{!!detailsData.decoration?<Tag color="#87d068">{detailsData.decoration}</Tag>:null}</Col>
          <Col span={8}>房屋朝向：{!!detailsData.orientations?<Tag color="#87d068">{detailsData.orientations}</Tag>:null}</Col>
          <Col span={8}>付款方式：{detailsData.paymentMethod}</Col>
        </Row>
        <Row className="row">
          <Col span={8}>房源特色：
            {!!detailsData.characteristics?detailsData.characteristics.map((item,index)=>{
              return(
                <Tag color="#87d068" key={index}>{item}</Tag>
              )
            }):null}
          </Col>
          <Col span={8}>房间配置：
            {!!detailsData.roomConfiguration?detailsData.roomConfiguration.map((item,index)=>{
              return(
                <Tag color="#87d068" key={index}>{item}</Tag>
              )
            }):null}
          </Col>
        </Row>
        <Row className="houseImgs">
          <Col span={2}>房源视频/图片:</Col>
          <Col span={22}>
            {!!houseImgs&&houseImgs.length!==0?
                houseImgs.map((item,index)=>{
                  return(<img height="120px" width="150px" key={index} src={item} style={{marginRight:"10px"}}/>)
                }):null
            }
          </Col>
        </Row>
      </DxPanel>);break;
    case '商铺出售':
    return(
      <DxPanel title="房源信息">
        <Row className="row">
          <Col span={8}>挂牌时间：{detailsData.createDate}</Col>
          <Col span={8}>房源编号：{detailsData.resourcesNumber}</Col>
          <Col span={8}>房源标题：{detailsData.communityName} {detailsData.houseType} {detailsData.floorArea}㎡</Col>
        </Row>
        <Row className="row">
          <Col span={8}>楼盘名称：{detailsData.communityName}</Col>
          <Col span={8}>所在地区：{detailsData.areaName}</Col>
          <Col span={8}>建筑面积：{detailsData.floorArea}㎡</Col>
        </Row>
        <Row className="row">
          <Col span={8}>使用面积：{detailsData.innerArea}㎡</Col>
          <Col span={8}>所在楼层：{detailsData.storey}</Col>
          <Col span={8}>建筑年代：{detailsData.buildingAge}年</Col>
        </Row>
        <Row className="row">
          <Col span={8}>期望/成交总价：{detailsData.totlePrice}万</Col>
          <Col span={8}>商铺类型：
            <Tag color="#87d068">{detailsData.shopType}</Tag>
            {/*!!detailsData.shopType && JSON.parse(detailsData.shopType).map((item,index)=>(
              <Tag color="#87d068" key={`item_${index}`}>{item}</Tag>
            ))*/}
            {/*!!detailsData.shopType?detailsData.shopType.map((item,index)=>{
              return(
              )
            }):null*/}
          </Col>
          <Col span={8}>可经营类别：
            {/*!!detailsData.businessCategory?detailsData.businessCategory.map((item,index)=>{
              return(
              )
              <Tag color="#87d068" key={'index'}>{detailsData.businessCategory}</Tag>
            }):null*/}
            {!!detailsData.businessCategory && JSON.parse(detailsData.businessCategory).map((item,index)=>(
              <Tag color="#87d068" key={`item_${index}`}>{item}</Tag>
            ))}
          </Col>
        </Row>
        <Row className="row">
          <Col span={8}>是否可分割：{detailsData.split}</Col>
          <Col span={8}>装修情况：{!!detailsData.decoration?<Tag color="#87d068">{detailsData.decoration}</Tag>:null}</Col>
          {/*<Col span={8}>详细地址：{detailsData.address}</Col>*/}
        </Row>
        <Row className="row">
          <Col span={8}>房源特色：
            {!!detailsData.characteristics?detailsData.characteristics.map((item,index)=>{
              return(
                <Tag color="#87d068" key={index}>{item}</Tag>
              )
            }):null}
          </Col>
        </Row>
        <Row className="houseImgs">
          <Col span={2}>房源视频/图片:</Col>
          <Col span={22}>
            {!!houseImgs&&houseImgs.length!==0?
                houseImgs.map((item,index)=>{
                  return(<img height="120px" width="150px" key={index} src={item} style={{marginRight:"10px"}}/>)
                }):null
            }
          </Col>
        </Row>
      </DxPanel>);break;
    case '商铺出租':
    return(
      <DxPanel title="房源信息">
          <Row className="row">
            <Col span={8}>挂牌时间：{detailsData.createDate}</Col>
            <Col span={8}>房源编号：{detailsData.resourcesNumber}</Col>
            <Col span={8}>房源标题：{detailsData.communityName} {detailsData.houseType} {detailsData.floorArea}㎡</Col>
          </Row>
          <Row className="row">
            <Col span={8}>楼盘名称：{detailsData.communityName}</Col>
            <Col span={8}>所在地区：{detailsData.areaName}</Col>
            <Col span={8}>建筑面积：{detailsData.floorArea}㎡</Col>
          </Row>
          <Row className="row">
            <Col span={8}>使用面积：{detailsData.innerArea}㎡</Col>
            <Col span={8}>所在楼层：{detailsData.storey}</Col>
            <Col span={8}>租金：{detailsData.totlePrice}元/月</Col>
          </Row>
          <Row className="row">
            <Col span={8}>支付方式：{detailsData.paymentMethod}</Col>
            <Col span={8}>商铺类型：
              <Tag color="#87d068">{detailsData.shopType}</Tag>
              {/*!!detailsData.shopType?detailsData.shopType.map((item,index)=>{
                return(
                  <Tag color="#87d068" key={index}>{item}</Tag>
                )
                <Tag color="#87d068" key={'detailsData.shopType'}>{detailsData.shopType}</Tag>
              }):null*/}
              {/*!!detailsData.shopType && JSON.parse(detailsData.shopType).map((item,index)=>(
                <Tag color="#87d068" key={`item_${index}`}>{item}</Tag>
              ))*/}
            </Col>
            <Col span={8}>可经营类别：
              {/*!!detailsData.businessCategory?detailsData.businessCategory.map((item,index)=>{
                return(
                  <Tag color="#87d068" key={index}>{item}</Tag>
                )
                <Tag color="#87d068" key={'index'}>{detailsData.businessCategory}</Tag>
              }):null*/}
              {!!detailsData.businessCategory && JSON.parse(detailsData.businessCategory).map((item,index)=>(
                <Tag color="#87d068" key={`item_${index}`}>{item}</Tag>
              ))}
            </Col>
          </Row>
          <Row className="row">
            <Col span={8}>是否可分割：{detailsData.split}</Col>
            <Col span={8}>装修情况：{!!detailsData.decoration?<Tag color="#87d068">{detailsData.decoration}</Tag>:null}</Col>
            {/*<Col span={8}>详细地址：{detailsData.address}</Col>*/}
          </Row>
          <Row className="row">
            <Col span={8}>房源特色：
              {!!detailsData.characteristics?detailsData.characteristics.map((item,index)=>{
                return(
                  <Tag color="#87d068" key={index}>{item}</Tag>
                )
              }):null}
            </Col>
            <Col span={8}>当前状态：{detailsData.shopCurrentStatus}</Col>
          </Row>
          <Row className="houseImgs">
            <Col span={2}>房源视频/图片:</Col>
            <Col span={22}>
              {!!houseImgs&&houseImgs.length!==0?
                  houseImgs.map((item,index)=>{
                    return(<img height="120px" width="150px" key={index} src={item} style={{marginRight:"10px"}}/>)
                  }):null
              }
            </Col>
          </Row>
        </DxPanel>);break;
    case '写字楼出售':
    return(
      <DxPanel title="房源信息">
          <Row className="row">
            <Col span={8}>挂牌时间：{detailsData.createDate}</Col>
            <Col span={8}>房源编号：{detailsData.resourcesNumber}</Col>
            <Col span={8}>房源标题：{detailsData.communityName} {detailsData.houseType} {detailsData.floorArea}㎡</Col>
          </Row>
          <Row className="row">
            <Col span={8}>楼盘名称：{detailsData.communityName}</Col>
            <Col span={8}>所在地区：{detailsData.areaName}</Col>
            <Col span={8}>建筑面积：{detailsData.floorArea}㎡</Col>
          </Row>
          <Row className="row">
            <Col span={8}>使用面积：{detailsData.innerArea}㎡</Col>
            <Col span={8}>销售总价：{detailsData.totlePrice}万</Col>
              <Col span={8}>写字楼类型：
                {/*!!detailsData.officeBuildingType?detailsData.officeBuildingType.map((item,index)=>{
                  return(
                    <Tag color="#87d068" key={index}>{item}</Tag>
                  )
                }):null*/}
                {/*!!detailsData.officeBuildingType && JSON.parse(detailsData.officeBuildingType).map((item,index)=>(
                  <Tag color="#87d068" key={`item_${index}`}>{item}</Tag>
                ))*/}
                <Tag color="#87d068" key={'index'}>{detailsData.officeBuildingType}</Tag>
              </Col>
          </Row>
          <Row className="row">
            <Col span={8}>是否可分割：{detailsData.split}</Col>
            <Col span={8}>是否可注册：{detailsData.officeBuildingRegistered}</Col>
            <Col span={8}>装修情况：{!!detailsData.decoration?<Tag color="#87d068">{detailsData.decoration}</Tag>:null}</Col>
          </Row>
          <Row className="row">
            <Col span={8}>楼层：{detailsData.storey}</Col>
            <Col span={8}>物业费：{detailsData.propertyCosts}元/㎡/月</Col>
            <Col span={8}>建筑年代：{detailsData.buildingAge}年</Col>
          </Row>
          <Row className="row">
            <Col span={8}>详细地址：{detailsData.address}</Col>
            <Col span={8}>房源特色：
              {!!detailsData.characteristics?detailsData.characteristics.map((item,index)=>{
                return(
                  <Tag color="#87d068" key={index}>{item}</Tag>
                )
              }):null}
            </Col>
          </Row>
          <Row className="houseImgs">
            <Col span={2}>房源视频/图片:</Col>
            <Col span={22}>
              {!!houseImgs&&houseImgs.length!==0?
                  houseImgs.map((item,index)=>{
                    return(<img height="120px" width="150px" key={index} src={item} style={{marginRight:"10px"}}/>)
                  }):null
              }
            </Col>
          </Row>
      </DxPanel>);break;
    case '写字楼出租':
    return(
      <DxPanel title="房源信息">
          <Row className="row">
            <Col span={8}>挂牌时间：{detailsData.createDate}</Col>
            <Col span={8}>房源编号：{detailsData.resourcesNumber}</Col>
            <Col span={8}>房源标题：{detailsData.communityName} {detailsData.houseType} {detailsData.floorArea}㎡</Col>
          </Row>
          <Row className="row">
            <Col span={8}>楼盘名称：{detailsData.communityName}</Col>
            <Col span={8}>所在地区：{detailsData.areaName}</Col>
            <Col span={8}>建筑面积：{detailsData.floorArea}㎡</Col>
          </Row>
          <Row className="row">
            <Col span={8}>使用面积：{detailsData.innerArea}㎡</Col>
            <Col span={8}>租金：{detailsData.totlePrice}{detailsData.uintPirce}</Col>
            <Col span={8}>支付方式：{detailsData.paymentMethod}</Col>
          </Row>
          <Row className="row">
            <Col span={8}>写字楼类型：
              {/*!!detailsData.officeBuildingType?detailsData.officeBuildingType.map((item,index)=>{
                return(
                  <Tag color="#87d068" key={index}>{item}</Tag>
                )
              }):null*/}
              <Tag color="#87d068" key={'index'}>{detailsData.officeBuildingType}</Tag>
            </Col>
            <Col span={8}>是否可分割：{detailsData.split}</Col>
            <Col span={8}>是否可注册：{detailsData.officeBuildingRegistered}</Col>
          </Row>
          <Row className="row">
            <Col span={8}>装修情况：{!!detailsData.decoration?<Tag color="#87d068">{detailsData.decoration}</Tag>:null}</Col>
            <Col span={8}>楼层：{detailsData.storey}</Col>
            <Col span={8}>物业费：{detailsData.propertyCosts}元/㎡/月</Col>
          </Row>
          <Row className="row">
            <Col span={8}>详细地址：{detailsData.address}</Col>
            <Col span={8}>房源特色：
              {!!detailsData.characteristics?detailsData.characteristics.map((item,index)=>{
                return(
                  <Tag color="#87d068" key={index}>{item}</Tag>
                )
              }):null}
            </Col>
          </Row>
          <Row className="houseImgs">
            <Col span={2}>房源视频/图片:</Col>
            <Col span={22}>
              {!!houseImgs&&houseImgs.length!==0?
                  houseImgs.map((item,index)=>{
                    return(<img height="120px" width="150px" key={index} src={item} style={{marginRight:"10px"}}/>)
                  }):null
              }
            </Col>
          </Row>
      </DxPanel>);break;
    default:

  }
}

HouseDetails.propTypes = {
  detailsData: PropTypes.object.isRequired,
  type:PropTypes.string.isRequired,
};
export default HouseDetails;
