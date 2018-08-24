import request from '../../../commons/utils/request';
import qs from 'qs';
export async function getInitTableDataFetch(params){
    return request('/miss-anzhu-secdhouse-tx-loan/sell/audit/loanAuditList',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function getPeopleDataFetch(params){
    return request('/miss-anzhu-trading-center/employees/findUsersByAuthorityName',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function getDetailsInfosFetch(params){
    return request('/miss-anzhu-secdhouse-tx-loan/audit/getDetails',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function aduitPassFetch(params){
    return request('/miss-anzhu-secdhouse-tx-loan/audit/loanAudit/accept',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function aduitRejectFetch(params){
    return request('/miss-anzhu-secdhouse-tx-loan/audit/loanAudit/reject',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function transferPassFetch(params){
    return request('/miss-anzhu-secdhouse-tx-loan/audit/loanAudit/approved',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
