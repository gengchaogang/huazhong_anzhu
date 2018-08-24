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
	return request('/miss-anzhu-trading-center/trading-centers/findUserTradingCenterInfo',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'POST',
	});
}
//获取站内信消息
export async function findMyRemindMsgFetch(params) {
	return request('/miss-anzhu-message/findMyRemindMsg',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'POST',
		body:JSON.stringify({
			pageNo:0,
			pageSize:1,
			...params
		})
	});
}
//获取未读消息数目
export async function getMyNoreadCountFetch(params) {
	return request('/miss-anzhu-message/getMyNoreadCount',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'POST',
	});
}
