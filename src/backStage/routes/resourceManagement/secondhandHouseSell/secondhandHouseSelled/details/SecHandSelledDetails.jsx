import React from 'react'
import {Button,Row,Col,Tag} from 'antd'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import DxPanel from '../../../../../../commons/components/DxPanel'
import './secHandSelledDetails.css'
import PromptModal from '../../../../../../commons/View/PromptModal'
import HouseState from '../../../../../components/resourceManagement/newHouseProDetails/HouseState'
import HouseDetails from '../../../../../components/resourceManagement/newHouseProDetails/HouseDetails'
import HouseImgs from '../../../../../components/resourceManagement/newHouseProDetails/HouseImgs'
function SecHandSelledDetails({dispatch,secHandSelledDetails}){
  const {
    pics,
    detailsData,
    promptObj,
    projectId,
  }=secHandSelledDetails
  const offLine=(values)=>{
    console.log('values',values);
  }
  const toNext=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/secondhandHouseSell/secHandSelledNavBar/secHandSelledVideoAndImgs',
      state:{
        projectId:projectId
      }
    }))
  }
  const handeBack=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/secondhandHouseSell'
    }))
  }
  const handleCallBackOk=()=>{
    if(promptObj.todo==="closeModal"){
      dispatch({type:"secHandSelledDetails/togglePrompt",payload:{visible:false}})
    }
  }
  const handleCallBackCancel=()=>{

  }
  return(
    <div className="secHandSelledDetails">
      <PromptModal {...promptObj} onOk={handleCallBackOk} onCancel={handleCallBackCancel}/>
      {/*
        <DxPanel title="房源状态">
          <Row>
            <Col className="row">房源状态 : {detailsData.houseState}</Col>
            <Col className="row">成交日期：2016-12-12 12：22：23(前后端未确定参数)</Col>
            <Col className="row">交易中心：房山区交易中心(前后端未确定参数)</Col>
          </Row>
        </DxPanel>
        */}
      <HouseState detailsData={detailsData} type="已售"/>
      <HouseDetails detailsData={detailsData} type="二手房出售"/>
      {/*      <DxPanel title="房源信息">
              <Row className="row">
                <Col span={8}>挂牌时间：2016-12-12 后端还没定义参数</Col>
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
                <Col span={8}>套内面积：{detailsData.innerArea}㎡</Col>
                <Col span={8}>期望/成交总价：{detailsData.expectPrice}万</Col>
              </Row>
              <Row className="row">
                <Col span={8}>支持贷款：{detailsData.supportMortgage}</Col>
                <Col span={8}>装修情况：<Tag color="#87d068">{detailsData.decoration}</Tag></Col>
                <Col span={8}>房屋朝向：{!!detailsData.orientations?<Tag color="#87d068">{detailsData.orientations}</Tag>:null}</Col>
              </Row>
              <Row className="row">
                <Col span={8}>所在楼层：高层(前后端未确定参数)</Col>
                <Col span={8}>房源年代：{detailsData.buildingAge}</Col>
                <Col span={8}>房源特色：
                  {!!detailsData.characteristics?detailsData.characteristics.map((item,index)=>{
                    return(
                      <Tag color="#87d068" key={index}>{item}</Tag>
                    )
                  }):null}
                </Col>
              </Row>
            </DxPanel>
*/}
      <DxPanel title="委托协议">
        <Row>
          <Col>
            {!!pics&&!!pics.commissionContractPicture&&pics.commissionContractPicture.length!==0?
              pics.commissionContractPicture.map((item,index)=>{
                return(
                  <img width="150px" key={index} src={item.path} style={{marginRight:"10px"}}/>
                )
              }):null
            }
          </Col>
        </Row>
      </DxPanel>
      <DxPanel title="房产证">
        <Row>
          <Col>
            {!!pics&&!!pics.propertyPicture&&pics.propertyPicture.length!==0?
              pics.propertyPicture.map((item,index)=>{
                return(
                  <img width="150px" key={index} src={item.path} style={{marginRight:"10px"}}/>
                )
              }):null
            }
          </Col>
        </Row>
      </DxPanel>
      <DxPanel title="业主身份证">
        <Row>
          <Col>
            {!!pics&&!!pics.idPicture&&pics.idPicture.length!==0?
              pics.idPicture.map((item,index)=>{
                return(
                  <img width="150px" key={index} src={item.path} style={{marginRight:"10px"}}/>
                )
              }):null
            }
          </Col>
        </Row>
      </DxPanel>
      <div>
        <Button type="primary" onClick={toNext}>下一步</Button>
        <Button type="ghost" onClick={handeBack}>返回</Button>
      </div>
    </div>
  )
}
function mapStateToProps({secHandSelledDetails}){
  return{secHandSelledDetails}
}
export default connect(mapStateToProps)(SecHandSelledDetails)
