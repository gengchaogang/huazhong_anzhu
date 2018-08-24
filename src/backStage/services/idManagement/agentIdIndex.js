import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi,{delayThen} from '../../../commons/service/baseApi';

export async function findAllAreasOpen(params){
  return baseApi('/miss-anzhu-operation/service-regions/findAllAreasOpen',params);
}
export async function findByCondition(params){
	return baseApi('/miss-anzhu-operator/operators/findByCondition',params);
}
export async function deleteOperators(params){
	return baseApi('/miss-anzhu-operator/operators/delete',params);
}
export async function resetPassword(params){
	return baseApi('/miss-anzhu-operator/operators/resetPassword',params);
}
