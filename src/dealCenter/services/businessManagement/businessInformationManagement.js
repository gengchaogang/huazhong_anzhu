// import request from '../../../commons/utils/request';
// import qs from 'qs';
// export async function query(params){
//   return {
//     nameTradingCenter:'xxx交易中心大厅',
//     tradingCenterPeople:'林八千',
//     businessCenter:'北京市 海淀区 西八里庄北里22号楼底商',
//     businessTelephone:'010-58301690',
//     businessContact:'林八千',
//     contactNumber:'15120050557',
//     companyName:'北京中润毅弘网络科技有限公司',
//     corporate:'林八千',
//     businessLicense:true,
//   }
// }
import baseApi, {delayThen} from '../../../commons/service/baseApi';

export async function query(){
  return baseApi("/miss-anzhu-trading-center/trading-centers/findMyTradingCenter").then(delayThen);
}
