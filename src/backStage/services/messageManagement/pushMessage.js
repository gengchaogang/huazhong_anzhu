import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function getManualPush(params){
  return baseApi('/miss-anzhu-message/manualPush/getManualPush',params);
}
export async function findAllAreasOpen(params){
  return baseApi('/miss-anzhu-operation/service-regions/findAllAreasOpen',params);
}
export async function addPush(params){
  return baseApi('/miss-anzhu-message/manualPush/addPush',params);
}
export async function deleteManualPush(params){
  return baseApi('/miss-anzhu-message/manualPush/deleteManualPush',params);
}
