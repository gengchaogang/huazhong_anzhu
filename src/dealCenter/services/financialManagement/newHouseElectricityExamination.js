import request from '../../../commons/utils/request';
export async function getProjectListFetch(params){
  return request('/miss-anzhu-newhouse-project/projects/onsell/brief', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
  });
}

export async function findAllMyDealAudit(params){
  return request('/miss-anzhu-newhouse-tx-commit/tx/audit/findAllMyDealAudit', {
    method: 'post',
    body: JSON.stringify(params),
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
  });
}

export async function getTrackDetailByGroupKeyAndDetailType(params){
  return request('/miss-anzhu-tx-track/track/getTrackDetailByGroupKeyAndDetailType', {
    method: 'post',
    body: JSON.stringify(params),
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
  });
}
