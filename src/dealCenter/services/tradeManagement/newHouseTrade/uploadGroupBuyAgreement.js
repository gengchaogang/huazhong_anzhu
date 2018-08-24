import request from '../../../../commons/utils/request';
import qs from 'qs';
//地址全部前面多加了版本号，不使用mock时注意删除

export async function uploadGroupBuyAgreementFetch(params){
  return request('/miss-anzhu-newhouse-tx-groupbuy/groupbuy/uploadAgreement', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
