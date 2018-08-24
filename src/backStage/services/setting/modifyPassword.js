import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function editPassword(params){
  return baseApi('/miss-anzhu-operator/employees/editPassword',params);
}
