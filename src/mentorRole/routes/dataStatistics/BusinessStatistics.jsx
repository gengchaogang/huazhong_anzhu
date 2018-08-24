import React from 'react'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import {Button,Select,DatePicker,Card,Row,Col,Table} from 'antd'
import DxPanel from '../../../commons/components/DxPanel'
import './businessStatistics.css'
import img from '../../assets/images/morentouinfg.png'
import moment from 'moment'
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
function BusinessStatistics({businessStatistics,dispatch}){
  const {
    startDate,
    endDate,
    tutorTeamId,
    tableData,
    tableLoading,
    teams,
    newHouseView,
    newHouseViewBroker,
    nhReport,
    nhReportBroker,
    nhTransaction,
    nhTransactionBroker,
    secdAppointment,
    secdAppointmentBroker,
    secdHouseView,
    secdHouseViewBroker,
    secdTransaction,
    secdTransactionBroker,
    defaultStartDate,
    defaultEndDate,
  }=businessStatistics
  const columns =[{
      title:"报备日期",
      dataIndex:"reportTime",
      render:(text,record,index)=>{
        if(text===""){
          return "--"
        }else{
          return text
        }
      }
    },{
      title:"经纪人",
      render:(text,record,index)=>{
        return(
          <Row>
            <Col>
              <img src={text.brokerLogo===""?img:text.brokerLogo} width="50px" height="50px" style={{borderRadius:"50%"}}/>
            </Col>
            <Col>
              {text.brokerName}
            </Col>
            <Col>
              {text.phone}
            </Col>
          </Row>
        )
      }
    },{
      title:"分组",
      dataIndex:"teamName",
      render:(text,record,index)=>{
        return (
          <span>
            <div title={text}>{text.length>20?text.substr(0,20)+'..':text}</div>
          </span>
        )
      },
    },{
      title:"楼盘",
      dataIndex:"houseName"
    },{
      title:"客户",
      dataIndex:"customerPhone"
    },{
      title:"预约看房时间",
      dataIndex:"reserveTime",
      render:(text,record,index)=>{
        if(text===""){
          return "--"
        }else{
          return text
        }
      }
    }]
  const rangePickerChange=(date,dateString)=>{
    dispatch({
      type:"businessStatistics/changeFormData",
      payload:{
        startDate:dateString[0],
        endDate:dateString[1],
      }
    })
  }
  const handleSelectChange=(value)=>{
    dispatch({
      type:"businessStatistics/changeFormData",
      payload:{
        tutorTeamId:value
      }
    })
  }
  const checkButton=()=>{
    dispatch({
      type:"businessStatistics/getInitData",
      payload:{
        startDate:startDate,
        endDate:endDate,
        tutorTeamId:tutorTeamId,
      }
    })
  }
  const nhReportClick=()=>{
    dispatch({
      type:"businessStatistics/changeTableData",
      payload:{
        tableData:nhReportBroker
      }
    })
  }
  const newHouseViewClick=()=>{
    dispatch({
      type:"businessStatistics/changeTableData",
      payload:{
        tableData:newHouseViewBroker
      }
    })
  }
  const nhTransactionClick=()=>{
    dispatch({
      type:"businessStatistics/changeTableData",
      payload:{
        tableData:nhTransactionBroker
      }
    })
  }
  const secdAppointmentClick=()=>{
    dispatch({
      type:"businessStatistics/changeTableData",
      payload:{
        tableData:secdAppointmentBroker
      }
    })
  }
  const secdHouseViewClick=()=>{
    dispatch({
      type:"businessStatistics/changeTableData",
      payload:{
        tableData:secdHouseViewBroker
      }
    })
  }
  const secdTransactionClick=()=>{
    dispatch({
      type:"businessStatistics/changeTableData",
      payload:{
        tableData:secdTransactionBroker
      }
    })
  }

  const handleBack=()=>{
    history.back();
  }

  return(
    <div className="businessStatistics">
      <DxPanel title="业务数据详情">
        <div className="searchForm">
          <Row>
            <Col span={6} className="rangePickerMarginRight">
              <RangePicker
                onChange={rangePickerChange}
                defaultValue={[moment(defaultStartDate),moment(defaultEndDate)]}
                />
            </Col>
            <Col span={4}>
              <Select style={{ width: 145 }} onChange={handleSelectChange}>
                {teams.map(item=>{
                  return(<Option key={item.teamId} value={item.teamId.toString()}>{item.teamName}</Option>)
                })}
              </Select>
            </Col>
            <Col span={5}>
              <Button type="default" onClick={checkButton}>查询</Button>
            </Col>
          </Row>
        </div>
        <div className="cards">
          <Row gutter={16}>
            <Col span={4}>
              <Card
                onClick={nhReportClick}
                title={
                  <Row>
                    <Col span={8}><span className="newHouse">新房报备{nhReport.totle}人</span></Col>
                    <Col span={11} offset={5}></Col>
                  </Row>
                }
                >
                <Row>
                  <Col><p>住宅 {nhReport.houses}人</p></Col>
                  <Col><p>商铺 {nhReport.shops}人</p></Col>
                  <Col><p>写字楼 {nhReport.offices}人</p></Col>
                </Row>
              </Card >
            </Col>
            <Col span={4}>
              <Card
                onClick={newHouseViewClick}
                title={
                  <Row>
                    <Col span={8}><span className="newHouse">新房带看{newHouseView.totle}次</span></Col>
                    <Col span={11} offset={5}></Col>
                  </Row>
                }
                >
                <Row>
                  <Col><p>住宅 {newHouseView.houses}人</p></Col>
                  <Col><p>商铺 {newHouseView.shops}人</p></Col>
                  <Col><p>写字楼 {newHouseView.offices}人</p></Col>
                </Row>
              </Card >
            </Col>
            <Col span={4}>
              <Card
                onClick={nhTransactionClick}
                title={
                  <Row>
                    <Col span={8}><span className="newHouse">新房成交{nhTransaction.totle}套</span></Col>
                    <Col span={11} offset={5}></Col>
                  </Row>
                }
                >
                <Row>
                  <Col><p>住宅 {nhTransaction.houses}人</p></Col>
                  <Col><p>商铺 {nhTransaction.shops}人</p></Col>
                  <Col><p>写字楼 {nhTransaction.offices}人</p></Col>
                </Row>
              </Card >
            </Col>
            <Col span={4}>
              <Card
                onClick={secdAppointmentClick}
                title={
                  <Row>
                    <Col span={8}><span className="newHouse">二手房预约{secdAppointment.totle}次</span></Col>
                    <Col span={11} offset={5}></Col>
                  </Row>
                }
                >
                <Row>
                  <Col><p>住宅 {secdAppointment.houses}人</p></Col>
                  <Col><p>商铺 {secdAppointment.shops}人</p></Col>
                  <Col><p>写字楼 {secdAppointment.offices}人</p></Col>
                </Row>
              </Card >
            </Col>
            <Col span={4}>
              <Card
                onClick={secdHouseViewClick}
                title={
                  <Row>
                    <Col span={8}><span className="newHouse">二手房带看{secdHouseView.totle}套</span></Col>
                    <Col span={11} offset={5}></Col>
                  </Row>
                }
                >
                <Row>
                  <Col><p>住宅 {secdHouseView.houses}人</p></Col>
                  <Col><p>商铺 {secdHouseView.shops}人</p></Col>
                  <Col><p>写字楼 {secdHouseView.offices}人</p></Col>
                </Row>
              </Card >
            </Col>
            <Col span={4}>
              <Card
                onClick={secdTransactionClick}
                title={
                  <Row>
                    <Col span={8}><span className="report">二手房成交{secdTransaction.totle}人</span></Col>
                    <Col span={11} offset={5}></Col>
                  </Row>
                }
                >
                <Row>
                  <Col><p>住宅 {secdTransaction.houses}人</p></Col>
                  <Col><p>商铺 {secdTransaction.shops}人</p></Col>
                  <Col><p>写字楼 {secdTransaction.offices}人</p></Col>
                </Row>
              </Card >
            </Col>
          </Row>
        </div>
        <div className="table">
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            loading={tableLoading}
            />
        </div>
        <div className="operation_button_center">
              <Button type="primary" onClick={handleBack}>返回</Button>              
        </div>
      </DxPanel>
    </div>
  )
}
function mapStateToProps({businessStatistics}){
  return{
    businessStatistics
  }
}
export default connect(mapStateToProps)(BusinessStatistics)
