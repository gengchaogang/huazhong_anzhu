import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function initialization(params){
  return baseApi('/miss-anzhu-community/communities/getCommunityPictures',params);
}
export async function getCommunityUrls(params){
	return baseApi('/miss-anzhu-community/communities/getCommunityUrls',params);
}
