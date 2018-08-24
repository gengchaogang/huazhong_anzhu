import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';
export async function closeOperAccountDetails(params){
  return baseApi('/miss-anzhu-account/closeOperAccountDetails',params);
}
export async function opeartorCloseAccount(params){
  return baseApi('miss-anzhu-account/payment/opeartorCloseAccount',params);
}
