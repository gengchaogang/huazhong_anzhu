import request from '../../../../commons/utils/request';
import qs from 'qs';
export async function reportDoVisitFetch(params){
  return request('/miss-anzhu-newhouse-tx-report/reports/acceptanceReports', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
export async function addDoVisitFetch(params){
  return request('/miss-anzhu-newhouse-tx-view/viewed/addViewed', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
