import {findAllFetch,findenable,findEdit,
} from '../../services/messageManagement/systemMessage';
import { parse } from 'qs';
import { message} from 'antd';

export default {
	namespace: 'systemMessage',
	state: {
    loading:false,
		messageData:[],
		describes:'',//标题
		template:'',//模版内容
		messageTypes:[],//消息类型
		messageType:'',//消息类型
		code:'',//编号
		editStatus:false,//编辑状态的模态框
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/messageManagement/systemMessage'){
					// dispatch({type:'initail',payload:{loading:true}})
					// dispatch({type:'findAll',
					// 	payload:{
					// 		pageNo:0,
					// 		pageSize:10,
					// 	}
					// })
					dispatch({type:'initailFindAll'})
        }
			});
		},
	},
	effects: {
		*initailFindAll({ payload }, { call, put }){
			yield put({type:'initail',payload:{loading:true}})
			yield put({type:'findAll',
				payload:{
					pageNo:0,
					pageSize:10,
				}
			})
		},
		//初始化请求表格数据
    *findAll({ payload }, { call, put }){
    	const {data,err}=yield call(findAllFetch,{...payload})
			if(err){
				yield put({type:'initail',loading:false})
				return
				message.error('初始化列表失败，请联系管理员')
			}
			if(data.data){
				const messageData=[];
				data.data.content.map((item,index)=>(
					messageData.push({
						key:item.code,
						code:item.code,
						number:index+1,
						businessType:item.businessType,
						describes:item.describes,
						isEnable:item.isEnable,
						messageType:item.messageType,
						product:item.product,
						receiver:item.receiver,
						sender:item.sender,
						template:item.template,
						triggerType:item.triggerType,
					})
				))
				yield put({
					type:'initail',
					payload:{
						messageData:messageData,
						total:data.data.totalElements,
						pageNo:data.data.number+1,
						editStatus:false,
						loading:false,
					}
				})
			}else{
				message.error(data.message)
			}
    },
		//是否启用
		*changeEnable({ payload }, { call, put ,select}){
			const {data}=yield call(findenable,{...payload})
			const pageNo=yield select(({systemMessage})=>systemMessage.pageNo)
			if(data.data){
				yield put({type:'findAll',
					payload:{
						pageNo:pageNo-1,
						pageSize:10,
					}
				})
				message.success('操作成功')
			}else{
				message.error(data.message)
				yield put({type:'initail',loading:false})
			}
		},
		*editOk({ payload }, { call, put ,select}){
			const {data,err}=yield call(findEdit,{...payload})
			if(err){
				yield put({type:'initail',payload:{editStatus:false,loading:false}})
				return message.error('编辑失败，请联系管理员')
			}
			const pageNo=yield select(({systemMessage})=>systemMessage.pageNo)
			if(data.data){
				yield put({type:'findAll',
					payload:{
						pageNo:pageNo-1,
						pageSize:10,
					}
				})
				message.success('编辑成功')
			}else{
				message.error(data.message);
				yield put({type:'initail',payload:{editStatus:false,loading:false}})
			}
		}
	},
	reducers: {
		initail(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
