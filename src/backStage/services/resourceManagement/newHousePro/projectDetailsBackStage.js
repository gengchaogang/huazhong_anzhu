import request from '../../../../commons/utils/request';
// import qs from 'qs';
//地址全部前面多加了版本号，不使用mock时注意删除

export async function getProjectListFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/findAll', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify({state:'在售',keyword:''})
  });
}

export async function getProjectBasicInfoFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/findOne', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
export async function getProjectAlbumInfoFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/album/findAll', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
export async function getHouseImgInfoFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/housetypes/findAll', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
export async function getHousesSalesTableDataFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/houses/findAll', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify({
      pageNo:0,
      pageSize:10,
      ...params,
    })
  });
}
export async function getProjectDiscountInfoDataFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/discounts/findAll', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify({
      pageNo:0,
      pageSize:10,
      ...params,
    })
  });
}
export async function getProjectCertificatesInfoDataFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/certificates/findAll', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
