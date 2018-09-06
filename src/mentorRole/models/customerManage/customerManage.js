import { requestApi } from '../../services/common'

import { message } from 'antd'
import analysisUtil from '../../../commons/utils/commonApiResponseAnalysis.js';
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../commons/utils/commonUtil.js';
import labelsFinalCode from '../../../commons/utils/labelsFinalCode.js';
import lodash from 'lodash';

const initState = {
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
    customerList: {
        pageNo: 1,
        total: 0,
        pageSize: commonFinalCode.pageSize,
        content: [
        ],
    },
    isBroker: true
};

export default {
    namespace: "customerManage",
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
                if (location.pathname === '/customerManage') {
                    dispatch({
                        type: 'getIsBroker'
                    })
                    dispatch({
                        type: "getAllCustomerList",
                        payload: {
                            pageSize: commonFinalCode.pageSize,
                            pageNo: 0,
                        }
                    })
                }
            })
        }
    },
    effects: {
        //获取客户列表/miss-anzhu-broker/customers/findAllCustomerList
        *getAllCustomerList({ payload }, { put, call, select }) {
            yield put({
                type: 'showProcess',
            });
            payload.apiName = "/miss-anzhu-broker/customers/findAllCustomerList";
            const responseObj = yield call(requestApi, { ...payload });
            var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
            if (reObj.isSuccess) {
                yield put({
                    type: "saveResultData",
                    payload: {
                        customerList: reObj,
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
        *getIsBroker({ payload }, { put, call, select }) {
            const isBroker = yield select(({ main }) => { return main.isBroker });
            yield put({
                type: 'setState',
                payload: {
                    isBroker: isBroker
                }
            });
        },
    }

}