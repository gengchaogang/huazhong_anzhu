import {
  getEmployeeInformation,//获取员工信息
  // delete,//删除员工
} from '../../services/businessManagement/employeeInformation';
import { parse } from 'qs';
// const employeeMsg={
//   name:'张三',
//   jobNumber:'12',
//   phoneNumber:'15023256520',
//   department:'市场部',
//   position:'副部长',
//   extensionNumber:'48605858',
//   mailAddress:'15023285645@qq.com',
//   officeAddress:'松石支路12号',
//   remarks:'此人牛逼',
//   role:'管理员',
// }
export default {
  namespace: 'employeeInformation',
  state: {
    loading:true,
    data:[
      {
        name:'员工姓名',
        value:'',
        key:'name',
      },{
        name:'员工工号',
        value:'',
        key:'jobNumber',
      },{
        name:'手机号',
        value:'',
        key:'phoneNumber',
      },{
        name:'部门',
        value:'',
        key:'department',
      },{
        name:'职位',
        value:'',
        key:'position',
      },{
        name:'分机号',
        value:'',
        key:'extensionNumber',
      },{
        name:'邮箱',
        value:'',
        key:'mailAddress',
      },{
        name:'办公地址',
        value:'',
        key:'officeAddress',
      },{
        name:'备注',
        value:'',
        key:'remarks',
      },{
        name:'员工角色',
        value:'',
        key:'role',
      }
    ],
    employeeId:null,
    promptObj:{
      visible:false,
      content:'',
      title:'',
      okText:'确定',
      type:'',
    },
  },
  subscriptions: {
     setup({ dispatch, history }) {
       history.listen(location => {
         if (location.pathname === '/businessManagement/employeeInformation') {
           dispatch({
             type: 'getEmployeeInformation',
             payload: location.state.employeeId,
           });
         }
       });
     },
   },
  effects:{
    *getEmployeeInformation({ payload }, { select, call, put }) {
      yield put({
        type: 'setEmployeeId',
        payload,
      });
      const { data } = yield call(getEmployeeInformation,{id:payload});
      if(data.status=='success'){
        const result=data.data;
        const newData=[
          {
            name:'员工姓名',
            value:!!result.name?result.name:'',
            key:'name',
          },{
            name:'员工工号',
            value:!!result.number?result.number:'',
            key:'jobNumber',
          },{
            name:'手机号',
            value:!!result.phone?result.phone:'',
            key:'phoneNumber',
          },{
            name:'部门',
            value:!!result.department?result.department:'',
            key:'department',
          },{
            name:'职位',
            value:!!result.position?result.position:'',
            key:'position',
          },{
            name:'分机号',
            value:!!result.extensionNumber?result.extensionNumber:'',
            key:'extensionNumber',
          },{
            name:'邮箱',
            value:!!result.email?result.email:'',
            key:'mailAddress',
          },{
            name:'办公地址',
            value:!!result.officeAddress?result.officeAddress:'',
            key:'officeAddress',
          },{
            name:'备注',
            value:!!result.comments?result.comments:'',
            key:'remarks',
          },{
            name:'员工角色',
            value:!!result.role?result.role:'',
            key:'role',
          }
        ]
        yield put({
          type: 'initMainData',
          payload:newData,
        });
        yield put({
          type: 'switchLoading',
          payload:false,
        });
      }else{
        //获取失败
        yield put({
          type: 'switchLoading',
          payload:false,
        });
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            content:data.message,
            title:'获取员工信息失败',
            okText:'确定',
            type:'error',
          },
        });
      }
    },
    // *reSetOperatPassWordFetch({ payload }, { select, call, put }) {
    //
    // },
    // *delete({payload},{select,call,put}){
    //
    // },
  },
  reducers: {
    setEmployeeId(state,action) {
      return {...state,employeeId:action.payload};
    },
    initMainData(state,action) {
      return {...state,data:action.payload};
    },
    switchLoading(state,action){
      return {...state,loading:action.payload};
    },
    switchPrompt(state,action){
      return{...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
  },
}
