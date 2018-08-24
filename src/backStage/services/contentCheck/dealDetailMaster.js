import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function showApplyDetail(params){
  return baseApi('/miss-anzhu-broker/maa/operationPlatform/showApplyDetail',params);
}
export async function operationApplyFetch(params){
  return baseApi('/miss-anzhu-broker/maa/operationPlatform/operationApply',params);
}
export async function showApplyBrokerDetail(params){
  return baseApi('/miss-anzhu-tutor/tutors/broker/showApplyDetail',params);
}
export async function operationApplyBrokerFetch(params){
  return baseApi('/miss-anzhu-tutor/tutors/broker/operationApply',params);
}
