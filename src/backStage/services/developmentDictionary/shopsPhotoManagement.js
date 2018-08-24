import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function initialization(params){
  return baseApi('/miss-anzhu-community/communities/getShopPictures',params);
}
export async function getShopUrls(params){
	return baseApi('/miss-anzhu-community/communities/getShopUrls',params);
}
