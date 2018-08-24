import {
  findGroup,findAllFetch,findOne,deal,
} from '../../services/contentCheck/feedback';
import { parse } from 'qs';
import {message} from 'antd';

export default {
	namespace: 'feedback',
	state: {
    labelFeedbackType:[],//反馈类型标签
    status:'待处理',
    dataSource:[],
    loading:true,
    content:'',//关键字
    total:'',
    pageNo:'',
    type:'',
    createTime:'',
    contentFeedback:'',//反馈内容
    imgUrl:[],
    userType:'',
    loginName:'',
    areaPath:'',
    dealTime:'',
    dealUserName:'',
    result:'',
    dealModal:false,
    id:'',
   },
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/contentCheck/feedback') {
          dispatch({type:'initailFindAll'})
          // dispatch({
          //   type:'findFeedbackType',
          //   payload:{
          //     groups:[
          //       {typeName:'反馈类型',
          //       areaPath:null,}
          //     ]
          //   }
          // })
          // dispatch({type:'findAll',
          //   payload:{status:'待处理'}
          // })
				}
			});
		},
	},
	effects: {
    *initailFindAll({ payload }, { call, put }){
      yield put({
        type:'findFeedbackType',
        payload:{
          groups:[
            {typeName:'反馈类型',
            areaPath:null,}
          ]
        }
      });
      yield put({type:'findAll',
        payload:{status:'待处理'}
      })
    },
    *findFeedbackType({ payload }, { call, put }){
      const  {data,err}  = yield call(findGroup,{...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(!!data.data){
        let labelFeedbackType;
        if(data.data[0].typeName=='反馈类型'){
          labelFeedbackType=data.data[0].nameAndValues
        }
        yield put({
          type:'initailSuccess',
          payload:{labelFeedbackType:labelFeedbackType}
        })
      }else{
        message.error('获取反馈类型失败')
      }
    },
    *findAll({ payload }, { call, put }){
      const  {data,err}  = yield call(findAllFetch,{...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      const dataSource=[];
      if(!!data.data){
        data.data.feedbacks.map((item,index)=>(
          dataSource.push({
            key:item.id,
            number:index+1,
            areaPath:item.areaPath,
            createTime:item.createTime,
            content:item.content,
            loginName:item.loginName,
            userName:item.userName,
          })
        ))
        yield put({
          type:'initailSuccess',
          payload:{
            dataSource:dataSource,
            total:data.data.totalElements,
            pageNo:data.data.number+1,
            status:payload.status,
            content:payload.content,
            type:payload.type,
            loading:false,
            dealModal:false,
          }
        })
      }else{
        message.error(data.message)
      }
    },
    *dealDetails({ payload }, { call, put }){
      const {data,err}=yield call(findOne,{...payload})
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(!!data.data){
        yield put({
          type:'initailSuccess',
          payload:{
            createTime:data.data.createTime,
            contentFeedback:data.data.content,
            imgUrl:data.data.imgUrl,
            userType:data.data.userType,
            loginName:data.data.loginName,
            areaPath:data.data.areaPath,
            dealTime:data.data.dealTime,
            dealUserName:data.data.dealUserName,
            result:data.data.result,
            id:data.data.id,
            dealModal:true,
          }
        })
      }else{
        message.error(data.message);
      }
    },
    *dealDetailOk({ payload }, { call, put ,select}){
      const {data,err}=yield call(deal,{...payload})
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(!!data.data){
        yield put({
          type:'findAll',
          payload:{
            status:'待处理',
          }
        })
        message.success('处理成功')
      }else{
        message.error(data.message);
      }
    }
	},
  reducers: {
    initailSuccess(state,{payload}){
			return { ...state, ...payload };
		},
  },
}
