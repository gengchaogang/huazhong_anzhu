import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi,{delayThen} from '../../../commons/service/baseApi';

export async function findAllAreasOpen(params){
  return baseApi('/miss-anzhu-operation/service-regions/findAllAreasOpen',params);
}
export async function platformDetails(params){
  return baseApi('/miss-anzhu-account/statistics/platformDetails',params);
}
export async function platformIncomeList(params){
  return baseApi('/miss-anzhu-account/statistics/platformIncomeList',params);
}
export async function platformExpenseList(params){
  return baseApi('/miss-anzhu-account/statistics/platformExpenseList',params);
}
