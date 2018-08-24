import request from '../../../commons/utils/request';
// import qs from 'qs';

export async function getInitTableDataFetch(params) {
  // const params={
  //
  // }
  return request('/miss-anzhu-advertisement/advertisement/findAll', {
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    method: 'post',
    body:JSON.stringify(params)
  });
}
export async function getInitCitysFetch() {
  return request('/miss-anzhu-operation/service-regions/findAllInfo', {
    method: 'post',
  });
}
export async function addAdvertisementFetch(params){
  return request("/miss-anzhu-advertisement/advertisement/add",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
export async function editAdvertisementFetch(params){
  return request("/miss-anzhu-advertisement/advertisement/edit",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
export async function deleteOneFetch(params){
  return request("/miss-anzhu-advertisement/advertisement/delete",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
export async function getOneDataFetch(params){
  return request("/miss-anzhu-advertisement/advertisement/findOne",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
export async function moveUpFetch(params){
  return request("/miss-anzhu-advertisement/advertisement/up",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
export async function moveDownFetch(params){
  return request("/miss-anzhu-advertisement/advertisement/down",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
export async function onLineFetch(params){
  return request("/miss-anzhu-advertisement/advertisement/upAdment",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
export async function offLineFetch(params){
  return request("/miss-anzhu-advertisement/advertisement/downAdment",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
