import request from '../../../commons/utils/request';

export async function nhGroupBuyRefundContractAuditFetch(params){
    return request('/miss-anzhu-newhouse-tx-groupbuy/groupbuy/contractReview',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function nhCommitContractAuditPassFetch(params){
    return request('/miss-anzhu-newhouse-tx-commit/tx/audit/acceptanceDealAudit',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function nhCommitContractAuditRejectFetch(params){
    return request('/miss-anzhu-newhouse-tx-commit/tx/audit/rejectDealAudit',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
