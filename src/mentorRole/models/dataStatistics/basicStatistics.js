import {
  query,
  getInitStatisticalDataFetch,
  getInitBussinessDataFetch,
  getInitPieChartsDataFetch,
} from '../../services/dataStatistics/basicStatistics';
import {parse} from 'qs';
import lodash from 'lodash';
import echarts from 'echarts'

const getNowFormatDate=(date)=>{
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
   return year + seperator1 + month + seperator1 + strDate
}
const  myDate1=new Date();
myDate1.setDate(myDate1.getDate()-31);
const initState={
  tutorDealTeamId:'',
  dealDataOption:[],
  cumulativeDeal:null,
  dealPieCharts:{},
  startDate:'',
  endDate:'',
  defaultStartDate:getNowFormatDate(myDate1),
  defaultEndDate:getNowFormatDate(new Date()),
  dealStartDate:'',
  dealEndDate:'',
  tutorTeamId:'',
  dealData:{},
  selectOption:[],
  initStatisticalData:{},
  forSale:{},
  forRent:{},
  housesTotle:{},
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
  namespace:'basicStatistics',
  state:initState,
  subscriptions: {
   setup({ dispatch, history }) {
     history.listen(location => {
       if (location.pathname === '/dataStatistics/basicStatistics') {
         dispatch({
           type:"setDefaultState"
         })
         dispatch({
           type: 'query',
         });
         dispatch({
           type:"getInitStatisticalData",
           payload:{}
         });
         dispatch({
           type:"getInitBussinessData",
           payload:{
             endDate:"",
             startDate:"",
           }
         });
         dispatch({
           type:"getInitPieChartsData",
           payload:{
             endDate:"",
             startDate:"",
           }
         })
       }
     });
   },
  },
  effects:{
    *getInitPieChartsData({payload},{call,put}){
      const  myDate=new Date();
      myDate.setDate(myDate.getDate()-31);
      if(payload.startDate===""&&payload.endDate===""){
        payload.startDate=getNowFormatDate(myDate);
        payload.endDate=getNowFormatDate(new Date());
      }
      const {data}=yield call(getInitPieChartsDataFetch,{...payload})
      if(!!data&&data.status==='success'){
        const resultData=data.data;
        const dealDataOption=resultData.teams;
        const cumulativeDeal=resultData.accumulatedTurnover;
        const newHouseData=resultData.newHouse;
        const rentHouseData=resultData.rentHouse;
        const secdHouseData=resultData.secdHouse;
        const dealPieCharts={
          color:['#85DB9F','#F7877A'],
          mainTitleLegend:{
            padding:[10,0,0,0],
            orient: 'horizontal',
            x: 'center',
            data:[`新房成交`,`二手房成交`,`出租房成交`],
              formatter:function(name){
                var oa = dealPieCharts.series[0].data;
                for(var i = 0; i < dealPieCharts.series[0].data.length; i++){
                  if(name==oa[i].name){
                    return name+' '+oa[i].value
                  }
                }
              }
          },
          series:[
            {
              center: [300, 150],
              name: '昨日成交',
              type: 'pie',
              radius : '45%',
              avoidLabelOverlap: false,
              data:[
                {
                  value:newHouseData.tradeNumber,
                  name:`新房成交`,
                  tradeMoney:newHouseData.tradeMoney,
                  tradeCommission:newHouseData.tradeCommission
                },
                {
                  value:secdHouseData.tradeNumber,
                  name:`二手房成交`,
                  tradeMoney:secdHouseData.tradeMoney,
                  tradeCommission:secdHouseData.tradeCommission,
                },
                {
                  value:rentHouseData.tradeNumber,
                  name:`出租房成交`,
                  tradeMoney:rentHouseData.tradeMoney,
                  tradeCommission:rentHouseData.tradeCommission,
                },
              ],
              label: {
                normal: {
                  show:true,
                  formatter:function(name){
                    var oa = dealPieCharts.series[0].data;
                    for(var i = 0; i < dealPieCharts.series[0].data.length; i++){
                            if(name.name==oa[i].name){
                              if(oa[i].name==='出租房成交'){
                                return name.name+'\n 佣金收入'+oa[i].tradeCommission+'元'
                              }else{
                                return name.name+'\n 成交金额 '+oa[i].tradeMoney+"元"+'\n 佣金收入'+oa[i].tradeCommission+'元'
                              }
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
          type:"saveResultData",
          payload:{
            dealPieCharts:dealPieCharts,
            cumulativeDeal:cumulativeDeal,
            dealDataOption:dealDataOption,
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          // description:`获取统计数据失败:${data.message}`,
          description:`获取数据失败,请重新刷新页面!`,
          visible:true,
          todo:"closeModal"
        }})
      }
    },

    *getInitBussinessData({payload},{call,put}){ // 业务数据
      const  myDate=new Date();
	    myDate.setDate(myDate.getDate()-31);
      if(payload.startDate===""&&payload.endDate===""){
        payload.startDate=getNowFormatDate(myDate);
        payload.endDate=getNowFormatDate(new Date());
      }
      // yield put({
      //   type:"saveDefaultTime",
      //   payload:{
      //     defaultStartDate:getNowFormatDate(myDate),
      //     defaultEndDate:getNowFormatDate(new Date())
      //   }
      // })
      const {data}=yield call(getInitBussinessDataFetch,{...payload})
      if(!!data&&data.status==='success'){
        var mycharts=echarts.init(document.getElementById('barCharts'));
        const resultData=data.data;
        const houses=[];
        const offices=[];
        const shops=[];
        const selectOption=resultData.teams;
        resultData.newHouseView.map(item=>{
          houses.push(item.houses)
          offices.push(item.offices)
          shops.push(item.shops)
        })
        resultData.nhReport.map(item=>{
          houses.push(item.houses)
          offices.push(item.offices)
          shops.push(item.shops)
        })
        resultData.nhTransaction.map(item=>{
          houses.push(item.houses)
          offices.push(item.offices)
          shops.push(item.shops)
        })
        resultData.secdAppointment.map(item=>{
          houses.push(item.houses)
          offices.push(item.offices)
          shops.push(item.shops)
        })
        resultData.secdHouseView.map(item=>{
          houses.push(item.houses)
          offices.push(item.offices)
          shops.push(item.shops)
        })
        resultData.secdTransaction.map(item=>{
          houses.push(item.houses)
          offices.push(item.offices)
          shops.push(item.shops)
        })
        const x=['新房带看','新房报备','新房成交','二手房预约','二手房带看','二手房成交'];
        const y1=houses;  //新房
        const y2=offices;  //出租
        const y3=shops;  //二手
        var option = {
          tooltip: {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
          },
          legend: {
            show:true,
            data: ["住宅","商铺","写字楼"],
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
            left: '3%',
            right: '4%',
            bottom: '20%',
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
              name:"住宅",
              type: 'bar',
              data:y1
            },
            {
              name:"商铺",
              type: 'bar',
              data:y2
            },
            {
              name:"写字楼",
              type: 'bar',
              data:y3
            },
          ]
        };
        mycharts.setOption(option);
        window.addEventListener("resize",function(){
          mycharts.resize();
        });
        // const dealData={
        //   mainTitleLegend:['住宅','商铺','写字楼'],
        //   data: ['新房报备','新房带看','新房成交','二手房预约','二手房带看','二手房成交'],
        //   yData: [
        //     {
        //       name:'住宅',
        //       type:'bar',
        //       data:houses,
        //     },
        //     {
        //       name:'商铺',
        //       type:'bar',
        //       data:shops,
        //     },
        //     {
        //       name:'写字楼',
        //       type:'bar',
        //       data:offices,
        //     },
        //   ],
        // }
        yield put ({
          type:"saveDealData",
          payload:{
            // dealData:dealData,
            selectOption:selectOption,
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          // description:`获取统计数据失败:${data.message}`,
          description:`获取数据失败,请重新刷新页面!`,
          visible:true,
          todo:"closeModal"
        }})
      }
    },

    *getInitStatisticalData({payload},{call,put}){
      const {data}=yield call(getInitStatisticalDataFetch,{...payload})
      if(!!data&&data.status==='success'){
        const resultData=data.data;
        const housesTotle=data.data.totalMumberOfListings;
        const forRent=data.data.totalMumberOfListings.forRent;
        const forSale=data.data.totalMumberOfListings.forSale;
        yield put({
          type:"saveResultData",
          payload:{
            initStatisticalData:resultData,
            housesTotle:housesTotle,
            forRent:forRent,
            forSale:forSale,
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          // description:`获取统计数据失败:${data.message}`,
          description:`获取数据失败,请重新刷新页面!`,
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
          },
        });
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
    saveResultData(state,action){
      return { ...state, ...action.payload };
    },
    saveDealData(state,action){
      return { ...state, ...action.payload };
    },
    saveDate(state,action){
      return { ...state, ...action.payload };
    },
    saveDefaultTime(state,action){
      return { ...state, ...action.payload };
    },
    saveBussinessOptionValue(state,action){
      return { ...state, ...action.payload };
    },
  },
}
