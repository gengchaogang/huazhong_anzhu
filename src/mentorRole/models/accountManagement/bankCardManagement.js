import { routerRedux } from 'dva/router';
import finalCode from '../../../commons/utils/commonFinalCode.js';
import analysisUtil from '../../../commons/utils/commonApiResponseAnalysis.js';
import {requestApi} from '../../services/common.js';
import labelsFinalCode from '../../../commons/utils/labelsFinalCode.js';
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../commons/utils/commonUtil.js';
import lodash from 'lodash';
const typeGroups = [
  {
    "areaPath":"",
    "typeName":labelsFinalCode.labelHouse_yh,  // 银行
  },
];
let interval = null;
const defaultState={
  addCardVisible:false,
  agreementVisible:false,
  deleteCardVisible:false,
  isWriteBank:false,
  showCard:false,
  cityOptions:[],
  defaultCard:{},
  companyinfos:null,
  upLoadBankLogo:null,
  bankOptions:[],
  promptObj:finalCode.promptObj,
  province:null,
  city:null,
};
export default {
  namespace: 'bankCardManagement',
  state:defaultState,
  reducers: {
    setDefaultState(state,action){
      return lodash.cloneDeep(defaultState);
    },
    changeModa(state,action){
      return{...state,...action.payload}
    },
    saveResultData(state,action){
      return{...state,...action.payload}
    },
    saveCitys(state,action){
      return{...state,...action.payload}
    },
    saveAreaName(state,action){
      return{...state,...action.payload}
    },
    saveBankLogo(state,action){
      return{...state,...action.payload}
    },
    saveCurrentBankCard(state,action){
      return{...state,...action.payload}
    },
    showBank(state,action){
      return{...state,...action.payload}
    },
    togglePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    saveCompanyInfos(state,action){
      return{...state,...action.payload}
    },
    showPrompt(state,action) {
      return{...state, loadingShadow: false,
        promptObj:Object.assign({}, state.promptObj, {...{type:"error", title:"", visible:true, todo:"closeModal"}},
        {...action.payload})
      }
    },
  },
  effects:{
    *getInitInfos({payload},{call,put,select}){
      const responseObj=yield call(requestApi,{
        apiName:"/miss-anzhu-tutor/tutors/findCompanyInfo",
      });
      const reObj = analysisUtil.analysisDataResponse(responseObj);
      if(reObj.isSuccess) {
        yield put({
          type:"saveCompanyInfos",
          payload:{
            companyinfos:reObj
          }
        })
      }else {
        yield put({type:'showPrompt',payload:{description:`${reObj.msg}`}});
      }
      const params = {groups:typeGroups};
      params.apiName = commonFinalCode.findGroupApiName;
      const responseResultLabelObj = yield call(requestApi,params);
      const resultLabelData = analysisUtil.analysisDataResponse(responseResultLabelObj);
      if(resultLabelData.isSuccess){
        const labels = commonUtil.ansyslabelsData(resultLabelData.content);
        const bankOptions = labels[labelsFinalCode.labelHouse_yh];
        yield put({
          type:'saveResultData',
          payload:{
            bankOptions:bankOptions
          }
        });
      }else{
        yield put({
          type:'showPrompt',
          payload:{
            description:`${reObj.msg}`
          }
        });
      }
      yield put({
        type:"getEopOptions"
      })
      yield put({
        type:"getInitBank"
      })
    },
    *getEopOptions({payload},{call,put}){
      const responseObj=yield call(requestApi,{
        apiName:"/miss-anzhu-operation/service-regions/findAllProvinceAndCity",
      });
      var reObj = analysisUtil.analysisDataResponse(responseObj);
      const citys=[];
      if(reObj.isSuccess) {
        const eopData = commonUtil.createEopData(reObj.content);
        yield put({type:"saveCitys",payload:{
          cityOptions:eopData
        }})
      }else {
        yield put({
          type:'showPrompt',
          payload:{
            description:`${reObj.msg}`
          }
        });
      }
    },
    *deleteBankCard({payload},{call,put}){
      const responseObj=yield call(requestApi,{
        apiName:"/miss-anzhu-account/removeCard",
        ...payload
      });
      var reObj = analysisUtil.analysisDataResponse(responseObj);
      console.log("reObj",reObj);
      if(reObj.isSuccess){
        yield put({
          type:'showPrompt',
          payload:{
            description:`删除银行卡成功!`
          }
        });
        yield put({
          type:"changeModa",
          payload:{
            deleteCardVisible:false
          }
        })
        yield put({type:"getInitInfos",payload:{}})
        yield put({type:"getInitBank",payload:{}})
        yield put({type:"showBank",payload:{showCard:false}})
      }else{
        yield put({
          type:'showPrompt',
          payload:{
            description:`${reObj.msg}`
          }
        });
      }
    },
    *getInitBank({payload},{call,put}){
      const responseObj=yield call(requestApi,{
        apiName:"/miss-anzhu-account/brokerFindBankCard",
        ...payload
      });
      var reObj = analysisUtil.analysisDataResponse(responseObj);
      let defaultCard={};
      if(reObj.isSuccess){
        if(reObj.content.length&&reObj.content.length===1){
          reObj.content.map((item,index)=>{
            if(index===0){
              defaultCard.bank=item.bank;
              defaultCard.bankLogo=item.bankLogo;
              defaultCard.lastCode=item.lastCode;
              defaultCard.name=item.name;
              defaultCard.phone=item.phone;
              defaultCard.showCode=item.showCode;
            }
          })
          yield put({
            type:"saveCurrentBankCard",
            payload:{
              defaultCard:defaultCard,
              showCard:true,
            }
          })
        }else if(reObj.content.length===0){
          return
        }else{
          yield put({
            type:'showPrompt',
            payload:{
              description:`银行卡数量错误,请联系管理员!`
            }
          });
        }
      }else{
        yield put({
          type:'showPrompt',
          payload:{
            description:`${reObj.msg}`
          }
        });
      }
    },
    *bindingCard({payload},{call,put,select}){
      const city = yield select(({bankCardManagement})=>bankCardManagement.city);
      const province = yield select(({bankCardManagement})=>bankCardManagement.province);
      const companyinfos = yield select(({bankCardManagement})=>bankCardManagement.companyinfos);
      const uploadData={};
      uploadData.type="公司账户";
      uploadData.city=city;
      uploadData.province=province;
      uploadData.name=companyinfos.companyName;
      uploadData.logo=payload.values.logo;
      uploadData.bank=payload.values.bank;
      uploadData.code=payload.values.code;
      uploadData.phone=payload.values.phone;
      uploadData.branchName=payload.values.branchName;
      const responseObj=yield call(requestApi,{
        apiName:"/miss-anzhu-account/binding",
        ...uploadData
      });
      var reObj = analysisUtil.analysisDataResponse(responseObj);
      if(reObj.isSuccess){
        if(reObj.result){
          yield put({type:'togglePrompt',payload:{
            type:'success',
            title:'成功!',
            description:`添加银行卡成功!`,
            visible:true,
            todo:"closeModalAndFetch"
          }})
        }
      }else{
        yield put({
          type:'showPrompt',
          payload:{
            description:`${reObj.msg}`
          }
        });
      }
    },
  },
  subscriptions:{ //路由监听
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/accountManagement/bankCardManagement') {
          dispatch({
            type:"setDefaultState"
          })
          dispatch({  //获取当前角色的公司信息
            type:"getInitInfos",
            payload:{}
          })
				}
			});
		},
	},
}
