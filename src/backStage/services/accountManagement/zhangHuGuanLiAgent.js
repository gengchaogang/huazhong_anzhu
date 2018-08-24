import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function findAllAreasOpenFetch(params){
  return baseApi('/miss-anzhu-operation/service-regions/findAllAreasOpen',params);
}
export async function findAccountsOperatorFetch(params){
  return baseApi('/miss-anzhu-account/operator/findAccounts',params);
}
