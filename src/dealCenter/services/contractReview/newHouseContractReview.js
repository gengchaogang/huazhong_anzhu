import request from '../../../commons/utils/request';
import qs from 'qs';

export async function getInitPublishTableDataFetch(){
    return request('/miss-anzhu-newhouse-project/projects/publish/projectsSellList',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
		});
}
export async function getInitDownShelvesTableDataFetch(params){
    return request('/miss-anzhu-newhouse-project/projects/add',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}

/** apiName 名称 */
export async function requestApi(params){
  return request(params.apiName, {
    method: 'post',
    body: JSON.stringify(params),
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
  });
}

// export async function getInitDownShelvesTableDataFetch(params){  //项目发布审核通过Fetch
//     return request('/miss-anzhu-newhouse-project/projects/add',{
//       method: 'POST',
//       headers: {
//         'Content-Type': "application/json;charset=UTF-8"
//       },
// 			body:JSON.stringify(params)
// 		});
// }
// export async function getInitDownShelvesTableDataFetch(params){  //项目发布审核驳回Fetch
//     return request('/miss-anzhu-newhouse-project/projects/add',{
//       method: 'POST',
//       headers: {
//         'Content-Type': "application/json;charset=UTF-8"
//       },
// 			body:JSON.stringify(params)
// 		});
// }
// export async function getInitDownShelvesTableDataFetch(params){  //项目下架审核通过Fetch
//     return request('/miss-anzhu-newhouse-project/projects/add',{
//       method: 'POST',
//       headers: {
//         'Content-Type': "application/json;charset=UTF-8"
//       },
// 			body:JSON.stringify(params)
// 		});
// }
// export async function getInitDownShelvesTableDataFetch(params){  //项目下架审核驳回Fetch
//     return request('/miss-anzhu-newhouse-project/projects/add',{
//       method: 'POST',
//       headers: {
//         'Content-Type': "application/json;charset=UTF-8"
//       },
// 			body:JSON.stringify(params)
// 		});
// }
