import request from '../../../../commons/utils/request';
// import qs from 'qs';

export async function getInitCitysFetch(){
  return request("/miss-anzhu-operation/service-regions/findAllInfo",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
  })
}
export async function getDealCenterDataFetch(){
  return request("/miss-anzhu-trading-center/trading-centers/findAllCodeAndName",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
  })
}

export async function getInitDataFetch(params){
  return request("/miss-anzhu-newhouse-project/projects/publish/projectsAuditList",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
export async function offLineFetch(params){
  return request("/miss-anzhu-newhouse-project/projects/operationsCenter/offLine/apply",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
