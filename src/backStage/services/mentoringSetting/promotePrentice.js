import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function findAllFetch(params){
  return baseApi('/miss-anzhu-operation/finishApprentceships/findAll',params);
}
export async function change(params){
  return baseApi('/miss-anzhu-operation/finishApprentceships/change',params);
}
export async function edit(params){
  return baseApi('/miss-anzhu-operation/finishApprentceships/edit',params);
}
