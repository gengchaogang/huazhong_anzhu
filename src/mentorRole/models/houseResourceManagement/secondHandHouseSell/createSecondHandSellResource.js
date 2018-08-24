import { routerRedux } from 'dva/router';
import {requestApi}
from '../../../services/common'
import analysisUtil from '../../../../commons/utils/commonApiResponseAnalysis.js';
import commonFinalCode from '../../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../../commons/utils/commonUtil.js';


/***************************************************************/
/**************************************************************/
/**********  二手房出售：添加房源 *******************************/
/*************************************************************/
/*************************************************************/

export default {
  namespace: 'createSecondHandSellResource',
  state: {
    current: 0,
    projectId:null,
  },
  reducers: {
    setCurrent(state,action){
      return{...state,current:action.payload}
    },
    saveProjectId(state,action){
      return{...state,projectId:action.payload}
    }
  },
  effects:{

  },
  subscriptions:{
    setup({ dispatch, history }) {
         history.listen(location =>{
           if (location.pathname === '/houseResourceSaleManagement/secondHandHouseSell/createSecondHandSellResource/houseResourceInfos') {
             dispatch({
               type: 'setCurrent',
               payload:0
             });
           }else if(location.pathname === '/houseResourceSaleManagement/secondHandHouseSell/createSecondHandSellResource/houseImgs'){
             dispatch({
               type: 'setCurrent',
               payload:1
             });
           }else if(location.pathname === '/houseResourceSaleManagement/secondHandHouseSell/createSecondHandSellResource/ownerInfos'){
             dispatch({
               type: 'setCurrent',
               payload:2
             });
           }else if(location.pathname === '/houseResourceSaleManagement/secondHandHouseSell/createSecondHandSellResource/assignAgent'){
             dispatch({
               type: 'setCurrent',
               payload:3
             });
           }
         });
       },
  }
}
