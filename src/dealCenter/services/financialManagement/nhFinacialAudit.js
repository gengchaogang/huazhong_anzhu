import request from '../../../commons/utils/request';

export async function nhGroupBuyRefundFinacialAuditFetch(params){
    return request('/miss-anzhu-newhouse-tx-groupbuy/groupbuy/financialAudit',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function nhCommitFinacialAuditPassFetch(params){
    return request('/miss-anzhu-newhouse-tx-commit/tx/audit/acceptanceFinanceAudit',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function nhCommitFinacialAuditRejectFetch(params){
    return request('/miss-anzhu-newhouse-tx-commit/tx/audit/rejectFinanceAudit',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
