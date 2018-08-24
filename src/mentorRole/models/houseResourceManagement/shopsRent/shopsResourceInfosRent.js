import {requestApi} from '../../../services/common.js';
import analysisUtil from '../../../../commons/utils/commonApiResponseAnalysis.js';
import commonFinalCode from '../../../../commons/utils/commonFinalCode.js';
import { routerRedux } from 'dva/router';
import {message} from 'antd'
import commonUtil from '../../../../commons/utils/commonUtil.js';
import labelsFinalCode from '../../../../commons/utils/labelsFinalCode.js';


// 加载标签信息
const typeGroups = [
  {
    "areaPath":"",
    "typeName":labelsFinalCode.labelShopsCzts,// 二手房房商出租铺特色
  },
  {
    "areaPath":"",
    "typeName":labelsFinalCode.labelShopsSplx,// 二手房房商铺类型
  },
  {
    "areaPath":"",
    "typeName":labelsFinalCode.labelShopsPmlx,// 二手房房商铺类型
  },
  {
    "areaPath":"",
    "typeName":labelsFinalCode.labelShopsSpkjyfw,// 二手房房商铺可经营类别
  },
  {
    "areaPath":"",
    "typeName":labelsFinalCode.labelZzzpfs,// 二手房房商铺出租支付方式
  },
  {
    "areaPath":"",
    "typeName":labelsFinalCode.labelShops_czzjdw,// 出租租金单位
  },
  {
    "areaPath":"",
    "typeName":labelsFinalCode.labelZxqk,       // 装修情况
  },

];

const initState = {
  buildingId:"",
  communityId:"",
  houseNumberId:"",
  houseUnique:true,
  communityData:[],
  buildingsData:[],
  roomsData:[],
  isAreaSelected:true,
  isCommunitied:true,
  isBuilded:true,
  currentArea:null,
  tagsValue:[],
  shopsTypeTags:[],
  operateTypeTags:[],
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
  eopOptions:[],          // 区域信息
  areaName:"",
  labels:{},              // 标签信息
  houseBaseInfo:{         // 房源默认信息
    resourcesType: commonFinalCode.senondHouseResourcesType_sp,   // 商铺
    saleWay: commonFinalCode.senondHouseSaleWay_cz,               // 出售
    split:"可分割",
    decoration:"简装修",
  },
}


