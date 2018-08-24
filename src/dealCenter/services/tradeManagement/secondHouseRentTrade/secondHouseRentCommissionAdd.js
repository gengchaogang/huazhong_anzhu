import request from '../../../../commons/utils/request';
//添加分佣订单
export async function addCommissionSellFetch(params){
  return request('miss-anzhu-secdhouse-tx-commission/lease/add', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//查询未支付订单
export async function getNoPayOrderFetch(params){
  return request('miss-anzhu-secdhouse-tx-commission/pay/noPayOrder', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//支付订单
export async function payCommissionFetch(params){
  return request('miss-anzhu-secdhouse-tx-commission/pay/orderPay', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//取消未支付订单
export async function cancelNoPayOrderFetch(params){
  return request('miss-anzhu-secdhouse-tx-commission/pay/cancelNoPayOrder', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
