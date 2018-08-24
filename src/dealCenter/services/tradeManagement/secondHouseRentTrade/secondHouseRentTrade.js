import request from '../../../../commons/utils/request';
//获取【待处理】列表数据
export async function getWaitProcessingListFetch(params){
  return request('miss-anzhu-secdhouse-tx-report/lease/center/getWaitProcessingList', {
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
//执行驳回成交申请
export async function rejectProcessingApplyFetch(params){
  return request('miss-anzhu-secdhouse-tx-report/report/center/reject', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//执行接受成交申请
export async function acceptProcessingApplyFetch(params){
  return request('miss-anzhu-secdhouse-tx-report/report/center/accept', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//获取【已成交】列表数据
export async function getCommitListFetch(params){
  return request('miss-anzhu-secdhouse-tx-report/lease/center/getCommitList', {
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
//获取【待成交】列表数据
export async function getWaitTransactionListFetch(params){
  return request('miss-anzhu-secdhouse-tx-report/lease/center/getWaitTransactionList', {
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
//获取【待成交】列表数据
export async function revokeRentLoanRefundApply(params){
  return request('miss-anzhu-secdhouse-tx-loan/apply/cancelApply', {
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
export async function getBaoChengJiao(params){
  return request('miss-anzhu-secdhouse-tx-report/tradingCenterReport/prepareReport', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}

export async function commitData(params){
  return request('miss-anzhu-secdhouse-tx-report/lease/add', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
