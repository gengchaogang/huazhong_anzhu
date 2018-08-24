import request from '../../commons/utils/request';
import qs from 'qs';

export async function query(params) {
  return request(`/api/houseDatas?${qs.stringify(params)}`);
}

export async function create(params) {
  return request('/api/houseDatas', {
    method: 'post',
    body: qs.stringify(params),
  });
}

export async function remove(params) {
  return request('/api/houseDatas', {
    method: 'delete',
    body: qs.stringify(params),
  });
}

export async function update(params) {
  return request('/api/houseDatas', {
    method: 'put',
    body: qs.stringify(params),
  });
}
