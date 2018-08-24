import request from '../../commons/utils/request';
import qs from 'qs';
export async function searchBrokerFetch(params){
  return request('/miss-anzhu-broker/brokers/findAllBrief', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify({
      pageNo:0,
      pageSize:10,
      ...params,
    })
  });
}
