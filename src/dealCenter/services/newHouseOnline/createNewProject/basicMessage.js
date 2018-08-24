import request from '../../../../commons/utils/request';
import qs from 'qs';

export async function uploadBasicMessage(params){
    return request('/miss-anzhu-newhouse-project/projects/add',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function editBasicMessage(params){
    return request('/miss-anzhu-newhouse-project/projects/edit',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function getInitDataFetch(params){
    return request('/miss-anzhu-newhouse-project/projects/findOne',{
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

export async function getInitCitysFetch(){
  return request("/miss-anzhu-operation/service-regions/findAllInfo",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
  })
}
