import request from '../../commons/utils/request';
export async function getTradeCenterTradeInfo(){
  return request('/miss-anzhu-statistics/tradingcenter/tradingscenter/tradingCenterIndex', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
  });
}
