import baseApi from '../../baseApi';
import request from '../../../../commons/utils/request';
import qs from 'qs';
export async function findHouseInfoAll(params){
  return baseApi('/miss-anzhu-secdhouse-resource/main/findHouseInfoAll',params);
}
export async function findAllGuideFetch(params){
  return baseApi('/miss-anzhu-broker/appointment/operationPlatform/findAllGuide',params);
}
export async function houseOffLine(params){
  return request("/miss-anzhu-secdhouse-resource/main/houseOffLine",{
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
