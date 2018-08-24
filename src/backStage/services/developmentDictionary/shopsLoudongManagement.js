import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function initialization(params){
	return baseApi('/miss-anzhu-community/buildings/findShopBuildings',params);
}
export async function deleteShopBuilding(params){
	return baseApi('/miss-anzhu-community/buildings/deleteShopBuilding',params);
}
export async function addShopBuilding(params){
	return baseApi('/miss-anzhu-community/buildings/addShopBuilding',params);
}
export async function findShopBuilding(params){
	return baseApi('/miss-anzhu-community/buildings/findShopBuilding',params);
}
export async function editShopBuilding(params){
	return baseApi('/miss-anzhu-community/buildings/editShopBuilding',params);
}
export async function findGroup(params){
	return baseApi('/miss-anzhu-operation/labels/findGroup',params);
}
