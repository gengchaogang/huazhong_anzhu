import request from '../../../commons/utils/request';
import qs from 'qs';
export async function query(params){
  return {
    data1:{
      xData: ['新房报备','新房带看','新房成交','二手房预约','二手房带看','二手房成交'],
      mainTitleLegend:['住宅','商铺','写字楼'],
      yData: [
        {
          name:'住宅',
          type:'bar',
          data:[10, 10, 10, 10, 10,10]
        },
        {
          name:'商铺',
          type:'bar',
          data:[7,7,7,7,7,7]
        },
        {
          name:'写字楼',
          type:'bar',
          data:[3,4,5,6,7,8]
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

export async function getInitStatisticalDataFetch(params){
    return request('/miss-anzhu-statistics/datastatistics/statistics/income',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function getInitBussinessDataFetch(params){
    return request('/miss-anzhu-statistics/datastatistics/statistics/businessdata',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function getInitPieChartsDataFetch(params){
    return request('/miss-anzhu-statistics/datastatistics/statistics/transaction',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
