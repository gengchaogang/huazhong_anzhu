import { requestApi } from '../../services/common'
import { routerRedux } from 'dva/router';
import { message } from 'antd'
import analysisUtil from '../../../commons/utils/commonApiResponseAnalysis.js';
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../commons/utils/commonUtil.js';
import labelsFinalCode from '../../../commons/utils/labelsFinalCode.js';
import lodash from 'lodash';


const initState = {
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
    programmeList: {
        pageNo: 1,
        total: 0,
        pageSize: commonFinalCode.pageSize,
        content: [],
    },
    loadingShadow: false,
    record: null,
}
export default {
    namespace: "standardCreate",
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
                if (location.pathname === '/dataStatistics/standardHome/standardManage/standardCreate') {
                    dispatch({
                        type: "initState",
                    })
                    if (location.state !== null) {
                        dispatch({
                            type: "setState",
                            payload: {
                                record: location.state.record
                            }
                        })
                    }
                }
            })
        }
    },
    effects: {
        //修改已有方案 
        *editProgramme({ payload }, { put, call, select }) {
            yield put({
                type: 'showProcess'
            })
            const responseObj = yield call(requestApi, {
                apiName: '/miss-anzhu-statistics/assess/updateAssessStatus',
                keyword: "data",
                ...payload
            })
            const resObj = analysisUtil.analysisDataResponse(responseObj);
            if (resObj) {
                yield put({
                    type: "hideProcess"
                });
                message.success("保存方案成功");
                yield put(routerRedux.push({
                    pathname: '/dataStatistics/standardHome/standardManage',
                }))
            } else {
                yield put({
                    type: 'showPrompt',
                    payload: {
                        description: `${resObj.msg}`
                    }
                });
            }
        },
        //增加方案
        *addProgramme({ payload }, { put, call, select }) {
            yield put({
                type: 'showProcess'
            })
            const responseObj = yield call(requestApi, {
                apiName: '/miss-anzhu-statistics/assess/addAssess',
                ...payload
            })
            const resObj = analysisUtil.analysisDataResponse(responseObj);
            if (resObj) {
                yield put({
                    type: "hideProcess"
                });
                message.success("保存方案成功");
                yield put(routerRedux.push({
                    pathname: '/dataStatistics/standardHome/standardManage',
                }))
            } else {
                yield put({
                    type: 'showPrompt',
                    payload: {
                        description: `${resObj.msg}`
                    }
                });
            }
        }
    }
}