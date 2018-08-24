import request from '../../../commons/utils/request';
import baseApi,{delayThen} from '../../../commons/service/baseApi';

export async function findOperator(params){
  return baseApi('/miss-anzhu-operator/operators/findOperator',params);
}
export async function deleteOperator(params){
  return baseApi('/miss-anzhu-operator/operators/delete',params);
}
export async function resetPasswordFetch(params){
	return baseApi('/miss-anzhu-operator/operators/resetPassword',params);
}
