import {message} from 'antd';
import {
	getInitTableDataFetch,
} from '../services/operationLog';

export default {
	namespace:'operationLog',
	state:{
		totalElements:null,
		currentPage:null,
		tableData:[],
		dataRange:null,
		tableLoading:true,
		response:[],
		promptObj:{
		 visible:false,
		 description:'',
		 title:'',
		 promptFor:'default',
		 okText:'确定',
		 type:'',
		 todo:'',
	 },
	},
	reducers:{
		togglePrompt(state,action){
			return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
		},
		saveTableData(state,action){
			return{...state,...action.payload}
		},
	},
	effects:{
		*getInitTableData({payload},{call,put}){
			const {data}=yield  call(getInitTableDataFetch,{...payload})
			if(!!data&&data.status==="success"){
				const resultData=[];
				const totalElements=data.data.totalElements;
				const currentPage=data.data.number;
				data.data.content.map((item,index)=>{
					resultData.push({
						number:index+1,
						key:item.id,
						code:item.code,
						logContent:item.logContent,
						logData:item.logData,
						logTime:item.logTime,
						logUserName:item.logUserName,
						ipAddr:item.ipAddr,
					})
				})
				yield put({
					type:"saveTableData",
					payload:{
						totalElements:totalElements,
						currentPage:currentPage,
						tableData:resultData,
						tableLoading:false,
					}
				})
			}else{
				yield put({type:'togglePrompt',payload:{
					type:'error',
					title:'失败!',
					description:'获取操作日志列表失败!',
					visible:true,
					todo:"closeModal"
				}})
			}
		},
	},
	subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/operationLog') {
          dispatch({
            type:"getInitTableData",
            payload:{
              pageSize:10,
              pageNo:0
            }
          })
				}
			});
		},
	}
}
