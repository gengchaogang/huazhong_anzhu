import request from '../../../commons/utils/request';
import qs from 'qs';

export async function addEmployeeFetch(params){
  return request(' /miss-anzhu-operation/employee/add', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:qs.stringify(params)
  });
}
export async function getDepartmentFetch(params){
  return request('/miss-anzhu-trading-center/group/findAll', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:qs.stringify(params)
  });
}
// export async function delete(params){
//   return request('/miss-anzhu-operation/employee/findOne', {
//     method: 'post',
//     headers:{
//       'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
//     },
//     body:qs.stringify(params)
//   });
// }
