import request from '../../commons/utils/request';
import qs from 'qs';
export async function query(params){
  return {
     data4:{
        xData: ['本周','本月','季度','半年','全年'],
        boundaryGap:false,
        mainTitleLegend:['购房定金(万)','购房首付款(万)','购房中介(万)'],
        yData: [
          {
            name:'购房定金(万)',
            type:'line',
            data:[100, 200, 300, 400, 500],
            areaStyle: {normal: {}},
            itemStyle:{
              normal:{color:'#ab78ba'}
            }
          },
          {
            name:'购房首付款(万)',
            type:'line',
            data:[1000,2000,3000,4000,5000],
            areaStyle: {normal: {}},
            itemStyle:{
              normal:{color:'#72b201'}
            }
          },
          {
            name:'购房中介(万)',
            type:'line',
            data:[200,300,400,500,600],
            areaStyle: {normal: {}},
            itemStyle:{
              normal:{color:'#08a9f2'}
            }
          },
        ],
    },
    data1:{
      xData: ['新房报备','新房带看','新房成交','二手房预约','二手房带看','二手房成交'],
      mainTitleLegend:['住宅','商铺','写字楼'],
      boundaryGap:false,
      yData: [
        {
          name:'住宅',
          type:'line',
          data:[12, 10, 13, 16, 10,17],
          areaStyle: {normal: {}},
          itemStyle:{
            normal:{color:'#EAEAEA'}
          }
        },
        {
          name:'商铺',
          type:'line',
          data:[2,7,9,7,7,5],
          areaStyle: {normal: {}},
          itemStyle:{
            normal:{color:'#A993CB'}
          }
        },
        {
          name:'写字楼',
          type:'line',
          data:[3,4,5,6,7,8],
          areaStyle: {normal: {}},
          itemStyle:{
            normal:{color:'#99CBC1'}
          }
        },
      ],
    },
    data5:{
      mainTitleLegend:['新房成交','二手房成交','出租房成交'],
      series:[
        {
          name: '成交数据',
          type: 'pie',
          radius : '45%',
          data:[
            {value:6, name:'新房成交'},
            {value:6, name:'二手房成交'},
            {value:6,name:"出租房成交"}
          ],
        }
      ]
    },
  }
}
// 异步请求模板 改function名字和路由就可以了
export async function getInitDealDataFetch(params){
    return request('/miss-anzhu-statistics/broker/getTransactionCountForMonth',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function getInitInfoFetch(params){
    return request('/miss-anzhu-tutor/tutors/findCompanyInfo',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function getInitBussinessDataFetch(params){
    return request('/miss-anzhu-statistics/broker/getBusinessCountForMonth',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function getInitAnzhuDataFetch(params){
    return request('/miss-anzhu-statistics/tutorforweb/statistics/findtutor',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function getInitYesterdayBussinessDataFetch(params){
    return request('/miss-anzhu-statistics/tutorforweb/statistics/findbusinessdata',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function getInitYesterdayDealDataFetch(params){
    return request('/miss-anzhu-statistics/tutorforweb/statistics/findyesterdaysdealdata',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function getinitBrokerAgentRankFetch(params){
    return request('/miss-anzhu-statistics/tutorforweb/statistics/findbrokersmonth',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function getInitDatachartsFetch(params){
    return request('/miss-anzhu-statistics/tutorforweb/statistics/finddatacharts',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function getInitBrokerIdInfosFetch(params){
    return request('/miss-anzhu-broker/brokers/getVisitingCard',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function getInitAgentRankFetch(params){
    return request('/miss-anzhu-broker/statistics/rankingList',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function getInitAgentTrendChartDataFetch(params){
    return request('/miss-anzhu-statistics/broker/getTrendChartData',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
