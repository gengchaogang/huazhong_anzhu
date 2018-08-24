import request from '../../../../commons/utils/request';

export async function postTransactionInfoFetch(params){
  return request('/miss-anzhu-newhouse-tx-commit/tx/add', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
export async function getTransactionOrderInfoDataFetch(params){
  return request('/miss-anzhu-newhouse-tx-commit/tx/findOneByGroupkey', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
export async function addTransactionsApplyFetch(params){
  return request('/miss-anzhu-newhouse-tx-commit/tx/audit/addDealAudit', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
export async function findGroupCustomerInfoFetch(params){
  return request('/miss-anzhu-newhouse-tx-groupbuy/groupbuy/findCustomerInfo', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify({
      pageNo:0,
      pageSize:100000,
      ...params,
    })
  });
}
export async function editCommitAddInfoFetch(params){
  return request('/miss-anzhu-newhouse-tx-commit/tx//edit', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
