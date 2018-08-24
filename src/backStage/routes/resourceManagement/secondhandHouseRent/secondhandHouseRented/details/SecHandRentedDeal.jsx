import React from 'react'
import {connect} from 'dva';
import {
  Icon,
  Button,
  Row,
  Col,
  Timeline,
} from 'antd';
import {routerRedux} from 'dva/router'
import DxPanel from '../../../../../../commons/components/DxPanel'
import PromptModal from '../../../../../../commons/View/PromptModal'
function SecHandRentedDeal({dispatch,secHandRentedDeal}){
  const {
    promptObj,
    projectId
  }=secHandRentedDeal;
  const handleCallBackOk=()=>{

  }
  const handleCallBackCancel=()=>{

  }
  const toPrve=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/secondhandHouseRent/secHandRentedNavBar/secHandRentedRecord',
      state:{
        projectId:projectId
      }
    }))
  }
  const handeBack=()=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/secondhandHouseRent'
    }))
  }
  return (
    <div className="Rented-strike-hands">
      <PromptModal {...promptObj} onOk={handleCallBackOk} onCancel={handleCallBackCancel}/>
      <DxPanel title="交易中心">
        <Row>
          <Col>交易中心名称：房山区交易中心</Col>
          <Col>联系电话：101-111111</Col>
          <Col>地址：XXXXXXXXXXXXXXXXX</Col>
        </Row>
      </DxPanel>
      <DxPanel title="报成交经纪人">
        <Row>
          <Col span={3}>
            <img src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' width='100px'/>
          </Col>
          <Col span={4}style={{lineHeight:"32px"}}>
            <Row>
              <Col>姓名：黄林枫</Col>
              <Col>性别：男</Col>
              <Col>电话：15120050558</Col>
            </Row>
          </Col>
        </Row>
      </DxPanel>
      <DxPanel title="报成交客户">
        <Row>
          <Col>姓名：黄林枫</Col>
          <Col>电话：15120050558</Col>
          <Col>身份证：430621198610240038</Col>
        </Row>
      </DxPanel>
      <DxPanel title="客户所属经纪人">
        <Row>
          <Col span={3}>
            <img src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' width='100px'/>
          </Col>
          <Col span={4}style={{lineHeight:"32px"}}>
            <Row>
              <Col>姓名：黄林枫</Col>
              <Col>性别：男</Col>
              <Col>电话：15120050558</Col>
            </Row>
          </Col>
        </Row>
      </DxPanel>
      <DxPanel title="合作成交佣金分配比例">
        <Row>
          <Col>买方经纪人：20%</Col>
          <Col>卖方经纪人：80%</Col>
        </Row>
      </DxPanel>
      <DxPanel title="二手房解押办理">
        <Row>
          <Col>解押业主：林枫</Col>
          <Col>业主电话：15120050558</Col>
          <Col>解押金额：100.000.000元</Col>
          <Col>解押说明：一二三四五六七八九十一二三四上午六七八九十</Col>
          <Col>
            <img src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' width='100px'/>
            <img src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' width='100px'/>
            <img src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' width='100px'/>
            <img src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' width='100px'/>
          </Col>
          <Col>
            <Timeline>
              <Timeline.Item>
                2015-10-24 19:00 由张三申请二手房解押贷款申请,等待 张三 受理。
              </Timeline.Item>
            </Timeline>
          </Col>
        </Row>
      </DxPanel>
      <DxPanel title="房源报成交记录">
        <Timeline>
          <Timeline.Item>
            2010-10-24 19: 00  由    林八千 挂牌房源[合作成交]。
          </Timeline.Item>
          <Timeline.Item>
            2010-10-24  20:00   由   黄林枫  报成交。
          </Timeline.Item>
          <Timeline.Item>
            2010-10-24  20:00   由   张三 申请办理二手房解押贷款。
          </Timeline.Item>
        </Timeline>
      </DxPanel>
      <div>
        <Button type="primary" onClick={toPrve}>上一步</Button>
        <Button type="ghost" onClick={handeBack}>返回</Button>
      </div>
    </div>
  );
}
function mapStateToProps({secHandRentedDeal}){
  return{secHandRentedDeal}
}
export default connect(mapStateToProps)(SecHandRentedDeal)
