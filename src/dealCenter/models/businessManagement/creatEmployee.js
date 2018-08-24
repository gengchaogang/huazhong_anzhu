import {
  addEmployeeFetch,//添加员工
  getDepartmentFetch,//添加员工
} from '../../services/businessManagement/creatEmployee';
import { parse } from 'qs';

//测试数据
const treeData = [{
  label: '市场部',
  value: '1',
  key: '0-0',
  children: [{
    label: '售后部',
    value: '2',
    key: '0-0-1',
  }, {
    label: '服务部',
    value: '0-0-2',
    key: '0-0-2',
  }],
}, {
  label: '新房部',
  value: '0-1',
  key: '0-1',
}];

const roleData=['管理员','主管','职员'];

export default {
  namespace: 'creatEmployee',
  state: {
    loading:true,
    departmentData:[],
    roleData:[],
    promptObj:{
      visible:false,
      content:'',
      title:'',
      promptFor:'default',
      okText:'确定',
      type:'',
    },
  },
  subscriptions: {
     setup({ dispatch, history }) {
       history.listen(location => {
         if (location.pathname === '/businessManagement/creatEmployee') {
          //  获取角色分类，所有部门
           dispatch({
             type: 'getDepartment',
           });
         }
       });
     },
   },
  effects:{
    // *getEmployeeInformation({ payload }, { select, call, put }) {
    //   yield put({
    //     type: 'setEmployeeId',
    //     payload,
    //   });
    //   const { data } = yield call(getEmployeeInformation,{id:payload});
    //   if(data.status=='success'){
    //     yield put({
    //       type: 'initMainData',
    //       payload:newData,
    //     });
    //     yield put({
    //       type: 'switchLoading',
    //       payload:false,
    //     });
    //   }else{
    //     //获取失败
    //     yield put({
    //       type: 'switchLoading',
    //       payload:false,
    //     });
    //     yield put({
    //       type: 'switchPrompt',
    //       payload:{
    //         visible:true,
    //         content:data.message,
    //         title:'获取员工信息失败',
    //         okText:'确定',
    //         type:'error',
    //       },
    //     });
    //   }
    // },
    *getDepartment({ payload }, { select, call, put }){
      const{data}=yield call(getDepartmentFetch,{pageNo:1,pageSize:100000});
      if(data.status=='success'){
        yield put({
          type:'initData',
          payload:{
            departmentData:treeData,
            roleData:roleData,
          },
        });
        yield put({
          type: 'switchLoading',
          payload:false,
        });
      }else{
        //获取部门列表失败
        yield put({
          type: 'switchLoading',
          payload:false,
        });
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            promptFor:'getDepartment',
            content:data.message,
            title:'获取部门列表失败',
            okText:'确定',
            type:'error',
          },
        });
      }
    },
    *addEmployee({ payload }, { select, call, put }) {
      yield put({
        type: 'switchLoading',
        payload:true,
      });
      //应该将部门转换为ID
      const newEmployee=Object.assign({},payload,{department:payload.department[payload.department.length-1]});
      const { data } = yield call(addEmployeeFetch,{newEmployee,});
      if(data.status=='success'){
        yield put({
          type: 'switchLoading',
          payload:false,
        });
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            promptFor:'addEmployee',
            content:'点击确定继续新建员工，点击返回将返回',
            title:'新建员工成功！',
            okText:'确定',
            type:'confirm',
          },
        });
      }else{
        //新建失败
        yield put({
          type: 'switchLoading',
          payload:false,
        });
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            promptFor:'addEmployee',
            content:data.message,
            title:'新建员工失败',
            okText:'确定',
            type:'error',
          },
        });
      }
    },
    // *delete({payload},{select,call,put}){
    //
    // },
  },
  reducers: {
    switchPrompt(state,action){
      return{...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    initData(state,action){
      return{...state,...action.payload}
    },
    switchLoading(state,action){
      return{...state,loading:action.payload}
    },
  },
}
