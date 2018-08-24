import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi,{delayThen} from '../../../commons/service/baseApi';

export async function findAllCitiesFetch(params){
  return baseApi('/miss-anzhu-operation/service-regions/findAllCities',params);
}
export async function findOneFetch(params){
  return baseApi('/miss-anzhu-operator/operators/findOne',params);
}
export async function findGroup(params){
  return baseApi('/miss-anzhu-operation/labels/findGroup',params);
}
export async function edit(params){
  return baseApi('/miss-anzhu-operator/operators/edit',params);
}
export async function getRole(params){
  return baseApi('/miss-anzhu-operator/operators/getRole',params);
}
export async function getRegions(params){
  return baseApi('/miss-anzhu-operator/operators/getRegions',params);
}
export async function add(params){
  return baseApi('/miss-anzhu-operator/operators/add',params);
}
