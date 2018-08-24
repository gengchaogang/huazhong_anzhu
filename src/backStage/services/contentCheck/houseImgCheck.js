import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function findAllAreas(params){
  return baseApi('/miss-anzhu-operation/service-regions/findAllAreasOpen',params);
}
export async function findGroup(params){
  return baseApi('/miss-anzhu-operation/labels/findGroup',params);
}
export async function getInitTableDataFetch(params){
  return request("/miss-anzhu-secdhouse-resource/main/findHouseContentAudit",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
// export async function getInitTableDataFetch(params){
//   return request("/miss-anzhu-secdhouse-resource/main/findHouseContentAudit",{
//     method:'POST',
//     headers:{
//       'Content-Type':"application/json;charset=UTF-8"
//     },
//     body:JSON.stringify(params)
//   })
// }
