import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function initialization(params){
	return baseApi('/miss-anzhu-community/communities/findShops',params);
}
export async function changStatus(params){
	return baseApi('/miss-anzhu-community/communities/changStatus',params);
}
export async function deleteShop(params){
	return baseApi('/miss-anzhu-community/communities/deleteShop',params);
}
export async function findAllProvincesFetch(params){
	return baseApi('/miss-anzhu-operation/service-regions/findAllProvinces',params);
}
