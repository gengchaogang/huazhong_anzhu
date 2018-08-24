import request from '../../../../commons/utils/request';
import qs from 'qs';
//地址全部前面多加了版本号，不使用mock时注意删除

// export async function getProjectListFetch(params){
//   return request('7/miss-anzhu-newhouse-project/projects/onsell/brief', {
//     method: 'post',
//     headers:{
//       'Content-Type': 'application/json;charset=UTF-8'
//     },
//   });
// }
export async function getHouseTableListFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/houses/findAll', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
  });
}
export async function getProjectHousesIntentionSellFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/houses/intentionsell', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
export async function getHouseGroupBuyTypesFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/discounts/findByHouseIdToDiscountList', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
export async function creatGroupBuyDealListFetch(params){
  return request('/miss-anzhu-newhouse-tx-groupbuy/groupbuy/add', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
export async function getOrderInfoFetch(params){
  return request('/miss-anzhu-newhouse-tx-groupbuy/groupbuy/addGroupPay', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
export async function payGroupBuyFetch(params){
  return request('/miss-anzhu-newhouse-tx-groupbuy/groupbuy/pay', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
export async function searchCustomerInfoFetch(params){
  return request('/miss-anzhu-newhouse-tx-view/viewed/findAllForGroupBuy', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
