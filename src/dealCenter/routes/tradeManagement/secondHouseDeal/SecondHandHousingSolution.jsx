/**
  房产解押办理详情页面组件
**/
import React from 'react'
import {Row,Timeline} from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'
import { routerRedux } from 'dva/router'
import img4 from '../../../assets/4.jpg'
function SecondHandHousingSolution({dispatch}){
  const handleBack=()=>{
    dispatch(routerRedux.push('/dealManagement/secondHouseSellDeal/SecondHouseSellIndex'))
  }
  return(
    <DxPanel title="房产解押办理">
      <div>
        <Row>解押业主：林枫</Row>
        <Row>业主电话：15120050558</Row>
        <Row>解押金额：100.000.000元</Row>
        <Row>解押说明：一二三四五六七八九十一二三四上午六七八九十</Row>
        <img src={img4}/>
        <Timeline>
          <Timeline.Item>
            2015-10-24 19:00 由张三申请二手房解押贷款申请,等待 张三 受理。
          </Timeline.Item>
        </Timeline>
        <Button type='ghost' onClick={handleBack}>返回</Button>
      </div>
    </DxPanel>
  )
}
export default SecondHandHousingSolution
