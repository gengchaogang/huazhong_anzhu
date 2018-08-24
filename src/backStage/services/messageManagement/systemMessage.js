import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function findAllFetch(params){
  return baseApi('/miss-anzhu-message/template/findAll',params);
}
export async function findenable(params){
  return baseApi('/miss-anzhu-message/template/enable',params);
}
export async function findEdit(params){
  return baseApi('/miss-anzhu-message/template/edit',params);
}
