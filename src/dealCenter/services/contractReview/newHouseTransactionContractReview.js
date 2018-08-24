import request from '../../../commons/utils/request';

/** 新房成交列表 */
export async function findAllMyDealAudit(params){
  return request('/miss-anzhu-newhouse-tx-commit/tx/audit/findAllMyDealAudit', {
    method: 'post',
    body: JSON.stringify(params),
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
  });
}

export async function getProjectListFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/onsell/brief', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}

/** detailType groupKey 得到详细信息 */
export async function getTrackDetailByGroupKeyAndDetailType(params){
  return request('/miss-anzhu-tx-track/track/getTrackDetailByGroupKeyAndDetailType', {
    method: 'post',
    body: JSON.stringify(params),
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
  });
}


/** 新房成交审核通过 */
export async function acceptanceDealAudit(params){
  return request('/miss-anzhu-newhouse-tx-commit/tx/audit/acceptanceDealAudit', {
    method: 'post',
    body: JSON.stringify(params),
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
  });
}

/** 新房成交审核驳回 */
export async function rejectDealAudit(params){
  return request('/miss-anzhu-newhouse-tx-commit/tx/audit/rejectDealAudit', {
    method: 'post',
    body: JSON.stringify(params),
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
  });
}

/** apiName 名称 */
export async function requestApi(params){
  return request(params.apiName, {
    method: 'post',
    body: JSON.stringify(params),
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
  });
}




/**  ----------------------------退款审核 start------------------------------*/
/** 团购退款列表 */
export async function findAuditList(params){
  return request('/miss-anzhu-newhouse-tx-groupbuy/groupbuy/findAuditList', {
    method: 'post',
    body: JSON.stringify(params),
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
  });
}

/** 团购订单信息 */
export async function findGroupBuyPayOrder(params){
  return request('/miss-anzhu-newhouse-tx-groupbuy/groupbuy/findPayOrder', {
    method: 'post',
    body: JSON.stringify(params),
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
  });
}

/** 查询团购退款审核信息 */
export async function findGroupBuyAuditInfo(params){
  return request('/miss-anzhu-newhouse-tx-groupbuy/groupbuy/findAuditInfo', {
    method: 'post',
    body: JSON.stringify(params),
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
  });
}


/** 退款审核 通过、驳回 */
export async function gruopBuyContractReview(params){
  return request('/miss-anzhu-newhouse-tx-groupbuy/groupbuy/contractReview', {
    method: 'post',
    body: JSON.stringify(params),
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
  });
}
