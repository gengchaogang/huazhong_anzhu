import request from '../../commons/utils/request';
import qs from 'qs';
//检查登录
export async function doLogout(params) {
	return request('/logout',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'POST',
	});
}
//获取登录
export async function getLoginInfo() {
	return request('/miss-anzhu-operator/operators/findUserOperatorInfo1',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'POST',
	});
}
