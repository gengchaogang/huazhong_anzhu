import request from '../../../commons/utils/request';
import qs from 'qs';

export async function getInitSecondHandDealTableDataFetch(){
    return request('/miss-anzhu-newhouse-project/projects/publish/projectsSellList',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
		});
}

/** 二手房意向金退款审核列表 */
export async function getInitIntentMoneyAuditTableDataFetch(params){
    return request('/miss-anzhu-secdhouse-tx-intention/sell/audit/refundAuditList',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}

export async function getDetailsDataFetch(params){
    return request(params.url,{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params.applyId)
		});
}

export async function intentMoneyRejectFetch(params){
    return request('/miss-anzhu-secdhouse-tx-intention/audit/refundAudit/reject',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}

export async function intentMoneyPassFetch(params){
    return request('/miss-anzhu-secdhouse-tx-intention/audit/refundAudit/pass',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}

export async function getInitUserFetch(params){
    return request('/miss-anzhu-secdhouse-tx-intention/audit/refundAudit/pass',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}

/** 二手房首付款退款审核 */
export async function getInitDownPaymentAuditTableDataFetch(params){
    return request('/miss-anzhu-secdhouse-tx-firstpayment/audit/refundAuditList',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}

export async function getInitCommissionAuditTableDataFetch(params){
    return request('/miss-anzhu-secdhouse-tx-commission/sell/audit/refundAuditList',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function downPaymentPassFetch(params){
    return request('/miss-anzhu-secdhouse-tx-firstpayment/audit/refundAudit/pass',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function downPaymentRejectFetch(params){
    return request('/miss-anzhu-secdhouse-tx-firstpayment/audit/refundAudit/reject',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function commissionPassFetch(params){
    return request('miss-anzhu-secdhouse-tx-commission/audit/refundAudit/pass',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}


export async function commissionRejectFetch(params){
    return request('/miss-anzhu-secdhouse-tx-commission/audit/refundAudit/reject',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}

/** 二手房出售 成交审核列表 */
export async function commitAuditList(params){
    return request('/miss-anzhu-secdhouse-tx-commit/sell/audit/commitAuditList',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}

/** 二手房成交审核通过 */
export async function secondHandDealPass(params){
    return request('/miss-anzhu-secdhouse-tx-commit/audit/commitAudit/pass',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}

/** 二手房成交审核驳回 */
export async function secondHandDealReject(params){
    return request('/miss-anzhu-secdhouse-tx-commit/audit/commitAudit/reject',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
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
