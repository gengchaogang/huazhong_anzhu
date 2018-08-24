import { routerRedux } from 'dva/router';
import analysisUtil from '../../../commons/utils/commonApiResponseAnalysis.js';
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';
import {message} from 'antd';
import lodash from 'lodash';
import {requestApi}
from '../../services/common'
const defaultState={
  expandedKeys: [],
  selectedRowKeys: [],
  searchValue: '',
  loadingShadow: false,
  autoExpandParent: true,
  idToObj:{},
  brokerListPage: {
    pageNo:1,
    total:0,
    pageSize:commonFinalCode.pageSize,
    content:[],
  },
  promptObj:{
     visible:false,
     description:'',
     title:'',
     promptFor:'default',
     okText:'确定',
     type:'',
     todo:'',
  },
}

export default {
  namespace: 'assignAgentModal',
  state:defaultState,

  reducers: {
    setDefaultState(state,action){
      return lodash.cloneDeep(defaultState);
    },
    modifySelect(state,anction){
      return{...state,selectedRowKeys:anction.payload}
    },
    saveExpandedKeys(state,action){
      return{...state,...action.payload}
    },
    changeSelectedRowKeys(state,action){
      return{...state,...action.payload}
    },
    saveResultData(state,action){
			return{...state,loadingShadow: false,...action.payload}
		},
    showProcess(state,action) {
      return {...state,loadingShadow: true};
    },
    hideProcess(state,action) {
      return {...state,loadingShadow: false};
    },
    showPrompt(state,action) {
			return{...state,loadingShadow: false,
				promptObj:Object.assign({}, state.promptObj, {...{type:"error", title:"", visible:true, todo:"closeModal"}},
				{...action.payload})}
		},
    togglePrompt(state,action){
			return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
		},
    clearList(state,action) {
			return{...state,
				brokerListPage:Object.assign({}, state.brokerListPage,
          {...{content:[]}})}
		},
    addidToObj(state,action) {
      return{...state,
        idToObj:Object.assign({}, state.idToObj,
          {...action.payload})}
    },
  },

  effects:{
    *changeRowKeys({payload},{call,put,select}){
      const newRowKeys=[]
      const checkedKeys=yield select(({assignAgentModal})=>assignAgentModal.selectedRowKeys);
      if(payload.checkedKeys.length&&checkedKeys.length){
        payload.checkedKeys.map(item=>{
          checkedKeys.map(i=>{
            if(item===i){
              newRowKeys.push(i);
            }
          })
        })
      }
      yield put({
        type:"changeSelectedRowKeys",
        payload:{
          selectedRowKeys:newRowKeys
        }
      })
    },
      *getBrokerList({payload},{call,put}){
          yield put ({
            type:'showProcess',
          });
          yield put ({
            type:'clearList',
          });
          payload.apiName = "/miss-anzhu-broker/brokers/findAllBrief";
          const responseObj=yield call(requestApi,{...payload});
          // var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
          var reObj={
            isSuccess:true,
            content:[{
              cityIds:123,
              cityNames:2000,
              gender:'男',
              id:12,
              logo:null,
              name:'张三',
              phone:123456,
            }]
          }
          if (reObj.isSuccess) {
              var _tempList = [];
              const _content = reObj.content;
              const _tempobj = {};
              if (_content != null && _content.length > 0) {
                  _content.map((item,index)=>{
                      const _id = item['id'];
                      item.key = _id;
                      _tempobj[_id] = item;
                      _tempList.push(item);
                  })
              }
              reObj.content = _tempList;
              yield put({
                type:"addidToObj",
                payload:_tempobj,
              });

              yield put({
                type:"saveResultData",
                payload:{
                  brokerListPage:reObj,
                }
              });
          }else {
            yield put({
              type:'showPrompt',
              payload:{
                description:`${reObj.msg}`
            }});
          }
      },
  },

  subscriptions:{
    setup({ dispatch, history }) {
         history.listen(location =>{
           if (location.pathname === '/houseResourceManagement/secondHandHouseSell/createSecondHandSellResource/assignAgentModal') {
            //  dispatch({
            //    type:'getBrokerList',
            //    payload:{
            //        pageSize:commonFinalCode.pageSize,
            //        pageNo:0
            //    }
            //  });
            dispatch({
              type:"setDefaultState"
            })
          }else if(location.pathname === '/houseResourceSaleManagement/directAssignAgent'){
            dispatch({
              type:"setDefaultState"
            })
          }else if(location.pathname==='/houseResourceSaleManagement/secondHandHouseSell/createSecondHandSellResource/assignAgent'){
            dispatch({
              type:"setDefaultState"
            })
          }
         });
       },
  }

}
