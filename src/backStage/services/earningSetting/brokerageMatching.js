import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function findAllCommission(params){
  return baseApi('/miss-anzhu-operation/allocationPlans/commissions/findAll',params);
}
export async function deleteBrokerage(params){
  return baseApi('/miss-anzhu-operation/allocationPlans/commissions/delete',params);
}
export async function addProgrammeFetch(params){
  return baseApi('/miss-anzhu-operation/allocationPlans/commissions/add',params);
}
export async function editProgrammeFetch(params){
  return baseApi('/miss-anzhu-operation/allocationPlans/commissions/edit',params);
}
export async function findOneFetch(params){
  return baseApi('/miss-anzhu-operation/allocationPlans/commissions/findOne',params);
}
