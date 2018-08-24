import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function findBrokerCommunities(params){
  return baseApi('/miss-anzhu-community/communities/findBrokerCommunities',params);
}
export async function changStatus(params){
  return baseApi('/miss-anzhu-community/communities/changStatus',params);
}
export async function deleteCommuintyFetch(params){
  return baseApi('/miss-anzhu-community/communities/deleteCommuinty',params);
}
export async function deleteShopFetch(params){
  return baseApi('/miss-anzhu-community/communities/deleteShop',params);
}
export async function deleteOfficeBuildingFetch(params){
  return baseApi('/miss-anzhu-community/communities/deleteOfficeBuilding',params);
}
export async function findByCommunityAreaName(params){
  return baseApi('/miss-anzhu-community/communities/findByCommunityAreaName',params);
}
export async function findByShopAreaName(params){
  return baseApi('/miss-anzhu-community/communities/findByShopAreaName',params);
}
export async function findByOffieceBuildingAreaName(params){
  return baseApi('/miss-anzhu-community/communities/findByOffieceBuildingAreaName',params);
}
export async function combineCommunity(params){
  return baseApi('/miss-anzhu-community/communities/combineCommunity',params);
}
export async function combineShopFetch(params){
  return baseApi('/miss-anzhu-community/communities/combineShop',params);
}
export async function combineOfficeBuildingFetch(params){
  return baseApi('/miss-anzhu-community/communities/combineOfficeBuilding',params);
}
