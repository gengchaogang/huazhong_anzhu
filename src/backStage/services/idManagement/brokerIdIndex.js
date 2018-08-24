import request from '../../../commons/utils/request';
import baseApi from '../baseApi';
// import qs from 'qs';

function delay(p, s=3000){
	return Promise.all([p, new Promise(r=>setTimeout(()=>r(),s))]).then(rs=>rs[0]);
}

// const tableData=[];
// for(let i=0; i<66; i++){
// 	tableData.push({
// 		key:i+1,
// 		id:i+1,
// 		loginName:12548963157,
// 		name:'哥只是个传说',
// 		district:'北京市-海淀区',
// 		nameCertificate:i>3?true:(false),
// 		careerCertificate:i>3?true:(false),
// 		warningTimes:i*2,
// 		rigisterDate:'2016-12-12 12:22:12',
// 		lastLoginTime:'2016-12-12 12:22:12',
// 		state:i>3?'正常':'冻结',
// 	})
// }
// export async function query1(params){
//   return {
//     tableData:tableData,
//   }
// }

export async function add(params){
	return baseApi('/miss-anzhu-broker/brokers/add',params);
}

export async function edit(params){
	return baseApi('/miss-anzhu-broker/brokers/edit',params);
}

export async function remove(params){
	return baseApi('/miss-anzhu-broker/brokers/delete',params);
}

export async function detail(params){
	return baseApi('/miss-anzhu-broker/brokers/findOne',params);
	// return delay(baseApi('/miss-anzhu-broker/brokers/findOne',params));
}

export async function tryFreeze(params){
	return baseApi('/miss-anzhu-broker/brokers/blocking',params);
}

export async function tryUnFreeze(params){
	return baseApi('/miss-anzhu-broker/brokers/unBlocking',params);
}

export async function resetPassword(params){
	return baseApi('/miss-security-server/users/resetPassword',params);
}

export async function query(params){
	// params.pageNo = params.pageNo || 0;
	// params.pageSize = params.pageSize || 3;
  return baseApi('/miss-anzhu-broker/brokers/findAll',params);
}
