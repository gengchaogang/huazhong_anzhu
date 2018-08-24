import request from '../../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../../baseApi';

export async function findFilterAndOrderHouseFetch(params){
  return baseApi('/miss-anzhu-secdhouse-resource/main/findFilterAndOrderHouse',params);
}
export async function findAllTradingCenterFetch(params){
  return baseApi('/miss-anzhu-trading-center/trading-centers/findAllCodeAndName',params);
}
export async function findAllAreasOpenFetch(params){
  return baseApi('/miss-anzhu-operation/service-regions/findAllAreasOpen',params);
}
export async function projectsAuditList(params){
  return baseApi('/miss-anzhu-newhouse-project/projects/publish/projectsAuditList',params);
}
export async function newHouseApply(params){
  return baseApi('/miss-anzhu-newhouse-project/projects/operationsCenter/onLine/apply',params);
}
export async function delProject(params){
  return baseApi('/miss-anzhu-newhouse-project/projects/delProject',params);
}
export async function houseOnLine(params){
  return baseApi('/miss-anzhu-secdhouse-resource/main/houseOnLine',params);
}
export async function deleteHouse(params){
  return baseApi('/miss-anzhu-secdhouse-resource/main/deleteHouse',params);
}
export async function getInitNewHouDataFetch(params){
  return request("/miss-anzhu-newhouse-project/projects/publish/projectsOffTheAssemblyLineList",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
