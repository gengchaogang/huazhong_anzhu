import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function initialization(params){
	return baseApi('/miss-anzhu-community/buildings/findOfficeBuildingBuildings',params);
}
export async function deleteOfficeBuildingBuilding(params){
	return baseApi('/miss-anzhu-community/buildings/deleteOfficeBuildingBuilding',params);
}
export async function addOfficeBuildingBuilding(params){
	return baseApi('/miss-anzhu-community/buildings/addOfficeBuildingBuilding',params);
}
export async function findOfficeBuildingBuilding(params){
	return baseApi('/miss-anzhu-community/buildings/findOfficeBuildingBuilding',params);
}
export async function editOfficeBuildingBuilding(params){
	return baseApi('/miss-anzhu-community/buildings/editOfficeBuildingBuilding',params);
}
export async function findGroup(params){
	return baseApi('/miss-anzhu-operation/labels/findGroup',params);
}
