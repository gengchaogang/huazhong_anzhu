import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function findAccountFetch(params){
  return baseApi('/miss-anzhu-account/tutor/findAccount',params);
}
export async function findTutorWalletBudgetFetch(params){
  return baseApi('/miss-anzhu-account/statistics/operatorFindTutorWalletBudget',params);
}
export async function findTutorCommissionBudgetFetch(params){
  return baseApi('/miss-anzhu-account/statistics/operatorFindTutorCommissionBudget',params);
}
