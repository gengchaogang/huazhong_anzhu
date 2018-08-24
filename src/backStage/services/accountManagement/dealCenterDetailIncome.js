import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi from '../baseApi';

export async function findTCOrOIncomeDetailFetch(params){
  return baseApi('/miss-anzhu-account/statistics/findTCOrOIncomeDetail',params);
}
