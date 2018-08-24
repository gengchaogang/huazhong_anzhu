import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function findAudit(params){
  return baseApi('/miss-anzhu-tutor/tutors/findAudit',params);
}
export async function audit(params){
  return baseApi('/miss-anzhu-tutor/tutors/audit',params);
}
export async function findGroup(params){
  return baseApi('/miss-anzhu-operation/labels/findGroup',params);
}
