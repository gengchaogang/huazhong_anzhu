import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function findAllTreeFetch(params){
  return baseApi('/miss-anzhu-training/article-type/findAll',params);
}
export async function findTableArticle(params){
  return baseApi('/miss-anzhu-training/article/findAll',params);
}
export async function articleTypeAdd(params){
  return baseApi('/miss-anzhu-training/article-type/add',params);
}
export async function articleTypedelete(params){
  return baseApi('/miss-anzhu-training/article-type/delete',params);
}
export async function findAllarticle(params){
  return baseApi('/miss-anzhu-training/article/findAll',params);
}
export async function deleteArticle(params){
  return baseApi('/miss-anzhu-training/article/delete',params);
}
export async function editArticleType(params){
  return baseApi('/miss-anzhu-training/article-type/edit',params);
}
export async function watchTableOne(params){
  return baseApi('/miss-anzhu-training/article/findOne',params);
}
export async function sendArticle(params){
  return baseApi('/miss-anzhu-training/article/send',params);
}
export async function downArticle(params){
  return baseApi('/miss-anzhu-training/article/downArticle',params);
}
export async function addArticle(params){
  return baseApi('/miss-anzhu-training/article/add',params);
}
export async function editArticle(params){
  return baseApi('/miss-anzhu-training/article/edit',params);
}
export async function findAllAreasOpen(params){
  return baseApi('/miss-anzhu-operation/service-regions/findAllAreasOpen',params);
}
export async function stick(params){
  return baseApi('/miss-anzhu-training/article/stick',params);
}
export async function abrogate(params){
  return baseApi('/miss-anzhu-training/article/abrogate',params);
}
