import {initialization,deleteOfficeBuildingBuilding,
	addOfficeBuildingBuilding,
	findOfficeBuildingBuilding,
	editOfficeBuildingBuilding,
	findGroup,
} from '../../services/developmentDictionary/officeLoudongManagement';
import { parse } from 'qs';
import { message} from 'antd';
export default {
	namespace: 'officeLoudongManagement',
	state: {
		id:'',
		officeName:'',
		jianzhuType:[],//建筑类型
    dataSource:[],
		createLoudong:false,
		editStatus:false,//编辑状态
		buildingTypes:'',
    communityId:'',
    constructionTime:'',
    eachLayerOfRoomNumber:'',
    roomPrefix:'',
    name:'',
    roomNumberStartingValue:'',
    totalNumberOfFloors:'',
		loading: false,//当前table的加载状态
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/developmentDictionary/officeBuilding/officeLoudongManagement') {
					dispatch({
						type:'initialSuccess',
						payload:{
							loading:true,
						}
					})
					dispatch({
            type: 'initial',
						payload:{
							communityId:location.state.communityId,
							officeName:location.state.officeName,
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
			if(data.data){
				const loudongTableSource=[];
				data.data.content.map((item,index)=>{
					loudongTableSource.push({
						number:index+1,
						key:item.id,
				    name:item.name,
				    totalNumberOfFloors:item.totalNumberOfFloors,
				    eachLayerOfRoomNumber:item.eachLayerOfRoomNumber,
				    roomPrefix:item.roomPrefix,
				    roomNumberStartingValue:item.roomNumberStartingValue,
					})
				})
        yield put ({
          type: 'initialSuccess',
          payload: {
						dataSource:loudongTableSource,
						communityId:payload.communityId,
						pageNo:data.data.number+1,
						total:data.data.totalElements,
						officeName:payload.officeName,
						loading:false,
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
      if(data.data){
				const loudongTableSource=[];
				data.data.content.map((item,index)=>{
					loudongTableSource.push({
						number:index+1,
						key:item.id,
				    name:item.name,
				    totalNumberOfFloors:item.totalNumberOfFloors,
				    eachLayerOfRoomNumber:item.eachLayerOfRoomNumber,
				    roomPrefix:item.roomPrefix,
				    roomNumberStartingValue:item.roomNumberStartingValue,
					})
				})
        yield put ({
          type: 'initialSuccess',
          payload: {
						dataSource:loudongTableSource,
						pageNo:data.data.number+1,
						total:data.data.totalElements,
						loading:false,
          },
        });
      }
    },
		*officeDeleteOk({ payload }, { call, put,select }){
			const  {data,err}  = yield call(deleteOfficeBuildingBuilding, parse(payload));
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.status=='success'){
				const communityId=yield select(({officeLoudongManagement})=>officeLoudongManagement.communityId)
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
					    eachLayerOfRoomNumber:item.eachLayerOfRoomNumber,
					    roomPrefix:item.roomPrefix,
					    roomNumberStartingValue:item.roomNumberStartingValue,
						})
					})
	        yield put ({
	          type: 'initialSuccess',
	          payload: {
							dataSource:loudongTableSource,
							pageNo:data.data.number+1,
							total:data.data.totalElements,
							loading:false,
	          },
	        });
				}
			}else{
				message.error('删除失败');
				yield put ({
					type: 'initialSuccess',
					payload: {
						loading:false,
					},
				});
				return;
			}
		},
		*handleOk({ payload }, { call, put}){
			const  {data,err}  = yield call(addOfficeBuildingBuilding, parse(payload));
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
					    eachLayerOfRoomNumber:item.eachLayerOfRoomNumber,
					    roomNumberStartingValue:item.roomNumberStartingValue,
					    roomPrefix:item.roomPrefix,
						})
					})
	        yield put ({
	          type: 'initialSuccess',
	          payload: {
	            communityId:payload.communityId,
							dataSource:loudongTableSource,
							createLoudong:false,
							editStatus:false,
							loading:false,
							pageNo:data.data.number+1,
							total:data.data.totalElements,
	          },
	        });
				}
			}else if(data.status=='error' && data.message=='当前商铺楼栋名称已存在'){
				message.error('当前商铺楼栋名称已存在');
				yield put ({
					type: 'initialSuccess',
					payload: {
						communityId:payload.communityId,
						createLoudong:false,
						editStatus:false,
						loading:false,
					},
				});
				return;
			}else{
				message.error('创建失败');
				return;
			}
		},
		*editClick({ payload }, { call, put}){
			const  {data,err}  = yield call(findOfficeBuildingBuilding, parse(payload));
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				yield put ({
					type: 'initialSuccess',
					payload: {
						id:payload.id,
						buildingTypes:data.data.buildingTypes,
						constructionTime:(data.data.constructionTime===null?'':(data.data.constructionTime.toString())),
						eachLayerOfRoomNumber:(data.data.eachLayerOfRoomNumber===null?'':(data.data.eachLayerOfRoomNumber.toString())),
						name:data.data.name,
						roomNumberStartingValue:(data.data.roomNumberStartingValue===null?'':(data.data.roomNumberStartingValue.toString())),
						roomPrefix:data.data.roomPrefix,
						totalNumberOfFloors:(data.data.totalNumberOfFloors===null?'':(data.data.totalNumberOfFloors.toString())),
						editStatus:true,
						createLoudong:true,
					},
				});
			}
		},
		*edithandleOk({ payload }, { call, put}){
			const  {data,err}  = yield call(editOfficeBuildingBuilding, parse(payload));
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
					    eachLayerOfRoomNumber:item.eachLayerOfRoomNumber,
					    roomNumberStartingValue:item.roomNumberStartingValue,
					    roomPrefix:item.roomPrefix,
						})
					})
					yield put ({
						type: 'initialSuccess',
						payload: {
							buildingTypes:'',
					    communityId:'',
					    constructionTime:'',
					    eachLayerOfRoomNumber:'',
					    roomPrefix:'',
					    name:'',
					    roomNumberStartingValue:'',
					    totalNumberOfFloors:'',
							editStatus:false,
							createLoudong:false,
							loading:false,
							communityId:payload.communityId,
							dataSource:loudongTableSource,
							pageNo:data.data.number+1,
							total:data.data.totalElements,
						},
					});
				}
			}else if(data.status=='error' && data.message=='当前写字楼楼栋名称已存在'){
				message.error('当前写字楼楼栋名称已存在');
				yield put ({
					type: 'initialSuccess',
					payload: {
						loading:false,
					},
				});
				return;
			}else{
				message.error('编辑失败');
				return ;
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
		}
	},
	reducers: {
		initialSuccess(state,{payload}){
			return { ...state, ...payload };
		},
		handleCancel(state,{payload}){
			return { ...state, createLoudong:false,
				id:'',
				buildingTypes:'',
				jianzhuType:[],
				constructionTime:'',
				eachLayerOfRoomNumber:'',
				name:'',
				roomNumberStartingValue:'',
				roomPrefix:'',
				totalNumberOfFloors:'',
				editStatus:false,
			};
		},
		addLoudong(state,{payload}){
			return { ...state,createLoudong:true};
		},
	},
}
