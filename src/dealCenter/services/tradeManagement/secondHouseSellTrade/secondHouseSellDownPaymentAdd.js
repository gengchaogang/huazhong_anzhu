import request from '../../../../commons/utils/request';
//添加首付订单
export async function addDownPaymentSellFetch(params){
  return request('miss-anzhu-secdhouse-tx-firstpayment/add', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//查询未支付订单
export async function getNoPayOrderFetch(params){
  return request('miss-anzhu-secdhouse-tx-firstpayment/pay/noPayOrder', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//支付订单
export async function payDownPaymentFetch(params){
  return request('miss-anzhu-secdhouse-tx-firstpayment/pay/orderPay', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//查询意向金支付记录
export async function getDownPatmentRecordFetch(params){
  return request('miss-anzhu-secdhouse-tx-intention/findOne', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//删除首付款订单
export async function cancelNoPayOrderFetch(params){
  return request('miss-anzhu-secdhouse-tx-firstpayment/pay/cancelNoPayOrder', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
