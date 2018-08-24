import request from '../../../commons/utils/request';

export async function shSellIntentsContractAuditPassFetch(params){
    return request('/miss-anzhu-secdhouse-tx-intention/audit/refundAudit/pass',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function shSellIntentsContractAuditRejectFetch(params){
    return request('/miss-anzhu-secdhouse-tx-intention/audit/refundAudit/reject',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function shSellDownPaymentContractAuditPassFetch(params){
    return request('/miss-anzhu-secdhouse-tx-firstpayment/audit/refundAudit/pass',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function shSellDownPaymentContractAuditRejectFetch(params){
    return request('/miss-anzhu-secdhouse-tx-firstpayment/audit/refundAudit/reject',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function shSellCommissionContractAuditPassFetch(params){
    return request('/miss-anzhu-secdhouse-tx-commission/audit/refundAudit/pass',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function shSellCommissionContractAuditRejectFetch(params){
    return request('/miss-anzhu-secdhouse-tx-commission/audit/refundAudit/reject',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function shSellCommitContractAuditPassFetch(params){
    return request('/miss-anzhu-secdhouse-tx-commit/audit/commitAudit/pass',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function shSellCommitContractAuditRejectFetch(params){
    return request('/miss-anzhu-secdhouse-tx-commit/audit/commitAudit/reject',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
