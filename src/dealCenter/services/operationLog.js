import request from '../../commons/utils/request';
import qs from 'qs';

export async function getInitTableDataFetch(params){
  return request('/miss-anzhu-business-logger/findAll',{
    method: 'POST',
    headers: {
      'Content-Type': "application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  });
}
