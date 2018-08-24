import React from 'react'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import {Row,Col,Button,} from 'antd'
import PromptModal from '../../../commons/View/PromptModal'
import Panel from '../../../commons/components/Panel'
import DxPanel from '../../../commons/components/DxPanel'
import img from '../../assets/yay.jpg'
import './commissionRecordDetails.css'
function CommissionRecordDetails({commissionRecordDetails,dispatch}){

  const {
    initData,
    promptObj,
  }=commissionRecordDetails;

  const handleBackOk=()=>{
    if(promptObj.todo==='closeModal'){
      dispatch({
        type:"commissionRecordDetails/togglePrompt",
        payload:{visible:false}
      })
    }
  }

  const toBack=()=>{
    dispatch(routerRedux.push({
      pathname:'/accountManagement/commissionRecord'
    }))
  }

  const handleBackCancel=()=>{}

  return(
    <div className="commissionRecordDetails">
      <PromptModal onOk={handleBackOk} onCancel={handleBackCancel} {...promptObj}/>
      <div>
        {/*<Panel title="经纪人实名认证审核详情"/>*/}
        <DxPanel title="交易明细">
        {/*  <Row>
            <Col span={2}><img src={!!initData.bankLogo?initData.bankLogo:img} width="50px"/></Col>
            <Col span={4}>{initData.status}</Col>
          </Row>
          <Row>
            <Col offset={2}>
              <span className="reason">原因：{!!initData.comment?initData.comment:"无!"}</span>
            </Col>
          </Row>*/}
          <Row>
            <Col>状态：{initData.status}</Col>
          </Row>
          <Row>
             {/*<Col>流水号：{initData.serialNumber}</Col>*/}
            <Col>类型：{initData.commissionType}</Col>
             {/*<Col>订单ID：{initData.orderNumber}</Col>*/}
            <Col>佣金金额：{initData.totalAmt}元</Col>
            {/*            <Col>银行卡：<img src={initData.bankLogo} width="40px"/>{initData.bank}({initData.endNumber})</Col>*/}
            <Col>销售房源：{initData.house}</Col>
            <Col>房源类型：{initData.houseType}</Col>
            <Col>成交时间：{initData.knockdownTime}</Col>
            <Col>结佣时间：{initData.commissionTime}</Col>
          </Row>
          <Row>
            <div className="operation_button">
              <Button type="default" onClick={toBack}>返回</Button>
            </div>
          </Row>
        </DxPanel>
      </div>
    </div>
  )
}
function mapStateToProps({commissionRecordDetails}){
  return{commissionRecordDetails}
}
export default connect(mapStateToProps)(CommissionRecordDetails)
