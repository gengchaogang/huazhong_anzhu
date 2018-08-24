import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function findGroup(params){
  return baseApi('/miss-anzhu-operation/labels/findGroup',params);
}
export async function findAllFetch(params){
  return baseApi('/miss-anzhu-operation/feedbacks/findAll',params);
}
export async function findOne(params){
  return baseApi('/miss-anzhu-operation/feedbacks/findOne',params);
}
export async function deal(params){
  return baseApi('/miss-anzhu-operation/feedbacks/deal',params);
}
