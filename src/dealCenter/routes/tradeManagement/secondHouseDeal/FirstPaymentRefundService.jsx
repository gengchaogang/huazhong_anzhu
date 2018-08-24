/***
  首付款退款业务详情页面组件
***/
import React from 'react'
import {routerRedux} from 'dva/router'
import DxPanel from '../../../../commons/components/DxPanel'
import {Button,Row,Timeline} from 'antd'
import img4 from '../../../assets/4.jpg'

function FirstPaymentRefundService(){
  return(
    <DxPanel title="首付款退款业务">
      <div>
        <Row>退款理由</Row>
        <Row>一二三四五六七八九十</Row>
        <img src={img4}/>
        <img src={img4}/>
        <img src={img4}/>
        <Row>审核信息</Row>
        <Timeline>
          <Timeline.Item>2015-10-24 19:00 由黄林枫 申请退款  等待 李白 退款审核</Timeline.Item>
          <Timeline.Item>2015-10-24 19:00 由 李白 审核通过  等待财务 王颖 进行审核</Timeline.Item>
          <Timeline.Item>2015-10-24 19:00 由 财务 王颖 审核通过 等待执行退款</Timeline.Item>
          <Timeline.Item>2015-10-24 19:00 由 财务 王颖 已执行退款  1~2 个工作日后 退款将退回原卡账户。</Timeline.Item>
        </Timeline>
        <Button type="ghost">返回</Button>
      </div>
    </DxPanel>
  )
}

export default FirstPaymentRefundService
