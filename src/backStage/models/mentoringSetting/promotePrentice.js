import {findAllFetch,change,edit} from '../../services/mentoringSetting/promotePrentice';
import { parse } from 'qs';
import {message} from 'antd';

export default {
	namespace: 'promotePrentice',
	state: {
    loading:false,
    editModalStatus:false,
    translateData:[],
    id:'',
    assessmentStandard:'',
    assessmentItem:'',
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/mentoringSetting/promotePrentice') {
					dispatch({type:'initailFindAll'})
					// dispatch({type:'initailSuccess',payload:{loading:true}})
          // dispatch({type:'findAll'})
				}
			});
		},
	},
	effects: {
		*initailFindAll({ payload }, { call, put }){
			yield put({type:'initailSuccess',payload:{loading:true}})
			yield put({type:'findAll'})
		},
    *findAll({ payload }, { call, put }){
      const  {data,err}  = yield call(findAllFetch,{...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        const translateData=[];
        data.data.list.map((item,index)=>(
          translateData.push({
            key:item.id,
            number:index+1,
            assessmentItem:item.assessmentItem,
            standard:item.assessmentStandard+item.unit,
            assessmentStandard:item.assessmentStandard,
            status:item.status,
          })
        ))
        yield put ({type:'initailSuccess',
          payload:{
            loading:false,
            translateData:translateData,
            editModalStatus:false,
          }
        })
      }
    },
    *changeStatus({ payload }, { call, put }){
      const  {data,err}  = yield call(change,{...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        yield put({type:'findAll'})
      }
    },
    *editOk({ payload }, { call, put }){
      const  {data}  = yield call(edit,{...payload});
      if(data.data){
        yield put({type:'findAll'})
      }
    }
	},
	reducers: {
		initailSuccess(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
