import React from 'react'
import {connect} from 'dva'
import {Button,Row,Col,Icon} from 'antd'
import {routerRedux}from 'dva/router'
import './complete.css'
import img from '../../assets/images/complete.png'
function Complete({dispatch }){
  const toLogIn=()=>{
    dispatch (routerRedux.push({
      pathname:"/logIn"
    }))
  }
  return(
    <div className="complete">
      <Row>
        <Col>
          <div className="complete_img">
            <img src={img} width={60}/>
          </div>
        </Col>
        <Col span={24} ><p>注册成功！企业认证资料已提交</p></Col>
        <Col span={24} ><span>请您耐心等待，审核结果将会短信通知您</span></Col>
{/*        <Col span={24} ><span>客服电话 400-800-100</span></Col>*/}
      </Row>
      <Row>
        <Col span={24}>
          <Button className="complete_button" onClick={toLogIn} type="button">完成</Button>
        </Col>
      </Row>
    </div>
  )
}
function mapStateToProps({}){
  return{}
}
export default connect(mapStateToProps)(Complete)
