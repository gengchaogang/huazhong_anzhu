import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function findAllAreas(params){
  return baseApi('/miss-anzhu-operation/service-regions/findAllAreas',params);
}
export async function findCommissions(params){
  return baseApi('/miss-anzhu-operation/allocationPlans/commissions/findAll',params);
}
export async function findTradingServiceCharges(params){
  return baseApi('/miss-anzhu-operation/allocationPlans/tradingServiceCharges/findAll',params);
}
export async function findAllByAreaCode(params){
  return baseApi('/miss-anzhu-trading-center/trading-centers/findAllByAreaCode',params);
}
export async function add(params){
  return baseApi('/miss-anzhu-operation/allocations/add',params);
}
export async function addCommissions(params){
  return baseApi('/miss-anzhu-operation/allocationPlans/commissions/add',params);
}
export async function addService(params){
  return baseApi('/miss-anzhu-operation/allocationPlans/tradingServiceCharges/add',params);
}
