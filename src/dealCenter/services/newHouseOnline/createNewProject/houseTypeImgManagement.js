import request from '../../../../commons/utils/request';
import qs from 'qs';

export async function findProjectHouseTypes(params){
  return request('/miss-anzhu-newhouse-project/projects/housetypes/findAll',{
    method: 'POST',
    headers: {
      'Content-Type': "application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  });
}
export async function uploadProjectHouseTypes(params){
    return request('/miss-anzhu-newhouse-project/projects/housetypes/add',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function deleteHouseTypesFetch(params){
    return request('/miss-anzhu-newhouse-project/projects/housetypes/groupDelete',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function getLabelDataFetch(params){
  return request("/miss-anzhu-operation/labels/findGroup",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
