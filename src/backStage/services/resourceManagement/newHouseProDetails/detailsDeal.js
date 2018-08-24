import request from '../../../../commons/utils/request';
// import qs from 'qs';
export async function getInitDataFetch(params){
  return request("/miss-anzhu-secdhouse-resource/main/findOneHouseBaseInfo",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
export async function getReportTrackFollowByGroupKey(params){
  return request("/miss-anzhu-tx-track/track/getReportTrackFollowByGroupKey",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
export async function getTransCode(params){
  return request("/miss-anzhu-secdhouse-resource/main/getTransCode",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
export async function getTrackByGroupKeyFetch(params){
  return request("/miss-anzhu-tx-track/track/getTrackByGroupKey",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
