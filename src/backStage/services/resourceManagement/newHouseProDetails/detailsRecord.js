import request from '../../../../commons/utils/request';
// import qs from 'qs';

export async function getInitDataFetch(params){
  return request("/miss-anzhu-broker/appointment/operationPlatform/findAllGuide",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
