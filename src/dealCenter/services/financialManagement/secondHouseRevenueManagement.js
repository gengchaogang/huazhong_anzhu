import request from '../../../commons/utils/request';
export async function getShowTotalDataFetch(params){
  return request('/miss-anzhu-account/statistics/tcSecondHouseBudgetManage',{
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
  });
}
export async function getSHIncomeTableDataFetch(params){
  return request('/miss-anzhu-account/statistics/tcSecondHouseIncomeList', {
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
    body: JSON.stringify(params),
  });
}
export async function getSHExpendTableDataFetch(params){
  return request('/miss-anzhu-account/statistics/tcSecondHouseExpenseList', {
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
    body: JSON.stringify(params),
  });
}
