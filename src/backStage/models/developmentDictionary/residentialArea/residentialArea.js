import {query, findAllCities, addCity, addZone, closeCity, openCity, queryZones, queryExistsArea, switchZone,editZone} from '../../../services/residentialArea/residentialArea';
import { parse } from 'qs';
import {message} from 'antd';

export default {
  namespace: 'residentialArea',
  state: {
  	//Index页面
    selectedCity:{
      datas: [],
      value: ""
    },
		activeKey:'已发布',
		//已开通发布城市表格 已发布
		tablePublish:{
    	response:{},
			tableLoading:false,
		},
		//未开通城市表格 未发布
		tableNotPublish:{
			response:{},
			tableLoading:false,
		},
		//已关闭城市表格 已下架
		tableClose:{
			response:{},
			tableLoading:false,
		},
		//添加城市Modal
		addCityModalState:{
			provinceCode:'',
			submitLoading:false,
			visible:false,
			city:[],
		},
		//下架Modal
		closeCityModal:{
			visible:false,
			submitLoading:false,
			code:'',
		},
		//搜索条
		searchLoading:false,

		//区划管理页面
		zones:[],//当前城市下所包含的区域
		activeAreaId:'',
		cityResponse:{},
		currentCityId:'',
		currentCityName:'',
		currentCityStatus:'',
		firstAreaId:null,
		firstAreaName:'',
		areaResponse:{},
		tableLoading:false,
		currentProvince:'',
		currentPage:0,

		//编辑需用state
		editState:false,//是否在编辑状态
		editId:'',
		editName:'',
		editPy:'',

		//新增区域模态框
		addAreaModal:{
			parentId:'',
			visible:false,
			submitLoading:false,
			isAdd:false,
			otherArea:false,

			//判断当前选择区域是否存在
			areas:[],//当前城市下已经存在的区域
			disabled:false,
			existsAreaPy:''
		},

		//新增片区Modal
		addPianQuModal:{
			parentId:'',
			visible:false,
			submitLoading:false,
			isAdd:false,
		},


  },
	effects: {
    *findAllCities(prop, {call ,put, select}){
      const response = yield call(findAllCities);
      const selectedCity=yield select(({residentialArea})=>residentialArea.selectedCity);
      console.log('findAllCities返回的response:',response);
      if(response.data.status){
				yield put({
					type:'setState',
					payload:{
						selectedCity:{
							...selectedCity,
							datas:response.data.data || [],
						}
					}
				})
			}
			(response.data.status=='error')&&message.info('查询错误！'+response.data.message,6)
    },
		*queryExistsArea({payload},{call ,put, select}){
			const addAreaModal=yield select(({residentialArea})=>residentialArea.addAreaModal);
			const response = yield call(queryExistsArea,payload);
			console.log('queryAreaCity返回的response:',response);
			if(response.data.status){
				yield put({
					type:'setState',
					payload:{
						addAreaModal:{
							...addAreaModal,
							areas:response.data.data,
						}
					}
				})
			}
			(response.data.status=='error')&&message.info('查询错误！'+response.data.message,6)
		},
  	//查询城市--区划管理页面专用
		*queryAreaCity({payload},{call ,put, select}){
			const response = yield call(query,payload);
			console.log('queryAreaCity返回的response:',response);
			if(response.data){

				yield put({
					type:'setState',
					payload:{cityResponse:response,}
				});

			}
			response.err&&message.info('查询失败!'+response.err.message,6)
		},
    *queryAllList({payload},{call ,put, select}){
      yield put({type:'query',payload:{state:'已发布'}});
      yield put({type:'query',payload:{state:'已下架'}});
      yield put({type:'query',payload:{state:'未发布'}});
    },
  	//查询
		*query({ payload }, { call, put, select }) {
			const tablePublish=yield select(({residentialArea})=>residentialArea.tablePublish);
			const tableNotPublish=yield select(({residentialArea})=>residentialArea.tableNotPublish);
			const tableClose=yield select(({residentialArea})=>residentialArea.tableClose);
			//处理tableLoading
			switch (payload.state){
        case '已发布':
          yield put({type:'setState',payload:{tablePublish:{...tablePublish,tableLoading:true}}})
          break;
				case '已下架':
					yield put({type:'setState',payload:{tableClose:{...tableClose,tableLoading:true}}})
					break;
				case '未发布':
					yield put({type:'setState',payload:{tableNotPublish:{...tableNotPublish,tableLoading:true}}})
					break;
				default:
					break;
			}
			const response = yield call(query,payload);
			console.log('query返回的response:',response);
			if(response.data){
				switch (response.data.status){
					case 'success':
						//处理一下数据,给每条数据加一个key
						let result=response.data.data.content;
						for(let i=0;i<result.length;i++){
								result[i].key=i+1;
						}

						switch (payload.state){
							case '已发布':
								yield put({
									type:'setState',
									payload:{
										tablePublish:{
											response:response,
											tableLoading:false,
										}
									}
								});
								break;
							case '已下架':
								yield put({
									type:'setState',
									payload:{
										tableClose:{
											response:response,
											tableLoading:false,
										}
									}
								});
								break;
							case '未发布':
								yield put({
									type:'setState',
									payload:{
										tableNotPublish:{
											response:response,
											tableLoading:false,
										}
									}
								});
								break;
							default:
								break;
						}
						break;
					default:
						break;
				}
			}
			if(response.err){
				message.info('查询失败!'+response.err.message,6)
			}
		},
		//添加目标省市
		*addCity({ payload }, { call, put, select}) {
			const addCityModalState=yield select(({residentialArea})=>residentialArea.addCityModalState);
			yield put({type:'setState',payload:{addCityModalState:{...addCityModalState, submitLoading:true}}});
			const response  = yield call(addCity, parse(payload.params));
			console.log('add返回的response:',response);
			switch (response.data.status){
				case 'success':
					message.info('添加成功',6);
					payload.form.resetFields();
					yield put({
						type:'setState',
						payload:{
							addCityModalState:{
								...addCityModalState,
								submitLoading:false,
								visible:false,
							},
						}
					});
					yield put({type:'query',payload:{state:'准备中',}});
					break;
				case 'error':
					message.info('添加失败！'+response.data.message,6);
					payload.form.resetFields();
					yield put({type:'setState',payload:{addCityModalState:{...addCityModalState,submitLoading:false}}});
					break;
				default:
					break;
			}
			response.err&&message.info('添加失败!'+response.err,6);
		},
		//添加区域/区划
		*addZone({ payload }, { call, put, select }) {
			const currentCityName=yield select(({residentialArea})=>residentialArea.currentCityName);
			const currentCityStatus=yield select(({residentialArea})=>residentialArea.currentCityStatus);
			const activeAreaId=yield select(({residentialArea})=>residentialArea.activeAreaId);
			const response  = yield call(addZone, parse(payload.params));
			console.log('addZone返回的response:',response);
			if(response.data.status=='success'){
				message.info('添加成功');
				payload.closeModal();
				//查询城市，获取区域
				yield put({
					type:'queryAreaCity',
					payload:{
						keyword:currentCityName,
						state:currentCityStatus
					}
				})
				//查询片区
				yield put({type:'queryZones',payload:{id:activeAreaId}});
			}
			if(response.data.status=='error'){
				message.info('添加失败，'+response.data.message,4)
			}
			response.err&&message.info('添加失败:',response.err);
		},
		//区划管理查询
		*queryZones({ payload }, { call, put, select }) {
			yield put({type:'setState',payload:{tableLoading:true}});
			console.log('接收到的payload',payload);
			const response = yield call(queryZones,payload);
			console.log('queryZones返回的response:',response);
			if(response.data){
				switch (response.data.status){
					case 'success':
						//处理一下数据,给每条数据加一个key
						let result=response.data.data.content;
						for(let i=0;i<result.length;i++){
							result[i].key=i+1;
						}
						yield put({type:'setState',payload:{areaResponse:response,tableLoading:false,}});
						break;
					case 'error':
						// message.info('查询失败！'+response.data.message,4);
						yield put({type:'setState',payload:{tableLoading:false}});
					default:
						break;
				}
			}
			if(response.data.status=='error'){
				yield put({type:'setState',payload:{areaResponse:{},tableLoading:false,}});
			}
			response.err&&message.info('查询失败!'+response.err.message,6);
		},
		//调整片区顺序switchZone
		*switchZone({ payload }, { call, put, select }){
			const activeAreaId=yield select(({residentialArea})=>residentialArea.activeAreaId);
			const currentPage=yield select(({residentialArea})=>residentialArea.currentPage);
			const response = yield call(switchZone,payload);
			console.log('switchZone返回的response:',response);
			if(response.data.status=='success'){
				//刷新页面
				yield put({
					type:'queryZones',
					payload:{
						id:activeAreaId,
						pageNo:currentPage,
					}});
			}
			response.err&&message.info('系统出错！',6)
		},

		//编辑片区
		*editZone({ payload }, { call, put, select }){
			const response = yield call(editZone,payload);
			console.log('editZone返回的response:',response);
			if(response.data.status=='success'){
				const activeAreaId=yield select(({residentialArea})=>residentialArea.activeAreaId);
				yield put({type:'queryZones',payload:{id:activeAreaId}});
				yield put({type:'setState', payload:{editState:false}})
			}
			response.err&&message.info('修改失败！',6)
		},

		//关闭城市
		*closeCity({ payload }, { call, put, select }) {
			const closeCityModal=yield select(({residentialArea})=>residentialArea.closeCityModal);
			yield put({type:'setState',payload:{closeCityModal:{...closeCityModal,submitLoading:true}}});
			const response  = yield call(closeCity, parse(payload.params));
			console.log('关闭城市返回的response:',response);
			if(response.data.status=='success'){
				message.info('关闭成功',6);
				yield put({
					type:'setState',
					payload:{
						closeCityModal:{
							...closeCityModal,
							submitLoading:false,
							visible:false,
						}
					}
				});
				payload.form.resetFields();
				yield put({type:'query',payload:{state:'开通'}});
				yield put({type:'query',payload:{state:'关闭'}})
			}

		},
		//开通城市
		*openCity({ payload }, { call, put }) {
			const response  = yield call(openCity, parse(payload.params));
			console.log('开通城市返回的response:',response);
			if(response.data.status=='success'){
				message.info('开通成功',6);
				payload.resolve();
				yield put({type:'query',payload:{state:'开通'}});
				yield put({type:'query',payload:{state:'准备中'}});
				yield put({type:'query',payload:{state:'关闭'}})
			}
		},
	},
	reducers: {
    openAddCityModal(state){
      return{...state,addCityModalState:{...state.addCityModalState,visible:true}}
    },
    closeAddCityModal(state){
      return{...state,addCityModalState:{...state.addCityModalState,visible:false}}
    },
		setState(state,{payload}){
			return { ...state, ...payload };
		},
  },
	subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/developmentDictionary/residentialArea') {
              dispatch({type: 'findAllCities'});
              dispatch({type: 'queryAllList'});
				}else if(location.pathname==='/residentialArea/openCity/divisionManagement'){
					//发起fetch区划管理页面 初始数据
					dispatch({
						type:'setState',
						payload:{
							currentProvince:location.state.currentProvince,
							currentCityId:location.state.currentCityId,
							currentCityName:location.state.currentCityName,
							currentCityStatus:location.state.currentCityStatus,
							// firstAreaName:record.zones[0]?record.zones[0].name:null,
							activeAreaId:location.state.activeAreaId,
							firstAreaId:location.state.firstAreaId,
							// zones:record.zones,
						}
					});
					//通过关键字、状态查询到对应城市，再通过对应城市查询到下面的区域
					dispatch({
						type:'queryAreaCity',
						payload:{
							keyword:location.state.currentCityName,
							state:location.state.currentCityStatus
						}
					});
					//查询第一个区域的 片区
					dispatch({type:'queryZones',payload:{id:location.state.firstAreaId}});
				}
			});

		},
	}
}
