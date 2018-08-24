import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function findWithdrawList(params){
  return baseApi('/miss-anzhu-account/payment/findWithdrawList',params);
}
export async function findAllAreasOpenFetch(params){
  return baseApi('/miss-anzhu-operation/service-regions/findAllAreasOpen',params);
}
export async function findWithdrawDetail(params){
  return baseApi('/miss-anzhu-account/payment/findWithdrawDetail',params);
}
export async function dealWithWithdraw(params){
  return baseApi('/miss-anzhu-account/payment/dealWithWithdraw',params);
}
