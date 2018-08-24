import request from '../../../commons/utils/request';
import baseApi from '../baseApi';
// import qs from 'qs';
const options = [{
  value: '北京',
  label: '北京',
  children: [{
    value: '东城区',
    label: '东城区',
  }],
	}, {
  value: '江苏',
  label: '江苏',
  children: [{
    value: '南京',
    label: '南京',
  }],
}];
const tableData=[];
for(let i=0; i<66; i++){
	tableData.push({
		key:i+1,
		number:i+1,
		accountNumber:12548963157,
		companyName:'链家地产',
    area:'北京市-海淀区',
    registrationTime:'2016-12-12 12:22:12',
    lastTimeLogin:'2016-12-12 12:22:12',
		status:i>3?'正常':'冻结',
	})
}
// export async function query(params){
//   return {
//     tableData:tableData,
// 		options:options,
//   }
// }

// export async function add(params){
// 	return baseApi('/miss-anzhu-tutor/tutors/add',params);
// }
//
// export async function edit(params){
// 	return baseApi('/miss-anzhu-tutor/tutors/edit',params);
// }
//
// export async function remove(params){
// 	return baseApi('/miss-anzhu-tutor/tutors/delete',params);
// }

export async function detail(params){
	return baseApi('/miss-anzhu-tutor/tutors/findTutor',params);
	// return delay(baseApi('/miss-anzhu-tutor/tutors/findOne',params));
}

export async function tryFreeze(params){
	return baseApi('/miss-anzhu-tutor/tutors/blockedTutor',params);
}

export async function tryUnFreeze(params){
	return baseApi('/miss-anzhu-tutor/tutors/unfreeze',params);
}

// export async function resetPassword(params){
// 	return baseApi('/miss-security-server/users/resetPassword',params);
// }

export async function findAll(params){
  return baseApi('/miss-anzhu-tutor/tutors/findAllTutors',params);
  // return delay(baseApi('/miss-anzhu-tutor/tutors/findAllTutors',params))
}

function delay(p, s=1000){
	return Promise.all([p, new Promise(r=>setTimeout(()=>r(),s))]).then(rs=>rs[0]);
}
