import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function findAllAudit(params){
  return baseApi('/miss-anzhu-tutor/tutors/findAllAudit',params);
}
export async function findAllAreasOpen(params){
  return baseApi('/miss-anzhu-operation/service-regions/findAllAreasOpen',params);
}
