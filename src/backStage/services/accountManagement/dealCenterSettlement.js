import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';
export async function closeTCAccountDetails(params){
  return baseApi('/miss-anzhu-account/closeTCAccountDetails',params);
}
export async function closeAccount(params){
  return baseApi('/miss-anzhu-account/payment/CloseAccount',params);
}
