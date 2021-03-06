import { routerRedux } from 'dva/router';
import { message } from 'antd'
import { requestApi }
  from '../../../services/common'

import analysisUtil from '../../../../commons/utils/commonApiResponseAnalysis.js';
import commonFinalCode from '../../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../../commons/utils/commonUtil.js';
import labelsFinalCode from '../../../../commons/utils/labelsFinalCode.js';

/***************************************************************/
/**************************************************************/
/**********  二手房出售：房源基本信息 ***************************/
/*************************************************************/
/*************************************************************/

// 加载标签信息
const typeGroups = [
  {
    "areaPath": "",
    "typeName": labelsFinalCode.labelSecondHouseFyts,  // 特色
  },
  {
    "areaPath": "",
    "typeName": labelsFinalCode.labelSecondHouseFyhx,  // 户型
  },
  {
    "areaPath": "",
    "typeName": labelsFinalCode.labelZxqk,  // 装修情况
  },
  {
    "areaPath": "",
    "typeName": labelsFinalCode.labelFwcx,  // 房源朝向
  },
  {
    "areaPath": "",
    "typeName": labelsFinalCode.labelHxjg,  // 户型结构
  },
  {
    "areaPath": "",
    "typeName": labelsFinalCode.labelJzlx,  // 建筑类型
  },
  {
    "areaPath": "",
    "typeName": labelsFinalCode.labelGnfs,  // 供暖方式
  },

];

const initState = {
  buildingId: "",
  communityId: "",
  houseNumberId: "",
  houseUnique: true,
  isAreaSelected: true,
  isBuilded: true,
  isCommunitied: true,
  currentArea: null,
  currentCommunity: null,
  currentBuilding: null,
  tagsValue: [],
  communityData: [],
  buildingsData: [],
  roomsData: [],
  tableLoading: false,
  loadingShadow: false,
  eopOptions: [],
  areaName: "",
  labels: {},            // 标签信息
  houseFyhxOptions: [],  // 二手房房源户型
  houseBaseInfo: {       // 房源默认信息
    resourcesType: commonFinalCode.senondHouseResourcesType_zz,   // 住宅
    saleWay: commonFinalCode.senondHouseSaleWay_cs,               // 出售
    decoration: "简装修",
    mortgage: "无抵押",
    supportMortgage: "支持",
  },
  loadingShadow: false,
  promptObj: {
    visible: false,
    description: '',
    title: '',
    promptFor: 'default',
    okText: '确定',
    type: '',
    todo: '',
  },
  checkBoxFlag: false,
  userTypes: false,
  selectKey: null,
  guishuren: null,
}


