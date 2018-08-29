import request from '../../../commons/utils/request';
import qs from 'qs';
//检查登录
export async function prepareLogin(params) {
	return request(`/login`,{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'get',
	});
}
//执行登录
export async function realLogin(params) {
	return request(`/login`,{
		headers:{
			'content-type':'application/x-www-form-urlencoded;charset=utf8'
		},
		method:'POST',
		body:qs.stringify(params),
	});
}
//再次执行登录
export async function finishLogin(params) {
	return request(`${params}`,{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'get',
	});
}
// //再次执行登录
// export async function realLogin(params) {
// 	return request(`/login`,{
// 		headers:{
// 			'content-type':'application/x-www-form-urlencoded;charset=utf8'
// 		},
// 		redirect: 'manual',
// 		method:'POST',
// 		body:qs.stringify(params),
// 	});
// }
//完成登录
export async function completeLogin(params) {
	return request(`/login?${qs.stringify(params)}`,{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'get',
	});
}
// //检查登录
// export async function prepareLogin(params) {
// 	return request(`/login?t=${Math.random()*100}`,{
// 		headers:{
// 			'content-type':'application/json;charset=UTF-8'
// 		},
// 		method:'get',
// 	}, false);
// }
// //执行登录
// export async function realLogin(params) {
// 	return request(`/realLoginProcess?t=${Math.random()*100}`,{
// 		headers:{
// 			'content-type':'application/json;charset=UTF-8'
// 		},
// 		method:'POST',
// 		body:JSON.stringify(params)
// 	});
// }
// //完成登录
// export async function completeLogin(params) {
// 	return request(`/login?${qs.stringify(params)}`,{
// 		headers:{
// 			'content-type':'application/json;charset=UTF-8'
// 		},
// 		method:'get',
// 	});
// }
//测试
export async function testApi(params) {
	return request('/miss-authorization-resource/admin',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'post',
		body:JSON.stringify(params)
	});
}
export async function judgeLoginUserInfoFetch(params) {
	return request('/miss-anzhu-tutor/tutors/broker/getTutorIdAndBrokerIdByCurrUser',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'post',
		body:JSON.stringify(params)
	});
}
