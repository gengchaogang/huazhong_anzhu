import { requestApi } from '../../services/common'

import { message } from 'antd'
import analysisUtil from '../../../commons/utils/commonApiResponseAnalysis.js';
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../commons/utils/commonUtil.js';
import labelsFinalCode from '../../../commons/utils/labelsFinalCode.js';
import lodash from 'lodash';


const typeGroups = [
    {
        "areaPath": "",
        "typeName": labelsFinalCode.labelSecondHouseFyhx,    // 房源户型
    },
    {
        "areaPath": "",
        "typeName": labelsFinalCode.labelSecondHouseFyjs,    // 户型居室
    },
];

const initState = {
    isFollowed: false,//记录跟进情况,除非刷新页面或跳转,否则只能跟进一次
    promptObj: {
        visible: false,
        description: '',
        title: '',
        promptFor: 'default',
        okText: '确定',
        type: '',
        todo: '',
    },
    loadingShadow: false,
    eopOptions: [],
    pwd: "关键字",
    dateRange: null,
    houseFollowModal: {
        visible: false,
    },
    followSuccessModal: {
        visible: false
    },
    currentTab: "houseDetailInfo",
    previewVisible: false,
    previewImage: '',
    characteristics: '',
    fileList: [],
    keyUserInfo: {},
    addUserInfo: {},
    addUserName: "",
    entryUserName: "",
    keyHasBroker: "",
    yezhu: {//业主信息存储
        ownerPhone: ""
    },
    createDate: "",
    yaoshifang: true,
    communityName: "",
    address: "",
    areaName: "",
    totalFloors: "",
    storey: "",
    buildingAge: "",
    heatingType: "",
    houseStructure: "",
    elevator: "",
    decoration: "",
    supportMortgage: "",
    orientations: "",
    coreSellingPoint: "",
    outFiles: [],
    outFilesList: [],
    showPicList: [],
    followUpList: {//跟进列表页码信息
        pageNo: 1,
        total: 0,
        pageSize: commonFinalCode.pageSize,
        content: [],
    },
    houseLogList: {//房源日志页码
        pageNo: 1,
        total: 0,
        pageSize: commonFinalCode.pageSize,
        content: [],
    },
    brokerModal: {
        visible: false
    },
    brokerModalData: {
        toutorTeamOut: {

        }
    }
}
export default {
    namespace: 'allHouseResourceDetail',
    state: initState,
    reducers: { //action
        saveResultData(state, action) {
            return { ...state, ...action.payload }
        },
        setState(state, action) {
            return { ...state, ...action.payload }
        },
        initState(state, action) {
            return { ...state, ...initState }
        },
        showProcess(state, action) {
            return { ...state, loadingShadow: true }
        },
        hideProcess(state, action) {
            return { ...state, loadingShadow: false }
        },
        showPrompt(state, action) {
            return {
                ...state, loadingShadow: false,
                promptObj: Object.assign({}, state.promptObj, { ...{ type: "error", title: "", visible: true, todo: "closeModal" } },
                    { ...action.payload })
            }
        },
        togglePrompt(state, action) {
            return { ...state, promptObj: Object.assign({}, state.promptObj, { ...action.payload }) }
        },
        changeVisible(state, action) {
            return { ...state, ...action.payload }
        },
        saveResultData(state, action) {
            return { ...state, loadingShadow: false, ...action.payload }
        },
        removeList(state, action) {
            return { ...state, showPicList: [] }
        },
        upload(state, action) {
            return { ...state, ...action.payload }
        }
    },
    subscriptions: {     //路由监听
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/allHouse/allHouseResourceDetail') {
                    dispatch({
                        type: "setState",
                        payload: {
                            id: location.state.id
                        }
                    });
                    dispatch({
                        type: 'initState',
                    });
                    dispatch({
                        type: 'initData',
                    });
                }
            })
        }
    },
    effects: {
        *initData({ payload }, { put, call }) {
            yield put({
                type: "initState"
            });
            // 根据ID加载当前房源信息
            yield put({
                type: "getCurrentDetail"
            })
            //根据ID加载业主信息
            yield put({
                type: "findOwnerOne"
            })
            //根据ID加载图片列表信息
            yield put({
                type: "findOutFiles"
            })
            yield put({
                type: 'findFollowUpList',
                payload: {
                    pageSize: commonFinalCode.pageSize,
                    pageNo: 0,
                }
            });
            yield put({
                type: 'findHouseLogList',
                payload: {
                    pageSize: commonFinalCode.pageSize,
                    pageNo: 0,
                }
            });
        },
        // 加载当前房源详情信息
        *getCurrentDetail({ payload }, { put, call, select }) {
            yield put({
                type: "showProcess"
            })
            const currentState = yield select(({ allHouseResourceDetail }) => allHouseResourceDetail);
            const responseObj = yield call(requestApi, {
                apiName: "miss-anzhu-secdhouse-resource/main/findOneHouseBaseInfo",
                id: currentState.id
            });
            var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
            if (reObj.isSuccess) {
                yield put({
                    type: "saveResultData",
                    payload: reObj
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
        *findOwnerOne({ payload }, { put, call, select }) { //根据房源ID查询业主信息
            yield put({
                type: "showProcess"
            })
            //miss-anzhu-secdhouse-resource/houseOwner/findMyHousingResourcesOwnerOne
            const currentState = yield select(({ allHouseResourceDetail }) => allHouseResourceDetail);
            const responseObj = yield call(requestApi, {
                apiName: "miss-anzhu-secdhouse-resource/houseOwner/findMyHousingResourcesOwnerOne",
                id: currentState.id
            });
            var reObj = analysisUtil.analysisDataResponse(responseObj);
            console.log("yezhu", reObj);
            if (reObj.isSuccess) {
                yield put({
                    type: "saveResultData",
                    payload: {
                        yezhu: reObj
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
        *findOutFiles({ payload }, { put, call, select }) {//根据房源图片查询所有实勘图
            yield put({
                type: "showProcess"
            });
            //miss-anzhu-secdhouse-resource/main/findRealPictureList
            const currentState = yield select(({ allHouseResourceDetail }) => allHouseResourceDetail);
            const responseObj = yield call(requestApi, {
                apiName: "miss-anzhu-secdhouse-resource/main/findRealPictureList",
                id: currentState.id
            });
            var reObj = analysisUtil.analysisDataResponse(responseObj);
            if (reObj.isSuccess) {
                yield put({
                    type: "saveResultData",
                    payload: {
                        outFilesList: reObj.content
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
            yield put({
                type: 'removeList'
            })
        },
        *saveUpLoadPic({ payload }, { put, call, select }) {
            yield put({
                type: "showProcess"
            })
            const currentState = yield select(({ allHouseResourceDetail }) => allHouseResourceDetail);
            var { id } = currentState;
            const { showPicList } = currentState;
            const showPicListUpload = [];
            if (showPicList.length) {
                showPicList.map(item => {
                    if (item.src.indexOf('?') === -1) {
                        showPicListUpload.push({
                            id: item.id,
                            isCover: item.isCover,
                            name: item.name,
                            path: item.src,
                        })
                    } else {
                        showPicListUpload.push({
                            id: item.id,
                            isCover: item.isCover,
                            name: item.name,
                            path: item.src
                        })
                    }
                })
            }//组装房源图片数据

            const addImagsObj = {};
            addImagsObj.id = id;
            addImagsObj.resourcesNumber = currentState.resourcesNumber;
            addImagsObj.pictures = showPicListUpload;
            addImagsObj.updateAllFile = '否';
            // 上传房源图片文件
            addImagsObj.apiName = "/miss-anzhu-secdhouse-resource/main/addRealPicture";
            const responseObj = yield call(requestApi, { ...addImagsObj });
            var reObj = analysisUtil.analysisDataResponse(responseObj);
            yield put({
                type: "hideProcess"
            })
            if (reObj.isSuccess) {
                // 根据ID加载当前房源信息
                yield put({
                    type: "getCurrentDetail"
                })
                //根据ID加载图片列表信息
                yield put({
                    type: "findOutFiles"
                })
                yield put({
                    type: 'findHouseLogList',
                    payload: {
                        pageSize: commonFinalCode.pageSize,
                        pageNo: 0,
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
        *findFollowUpList({ payload }, { put, call, select }) {//获取房源跟进列表 miss-anzhu-secdhouse-resource/main/findHousingFollowUp
            yield put({
                type: "showProcess"
            });
            const currentState = yield select(({ allHouseResourceDetail }) => allHouseResourceDetail);
            const responseObj = yield call(requestApi, {
                apiName: "miss-anzhu-secdhouse-resource/main/findHousingFollowUp",
                housingId: currentState.id,
                ...payload
            });
            const reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
            console.log(reObj, "reObj");
            if (reObj.isSuccess) {
                yield put({
                    type: "saveResultData",
                    payload: {
                        followUpList: reObj
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
        *findHouseLogList({ payload }, { put, call, select }) {//获取修改日志
            yield put({
                type: "showProcess"
            });
            const currentState = yield select(({ allHouseResourceDetail }) => allHouseResourceDetail);
            const responseObj = yield call(requestApi, {
                apiName: "miss-anzhu-secdhouse-resource/logs/findHouseLogAll",
                houseId: currentState.id,
                ...payload
            });
            var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
            console.log(reObj, "reObj");
            if (reObj.isSuccess) {
                yield put({
                    type: "saveResultData",
                    payload: {
                        houseLogList: reObj
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
        //根据钥匙人Id 获取经纪人详情  
        *findOneBrief({ payload }, { put, call }) {
            yield put({
                type: "showProcess"
            });
            const responseObj = yield call(requestApi, {
                apiName: "/miss-anzhu-broker/brokers/findOneBrief",
                id: payload.id
            });
            var reObj = analysisUtil.analysisDataResponse(responseObj);
            yield put({
                type: "hideProcess"
            });
            if (reObj.isSuccess) {
                yield put({
                    type: "setState",
                    payload: {
                        brokerModal: {
                            visible: true
                        }
                    }
                })
                yield put({
                    type: 'saveResultData',
                    payload: {
                        brokerModalData: reObj
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
        *followUp({ payload }, { put, call, select }) {
            yield put({
                type: "showProcess"
            });
            const responseObj = yield call(requestApi, {
                apiName: "/miss-anzhu-secdhouse-resource/main/addHousingFollowUp",
                ...payload
            });
            var reObj = analysisUtil.analysisDataResponse(responseObj);
            yield put({
                type: "hideProcess"
            });
            console.log("followUp", reObj);
            if (reObj.isSuccess) {
                yield put({
                    type: "setState",
                    payload: {
                        houseFollowModal: {
                            visible: false,
                        },
                        followSuccessModal: {
                            visible: true,
                        },
                        isFollowed: true
                    }
                })
                yield put({
                    type: 'findFollowUpList',
                    payload: {
                        pageSize: commonFinalCode.pageSize,
                        pageNo: 0,
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
        }
    }
}