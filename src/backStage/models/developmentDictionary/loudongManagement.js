import {initialization,deleteLoudong,
	addLoudong,
	editLoudong,
	editClickData,
	findGroup,
} from '../../services/developmentDictionary/loudongManagement';
import { message} from 'antd';
import { parse } from 'qs';
export default {
	namespace: 'loudongManagement',
	state: {
    dataSource:[],
		jianzhuType:[],//建筑类型
    xiaoQuName:'',
    addLongDongStatus:false,
		editStatus:false,
		pageNo:0,
		total:'',
		id:'',
		communityId:'',//小区编号
		buildingTypes:'',
    constructionTime:'',
    household:'',
    households:'',
    ladder:'',
    name:'',
    roomNumberStartingValue:'',
    totalNumberOfFloors:'',
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/developmentDictionary/residentialArea/loudongManagement') {
          dispatch({
            type: 'initial',
						payload:{
							communityId:location.state.communityId,
							xiaoQuName:location.state.xiaoQuName,
							pageNo:0,
						}
          });
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
      if(data){
				const loudongTableSource=[];
				data.data.content.map((item,index)=>{
					loudongTableSource.push({
						number:index+1,
						key:item.id,
				    name:item.name,
				    totalNumberOfFloors:item.totalNumberOfFloors,
				    ladder:item.ladder,
				    roomNumberStartingValue:item.roomNumberStartingValue,
				    households:item.households,
				    household:item.household,
					})
				})
        yield put ({
          type: 'initialSuccess',
          payload: {
						dataSource:loudongTableSource,
						communityId:payload.communityId,
						pageNo:data.data.number+1,
						total:data.data.totalElements,
						xiaoQuName:payload.xiaoQuName,
          },
        });
      }
    },
		*findLabel({ payload }, { call, put}){
			const  {data,err}  = yield call(findGroup, parse(payload));
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				const arrLabel=[];
				for(let i=0;i<data.data.length;i++){
          if(data.data[i].typeName=='楼栋建筑类型'){
            data.data[i].nameAndValues.map(item=>(
              arrLabel.push(item.value)
            ))
          }
        }
				yield put ({
					type: 'initialSuccess',
					payload: {
						jianzhuType:arrLabel,
					},
				});
			}
		},
    *pageNoChange({ payload }, { call, put, select }){
			payload.pageNo=payload.pageNo-1;
		  const  {data,err}  = yield call(initialization, {...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data){
				const loudongTableSource=[];
				data.data.content.map((item,index)=>{
					loudongTableSource.push({
						number:index+1,
						key:item.id,
				    name:item.name,
				    totalNumberOfFloors:item.totalNumberOfFloors,
				    ladder:item.ladder,
				    roomNumberStartingValue:item.roomNumberStartingValue,
				    households:item.households,
				    household:item.household,
					})
				})
        yield put ({
          type: 'initialSuccess',
          payload: {
						dataSource:loudongTableSource,
						pageNo:data.data.number+1,
						total:data.data.totalElements,
          },
        });
      }
    },
		*deleteOk({ payload }, { call, put,select }){
			const  {data,err}  = yield call(deleteLoudong, parse(payload));
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.status=='success'){
				const communityId=yield select(({loudongManagement})=>loudongManagement.communityId)
				payload.communityId=communityId;
				const {data} = yield call(initialization, parse(payload));
				if(data){
					const loudongTableSource=[];
					data.data.content.map((item,index)=>{
						loudongTableSource.push({
							number:index+1,
							key:item.id,
					    name:item.name,
					    totalNumberOfFloors:item.totalNumberOfFloors,
					    ladder:item.ladder,
					    roomNumberStartingValue:item.roomNumberStartingValue,
					    households:item.households,
					    household:item.household,
						})
					})
	        yield put ({
	          type: 'initialSuccess',
	          payload: {
							dataSource:loudongTableSource,
							pageNo:data.data.number+1,
							total:data.data.totalElements,
	          },
	        });
				}
			}else{
				message.error('删除失败');
				return;
			}
		},
		*addLongDongOnOk({ payload }, { call, put}){
			const  {data,err}  = yield call(addLoudong, parse(payload));
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.status=='success'){
				const {data} = yield call(initialization, parse(payload));
				if(data){
					const loudongTableSource=[];
					data.data.content.map((item,index)=>{
						loudongTableSource.push({
							number:index+1,
							key:item.id,
					    name:item.name,
					    totalNumberOfFloors:item.totalNumberOfFloors,
					    ladder:item.ladder,
					    roomNumberStartingValue:item.roomNumberStartingValue,
					    households:item.households,
					    household:item.household,
						})
					})
	        yield put ({
	          type: 'initialSuccess',
	          payload: {
	            communityId:payload.communityId,
							dataSource:loudongTableSource,
							addLongDongStatus:false,
							editStatus:false,
							pageNo:data.data.number+1,
							total:data.data.totalElements,
	          },
	        });
				}
			}else if(data.status=='error' && data.message=='当前小区楼栋名称已存在'){
				message.error('当前小区楼栋名称已存在');
				return;
			}else{
				message.error('创建失败');
				return;
			}
		},
		*editClick({ payload }, { call, put}){
			const  {data,err}  = yield call(editClickData, parse(payload));
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(!!data.data){
				yield put ({
					type: 'initialSuccess',
					payload: {
						id:payload.id,
						buildingTypes:data.data.buildingTypes,
				    constructionTime:(data.data.constructionTime===null?'':(data.data.constructionTime.toString())),
				    household:(data.data.household===null?'':(data.data.household.toString())),
				    households:(data.data.households===null?'':(data.data.households.toString())),
				    ladder:data.data.ladder,
				    name:data.data.name,
				    roomNumberStartingValue:(data.data.roomNumberStartingValue===null?'':(data.data.roomNumberStartingValue.toString())),
				    totalNumberOfFloors:(data.data.totalNumberOfFloors===null?'':(data.data.totalNumberOfFloors.toString())),
						editStatus:true,
						addLongDongStatus:true,
					},
				});
			}
		},
		*editLoudongOnOk({ payload }, { call, put}){
			const  {data,err}  = yield call(editLoudong, parse(payload));
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.status=='success'){
				const {data} = yield call(initialization, parse(payload));
				if(data){
					const loudongTableSource=[];
					data.data.content.map((item,index)=>{
						loudongTableSource.push({
							number:index+1,
							key:item.id,
					    name:item.name,
					    totalNumberOfFloors:item.totalNumberOfFloors,
					    ladder:item.ladder,
					    roomNumberStartingValue:item.roomNumberStartingValue,
					    households:item.households,
					    household:item.household,
						})
					})
					yield put ({
						type: 'initialSuccess',
						payload: {
							buildingTypes:'',
							constructionTime:'',
							household:'',
							households:'',
							ladder:'',
							name:'',
							roomNumberStartingValue:'',
							totalNumberOfFloors:'',
							editStatus:false,
							addLongDongStatus:false,
							communityId:payload.communityId,
							dataSource:loudongTableSource,
							pageNo:data.data.number+1,
							total:data.data.totalElements,
						},
					});
				}
			}
		}
	},
	reducers: {
		initialSuccess(state,{payload}){
			return { ...state, ...payload };
		},
		addLongDong(state,{payload}){
			return { ...state, addLongDongStatus:true };
		},
		// addLongDongOnOk(state,{payload}){
		// 	return { ...state, addLongDongStatus:false };
		// },
		addLongDongOnCancel(state,{payload}){
			return { ...state, addLongDongStatus:false,
				id:'',
				buildingTypes:'',
				jianzhuType:[],//建筑类型
				constructionTime:'',
				household:'',
				households:'',
				ladder:'',
				name:'',
				roomNumberStartingValue:'',
				totalNumberOfFloors:'',
				editStatus:false,
			};
		},
		editClickOnOk(state,{payload}){
			return { ...state, editStatus:false };
		},
		editClickCancel(state,{payload}){
			return { ...state, editStatus:false };
		},

	},
}
