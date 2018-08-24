import request from '../../../../commons/utils/request';
//添加意向金订单
export async function addIntentionSellFetch(params){
  return request('miss-anzhu-secdhouse-tx-intention/lease/add', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//查询未支付订单
export async function getNoPayOrderFetch(params){
  return request('miss-anzhu-secdhouse-tx-intention/pay/noPayOrder', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//支付订单
export async function payIntentsFetch(params){
  return request('miss-anzhu-secdhouse-tx-intention/pay/orderPay', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//取消未支付订单
export async function cancelNoPayOrderFetch(params){
  return request('miss-anzhu-secdhouse-tx-intention/pay/cancelNoPayOrder', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
