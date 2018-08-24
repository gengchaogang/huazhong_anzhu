import request from '../../../commons/utils/request';
import qs from 'qs';
export async function getInitTableDataFetch(params){
    return request('/miss-anzhu-secdhouse-tx-transfer/audit/transferAuditList',{
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
    return request('/miss-anzhu-secdhouse-tx-transfer/audit/getDetails',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function aduitRejectFetch(params){
    return request('/miss-anzhu-secdhouse-tx-transfer/audit/transferAudit/reject',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function aduitPassFetch(params){
    return request('/miss-anzhu-secdhouse-tx-transfer/audit/transferAudit/accept',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function transferPassFetch(params){
    return request('/miss-anzhu-secdhouse-tx-transfer/audit/transferAudit/approved',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
