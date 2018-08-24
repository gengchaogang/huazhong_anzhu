import request from '../../../commons/utils/request';
export async function getShowTotalDataFetch(params){
  return request('/miss-anzhu-account/statistics/tcServiceChargeBudgetMasnage',{
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
  });
}
export async function serviceChargeIncomeTableDataFetch(params){
  return request('/miss-anzhu-account/statistics/tcServiceChargeIncomeList', {
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
    body: JSON.stringify(params),
  });
}
export async function serviceChargeExpendTableDataFetch(params){
  return request('/miss-anzhu-account/statistics/tcServiceChargeExpenseList', {
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
    body: JSON.stringify(params),
  });
}
