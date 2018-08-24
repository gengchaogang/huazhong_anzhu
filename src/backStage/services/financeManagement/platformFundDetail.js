import request from '../../../commons/utils/request';
// import qs from 'qs';
import baseApi,{delayThen} from '../../../commons/service/baseApi';

export async function platformIncomeDetail(params){
  return baseApi('/miss-anzhu-account/statistics/platformIncomeDetail',params);
}
