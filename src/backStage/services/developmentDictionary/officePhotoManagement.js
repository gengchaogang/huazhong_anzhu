import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function initialization(params){
  return baseApi('/miss-anzhu-community/communities/getOfficeBuildingPictures',params);
}
export async function getOfficeBuildingUrls(params){
  return baseApi('/miss-anzhu-community/communities/getOfficeBuildingUrls',params);
}
