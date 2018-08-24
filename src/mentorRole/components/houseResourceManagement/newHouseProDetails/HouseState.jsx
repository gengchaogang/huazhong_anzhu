import React,{ PropTypes }from 'react'
import {Row,Col} from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'

function HouseState(props){
  const {
    detailsData,
    type,
  }=props
  switch (type) {
    case '在售':
    return(
      <DxPanel title="房源状态">
        <Row>
          <Col>房源状态 : {detailsData.houseState}</Col>
        </Row>
      </DxPanel>
    );break;
    case '已售':
    return(
      <DxPanel title="房源状态">
        <Row>
          <Col className="row">房源状态 : {detailsData.houseState}</Col>
          <Col className="row">成交日期：2016-12-12 12：22：23(前后端未确定参数)</Col>
          <Col className="row">交易中心：房山区交易中心(前后端未确定参数)</Col>
        </Row>
      </DxPanel>
    );break;

    default:

  }
}

HouseState.propTypes = {
  detailsData: PropTypes.object.isRequired,
  type:PropTypes.string.isRequired,
};
export default HouseState
