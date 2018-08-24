import {
	addNewLabelFetch,
	getLabelTypeDataFetch,
	editLabelTypeFetch,
	deleteLabelTypeFetch,
	addLabelFetch,
	getLabelListDataFetch,
	editLabelFetch,
	deleteLabelFetch,
	changeStatus,
	findAllBrief,
	getAreaCodeFun,
	searchLabelfindAll,//搜索标签类别
	searchLabelContent,//搜索标签内容
	findOne,
	editTag,
	leiBiefindOne,
	leiBieedit,
} from '../services/labelManagement/labelManagement';
const _getNameArrByCode=(arr, code)=>{
  var nameArr = [], item;
  for(var i=arr.length-1; i>=0; i--){
    item = arr[i];
    if(item.code == code){
      nameArr.push(item.lable);
      if(item.pCode){
        code = item.pCode;
      }else {
        break;
      }
    }
  }
  nameArr.reverse();
  return nameArr;
}
const _getCode=(arr, code)=>{
  var nameArr = [], item;
  for(var i=arr.length-1; i>=0; i--){
    item = arr[i];
    if(item.code == code){
      nameArr.push(item.code);
      if(item.pCode){
        code = item.pCode;
      }else {
        break;
      }
    }
  }
  nameArr.reverse();
  return nameArr;
}
const _getNamePathsByCode=(arr, code)=>{
  var nameArr = _getNameArrByCode(arr, code);
  return "/"+nameArr.join("/");
}
const _toCascaderOptions=(arr)=>{
  var options = [];
  var map = {};
  arr.forEach(({code,pCode,lable})=>{
    var option = {value: code, label:lable}, children;
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
import { parse } from 'qs';
import {message} from 'antd';
const initialState={
	//添加类别Modal
	AddCategoryModalVisible:false,

	//Category里面的表格相关state
	currentEditRecord:null,//当前被编辑项的Index
	currentEditValue:null,//只用于页面暂时显示用
	willUpdateValue:null,//上传到服务器修改的值
	//标签内容页面
	AddLabelModalVisible:false,
	labelTypesData:[],
	categoryName:[],
	totalType:1,
	currentType:0,
	biaoqianLeibie:[],//标签类别搜索下拉框
	tabActiveKey:'labelType',
	loading:true,
	labelTypesNameList:[],
	labelListData:[],
	searchOptions:[],
	searchArr:[],
	id:'',//标签内容id
	typeName:'',//标签类别
	typeId:'',//标签类别
	value:'',//标签内容值
	name:'',//标签名称
	areaPath:'',
	editTagContentModal:false,//编辑标签的模态框
	editTagLeiBieModal:false,
	leiBieId:'',
	leiBieName:'',
	options:[],//标签类别的城市
	areaCityOptions:[],//后端返回的原数组,
	editOptions:[],//编辑时城市级联的默认值
	showPicList:[],
};
export default {
	namespace: 'labelManagement',
	state:initialState,
	effects: {
		//添加标签类别
		*addLabelType({payload},{call,put}){
			const {data}=yield call(addNewLabelFetch,{...payload});
			if(!!data && data.status=='success'){
				message.success('添加成功！');
				yield put({type:'closeAddLabelTypeModal'})
				yield put({type:'getLabelTypeData'})
			}else{
				message.error(`添加失败,${data.message}`);
			}
		},
		*handleOkLeiBie({payload},{call,put}){
			const {data}=yield call(leiBieedit,{...payload});
			if(data.data){
				yield put({
					type:'setState',
					payload:{
						editTagLeiBieModal:false,
						leiBieName:'',
						leiBieId:'',
						editOptions:[],
					}
				})
				yield put({type:'getLabelTypeData'})
			}else{
				message.error(data.message)
			}
		},
		//编辑标签类别时获取数据
		*editTagLeiBie({payload},{call,put,select}){
			const {data}=yield call(leiBiefindOne,{...payload})
			const yuanOption=yield call(getAreaCodeFun)
			const yuanOptions=_toCascaderOptions(yuanOption.data.data);
			let editOption;
			editOption=_getCode(yuanOption.data.data,data.data.areaCode);
			if(data.data){
				yield put({
					type:'initLabelTypesData',
					payload:{
						leiBieId:data.data.id,
						leiBieName:data.data.name,
						editOptions:editOption,//标签类别的城市
						arrOption:yuanOption.data.data,
						options:yuanOptions,
						editTagLeiBieModal:true,
					}
				})
			}else{
				message.error(`加载数据失败,${data.message}`);
			}
		},
		//启用/停用
		*stopCategory({payload},{call,put}){
			const {data}=yield call(changeStatus,{id:payload.id});
			if(!!data && data.status=='success'){
				message.success('操作成功！')
				payload.resolve();
				yield put({type:'getLabelTypeData'})
			}else{
				message.error(`操作失败,${data.message}`);
				payload.resolve();
			}
		},
		//搜索标签类别
		*searchLabel({payload},{call,put}){
			const {data}=yield call(searchLabelfindAll,{...payload});
			if(data.data){
				const labelTypesData=data.data.content.map((item,index)=>({
					serialNumber:item.id,
					key:item.id,
					number:index+1,
					name:item.name,
					areaPath:(item.areaPath==null?'':item.areaPath.replace('/','').replace('/','-')),
					openDateTime:item.optTime,
					updataPerson:item.optUserName,
					status:item.status,
				}))
				yield put({
					type:'initLabelTypesData',
					payload:{
						labelTypesData,
						totalType:data.data.totalElements,
						currentType:data.data.number+1,
						loading:false,
						areaPath:payload.areaPath,
						name:payload.name,
						status:payload.status,
					},
				})
			}else{
				message.error(data.message)
			}
		},
		//编辑时获取标签内容
		*getEidtTagContent({payload},{call,put}){
			const {data}=yield call (findOne,{id:payload})
			console.log(data,'data');
			if(!!data.data){
				let showPic=[];
				if(!!data.data.url){
					showPic.push({
            id:data.data.url,
            isCover:false,
            name:'',
            rename:false,
            src:data.data.url,
          })
				}
				yield put({
					type:'initLabelTypesData',
					payload:{
						id:data.data.id,
						value:data.data.value,
						name:data.data.name,
						typeName:data.data.typeName,
						typeId:data.data.typeId,
						editTagContentModal:true,
						showPicList:showPic,
					}
				})
			}else{
				message.error(`获取标签信息失败,${data.message}`);
			}
		},
		//编辑标签内容
		*handleOkeditModal({payload},{call,put}){
			const {data}=yield call(editTag,{...payload});
			if(data.data){
				yield put({type:'getLabelData'}),
				yield put ({type:'setState',
					payload:{
						editTagContentModal:false,
					}
				})
				message.success('编辑成功')
			}else{
				message.error(`编辑失败,${data.message}`);
			}
		},
		//搜索标签内容
		*searchContent({payload},{call,put}){
			const {data}=yield call(searchLabelContent,{...payload});
			if(data.data){
				const labelListData=data.data.content.map((item,index)=>({
					serialNumber:item.id,
					key:item.id,
					number:index+1,
					name:item.name,
					aerasName:item.aerasName,
					value:item.value,
					labelType:item.typeName,
					openDateTime:item.optTime,
					updataPerson:item.optUserName,
					status:item.status,
				}))
				yield put({
					type:'initLabelListData',
					payload:{
						labelListData,
						totalType:data.data.totalElements,
						currentType:data.data.number+1,
						loading:false,
						name:payload.name,
						status:payload.status,
						typeName:payload.typeName,
						value:payload.value,
					},
				})
			}else{
				message.error(data.message)
			}
		},
		//添加标签
		*addLabel({payload},{call,put}){
			const {data}=yield call(addLabelFetch,{...payload});
			if(!!data && data.status=='success'){
				message.success('添加成功！');
				yield put({type:'closeAddLabelModal'})
				yield put({type:'getLabelData'})
			}else{
				message.error(`添加失败,${data.message}`);
			}
		},
		//查询标签类别数据列表
		*getLabelTypeData({payload},{call,put}){
			yield put({
				type:'setTableLoading',
				payload:false,
			})
			const {data}=yield call(getLabelTypeDataFetch,{...payload});
			const options=yield call(getAreaCodeFun);
			if(!!data && data.status=='success'){
				const labelTypesData=data.data.content.map((item,index)=>({
					serialNumber:item.id,
					key:item.id,
					number:index+1,
					areaPath:(item.areaPath==null?'':item.areaPath.replace('/','').replace('/','-')),
					name:item.name,
					openDateTime:item.optTime,
					updataPerson:item.optUserName,
					status:item.status,
				}))
				yield put({
					type:'initLabelTypesData',
					payload:{
						labelTypesData:labelTypesData,
						totalType:data.data.totalElements,
						currentType:data.data.number+1,
						searchOptions:_toCascaderOptions(options.data.data),
						searchArr:options.data.data,
						loading:false,
					},
				})
			}else{
				message.error(`获取标签类型失败,${data.message}`);
			}
		},
		//添加标签类别获取区域
		*getAreaCode({payload},{call,put}){
			const {data}=yield call(getAreaCodeFun,{...payload});
			yield put({
				type:'setState',
				payload:{
					options:_toCascaderOptions(data.data),
					AddCategoryModalVisible:true,
					areaCityOptions:data.data,
				},
			})
		},
		//查询标签数据列表
		*getLabelData({payload},{call,put}){
			yield put({
				type:'setTableLoading',
				payload:false,
			})
			const {data}=yield call(getLabelListDataFetch,{...payload});
			if(!!data && data.status=='success'){
				const labelListData=data.data.content.map((item,index)=>({
					serialNumber:item.id,
					key:item.id,
					aerasName:item.aerasName,
					areaPath:(item.areaPath==null?'':item.areaPath.replace('/','').replace('/','-')),
					name:item.name,
					number:index+1,
					value:item.value,
					typeName:item.typeName,
					typeId:item.typeId,
					labelType:item.typeName,
					openDateTime:item.optTime,
					updataPerson:item.optUserName,
					status:item.status,
				}))
				yield put({
					type:'initLabelListData',
					payload:{
						labelListData:labelListData,
						totalType:data.data.totalElements,
						currentType:data.data.number+1,
						loading:false,
					},
				})
			}else{
				message.error(`获取标签失败,${data.message}`);
			}
		},
		*eidtLabelType({payload},{select,call,put}){
			const {currentEditValue,currentEditRecord,labelTypesData}=yield select(({labelManagement})=>labelManagement);
			yield put({
				type:'setState',
				payload:{
					currentEditRecord:null,
					currentEditValue:null,
				}
			})

			const {data}=yield call(editLabelTypeFetch,{name:currentEditValue,id:labelTypesData[currentEditRecord].serialNumber})
			if(!!data && data.status=='success'){
				message.success('编辑成功！')
				yield put({type:'getLabelTypeData'})
			}else{
				message.error(`编辑失败,${data.message}`);
			}
		},
		*eidtLabel({payload},{select,call,put}){
			const {currentEditValue,currentEditRecord,labelListData}=yield select(({labelManagement})=>labelManagement);
			yield put({
				type:'setState',
				payload:{
					currentEditRecord:null,
					currentEditValue:null,
				}
			})
			const {data}=yield call(editLabelFetch,{
				name:currentEditValue,
				id:labelListData[currentEditRecord].serialNumber,
				typeId:labelListData[currentEditRecord].typeId,
			});
			if(!!data && data.status=='success'){
				message.success('编辑成功！')
				yield put({type:'getLabelData'})
			}else{
				message.error(`编辑失败,${data.message}`);
			}
		},

		*deleteLabelType({payload},{call,put}){
			const {data}=yield call(deleteLabelTypeFetch,{id:payload});
			if(!!data && data.status=='success'){
				message.success('删除成功！')
				yield put({type:'getLabelTypeData'})
			}else{
				message.error(`删除失败,${data.message}`);
			}
		},
		*deleteLabel({payload},{call,put}){
			const {data}=yield call(deleteLabelFetch,{id:payload});
			if(!!data && data.status=='success'){
				message.success('删除成功！')
				yield put({type:'getLabelData'})
			}else{
				message.error(`删除失败,${data.message}`);
			}
		},
		*changeLabelTypeCurrent({payload},{call,put}){
			// yield put({
			// 	type:'changeTypeCurrent',
			// 	payload,
			// })
			const {data}=yield call(getLabelTypeDataFetch,{...payload});
			if(!!data && data.status=='success'){
				const labelTypesData=data.data.content.map((item,index)=>({
					serialNumber:item.id,
					key:item.id,
					number:index+1,
					areaPath:(item.areaPath==null?'':item.areaPath.replace('/','').replace('/','-')),
					name:item.name,
					openDateTime:item.optTime,
					updataPerson:item.optUserName,
					status:item.status,
				}))
				console.log(labelTypesData,'labelTypesDatalabelTypesData');
				yield put({
					type:'initLabelTypesData',
					payload:{
						labelTypesData:labelTypesData,
						totalType:data.data.totalElements,
						currentType:data.data.number+1,
						loading:false,
					},
				})
			}else{
				message.error(`获取标签类型失败,${data.message}`);
			}
		},
		*changeLabelCurrent({payload},{call,put}){
			// yield put({
			// 	type:'changeTypeCurrent',
			// 	payload,
			// })
			const {data}=yield call(getLabelListDataFetch,{...payload});
			if(!!data && data.status=='success'){
				const labelListData=data.data.content.map((item,index)=>({
					serialNumber:item.id,
					key:item.id,
					number:index+1,
					aerasName:item.aerasName,
					name:item.name,
					areaPath:(item.areaPath==null?'':item.areaPath.replace('/','').replace('/','-')),
					value:item.value,
					labelType:item.typeName,
					openDateTime:item.optTime,
					updataPerson:item.optUserName,
					status:item.status,
				}))
				yield put({
					type:'initLabelListData',
					payload:{
						labelListData:labelListData,
						totalType:data.data.totalElements,
						currentType:data.data.number+1,
						loading:false,
					},
				})
			}else{
				message.error(`获取标签类型失败,${data.message}`);
			}
		},
		*openAddLabelModal({payload},{call,put}){
			yield put({
				type:'changeAddLabelModal',
				payload:true,
			})
			const {data}=yield call(findAllBrief);
			if(!!data && data.status=='success'){
				const labelTypesNameList=data.data.map(item=>({
					id:item.id,
					name:item.name,
				}))
				yield put({
					type:'initLabelTypesNameList',
					payload:labelTypesNameList,
				})
			}else{
				message.error(`获取标签类型失败,${data.message}`);
			}
		},
		*findAllBriefArr({payload},{call,put}){
			const {data}=yield call(findAllBrief);
			if(!!data && data.status=='success'){
				const labelTypesNameList=data.data.map(item=>({
					id:item.id,
					name:item.name,
				}))
				yield put({
					type:'initLabelTypesNameList',
					payload:labelTypesNameList,
				})
			}else{
				message.error(`获取标签类型失败,${data.message}`);
			}
		},
		*toggleTab({payload},{call,put}){
			yield put({
				type:'changeTabKey',
				payload,
			})
			if(payload==='labelType'){
				yield put({type:'getLabelTypeData'})
			}else{
				yield put({type:'getLabelData'})
				const {data}=yield call(findAllBrief,{...payload});
				const categoryName=[];
				if(data.data){
					data.data.map(item=>(
						categoryName.push(
							{
								name:item.name,
								id:item.id,
							}
						)
					))
				}
				yield put ({
					type:'setState',
					payload:{
						categoryName:categoryName,
					}
				})
			}
		},
	},
	reducers: {
		setState(state,{payload}){
			return { ...state, ...payload };
		},
		initLabelTypesData(state,action){
			return {...state,...action.payload}
		},
		initLabelListData(state,action){
			return {...state,...action.payload}
		},
		changeTypeCurrent(state,action){
			return {...state,currentType:action.payload,loading:true}
		},
		resetState(state){
			return {
				...state,
				...initialState
			};
		},
		setTableLoading(state,action){
			return {...state,loading:action.payload}
		},
		closeAddLabelTypeModal(state,action){
			return {...state,AddCategoryModalVisible:false}
		},
		closeAddLabelModal(state,action){
			return {...state,AddLabelModalVisible:false}
		},
		changeAddLabelModal(state,action){
			return {...state,AddLabelModalVisible:action.payload}
		},
		initLabelTypesNameList(state,action){
			return {...state,labelTypesNameList:action.payload}
		},
		changeTabKey(state,action){
			return {...state,tabActiveKey:action.payload,loading:true}
		},
	},
	subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/labelManagement/labelConfiguration') {
					dispatch({
						type: 'getLabelTypeData',
					});
				}
			});
		},
	}
}
