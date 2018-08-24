import request from '../../../commons/utils/request';
import baseApi from '../../../commons/service/baseApi';
import qs from 'qs';

// export async function query(params) {
//   return request(`/api/users?${qs.stringify(params)}`);
// }
//
// export async function create(params) {
//   return request('/api/users', {
//     method: 'post',
//     body: qs.stringify(params),
//   });
// }
export async function creatChildNodeBM(params){
  return request('/miss-anzhu-operation/departments/add', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:qs.stringify(params)
  });
}
export async function editBM(params){
  return request('/miss-anzhu-operation/departments/edit', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:qs.stringify(params)
  });
}

function log(res){
  const {data, err} = res;
  if(err){
    console.error(err);
  }else {
    console.log(data);
  }
  return res;
}

export async function getRoot(){
  return baseApi("/miss-anzhu-trading-center/departments/getMyCenterRoot").then(log);
}

export async function getSubDeptsAndUsers(params){
  return delay(baseApi("/miss-anzhu-trading-center/departments/findSubDeptsAndUsers",params)).then(log);
}

export async function getDeptUsers(params){
  params.departmentId = params.id;
  // params.isUnder = true;
  return delay(baseApi("/miss-anzhu-trading-center/employees/findByDept",params)).then(log);
}

export async function saveDept(params){
  let apiName;
  if(params.id){
    apiName = "/miss-anzhu-trading-center/departments/edit";
  }else{
    apiName = "/miss-anzhu-trading-center/departments/add";
  }
  return delay(baseApi(apiName,params)).then(log);
}

export async function updateDept(params){
  return delay(baseApi("/miss-anzhu-trading-center/departments/edit",params)).then(log);
}

export async function deleteDept(params){
  return delay(baseApi("/miss-anzhu-trading-center/departments/delete",params)).then(log);
}

export async function getUserInfo(params){
  return delay(baseApi("/miss-anzhu-trading-center/employees/findOne",params)).then(log);
}

export async function saveUser(params){
  let apiName;
  if(params.id){
    apiName = "/miss-anzhu-trading-center/employees/edit";
  }else{
    apiName = "/miss-anzhu-trading-center/employees/add";
  }
  return delay(baseApi(apiName,params)).then(log);
}

export async function deleteUser(params){
  return delay(baseApi("/miss-anzhu-trading-center/employees/delete",params)).then(log);
}

export async function deleteUsers(params){
  return delay(baseApi("/miss-anzhu-trading-center/employees/deleteByIds",params)).then(log);
}

export async function getAllGroups(){
  return delay(baseApi("/miss-anzhu-trading-center/group/findAll")).then(log);
}

export async function resetUserOptPassword(params){
  return delay(baseApi("/miss-anzhu-trading-center/employees/resetOptPassword",params)).then(log);
}

export async function resetUserPassword(params){
  return delay(baseApi("/miss-anzhu-trading-center/employees/resetPassword",params)).then(log);
}

export async function activeUser(params){
  return baseApi("/miss-anzhu-trading-center/employees/activeUser",params);
}
export async function getAllDepartmentsFetch(params){
  return baseApi("/miss-anzhu-trading-center/departments/findAll",params);
}
export async function changeAgentToDepartFetch(params){
  return baseApi("/miss-anzhu-trading-center/employees/assign",params);
}

function delay(p, s=1){
	return Promise.all([p, new Promise(r=>setTimeout(()=>r(),s))]).then(rs=>rs[0]);
}
const delayThen = r=>new Promise(d=>setTimeout(()=>d(r),1000));
