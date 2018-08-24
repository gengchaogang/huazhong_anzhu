import React from 'react';
import {connect} from 'dva'
import {Row,Col,Card,Table,Select,Button,DatePicker} from 'antd'
import DxPanel from '../../../commons/components/DxPanel'
import img from '../../assets/images/morentouinfg.png'
import './dealStatistics.css'
import moment from 'moment'
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
function DealStatistics({dispatch,dealStatistics}){
  const {
    tableData,
    tableLoading,
    dealStatisticsData,
    teams,
    startDate,
    endDate,
    houseType,
    tradeType,
    tutorTeamId,
    defaultStartDate,
    defaultEndDate
  }=dealStatistics
  const columns =[{
      title:"成交日期",
      dataIndex:"tradeTime"
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
              {text.brokerPhone}
            </Col>
          </Row>
        )
      }
    },{
      title:"房源",
      dataIndex:"houseSource"
    },{
      title:"户型",
      dataIndex:"houseType"
    },{
      title:"总价",
      dataIndex:"tradeSum"
    },{
      title:"佣金",
      dataIndex:"tradeCommission"
    }]

  const rangePickerChange=(date,dateString)=>{
    dispatch({
      type:"dealStatistics/saveFormData",
      payload:{
        startDate:dateString[0],
        endDate:dateString[1],
      }
    })
  }
  const handleSelectChange=(value)=>{
    dispatch({
      type:"dealStatistics/saveFormData",
      payload:{
        tutorTeamId:value
      }
    })
  }
  const checkButton=()=>{
    dispatch({
      type:"dealStatistics/getInitData",
      payload:{
        endDate:endDate,
        houseType:houseType,
        startDate:startDate,
        tradeType:tradeType,
        tutorTeamId:tutorTeamId,
      }
    })
  }
  const handleHouseTypeChange=(value)=>{
    dispatch({
      type:"dealStatistics/saveFormData",
      payload:{
        houseType:value
      }
    })
  }
  const handleTradeTypeChange=(value)=>{
    dispatch({
      type:"dealStatistics/saveFormData",
      payload:{
        tradeType:value
      }
    })
  }

  const handleBack=()=>{
    history.back();
  }

  const pagination={  //暂时没做分页
  //   total:totalElements,
  //   showTotal:(totalElements)=>{return(`共 ${totalElements}项`)},
  //   pageSiz:10,
  //   onChange:(page)=>{
  //     dispatch({
  //       type:"houseTypeImgManagement/getInitHouseTypesData",
  //       payload:{
  //         pageSiz:10,
  //         pageNo:page-1
  //       }
  //     })
  //   }

  //                 {teams.map(item=>{
                    // return(<Option key={item.teamId} value={item.teamName}>{item.teamName}</Option>)
                  // })}
  }
  return(
    <DxPanel title="成交详情">
      <div className="dealStatistics">
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
            <Col span={4}>
              <Select style={{ width: 145 }} onChange={handleHouseTypeChange}>
                <Option value="住宅">住宅</Option>
                <Option value="商铺">商铺</Option>
                <Option value="写字楼">写字楼</Option>
              </Select>
            </Col>
            <Col span={4}>
              <Select style={{ width: 145 }} onChange={handleTradeTypeChange}>
                <Option value="出租">出租</Option>
                <Option value="出售">出售</Option>
              </Select>
            </Col>
            <Col span={5}>
              <Button type="default" onClick={checkButton}>查询</Button>
            </Col>
          </Row>
        </div>
        <div className="cards">
          <Row gutter={16}>
            <Col span={6}>
              <Card title="新房成交 " bordered={false}>
                <div className="counts">
                  {dealStatisticsData.newHouses}套
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card title="二手房成交 " bordered={false}>
                <div className="counts">
                  {dealStatisticsData.secdHouses}套
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card title="租赁成交 " bordered={false}>
                <div className="counts">
                  {dealStatisticsData.rentHouses}套
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card title="总佣金收益 " bordered={false}>
                <div className="counts">
                  {dealStatisticsData.totleCommission}元
                </div>
              </Card>
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
      </div>
      <div className="operation_button_center">
        <Button type="primary" onClick={handleBack}>返回</Button>              
      </div>
    </DxPanel>
  )
}
function mapStateToProps({dealStatistics}){
  return{dealStatistics}
}
export default connect(mapStateToProps)(DealStatistics)
