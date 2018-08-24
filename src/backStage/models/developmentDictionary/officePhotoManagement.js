import {initialization,getOfficeBuildingUrls} from '../../services/developmentDictionary/officePhotoManagement';
import { parse } from 'qs';
import { message} from 'antd';
export default {
	namespace: 'officePhotoManagement',
	state: {
    showPicList:[],
		id:'',
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/developmentDictionary/officeBuilding/officePhotoManagement') {
					dispatch({type:'initialSuccess',
            payload:{
              showPicList:[],
              id:location.state.id,
            }
          })
					dispatch({
						type: 'initial',
						payload:{
							id:location.state.id,
						}
					})
				}
			});
		},
	},
	effects: {
		*initial({ payload }, { call, put }){
      const  {data,err}  = yield call(initialization, parse(payload));
			if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.status=='success'){
        const showImg=[];
				if(data.data){
          data.data.map((item,index)=>{
            showImg.push({
              id:item.url,
              isCover:item.comment,
              name:'',
              rename:false,
              src:item.url,
            })
          })
        }
        yield put ({
          type: 'initialSuccess',
          payload: {
            showPicList:showImg,
          },
        });
      }
    },
		*uploadSave({ payload }, { call, put }){
      const  {data,err}  = yield call(getOfficeBuildingUrls, parse(payload));
			if(err){
				return message.error('出错了，请联系管理员');
			}

      if(data.status=='success'){
        const showImg=[];
        if(data.data){
          data.data.map((item,index)=>{
            showImg.push({
              id:item.url,
              isCover:item.comment,
              name:'',
              rename:false,
              src:item.url,
            })
          })
        }
        yield put ({
          type: 'initialSuccess',
          payload: {
            showPicList:showImg,
          },
        });
				message.success('保存成功');
      }else{
				message.error(`保存失败,${data.message}`);
				return;
			}
    },
	},
	reducers: {
		initialSuccess(state,{payload}){
			return { ...state, ...payload };
		},
		showPic(state,action){
			return { ...state, showPicList:action.payload };
		},
	},
}
