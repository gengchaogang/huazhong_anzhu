import {
  getInitImgsDataFetch,auditUserPic
} from '../../services/contentCheck/houseImgCheckDetail';
import { parse } from 'qs';
import {message} from 'antd';

export default {
	namespace: 'houseImgCheckDetail',
	state: {
    initData:[],
    houseId:'',
    promptObj:{
      visible:false,
      description:'',
      title:'',
      promptFor:'default',
      okText:'确定',
      type:'',
      todo:'',
    },
    auditedPicModel:{
      addUserId:'',
      addUserLogo:'',
      addUserName:'',
      addUserType:'',
      createDate:'',
      picListModel:[],
      picListPath:[],
    }
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/contentCheck/houseImgCheck/houseImgCheckDetail') {
          // console.log('location',location);
          dispatch({
            type:"getInitImgsData",
            payload:{
              id:location.state.id
            }
          })
				}
			});
		},
	},
  reducers: {
    togglePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    saveTableData(state,{payload}){
      return { ...state, ...payload };
    },
    saveInitData(state,{payload}){
      return { ...state, ...payload };
    },
  },
	effects: {
    *getInitImgsData({payload},{call,put}){
      const {data}=yield call(getInitImgsDataFetch,{...payload});
      if(!!data&&data.status==='success'){
        const initData=[];
        const auditedPicModel={
          addUserId:'',
          addUserLogo:'',
          addUserName:'',
          addUserType:'',
          createDate:'',
          picListModel:[],
          picListPath:[],
        };
        if(data.data.unauditedList.length!=0){
          data.data.unauditedList.map((item,index)=>{
            initData.push({
              key:index+1,
              addUserId:item.addUserId,
              addUserLogo:item.addUserLogo,
              addUserName:item.addUserName,
              addUserType:item.addUserType,
              createDate:item.createDate,
              picListPath:item.picListPath,
            })
          })
        }
        if(!!data.data.auditedPicModel){
          Object.assign(auditedPicModel,data.data.auditedPicModel)
        }
        yield put({type:"saveInitData",
          payload:{
            initData:initData,
            houseId:payload.id,
            auditedPicModel:auditedPicModel,
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:`${data.message}`,
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *Adopt({payload},{call,put,select}){
      const {data}=yield call(auditUserPic,{...payload});
      const houseId=yield select(({houseImgCheckDetail})=>houseImgCheckDetail.houseId);
      if(!!data&&data.status==='success'){
        yield put({
          type:"getInitImgsData",
          payload:{
            id:houseId,
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:`${data.message}`,
          visible:true,
          todo:"closeModal"
        }})
      }
    },
	},
}
