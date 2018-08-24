import React from 'react'
import {connect} from 'dva'
import Panel from '../../commons/components/Panel'
import PromptModal from '../../commons/View/PromptModal'
import DxPanel from '../../commons/components/DxPanel'
import moment from 'moment';
import {Checkbox,Button,DatePicker,Select,Radio,Row,Col,Card,Table,Form,Spin }from 'antd'
import BarCharts from '../../commons/BarCharts/BarCharts'
import PieCharts from '../../commons/PieCharts/PieCharts'
import echarts from 'echarts'
import './indexPageX.css'
import icon from '../assets/yay.jpg'
import img from '../assets/images/morentouinfg.png'
const dateFormat = 'YYYY-MM-DD';
const screenWidth=document.body.offsetWidth;
const { MonthPicker, RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const FormItem=Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const PieChartsStyleAnZhuSecond={
  widths:"344px",
  height:"169px",
}
const PieChartsStyleAnZhu={
  widths:"344px",
  height:"169px",
}
const PieChartsStyle={
  widths:"275px",
  height:"200px",
}
const PieChartsStyle_personalData={
  widths:"223px",
  height:"200px",
}
const PieChartsStyle_personalBussinessData={
  widths:"255px",
  height:"200px",
}
const PieChartsStyleDealCommission={
  widths:"320px",
  height:"200px",
}
const PieChartsStyleDealBroker={
  widths:"400px",
  height:"200px",
}
const PieChartsStyleNewHouseDistribution={
  widths:"150px",
  height:"200px",
}

function IndexPageX({dispatch,indexPageX,form}){
  const {getFieldDecorator}=form
  const{
    barChartsWidth,
    currentBrokerage,
    companyInfos,
    promptObj,
    isBroker,
    basicData,
    charts,
    newHouseChartsData,
    secdRentOutChartsData,
    secdSellChartsData,
    businessCountForMonthData,
    addHouseDtailCharts,
    defaultBussinessCharts,
    brokerInfos,
    rankingList,
    transactionListDataCharts,
    agentStartDate,
    agentEndDate,
    defaultAgentTrendOtion,
    defaultMentorOtion,
  }=indexPageX  //经纪人首页统计图
  const {
    secdRentData,
    brokerSecdRent,
    secdSoldsData,
    brokerSecdSolds,
    tutorBrokersData,
    brokerTutorBrokers,
  }=indexPageX  //导师首页安住经济公司统计图
  const {
    addBroker,
    addBrokerView,
    addCustomerFollow,
    addHouse,
    addHouseView,
    addReport,
    addSource,
  }=indexPageX  //导师首页昨日业务数据统计
  const {
    tableData,
    addCustomer,
    addHouseRank,
    tradeCommission,
    transaction,
    yesterdaysDeal,
    yesterdaysData,
    dealBrokerData,
    dealBrokerDataCharts,
    newHouseDistributionData,
    newHouseDistributionHouseCharts,
    newHouseDistributionBrokerCharts,
    saleSecondHouseData,
    saleSecondHouseHouseCharts,
    saleSecondHouseBrokerCharts,
    rentSecondHouseData,
    rentSecondHouseHouseCharts,
    rentSecondHouseBrokerCharts,
  }=indexPageX //导师首页排行榜
  const {
    initTrendData,
    dealHouseCharts,
    bussinessDataCharts,
    brokersNumberCharts,
  }=indexPageX  //导师首页数据走势图
  const handleChange=(value)=>{
    dispatch({
      type:"indexPageX/changeBrokenLine",
      payload:{value:value}
    })
    dispatch({
      type:"indexPageX/changeValue",
      payload:{
        defaultMentorOtion:value
      }
    })
  }
  const onChange=(checkedValues)=>{}
  const columns=[{
      title:"头像",
      width:100,
      render:(text,record,index)=>{
        return(
          <img src={!!record.logo?record.logo:img} width="50px" height="50px" style={{borderRadius:"50%"}}/>
        )
      }
    },{
      title:"姓名",
      dataIndex:"name",
      width:100,
    },{
      title:"数量",
      dataIndex:"count"
    },{
      title:"站位",
      dataIndex:'zhanwei',
      width:20,
      className:"zhanwei"
    }]
  const dealRadioButton=(e)=>{  //成交的RadioButton
    dispatch({
      type:"indexPageX/changeDealCharts",
      payload:{
        value:e.target.value
      }
    })
    if(e.target.value==='新房'){
      dispatch({
        type:"indexPageX/saveCurrentBrokerage",
        payload:{
          currentBrokerage:newHouseChartsData.brokerage
        }
      })
    }else if(e.target.value==='二手房'){
      dispatch({
        type:"indexPageX/saveCurrentBrokerage",
        payload:{
          currentBrokerage:secdSellChartsData.brokerage
        }
      })
    }else{
      dispatch({
        type:"indexPageX/saveCurrentBrokerage",
        payload:{
          currentBrokerage:secdRentOutChartsData.brokerage
        }
      })
    }
  }
  const bussinessRadioButton=(e)=>{ //业务的RadioButton
    dispatch({
      type:"indexPageX/showBussinessCharts",
      payload:{
        value:e.target.value
      }
    })
  }
  const handleCallBackOk=()=>{
    if(promptObj.todo==='closeModal'){
      dispatch({
        type:"indexPageX/togglePrompt",
        payload:{visible:false}
      })
    }
  }
  const handleCallBackCancel=()=>{}
  const brokerRankChange=(e)=>{
    dispatch({
      type:"indexPageX/showBrokerRankTable",
      payload:{
        value:e.target.value
      }
    })
  }
  const handleAgentBrokerListChange=(e)=>{
    dispatch({
      type:"indexPageX/getInitAgentRank",
      payload:{
        type:e.target.value
      }
    })
  }
  const handleAgentTrendChartChange=(e)=>{
    dispatch({
      type:"indexPageX/changeDefaultAgentTrendOtion",
      payload:{
        defaultAgentTrendOtion:e.target.value
      }
    })
    if(!!agentStartDate&&!!agentEndDate){
      dispatch({
        type:"indexPageX/getInitAgentTrendChartData",
        payload:{
          startDate:agentStartDate,
          endDate:agentEndDate,
          type:e.target.value
        }
      })
    }else{
      dispatch({
        type:"indexPageX/togglePrompt",
        payload:{
          title:"失败",
          description:"请选择日期!",
          visible:true,
          todo:"closeModal",
        }
      })
    }
  }
  const agentRangePickerChange=(date,dateString)=>{
    dispatch({
      type:"indexPageX/saveAgentTrendDate",
      payload:{
        agentStartDate:dateString[0],
        agentEndDate:dateString[1],
      }
    })
    dispatch({
      type:"indexPageX/getInitDatacharts",
      payload:{
        startDate:dateString[0],
        endDate:dateString[1],
        type:defaultMentorOtion,
      }
    })
  }
  const agentRangePickerChange_broker=(date,dateString)=>{
    dispatch({
      type:"indexPageX/saveAgentTrendDate",
      payload:{
        agentStartDate:dateString[0],
        agentEndDate:dateString[1],
      }
    })
    dispatch({
      type:"indexPageX/getInitAgentTrendChartData",
      payload:{
        startDate:dateString[0],
        endDate:dateString[1],
        type:defaultAgentTrendOtion,
      }
    })
  }
  const onSearch=()=>{
    dispatch({
      type:"indexPageX/getInitDatacharts",
      payload:{
        startDate:agentStartDate,
        endDate:agentEndDate,
        type:defaultMentorOtion,
      }
    })
  }
  console.log('addReport',addReport);
  return(
    <div className="indexpage">
      <PromptModal {...promptObj} onOk={handleCallBackOk} onCancel={handleCallBackCancel}/>
      {isBroker!==null?
        <div>
          {!isBroker?
            <div className="mentorIndex">
              <Panel title={companyInfos.companyName} className="panel"/>
                <Row gutter={8} className="indexpage_row">
                  <Col sm={12} md={12} lg={8} >
                    <Row className="pie brokersNumber">
                      <p className="title">经纪人数量 :{tutorBrokersData.brokers}人</p>
                      <PieCharts {...brokerTutorBrokers} {...PieChartsStyleAnZhu} onlyRefs={'isDrowChart2'} type={'pie'}/>
                    </Row>
                  </Col>
                  <Col sm={12} md={12} lg={8} >
                    <Row className="pie">
                      <p className="title-sell">二手房在售 :{secdSoldsData.houses}套</p>
                      <Row>
                        <Col>
                          <p className="saleDetails">已售{secdSoldsData.secdSoldNumber}套 无效{secdSoldsData.secdInvalidNumber}套</p>
                        </Col>
                        <Col>
                          <PieCharts {...brokerSecdSolds}onlyRefs={'isDrowChart2'} type={'pie'}{...PieChartsStyleAnZhuSecond}/>
                        </Col>
                      </Row>
                    </Row>
                  </Col>
                 <Col sm={12} md={12} lg={8}>
                   <Row className="pie">
                     <p className="title-rent">二手房出租 :{secdRentData.secdRentHouses}套</p>
                     <Row>
                       <Col>
                         <Row>
                           <Col>
                             <p className="saleDetails">已租{secdRentData.secdRentNumber}套 无效{secdRentData.secdRentInvalidNumber}套</p>
                           </Col>
                         </Row>
                       </Col>
                       <Col>
                         <PieCharts {...brokerSecdRent}
                             onlyRefs={'isDrowChart2'} type={'pie'}
                             {...PieChartsStyleAnZhuSecond}
                           />
                       </Col>
                    </Row>
                   </Row>
                  </Col>
                </Row>
              <Panel title="昨日业务数据" className="panel"/>
              <Row gutter={6} className="indexpage_row">
                <Col sm={24} md={12} lg={6} >
                  <Card >
                    <Row className="indexpage_row">
                      <Col span={9}>
                        <div className="addNewBroker"></div>
                      </Col>
                      <Col span={15}>
                        <Row className="indexpage_row">
                          <Col><span className="number">{addBroker.addBroker}</span></Col>
                          <Col><span className="title">新增经纪人</span></Col>
                        </Row>
                      </Col>
                    </Row>
                    <div className="dataInfos"><span className="detail">当前{addBroker.currentNumber}人</span></div>
                  </Card>
                </Col>
                <Col sm={24} md={12} lg={6} >
                  <Card >
                    <Row className="indexpage_row">
                      <Col span={9}>
                        <div className="addNewHouse"></div>
                      </Col>
                      <Col span={15}>
                        <Row className="indexpage_row">
                          <Col><span className="number">{addHouse.addHouses}</span></Col>
                          <Col><span className="title">新增房源</span></Col>
                        </Row>
                      </Col>
                    </Row>
                    <div className="dataInfos">
                      <span className="detail">
                        (出售{addHouse.addSellHouse} 出租{addHouse.addRentHouse})
                      </span>
                    </div>
                  </Card>
                </Col>
                <Col sm={24} md={12} lg={6} >
                  <Card >
                    <Row className="indexpage_row">
                      <Col span={9}>
                        <div className="addNewCustomer"></div>
                      </Col>
                      <Col span={15}>
                        <Row className="indexpage_row">
                          <Col><span className="number">{addSource.addSource}</span></Col>
                          <Col><span className="title">新增客源</span></Col>
                        </Row>
                      </Col>
                    </Row>
                    <div className="dataInfos">
                      <span className="detail">
                        (求购{addSource.buysNumber} 求租{addSource.seekingRent} 购租{addSource.buySeekNumber})
                      </span>
                    </div>
                  </Card>
                </Col>
                <Col sm={24} md={12} lg={6} >
                  <Card >
                    <Row className="indexpage_row">
                      <Col span={9}>
                        <div className="viewHouse"></div>
                      </Col>
                      <Col span={15}>
                        <Row className="indexpage_row">
                          <Col><span className="number">{addHouseView.houseViews}</span></Col>
                          <Col><span className="title">预约看房</span></Col>
                        </Row>
                      </Col>
                    </Row>
                    <div className="dataInfos">
                      <span className="detail">
                        (新房{addHouseView.newHouse} 二手房{addHouseView.secHouse} 出租{addHouseView.rentHouse})
                      </span>
                    </div>
                  </Card>
                </Col>
                <Col sm={24} md={12} lg={6} >
                  <Card >
                    <Row className="indexpage_row">
                      <Col span={9}>
                        <div className="reportCustomer"></div>
                      </Col>
                      <Col span={15}>
                        <Row className="indexpage_row">
                          <Col><span className="number">{!!addReport?addReport:0}</span></Col>
                          <Col><span className="title">报备客户</span></Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col sm={24} md={12} lg={6} >
                  <Card >
                    <Row className="indexpage_row">
                      <Col span={9}>
                        <div className="tabkeCustomer"></div>
                      </Col>
                      <Col span={15}>
                        <Row className="indexpage_row">
                          <Col><span className="number">{addBrokerView.houseViews}</span></Col>
                          <Col><span className="title">客户带看</span></Col>
                        </Row>
                      </Col>
                    </Row>
                    <div className="dataInfos">
                      <span className="detail">
                        (新房{addBrokerView.newHouse} 二手{addBrokerView.secHouse} 出租{addBrokerView.rentHouse})
                      </span>
                    </div>
                  </Card>
                </Col>
                <Col sm={24} md={12} lg={6} >
                  <Card >
                    <Row className="indexpage_row">
                      <Col span={9}>
                        <div className='newHouseFollow'></div>
                    </Col>
                      <Col span={15}>
                        <Row className="indexpage_row">
                          <Col><span className="number">{addCustomerFollow}</span></Col>
                          <Col><span className="title">新房跟进</span></Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
              <Row className="indexpage_row" gutter={16}>
                <Col sm={24} md ={16} lg={16}>
                  <div className="bar">
                    <Row className="indexpage_data">
                      <Col>
                        <p className="title-data">数据走势图</p>
                        <Form>
                          <div className="indexpage_row">
                            <div className="form_item">
                              <FormItem>
                                <RangePicker onChange={agentRangePickerChange}
                                  defaultValue={[moment(agentStartDate, dateFormat), moment(agentEndDate, dateFormat)]}
                                  format={dateFormat}
                                  />
                              </FormItem>
                            </div>
                            <div className="form_item">
                              <FormItem>
                                <Select size="large" defaultValue="成交房源" style={{ width:150}} onChange={handleChange}>
                                  <Option value="成交房源">成交房源</Option>
                                  <Option value="业务数据">业务数据</Option>
                                  <Option value="经纪人数量">经纪人数量</Option>
                                </Select>
                              </FormItem>
                            </div>
                            <div className="form_item">
                              <Button type="ghost" onClick={onSearch}>查询</Button>
                            </div>
                          </div>
                        </Form>
                      </Col>
                      <Col>
{/*                        <BarCharts {...initTrendData} onlyRefs={'isDrowChart11'} type={'bar'} widths={'700px'}/>*/}
                        <div id="barCharts" style={{height:"350px"}}></div>
                      </Col>
                    </Row>
                  </div>
                </Col>
                <Col span={8}>
                  <DxPanel title="本月经纪人排行榜" className="rank">
                    <RadioGroup defaultValue="成交" size="large" onChange={brokerRankChange}>
                      <RadioButton value="成交">成交</RadioButton>
                      <RadioButton value="拓房">拓房</RadioButton>
                      <RadioButton value="拓客">拓客</RadioButton>
                      <RadioButton value="佣金收益">佣金收益</RadioButton>
                    </RadioGroup>
                    <Table
                      bordered={false}
                      showHeader={false}
                      columns={columns}
                      dataSource={tableData}
                      pagination={false}
                      scroll={{ y: 300 }}
                      />
                  </DxPanel>
                </Col>
              </Row>
              <Panel title ="昨日成交数据"/>
              <div className="yesterdaysDeal_container">
                <div className="pie yesterdaysDeal rightMargin">
                  <p className="title">昨日成交 : {yesterdaysData.transactionNumber} 套</p>
                  <Row>
                    <Col span={6}>
                      <div className="yesterdayDeal">
                        <span className="dealTitle">成交佣金</span>
                        <span className="dealMoney">{yesterdaysData.commission}元</span>
                      </div>
                    </Col>
                    <Col span={18}>
                      <PieCharts {...yesterdaysDeal}
                        onlyRefs={'isDrowChart2'} type={'pie'}
                        {...PieChartsStyleDealCommission}
                      />
                    </Col>
                  </Row>
                </div>
                <div className="pie yesterdaysDeal">
                  <p className="title-sell">成交经纪人 : {dealBrokerData.dealBrokerNumber} 人</p>
                  <PieCharts {...dealBrokerDataCharts}
                    onlyRefs={'isDrowChart2'} type={'pie'}
                    {...PieChartsStyleDealBroker}
                    />
                </div>
                <div className="pie yesterdaysDeal newHouseSell">
                  <p className="title-rent">新房分销 : {newHouseDistributionData.houseNumber} 套</p>
                    <Row>
                      <Col span={6}>
                        <div className="yesterdayDeal">
                          <span className="dealTitle">成交佣金</span>
                          <span className="dealMoney">{newHouseDistributionData.commission}元</span>
                        </div>
                      </Col>
                      <Col span={18}>
                        <Row>
                          <Col span={12}>
                              <PieCharts {...newHouseDistributionHouseCharts}
                                  onlyRefs={'isDrowChart2'} type={'pie'}
                                  {...PieChartsStyleNewHouseDistribution}
                                />
                          </Col>
                          <Col span={12}>
                            <PieCharts {...newHouseDistributionBrokerCharts}
                                onlyRefs={'isDrowChart2'} type={'pie'}
                                {...PieChartsStyleNewHouseDistribution}
                              />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                </div>
                <div className="pie yesterdaysDeal secondHouseSell">
                  <p className="title">二手房出售 : {saleSecondHouseData.saleSecondNumber} 套</p>
                    <Row>
                      <Col span={6}>
                        <div className="yesterdayDeal">
                          <span className="dealTitle">成交佣金</span>
                          <span className="dealMoney">{saleSecondHouseData.commission}元</span>
                        </div>
                      </Col>
                      <Col span={18}>
                        <Row>
                          <Col span={12}>
                              <PieCharts {...saleSecondHouseHouseCharts}
                                  onlyRefs={'isDrowChart2'} type={'pie'}
                                  {...PieChartsStyleNewHouseDistribution}
                                />
                          </Col>
                          <Col span={12}>
                            <PieCharts {...saleSecondHouseBrokerCharts}
                                onlyRefs={'isDrowChart2'} type={'pie'}
                                {...PieChartsStyleNewHouseDistribution}
                              />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                </div>
                <div className="pie yesterdaysDeal">
                  <p className="title-sell">二手房出租 : {rentSecondHouseData.rentSecondNumber} 套</p>
                    <Row>
                      <Col span={6}>
                        <div className="yesterdayDeal">
                          <span className="dealTitle">成交佣金</span>
                          <span className="dealMoney">{rentSecondHouseData.commission}元</span>
                        </div>
                      </Col>
                      <Col span={18}>
                        <Row>
                          <Col span={24}>
                            <PieCharts {...rentSecondHouseBrokerCharts}
                                onlyRefs={'isDrowChart2'} type={'pie'}
                                {...PieChartsStyleNewHouseDistribution}
                              />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                </div>
              </div>
            </div>
              :
              <div className="brokerIndex">
                <Panel title="个人业绩"/>
                <Row className="indexpage_row" gutter={16}>
                  <Col span={9}>
                    <div className="dealData">
                      <p className="title">本月成交数据</p>
                        <Row>
                          <Col span={10}>
                            <div className="detailMessage">
                              <Row>
                                <Col>
                                  <span>本月成交 &nbsp;{basicData.transaction}套</span>
                                </Col>
                                <Col>
                                  <span>本月佣金 &nbsp;{basicData.brokerage}元</span>
                                </Col>
                                <Col>
                                  <span>累计成交 &nbsp;{basicData.transactionTotal}套</span>
                                </Col>
                                <Col>
                                  <span>累计佣金 &nbsp;{basicData.brokerage}元</span>
                                </Col>
                                <Col>
                                  <span>上次开单 &nbsp;{basicData.lastTime}</span>
                                </Col>
                                <Col>
                                  <span>佣金 &nbsp;{currentBrokerage}元</span>
                                </Col>
                              </Row>
                            </div>
                          </Col>
                          <Col span={14}>
                            <Row>
                              <Col>
                                <RadioGroup onChange={dealRadioButton} defaultValue="新房">
                                  <RadioButton value="新房">新房</RadioButton>
                                  <RadioButton value="二手房">二手房</RadioButton>
                                  <RadioButton value="出租">出租</RadioButton>
                                </RadioGroup>
                              </Col>
                              <Col>
                                <PieCharts {...charts}
                                  {...PieChartsStyle_personalData}
                                  onlyRefs={'isDrowChart2'} type={'pie'}
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                    </div>
                  </Col>
                  <Col span={9}>
                    <div className="businessData">
                      <p className="title">本月业务数据</p>
                        <Row>
                          <Col span={8}>
                            <div className="detailMessage">
                              <Row>
                                <Col>
                                  <span>拓展房源 {businessCountForMonthData.addHouse}</span>
                                </Col>
                                <Col>
                                  <span>拓展客源 {businessCountForMonthData.addCustomer}</span>
                                </Col>
                                <Col>
                                  <span>客户跟进 {businessCountForMonthData.followUp}</span>
                                </Col>
                                <Col>
                                  <span>新房报备 {businessCountForMonthData.report}</span>
                                </Col>
                                <Col>
                                  <span>预约看房 {businessCountForMonthData.appointment}</span>
                                </Col>
                                <Col>
                                  <span>客户带看 {businessCountForMonthData.view}</span>
                                </Col>
                              </Row>
                            </div>
                          </Col>
                          <Col span={16}>
                            <Row>
                              <Col>
                                <RadioGroup onChange={bussinessRadioButton} defaultValue="拓房">
                                  <RadioButton value="拓房">拓房</RadioButton>
                                  <RadioButton value="新房报备">新房报备</RadioButton>
                                  <RadioButton value="预约看房">预约看房</RadioButton>
                                  <RadioButton value="客户带看">客户带看</RadioButton>
                                </RadioGroup>
                              </Col>
                              <Col>
                                <PieCharts {...defaultBussinessCharts}
                                  {...PieChartsStyle_personalBussinessData}
                                  onlyRefs={'isDrowChart2'} type={'pie'}
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div className="brokerInfos">
                      <Row>
                        <Col offset={8}>
                          <img src={!!brokerInfos.logo?brokerInfos.logo:img} width="60px" height="60px" style={{borderRadius:"50%"}}/>                        
                        </Col>
                        <Col offset={8}><span>姓名：{brokerInfos.name}</span></Col>
                        <Col offset={8}><span>联系电话：{brokerInfos.phone}</span></Col>
                        <Col offset={8}><span>累计出售：{brokerInfos.newHouseCount+brokerInfos.secdSell}套</span></Col>
                        <Col offset={8}><span>累计出租：{brokerInfos.secdRentOut}套</span></Col>
                        <Col offset={8}><span>佣金收益：{brokerInfos.brokerage}元</span></Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
                <Row className="indexpage_row" gutter={16}>
                  <Col span={18}>
                    <div className="bar">
                      <Row>
                        <Col>
                          <p className="title-data">数据走势图</p>
                          <Form>
                            <Row className="indexpage_row">
                              <Col span={7}>
                                <FormItem>
                                  <RangePicker onChange={agentRangePickerChange_broker}
                                    defaultValue={[moment(agentStartDate, dateFormat), moment(agentEndDate, dateFormat)]}
                                    format={dateFormat}
                                    />
                                </FormItem>
                              </Col>
                              <Col span={17}>
                                <FormItem>
                                  <RadioGroup
                                    defaultValue="成交"
                                    size="large"
                                    className="data_RadioButton"
                                    onChange={handleAgentTrendChartChange}
                                  >
                                    <RadioButton value="成交">成交</RadioButton>
                                    <RadioButton value="拓房">拓房</RadioButton>
                                    <RadioButton value="拓客">拓客</RadioButton>
                                    <RadioButton value="跟进">客户跟进</RadioButton>
                                    <RadioButton value="新房报备受理">新房报备</RadioButton>
                                    <RadioButton value="预约">预约看房</RadioButton>
                                    <RadioButton value="看房">客户带看</RadioButton>
                                  </RadioGroup>
                                </FormItem>
                              </Col>
                            </Row>
                          </Form>
                        </Col>
                        <Col>
                          <div id="brokerTrendChartData" style={{width:"auto",height:"350px"}}></div>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col span={6}>
                    <DxPanel title="本月经纪人排行榜">
                      <RadioGroup
                        defaultValue="成交"
                        size="large"
                        onChange={handleAgentBrokerListChange}
                        className="rank_RadioButton"
                        >
                        <RadioButton value="成交">成交</RadioButton>
                        <RadioButton value="拓房">拓房</RadioButton>
                        <RadioButton value="拓客">拓客</RadioButton>
                      </RadioGroup>
                      <Table
                        bordered={false}
                        showHeader={false}
                        columns={columns}
                        dataSource={rankingList}
                        pagination={false}
                        scroll={{ y: 300 }}
                        />
                    </DxPanel>
                  </Col>
                </Row>
              </div>
          }
        </div>
        :
        <div className="mentorDataLoading">
          <Spin />
        </div>
      }
    </div>
  )
}
function mapStateToProps({indexPageX}){
  return{indexPageX}
}
export default connect(mapStateToProps)(Form.create({})(IndexPageX))
