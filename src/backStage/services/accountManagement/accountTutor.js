import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function findAccountsFetch(params){
  return baseApi('/miss-anzhu-account/tutor/findAccounts',params);
}
