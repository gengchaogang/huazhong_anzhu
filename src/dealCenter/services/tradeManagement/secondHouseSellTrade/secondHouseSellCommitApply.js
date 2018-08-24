import request from '../../../../commons/utils/request';
//发起成交申请
export async function postCommitApplyFetch(params){
  return request('miss-anzhu-secdhouse-tx-commit/sell/apply/commitApply', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//获取报成交基础数据
export async function getCommitApplyBasicDataFetch(params){
  return request('miss-anzhu-secdhouse-tx-commit/preApplyCommit', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
