import request from '../../../../commons/utils/request';
//发起贷款申请
export async function getSellHouseInfo(params){
  return request('/miss-anzhu-secdhouse-tx-report/report/findOne', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
