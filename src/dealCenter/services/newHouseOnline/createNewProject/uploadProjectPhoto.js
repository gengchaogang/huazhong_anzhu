import request from '../../../../commons/utils/request';
import qs from 'qs';

export async function getImgDataFetch(params){
  return request(' /miss-anzhu-newhouse-project/projects/album/findAll',{
    method: 'POST',
    headers: {
      'Content-Type': "application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  });
}

export async function upLoadPicFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/album/add',{
    method: 'POST',
    headers: {
      'Content-Type': "application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  });
}
export async function editPicFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/album/edit',{
    method: 'POST',
    headers: {
      'Content-Type': "application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  });
}
