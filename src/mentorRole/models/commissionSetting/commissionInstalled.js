import { routerRedux } from 'dva/router';
import finalCode from '../../../commons/utils/commonFinalCode.js';
import analysisUtil from '../../../commons/utils/commonApiResponseAnalysis.js';
import {requestApi} from '../../services/common.js';
import lodash from 'lodash';
const createTableData = (tableData,dateContent,activeKey)=>{
  tableData.forEach((item)=>{
    const type = item.propertyType;
    const filterArray =  dateContent.filter((contentItem)=>{
      return contentItem.propertyType === type;
    });
  if(activeKey==='isEmployee'){
    if(filterArray.length){
      filterArray.map((i,index)=>{
        if(i.isEmployee){
          const {id,tutorScale,isEmployee} = i;
          item.id = i.id;
          item.tutorScale = i.tutorScale;
          item.isEmployee = i.isEmployee;
        }
      })
    }
  }else{
    if(filterArray.length){
      filterArray.map((i,index)=>{
        if(i.isEmployee!==true){
          const {id,tutorScale,isEmployee} = i;
          item.id = i.id;
          item.tutorScale = i.tutorScale;
          item.isEmployee = i.isEmployee;
        }else{
          item.id = '';
          item.tutorScale = '';
          item.isEmployee = false;
        }
      })
    }
  }
  });
}
const defaultState = {
  isEmployee:null,
  activeKey:"isEmployee",
  promptObj:finalCode.promptObj,
  editVisible:false,
  tableLoading:true,
  propertyType:"",
  selectId:"",
  tutorScale:"",
  tableData:[{
      key:"1",
      id:"",
      number:"1",
      propertyType:"住宅出售",
      tutorScale:"",
      isEmployee:"",
    },{
        key:"2",
        id:"",
        number:"2",
        propertyType:"住宅出租",
        tutorScale:"",
        isEmployee:"",
      },{
      key:"3",
      id:"",
      number:"3",
      propertyType:"商铺出售",
      tutorScale:"",
      isEmployee:"",
    },{
    key:"4",
    id:"",
    number:"4",
    propertyType:"商铺出租",
    tutorScale:"",
    isEmployee:"",
  },{
      key:"5",
      id:"",
      number:"5",
      propertyType:"写字楼出售",
      tutorScale:"",
      isEmployee:"",
    },{
        key:"6",
        id:"",
        number:"6",
        propertyType:"写字楼出租",
        tutorScale:"",
        isEmployee:"",
      },{
          key:"7",
          id:"",
          number:"7",
          propertyType:"新房",
          tutorScale:"",
          isEmployee:"",
        }]
}

export default {
  namespace: 'commissionInstalled',
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
    changeActiveKey(state,action){
      return{...state,...action.payload}
    },
  },
  effects:{
    *getInitInfo({payload},{put,call,select}){
      yield put({type:'findCommissionProjects'});
    },
    *findCommissionProjects({payload},{put,call,select}){
      const responseObj=yield call(requestApi,{
        apiName:"/miss-anzhu-tutor/tutors/findCommissionProjects",
      });
      var reObj = analysisUtil.analysisDataResponse(responseObj);
      if(reObj.isSuccess) {
        const _tableData=yield select(({commissionInstalled})=>commissionInstalled.tableData);
        const activeKey=yield select(({commissionInstalled})=>commissionInstalled.activeKey);
        createTableData(_tableData,reObj.content,activeKey);
        yield put({type:'setStatePramas',payload:{tableData:_tableData,tableLoading:false}});
      }else {
        yield put({type:'showPrompt',payload:{description:`${reObj.msg}`}});
      }
    },

    *addCommissionProject({payload},{put,call,select}){
      const {id,propertyType,tutorScale} = payload;
      let apiName = "/miss-anzhu-tutor/tutors/editCommissionProject";
      if(!id){
        apiName = "/miss-anzhu-tutor/tutors/addCommissionProject";
      }
      const responseObj=yield call(requestApi,{
        apiName:apiName,
        ...payload,
      });
      var reObj = analysisUtil.analysisDataResponse(responseObj);
      if(reObj.isSuccess) {
        yield put({type:'setStatePramas',payload:{editVisible:false}});
      }else {
        yield put({type:'showPrompt',payload:{description:`${reObj.msg}`}});
        return;
      }
      yield put({type:'findCommissionProjects'});
    },
  },
  subscriptions:{ //路由监听
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/commissionSetting/commissionInstalled') {
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
