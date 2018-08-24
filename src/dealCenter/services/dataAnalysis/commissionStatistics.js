import request from '../../../commons/utils/request';
import qs from 'qs';
export async function getCommissionStatisticsFetch(){
  return request('/miss-anzhu-statistics/tradingcenter/tradingscenter/commissionStatistics', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
  });
}
// export async function query(params){
//   return {
//     data1:{
//       xData: ['本周','本月','季度','半年','全年'],
//       mainTitleLegend:['新房电商销售(元)'],
//       yData:{
//         name:'新房电商销售(元)',
//         type:'bar',
//         data:[2000000, 3000000, 4000000, 5000000, 6000000],
//       },
//     },
//     data2:{
//       mainTitleLegend:['销售量','退款量'],
//       series:[
//         {
//           name: '新房电商销售量',
//           type: 'pie',
//           radius : '45%',
//           data:[
//             {value:95, name:'销售量'},
//             {value:5, name:'退款量'},
//           ],
//         }
//       ]
//     },
//     data3:{
//       xData: ['本周','本月','季度','半年','全年'],
//       mainTitleLegend:['电商佣金收益(元)'],
//       yData:{
//         name:'电商佣金收益(元)',
//         type:'bar',
//         data:[10000, 20000, 30000, 40000, 50000],
//       },
//     },
//     data4:{
//       xData: ['本周','本月','季度','半年','全年'],
//       mainTitleLegend:['购房定金(万)','购房首付款(万)','购房中介(万)'],
//       yData: [
//         {
//           name:'购房定金(万)',
//           type:'bar',
//           data:[100, 200, 300, 400, 500]
//         },
//         {
//           name:'购房首付款(万)',
//           type:'bar',
//           data:[1000,2000,3000,4000,5000]
//         },
//         {
//           name:'购房中介(万)',
//           type:'bar',
//           data:[200,300,400,500,600]
//         },
//       ],
//     },
//     data5:{
//       mainTitleLegend:['成交量(年)','退房量(年)'],
//       series:[
//         {
//           name: '二手房退房率',
//           type: 'pie',
//           radius : '45%',
//           data:[
//             {value:95, name:'成交量(年)'},
//             {value:5, name:'退房量(年)'},
//           ],
//         }
//       ]
//     },
//     data6:{
//       xData: ['本周','本月','季度','半年','全年'],
//       mainTitleLegend:['佣金收益'],
//       yData:{
//         name:'佣金收益',
//         type:'bar',
//         data:[100, 200, 300, 400, 500],
//       },
//     },
//     data7:{
//       xData: ['本周','本月','季度','半年','全年'],
//       mainTitleLegend:['租房定金(元)','租房中介费(元)'],
//       yData: [
//         {
//           name:'租房定金(元)',
//           type:'bar',
//           data:[50, 79, 108, 137, 166]
//         },
//         {
//           name:'租房中介费(元)',
//           type:'bar',
//           data:[30,50,70,90,110]
//         },
//       ],
//     },
//     data8:{
//       mainTitleLegend:['成交量(年)','退房量(年)'],
//       series:[
//         {
//           name: '二手房退房率',
//           type: 'pie',
//           radius : '45%',
//           data:[
//             {value:95, name:'成交量(年)'},
//             {value:5, name:'退房量(年)'},
//           ],
//         }
//       ]
//     },
//     data9:{
//       xData: ['本周','本月','季度','半年','全年'],
//       mainTitleLegend:['租房佣金收益(元)'],
//       yData:{
//         name:'租房佣金收益(元)',
//         type:'bar',
//         data:[1000, 10000, 15000, 20000, 30000],
//       },
//     },
//   }
// }
