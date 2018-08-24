import React from 'react'
import BarCharts from '../../../commons/BarCharts/BarCharts'
import PieCharts  from '../../../commons/PieCharts/PieCharts'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import {Card,Select,Button,Row,Col,DatePicker} from 'antd'
import DxPanel from '../../../commons/components/DxPanel'
import Panel from '../../../commons/components/Panel'
import moment from 'moment'
import './basicStatistics.css'
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

function BasicStatistics({basicStatistics,dispatch}){
  const {
    initStatisticalData,
    housesTotle,
    forRent,
    forSale,
    dealData,
    selectOption,
    startDate,
    endDate,
    dealStartDate,
    dealEndDate,
    tutorTeamId,
    dealPieCharts,
    cumulativeDeal,
    dealDataOption,
    tutorDealTeamId,
    defaultStartDate,
    defaultEndDate,
  }=basicStatistics
  const rangePickerChange=(date,dateString)=>{
    dispatch({
      type:"basicStatistics/saveDate",
      payload:{
        startDate:dateString[0],
        endDate:dateString[1],
      }
    })
  }
  const dealDataDateChange=(date,dateString)=>{
    dispatch({
      type:"basicStatistics/saveDate",
      payload:{
        dealStartDate:dateString[0],
        dealEndDate:dateString[1],
      }
    })
  }
  const handleSelectChange=(value)=>{
    dispatch({
      type:"basicStatistics/saveBussinessOptionValue",
      payload:{
        tutorTeamId:value
      }
    })
  }
  const handleDealSelectChange=(value)=>{
    dispatch({
      type:"basicStatistics/saveBussinessOptionValue",
      payload:{
        tutorDealTeamId:value
      }
    })
  }
  const checkBussinessButton=()=>{
    dispatch({
      type:"basicStatistics/getInitBussinessData",
      payload:{
        endDate:endDate,
        startDate:startDate,
        tutorTeamId:tutorTeamId,
      }
    })
  }
  const checkButton=()=>{
    dispatch({
      type:"basicStatistics/getInitPieChartsData",
      payload:{
        endDate:dealEndDate,
        startDate:dealStartDate,
        tutorTeamId:tutorDealTeamId,
      }
    })
  }
  const businessDetails=()=>{
    dispatch(routerRedux.push({
      pathname:"/dataStatistics/basicStatistics/businessStatistics"
    }))
  }
  const dealDetails=()=>{
    dispatch(routerRedux.push({
      pathname:"/dataStatistics/basicStatistics/dealStatistics"
    }))
  }
  console.log('defaultStartDate',defaultStartDate)
  console.log('defaultEndDate',defaultEndDate)
  return(
    <div className="basicStatistics">
      <Panel title="数据统计"/>
      <Row gutter={16} style={{marginTop:"20px",marginBottom:"20px"}}>
        <Col span={8}>
          <p className="title">佣金收益 <span className="time">{initStatisticalData.datePeriod}</span></p>
          <div className="content">{initStatisticalData.commission}元</div>
        </Col>
        <Col span={8}>
          <p className="count">经纪人总数</p>
          <div className="content">{initStatisticalData.brokersNumber}人</div>
        </Col>
        <Col span={8}>
          <p className="house_count">房源总数</p>
          <div className="houseResourceCounts">
            <Row className="houseResourceCounts_row">
              <Col span={6}>
                <div className="houseCounts">
                  {housesTotle.housesTotle}套
                </div>
              </Col>
              <Col span={9}>
                <Row className="details">
                  <Col>在售 {forSale.saleTotle}套</Col>
                  <Col>住宅 {forSale.houses}套</Col>
                  <Col>商铺 {forSale.shops}套</Col>
                  <Col>写字楼 {forSale.offices}套</Col>
                </Row>
              </Col>
              <Col span={9}>
                <Row className="details">
                    <Col>出租 {forRent.rentTotle}套</Col>
                    <Col>住宅 {forRent.houses}套</Col>
                    <Col>商铺 {forRent.shops}套</Col>
                    <Col>写字楼 {forRent.offices}套</Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <Panel title="业务数据"/>
      <div className="businessData">
        <div className="searchForm">
          <Row>
            <Col span={6}>
              <RangePicker
                onChange={rangePickerChange}
                defaultValue={[moment(defaultStartDate),moment(defaultEndDate)]}
                />
            </Col>
            <Col span={4} className="searchItem">
              <Select style={{ width: 145 }} onChange={handleSelectChange}>
                {selectOption.map(item=>{
                  return(
                    <Option value={item.teamId.toString()} key={item.teamName}>{item.teamName}</Option>
                  )
                })}
              </Select>
            </Col>
            <Col span={1} className="searchItem">
              <Button type="default" onClick={checkBussinessButton}>查询</Button>
            </Col>
            <Col span={4} className="searchItem_details">
              <Button type="default" onClick={businessDetails}>详情</Button>
            </Col>
          </Row>
        </div>
        <div className="charts">
          <Row>
            <Col>
              <div id="barCharts">

              </div>
              {/*<BarCharts {...dealData} onlyRefs={'isDrowChart1'} type={'bar'} widths={'900px'}/>*/}
            </Col>
          </Row>
        </div>
      </div>
      <Panel title="成交数据"/>
      <div className="dealData">
        <div className="searchForm">
          <Row>
            <Col span={6}>
              <RangePicker
                onChange={dealDataDateChange}
                defaultValue={[moment(defaultStartDate),moment(defaultEndDate)]}
                />
            </Col>
            <Col span={4} className="searchItem">
              <Select style={{ width: 145 }} onChange={handleDealSelectChange}>
{/*                <Option value="全部团队">全部团队</Option>
                <Option value="天火队">天火队</Option>
                <Option value="金鹰队">金鹰队</Option>*/}
                {dealDataOption.map(item=>{
                  return(<Option key={item.teamName} value={item.teamId.toString()}>{item.teamName}</Option>)
                })}
              </Select>
            </Col>
            <Col span={1} className="searchItem">
              <Button type="default" onClick={checkButton}>查询</Button>
            </Col>
            <Col span={4} className="searchItem_details">
              <Button type="default" onClick={dealDetails}>详情</Button>
            </Col>
          </Row>
        </div>
        <div className="charts">
          <Row>
            <Col>
              <Row>
                <Col>
                  <PieCharts {...dealPieCharts}
                    onlyRefs={'isDrowChart2'} type={'pie'}
                    widths={'600px'}
                  />
                </Col>
                <Col>
                  <p className="cumulativeDeal">累计成交{cumulativeDeal}套</p>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )
}
function mapStateToProps({basicStatistics}){
  return{basicStatistics}
}
export default connect(mapStateToProps)(BasicStatistics)
