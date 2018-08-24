import { routerRedux } from 'dva/router';
import {message} from 'antd'
import {requestApi}
from '../../../services/common'

import analysisUtil from '../../../../commons/utils/commonApiResponseAnalysis.js';
import commonFinalCode from '../../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../../commons/utils/commonUtil.js';
import lodash from 'lodash';
const initState={
  currentIdentity:"业主",
  showIdPicList:[],         // 身份证附件
  showHouseNuPicList:[],    // 房产证附件
  showContractPicList:[],   // 房源委托合同附件
  leaseContractPicList:[],  // 租赁合同附件
  houseBaseInfo:{},
  houseOwerInfo:{             // 业主信息， 应以做编辑用
    gender:'男',
  },
  loadingShadow:false,
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
  namespace: 'officeOwnerInfos',
  state:initState,
  reducers: {
    setDefaultState(state,action){
      return lodash.cloneDeep(initState);
    },
    showPicList(state,action){
      return{...state,showIdPicList:action.payload}
    },
    clearOwerInfoObj(state,action){
      return{...state, houseOwerInfo: null}
    },
    setState(state,{payload}){
			return {...state,...payload};
		},
    changeOwnerIdentity(state,{payload}){
			return {...state,...payload};
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
  },
  effects:{
    *initData({payload},{call,put,select}){
        const {houseBaseInfo} = yield select(({officeOwnerInfos})=>officeOwnerInfos);
        yield put ({
            type:"initUpdate"
        })
    },

    // init  Update
    *initUpdate({payload},{call,put,select}){
        const {houseBaseInfo} = yield select(({officeOwnerInfos})=>officeOwnerInfos);
        yield put({
            type:"setState",
            payload:{
                houseOwerInfo: {},
            }
        })
        if (houseBaseInfo['id']) {
            yield put({
              type:"showProcess"
            });
            const params = {};
            params['id'] = houseBaseInfo['id'];
            params.apiName = "/miss-anzhu-secdhouse-resource/houseOwner/findMyHousingResourcesOwnerOne";
            const responseObj = yield call(requestApi, params);
            var reObj = analysisUtil.analysisDataResponse(responseObj);
            if(reObj.isSuccess) {
                const resultShowIdPicList=reObj.idPicture;  //返回來的身份證附件
                const resultShowHouseNuPicList=reObj.propertyPicture; //返回來的房產證附件
                const resultShowContractPicList=reObj.commissionContractPicture;  //返回來的委託合同附件
                const showIdPicList=[];
                const showHouseNuPicList=[];
                const showContractPicList=[];
                if(resultShowIdPicList.length){
                  resultShowIdPicList.map(item=>{
                    showIdPicList.push({
                      name:item.name,
                      id:item.id.toString(),
                      isCover:item.isMain==="否"?false:true,
                      src:item.path,
                      rename:false
                    })
                  })
                }

                if(resultShowHouseNuPicList.length){
                  resultShowHouseNuPicList.map(item=>{
                    showHouseNuPicList.push({
                      name:item.name,
                      id:item.id.toString(),
                      isCover:item.isMain==="否"?false:true,
                      src:item.path,
                      rename:false
                    })
                  })
                }

                if(resultShowContractPicList.length){
                  resultShowContractPicList.map(item=>{
                    showContractPicList.push({
                      name:item.name,
                      id:item.id.toString(),
                      isCover:item.isMain==="否"?false:true,
                      src:item.path,
                      rename:false
                    })
                  })
                }

                yield put({
                    type:"setState",
                    payload:{
                        houseOwerInfo: reObj,
                        showIdPicList:showIdPicList,
                        showHouseNuPicList:showHouseNuPicList,
                        showContractPicList:showContractPicList,
                    }
                })
                yield put({
                  type:"hideProcess"
                });
            }else {
                yield put({
                  type:'showPrompt',
                  payload:{
                    title:'失败!',
                    description:`${reObj.msg}`
                }});
            }
        }
    },

    *deletePic({payload},{call,put,select}){
        yield put({
          type:"showProcess"
        });
        payload.apiName = "/miss-anzhu-secdhouse-resource/main/delHouseImage";
        const responseObj = yield call(requestApi, payload);
        var reObj = analysisUtil.analysisDataResponse(responseObj);
        if(reObj.isSuccess) {
            message.info('删除成功')
            yield put({
                type:"initUpdate"
            })
        }else {
          yield put({
            type:'showPrompt',
            payload:{
              title:'失败!',
              description:`${reObj.msg}`
          }});
        }
    },

    *submitData({payload},{call,put,select}){
        yield put({
          type:"showProcess"
        });
        const _officeOwnerInfosState = yield select(({officeOwnerInfos})=>officeOwnerInfos);

        const {houseBaseInfo} = _officeOwnerInfosState;   // 房源信息
        const {houseOwerInfo} = _officeOwnerInfosState;   // 业主信息

        const {showIdPicList} = _officeOwnerInfosState;
        const {showHouseNuPicList} = _officeOwnerInfosState;
        const {showContractPicList} = _officeOwnerInfosState;

        const showIdPicListUpload=[];
        const showHouseNuPicListUpload=[];
        const showContractPicListUpload=[];
        if(showIdPicList.length){
          showIdPicList.map(item=>{
            if(item.src.indexOf('?')===-1){
              showIdPicListUpload.push({
                dataId:item.id,
                isCover:item.isCover,
                name:item.name,
                path:item.src,
              })
            }else{
              showIdPicListUpload.push({
                id:item.id,
                isCover:item.isCover,
                name:item.name,
              })
            }
          })
        }
        if(showHouseNuPicList.length){
          showHouseNuPicList.map(item=>{
            if(item.src.indexOf('?')===-1){
              showHouseNuPicListUpload.push({
                dataId:item.id,
                isCover:item.isCover,
                name:item.name,
                path:item.src,
              })
            }else{
              showHouseNuPicListUpload.push({
                id:item.id,
                isCover:item.isCover,
                name:item.name,
              })
            }
          })
        }
        if(showContractPicList.length){
          showContractPicList.map(item=>{
            if(item.src.indexOf('?')===-1){
              showContractPicListUpload.push({
                dataId:item.id,
                isCover:item.isCover,
                name:item.name,
                path:item.src,
              })
            }else{
              showContractPicListUpload.push({
                id:item.id,
                isCover:item.isCover,
                name:item.name,
              })
            }
          })
        }

        var submitObj = payload;
        submitObj['houseId'] = houseBaseInfo['id'];

        submitObj['idPicture'] = showIdPicListUpload;
        submitObj['propertyPicture'] = showHouseNuPicListUpload;
        submitObj['commissionContractPicture'] = showContractPicListUpload;

        let apiName = "/miss-anzhu-secdhouse-resource/houseOwner/addHousingResourcesOwner";
        if (houseOwerInfo != null && houseOwerInfo['id']) {
            const _id = houseOwerInfo['id'];
            if (_id != null && _id != 0) {
                submitObj['id'] = _id;
                submitObj['houseId'] = 0;
                apiName = "/miss-anzhu-secdhouse-resource/houseOwner/updateHousingResourcesOwner";
            }
        }
        submitObj.apiName = apiName;
        submitObj.updateAllFile = '是';//是否替換以前的圖片
        const responseObj = yield call(requestApi, submitObj);
        var reObj = analysisUtil.analysisDataResponse(responseObj);
        if(reObj.isSuccess) {
          message.info('业主信息保存成功');
          // 关闭
          yield put({
            type:"hideProcess"
          });
          submitObj['id'] = reObj.id;
          houseBaseInfo.officeOwnerInfos = submitObj;
          yield put({
            type:"setState",
            payload:{
                houseBaseInfo:houseBaseInfo
            }
          });
          yield put (routerRedux.push({
            pathname:'/houseResourceSaleManagement/officeSell',
            //  pathname:'/houseResourceSaleManagement/officeSell/createOfficeSellResource/assignAgentOfficeSell',
            state:{ //这里传入projectId 跳转到下一个页面时监听路由把值存在state中
                houseBaseInfo:houseBaseInfo,
            }
          }))
        }else {
          yield put({
            type:'showPrompt',
            payload:{
              title:'失败!',
              description:`${reObj.msg}`
          }});
        }
    }
  },
  subscriptions:{
    setup({ dispatch, history }) {
         history.listen(location =>{
           if (location.pathname === '/houseResourceSaleManagement/officeSell/createOfficeSellResource/officeOwnerInfos') {
             dispatch({
               type:"setDefaultState"
             })
             let _houseBaseInfo = {};
             if (location.state) {
                _houseBaseInfo = location.state.houseBaseInfo;
             }
             dispatch({
               type:'setState',
               payload:{
                 houseBaseInfo:_houseBaseInfo,
               }
             });

             dispatch({
               type:'initData',
               payload:{

               }
             });
           }
         });
       },
  }
}
