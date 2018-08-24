import request from '../../../commons/utils/request';
export async function getGroupStatisticsFetch(){
  return request('/miss-anzhu-statistics/tradingcenter/tradingscenter/groupStatistics', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
  });
}
//
// export async function query(params){
//   return {
//     data1:{
//       xData: ['本周','本月','季度','半年','全年'],
//       mainTitleLegend:['林八千','刘伯温','郭八两','赵四','何平台','王五'],
//       yData: [
//         {
//           name:'林八千',
//           type:'bar',
//           data:[30, 50, 70, 90, 110]
//         },
//         {
//           name:'刘伯温',
//           type:'bar',
//           data:[200,250,300,350,400]
//         },
//         {
//           name:'郭八两',
//           type:'bar',
//           data:[20,50,80,110,140]
//         },
//         {
//           name:'赵四',
//           type:'bar',
//           data:[50,60,70,80,90]
//         },
//         {
//           name:'何平台',
//           type:'bar',
//           data:[50,60,70,80,90]
//         },
//         {
//           name:'王五',
//           type:'bar',
//           data:[40,60,80,100,120]
//         },
//       ],
//     },
//
//   }
// }
