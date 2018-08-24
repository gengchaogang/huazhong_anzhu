import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function findAccountFetch(params){
  return baseApi('/miss-anzhu-account/operator/findAccount',params);
}
export async function findTCOrOIncomeBudgetFetch(params){
  return baseApi('/miss-anzhu-account/statistics/findTCOrOIncomeBudget',params);
}
export async function findTcOrOExpenseFetch(params){
  return baseApi('/miss-anzhu-account/statistics/findTcOrOExpense',params);
}
