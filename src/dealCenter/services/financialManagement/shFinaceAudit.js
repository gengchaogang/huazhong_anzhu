import request from '../../../commons/utils/request';

export async function shSellIntentsFinanceAuditPassFetch(params){
    return request('/miss-anzhu-secdhouse-tx-intention/audit/fefundAudit/pass',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function shSellIntentsFinanceAuditRejectFetch(params){
    return request('/miss-anzhu-secdhouse-tx-intention/audit/fefundAudit/reject',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function shSellDownPaymentFinanceAuditPassFetch(params){
    return request('/miss-anzhu-secdhouse-tx-firstpayment/audit/fefundAudit/pass',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function shSellDownPaymentFinanceAuditRejectFetch(params){
    return request('/miss-anzhu-secdhouse-tx-firstpayment/audit/fefundAudit/reject',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function shSellCommissionFinanceAuditPassFetch(params){
    return request('/miss-anzhu-secdhouse-tx-commission/audit/fefundAudit/pass',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function shSellCommissionFinanceAuditRejectFetch(params){
    return request('/miss-anzhu-secdhouse-tx-commission/audit/fefundAudit/reject',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function shSellCommitFinanceAuditPassFetch(params){
    return request('/miss-anzhu-secdhouse-tx-commit/audit/fefundAudit/pass',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function shSellCommitFinanceAuditRejectFetch(params){
    return request('/miss-anzhu-secdhouse-tx-commit/audit/fefundAudit/reject',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
