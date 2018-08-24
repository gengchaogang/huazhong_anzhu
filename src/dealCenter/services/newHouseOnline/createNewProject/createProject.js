
import request from '../../../../commons/utils/request';
import qs from 'qs';

export async function uploadBasicMessage(params){
    console.log("params is",params)
    return request('/miss-anzhu-newhouse-project/projects/add',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function editBasicMessage(params){
    console.log("params is",params)
    return request('/miss-anzhu-operation/labels/findGroup',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function getInitDataFetch(params){
    return request('/miss-anzhu-operation/labels/findGroup',{
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
export async function findProjectHouseTypes(params){
  console.log("params is",params)
  return request('/miss-anzhu-operation/labels/findGroup',{
    method: 'POST',
    headers: {
      'Content-Type': "application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  });
}
export async function uploadProjectHouseTypes(params){
    // console.log("params is",JSON.stringify(params))
    return request('/miss-anzhu-operation/labels/findGroup',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function deleteHouseTypesFetch(params){
    // console.log("params is",JSON.stringify(params))
    return request('/miss-anzhu-newhouse-project/projects/housetypes/add',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
