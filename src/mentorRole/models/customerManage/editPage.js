import { requestApi } from '../../services/common'

import { message } from 'antd'
import analysisUtil from '../../../commons/utils/commonApiResponseAnalysis.js';
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../commons/utils/commonUtil.js';
import labelsFinalCode from '../../../commons/utils/labelsFinalCode.js';
import lodash from 'lodash';

// 加载标签信息
const typeGroups = [
    {
        "areaPath": "",
        "typeName": labelsFinalCode.labelZzcszj,      // 住宅出售总价
    },
    {
        "areaPath": "",
        "typeName": labelsFinalCode.labelZzzj,    // 住宅租金
    },
    {
        "areaPath": "",
        "typeName": labelsFinalCode.labelZzmj,    // 面积
    },
    {
        "areaPath": "",
        "typeName": labelsFinalCode.labelSecondHouseFyjs,    // 户型（居室）
    },
    {
        "areaPath": "",
        "typeName": labelsFinalCode.labelZzzpfs,    // 二手房租赁支付方式
    },
    {
        "areaPath": "",
        "typeName": labelsFinalCode.labelShopsSplx,    // 商铺类型
    },
    {
        "areaPath": "",
        "typeName": labelsFinalCode.labelShopsSpkjyfw,    // 商铺经营类目
    },
    {
        "areaPath": "",
        "typeName": labelsFinalCode.labelShops_czzjdw,    // 商铺租金
    },
    {
        "areaPath": "",
        "typeName": labelsFinalCode.labelHouseOffice_xzllx,    // 写字楼类型
    },
    {
        "areaPath": "",
        "typeName": labelsFinalCode.labelShops_spmj,    // 商铺面积
    },
    {
        "areaPath": "",
        "typeName": labelsFinalCode.labelHouse_xzlmj,    // 写字楼面积
    },
    {
        "areaPath": "",
        "typeName": labelsFinalCode.labelHouse_xzlcszj,    // 写字楼出售总价
    },
    {
        "areaPath": "",
        "typeName": labelsFinalCode.labelShops_spzj,    // 商铺租金
    },
    {
        "areaPath": "",
        "typeName": labelsFinalCode.labelHouse_xzlzj,    // 写字楼租金
    },
    {
        "areaPath": "",
        "typeName": labelsFinalCode.labelHouse_xzlqzfkfs,    // 求租付款方式
    },
];

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
    eopOptions: [],
    wantTotal: 1,
    labels: null,
    want1: {
        type: "求购",
        propertyType: "住宅",
    },
    want2: {
        type: "求购",
        propertyType: "住宅",
    },
    want3: {
        type: "求购",
        propertyType: "住宅",
    },
    preInfo: null
};

export default {
    namespace: "editPage",
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
                if (location.pathname === '/customerManage/editPage') {
                    //   获取初始数据
                    dispatch({
                        type: 'initData',
                        payload: {
                            id: location.state.id
                        }
                    });
                }
            })
        }
    },
    effects: {
        // 初始化
        *initData({ payload }, { put, call }) {
            yield put({
                type: "showProcess"
            });
            // 加载所在区域信息
            yield put({
                type: "getEopOptions"
            });
            payload.id && (yield put({
                type: "preEdit",
                payload: {
                    id: payload.id
                }
            }));
            // 查询标签
            const params = { groups: typeGroups };
            params.apiName = commonFinalCode.findGroupApiName;
            const responseObj = yield call(requestApi, params);
            const reObj = analysisUtil.analysisDataResponse(responseObj);
            if (reObj.isSuccess) {
                const labels = commonUtil.ansyslabelsData(reObj.content);
                yield put({
                    type: 'setState',
                    payload: {
                        labels: labels
                    }
                });
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
        //根据页面传来的客户ID查询客户的详细意向信息
        *preEdit({ payload }, { put, call }) {
            const responseObj = yield call(requestApi, {
                apiName: "/miss-anzhu-broker/customers/preEdit",
                id: payload.id
            });
            const reObj = analysisUtil.analysisDataResponse(responseObj);
            if (reObj.isSuccess) {
                yield put({
                    type: 'saveResultData',
                    payload: {
                        preInfo: reObj,
                        wantTotal: reObj.intentionList.length
                    }
                })
                if (reObj.intentionList[0]) {
                    yield put({
                        type: "setState",
                        payload: {
                            want1: reObj.intentionList[0]
                        }
                    })
                }
                if (reObj.intentionList[1]) {
                    yield put({
                        type: "setState",
                        payload: {
                            want2: reObj.intentionList[1]
                        }
                    })
                }
                if (reObj.intentionList[2]) {
                    yield put({
                        type: "setState",
                        payload: {
                            want3: reObj.intentionList[2]
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
        // 加载区域信息
        *getEopOptions({ payload }, { put, call }) {
            const responseObj = yield call(requestApi, {
                apiName: "/miss-anzhu-operation/service-regions/findAllProvinces",
            });
            const reObj = analysisUtil.analysisDataResponse(responseObj);
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
    }

}