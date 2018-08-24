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
        "typeName": labelsFinalCode.labelFwcx,    // 房源朝向
    },
    {
        "areaPath": "",
        "typeName": labelsFinalCode.labelZxqk,   // 装修情况
    },
];

const initState = {
    sellOrRent: "",
    activeKey: "",
    eopOptions: [],
    teamList: [],
    pwd: "关键字",
    dateRange: null,
    loadingShadow: false,
    keyModal: {
        visible: false,
    },
    keyModalData: {
        name: "",
        phone: "",
        toutorTeamOut: {
            name: "",
            site: ""
        }
    },
    promptObj: {
        visible: false,
        description: '',
        title: '',
        promptFor: 'default',
        okText: '确定',
        type: '',
        todo: '',
    },
    labels: null,
    // 2个页面共6个tab的分页信息
    secondHandHouseSellList: {
        pageNo: 1,
        total: 0,
        pageSize: commonFinalCode.pageSize,
        content: [],
    },
    secondHandHouseRentList: {
        pageNo: 1,
        total: 0,
        pageSize: commonFinalCode.pageSize,
        content: [],
    },
    shopSellList: {
        pageNo: 1,
        total: 0,
        pageSize: commonFinalCode.pageSize,
        content: [],
    },
    shopRentList: {
        pageNo: 1,
        total: 0,
        pageSize: commonFinalCode.pageSize,
        content: [],
    },
    officeSellList: {
        pageNo: 1,
        total: 0,
        pageSize: commonFinalCode.pageSize,
        content: [],
    },
    officeRentList: {
        pageNo: 1,
        total: 0,
        pageSize: commonFinalCode.pageSize,
        content: [],
    },
}
export default {
    namespace: 'allHouseResourceSell',
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
                if (location.pathname === '/allHouse/allHouseResourceSell' || location.pathname === '/allHouse') {
                    // 设置初始数据
                    dispatch({
                        type: 'initState',
                    });
                    //   获取初始数据
                    dispatch({
                        type: 'initData',
                    });
                    dispatch({
                        type: 'setState',
                        payload: {
                            sellOrRent: 'sell',
                            activeKey: 'secondHandHouseSell'
                        }
                    });
                    dispatch({
                        type: 'secondHandHouseSellList',
                        payload: {
                            pageSize: commonFinalCode.pageSize,
                            pageNo: 0,
                            resourcesType: "住宅",
                            saleWay: "出售",
                        }
                    });
                } else if (location.pathname === '/allHouse/allHouseResourceRent') {
                    // 设置初始数据
                    dispatch({
                        type: 'initState',
                    });
                    //   获取初始数据
                    dispatch({
                        type: 'initData',
                    });
                    dispatch({
                        type: 'setState',
                        payload: {
                            sellOrRent: 'rent',
                            activeKey: 'secondHandHouseRent'
                        }
                    });
                    dispatch({
                        type: 'secondHandHouseRentList',
                        payload: {
                            pageSize: commonFinalCode.pageSize,
                            pageNo: 0,
                            resourcesType: "住宅",
                            saleWay: "出租",
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
            yield put({
                type: "getMdOptions"
            })
            // 查询标签
            const params = { groups: typeGroups };
            params.apiName = commonFinalCode.findGroupApiName;
            const responseObj = yield call(requestApi, params);
            var reObj = analysisUtil.analysisDataResponse(responseObj);
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
        // 加载区域信息
        *getEopOptions({ payload }, { put, call }) {
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
                        keyModal: {
                            visible: true
                        }
                    }
                })
                yield put({
                    type: 'saveResultData',
                    payload: {
                        keyModalData: reObj
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
        // 加载门店下拉项
        *getMdOptions({ payload }, { put, call }) {
            const responseObj = yield call(requestApi, {
                apiName: "/miss-anzhu-tutor/tutors/broker/findTeamList",
            });
            var reObj = analysisUtil.analysisDataResponse(responseObj);
            if (reObj.isSuccess) {
                yield put({
                    type: "saveResultData",
                    payload: {
                        teamList: reObj.content,
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
        // 获取房源列表 二手房出售
        *secondHandHouseSellList({ payload }, { put, call, select }) {
            yield put({
                type: 'showProcess',
            });
            payload.apiName = "/miss-anzhu-secdhouse-resource/main/findFilterAndOrderHouse";
            const responseObj = yield call(requestApi, { ...payload });
            var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
            if (reObj.isSuccess) {
                yield put({
                    type: "saveResultData",
                    payload: {
                        secondHandHouseSellList: reObj,
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
        // 获取房源列表 二手房出租
        *secondHandHouseRentList({ payload }, { put, call, select }) {
            yield put({
                type: 'showProcess',
            });
            payload.apiName = "/miss-anzhu-secdhouse-resource/main/findFilterAndOrderHouse";
            const responseObj = yield call(requestApi, { ...payload });
            var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
            if (reObj.isSuccess) {
                yield put({
                    type: "saveResultData",
                    payload: {
                        secondHandHouseRentList: reObj,
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
        // 获取房源列表 商铺出售
        *shopSellList({ payload }, { put, call, select }) {
            yield put({
                type: 'showProcess',
            });
            payload.apiName = "/miss-anzhu-secdhouse-resource/main/findFilterAndOrderHouse";
            const responseObj = yield call(requestApi, { ...payload });
            var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
            if (reObj.isSuccess) {
                yield put({
                    type: "saveResultData",
                    payload: {
                        shopSellList: reObj,
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
        // 获取房源列表 商铺出租
        *shopRentList({ payload }, { put, call, select }) {
            yield put({
                type: 'showProcess',
            });
            payload.apiName = "/miss-anzhu-secdhouse-resource/main/findFilterAndOrderHouse";
            const responseObj = yield call(requestApi, { ...payload });
            var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
            if (reObj.isSuccess) {
                yield put({
                    type: "saveResultData",
                    payload: {
                        shopRentList: reObj,
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
        // 获取房源列表 写字楼出售
        *officeSellList({ payload }, { put, call, select }) {
            yield put({
                type: 'showProcess',
            });
            payload.apiName = "/miss-anzhu-secdhouse-resource/main/findFilterAndOrderHouse";
            const responseObj = yield call(requestApi, { ...payload });
            var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
            if (reObj.isSuccess) {
                yield put({
                    type: "saveResultData",
                    payload: {
                        officeSellList: reObj,
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
        // 获取房源列表 写字楼出租
        *officeRentList({ payload }, { put, call, select }) {
            yield put({
                type: 'showProcess',
            });
            payload.apiName = "/miss-anzhu-secdhouse-resource/main/findFilterAndOrderHouse";
            const responseObj = yield call(requestApi, { ...payload });
            var reObj = analysisUtil.analysisGetPageDataResponse(responseObj);
            if (reObj.isSuccess) {
                yield put({
                    type: "saveResultData",
                    payload: {
                        officeRentList: reObj,
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

        // 获取房源列表  公用dispath
        *loadList({ payload }, { put, call, select }) {
            const { isReFresh } = payload;
            var pageNo = 0;
            var pageSize = commonFinalCode.pageSize;
            var typeName = "";
            var pageObj = null;

            const allHouseResourceSell = yield select(({ allHouseResourceSell }) => allHouseResourceSell);
            const { activeKey } = allHouseResourceSell;
            // 保留当前tab的页码 
            if (activeKey === 'secondHandHouseSell') {
                typeName = 'secondHandHouseSellList';
                const { secondHandHouseSellList } = allHouseResourceSell;
                pageObj = secondHandHouseSellList;
            } else if (activeKey === 'shopSell') {
                typeName = 'shopSellList';
                const { shopSellList } = allHouseResourceSell;
                pageObj = shopSellList;
            } else if (activeKey === 'officeSell') {
                typeName = 'officeSellList';
                const { officeSellList } = allHouseResourceSell;
                pageObj = officeSellList;
            } else if (activeKey === 'secondHandHouseRent') {
                typeName = 'secondHandHouseRentList';
                const { secondHandHouseRentList } = allHouseResourceSell;
                pageObj = secondHandHouseRentList;
            } else if (activeKey === 'shopRent') {
                typeName = 'shopRentList';
                const { shopRentList } = allHouseResourceSell;
                pageObj = shopRentList;
            } else if (activeKey === 'officeRent') {
                typeName = 'officeRentList';
                const { officeRentList } = allHouseResourceSell;
                pageObj = officeRentList;
            }

            if (pageObj != null) {
                pageSize = pageObj.pageSize;
                if (isReFresh) {

                } else {
                    pageNo = 0;
                }
            }
            // 根据当前tab页的activeKey   赋值不同参数
            if (activeKey === 'secondHandHouseSell') {
                yield put({
                    type: typeName,
                    payload: {
                        pageNo: pageNo,
                        pageSize: pageSize,
                        saleWay: "出售",
                        resourcesType: "住宅",
                        ...payload
                    }
                })
            } else if (activeKey === 'shopSell') {
                yield put({
                    type: typeName,
                    payload: {
                        pageNo: pageNo,
                        pageSize: pageSize,
                        saleWay: "出售",
                        resourcesType: "商铺",
                        ...payload
                    }
                })
            } else if (activeKey === 'officeSell') {
                yield put({
                    type: typeName,
                    payload: {
                        pageNo: pageNo,
                        pageSize: pageSize,
                        saleWay: "出售",
                        resourcesType: "写字楼",
                        ...payload
                    }
                })
            } else if (activeKey === 'secondHandHouseRent') {
                yield put({
                    type: typeName,
                    payload: {
                        pageNo: pageNo,
                        pageSize: pageSize,
                        saleWay: "出租",
                        resourcesType: "住宅",
                        ...payload
                    }
                })
            } else if (activeKey === 'shopRent') {
                yield put({
                    type: typeName,
                    payload: {
                        pageNo: pageNo,
                        pageSize: pageSize,
                        saleWay: "出租",
                        resourcesType: "商铺",
                        ...payload
                    }
                })
            } else if (activeKey === 'officeRent') {
                yield put({
                    type: typeName,
                    payload: {
                        pageNo: pageNo,
                        pageSize: pageSize,
                        saleWay: "出租",
                        resourcesType: "写字楼",
                        ...payload
                    }
                })
            }
        },
    }
}