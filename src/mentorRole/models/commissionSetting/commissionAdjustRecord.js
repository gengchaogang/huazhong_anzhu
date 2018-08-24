import { routerRedux } from 'dva/router';
import finalCode from '../../../commons/utils/commonFinalCode.js';
import analysisUtil from '../../../commons/utils/commonApiResponseAnalysis.js';
import {requestApi} from '../../services/common.js';
import lodash from 'lodash';

const defaultState = {
  promptObj:finalCode.promptObj,
  tableLoading:true,
  pageInfo: {
    pageNo:0,
    total:0,
    pageSize:5,
    content:[],
  },
}
export default {
  namespace: 'commissionAdjustRecord',
  state: null,
  reducers: {
    setDefaultState(state,action){
      return lodash.cloneDeep(defaultState);
    },
    setStatePramas(state,action){
      return{...state,...action.payload}
    },
    showPrompt(state,action) {
			return{...state, tableLoading: false,
				promptObj:Object.assign({}, state.promptObj, {...{type:"error", title:"", visible:true, todo:"closeModal"}},
				{...action.payload})
      }
		},
    togglePrompt(state,action){
			return {...state,tableLoading: false,promptObj:Object.assign({},state.promptObj,{...action.payload})}
		},
  },
  effects:{
    *getInitInfo({payload},{put,call,select}){
      const _pageNo=yield select(({commissionAdjustRecord})=>commissionAdjustRecord.pageInfo.pageNo);
      const _pageSize=yield select(({commissionAdjustRecord})=>commissionAdjustRecord.pageInfo.pageSize);
      yield put({type:'findCommissionEditRecord',payload:{pageNo:_pageNo,pageSize:_pageSize}});
    },
    *findCommissionEditRecord({payload},{put,call,select}){
      const responseObj=yield call(requestApi,{
        apiName:"/miss-anzhu-tutor/tutors/findCommissionEditRecord",
        ...payload
      });
      var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
      if(reObj.isSuccess) {
        yield put({type:'setStatePramas',payload:{pageInfo:{...reObj},tableLoading:false}});
      }else {
        yield put({type:'showPrompt',payload:{description:`${reObj.msg}`}});
      }
    },
  },
  subscriptions:{ //路由监听
		setup({ dispatch, history }) {
			history.listen(location => {
        if (location.pathname === '/commissionSetting/commissionInstalled/commissionAdjustRecord') {
          dispatch({
            type:"setDefaultState",
          });
          dispatch({
            type:"getInitInfo",
          });
				}
			});
		},
	},
}
