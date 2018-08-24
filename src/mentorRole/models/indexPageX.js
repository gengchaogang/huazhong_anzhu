import {
  query,
  getInitInfoFetch,
  getInitDealDataFetch,
  getInitBussinessDataFetch,
  getInitAnzhuDataFetch,
  getInitYesterdayBussinessDataFetch,
  getInitYesterdayDealDataFetch,
  getinitBrokerAgentRankFetch,
  getInitDatachartsFetch,
  getInitBrokerIdInfosFetch,
  getInitAgentRankFetch,
  getInitAgentTrendChartDataFetch,
} from '../services/indexPageX';
import lodash from 'lodash';
import {parse} from 'qs';
import echarts from 'echarts'
var currentdate;
const myDate=new Date();
const myDate_Start=new Date();
myDate_Start.setDate(myDate_Start.getDate()-30)
function getNowFormatDate(date) {
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
      month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
  }
  currentdate = year + seperator1 + month + seperator1 + strDate
  return currentdate;
}

let interval=null;
const initState={
  barChartsWidth:'800px',
  isBroker:null,
  tableData:[],
  companyInfos:{
    companyName:''
  },

  basicData:{},
  currentBrokerage:null,
  charts:{},
  initTrendData:{},
  newHouseChartsData:{},
  secdRentOutChartsData:{},
  secdSellChartsData:{},
  businessCountForMonthData:{},
  addHouseDtailCharts:{},
  reportDtailCharts:{},
  appointmentDtailCharts:{},
  viewDtailCharts:{},
  defaultBussinessCharts:{},
  brokerInfos:{},
  rankingList:[],
  transactionListDataCharts:[], //经纪人数据走势图
  agentStartDate:getNowFormatDate(myDate_Start),
  agentEndDate:getNowFormatDate(new Date()),
  defaultAgentTrendOtion:'成交',
  //以上为经济公司首页统计
  secdRentData:{},
  brokerSecdRent:{},
  secdSoldsData:{},
  brokerTutorBrokers:{},
  tutorBrokersData:{},
  brokerSecdSolds:{},
  //以上为导师首页安住经济公司数据

  //以下为导师首页昨日业务数据
  addBroker:{},
  addBrokerView:{},
  addCustomerFollow:null,
  addHouse:{},
  addHouseView:{},
  addReport:null,
  addSource:{},
  //一下为导师平台排行榜数据
  addCustomer:[],
  addHouseRank:[],
  tradeCommission:[],
  transaction:[],
  //以下为昨日成交数据统计
  yesterdaysDeal:{},
  yesterdaysData:{},
  dealBrokerData:{},
  dealBrokerDataCharts:{},
  newHouseDistributionData:{},
  newHouseDistributionHouseCharts:{},
  newHouseDistributionBrokerCharts:{},
  saleSecondHouseData:{},
  saleSecondHouseHouseCharts:{},
  saleSecondHouseBrokerCharts:{},
  rentSecondHouseData:{},
  rentSecondHouseHouseCharts:{},
  rentSecondHouseBrokerCharts:{},
  //以下为导师数据走势图数据
  dealHouseCharts:{},
  bussinessDataCharts:{},
  brokersNumberCharts:{},
  defaultMentorOtion:"成交房源",
  //以上为导师首页统计
  isDrowChart1:{
    isDrow:false,
    xData:[],
    yData:[],
    mainTitleLegend:'',
  },
  isDrowChart5:{
    isDrow:false,
    series:[],
    mainTitleLegend:'',
  },
  isDrowChart4:{
    isDrow:false,
    series:[],
    mainTitleLegend:'',
  },
  promptObj:{
     visible:false,
     description:'',
     title:'',
     promptFor:'default',
     okText:'确定',
     type:'',
     todo:'',
  },
}
export default {
  namespace:'indexPageX',
  state:initState,
  subscriptions: {
   setup({ dispatch, history }) {
     history.listen(location => {
       if (location.pathname === '/indexPage'){
         dispatch({
           type:"setDefaultState"
         })
           dispatch({
             type:'initComponent',
             payload:location.pathname,
           })
        }
      })
    }
  },
  effects:{
    //初始化组件状态
    *initComponent({payload},{put}){
      const pathname=payload
        yield put({
          type:'checkMainState',
          payload:{pathname:pathname}
        })
    },
    *checkMainState({payload},{select,put}){
      const isBroker=yield select(({main})=>main.isBroker);
      const pathname=payload.pathname;
      if(isBroker!==null){
        const pathname=payload;
        yield put({
          type:'chooseFetchSendByUser',
          payload:{
            isBroker:isBroker,
            ...pathname
          },
        })
      }
    },
    *chooseFetchSendByUser({payload},{call,put,select}){
      const startDate=yield select(({indexPageX})=>indexPageX.agentStartDate);
      const endDate=yield select(({indexPageX})=>indexPageX.agentEndDate);
      const isBroker=payload.isBroker;
      const pathname=payload.pathname;
      yield put({
        type:"saveUserType",
        payload:{
          isBroker:isBroker
        }
      })
      if(isBroker&&pathname==='/indexPage'){
        // clearInterval(interval)
        yield put({type:"getInitDealData"})
        yield put({type:"getInitBussinessData"})
        yield put({type:"getInitBrokerIdInfos"})
        yield put({type:"getInitAgentRank",payload:{type:"成交"}})
        yield put({
          type:"getInitAgentTrendChartData",
          payload:{
            type:"成交",
            startDate:startDate,
            endDate:endDate
          }
        })
      }else if(isBroker===false&&pathname==='/indexPage'){
        // clearInterval(interval)
        yield put({type:"getInitInfo"})
        yield put({type:"getInitAnzhuData"})
        yield put({type:"getInitYesterdayBussinessData"})
        yield put({type:"getinitBrokerAgentRank"})
        yield put({type:"getInitYesterdayDealData"})
        yield put({
          type:"getInitDatacharts",
          payload:{startDate:startDate,endDate:endDate}
        })
      }

    },
    *getInitInfo({payload},{call,put,select}){  //获取企业名称信息
      const {data}=yield call(getInitInfoFetch,{...payload});
      if(!!data&&data.status==='success'){
        const companyInfos=data.data;
        yield put({
          type:"saveCompanyInfos",
          payload:{
            companyInfos:companyInfos
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:`获取统计数据失败:${data.message}`,
          // description:`获取数据走势图数据失败,请重新刷新页面!`,
          visible:true,
          todo:"closeModal"
        }})
      }
    },

    *getInitDatacharts({payload},{call,put,select}){ //导师首页 数据走势图
      const defaultMentorOtion=yield select(({indexPageX})=>indexPageX.defaultMentorOtion);
      const {data}=yield call(getInitDatachartsFetch,{...payload})
      if(!!data&&data.status==='success'){
        var mycharts=echarts.init(document.getElementById('barCharts'));
        const transactions=data.data.transactions;
        const bussinessData=data.data.businessDataCharts;
        const brokersNumber=data.data.brokersNumber;
        if(defaultMentorOtion==='成交房源'){
          var x=[];
          var y1=[];  //新房分销
          var y2=[];  //二手房出租
          var y3=[];  //二手房出售
          if(transactions.length){
            transactions.map(item=>{
              x.push(item.dateTime);
              y1.push(item.newHouseDistribution);
              y2.push(item.secondRent);
              y3.push(item.secondSell);
            })
          }
          var option = {
            tooltip: {
              trigger: 'axis',
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                  type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              },
            },
            legend: {
              show:true,
              data: ["新房分销","二手房出租","二手房出售"],
            },
            xAxis: {
              axisLine:{
                lineStyle:{
                  color:'#000',
                  width:1
                }
              },
              type: 'category',
              name: 'x',
              splitLine: {show: false},
              data: x
            },
            grid: {
              left: '8%',
              right: '4%',
              bottom: '40%',
              height:"160px",
              containLabel: false,
            },
            yAxis: {
              axisLabel: {
                textStyle:{
                  color:"#000"
                }
              },
              type: 'value',
              name: 'y',
              axisLine:{
                lineStyle:{
                  textStyle:"#000",
                  color:'#000',
                  width:1
                }
              },
            },
            series: [
              {
                name:"新房分销",
                type: 'bar',
                data:y1
              },
              {
                name:'二手房出租',
                type: 'bar',
                data:y2
              },
              {
                name:'二手房出售',
                type: 'bar',
                data:y3
              },
            ]
          };
          mycharts.setOption(option,true);
          // window.addEventListener("resize",function(){
          //   mycharts.resize();
          // });
        }
        else if(defaultMentorOtion==='业务数据'){
          var x=[];
          var y1=[];  //预约看房
          var y2=[];  //客户跟进
          var y3=[];  //预约带看
          var y4=[];  //报备
          if(bussinessData.length){
            bussinessData.map(item=>{
              x.push(item.dateTime);
              y1.push(item.brokerView);
              y2.push(item.customerFollow);
              y3.push(item.houseView);
              y4.push(item.nhReport);
            })
          }
          var option = {
            tooltip: {
              trigger: 'axis',
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                  type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              },
            },
            legend: {
              show:true,
              data: ["预约看房","客户跟进","预约带看","报备"],
            },
            xAxis: {
              axisLine:{
                lineStyle:{
                  color:'#000',
                  width:1
                }
              },
              type: 'category',
              name: 'x',
              splitLine: {show: false},
              data: x
            },
            grid: {
              left: '8%',
              right: '4%',
              bottom: '40%',
              height:"160px",
              containLabel: false,
              // left: '3%',
              // right: '4%',
              // bottom: '40%',
              // height:"160px",
              // containLabel: false,
            },
            yAxis: {
              axisLabel: {
                textStyle:{
                  color:"#000"
                }
              },
              type: 'value',
              name: 'y',
              axisLine:{
                lineStyle:{
                  textStyle:"#000",
                  color:'#000',
                  width:1
                }
              },
            },
            series: [
              {
                name:"预约看房",
                type: 'bar',
                data:y1
              },
              {
                name:'客户跟进',
                type: 'bar',
                data:y2
              },
              {
                name:'预约带看',
                type: 'bar',
                data:y3
              },
              {
                name:'报备',
                type: 'bar',
                data:y4
              },
            ]
          };
          mycharts.setOption(option,true);
          // window.addEventListener("resize",function(){
          //   mycharts.resize();
          // });
        }
        else if(defaultMentorOtion==="经纪人数量"){
          var x=[];
          var y1=[];  //  经纪人总数
          var y2=[];  //今日新增
          if(brokersNumber.length){
              brokersNumber.map(item=>{
                x.push(item.dateTime);
                y1.push(item.brokersTotle);
                y2.push(item.addBroker);
              })
          }
          var option = {
                    tooltip: {
                      trigger: 'axis',
                      axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                      },
                    },
                    legend: {
                        show:true,
                        data: ['经纪人总数','今日新增经纪人'],
                    },
                    xAxis: {
                      axisLine:{
                        lineStyle:{
                            color:'#000',
                            width:1
                        }
                      },
                        type: 'category',
                        name: 'x',
                        splitLine: {show: false},
                        data: x
                    },
                    grid: {
                        left: '8%',
                        right: '4%',
                        bottom: '40%',
                        height:"160px",
                        containLabel: false,
                    },
                    yAxis: {
                      axisLabel: {
                        textStyle:{
                          color:"#000"
                        }
                      },
                        type: 'value',
                        name: 'y',
                        axisLine:{
                          lineStyle:{
                              textStyle:"#000",
                              color:'#000',
                              width:1
                          }
                        },
                    },
                    series: [
                        {
                            name:"经纪人总数",
                            type: 'bar',
                            data:y1
                        },
                        {
                            name:'今日新增经纪人',
                            type: 'bar',
                            data:y2
                        },
                    ]
                };
          mycharts.setOption(option,true);
          // window.addEventListener("resize",function(){
          //   mycharts.resize();
          // });
        }
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:`获取数据走势图数据失败,请重新刷新页面!`,
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *getInitYesterdayDealData({payload},{call,put}){  //导师首页昨日成交统计图
      const {data}=yield call(getInitYesterdayDealDataFetch,{...payload})
      if(!!data&&data.status==='success'){
        const yesterdaysData=data.data.yesterdaysData;
        const yesterdaysDeal={
          color:['#85DB9F','#F7877A'],
          mainTitleLegend:{
            padding:[10,0,0,0],
            orient: 'horizontal',
            x: 'center',
            data:[`新房`,`二手`,`出租`],
              formatter:function(name){
                var oa = yesterdaysDeal.series[0].data;
                for(var i = 0; i < yesterdaysDeal.series[0].data.length; i++){
                  if(name==oa[i].name){
                    return name+' '+oa[i].value
                  }
                }
              }
          },
          series:[
            {
              center: [150, 120],
              name: '昨日成交',
              type: 'pie',
              radius : '30%',
              avoidLabelOverlap: false,
              data:[
                {value:yesterdaysData.newHouses.newHouses, name:`新房`,key:yesterdaysData.newHouses.commission},
                {value:yesterdaysData.secdHouses.secdHouses, name:`二手`,key:yesterdaysData.secdHouses.commission},
                {value:yesterdaysData.rentHouses.rentHouses, name:`出租`,key:yesterdaysData.rentHouses.commission},
              ],
              label: {
                normal: {
                  show:true,
                  formatter:function(name){
                    var oa = yesterdaysDeal.series[0].data;
                    for(var i = 0; i < yesterdaysDeal.series[0].data.length; i++){
                            if(name.name==oa[i].name){
                              return name.name+'\n 佣金 '+oa[i].key+"元"
                            }
                    }
                  },
                  position: 'outside',
                  textStyle: {
                     color: '',
                     fontSize: 12
                  }
                },
              },
            }
          ]
        }
        const dealBrokerData=data.data.dealBroker;
        const dealBrokerDataCharts={
          color:['#85DB9F','#F7877A'],
          mainTitleLegend:{
            padding:[10,0,0,0],
            orient: 'horizontal',
            x: 'center',
            data:[`自有经纪人`,`挂靠经纪人`,],
              formatter:function(name){
                var oa = dealBrokerDataCharts.series[0].data;
                for(var i = 0; i < dealBrokerDataCharts.series[0].data.length; i++){
                        if(name==oa[i].name){
                          return name+' '+oa[i].value
                        }
                }
              }
          },
          series:[
            {
              center: [200, 120],
              name: '成交经纪人',
              type: 'pie',
              radius : '30%',
              avoidLabelOverlap: false,
              data:[
                {value:dealBrokerData.selfBroker.selfBrokerNumber, name:`自有经纪人`,key:dealBrokerData.selfBroker.commission},
                {value:dealBrokerData.jionBroker.jionBrokerNumber, name:`挂靠经纪人`,key:dealBrokerData.jionBroker.commission},
              ],
              label: {
                normal: {
                  show:true,
                  formatter:function(name){
                    var oa = dealBrokerDataCharts.series[0].data;
                    for(var i = 0; i < dealBrokerDataCharts.series[0].data.length; i++){
                            if(name.name==oa[i].name){
                              return name.name+'\n 佣金 '+oa[i].key+'元'
                            }
                    }
                  },
                  position: 'outside',
                  textStyle: {
                     color: '',
                     fontSize: 12
                  }
                },
              },
            }
          ]
        }
        const newHouseDistributionData=data.data.newHouseDistribution;
        const newHouseDistributionHouseCharts={
          color:['#85DB9F','#F7877A'],
          mainTitleLegend:{
            padding:[10,0,0,0],
            orient: 'vertical',
            x: 'center',
            data:['住宅','商铺','写字楼'],
            formatter:function(name){
              var oa = newHouseDistributionHouseCharts.series[0].data;
              for(var i = 0; i < newHouseDistributionHouseCharts.series[0].data.length; i++){
                      if(name==oa[i].name){
                        return name+' '+oa[i].value+'套'
                      }
              }
            }
          },
          series:[
            {
              center: [75, 135],
              name: '新房分销',
              type: 'pie',
              radius : '45%',
              avoidLabelOverlap: false,
              data:[
                {value:newHouseDistributionData.houses, name:'住宅'},
                {value:newHouseDistributionData.shops, name:'商铺'},
                {value:newHouseDistributionData.offices, name:'写字楼'},
              ],
              label: {
                normal: {
                  show:false,
                  }
                },
              },
          ]
        }
        const newHouseDistributionBrokerCharts={
          color:['#85DB9F','#F7877A'],
          mainTitleLegend:{
            padding:[10,0,0,0],
            orient: 'vertical',
            x: 'center',
            data:['自有经纪人','挂靠经纪人'],
            formatter:function(name){
              var oa = newHouseDistributionBrokerCharts.series[0].data;
              for(var i = 0; i < newHouseDistributionBrokerCharts.series[0].data.length; i++){
                      if(name==oa[i].name){
                        return name+' '+oa[i].value+'套'
                      }
              }
            }
          },
          series:[
            {
              center: [75, 135],
              name: '新房分销',
              type: 'pie',
              radius : '45%',
              avoidLabelOverlap: false,
              data:[
                {value:newHouseDistributionData.selfBroker, name:'自有经纪人'},
                {value:newHouseDistributionData.jionBroker, name:'挂靠经纪人'},
              ],
              label: {
                normal: {
                  show:false,
                  }
                },
              },
          ]
        }
        const saleSecondHouseData=data.data.saleSecondHouse;
        const saleSecondHouseHouseCharts={
          color:['#85DB9F','#F7877A'],
          mainTitleLegend:{
            padding:[10,0,0,0],
            orient: 'vertical',
            x: 'center',
            data:['住宅','商铺','写字楼'],
            formatter:function(name){
              var oa = saleSecondHouseHouseCharts.series[0].data;
              for(var i = 0; i < saleSecondHouseHouseCharts.series[0].data.length; i++){
                      if(name==oa[i].name){
                        return name+' '+oa[i].value+'套'
                      }
              }
            }
          },
          series:[
            {
              center: [75, 135],
              name: '二手房出售',
              type: 'pie',
              radius : '45%',
              avoidLabelOverlap: false,
              data:[
                {value:saleSecondHouseData.houses, name:'住宅'},
                {value:saleSecondHouseData.shops, name:'商铺'},
                {value:saleSecondHouseData.offices, name:'写字楼'},
              ],
              label: {
                normal: {
                  show:false,
                  }
                },
              },
          ]
        }
        const saleSecondHouseBrokerCharts={
          color:['#85DB9F','#F7877A'],
          mainTitleLegend:{
            padding:[10,0,0,0],
            orient: 'vertical',
            x: 'center',
            data:['自有经纪人','挂靠经纪人'],
            formatter:function(name){
              var oa = saleSecondHouseBrokerCharts.series[0].data;
              for(var i = 0; i < saleSecondHouseBrokerCharts.series[0].data.length; i++){
                      if(name==oa[i].name){
                        return name+' '+oa[i].value+'套'
                      }
              }
            }
          },
          series:[
            {
              center: [75, 135],
              name: '二手房出售',
              type: 'pie',
              radius : '45%',
              avoidLabelOverlap: false,
              data:[
                {value:saleSecondHouseData.selfBroker, name:'自有经纪人'},
                {value:saleSecondHouseData.jionBroker, name:'挂靠经纪人'},
              ],
              label: {
                normal: {
                  show:false,
                  }
                },
              },
          ]
        }
        const rentSecondHouseData=data.data.rentSecondHouse;
        const rentSecondHouseHouseCharts={
          color:['#85DB9F','#F7877A'],
          mainTitleLegend:{
            padding:[10,0,0,0],
            orient: 'vertical',
            x: 'center',
            data:['住宅','商铺','写字楼'],
            formatter:function(name){
              var oa = rentSecondHouseHouseCharts.series[0].data;
              for(var i = 0; i < rentSecondHouseHouseCharts.series[0].data.length; i++){
                      if(name==oa[i].name){
                        return name+' '+oa[i].value+'套'
                      }
              }
            }
          },
          series:[
            {
              center: [75, 135],
              name: '二手房出租',
              type: 'pie',
              radius : '45%',
              avoidLabelOverlap: false,
              data:[
                {value:rentSecondHouseData.houses, name:'住宅'},
                {value:rentSecondHouseData.shops, name:'商铺'},
                {value:rentSecondHouseData.offices, name:'写字楼'},
              ],
              label: {
                normal: {
                  show:false,
                  }
                },
              },
          ]
        }
        const rentSecondHouseBrokerCharts={
          color:['#85DB9F','#F7877A'],
          mainTitleLegend:{
            padding:[10,0,0,0],
            orient: 'vertical',
            x: 'center',
            data:['自有经纪人','挂靠经纪人'],
            formatter:function(name){
              var oa = rentSecondHouseBrokerCharts.series[0].data;
              for(var i = 0; i < rentSecondHouseBrokerCharts.series[0].data.length; i++){
                      if(name==oa[i].name){
                        return name+' '+oa[i].value+'套'
                      }
              }
            }
          },
          series:[
            {
              center: [75, 135],
              name: '二手房出租',
              type: 'pie',
              radius : '45%',
              avoidLabelOverlap: false,
              data:[
                {value:rentSecondHouseData.selfBroker, name:'自有经纪人'},
                {value:rentSecondHouseData.jionBroker, name:'挂靠经纪人'},
              ],
              label: {
                normal: {
                  show:false,
                  }
                },
              },
          ]
        }
        yield put ({
          type:"saveAnzhuData",
          payload:{
            yesterdaysDeal:yesterdaysDeal,
            yesterdaysData:yesterdaysData,
            dealBrokerData:dealBrokerData,
            dealBrokerDataCharts:dealBrokerDataCharts,
            newHouseDistributionData:newHouseDistributionData,
            newHouseDistributionHouseCharts:newHouseDistributionHouseCharts,
            newHouseDistributionBrokerCharts:newHouseDistributionBrokerCharts,
            saleSecondHouseData:saleSecondHouseData,
            saleSecondHouseHouseCharts:saleSecondHouseHouseCharts,
            saleSecondHouseBrokerCharts:saleSecondHouseBrokerCharts,
            rentSecondHouseData:rentSecondHouseData,
            rentSecondHouseHouseCharts:rentSecondHouseHouseCharts,
            rentSecondHouseBrokerCharts:rentSecondHouseBrokerCharts,
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          // description:`获取统计数据失败:${data.message}`,
          description:`获取昨日交易统计数据失败,请重新刷新页面!`,
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *getinitBrokerAgentRank({payload},{call,put}){  //导师首页经纪人排行榜
      const {data}=yield call(getinitBrokerAgentRankFetch,{...payload})
      if(!!data&&data.status==='success'){
        const addCustomer=[];
        const addHouseRank=[];
        const tradeCommission=[];
        const transaction=[];
        data.data.addCustomer.map((item,index)=>{
          addCustomer.push({
            key:index+1,
            name:item.name,
            count:`${item.count}人`,
            // count:`${item.count}`,
            logo:item.logo,
          })
        })
        data.data.addHouse.map((item,index)=>{
          addHouseRank.push({
            key:index+1,
            name:item.name,
            count:`${item.count}套`,
            // count:`${item.count}`,
            logo:item.logo,
          })
        })
        data.data.tradeCommission.map((item,index)=>{
          tradeCommission.push({
            key:index+1,
            name:item.name,
            count:`${item.count}元`,
            // count:`${item.count}`,
            logo:item.logo,
          })
        })
        data.data.transaction.map((item,index)=>{
          transaction.push({
            key:index+1,
            name:item.name,
            count:`${item.count}套`,
            // count:`${item.count}`,
            logo:item.logo,
          })
        })
        yield put({
          type:"saveBrokerRankData",
          payload:{
            addCustomer:addCustomer,
            addHouseRank:addHouseRank,
            tradeCommission:tradeCommission,
            transaction:transaction,
            tableData:transaction,
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          // description:`获取统计数据失败:${data.message}`,
          description:`获取经纪人排行榜数据失败,请重新刷新页面!`,
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *getInitYesterdayBussinessData({payload},{call,put}){ //导师首页昨日业务数据
      const {data}=yield call(getInitYesterdayBussinessDataFetch,{...payload})
      if(!!data&&data.status==='success'){
        const addBroker=data.data.addBroker;  //新增经纪人
        const addBrokerView=data.data.addBrokerView;  //客户带看
        const addCustomerFollow=data.data.addCustomerFollow;  //客户跟进
        const addHouse=data.data.addHouse;  //新增房源
        const addHouseView=data.data.addHouseView;  //预约看房
        const addReport=data.data.addReport;  //报备客户
        const addSource=data.data.addSource;  //新增客户
        yield put ({
          type:"saveYesterdayBussinessData",
          payload:{
            addBroker:addBroker,
            addBrokerView:addBrokerView,
            addCustomerFollow:addCustomerFollow,
            addHouse:addHouse,
            addHouseView:addHouseView,
            addReport:addReport,
            addSource:addSource,
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          // description:`获取统计数据失败:${data.message}`,
          description:`获取昨日业务统计数据失败,请重新刷新页面!`,
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *getInitAnzhuData({payload},{call,put}){  //导师首页安住经济公司统计图
      const {data}=yield call(getInitAnzhuDataFetch,{...payload})
      if(!!data&&data.status==='success'){
        const secdRentData=data.data.secdRent;
        const brokerSecdRent={
          color:['#85DB9F','#F7877A'],
          mainTitleLegend:{
            padding:[0,15,0,0],
            right:0,
            top:'middle',
            orient: 'vertical',
            x: 'right',
            data:[
              `住宅  ${secdRentData.housesRent}`,
              `商铺  ${secdRentData.shopsRent}`,
              `写字楼  ${secdRentData.officesRent}`
            ],
          },
          series:[
            {
              center: [100, 90],
              name: '二手房出租数量',
              type: 'pie',
              radius : ['45%','70%'],
              avoidLabelOverlap: false,
              data:[
                {value:secdRentData.housesRent, name:`住宅  ${secdRentData.housesRent}`},
                {value:secdRentData.shopsRent, name:`商铺  ${secdRentData.shopsRent}`},
                {value:secdRentData.officesRent, name:`写字楼  ${secdRentData.officesRent}`},
              ],
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
              },
            }
          ]
        }

        const secdSoldsData=data.data.secdSolds;
        const brokerSecdSolds={
          color:['#85DB9F','#F7877A'],
          mainTitleLegend:{
            padding:[0,15,0,0],
            right:0,
            top:'middle',
            orient: 'vertical',
            x: 'right',
            data:[
              `住宅  ${secdSoldsData.secdHouses}`,
              `商铺  ${secdSoldsData.shops}`,
              `写字楼  ${secdSoldsData.offices}`
            ],
          },
          series:[
            {
              center: [100, 90],
              name: '二手房在售数量',
              type: 'pie',
              radius : ['45%','70%'],
              avoidLabelOverlap: false,
              data:[
                {value:secdSoldsData.secdHouses, name:`住宅  ${secdSoldsData.secdHouses}`},
                {value:secdSoldsData.shops, name:`商铺  ${secdSoldsData.shops}`},
                {value:secdSoldsData.offices, name:`写字楼  ${secdSoldsData.offices}`},
              ],
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
              },
            }
          ]
        }

        const tutorBrokersData=data.data.tutorBrokers;
        const brokerTutorBrokers={
          color:['#85DB9F','#F7877A'],
          mainTitleLegend:{
            padding:[0,15,0,0],
            right:0,
            top:'middle',
            orient: 'vertical',
            x: 'right',
            data:[
              `自有经纪人  ${tutorBrokersData.selfBrokers}`,
              `挂靠经纪人  ${tutorBrokersData.joinBrokers}`,
            ],
          },
          series:[
            {
              center: [100, 90],
              name: '经纪人数量',
              type: 'pie',
              radius : ['45%','70%'],
              avoidLabelOverlap: false,
              data:[
                {value:tutorBrokersData.selfBrokers, name:`自有经纪人  ${tutorBrokersData.selfBrokers}`},
                {value:tutorBrokersData.joinBrokers, name:`挂靠经纪人  ${tutorBrokersData.joinBrokers}`},
              ],
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
              },
            }
          ]
        }
        yield put({
          type:"saveAnzhuData",
          payload:{
            secdRentData:secdRentData,
            brokerSecdRent:brokerSecdRent,
            secdSoldsData:secdSoldsData,
            brokerSecdSolds:brokerSecdSolds,
            tutorBrokersData:tutorBrokersData,
            brokerTutorBrokers:brokerTutorBrokers,
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          // description:`获取统计数据失败:${data.message}`,
          description:`获取安住经济公司统计数据失败,请重新刷新页面!`,
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *query({ payload }, { call, put }){
      const  data  = yield call(query, parse(payload));
      if(data){
        yield put ({
          type: 'querySuccess',
          payload: {
            isDrowChart1:{
              isDrow:true,
              xData:data.data1.xData,
              yData:data.data1.yData,
              mainTitleLegend:data.data1.mainTitleLegend,
            },
            isDrowChart5:{
              isDrow:true,
              series:data.data5.series,
              mainTitleLegend:data.data5.mainTitleLegend,
            },
            isDrowChart4:{
              isDrow:true,
              xData:data.data4.xData,
              yData:data.data4.yData,
              boundaryGap:data.data4.boundaryGap,
              mainTitleLegend:data.data4.mainTitleLegend,
            },
          },
        });
      }
    },
    *getInitDealData({payload},{call,put}){ //经纪人首页本月成交统计图
      const {data}=yield call(getInitDealDataFetch,{...payload})
      if(!!data&&data.status==='success'){
        let basicData={};
        basicData.brokerage=data.data.brokerage;
        basicData.brokerageTotal=data.data.brokerageTotal;
        if(!!data.data.lastTime){
          basicData.lastTime=data.data.lastTime.slice(0,10);
        }
        basicData.transaction=data.data.transaction;
        basicData.transactionTotal=data.data.transactionTotal;
        let newHouseChartsData={};
        newHouseChartsData.brokerage=data.data.newHouse.brokerage;
        newHouseChartsData.houseCount=data.data.newHouse.houseCount;
        newHouseChartsData.officeCount=data.data.newHouse.officeCount;
        newHouseChartsData.shopCount=data.data.newHouse.shopCount;
        const charts={
          color:['#85DB9F','#F7877A'],
          mainTitleLegend:{
            padding:[10,10,0,0],
            right:0,
            top:'middle',
            orient: 'vertical',
            x: 'right',
            data:[
              `住宅  ${newHouseChartsData.houseCount}`,
              `商铺  ${newHouseChartsData.shopCount}`,
              `写字楼  ${newHouseChartsData.officeCount}`
            ],
          },
          series:[
            {
              center: [55, 90],
              name: '成交数量',
              type: 'pie',
              radius : ['30%',"45%"],
              avoidLabelOverlap: false,
              data:[
                {value:newHouseChartsData.houseCount, name:`住宅  ${newHouseChartsData.houseCount}`},
                {value:newHouseChartsData.shopCount, name:`商铺  ${newHouseChartsData.shopCount}`},
                {value:newHouseChartsData.officeCount, name:`写字楼  ${newHouseChartsData.officeCount}`},
              ],
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
              },
            }
          ]
        }
        let secdRentOutChartsData={};
        secdRentOutChartsData.brokerage=data.data.secdRentOut.brokerage;
        secdRentOutChartsData.houseCount=data.data.secdRentOut.houseCount;
        secdRentOutChartsData.officeCount=data.data.secdRentOut.officeCount;
        secdRentOutChartsData.shopCount=data.data.secdRentOut.shopCount;
        let secdSellChartsData={};
        secdSellChartsData.brokerage=data.data.secdSell.brokerage;
        secdSellChartsData.houseCount=data.data.secdSell.houseCount;
        secdSellChartsData.officeCount=data.data.secdSell.officeCount;
        secdSellChartsData.shopCount=data.data.secdSell.shopCount;
        yield put({
          type:"saveDealData",
          payload:{
            basicData:basicData,
            charts:charts,
            currentBrokerage:newHouseChartsData.brokerage,
            newHouseChartsData:newHouseChartsData,
            secdRentOutChartsData:secdRentOutChartsData,
            secdSellChartsData:secdSellChartsData,
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:`获取统计数据失败:${data.message}`,
          // description:`获取本月成交统计数据失败,请重新刷新页面!`,
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *getInitBussinessData({payload},{call,put,select}){ //经纪人首页本月业务统计图
      const {data}=yield call(getInitBussinessDataFetch,{...payload})
      if(!!data&&data.status==='success'){
        const resultData=data.data;
        const addHouseDtailData=resultData.addHouseDtail;
        const appointmentDtailData=resultData.appointmentDtail;
        const reportDtailData=resultData.reportDtail;
        const viewDtailData=resultData.viewDtail;

        const addHouseDtailCharts={
          color:['#85DB9F','#F7877A'],
          mainTitleLegend:{
            padding:[10,10,0,0],
            orient: 'vertical',
            top:'middle',
            x: 'right',
            data:[`住宅`,`商铺`,`写字楼`],
              formatter:function(name){
                var oa = addHouseDtailCharts.series[0].data;
                for(var i = 0; i < addHouseDtailCharts.series[0].data.length; i++){
                  if(name==oa[i].name){
                    return name+' '+oa[i].value
                  }
                }
              }
          },
          series:[
            {
              center: [75, 90],
              name: '本月业务数据',
              type: 'pie',
              radius : ['30%',"45%"],
              avoidLabelOverlap: false,
              data:[
                {
                  value:addHouseDtailData.houseCount,
                  name:`住宅`,
                },
                {
                  value:addHouseDtailData.officeCount,
                  name:`商铺`,
                },
                {
                  value:addHouseDtailData.shopCount,
                  name:`写字楼`,
                },
              ],
              label: {
                normal: {
                  show:false,
                  formatter:function(name){
                    var oa = addHouseDtailCharts.series[0].data;
                    for(var i = 0; i < addHouseDtailCharts.series[0].data.length; i++){
                      if(name.name==oa[i].name){
                        return name.name+'\n 佣金 '+oa[i].key+"元"
                      }
                    }
                  },
                  position: 'outside',
                  textStyle: {
                     color: '',
                     fontSize: 14
                  }
                },
              },
            }
          ]
        }

        const reportDtailCharts={
          color:['#85DB9F','#F7877A'],
          mainTitleLegend:{
            padding:[10,10,0,0],
            orient: 'vertical',
            top:'middle',
            x: 'right',
            data:[`住宅`],
              formatter:function(name){
                var oa = reportDtailCharts.series[0].data;
                for(var i = 0; i < reportDtailCharts.series[0].data.length; i++){
                  if(name==oa[i].name){
                    return name+' '+oa[i].value
                  }
                }
              }
          },
          series:[
            {
              center: [75, 90],
              name: '本月业务数据',
              type: 'pie',
              radius : ['30%',"45%"],
              avoidLabelOverlap: false,
              data:[
                {
                  value:reportDtailData.houseCount,
                  name:`住宅`,
                },
              ],
              label: {
                normal: {
                  show:false,
                  formatter:function(name){
                    var oa = reportDtailCharts.series[0].data;
                    for(var i = 0; i < reportDtailCharts.series[0].data.length; i++){
                      if(name.name==oa[i].name){
                        return name.name+'\n 佣金 '+oa[i].key+"元"
                      }
                    }
                  },
                  position: 'outside',
                  textStyle: {
                     color: '',
                     fontSize: 14
                  }
                },
              },
            }
          ]
        }

        const appointmentDtailCharts={
          color:['#85DB9F','#F7877A'],
          mainTitleLegend:{
            padding:[10,10,0,0],
            orient: 'vertical',
            top:'middle',
            x: 'right',
            data:[`出租`,`二手房`,],
              formatter:function(name){
                var oa = appointmentDtailCharts.series[0].data;
                for(var i = 0; i < appointmentDtailCharts.series[0].data.length; i++){
                  if(name==oa[i].name){
                    return name+' '+oa[i].value
                  }
                }
              }
          },
          series:[
            {
              center: [75, 90],
              name: '本月业务数据',
              type: 'pie',
              radius : ['30%',"45%"],
              avoidLabelOverlap: false,
              data:[
                {
                  value:appointmentDtailData.secdRentOut,
                  name:`出租`,
                },
                {
                  value:appointmentDtailData.secdSell,
                  name:`二手房`,
                },
              ],
              label: {
                normal: {
                  show:false,
                  formatter:function(name){
                    var oa = appointmentDtailCharts.series[0].data;
                    for(var i = 0; i < appointmentDtailCharts.series[0].data.length; i++){
                      if(name.name==oa[i].name){
                        return name.name+'\n 佣金 '+oa[i].key+"元"
                      }
                    }
                  },
                  position: 'outside',
                  textStyle: {
                     color: '',
                     fontSize: 14
                  }
                },
              },
            }
          ]
        }

        const viewDtailCharts={
          color:['#85DB9F','#F7877A'],
          mainTitleLegend:{
            padding:[10,10,0,0],
            orient: 'vertical',
            top:'middle',
            x: 'right',
            data:[`新房`,`二手房`,`出租`],
              formatter:function(name){
                var oa = viewDtailCharts.series[0].data;
                for(var i = 0; i < viewDtailCharts.series[0].data.length; i++){
                  if(name==oa[i].name){
                    return name+' '+oa[i].value
                  }
                }
              }
          },
          series:[
            {
              center: [75, 90],
              name: '本月业务数据',
              type: 'pie',
              radius : ['30%',"45%"],
              avoidLabelOverlap: false,
              data:[
                {
                  value:viewDtailData.newHouseCount,
                  name:`新房`,
                },
                {
                  value:viewDtailData.secdRentOut,
                  name:`二手房`,
                },
                {
                  value:viewDtailData.secdSell,
                  name:`出租`,
                },
              ],
              label: {
                normal: {
                  show:false,
                  formatter:function(name){
                    var oa = viewDtailCharts.series[0].data;
                    for(var i = 0; i < viewDtailCharts.series[0].data.length; i++){
                      if(name.name==oa[i].name){
                        return name.name+'\n 佣金 '+oa[i].key+"元"
                      }
                    }
                  },
                  position: 'outside',
                  textStyle: {
                     color: '',
                     fontSize: 14
                  }
                },
              },
            }
          ]
        }
        yield put({
          type:"saveBussinessData",
          payload:{
            businessCountForMonthData:resultData,
            defaultBussinessCharts:addHouseDtailCharts,
            addHouseDtailCharts:addHouseDtailCharts,
            reportDtailCharts:reportDtailCharts,
            appointmentDtailCharts:appointmentDtailCharts,
            viewDtailCharts:viewDtailCharts,
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:`获取统计数据失败:${data.message}`,
          // description:`获取本月业务统计数据失败,请重新刷新页面!`,
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *changeDealCharts({payload},{call,put,select}){ //经纪人首页本月成交RadioButton切换显示不同的数据
      const newHouseChartsData=yield select(({indexPageX})=>indexPageX.newHouseChartsData);
      const secdRentOutChartsData=yield select(({indexPageX})=>indexPageX.secdRentOutChartsData);
      const secdSellChartsData=yield select(({indexPageX})=>indexPageX.secdSellChartsData);
      if(payload.value==='新房'){
        const charts={
          color:['#85DB9F','#F7877A'],
          mainTitleLegend:{
            padding:[10,10,0,0],
            right:0,
            top:'middle',
            orient: 'vertical',
            x: 'right',
            data:[
              `住宅  ${newHouseChartsData.houseCount}`,
              `商铺  ${newHouseChartsData.shopCount}`,
              `写字楼  ${newHouseChartsData.officeCount}`
            ],
          },
          series:[
            {
              center: [55, 90],
              name: '成交数量',
              type: 'pie',
              radius : ['30%',"45%"],
              avoidLabelOverlap: false,
              data:[
                {value:newHouseChartsData.houseCount, name:`住宅  ${newHouseChartsData.houseCount}`},
                {value:newHouseChartsData.shopCount, name:`商铺  ${newHouseChartsData.shopCount}`},
                {value:newHouseChartsData.officeCount, name:`写字楼  ${newHouseChartsData.officeCount}`},
              ],
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
              },
            }
          ]
        }
        yield put ({type:"saveDealData",payload:{charts:charts}})
      }else if(payload.value==='二手房'){
        const charts={
          color:['#85DB9F','#F7877A'],
          mainTitleLegend:{
            padding:[10,10,0,0],
            right:0,
            top:'middle',
            orient: 'vertical',
            x: 'right',
            data:[
              `住宅  ${secdSellChartsData.houseCount}`,
              `商铺  ${secdSellChartsData.shopCount}`,
              `写字楼  ${secdSellChartsData.officeCount}`
            ],
          },
          series:[
            {
              center: [55, 90],
              name: '成交数量',
              type: 'pie',
              radius : ['30%',"45%"],
              avoidLabelOverlap: false,
              data:[
                {value:secdSellChartsData.houseCount, name:`住宅  ${secdSellChartsData.houseCount}`},
                {value:secdSellChartsData.shopCount, name:`商铺  ${secdSellChartsData.shopCount}`},
                {value:secdSellChartsData.officeCount, name:`写字楼  ${secdSellChartsData.officeCount}`},
              ],
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
              },
            }
          ]
        }
        yield put ({type:"saveDealData",payload:{charts:charts}})
      }else if(payload.value==='出租'){
        const charts={
          color:['#85DB9F','#F7877A'],
          mainTitleLegend:{
            padding:[10,10,0,0],
            right:0,
            top:'middle',
            orient: 'vertical',
            x: 'right',
            data:[
              `住宅  ${secdRentOutChartsData.houseCount}`,
              `商铺  ${secdRentOutChartsData.shopCount}`,
              `写字楼  ${secdRentOutChartsData.officeCount}`
            ],
          },
          series:[
            {
              center: [55, 90],
              name: '成交数量',
              type: 'pie',
              radius : ['30%',"45%"],
              avoidLabelOverlap: false,
              data:[
                {
                  value:secdRentOutChartsData.houseCount,
                  name:`住宅  ${secdRentOutChartsData.houseCount}`
                },
                {
                  value:secdRentOutChartsData.shopCount,
                  name:`商铺  ${secdRentOutChartsData.shopCount}`
                },
                {
                  value:secdRentOutChartsData.officeCount,
                  name:`写字楼  ${secdRentOutChartsData.officeCount}`
                },
              ],
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
              },
            }
          ]
        }
        yield put ({type:"saveDealData",payload:{charts:charts}})
      }
    },
    *showBrokerRankTable({payload},{call,put,select}){  //导师首页经纪人排行榜
      const addCustomer=yield select(({indexPageX})=>indexPageX.addCustomer);
      const addHouseRank=yield select(({indexPageX})=>indexPageX.addHouseRank);
      const tradeCommission=yield select(({indexPageX})=>indexPageX.tradeCommission);
      const transaction=yield select(({indexPageX})=>indexPageX.transaction);
      const tableData=yield select(({indexPageX})=>indexPageX.tableData);
      if(payload.value==='成交'){
        yield put({type:"saveRankTableData",payload:{tableData:transaction}})
      }else if(payload.value==='拓房'){
        yield put({type:"saveRankTableData",payload:{tableData:addHouseRank}})
      }else if(payload.value==='拓客'){
        yield put({type:"saveRankTableData",payload:{tableData:addCustomer}})
      }else if(payload.value==='佣金收益'){
        yield put({type:"saveRankTableData",payload:{tableData:tradeCommission}})
      }
    },

    *showBussinessCharts({payload},{call,put,select}){  //经纪人首页本月业务数据button切换
      const addHouseDtailCharts=yield select(({indexPageX})=>indexPageX.addHouseDtailCharts);
      const reportDtailCharts=yield select(({indexPageX})=>indexPageX.reportDtailCharts);
      const appointmentDtailCharts=yield select(({indexPageX})=>indexPageX.appointmentDtailCharts);
      const viewDtailCharts=yield select(({indexPageX})=>indexPageX.viewDtailCharts);
      if(payload.value==='拓房'){
        yield put({type:"changeBussinessCharts",payload:{defaultBussinessCharts:addHouseDtailCharts}})
      }else if(payload.value==='新房报备'){
        yield put({type:"changeBussinessCharts",payload:{defaultBussinessCharts:reportDtailCharts}})
      }else if(payload.value==='预约看房'){
        yield put({type:"changeBussinessCharts",payload:{defaultBussinessCharts:appointmentDtailCharts}})
      }else if(payload.value==='客户带看'){
        yield put({type:"changeBussinessCharts",payload:{defaultBussinessCharts:viewDtailCharts}})
      }else{return}
    },
    *changeBrokenLine({payload},{call,put,select}){ //导师首页折线图切换
      const dealHouseCharts=yield select(({indexPageX})=>indexPageX.dealHouseCharts);
      const bussinessDataCharts=yield select(({indexPageX})=>indexPageX.bussinessDataCharts);
      const brokersNumberCharts=yield select(({indexPageX})=>indexPageX.brokersNumberCharts);
      if(payload.value==='成交房源'){
        yield put ({type:"saveDealData",payload:{initTrendData:dealHouseCharts}})
      }else if(payload.value==='业务数据'){
        yield put ({type:"saveDealData",payload:{initTrendData:bussinessDataCharts}})
      }else if(payload.value==='经纪人数量'){
        yield put ({type:"saveDealData",payload:{initTrendData:brokersNumberCharts}})
      }
    },
    *getInitBrokerIdInfos({payload},{call,put,select}){ //经纪人首页经纪人信息
      const {data}=yield call(getInitBrokerIdInfosFetch,{...payload})
      if(!!data&&data.status==='success'){
        const brokerInfos=data.data;
        yield put({type:"saveBrokerInfos",payload:{
          brokerInfos:brokerInfos
        }})
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:`获取经纪人信息失败:${data.message}`,
          visible:true,
          todo:"closeModal"
        }})
      }
    },

    *getInitAgentRank({payload},{call,put}){  //经纪人首页经纪人排行榜
      payload.days=30;
      payload.limit=10;
      const {data}=yield call(getInitAgentRankFetch,{...payload})
      if(!!data&&data.status==='success'){
        const resultData=data.data.rankingList;
        const rankingList=[];
        resultData.map((item,index)=>{
          if(payload.type==="成交"){
            rankingList.push({
              key:item.brokerId,
              brokerId:item.brokerId,
              level:item.level,
              logo:item.logo,
              name:item.name,
              ranking:item.ranking,
              count:`${item.count}套`,
            })
          }else if(payload.type==="拓房"){
            rankingList.push({
              key:item.brokerId,
              brokerId:item.brokerId,
              level:item.level,
              logo:item.logo,
              name:item.name,
              ranking:item.ranking,
              count:`${item.count}套`,
            })
          }else if(payload.type==="拓客"){
            rankingList.push({
              key:item.brokerId,
              brokerId:item.brokerId,
              level:item.level,
              logo:item.logo,
              name:item.name,
              ranking:item.ranking,
              count:`${item.count}人`,
            })
          }else{return}
        })
        yield put({type:"saveRankingList",payload:{
          rankingList:rankingList
        }})
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:`获取本月经纪人排行榜信息失败:${data.message}`,
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *getInitAgentTrendChartData({payload},{call,put}){  //经纪人首页数据走势图
      const requestType=payload.type; //请求类型
      const {data}=yield call(getInitAgentTrendChartDataFetch,{...payload})
      if(!!data&&data.status==='success'){
        var mycharts=echarts.init(document.getElementById('brokerTrendChartData'));
        const addCustomerList=data.data.addCustomerList;  //拓客
        const addHouseList=data.data.addHouseList;  //拓房
        const appointmentList=data.data.appointmentList;  //预约
        const followUpList=data.data.followUpList;  //客户跟进
        const reportList=data.data.reportList;  //新房报备
        const transactionList=data.data.transactionList;  //成交
        const viewList=data.data.viewList;  //客户带看
        if(requestType==='拓客'){
          const x=[];
          const y=[];
          if(addCustomerList.length){
            addCustomerList.map(item=>{
              x.push(item.currDate);
              y.push(item.count);
            })
          }
          var option = {
            tooltip: {
              trigger: 'axis',
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                  type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              },
            },
            legend: {
              show:true,
              data: ["拓客"],
            },
            xAxis: {
              axisLabel: { //X轴倾斜!!
                rotate: -91,
                interval:0,
                textStyle:{
                  color:"#000"
                }
              },
              axisLine:{
                lineStyle:{
                  color:'#000',
                  width:1
                }
              },
              type: 'category',
              name: 'x',
              splitLine: {show: false},
              data: x
            },
            grid: {
              left: '5%',
              right: '4%',
              bottom: '40%',
              height:"160px",
              containLabel: false,
            },
            yAxis: {
              axisLabel: {
                textStyle:{
                  color:"#000"
                }
              },
              type: 'value',
              name: 'y',
              axisLine:{
                lineStyle:{
                  textStyle:"#000",
                  color:'#000',
                  width:1
                }
              },
            },
            series: [
              {
                name:"拓客",
                type: 'bar',
                data:y
              },
            ]
          };
          mycharts.setOption(option,true);
        }
        else if(requestType==='拓房'){
          const x=[];
          const y1=[];  //新房
          const y2=[];  //出租
          const y3=[];  //二手
          if(addHouseList.length){
            addHouseList.map(item=>{
              x.push(item.currDate);
              y1.push(item.newHouseCount);
              y2.push(item.secdRentOut);
              y3.push(item.secdSell);
            })
          }
          var option = {
            tooltip: {
              trigger: 'axis',
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                  type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              },
            },
            legend: {
              show:true,
              data: ["新房","出租房","二手房"],
            },
            xAxis: {
              axisLabel: { //X轴倾斜!!
                rotate: -91,
                interval:0,
                textStyle:{
                  color:"#000"
                }
              },
              axisLine:{
                lineStyle:{
                  color:'#000',
                  width:1
                }
              },
              type: 'category',
              name: 'x',
              splitLine: {show: false},
              data: x
            },
            grid: {
              left: '5%',
              right: '4%',
              bottom: '40%',
              height:"160px",
              containLabel: false,
            },
            yAxis: {
              axisLine:{
                lineStyle:{
                    color:'#000',
                    width:1
                }
              },
              axisLabel: {
                interval:0,
                textStyle:{
                  color:"#000"
                }
              },
                type: 'value',
                name: 'y'
            },
            series: [
              {
                name:"新房",
                type: 'bar',
                barWidth: '10%',
                data:y1
              },
              {
                name:"出租房",
                type: 'bar',
                barWidth: '10%',
                data:y2
              },
              {
                name:"二手房",
                type: 'bar',
                barWidth: '10%',
                data:y3
              },
            ]
          };
          mycharts.setOption(option,true);
        }
        else if(requestType==='预约'){
          const x=[];
          const y1=[];  //出租
          const y2=[];  //二手
          if(appointmentList.length){
            appointmentList.map(item=>{
              x.push(item.currDate);
              y1.push(item.secdRentOut);
              y2.push(item.secdSell);
            })
          }
          var option = {
            tooltip: {
              trigger: 'axis',
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                  type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              },
            },
            legend: {
              show:true,
              data: ["出租房","二手房"],
            },
            xAxis: {
              axisLabel: { //X轴倾斜!!
                rotate: -91,
                interval:0,
                textStyle:{
                  color:"#000"
                }
              },
              axisLine:{
                lineStyle:{
                  color:'#000',
                  width:1
                }
              },
              type: 'category',
              name: 'x',
              splitLine: {show: false},
              data: x
            },
            grid: {
              left: '5%',
              right: '4%',
              bottom: '40%',
              height:"160px",
              containLabel: false,
            },
            yAxis: {
              axisLabel: {
                textStyle:{
                  color:"#000"
                }
              },
              type: 'value',
              name: 'y',
              axisLine:{
                lineStyle:{
                  textStyle:"#000",
                  color:'#000',
                  width:1
                }
              },
            },
            series: [
              {
                name:"出租房",
                type: 'bar',
                data:y1
              },
              {
                name:"二手房",
                type: 'bar',
                data:y2
              },
            ]
          };
          mycharts.setOption(option,true);
        }
        else if(requestType==='跟进'){
          const x=[];
          const y=[];  //跟进数量
          if(followUpList.length){
            followUpList.map(item=>{
              x.push(item.currDate);
              y.push(item.count);
            })
          }
          var option = {
            tooltip: {
              trigger: 'axis',
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                  type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              },
            },
            legend: {
              show:true,

              data: ["客户跟进数量"],
            },
            xAxis: {
              axisLabel: { //X轴倾斜!!
                rotate: -91,
                interval:0,
                textStyle:{
                  color:"#000"
                }
              },
              axisLine:{
                lineStyle:{
                  color:'#000',
                  width:1
                }
              },
              type: 'category',
              name: 'x',
              splitLine: {show: false},
              data: x
            },
            grid: {
              left: '5%',
              right: '4%',
              bottom: '40%',
              height:"160px",
              containLabel: false,
            },
            yAxis: {
              axisLabel: {
                textStyle:{
                  color:"#000"
                }
              },
              type: 'value',
              name: 'y',
              axisLine:{
                lineStyle:{
                  textStyle:"#000",
                  color:'#000',
                  width:1
                }
              },
            },
            series: [
              {
                name:"客户跟进数量",
                type: 'bar',
                data:y
              },
            ]
          };
          mycharts.setOption(option,true);
        }
        else if(requestType==='新房报备受理'){
          const x=[];
          const y=[];  //新房报备数量
          if(reportList.length){
            reportList.map(item=>{
              x.push(item.currDate);
              y.push(item.count);
            })
          }
          var option = {
            tooltip: {
              trigger: 'axis',
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                  type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              },
            },
            legend: {
              show:true,

              data: ["新房报备数量"],
            },
            xAxis: {
              axisLabel: { //X轴倾斜!!
                rotate: -91,
                interval:0,
                textStyle:{
                  color:"#000"
                }
              },
              axisLine:{
                lineStyle:{
                  color:'#000',
                  width:1
                }
              },
              type: 'category',
              name: 'x',
              splitLine: {show: false},
              data: x
            },
            grid: {
              left: '5%',
              right: '4%',
              bottom: '40%',
              height:"160px",
              containLabel: false,
            },
            yAxis: {
              axisLabel: {
                textStyle:{
                  color:"#000"
                }
              },
              type: 'value',
              name: 'y',
              axisLine:{
                lineStyle:{
                  textStyle:"#000",
                  color:'#000',
                  width:1
                }
              },
            },
            series: [
              {
                name:"新房报备数量",
                type: 'bar',
                data:y
              },
            ]
          };
          mycharts.setOption(option,true);
        }
        else if(requestType==='成交'){
          const x=[];
          const y1=[];  //新房
          const y2=[];  //出租
          const y3=[];  //二手
          if(transactionList.length){
            transactionList.map(item=>{
              x.push(item.currDate);
              y1.push(item.newHouseCount);
              y2.push(item.secdRentOut);
              y3.push(item.secdSell);
            })
          }
          var option = {
            tooltip: {
              trigger: 'axis',
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                  type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              },
            },
            legend: {
              show:true,

              data: ["新房","二手房","出租房"],
            },
            xAxis: {
              axisLabel: { //X轴倾斜!!
                rotate: -91,
                interval:0,
                textStyle:{
                  color:"#000"
                }
              },
              axisLine:{
                lineStyle:{
                  color:'#000',
                  width:1
                }
              },
              type: 'category',
              name: 'x',
              splitLine: {show: false},
              data: x
            },
            grid: {
              left: '5%',
              right: '4%',
              bottom: '40%',
              height:"160px",
              containLabel: false,
            },
            yAxis: {
              axisLabel: {
                textStyle:{
                  color:"#000"
                }
              },
              type: 'value',
              name: 'y',
              axisLine:{
                lineStyle:{
                  textStyle:"#000",
                  color:'#000',
                  width:1
                }
              },
            },
            series: [
              {
                name:"新房",
                type: 'bar',
                data:y1
              },
              {
                name:"二手房",
                type: 'bar',
                data:y2
              },
              {
                name:"出租房",
                type: 'bar',
                data:y3
              },
            ]
          };
          mycharts.setOption(option,true);
        }
        else if(requestType==='看房'){
          const x=[];
          const y1=[];  //新房
          const y2=[];  //出租
          const y3=[];  //二手
          if(viewList.length){
            viewList.map(item=>{
              x.push(item.currDate);
              y1.push(item.newHouseCount);
              y2.push(item.secdRentOut);
              y3.push(item.secdSell);
            })
          }
          var option = {
            tooltip: {
              trigger: 'axis',
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                  type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              },
            },
            legend: {
              show:true,

              data: ["新房","二手房","出租房"],
            },
            xAxis: {
              axisLabel: { //X轴倾斜!!
                rotate: -91,
                interval:0,
                textStyle:{
                  color:"#000"
                }
              },
              axisLine:{
                lineStyle:{
                  color:'#000',
                  width:1
                }
              },
              type: 'category',
              name: 'x',
              splitLine: {show: false},
              data: x
            },
            grid: {
              left: '5%',
              right: '4%',
              bottom: '40%',
              height:"160px",
              containLabel: false,
            },
            yAxis: {
              axisLabel: {
                textStyle:{
                  color:"#000"
                }
              },
              type: 'value',
              name: 'y',
              axisLine:{
                lineStyle:{
                  textStyle:"#000",
                  color:'#000',
                  width:1
                }
              },
            },
            series: [
              {
                name:"新房",
                type: 'bar',
                data:y1
              },
              {
                name:"二手房",
                type: 'bar',
                data:y2
              },
              {
                name:"出租房",
                type: 'bar',
                data:y3
              },
            ]
          };
          mycharts.setOption(option,true);
        }
      }
    },
  },
  reducers:{
    togglePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    setDefaultState(state,action){
      return lodash.cloneDeep(initState);
    },
    querySuccess(state,action){
      return { ...state, ...action.payload };
    },
    saveCurrentBrokerage(state,action){
      return { ...state, ...action.payload };
    },
    saveDealData(state,action){
      return { ...state, ...action.payload };
    },
    saveAnzhuData(state,action){
      return { ...state, ...action.payload };
    },
    saveYesterdayBussinessData(state,action){
      return { ...state, ...action.payload };
    },
    saveBrokerRankData(state,action){
      return { ...state, ...action.payload };
    },
    saveRankTableData(state,action){
      return { ...state, ...action.payload };
    },
    saveBussinessData(state,action){
      return { ...state, ...action.payload };
    },
    saveUserType(state,action){
      return { ...state, ...action.payload };
    },
    changeBussinessCharts(state,action){
      return { ...state, ...action.payload };
    },
    saveBrokerInfos(state,action){
      return { ...state, ...action.payload };
    },
    saveRankingList(state,action){
      return { ...state, ...action.payload };
    },
    saveTransactionListData(state,action){
      return { ...state, ...action.payload };
    },
    saveAgentTrendDate(state,action){
      return { ...state, ...action.payload };
    },
    saveCompanyInfos(state,action){
      return { ...state, ...action.payload };
    },
    changeDefaultAgentTrendOtion(state,action){
      return { ...state, ...action.payload };
    },
    changeWidth(state,action){
      return { ...state, ...action.payload };
    },
    changeValue(state,action){
      return { ...state, ...action.payload };
    },
  },
}
