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

//获取未读消息数目
export async function getMyNoreadCountFetch(params) {
	return request('/miss-anzhu-message/getMyNoreadCount',{
		headers:{
			'content-type':'application/json;charset=UTF-8'
		},
		method:'POST',
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
