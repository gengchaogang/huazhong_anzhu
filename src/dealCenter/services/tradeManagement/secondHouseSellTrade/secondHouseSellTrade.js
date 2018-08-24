import request from '../../../../commons/utils/request';
//获取【待处理】列表数据
export async function getWaitProcessingListFetch(params){
  return request('miss-anzhu-secdhouse-tx-report/sell/center/getWaitProcessingList', {
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
//执行解锁房源
export async function unlockHouseFetch(params){
  return request('miss-anzhu-secdhouse-tx-report/report/unlock', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//获取【已成交】列表数据
export async function getCommitListFetch(params){
  return request('miss-anzhu-secdhouse-tx-report/sell/center/getCommitList', {
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
  return request('miss-anzhu-secdhouse-tx-report/sell/center/getWaitTransactionList', {
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
//获取一条报成交详细信息
export async function getOneReportTransInfo(params){
  return request('miss-anzhu-secdhouse-tx-report/report/findOne', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//获取【成交申请】审核进程信息
export async function getCommitAuditRecord(params){
  return request('miss-anzhu-secdhouse-tx-commit/audit/getDetails', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//撤回【成交申请】
export async function revokeCommitApply(params){
  return request('miss-anzhu-secdhouse-tx-commit/apply/cancelApply', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//获取【意向金退款申请】审核进程信息
export async function getIntentionRefundAuditRecord(params){
  return request('miss-anzhu-secdhouse-tx-intention/audit/getDetails', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//获取【意向金退款申请】申请初始化数据
export async function getIntentionRefundPreData(params){
  return request('miss-anzhu-secdhouse-tx-intention/apply/preRefund', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//执行【意向金退款申请】
export async function postIntentionRefundApplyFetch(params){
  return request('miss-anzhu-secdhouse-tx-intention/apply/refundApply', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//撤回【意向金退款申请】
export async function revokeIntentionRefundApply(params){
  return request('miss-anzhu-secdhouse-tx-intention/apply/cancelApply', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//获取【首付款退款申请】审核进程信息
export async function getPayDownRefundAuditRecord(params){
  return request('miss-anzhu-secdhouse-tx-firstpayment/audit/getDetails', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//获取【首付款退款申请】申请初始化数据
export async function getPayDownRefundPreData(params){
  return request('miss-anzhu-secdhouse-tx-firstpayment/apply/preRefund', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//执行【首付款退款申请】
export async function postPayDownRefundApplyFetch(params){
  return request('miss-anzhu-secdhouse-tx-firstpayment/apply/refundApply', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//撤回【首付款退款申请】
export async function revokePayDownRefundApply(params){
  return request('miss-anzhu-secdhouse-tx-firstpayment/apply/cancelApply', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//获取【佣金退款申请】审核进程信息
export async function getCommissionRefundAuditRecord(params){
  return request('miss-anzhu-secdhouse-tx-commission/audit/getDetails', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//获取【佣金退款申请】申请初始化数据
export async function getCommissionRefundPreData(params){
  return request('/miss-anzhu-secdhouse-tx-commission/apply/preRefund', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//执行【佣金退款申请】
export async function postCommissionRefundApplyFetch(params){
  return request('miss-anzhu-secdhouse-tx-commission/apply/refundApply', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//撤回【佣金退款申请】
export async function revokeCommissionRefundApply(params){
  return request('miss-anzhu-secdhouse-tx-commission/apply/cancelApply', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//获取【解押申请】审核进程信息
export async function getRelieveLoanAuditRecord(params){
  return request('miss-anzhu-secdhouse-tx-release/audit/getDetails', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//撤回【解押申请】
export async function revokeRelieveLoanRefundApply(params){
  return request('miss-anzhu-secdhouse-tx-release/apply/cancelApply', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//获取【贷款申请】审核进程信息
export async function getLoanAuditRecord(params){
  return request('miss-anzhu-secdhouse-tx-loan/audit/getDetails', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//撤回【贷款申请】
export async function revokeLoanRefundApply(params){
  return request('miss-anzhu-secdhouse-tx-loan/apply/cancelApply', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//获取【过户申请】审核进程信息
export async function getTransferAuditRecord(params){
  return request('miss-anzhu-secdhouse-tx-transfer/audit/getDetails', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//撤回【过户申请】
export async function revokeTransferRefundApply(params){
  return request('miss-anzhu-secdhouse-tx-transfer/apply/cancelApply', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
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
  return request('miss-anzhu-secdhouse-tx-report/sell/add', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//选择撤回退款申请fetch
export function checkRevokeRefundFetch(type){
  if(type==='intention'){
    return revokeIntentionRefundApply;
  }
  else if(type==='payDown'){
    return revokePayDownRefundApply;
  }
  else if(type==='commission'){
    return revokeCommissionRefundApply;
  }
  else if(type==='relieveLoan'){
    return revokeRelieveLoanRefundApply;
  }
  else if(type==='loan'){
    return revokeLoanRefundApply;
  }
  else if(type==='transfer'){
    return revokeTransferRefundApply;
  }
  else if(type==='commit'){
    return revokeCommitApply;
  }
}
