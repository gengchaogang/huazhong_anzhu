import request from '../../commons/utils/request';
import qs from 'qs';
export async function getAuditorList(params){
  return request('/miss-security-server/users/findUsersByAuthority', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
