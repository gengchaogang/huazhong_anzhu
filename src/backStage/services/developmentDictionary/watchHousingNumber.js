import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function findAll(params){
  return baseApi('/miss-anzhu-community/rooms/findAll',params);
}
export async function addRooms(params){
  return baseApi('/miss-anzhu-community/rooms/addRooms',params);
}
export async function editRooms(params){
  return baseApi('/miss-anzhu-community/rooms/editRooms',params);
}
