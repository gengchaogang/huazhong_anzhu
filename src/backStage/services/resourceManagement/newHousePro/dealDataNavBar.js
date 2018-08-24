import request from '../../../../commons/utils/request';
// import qs from 'qs';

export async function getInitRecordTableDataFetch(params){
  return request("/miss-anzhu-newhouse-tx-report/reports/findAll",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
export async function getViewedTableDataFetch(params){
  return request("/miss-anzhu-newhouse-tx-view/viewed/findAll",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
export async function getDiscountTableDataFetch(params){
  return request("/miss-anzhu-newhouse-tx-groupbuy/groupbuy/findAll",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
export async function getDealTableDataFetch(params){
  return request("/miss-anzhu-newhouse-tx-commit/tx/findAllMyAdd",{
    method:'POST',
    headers:{
      'Content-Type':"application/json;charset=UTF-8"
    },
    body:JSON.stringify(params)
  })
}
