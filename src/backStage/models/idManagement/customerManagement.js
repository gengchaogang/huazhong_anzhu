import { query } from '../../services/idManagement/customerManagement';
import { parse } from 'qs';
import { message } from 'antd';


function toTableData(datas) {
    datas = datas || [];
    return datas.map(data2Item);
}

function data2Item(data, i) {
    return {
        id: data.id,
        key: i + 1,
        avatar: data.avatar,
        name: data.name,
        createDate: data.createDate===null?'':data.createDate,
        loginName: data.loginName,
        logo: data.logo
    };
}


export default {

    namespace: 'customerIndex',
    state: {
        tableData: [],
        totalElements: 0,
        pageNo: 1,
        pageSize: 10,
    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/idManagement/customerManagement') {
                    dispatch({ type: 'iniaitFindAll' });                
                }
            });
        },
    },

    effects: {
        *iniaitFindAll({ payload }, { call, put, select }) {
            yield put({ type: 'query' });
        },
        *query({ payload = {} }, { call, put, select }) {            
            if (payload.pageNo > 0) {
                payload.pageNo--;
            } else {
                payload.pageNo = 0;
            }
            if (!(payload.pageSize > 0)) {//小于0 或未定义时 设置默认值
                payload.pageSize = yield select(({ customerIndex }) => customerIndex.pageSize);
            }

            const { data, err } = yield call(query, payload);

            if (err) {
                message.info('查询错误！' + err.message, 6);
                console.error("query error>", err);
                return;
            }
            // console.log("query data>",data);
            if (data.status == "success") {

                console.log("data", data);
                yield put({
                    type: 'setState',
                    payload: {
                        tableData: toTableData(data.data.content),
                        totalElements: data.data.totalElements,
                        pageNo: payload.pageNo + 1,
                        pageSize: payload.pageSize,
                    },
                });
            } else {
                message.info('查询错误！' + data.message, 6);
            }
        },
    },

    reducers: {
        querySuccess(state, { payload }) {
            return { ...state, ...payload };
        },
        setState(state, { payload }) {
            return { ...state, ...payload };
        },
    },
}