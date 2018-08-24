import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function findAllAreasOpen(params){
  return baseApi('/miss-anzhu-operation/service-regions/findAllAreas',params);
}
export async function findAllOcations(params){
  return baseApi('/miss-anzhu-operation/allocations/findAll',params);
}
export async function findOneOcations(params){
  return baseApi('/miss-anzhu-operation/allocations/findOne',params);
}
export async function deleteOcationsFetch(params){
  return baseApi('/miss-anzhu-operation/allocations/delete',params);
}
export async function editAllOcations(params){
  return baseApi('/miss-anzhu-operation/allocations/edit',params);
}
// export async function tradingCenterFindAll(params){
//   return baseApi('/miss-anzhu-trading-center/trading-centers/findAll',params);
// }
export async function findAllByAreaCode(params){
  return baseApi('/miss-anzhu-trading-center/trading-centers/findAllByAreaCode',params);
}
export async function findAlltradingServiceChargesFectch(params){
  return baseApi('/miss-anzhu-operation/allocationPlans/tradingServiceCharges/findAll',params);
}
export async function findAllallocationPlans(params){
  return baseApi('/miss-anzhu-operation/allocationPlans/commissions/findAll',params);
}
