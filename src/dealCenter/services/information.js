import request from '../../commons/utils/request';
export async function getMsgListFetch(params){
  return request('/miss-anzhu-message/findMyRemindMsg', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}

export async function getMsgInfoFetch(params){
  return request('/miss-anzhu-message/findOneRemindMsg', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
export async function markMsgRead(params){
  return request('/miss-anzhu-message/setRead', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
