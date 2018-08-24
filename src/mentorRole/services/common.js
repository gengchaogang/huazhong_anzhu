import request from '../../commons/utils/request';
import {setCookie} from '../../commons/utils/currencyFunction';
// 异步请求模板 改function名字和路由就可以了
export async function requestApi(params,isPage){
    let p;
    if(isPage){
      p = {
        pageNo:0,
        pageSize:10,
        ...params
      };
    }else {
      p = params;
    }
    return request(p.apiName,{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(p)
		});
}
export async function editTeam(params){
    return request('/miss-security-server/users/editUserUserType',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
