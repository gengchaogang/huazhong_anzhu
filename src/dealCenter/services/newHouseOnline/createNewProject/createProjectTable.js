import request from '../../../../commons/utils/request';
import qs from 'qs';
export async function uploadFile(params){
    // return request('/miss-anzhu-newhouse-project/projects/edit?'+qs.stringify(params))//get 请求用
    return request('/miss-anzhu-newhouse-project/projects/houses/upload',{
      method: 'POST',
			body:params
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
export async function getInitProjectTableDataFetch(params){
  return request("/miss-anzhu-newhouse-project/projects/houses/findAll",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
export async function deleteHouseResourceFetch(params){
  return request("/miss-anzhu-newhouse-project/projects/houses/groupDelete",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
export async function bandHouseTypeFetch(params){
  return request("/miss-anzhu-newhouse-project/projects/houses/binding",{

    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
export async function uploadEditDataFetch(params){
  return request("/miss-anzhu-newhouse-project/projects/houses/edit",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
export async function getTableOneDataFetch(params){
  return request("/miss-anzhu-newhouse-project/projects/houses/findOne",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
export async function getInitHouseTypeNamesFetch(params){
  return request("/miss-anzhu-newhouse-project/projects/housetypes/findAllBrief",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
export async function judgeHouseHasHouseTypeFetch(params){
  return request("/miss-anzhu-newhouse-project/projects/houses/bindingStatus",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
