import request from '../../../../commons/utils/request';

export async function getProjectHousesInfoFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/houses/findAll', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify({
      ...params,
      pageSize:10,
    })
  });
}
export async function updateHousesStatusFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/houses/updateStatus', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });  
}
