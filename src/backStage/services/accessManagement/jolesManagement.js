import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';
export async function findAllFetch(params){
  return baseApi('/miss-anzhu-operator/role/findAll',params);
}
export async function deleteFetch(params){
  return baseApi('/miss-anzhu-operator/role/delete',params);
}
export async function searchPowerFetch(params){
  return baseApi('/miss-anzhu-operator/authority/findAll',params);
}
export async function add(params){
  return baseApi('/miss-anzhu-operator/role/add',params);
}
export async function findOne(params){
  return baseApi('/miss-anzhu-operator/role/findOne',params);
}
export async function edit(params){
  return baseApi('/miss-anzhu-operator/role/edit',params);
}
