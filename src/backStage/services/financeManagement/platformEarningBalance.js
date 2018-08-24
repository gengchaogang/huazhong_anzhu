import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi,{delayThen} from '../../../commons/service/baseApi';

export async function findAllAreasOpen(params){
  return baseApi('/miss-anzhu-operation/service-regions/findAllAreasOpen',params);
}
export async function platformAccountStatistics(params){
  return baseApi('/miss-anzhu-account/statistics/platformAccountStatistics',params);
}
export async function platformAccountIncomeList(params){
  return baseApi('/miss-anzhu-account/statistics/platformAccountIncomeList',params);
}
export async function platformAccountExpenseList(params){
  return baseApi('/miss-anzhu-account/statistics/platformAccountExpenseList',params);
}
