import {findAllTreeFetch,findTableArticle,articleTypeAdd,
	articleTypedelete,findAllarticle,deleteArticle,editArticleType,
	watchTableOne,sendArticle,downArticle,addArticle,editArticle,
	findAllAreasOpen,stick,abrogate,
} from '../../services/train/trainContent';
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
	namespace: 'trainContent',
	state: {
		dataTree:[],
    titleTree:'',
		dataSource:[],
		defaultType:{},
		articleCategory:false,
		editTypeStatus:false,
		total:'',
		pageNo:'',
		keyword:'',//关键字
		typeName:'',//类别名称
		richtext:{},
		addContentStatus:false,
		content:'',
		isRichText:false,
		articleId:'',
		richAreaOptions:[],
		richArea:[],
		headline:'',
		key:'',
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/train/trainContent'){
          dispatch({type:'findAllTree'})
        }
			});
		},
	},
	effects: {
		//初始化请求表格数据
    *findAllTree({ payload }, { call, put }){
      const  {data,err}  = yield call(findAllTreeFetch,{...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
      if(!!data.data){
				let defaultType;
				if(data.data.typeModel.length!=0){
					defaultType={
						name:data.data.typeModel[0].type,
						id:data.data.typeModel[0].id,
					};
				}else{
					defaultType={
						name:'',
						id:'',
					};
				}
				const treeTables=yield call(findTableArticle,{type:defaultType.name,...payload})
				let pageNo;
				let total;
				const dataSource=[];
				if(treeTables.data.data){
					let treesData=treeTables.data.data;
					treesData.content.map((item,index)=>(
						dataSource.push({
							number:index+1,
							key:item.id,
							type:item.type,
							sendDate:item.sendDate,
							headline:item.headline,
							readNO:item.readNO,
							status:item.status,
							comment:item.comment,
							collect:item.collect,
							recommend:item.recommend,
						})
					))
					pageNo=treesData.number+1;
					total=treesData.totalElements;
				}
        yield put({type:'initail',
          payload:{
            dataTree:data.data.typeModel,
            titleTree:data.data.trainName,
						defaultType:defaultType,
						total:total,
						pageNo:pageNo,
						dataSource:dataSource,
						articleCategory:false,
						typeName:'',
						isRichText:false,
						addContentStatus:false,
						headline:'',
		        richArea:[],
						key:'',
          }
        })
			}else{
				message.error('加载数据失败')
			}
    },
		*selectedTreeTable({ payload }, { call, put }){
			const  {data}  = yield call(findTableArticle,{...payload});
			const defaultType={
				name:payload.type,
				id:payload.id,
			}
			if(data.data){
				const dataSource=[];
				data.data.content.map((item,index)=>(
					dataSource.push({
						number:index+1,
						key:item.id,
						type:item.type,
						sendDate:item.sendDate,
						headline:item.headline,
						status:item.status,
						readNO:item.readNO,
						comment:item.comment,
						collect:item.collect,
						recommend:item.recommend,
					})
				))
				yield put({
					type:'initail',
					payload:{
						dataSource:dataSource,
						pageNo:data.data.number+1,
						total:data.data.totalElements,
						defaultType:defaultType,
					}
				})
			}else{
				message.error(data.message)
			}
		},
		*articTypeOk({ payload }, { call, put }){
			const  {data}  = yield call(articleTypeAdd,{...payload});
			if(data.data){
				yield put({type:'findAllTree'})
				message.success('添加成功')
			}else{
				message.error(data.message)
			}
		},
		*articTypeEditOk({ payload }, { call, put }){
			const  {data}  = yield call(editArticleType,{...payload});
			if(data.data){
				yield put({type:'findAllTree'})
				message.success('编辑成功')
			}else{
				message.error(data.message)
			}
		},
		//删除文章类型
		*deleteType({ payload }, { call, put }){
			const  {data}  = yield call(articleTypedelete,{...payload});
			if(data.data){
				yield put({type:'findAllTree'})
				message.success('删除成功')
			}else{
				message.error(data.message)
			}
		},
		//分页
		*pagination({ payload }, { call, put }){
			const {data}=yield call(findAllarticle,{...payload})
			console.log(data,'data');
			if(data.data){
				const dataSource=[];
				data.data.content.map((item,index)=>(
					dataSource.push({
						number:index+1,
						key:item.id,
						type:item.type,
						sendDate:item.sendDate,
						status:item.status,
						headline:item.headline,
						readNO:item.readNO,
						comment:item.comment,
						collect:item.collect,
						recommend:item.recommend,
					})
				))
				yield put({type:'initail',
					payload:{
						dataSource:dataSource,
						keyword:payload.keyword,
						total:data.data.totalElements,
						pageNo:data.data.number+1,
					}
				})
			}else{
				message.error(data.message)
			}
		},
		//删除文章
		*deleteAritleType({ payload }, { call, put }){
			const {data}=yield call(deleteArticle,{...payload})
			if(data.data){
				message.success('删除成功')
				yield put({type:'pagination',payload:{
					type:payload.type,
					pageNo:payload.pageNo,
					keyword:payload.keyword,
				}})
			}
		},
		//查看文章
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
		//发布文章
		*releaseAritle({ payload }, { call, put }){
			const {data}=yield call(sendArticle,{...payload})
			if(data.data){
				message.success('发布成功')
				yield put({type:'pagination',payload:{
					type:payload.type,
					pageNo:payload.pageNo,
					keyword:payload.keyword,
				}})
			}else{
				message.error(`发布失败_${data.message}`)
			}
		},
		//取消发布
		*cancelReleaseAritle({ payload }, { call, put }){
			const {data}=yield call(downArticle,{...payload})
			if(data.data){
				message.success('取消发布成功')
				yield put({type:'pagination',payload:{
					type:payload.type,
					pageNo:payload.pageNo,
					keyword:payload.keyword,
				}})
			}else{
				message.error(`取消发布失败_${data.message}`)
			}
		},
		//推荐
		*recommend({ payload }, { call, put }){
			const {data}=yield call(stick,{...payload})
			if(data.data){
				message.success('推荐成功')
				yield put({type:'pagination',payload:{
					type:payload.type,
					pageNo:payload.pageNo,
					keyword:payload.keyword,
				}})
			}else{
				message.error(`推荐失败_${data.message}`)
			}
		},
		//取消推荐
		*cancelRecommend({ payload }, { call, put }){
			const {data}=yield call(abrogate,{...payload})
			if(data.data){
				message.success('取消推荐成功')
				yield put({type:'pagination',payload:{
					type:payload.type,
					pageNo:payload.pageNo,
					keyword:payload.keyword,
				}})
			}else{
				message.error(`取消推荐失败_${data.message}`)
			}
		},
		*addContentOk({ payload }, { call, put }){
			const {data}=yield call(addArticle,{...payload})
			if(data.data){
				message.success('添加成功')
				yield put({type:'findAllTree'})
			}else{
				message.error(`添加失败_${data.message}`)
			}
		},
		*editContent({ payload }, { call, put }){
			const {data}=yield call(editArticle,{...payload})
			if(data.data){
				message.success('编辑成功')
				yield put({type:'findAllTree'})
			}else{
				message.error(`编辑失败_${data.message}`)
			}
		},
		*findTrainArea({ payload }, { call, put }){
			const {data}=yield call(findAllAreasOpen,{...payload})
			if(data){
				yield put({type:'initail',payload:{
          richAreaOptions:_toCascaderOptions(data.data),
        }})
			}else{
				message.error('获取城市列表失败')
			}
		},

	},
	reducers: {
		initail(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
