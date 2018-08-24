import request from '../../../commons/utils/request';
import baseApi from '../baseApi';

export async function findAllProvinces(params){
  return baseApi('/miss-anzhu-operation/service-regions/findAllProvinces',params);
}
export async function addShop(params){
  return baseApi('/miss-anzhu-community/communities/addShop',params);
}
export async function findShop(params){
  return baseApi('/miss-anzhu-community/communities/findShop',params);
}
export async function editShop(params){
  return baseApi('/miss-anzhu-community/communities/editShop',params);
}
export async function findGroup(params){
	return baseApi('/miss-anzhu-operation/labels/findGroup',params);
}
