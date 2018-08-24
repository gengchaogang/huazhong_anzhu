import request from '../../../commons/utils/request';
export async function getTransactionStatisticsFetch(){
  return request('/miss-anzhu-statistics/tradingcenter/tradingscenter/transactionStatistics', {
    method: 'post',
    headers:{
      'Content-Type': 'application/json;charset=UTF-8'
    },
  });
}
