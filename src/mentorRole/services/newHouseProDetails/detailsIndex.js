import request from '../../../commons/utils/request';
// import qs from 'qs';

export async function getInitCitysFetch(){
  return request("/miss-anzhu-operation/service-regions/findAllInfo",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
  })
}
export async function getInitDataFetch(params){
  return request("/miss-anzhu-secdhouse-resource/main/findFilterAndOrderHouse",{
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
export async function secondhouseOffLine(params){
  return request("/miss-anzhu-secdhouse-resource/main/houseOffLine",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
export async function secoffLineFetch(params){
  return request("/miss-anzhu-secdhouse-resource/main/houseOffLine",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
