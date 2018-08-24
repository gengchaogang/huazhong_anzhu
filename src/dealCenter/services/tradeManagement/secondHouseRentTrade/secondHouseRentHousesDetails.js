import request from '../../../../commons/utils/request';
//发起贷款申请
export async function getRentHouseInfo(params){
  return request('/miss-anzhu-secdhouse-tx-report/report/findOne', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
//获取房间标签配置
export async function getLabConfigurations(params){
  return request('/miss-anzhu-operation/labels/findGroup', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
