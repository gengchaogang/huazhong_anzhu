import request from '../../../../commons/utils/request';
import qs from 'qs';

export async function getInitDataFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/getBriefInfo',{
    method: 'POST',
    headers: {
      'Content-Type': "application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  });
}
export async function uploadPicFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/certificates/add',{
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
export async function getInitImgFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/certificates/findAll',{
    method: 'POST',
    headers: {
      'Content-Type': "application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  });
}
export async function editPicFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/certificates/edit',{
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
