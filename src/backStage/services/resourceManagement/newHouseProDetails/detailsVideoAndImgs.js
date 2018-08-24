import request from '../../../../commons/utils/request';
// import qs from 'qs';

export async function getInitImgDataFetch(params){
  return request("/miss-anzhu-secdhouse-resource/main/findHouseInfoAll",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
