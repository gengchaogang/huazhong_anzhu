import request from '../../../commons/utils/request';
import qs from 'qs';

export async function getInitTableDataFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/publish/projectsList',{
    method: 'POST',
    headers: {
      'Content-Type': "application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  });
}
export async function getInitAuditDataFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/publish/auditsList',{
    method: 'POST',
    headers: {
      'Content-Type': "application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  });
}
export async function getInitOffLineDataFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/publish/projectsOffTheAssemblyLineList',{
    method: 'POST',
    headers: {
      'Content-Type': "application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  });
}
export async function offLineFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/offLine/apply',{
    method: 'POST',
    headers: {
      'Content-Type': "application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  });
}
export async function getDetailsDataFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/housetypes/add',{
    method: 'POST',
    headers: {
      'Content-Type': "application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  });
}
export async function projectsAuditOneFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/publish/projectsAuditOne',{
    method: 'POST',
    headers: {
      'Content-Type': "application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  });
}
export async function projectsByOneFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/publish/projectsByOne',{
    method: 'POST',
    headers: {
      'Content-Type': "application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  });
}
export async function projectReleaseFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/publish/add',{
    method: 'POST',
    headers: {
      'Content-Type': "application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  });
}
export async function getBriefInfoFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/getBriefInfo',{
    method: 'POST',
    headers: {
      'Content-Type': "application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  });
}
export async function publishWithdrawFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/publish/withdraw',{
    method: 'POST',
    headers: {
      'Content-Type': "application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  });
}
export async function offlineWithdrawFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/offLine/withdraw',{
    method: 'POST',
    headers: {
      'Content-Type': "application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  });
}
export async function getInitEmployeesFetch(params){
  return request('/miss-anzhu-trading-center/employees/findUsersByAuthorityName',{
    method: 'POST',
    headers: {
      'Content-Type': "application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  });
}
export async function getEditTableDataFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/publish/editsList',{
    method: 'POST',
    headers: {
      'Content-Type': "application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  });
}
