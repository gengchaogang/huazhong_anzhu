import request from '../../../commons/utils/request';
import baseApi from '../baseApi';
// import qs from 'qs';

export async function initialization(params){
	return baseApi('/miss-anzhu-community/buildings/findCommunityBuildings',params);
}
export async function deleteLoudong(params){
	return baseApi('/miss-anzhu-community/buildings/deleteCommunityBuilding',params);
}
export async function addLoudong(params){
	return baseApi('/miss-anzhu-community/buildings/addCommunityBuilding',params);
}
export async function editClickData(params){
	return baseApi('/miss-anzhu-community/buildings/findCommunityBuilding',params);
}
export async function editLoudong(params){
	return baseApi('/miss-anzhu-community/buildings/editCommunityBuilding',params);
}
export async function findGroup(params){
	return baseApi('/miss-anzhu-operation/labels/findGroup',params);
}
