import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function findAllAreasFetch(params){
  return baseApi('/miss-anzhu-operation/service-regions/findAllProvinces',params);
}