export default {
  namespace: 'houseResourceInfos',
  state: initState,
  reducers: {
    changeDisabled(state, action) {
      return { ...state, ...action.payload }
    },
    changeTagsValue(state, action) {
      return { ...state, ...action.payload }
    },
    saveAreaData(state, action) {
      return { ...state, ...action.payload }
    },
    saveHouseUnique(state, action) {
      return { ...state, ...action.payload }
    },
    saveRoomsData(state, action) {
      return { ...state, ...action.payload }
    },
    setState(state, { payload }) {
      return { ...state, ...payload };
    },
    initState(state, { payload }) {
      return { ...state, ...initState };
    },
    saveResultData(state, action) {
      return { ...state, tableLoading: false, loadingShadow: false, ...action.payload }
    },
    showProcess(state, action) {
      return { ...state, loadingShadow: true };
    },
    hideProcess(state, action) {
      return { ...state, loadingShadow: false };
    },
    showPrompt(state, action) {
      return {
        ...state, tableLoading: false, loadingShadow: false,
        promptObj: Object.assign({}, state.promptObj, { ...{ type: "error", title: "", visible: true, todo: "closeModal" } },
          { ...action.payload })
      }
    },
    togglePrompt(state, action) {
      return { ...state, promptObj: Object.assign({}, state.promptObj, { ...action.payload }) }
    },
  },
  effects: {
    *initData({ payload }, { call, put, select }) {
      yield put({
        type: "showProcess"
      });
      // 加载所在区域信息
      yield put({
        type: "getEopOptions"
      })
      // 查询标签
      const params = { groups: typeGroups };
      params.apiName = commonFinalCode.findGroupApiName;
      const responseObj = yield call(requestApi, params);
      var reObj = analysisUtil.analysisDataResponse(responseObj);
      if (reObj.isSuccess) {
        const labels = commonUtil.ansyslabelsData(reObj.content);
        yield put({
          type: 'saveResultData',
          payload: {
            labels: labels
          }
        });

        const houseFyhxOptions = labels[labelsFinalCode.labelSecondHouseFyhx];
        if (houseFyhxOptions) {
          yield put({
            type: 'saveResultData',
            payload: {
              houseFyhxOptions: houseFyhxOptions,
            }
          });
        }
        yield put({
          type: "hideProcess"
        });
      } else {
        yield put({
          type: 'showPrompt',
          payload: {
            description: `${reObj.msg}`
          }
        });
      }
    },

    /**********获取行政区划信息**********/
    *getEopOptions({ payload }, { call, put }) {
      const responseObj = yield call(requestApi, {
        apiName: "/miss-anzhu-operation/service-regions/findAllProvinces",
      });
      var reObj = analysisUtil.analysisDataResponse(responseObj);
      if (reObj.isSuccess) {
        const eopData = commonUtil.createEopData(reObj.content);
        yield put({
          type: 'saveResultData',
          payload: {
            eopOptions: eopData
          }
        });
      } else {
        yield put({
          type: 'showPrompt',
          payload: {
            description: `${reObj.msg}`
          }
        });
      }
    },
    *getCasOpt({ payload }, { call, put, select }) {
      const responseObj = yield call(requestApi, {
        apiName: "/miss-anzhu-tutor/tutors/broker/findTeamAndBroker",
      });
      const isBroker = yield select(({ main }) => main.isBroker);
      const selectKey = yield select(({ houseResourceInfos }) => houseResourceInfos.selectKey);

      const { data } = responseObj

      yield put({
        type: 'saveResultData',
        payload: {
          optionss: data.data,
          userTypes: isBroker
        }
      });

    },
    *getCasOpts({ payload }, { call, put, select }) {
      const responseObj = yield call(requestApi, {
        apiName: "/miss-anzhu-tutor/tutors/broker/findTeamAndBroker",
      });
      const isBroker = yield select(({ main }) => main.isBroker);


      const { data } = responseObj


      yield put({
        type: 'saveResultData',
        payload: {
          optionss: data.data,
          userTypes: isBroker
        }
      });

    },

    /*****级联菜单选择旗下小区******/

    *searchCommunities({ payload }, { call, put, select }) {
      const responseObj = yield call(requestApi, {
        apiName: "/miss-anzhu-community/communities/findByAraeName",
        ...payload
      });
      var reObj = analysisUtil.analysisDataResponse(responseObj);
      if (reObj.isSuccess) {
        const resultData = [];
        reObj.content.map(item => {
          resultData.push({
            key: item.id,
            name: item.name,
            id: item.id,
          })
        })
        yield put({
          type: "saveResultData",
          payload: {
            communityData: resultData
          }
        })
      } else {
        yield put({
          type: 'showPrompt',
          payload: {
            description: `${reObj.msg}`
          }
        });
      }
    },
    *getBuildingsData({ payload }, { call, put, select }) {
      const responseObj = yield call(requestApi, {
        apiName: "/miss-anzhu-community/buildings/findByCommunityId",
        ...payload
      });
      var reObj = analysisUtil.analysisDataResponse(responseObj);
      if (reObj.isSuccess) {
        const resultData = [];
        reObj.content.map(item => {
          resultData.push({
            key: item.id,
            name: item.name,
            id: item.id,
          })
        })
        yield put({
          type: "saveResultData",
          payload: {
            buildingsData: resultData
          }
        })
      } else {
        yield put({
          type: 'showPrompt',
          payload: {
            description: `${reObj.msg}`
          }
        });
      }
    },
    *getRoomsData({ payload }, { call, put, select }) {
      const responseObj = yield call(requestApi, {
        apiName: "/miss-anzhu-community/rooms/findRooms",
        ...payload
      });
      var reObj = analysisUtil.analysisDataResponse(responseObj);
      if (reObj.isSuccess) {
        var rooms = [];
        reObj.content.forEach((floor, index) => {
          floor.rooms.forEach((room, i) => {
            room && rooms.push({
              floor: floor,
              ...room,
              houseNumberId: room.id,
              houseNumber: room.roomCode
            });
          })
        });
        rooms.sort((room1, room2) => (room1.roomNo - room2.roomNo));
        yield put({
          type: "saveRoomsData",
          payload: {
            roomsData: rooms
          }
        })
      } else {
        yield put({
          type: 'showPrompt',
          payload: {
            description: `${reObj.msg}`
          }
        });
      }
    },
    *checkBox({ payload }, { call, put }) {
      yield put({
        type: 'setState',
        payload: {
          checkBoxFlag: payload.checkBoxFlag
        }
      });

    },
    *checkHouseUnique({ payload }, { call, put }) {
      const responseObj = yield call(requestApi, {
        apiName: "/miss-anzhu-secdhouse-resource/main/checkHouse",
        ...payload
      });
      var reObj = analysisUtil.analysisDataResponse(responseObj);
      if (reObj.isSuccess) {
        if (reObj.id === null) {
          return
        } else {
          message.error(`此房源已经在${reObj.resourcesType}${reObj.saleWay}中发布过，不能重复发布此房源！`, 5);
          yield put({
            type: "saveHouseUnique",
            payload: {
              houseUnique: false
            }
          })
        }
      } else {
        yield put({
          type: 'showPrompt',
          payload: {
            description: `${reObj.msg}`
          }
        });
      }
    },
    /** 提交数据 */
    *submitData({ payload }, { call, put, select }) {
      var { houseUnique } = yield select(({ houseResourceInfos }) => houseResourceInfos);

      var areaStr = "";
      if (payload['area']) {
        const area = payload['area'];
        areaStr = area.join('/');
        payload['area'] = areaStr;
        const { areaName } = yield select(({ houseResourceInfos }) => houseResourceInfos);
        payload['areaName'] = areaName;
      }

      // 房源特色
      if (payload['characteristics']) {
        payload['characteristics'] = JSON.stringify(payload['characteristics']);
      }
      // 默认添加
      let paiName = "/miss-anzhu-secdhouse-resource/resource/addHouseSell";
      var { houseBaseInfo } = yield select(({ houseResourceInfos }) => houseResourceInfos);
      if (houseBaseInfo != null && houseBaseInfo['id']) {
        // 编辑
        paiName = "/miss-anzhu-secdhouse-resource/resource/updateHouseSell";
        payload['id'] = houseBaseInfo['id'];
      }
      payload.apiName = paiName;
      payload.resourcesType = houseBaseInfo['resourcesType'];
      payload.saleWay = houseBaseInfo['saleWay'];
      payload.houseRoom = parseInt(payload.houseRoom);
      payload.livingRoom = parseInt(payload.livingRoom);
      payload.cookRoom = parseInt(payload.cookRoom);
      payload.bathRoom = parseInt(payload.bathRoom);
      if (houseUnique) {
        yield put({
          type: "showProcess"
        });
        const responseObj = yield call(requestApi, { ...payload });
        var reObj = analysisUtil.analysisDataResponse(responseObj);
        if (reObj.isSuccess) {
          message.info('添加房源信息成功');
          payload['id'] = reObj['id'];
          // 关闭
          yield put({
            type: "hideProcess"
          });
          houseBaseInfo = Object.assign({}, houseBaseInfo, { ...payload });
          yield put({
            type: "setState",
            payload: {
              houseBaseInfo: houseBaseInfo,
            }
          });

          yield put(routerRedux.push({
            pathname: '/houseResourceSaleManagement/secondHandHouseSell/createSecondHandSellResource/houseImgs',
            state: { //这里传入projectId 跳转到下一个页面时监听路由把值存在state中
              houseBaseInfo: houseBaseInfo,
            }
          }))
        } else {
          yield put({
            type: 'showPrompt',
            payload: {
              title: '失败!',
              description: `${reObj.msg}`
            }
          });
        }
      } else {
        message.error("此房源已发布过，不能重复发布此房源！", 3)
      }
    },

    *initUpdate({ payload }, { call, put, select }) {
      yield put({
        type: "showProcess"
      });
      const params = {};
      params['id'] = payload.dataId;
      params.apiName = commonFinalCode.getHouseBasseInfoApiName;
      params.isCurrentUser = "是";
      const responseObj = yield call(requestApi, params);
      var reObj = analysisUtil.analysisDataResponse(responseObj);



      if (reObj.isSuccess) {
        let _area = reObj['area'];
        if (_area != null && _area.length > 0) {
          reObj['areaArray'] = _area.split('/');
        }
        if (reObj.selectKey.length == 2) {
          yield put({
            type: "setState",
            payload: {
              checkBoxFlag: true,
            }
          });
        }
        const _characteristics = reObj['characteristics'];
        if (_characteristics != null && _characteristics.length > 0) {
          reObj['characteristicsArray'] = JSON.parse(_characteristics);
        }
        reObj['isUpdate'] = true;
        yield put({
          type: "setState",
          payload: {
            houseBaseInfo: reObj,
          }
        });
        yield put({
          type: "setState",
          payload: {
            areaName: reObj['areaName'],
          }
        });
        yield put({
          type: "hideProcess"
        });
      } else {
        yield put({
          type: 'showPrompt',
          payload: {
            title: '失败!',
            description: `${reObj.msg}`
          }
        });
      }
    }

    //-----------------------------effects  end
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/houseResourceSaleManagement/secondHandHouseSell/createSecondHandSellResource/houseResourceInfos') {
          // 初始 state 数据
          dispatch({
            type: 'initState',
          });
          dispatch({
            type: "saveAreaData",
            payload: {
              eopOptions: location.state.eopOptions
            }
          })
          // 加载区域和标签等信息
          dispatch({
            type: 'initData',
          });
          dispatch({
            type: "getCasOpt",
          });
          dispatch({
            type: "getCasOpts",
          });

          let _houseBaseInfo = {};
          if (location.state) {
            // 传入数据
            const _state = location.state;
            _houseBaseInfo = _state.houseBaseInfo;
            if (_houseBaseInfo) {
              dispatch({
                type: "initUpdate",
                payload: {
                  dataId: _houseBaseInfo.id,
                }
              })
            } else {
              const { isUpdate } = _state;
              if (isUpdate) {
                const { dataId } = _state;
                dispatch({
                  type: "initUpdate",
                  payload: {
                    dataId: dataId,
                  }
                })
              }
            }
          }             //  -----end

        }
      });
    },
  }
}
