import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi,{delayThen} from '../../../commons/service/baseApi';

export async function closePlatformAccountDetails(params){
  return baseApi('/miss-anzhu-account/closePlatformAccountDetails',params);
}
export async function platformCloseAccout(params){
  return baseApi('/miss-anzhu-account/payment/platformCloseAccout',params);
}
