import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';
export async function findAllProvincesFtech(params){
  return baseApi('/miss-anzhu-operation/service-regions/findAllProvinces',params);
}
export async function createXiaoQuServicesFtech(params){
	return baseApi('/miss-anzhu-community/communities/addCommunity',params);
}
export async function findCommunityFtech(params){
	return baseApi('/miss-anzhu-community/communities/findCommunity',params);
}
export async function editCommunityFtech(params){
	return baseApi('/miss-anzhu-community/communities/editCommunity',params);
}
export async function labelsfindAllFtech(params){
	return baseApi('/miss-anzhu-operation/labels/findGroup',params);
}
