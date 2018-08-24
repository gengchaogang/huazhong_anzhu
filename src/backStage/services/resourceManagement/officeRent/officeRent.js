import baseApi from '../../baseApi';
import request from '../../../../commons/utils/request';
import qs from 'qs';
export async function findAllAreasOpen(params){
  return baseApi('/miss-anzhu-operation/service-regions/findAllAreasOpen',params);
}
export async function findFilterAndOrderHouse(params){
  return baseApi('/miss-anzhu-secdhouse-resource/main/findFilterAndOrderHouse',params);
}
export async function houseOffLine(params){
  return baseApi('/miss-anzhu-secdhouse-resource/main/houseOffLine',params);
}
