import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';
export async function findBrokerCommissionDetailFetch(params){
  return baseApi('/miss-anzhu-account/statistics/findBrokerCommissionDetail',params);
}
export async function findBrokerOrTutorWalletIncomeFetch(params){
  return baseApi('/miss-anzhu-account/statistics/findBrokerOrTutorWalletIncome',params);
}
export async function fingBrokerOrTutorWalletExpenseFetch(params){
  return baseApi('/miss-anzhu-account/statistics/fingBrokerOrTutorWalletExpense',params);
}
