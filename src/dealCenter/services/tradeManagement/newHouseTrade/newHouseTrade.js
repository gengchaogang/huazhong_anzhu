import request from '../../../../commons/utils/request';
import qs from 'qs';
//地址全部前面多加了版本号，不使用mock时注意删除

export async function getProjectListFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/onsell/brief', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
  });
}
export async function getProjectDetailFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/findByProjectId', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//获取【已报备】表格数据
export async function getHasReportedTableData(params){
  return request('/miss-anzhu-newhouse-tx-report/reports/findAll', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//获取【已确看】表格数据
export async function getHasConfirmedTableData(params){
  return request('/miss-anzhu-newhouse-tx-view/viewed/findAll', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//获取【已团购】表格数据=======>地址错误
export async function getHasGroupPurchaseTableData(params){
  return request('/miss-anzhu-newhouse-tx-groupbuy/groupbuy/findAll', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//获取【已成交】表格数据=======>地址错误
export async function getHasTradedTableData(params){
  return request('/miss-anzhu-newhouse-tx-commit/tx/findAllMyAdd', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//获取【已爽约】表格数据=======>地址错误
export async function getHasMissTableData(params){
  return request('/miss-anzhu-newhouse-transaction/views/findAll', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:qs.stringify(params)
  });
}
//获取【已撤回】表格数据=======>地址错误
export async function getHasRevokeTableData(params){
  return request('/miss-anzhu-newhouse-transaction/views/findAll', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:qs.stringify(params)
  });
}
//提交【驳回报备】原因
export async function uploadRejectFetch(params){
  return request('/miss-anzhu-newhouse-tx-report/reports/rejectReports', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//报备受理
export async function acceptReportFetch(params){
  return request('/miss-anzhu-newhouse-tx-report/reports/dealReports', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//申请团购退款获取订单信息
export async function getOrderTableDataFetch(params){
  return request('/miss-anzhu-newhouse-tx-groupbuy/groupbuy/findPayOrder', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//申请团购退款
export async function postGroupBuyRefundApply(params){
  return request('/miss-anzhu-newhouse-tx-groupbuy/groupbuy/refundApplication', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//获取团购退款审核信息
export async function getGroupBuyRefundInfo(params){
  return request('/miss-anzhu-newhouse-tx-groupbuy/groupbuy/findAuditInfo', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//撤回团购退款申请
export async function revokeGroupBuyRefundApplyFetch(params){
  return request('/miss-anzhu-newhouse-tx-groupbuy/groupbuy/cancelRefundApplication', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//撤回成交申请
export async function revokeCommitApplyFetch(params){
  return request('/miss-anzhu-newhouse-tx-commit/tx/revokeTx', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//获取成交审核状态
export async function getNHCommitAuditStatusFetch(params){
  return request('/miss-anzhu-newhouse-tx-commit/tx/findOneStatus', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//取消电商团购订单
export async function cancelGroupBuyOrderFetch(params){
  return request('/miss-anzhu-newhouse-tx-groupbuy/groupbuy/cancelOrder', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//验证导出是否有效
export async function verifiExportExcelFetch(path){
  return request(path, {
    method: 'get',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
  });
}
