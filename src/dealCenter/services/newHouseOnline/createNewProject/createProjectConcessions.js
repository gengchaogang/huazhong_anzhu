import request from '../../../../commons/utils/request';
import qs from 'qs';
export async function getInitConcessionsDataFetch(params){
    return request('/miss-anzhu-newhouse-project/projects/discounts/findAll',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function addConcessionsFetch(params){
    return request('/miss-anzhu-newhouse-project/projects/discounts/add',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function editConcessionsFetch(params){
    return request('/miss-anzhu-newhouse-project/projects/discounts/edit',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function deleteIdsFetch(params){
    return request('/miss-anzhu-newhouse-project/projects/discounts/groupDelete',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
export async function searchOneDataFetch(params){
    return request('/miss-anzhu-newhouse-project/projects/discounts/findOne',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
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
