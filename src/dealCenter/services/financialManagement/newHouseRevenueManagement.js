import request from '../../../commons/utils/request';
export async function getNewHouseBudgetManageFetch(params){
  return request('/miss-anzhu-account/statistics/tcNewHouseBudgetManage',{
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
  });
}
export async function getNewHouseIncomeListFetch(params){
  return request('/miss-anzhu-account/statistics/tcNewHouseIncomeList',{
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
export async function getNewHouseExpenseListFetch(params){
  return request('/miss-anzhu-account/statistics/tcNewHouseExpenseList',{
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
