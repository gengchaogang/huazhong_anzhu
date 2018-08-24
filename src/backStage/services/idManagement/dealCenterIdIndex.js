import request from '../../../commons/utils/request';
import baseApi from '../baseApi';
// import qs from 'qs';

function delay(p, s=3000){
	return Promise.all([p, new Promise(r=>setTimeout(()=>r(),s))]).then(rs=>rs[0]);
}
const delayThen = r=>new Promise(d=>setTimeout(()=>d(r),1000));

export async function add(params){
	return baseApi('/miss-anzhu-trading-center/trading-centers/add',params);
}

export async function edit(params){
	return baseApi('/miss-anzhu-trading-center/trading-centers/edit',params);
}

export async function remove(params){
	return baseApi('/miss-anzhu-trading-center/trading-centers/delete',params);
}

export async function detail(params){
	return baseApi('/miss-anzhu-trading-center/trading-centers/findOne',params);
	// return delay(baseApi('/miss-anzhu-trading-center/trading-centers/findOne',params));
}

export async function close(params){
	return baseApi('/miss-anzhu-trading-center/trading-centers/close',params);
}

export async function reopen(params){
	return baseApi('/miss-anzhu-trading-center/trading-centers/reopen',params);
}

export async function resetPassword(params){
	return baseApi('/miss-anzhu-trading-center/employees/resetPassword',params);
}

export async function resetTcPassword(params){
	return baseApi('/miss-anzhu-trading-center/trading-centers/resetPassword',params);
}

export async function query(params){
  return baseApi('/miss-anzhu-trading-center/trading-centers/findAll',params, true);
}
