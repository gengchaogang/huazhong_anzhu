import { requestApi } from '../../services/common'

import { message } from 'antd'
import analysisUtil from '../../../commons/utils/commonApiResponseAnalysis.js';
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../commons/utils/commonUtil.js';
import labelsFinalCode from '../../../commons/utils/labelsFinalCode.js';
import lodash from 'lodash';
import managePage from '../../routes/customerManage/managePage';

let interval = null;
const initState = {
    currentTab: "followCustomerTab",
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
    followUpList: {
        pageNo: 1,
        total: 0,
        pageSize: commonFinalCode.pageSize,
        content: [

        ],
    },
    guideList: {
        pageNo: 1,
        total: 0,
        pageSize: commonFinalCode.pageSize,
        content: [

        ],
    },
    bringModal: {
        visible: false,
        required: false,
    },
    followModal: {
        visible: false,
        required: false,
    },
    record: null,//客户信息
    isBroker: null,
};

export default {
    namespace: "managePage",
    state: initState,
    reducers: {
        setState(state, action) {
            return { ...state, ...action.payload }
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
    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/customerManage/managePage') {
                    interval = setInterval(() => {  //每秒去获取用户信息 获取之后清空定时器
                        dispatch({
                            type: "getIsBroker"
                        })
                    }, 1000);
                    dispatch({
                        type: "initData",
                        payload: location.state.record
                    })
                    dispatch({
                        type: "getIsBroker"
                    })
                }
            })
        }
    },
    effects: {
        *initData({ payload }, { put, call, select }) {
            yield put({
                type: "showProcess"
            })
            yield put({
                type: "setState",
                payload: {
                    record: payload
                }
            })
            yield put({
                type: "loadList",
                payload: {
                    id: payload.id,
                    type: "跟进",
                    currentTab: "followCustomerTab",
                }
            })
        },
        //加载数据的公用方法
        *loadList({ payload }, { put, call, select }) {
            const currentState = yield select(({ managePage }) => managePage);
            const pageSize = commonFinalCode.pageSize;
            const customerId = payload.id;
            let type;
            const pageNo = payload.pageNo || 0;
            if (payload.currentTab === "followCustomerTab") {
                type = "跟进";
            } else if (payload.currentTab === "bringCustomerTab") {
                type = "带看";
            } else {
                return;
            }
            yield put({
                type: "findAllFollowUpProcess",
                payload: {
                    pageNo,
                    pageSize,
                    type,
                    customerId,
                    startTime: currentState.startTime,
                    endTime: currentState.endTime,
                    keyword: currentState.keyword,
                }
            })
        },
        //根据客户ID和type  查询跟进或带看miss-anzhu-broker/followUp/findAllFollowUpProcess
        *findAllFollowUpProcess({ payload }, { put, call, select }) {
            yield put({
                type: "showProcess",
            })
            const responseObj = yield call(requestApi, {
                apiName: "/miss-anzhu-broker/followUp/findAllFollowUpProcess",
                ...payload
            });
            const reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
            if (reObj.isSuccess) {
                if (payload.type === "跟进") {
                    yield put({
                        type: 'saveResultData',
                        payload: {
                            followUpList: reObj
                        }
                    })
                } else {
                    yield put({
                        type: 'saveResultData',
                        payload: {
                            guideList: reObj
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
        //添加跟进miss-anzhu-broker/followUp/addFollowProcess
        *addFollowProcess({ payload }, { put, call, select }) {
            yield put({
                type: 'setState',
                payload: {
                    followModal: {
                        visible: false,
                        required: false
                    },
                    bringModal: {
                        visible: false,
                        required: false
                    }
                }
            });
            yield put({
                type: "showProcess",
            })
            const currentState = yield select(({ managePage }) => { return managePage });
            const responseObj = yield call(requestApi, {
                apiName: "/miss-anzhu-broker/followUp/addFollowProcessForPC",
                ...payload
            });
            yield put({
                type: 'hideProcess'
            })
            if (responseObj.data.data.result === true) {
                if (currentState.currentTab === "followCustomerTab") {
                    yield put({
                        type: 'loadList',
                        payload: {
                            currentTab: "followCustomerTab",
                            pageSize: commonFinalCode.pageSize,
                            pageNo: 0,
                            type: "跟进",
                            id: currentState.record.id,
                            startTime: null,
                            endTime: null
                        }
                    });
                } else if (currentState.currentTab === "bringCustomerTab") {
                    yield put({
                        type: 'loadList',
                        payload: {
                            currentTab: "bringCustomerTab",
                            pageSize: commonFinalCode.pageSize,
                            pageNo: 0,
                            type: "带看",
                            id: currentState.record.id,
                            startTime: null,
                            endTime: null
                        }
                    });
                }
            } else if (responseObj.data.data.result === false) {
                yield put({
                    type: 'addFollowProcess',
                    payload
                });
            }
        },
        //查看是否是经纪人角色
        *getIsBroker({ payload }, { put, call, select }) {
            const isBroker = yield select(({ main }) => { return main.isBroker });
            if (isBroker) {
                clearInterval(interval)
                yield put({
                    type: "setState",
                    payload: { isBroker: isBroker }
                })
            } else if (isBroker === false) {
                clearInterval(interval)
                yield put({
                    type: "setState",
                    payload: { isBroker: isBroker }
                })
            }

        },
    }

}