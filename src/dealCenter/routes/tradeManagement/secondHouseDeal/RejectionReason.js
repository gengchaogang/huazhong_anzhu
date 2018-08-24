/**
  报成交---驳回详情页面组件
**/
import React from 'react'
import {connect} from 'dva'
import DxPanel from '../../../../commons/components/DxPanel'
import {Row,Button} from 'antd'
import { routerRedux } from 'dva/router'

function RejectionReason({dispatch}){
  const handleBack=()=>{
    dispatch({
      type:'secondDeal/setState',
      payload:{
        currentChildDetail:null
      }
    })
    dispatch(routerRedux.push('/dealManagement/secondHouseSellDeal/SecondHouseSellIndex'))
  }
  return(
    <div>
      <DxPanel title='驳回理由'>
        <Row>
          证件不全,核检不通过.
        </Row>
      </DxPanel>
      <Button type='ghost' onClick={handleBack}>返回</Button>
    </div>
  )
}


export default connect()(RejectionReason)
