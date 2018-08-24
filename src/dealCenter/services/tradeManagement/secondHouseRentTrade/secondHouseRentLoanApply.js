import request from '../../../../commons/utils/request';
//发起贷款申请
export async function postLoanApplyFetch(params){
  return request('miss-anzhu-secdhouse-tx-loan/lease/apply/loanApply', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
