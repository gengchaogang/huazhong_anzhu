import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';
export async function findAccountFetch(params){
  return baseApi('/miss-anzhu-account/broker/findAccount',params);
}
export async function findBrokerWalletBudgetFetch(params){
  return baseApi('/miss-anzhu-account/statistics/findBrokerWalletBudget',params);
}
export async function findBrokerCommissionBudgetFetch(params){
  return baseApi('/miss-anzhu-account/statistics/findBrokerCommissionBudget',params);
}
