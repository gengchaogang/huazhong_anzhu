import request from '../../commons/utils/request';
import qs from 'qs';
export async function getAuditorList(params){
  return request('/miss-anzhu-trading-center/employees/findUsersByAuthorityName', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
// export async function findAllProvinceAndCityFetch(params){
//   return request('/miss-anzhu-operation/service-regions/findNotAddCities', {
//     method: 'post',
//     headers:{
//       'Content-Type': 'application/json;charset=UTF-8'
//     },
//   });
// }

export async function findAllProvinceAndCityFetch(params){
  return request('/miss-anzhu-operation/service-regions/findAllProvinceAndCity', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
  });
}
export async function validateCustomerInfoFetch(params){
  return request('/miss-anzhu-broker/customers/checkCustomer', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
