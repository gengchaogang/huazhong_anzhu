import request from '../../commons/utils/request';
export async function findChargeStatusFetch(params){
  return request('/miss-anzhu-account/charge/findChargeStatus', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