export default {
  namespace: 'shopsResourceInfosRent',
  state: initState,
  reducers: {
    changeDisabled(state,action){
      return{...state,...action.payload}
    },
    saveHouseUnique(state,action){
      return{...state,...action.payload}
    },
    changeTagsValue(state,action){
      return{...state,...action.payload}
    },
    saveAreaData(state,action){
      return{...state,...action.payload}
    },
    setState(state,{payload}){
			return {...state,...payload};
		},
    initState(state,{payload}){
			return {...state,...initState};
		},
    saveResultData(state,action){
			return{...state,tableLoading:false,loadingShadow: false,...action.payload}
		},
    showProcess(state,action) {
			return {...state,loadingShadow: true};
		},
		hideProcess(state,action) {
			return {...state,loadingShadow: false};
		},
    showPrompt(state,action) {
			return{...state, tableLoading:false,loadingShadow: false,
				promptObj:Object.assign({}, state.promptObj, {...{type:"error", title:"", visible:true, todo:"closeModal"}},
				{...action.payload})}
		},
    togglePrompt(state,action){
			return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
		},
  },
  effects:{
    *checkHouseUnique({payload},{call,put}){
      const responseObj = yield call(requestApi,{
        apiName:"/miss-anzhu-secdhouse-resource/main/checkHouse",
        ...payload
      });
      var reObj = analysisUtil.analysisDataResponse(responseObj);
      if(reObj.isSuccess) {
        console.log('reObj',reObj)
        if(reObj.id===null){
          return
        }else{
          message.error(`此房源已经在${reObj.resourcesType}${reObj.saleWay}中发布过，不能重复发布此房源！`,5);
          yield put({
            type:"saveHouseUnique",
            payload:{
              houseUnique:false
            }
          })
        }
      }else {
          yield put({
            type:'showPrompt',
            payload:{
              description:`${reObj.msg}`
            }
          });
      }
    },

      *initData({payload},{call,put,select}){
          // 加载所在区域信息
          yield put({
            type:"getEopOptions"
          })

          yield put({
            type:"showProcess"
          });
          // 查询标签
          const params = {groups:typeGroups};
          params.apiName = commonFinalCode.findGroupApiName;
          const responseObj = yield call(requestApi,params);
          var reObj = analysisUtil.analysisDataResponse(responseObj);
          if(reObj.isSuccess) {
              const labels = commonUtil.ansyslabelsData(reObj.content);
              yield put({
                type:'saveResultData',
                payload:{
                  labels:labels
                }
              });
              yield put({
                type:"hideProcess"
              });
          }else {
              yield put({
                type:'showPrompt',
                payload:{
                  description:`${reObj.msg}`
                }
              });
          }
      },
      *getEopOptions({payload},{call,put}){
        const responseObj=yield call(requestApi,{
          apiName:"/miss-anzhu-operation/service-regions/findAllProvinces",
        });
        var reObj = analysisUtil.analysisDataResponse(responseObj);
        if(reObj.isSuccess) {
          const eopData = commonUtil.createEopData(reObj.content);
          yield put({
            type:'saveResultData',
            payload:{
              eopOptions:eopData
            }
          });
        }else {
          yield put({
            type:'showPrompt',
            payload:{
              description:`${reObj.msg}`
            }
          });
        }
      },

      *searchCommunities({payload},{call,put,select}){
          const responseObj = yield call(requestApi,{
            apiName:"/miss-anzhu-community/communities/findByAraeName",
            ...payload
          });
          var reObj = analysisUtil.analysisDataResponse(responseObj);
          if(reObj.isSuccess) {
            const resultData=[];
            reObj.content.map(item=>{
              resultData.push({
                key:item.id,
                name:item.name,
                id:item.id,
              })
            })
            yield put({
              type:"saveResultData",
              payload:{
                communityData:resultData
              }
            })
          }else {
              yield put({
                type:'showPrompt',
                payload:{
                  description:`${reObj.msg}`
                }
              });
          }
      },
      *getBuildingsData({payload},{call,put,select}){
          const responseObj = yield call(requestApi,{
            apiName:"/miss-anzhu-community/buildings/findByCommunityId",
            ...payload
          });
          var reObj = analysisUtil.analysisDataResponse(responseObj);
          if(reObj.isSuccess) {
            const resultData=[];
            reObj.content.map(item=>{
              resultData.push({
                key:item.id,
                name:item.name,
                id:item.id,
              })
            })
            yield put({
              type:"saveResultData",
              payload:{
                buildingsData:resultData
              }
            })
          }else {
              yield put({
                type:'showPrompt',
                payload:{
                  description:`${reObj.msg}`
                }
              });
          }
      },
      *getRoomsData({payload},{call,put,select}){
          const responseObj = yield call(requestApi,{
            apiName:"/miss-anzhu-community/rooms/findRooms",
            ...payload
          });
          var reObj = analysisUtil.analysisDataResponse(responseObj);
          if(reObj.isSuccess) {
            var rooms = [];
            reObj.content.forEach((floor, index)=> {
                floor.rooms.forEach((room, i)=> {
                    room && rooms.push({
                        floor: floor,
                        ...room,
                        houseNumberId: room.id,
                        houseNumber: room.roomCode
                    });
                })
            });
            rooms.sort((room1, room2)=>(room1.roomNo - room2.roomNo));
            yield put({
              type:"saveResultData",
              payload:{
                roomsData:rooms
              }
            })
          }else {
              yield put({
                type:'showPrompt',
                payload:{
                  description:`${reObj.msg}`
                }
              });
          }
      },

      /** 提交数据 */
      *submitData({payload},{call,put,select}){
        const {houseUnique} = yield select(({shopsResourceInfosRent})=>shopsResourceInfosRent);
          // 区域信息
          var areaStr = "";
          if (payload['area']) {
            const area = payload['area'];
            areaStr = area.join('/');
            payload['area'] = areaStr;
            const {areaName} = yield select(({shopsResourceInfosRent})=>shopsResourceInfosRent);
            payload['areaName'] = areaName;
          }

          // 商铺_类型   上主下商、
          if(payload['shopType']) {
            payload.shopType= payload.shopType[0];
          }
          // 铺面_类型   上主下商、
          if(payload['shopOfficeType']) {
            payload.shopOfficeType= payload.shopOfficeType[0];
          }
          // 房源特色
          if(payload['characteristics']) {
              payload['characteristics'] = JSON.stringify(payload['characteristics']);
          }
          // 商铺_可经营类别
          if(payload['businessCategory']) {
              payload['businessCategory'] = JSON.stringify(payload['businessCategory']);
          }


          // 默认添加
          let paiName = "/miss-anzhu-secdhouse-resource/resource/addShopsRentInfo";
          let {houseBaseInfo} = yield select(({shopsResourceInfosRent})=>shopsResourceInfosRent);
          if (houseBaseInfo != null && houseBaseInfo['id']) {
              // 编辑
              paiName = "/miss-anzhu-secdhouse-resource/resource/updateShopsRentInfo";
              payload['id'] = houseBaseInfo['id'];
          }
          payload.apiName = paiName;
          payload.resourcesType = houseBaseInfo['resourcesType'];
          payload.saleWay = houseBaseInfo['saleWay'];
          if(houseUnique){
            const responseObj = yield call(requestApi,{...payload});
            var reObj = analysisUtil.analysisDataResponse(responseObj);
            if(reObj.isSuccess) {
              yield put({
                type:"showProcess"
              });
                message.info('添加房源信息成功');
                payload['id'] = reObj['id'];
                // 关闭
                yield put({
                  type:"hideProcess"
                });
                houseBaseInfo = Object.assign({}, houseBaseInfo,{...payload});
                // 保存房源信息
                yield put({
                    type:"setState",
                    payload:{
                        houseBaseInfo:houseBaseInfo,
                    }
                });
                // houseImgsRent   houseImgs
                yield put (routerRedux.push({
                    pathname:'/houseResourceRentManagement/shopsRent/createShopsRentResource/shopsImgsRent',
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
          }else{
            message.error("此房源已发布过，不能重复发布此房源！",3)
          }
      },

      *initUpdate({payload},{call,put,select}){
          yield put({
            type:"showProcess"
          });
          const params = {};
          params['id'] = payload.dataId;
          params.apiName = commonFinalCode.getHouseBasseInfoApiName;
          params.isCurrentUser = "是";
          const responseObj = yield call(requestApi, params);
          var reObj = analysisUtil.analysisDataResponse(responseObj);
          if(reObj.isSuccess) {
              // 区域信息
              let _area = reObj['area'];
              if (_area != null && _area.length > 0) {
                  reObj['areaArray'] = _area.split('/');
              }
              // 特色
              const _characteristics = reObj['characteristics'];
              if (_characteristics != null && _characteristics.length > 0) {
                  reObj['characteristicsArray'] = JSON.parse(_characteristics);
              }

              // 商铺_类型   上主下商、
              const _shopType = reObj['shopType'].split();
              if (_shopType != null && _shopType.length > 0) {
                  reObj['shopTypeArray'] = _shopType;
              }
              // 铺面_类型   上主下商、
              const _shopOfficeType = reObj['shopOfficeType'].split();
              if (_shopOfficeType != null && _shopOfficeType.length > 0) {
                  reObj['shopOfficeTypeArray'] = _shopOfficeType;
              }

              // 可经营范围
              const _businessCategory = reObj['businessCategory'];
              if (_businessCategory != null && _businessCategory.length > 0) {
                  reObj['businessCategoryArray'] = JSON.parse(_businessCategory);
              }

              reObj['isUpdate'] = true;
              yield put({
                type:"setState",
                payload:{
                    houseBaseInfo:reObj,
                }
              });
              yield put({
                type:"setState",
                payload:{
                    areaName:reObj['areaName'],
                }
              });
              yield put({
                type:"hideProcess"
              });
          }else{
              yield put({
                type:'showPrompt',
                payload:{
                  title:'失败!',
                  description:`${reObj.msg}`
              }});
          }
      }

      //-----------------------------------effects end

  },
  subscriptions:{
    setup({ dispatch, history }) {
         history.listen(location =>{
           if (location.pathname === '/houseResourceRentManagement/shopsRent/createShopsRentResource/shopsResourceInfosRent') {

              // ---- start
               dispatch({
                 type: 'initState',
               });
               dispatch({
                 type:"saveAreaData",
                 payload:{
                   eopOptions:location.state.eopOptions
                 }
               })
               dispatch({
                 type: 'initData',
               });

               let _houseBaseInfo = {};
               if (location.state) {
                 // 传入数据
                 const _state = location.state;
                  _houseBaseInfo = _state.houseBaseInfo;
                  if (_houseBaseInfo) {
                    dispatch({
                      type: "initUpdate",
                      payload:{
                        dataId:_houseBaseInfo.id,
                      }
                    })
                  }else {
                      const {isUpdate} = _state;
                      if (isUpdate) {
                          const {dataId} = _state;
                          dispatch({
                            type: "initUpdate",
                            payload:{
                              dataId:dataId,
                            }
                          })
                      }
                  }
               }               //  -----end

           }
         });
       },
  }
}
