import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function findAllFetch(params){
  return baseApi('/miss-anzhu-operator/departments/getMyCenterRoot',params);
}
export async function findSubDeptsAndUsers(params){
  return baseApi('/miss-anzhu-operator/departments/findSubDeptsAndUsers',params);
}
export async function editBM(params){
  return baseApi('/miss-anzhu-operator/departments/edit',params);
}
export async function deleteBMfetch(params){
  return baseApi('/miss-anzhu-operator/departments/delete',params);
}
export async function addBMfetch(params){
  return baseApi('/miss-anzhu-operator/departments/add',params);
}
export async function deleteMemberfetch(params){
  return baseApi('/miss-anzhu-operator/employees/delete',params);
}
export async function findOne(params){
  return baseApi('/miss-anzhu-operator/employees/findOne',params);
}
export async function findDeptIdAndName(params){
  return baseApi('/miss-anzhu-operator/departments/findDeptIdAndName',params);
}
export async function findRoleIdAndName(params){
  return baseApi('/miss-anzhu-operator/role/findRoleIdAndName',params);
}
export async function addMemberFetch(params){
  return baseApi('/miss-anzhu-operator/employees/add',params);
}
export async function adjustDepartment(params){
  return baseApi('/miss-anzhu-operator/employees/adjustDepartment',params);
}
