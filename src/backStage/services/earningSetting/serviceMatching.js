import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function findAllService(params){
  return baseApi('/miss-anzhu-operation/allocationPlans/tradingServiceCharges/findAll',params);
}
export async function addService(params){
  return baseApi('/miss-anzhu-operation/allocationPlans/tradingServiceCharges/add',params);
}
export async function findOneService(params){
  return baseApi('/miss-anzhu-operation/allocationPlans/tradingServiceCharges/findOne',params);
}
export async function editService(params){
  return baseApi('/miss-anzhu-operation/allocationPlans/tradingServiceCharges/edit',params);
}
export async function deleteService(params){
  return baseApi('/miss-anzhu-operation/allocationPlans/tradingServiceCharges/delete',params);
}
