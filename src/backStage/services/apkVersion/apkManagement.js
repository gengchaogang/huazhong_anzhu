import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function findAll(params){
  return baseApi('/miss-anzhu-operation/apkVersion/findAll',params);
}
export async function addFetch(params){
  return baseApi('/miss-anzhu-operation/apkVersion/add',params);
}
