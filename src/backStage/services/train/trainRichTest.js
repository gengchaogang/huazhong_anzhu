import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function findAllAreasOpen(params){
  return baseApi('/miss-anzhu-operation/service-regions/findAllAreasOpen',params);
}
export async function addArticle(params){
  return baseApi('/miss-anzhu-training/article/add',params);
}
export async function watchTableOne(params){
  return baseApi('/miss-anzhu-training/article/findOne',params);
}
export async function editArticle(params){
  return baseApi('/miss-anzhu-training/article/edit',params);
}
