import request from '../../../../commons/utils/request';
import qs from 'qs';

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
