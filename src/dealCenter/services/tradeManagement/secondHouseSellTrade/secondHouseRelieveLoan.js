import request from '../../../../commons/utils/request';
//发起解押申请
export async function postRelieveLoanApplyFetch(params){
  return request('miss-anzhu-secdhouse-tx-release/apply/releaseApply', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
