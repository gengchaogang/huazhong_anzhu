import { routerRedux } from 'dva/router';
import finalCode from '../../../commons/utils/commonFinalCode.js';
import analysisUtil from '../../../commons/utils/commonApiResponseAnalysis.js';
import {requestApi} from '../../services/common.js';
import lodash from 'lodash';
const _getNameArrByCode=(arr, code)=>{
  var nameArr = [], item;
  for(var i=arr.length-1; i>=0; i--){
    item = arr[i];
    if(item.code == code){
      nameArr.push(item.code);
      if(item.pCode){
        code = item.pCode;
      }else {
        break;
      }
    }
  }
  nameArr.reverse();
  return nameArr;
}
let interval = null;
const defaultState = {
  showLogoList:[],
  showBusinessLicenseList:[],
  isAuthentication:true,
  certificatesType:null,
  promptObj:finalCode.promptObj,
  tutorInfo:{},
  enterpriseInfo:{},
  eopOptions:[],
  codePath:[],
  cityNames:"",
  allAreasCode:[],
  currentAreaCode:[],
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
//封装行政区划数据
const createEopData =(eopOptions)=>{
  let eopObj = {};
  let eopRootArray = [];
  let eopArray = [];
  eopOptions.forEach((item,index)=>{
    let tempItem = {};
    tempItem.value = item.code;
    tempItem.label = item.lable;
    eopObj[item.code] = tempItem;

    const pCode = item.pCode;
    if(pCode){
      if(eopObj[pCode]){
        if(!eopObj[pCode]["children"]){
            eopObj[pCode]["children"] = [];
        }
        eopObj[pCode]["children"].push(tempItem);
      }
    }else{
      eopRootArray.push(item.code);
    }
  });
  eopRootArray.map((item)=>{
    const tempObj = eopObj[item];
    if(tempObj){
      eopArray.push(tempObj);
    }
  });
  return eopArray;
}
export default {
  namespace: 'businessInfos',
  state: {},
  reducers: {
    setDefaultState(state,action){
      return lodash.cloneDeep(defaultState);
    },
    setStatePramas(state,action){
      return{...state,...action.payload}
    },
    showPrompt(state,action) {
			return{...state, loadingShadow: false,
				promptObj:Object.assign({}, state.promptObj, {...{type:"error", title:"", visible:true, todo:"closeModal"}},
				{...action.payload})
      }
		},
    togglePrompt(state,action){
			return {...state,loadingShadow: false,promptObj:Object.assign({},state.promptObj,{...action.payload})}
		},
    changeAuthentication(state,action){
      return{...state,...action.payload}
    },
    saveAllAreasCode(state,action){
      return{...state,...action.payload}
    },
    saveCurrentAreaCode(state,action){
      return{...state,...action.payload}
    },
  },
  effects:{
    *getInitInfo({payload},{put,call,select}){
      const userInfo=yield select(({main})=>main.userInfo);
      if(userInfo){
        if(interval!=null){
          clearInterval(interval);
        }
      }else{
        return;
      }
      const userInfoJSON = JSON.parse(userInfo);
      const isAuthentication = userInfoJSON.auditStatus == "审核通过" ? true : false;
      yield put({
        type:'setStatePramas',
        payload:{
          // showLogoList:[{name:"",id:"",src:userInfoJSON.logo,isCover:false,rename:false}],
          showLogoList:!!userInfoJSON.logo?[{name:"",id:"",src:userInfoJSON.logo,isCover:false,rename:false}]:[],
          tutorInfo:userInfoJSON,
          isAuthentication:isAuthentication,
        }
      });
      yield put({
        type:"getEopOptions",
      });
    },

    *getEopOptions({payload},{put,call}){
      const responseObj=yield call(requestApi,{
        apiName:"/miss-anzhu-operation/service-regions/findAllAreas",
      });
      var reObj = analysisUtil.analysisDataResponse(responseObj);
      if(reObj.isSuccess) {
        yield put({
          type:"saveAllAreasCode",
          payload:{
            allAreasCode:reObj.content
          }
        })
        const eopData = createEopData(reObj.content);
        yield put({type:'setStatePramas',payload:{eopOptions:eopData}});
        yield put({
          type:"findCompanyInfo",
        });
      }else {
        yield put({type:'showPrompt',payload:{description:`${reObj.msg}`}});
      }
    },

    *findCompanyInfo({payload},{put,call,select}){
      const responseObj=yield call(requestApi,{
        apiName:"/miss-anzhu-tutor/tutors/findCompanyInfo",
      });
      var reObj = analysisUtil.analysisDataResponse(responseObj);
      if(reObj.isSuccess) {
        const allAreasCode=yield select(({businessInfos})=>businessInfos.allAreasCode);
        const currentAreaCode=_getNameArrByCode(allAreasCode,reObj.codePath)
        yield put({
          type:"saveCurrentAreaCode",
          payload:{
            currentAreaCode:currentAreaCode,
            cityNames:reObj.fullPath,
          }
        })
        yield put({type:'setStatePramas',payload:{
          enterpriseInfo:reObj,
          showBusinessLicenseList:[{name:"",id:"",src:reObj.licensePic,isCover:false,rename:false}],
          certificatesType:reObj.licenseType == "多证合一营业执照" ?1:2,
          codePath:reObj.codePath.split("/"),
        }});
      }else {
        yield put({type:'showPrompt',payload:{description:`${reObj.msg}`}});
      }
    },

    *editTutors({payload},{put,call}){
      const responseObj=yield call(requestApi,{
        apiName:"/miss-anzhu-tutor/tutors/edit",
        ...payload.formData,
      });
      var reObj = analysisUtil.analysisDataResponse(responseObj);
      if(reObj.isSuccess) {
        yield put({type:'showPrompt', payload:{description:"企业信息保存成功!"}});
      }else {
        yield put({type:'showPrompt', payload:{description:`${reObj.msg}`}});
      }
    },

    *submitAuthentication({payload},{put,call}){
      const responseObj=yield call(requestApi,{
        apiName:"/miss-anzhu-tutor/tutors/submitAuthentication",
        ...payload.formData,
      });
      var reObj = analysisUtil.analysisDataResponse(responseObj);
      if(reObj.isSuccess) {
        // yield put({type:'showPrompt', payload:{description:"企业保存成功"}});
        yield put({
          type:'togglePrompt',
          payload:{
            title:'提示!',
            description:`企业认证信息保存成功,请重新审核!`,
            visible:true,
            todo:"reReviewed"
          }
        })
      }else {
        yield put({type:'showPrompt', payload:{description:`${reObj.msg}`}});
      }
    },
  },
  subscriptions:{ //路由监听
		setup({ dispatch, history }) {

			history.listen(location => {
				if (location.pathname === '/businessManagement/businessInfos') {
          dispatch({
            type:"setDefaultState",
          })
          interval = setInterval(() => {
            dispatch({
              type:"getInitInfo",
            })
          }, 100);

				}
			});
		},
	},
}
