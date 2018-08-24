import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function findAccountFetch(params){
  return baseApi('/miss-anzhu-account/tradingCenter/findAccount',params);
}
export async function findTCOrOIncomeBudgetFetch(params){
  return baseApi('/miss-anzhu-account/statistics/findTCOrOIncomeBudget',params);
}
export async function findGroup(params){
  return baseApi('/miss-anzhu-operation/labels/findGroup',params);
}
export async function findAllCities(params){
  return baseApi('/miss-anzhu-operation/service-regions/findAllCities',params);
}
export async function findTcOrOExpenseFetch(params){
  return baseApi('/miss-anzhu-account/statistics/findTcOrOExpense',params);
}
// export async function brokerFindBankCard(params){
//   return baseApi('/miss-anzhu-account/brokerFindBankCard',params);
// }
export async function tcChangeCard(params){
  return baseApi('/miss-anzhu-account/tcChangeCard',params);
}
