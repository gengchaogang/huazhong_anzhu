import request from '../../../../commons/utils/request';
//发起贷款申请
export async function postTransferApplyFetch(params){
  return request('miss-anzhu-secdhouse-tx-transfer/apply/transferApply', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
