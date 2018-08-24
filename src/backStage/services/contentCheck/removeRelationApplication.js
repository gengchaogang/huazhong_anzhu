import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function findAllAreas(params){
  return baseApi('/miss-anzhu-operation/service-regions/findAllProvinces',params);
}
export async function findTerminateApplyList(params){
  return baseApi('/miss-anzhu-broker/maa/operationPlatform/findTerminateApplyList',params);
}
export async function findTerminateDisposeList(params){
  return baseApi('/miss-anzhu-broker/maa/operationPlatform/findTerminateDisposeList',params);
}
export async function findBrokerStateApplyListFetch(params){
  return baseApi('/miss-anzhu-tutor/tutors/broker/findBrokerStateApplyList',params);
}
export async function findBrokerStateListFetch(params){
  return baseApi('/miss-anzhu-tutor/tutors/broker/findBrokerStateList',params);
}
