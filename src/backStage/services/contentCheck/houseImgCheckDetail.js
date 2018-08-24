import request from '../../../commons/utils/request';
// import qs from 'qs';

export async function getInitImgsDataFetch(params){
  return request("/miss-anzhu-secdhouse-resource/main/findHouseContentAuditById",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
export async function auditUserPic(params){
  return request("/miss-anzhu-secdhouse-resource/main/auditUserPic",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
