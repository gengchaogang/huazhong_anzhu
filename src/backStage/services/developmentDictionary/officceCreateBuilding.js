import request from '../../../commons/utils/request';
import baseApi from '../baseApi';

export async function findAllProvinces(params){
  return baseApi('/miss-anzhu-operation/service-regions/findAllProvinces',params);
}
export async function addOfficeBuilding(params){
  return baseApi('/miss-anzhu-community/communities/addOfficeBuilding',params);
}
export async function editOfficeBuilding(params){
  return baseApi('/miss-anzhu-community/communities/editOfficeBuilding',params);
}
export async function findOfficeBuilding(params){
  return baseApi('/miss-anzhu-community/communities/findOfficeBuilding',params);
}
export async function findGroup(params){
	return baseApi('/miss-anzhu-operation/labels/findGroup',params);
}
