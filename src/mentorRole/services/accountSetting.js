import request from '../../commons/utils/request';
import qs from 'qs';

// 异步请求模板 改function名字和路由就可以了
export async function modifyPasswordFetch(params){
    return request('/miss-anzhu-tutor/tutors/editPassword',{
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
			body:JSON.stringify(params)
		});
}
