import request from '../../../../commons/utils/request';
import qs from 'qs';
//地址全部前面多加了版本号，不使用mock时注意删除

export async function getProjectListFetch(params){
  return request('7/miss-anzhu-newhouse-project/projects/onsell/brief', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
  });
}
export async function searchHouseFetch(params){
  return request('7/miss-anzhu-newhouse-project/projects/onsell/brief', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
  });
}
//获取项目销控表数据
export async function getProjectHousesIntentionFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/houses/intention', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//现场录客户
export async function postCustomerDolookFetch(params){
  return request('/miss-anzhu-newhouse-tx-view/viewed/add', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
