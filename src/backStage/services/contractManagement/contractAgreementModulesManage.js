import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function findAllContract(params){
  return baseApi('miss-anzhu-contract-agreement/contract/findAll',params);
}
export async function findAllAreas(params){
  return baseApi('/miss-anzhu-operation/service-regions/findAllAreas',params);
}
export async function deleteContractFetch(params){
  return baseApi('miss-anzhu-contract-agreement/contract/delete',params);
}
export async function addContract(params){
  return baseApi('miss-anzhu-contract-agreement/contract/add',params);
}
export async function findGroup(params){
  return baseApi('/miss-anzhu-operation/labels/findGroup',params);
}
export async function isHasFetch(params){
  return baseApi('miss-anzhu-contract-agreement/contract/isHas',params);
}
export async function editContract(params){
  return baseApi('miss-anzhu-contract-agreement/contract/edit',params);
}
