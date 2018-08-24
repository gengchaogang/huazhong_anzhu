import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function initialization(params){
	return baseApi('/miss-anzhu-community/communities/findCommunities',params);
}
export async function changStatus(params){
	return baseApi('/miss-anzhu-community/communities/changStatus',params);
}
export async function deleteCommuinty(params){
	return baseApi('/miss-anzhu-community/communities/deleteCommuinty',params);
}
export async function findAllProvincesFetch(params){
	return baseApi('/miss-anzhu-operation/service-regions/findAllProvinces',params);
}
export async function shopsDelete(params){
	return baseApi('/miss-anzhu-community/communities/deleteShop',params);
}
export async function officeBuildingDelete(params){
	return baseApi('/miss-anzhu-community/communities/deleteOfficeBuilding',params);
}
