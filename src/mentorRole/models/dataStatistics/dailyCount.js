import { requestApi } from '../../services/common'

import { message } from 'antd'
import analysisUtil from '../../../commons/utils/commonApiResponseAnalysis.js';
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../commons/utils/commonUtil.js';
import labelsFinalCode from '../../../commons/utils/labelsFinalCode.js';
import lodash from 'lodash';
import dailyCount from '../../routes/dataStatistics/dailyCount';


const initState = {
    activeKey: 'pageResources',
    promptObj: {
        visible: false,
        description: '',
        title: '',
        promptFor: 'default',
        okText: '确定',
        type: '',
        todo: '',
    },//对话框参数
    modalConfig: {
        visible: false,
    },
    pageListResources: {//资源数据
        pageNo: 1,
        total: 0,
        pageSize: 10,
        content: [],
    },
    pageListDeal: {//成交数据
        pageNo: 1,
        total: 0,
        pageSize: 10,
        content: [],
    },
    pageListBeltLook: {//带看数据
        pageNo: 1,
        total: 0,
        pageSize: 10,
        content: [],
    },
    pageListFollowUp: {//跟进数据
        pageNo: 1,
        total: 0,
        pageSize: 10,
        content: [],
    },
    loadingShadow: false,
    startTime: null,
    endTime: null,
}
export default {
    namespace: "dailyCount",
    state: initState,
    reducers: { //action
        initState(state, action) {
            return { ...state, ...initState }
        },
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
    subscriptions: {     //路由监听
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/dataStatistics/dailyCount') {
                    dispatch({
                        type: 'initState'
                    })
                    dispatch({
                        type: 'showProcess'
                    })
                    dispatch({
                        type: 'pageResources',
                        payload: {
                            startTime: null,
                            endTime: null,
                            teamName: null
                        }
                    })
                }
            })
        }
    },
    effects: {
        *loadList({ payload }, { put, call, select }) {
            yield put({
                type: "showProcess"
            })
            yield put({
                type: 'setState',
                payload: {
                    pageListResources: {//资源数据
                        pageNo: 1,
                        total: 0,
                        pageSize: 10,
                        content: [],
                    },
                    pageListDeal: {//成交数据
                        pageNo: 1,
                        total: 0,
                        pageSize: 10,
                        content: [],
                    },
                    pageListBeltLook: {//带看数据
                        pageNo: 1,
                        total: 0,
                        pageSize: 10,
                        content: [],
                    },
                    pageListFollowUp: {//跟进数据
                        pageNo: 1,
                        total: 0,
                        pageSize: 10,
                        content: [],
                    },
                }
            })
            yield put({
                type: `${payload.keyWord}`,
                payload: payload
            })
        },
        *pageResources({ payload }, { put, call, select }) {
            const responseObj = yield call(requestApi, {
                apiName: '/miss-anzhu-statistics/teamStatistic/teamStatisticList',
                keyWord: 'resources',
                startTime: payload.startTime,
                endTime: payload.endTime,
                pageNo: 0,
                pageSize: 10,
                teamName: payload.teamName,
            })
            const resObj = analysisUtil.analysisGetPageDataResponse(responseObj);
            if (resObj.isSuccess) {
                yield put({
                    type: 'setState',
                    payload: {
                        pageListResources: resObj
                    }
                });
                yield put({
                    type: "hideProcess"
                });
            } else {
                yield put({
                    type: 'showPrompt',
                    payload: {
                        description: `${resObj.msg}`
                    }
                });
            }
        },
        *pageDeal({ payload }, { put, call, select }) {
            const responseObj = yield call(requestApi, {
                apiName: '/miss-anzhu-statistics/teamStatistic/teamStatisticList',
                keyWord: 'transaction',
                startTime: payload.startTime,
                endTime: payload.endTime,
                pageNo: 0,
                pageSize: 10,
                teamName: payload.teamName,
            })
            const resObj = analysisUtil.analysisGetPageDataResponse(responseObj);
            if (resObj.isSuccess) {
                yield put({
                    type: 'setState',
                    payload: {
                        pageListDeal: resObj
                    }
                });
                yield put({
                    type: "hideProcess"
                });
            } else {
                yield put({
                    type: 'showPrompt',
                    payload: {
                        description: `${resObj.msg}`
                    }
                });
            }
        },
        *pageBeltLook({ payload }, { put, call, select }) {
            const responseObj = yield call(requestApi, {
                apiName: '/miss-anzhu-statistics/teamStatistic/teamStatisticList',
                keyWord: 'beltLook',
                startTime: payload.startTime,
                endTime: payload.endTime,
                pageNo: 0,
                pageSize: 10,
                teamName: payload.teamName,
            })
            const resObj = analysisUtil.analysisGetPageDataResponse(responseObj);
            if (resObj.isSuccess) {
                yield put({
                    type: 'setState',
                    payload: {
                        pageListBeltLook: resObj
                    }
                });
                yield put({
                    type: "hideProcess"
                });
            } else {
                yield put({
                    type: 'showPrompt',
                    payload: {
                        description: `${resObj.msg}`
                    }
                });
            }
        },
        *pageFollowUp({ payload }, { put, call, select }) {
            const responseObj = yield call(requestApi, {
                apiName: '/miss-anzhu-statistics/teamStatistic/teamStatisticList',
                keyWord: 'followUp',
                startTime: payload.startTime,
                endTime: payload.endTime,
                pageNo: 0,
                pageSize: 10,
                teamName: payload.teamName,
            })
            const resObj = analysisUtil.analysisGetPageDataResponse(responseObj);
            if (resObj.isSuccess) {
                yield put({
                    type: 'setState',
                    payload: {
                        pageListFollowUp: resObj
                    }
                });
                yield put({
                    type: "hideProcess"
                });
            } else {
                yield put({
                    type: 'showPrompt',
                    payload: {
                        description: `${resObj.msg}`
                    }
                });
            }
        },
    }
}