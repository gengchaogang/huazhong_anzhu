import { routerRedux } from 'dva/router';
import {message} from 'antd'
import {requestApi}
from '../../../services/common'

import analysisUtil from '../../../../commons/utils/commonApiResponseAnalysis.js';
import commonFinalCode from '../../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../../commons/utils/commonUtil.js';
import lodash from 'lodash';
const initState={
  showPicList:[],
  houseBaseInfo:{},
  loadingShadow:false,
  picListData:[],
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
  namespace: 'shopsImgs',
  state:initState,
  reducers: {
    setDefaultState(state,action){
      return lodash.cloneDeep(initState);
    },
    showPicList(state,action){
      return{...state, showPicList:action.payload}
    },
    clearShowPicList(state,action){
      return{...state, showPicList:[]}
    },
    setState(state,{payload}){
			return {...state,...payload};
		},
    saveResultData(state,action){
			return{...state, loadingShadow: false,...action.payload}
		},
    showProcess(state,action) {
			return {...state, loadingShadow: true};
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
        const {houseBaseInfo} = yield select(({shopsImgs})=>shopsImgs);
        yield put({
            type:"setState",
            payload:{
                picListData:[],
            }
        })
        // 查询当前用户添加过的图片信息
        yield put ({
            type:"initUpdate"
        })
    },

    *initUpdate({payload},{call,put,select}){
        const {houseBaseInfo} = yield select(({shopsImgs})=>shopsImgs);
        yield put({
            type:"setState",
            payload:{
                picListData: [],
            }
        })
        if (houseBaseInfo['id']) {
            yield put({
              type:"showProcess"
            });
            const params = {};
            params['id'] = houseBaseInfo['id'];
            params.apiName = commonFinalCode.getMyHousePicListApiName;
            const responseObj = yield call(requestApi, params);
            var reObj = analysisUtil.analysisDataResponse(responseObj);
            if(reObj.isSuccess) {
                const {content} = reObj;
                const showPicList=[];
                if(content != null && content.length > 0) {
                  content.map((item,index)=>{
                    showPicList.push({
                      name:item.name,
                      id:item.id.toString(),
                      isCover:item.isMain==="否"?false:true,
                      src:item.path,
                      rename:false
                    })
                  })
                    yield put({
                        type:"setState",
                        payload:{
                            picListData:content,
                            showPicList:showPicList,
                        }
                    })
                }
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

        const _shopsImgsState = yield select(({shopsImgs})=>shopsImgs);
        var {houseBaseInfo} = _shopsImgsState;
        const {showPicList} = _shopsImgsState;
        const showPicListUpload=[];
        if(showPicList.length){
          showPicList.map(item=>{
            if(item.src.indexOf('?')===-1){
              showPicListUpload.push({
                dataId:item.id,
                isCover:item.isCover,
                name:item.name,
                path:item.src,
              })
            }else{
              showPicListUpload.push({
                id:item.id,
                isCover:item.isCover,
                name:item.name,
              })
            }
          })
        }
        const addImagsObj = {};
        addImagsObj.id = houseBaseInfo['id'];
        addImagsObj.pictures = showPicListUpload;
        addImagsObj.updateAllFile = '是';
        // 上传房源图片文件
        addImagsObj.apiName = "/miss-anzhu-secdhouse-resource/main/addHouseImage";
        const responseObj = yield call(requestApi,{...addImagsObj});
        var reObj = analysisUtil.analysisDataResponse(responseObj);
        houseBaseInfo.pictures = showPicList;
        if(reObj.isSuccess) {
          message.info('添加房源图片成功');
          // 关闭
          yield put({
            type:"hideProcess"
          });
          yield put({
            type:"setState",
            payload:{
                houseBaseInfo:houseBaseInfo
            }
          });

          yield put (routerRedux.push({
            pathname:'/houseResourceSaleManagement/shopsSell/createShopsSellResource/shopsOwnerInfos',
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
    },

    //-----------------------effects end

  },
  subscriptions:{
    setup({dispatch, history }) {
         history.listen(location =>{
           if (location.pathname === '/houseResourceSaleManagement/shopsSell/createShopsSellResource/shopsImgs') {
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
                type:"clearShowPicList"
             })
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
