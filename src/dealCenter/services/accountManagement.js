import request from '../../commons/utils/request';
export async function accountLoginFetch(params){
  return request('/miss-anzhu-trading-center/employees/updatePassword', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
export async function accountOptFetch(params){
  return request('/miss-anzhu-trading-center/employees/updateOptPassword', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
export async function verificationLoginPsdFetch(params){
  return request('/miss-security-server/users/checkPassword', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
export async function sendVerificationCodeFetch(params){
  return request('/miss-anzhu-sms/sendCode', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
export async function verifyVerificationCodeFetch(params){
  return request('/miss-anzhu-sms/verifyCode', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
export async function changeUserPhoneFetch(params){
  return request('/miss-anzhu-trading-center/employees/editPhoneByTC', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body:JSON.stringify(params)
  });
}
