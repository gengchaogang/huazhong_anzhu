import {
	findAllAreasOpen,addArticle,watchTableOne,editArticle
} from '../../services/train/trainRichTest';
import {
  Editor,
  EditorState,
  RichUtils ,
  Entity,
  CompositeDecorator,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import { parse } from 'qs';
import { message} from 'antd';
import { routerRedux } from 'dva/router';
const _toCascaderOptions=(arr)=>{
  var options = [];
  var map = {};
  arr.forEach(({code,pCode,lable})=>{
    var option = {value:lable, label:lable}, children;
    map[code] = option;
    if(pCode){
      children = map[pCode];
      if(!children.children){
        children.children = [];
      }
      children.children.push(option);
    }else {
      options.push(option);
    }
  });
  return options;
}
export default {
	namespace: 'trainRichTest',
	state: {
		richAreaOptions:[],
		content:'',
		isRichText:false,
		key:'',
		trainId:'',
		articleId:'',
		richArea:'',
		headline:'',
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/train/trainContent/trainRichTest'){
          dispatch({type:'findTrainArea'})
					if(location.state.trainId){
						dispatch({
							type:'setState',
							payload:{
								trainId:location.state.trainId
							}
						})
					}
					if(location.state.articleId){
						dispatch({
							type:'watchClick',
							payload:{
								articleId:location.state.articleId,
							}
						})
					}
        }
			});
		},
	},
	effects: {
		*findTrainArea({ payload }, { call, put }){
			const {data,err}=yield call(findAllAreasOpen,{...payload})
      if(err){
        message.error('出错了,请联系管理员')
      }
      if(data.data){
				yield put({type:'initail',payload:{
          richAreaOptions:_toCascaderOptions(data.data),
        }})
			}else{
				message.error(data.message)
			}
		},
		*watchClick({ payload }, { call, put }){
			const {data}=yield call(watchTableOne,{...payload})
			if(!!data){
				yield put({
					type:'initail',
					payload:{
						content:data.data.content,
						addContentStatus:true,
						articleId:payload.articleId,
						isRichText:true,
						richArea:(!!data.data.areaPath && data.data.areaPath.replace('/','').split('/')),
						headline:data.data.headline,
						key:data.data.key,
					}
				})
			}
		},
		*addContentOk({ payload }, { call, put }){
			const {data,err}=yield call(addArticle,{...payload})
			if(err){
				return  message.error('出错了，请联系管理员')
			}
			if(data.data){
				message.success('添加成功')
				yield put({
					type:'setState',
					payload:{
						content:'',
						isRichText:false,
						articleId:'',
						richArea:'',
						headline:'',
					}
				})
				yield put(routerRedux.goBack());
			}else{
				message.error(`添加失败_${data.message}`)
			}
		},
		*editContent({ payload }, { call, put }){
			const {data,err}=yield call(editArticle,{...payload})
			if(err){
				return  message.error('出错了,请联系管理员')
			}
			if(data.data){
				message.success('编辑成功')
				yield put({
					type:'setState',
					payload:{
						content:'',
						isRichText:false,
						articleId:'',
						richArea:'',
						headline:'',
					}
				})
				return  yield put(routerRedux.goBack());
			}else{
				message.error(`编辑失败_${data.message}`)
			}
		},
	},
	reducers: {
		initail(state,{payload}){
			return { ...state, ...payload };
		},
		setState(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
