import request from '../../commons/utils/request';
export async function getLoginInfo() {
	return request('/miss-anzhu-operator/operators/findUserOperatorInfo1',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'POST',
	});
}
