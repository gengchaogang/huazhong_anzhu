import fetch from 'dva/fetch';
import { routerRedux } from 'dva/router'
function parseJSON(response) {
    // console.log('parseJSON>response',response);
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url,options, withCookie=true) {
  // console.log('request里的接收的url:',url);
  // console.log('request里的接收的option:',options);
  // credentials:'include',
  const opts = withCookie ? {credentials:'include', ...options} : options
  return fetch(url, opts)
    .then(checkStatus)
    .then(parseJSON)
    .then((data) =>{
      // console.log('in request,data',data);
        let login=true;
        try {
          if(data.status==='error' && data.loginState==='NO'){//没有登录
            login=false
          }
        }catch(e){
          let login=true;
        }
        // console.log('login',login);
        if(!!login){
          return {data};
        }else{
          window.dispatch(routerRedux.push('/login'));
          // window.location='/#/login';
          return {data};
        }
        // return {data};
      // ({ data })
      }
    ).catch((err) => {
      // console.log('in request err:',err);
      return { err }
      }
    );
}
export function requestCORS(url,options) {
  // console.log('request里的接收的url:',url);
  // console.log('request里的接收的option:',options);
  return fetch(url,{credentials:'include',mode:'cors',...options})
    .then(checkStatus)
    .then(parseJSON)
    .then((data) =>{
      // console.log('in request,data',data);
      return {data};
      // ({ data })
      }
    ).catch((err) => {
      // console.log('in request err:',err);
      return { err }
      }
    );
}
