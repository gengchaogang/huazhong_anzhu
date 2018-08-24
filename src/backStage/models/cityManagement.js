import {query,editArea,deleteZone, findArea,queryfindArea,countCities,findNotAddCities,addCity, addZone, closeCity, openCity, queryZones, queryExistsArea, switchZone,editZone} from '../services/cityManagement/cityManagement';
import { parse } from 'qs';
import {message} from 'antd';
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
export default {
  namespace: 'cityManagement',
  state: {
  	//Index页面
		activeKey:'开通',
		//已开通城市表格
		tableOpen:{
    	response:{},
			tableLoading:false,
		},
		//未开通城市表格
		tableAdded:{
			response:{},
			tableLoading:false,
		},
		//已关闭城市表格
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
		//关闭城市Modal
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
    close:'',
    open:'',
    prepare:'',
    arrOptions:[],//城市原数组（未处理）
    options:[],//城市级联数字
    cityCode:'',//城市编码
    cityOptions:[],
    cityOptionCodes:[],
    eidtCityModalopened:false,//打开已开通编辑的模态框
    cityOpenCode:'',//开通城市编码
    eidtCityModalpreparation:false,//打卡准备中的编辑模态框
    cityPreparationCode:'',//准备中城市编码
    eidtCityModalClosed:false,
    cityClosedCode:'',
    firstName:'',
  },
	effects: {
		*queryExistsArea({payload},{call ,put, select}){
			const addAreaModal=yield select(({cityManagement})=>cityManagement.addAreaModal);
      const activeAreaId=yield select(({cityManagement})=>cityManagement.activeAreaId);
      const response = yield call(queryExistsArea,payload);
      let cityOption=[];
      let cityOptionCode=[];
      const originalArray=response.data.data;
			if(response.data.status){
        response.data.data.map(item=>(
          cityOption.push(item.name),
          cityOptionCode.push({code:item.code,name:item.name})
        ))
				yield put({
					type:'setState',
					payload:{
						addAreaModal:{
							...addAreaModal,
							areas:response.data.data,
						},
            cityOptions:cityOption,
            cityOptionCodes:cityOptionCode,
					}
				})
        if(activeAreaId){
          yield put({type:'queryZones',payload:{id:activeAreaId}});
        }
			}
			(response.data.status=='error')&&message.error('查询错误！'+response.data.message,6)
		},
  	//查询城市--区划管理页面专用
		*queryAreaCity({payload},{call ,put, select}){
			const response = yield call(query,payload);
      let firstName='';
			if(response.data){
        try {
          firstName=response.data.data.content[0].zones[0].name;
        }catch (e) {
          firstName='';
        }
				yield put({
					type:'setState',
					payload:{cityResponse:response,
            firstName:firstName,
          }
				});

			}
			response.err&&message.error('查询失败!'+response.err.message,6)
		},
  	//查询
		*query({ payload }, { call, put, select }) {
			const tableOpened=yield select(({cityManagement})=>cityManagement.tableOpened);
			const tableAdded=yield select(({cityManagement})=>cityManagement.tableAdded);
			const tableClose=yield select(({cityManagement})=>cityManagement.tableClose);
      //处理tableLoading
			switch (payload.state){
				case '开通':
					yield put({type:'setState',payload:{tableOpened:{...tableOpened,tableLoading:true}}})
					break;
				case '准备中':
					yield put({type:'setState',payload:{tableOpened:{...tableAdded,tableLoading:true}}})
					break;
				case '关闭':
					yield put({type:'setState',payload:{tableOpened:{...tableClose,tableLoading:true}}})
					break;
				default:
					break;
			}
			const response = yield call(query,payload);
			if(response.data){
        // console.log(response,'responseresponseresponse');
				switch (response.data.status){
					case 'success':
						//处理一下数据,给每条数据加一个key
						let result=response.data.data.content;
						for(let i=0;i<result.length;i++){
								result[i].key=i+1;
						}

						switch (payload.state){
							case '开通':
								yield put({
									type:'setState',
									payload:{
										tableOpen:{
											response:response,
											tableLoading:false,
										}
									}
								});
								break;
							case '准备中':
								yield put({
									type:'setState',
									payload:{
										tableAdded:{
											response:response,
											tableLoading:false,
										}
									}
								});
								break;
							case '关闭':
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
							default:
								break;
						}
						break;
            case 'error':
              message.error('查询失败'+response.data.message)
              break;
					default:
						break;
				}
			}
		},
		//添加目标省市
		*addCity({ payload }, { call, put, select}) {
			const addCityModalState=yield select(({cityManagement})=>cityManagement.addCityModalState);
			yield put({type:'setState',payload:{addCityModalState:{...addCityModalState, submitLoading:true}}});
			const response  = yield call(addCity, parse(payload.params));
			switch (response.data.status){
				case 'success':
					message.success('添加成功',6);
					payload.form.resetFields();
          yield put({type:'countCity'})
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
					message.error('添加失败！'+response.data.message,6);
					payload.form.resetFields();
					yield put({type:'setState',payload:{addCityModalState:{...addCityModalState,submitLoading:false}}});
					break;
				default:
					break;
			}
			response.err&&message.error('添加失败!'+response.err,6);
		},
		//添加区域/区划
		*addZone({ payload }, { call, put, select }) {
			const currentCityName=yield select(({cityManagement})=>cityManagement.currentCityName);
			const currentCityStatus=yield select(({cityManagement})=>cityManagement.currentCityStatus);
			const activeAreaId=yield select(({cityManagement})=>cityManagement.activeAreaId);
			const response  = yield call(addZone, parse(payload.params));
			if(response.data.status=='success'){
				message.success('添加成功');
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
				message.error('添加失败，'+response.data.message,4)
			}
			response.err&&message.error('添加失败:',response.err);
		},
		//区划管理查询
		*queryZones({ payload }, { call, put, select }) {
			yield put({type:'setState',payload:{tableLoading:true}});
			const response = yield call(queryZones,payload);
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
			response.err&&message.error('查询失败!'+response.err.message,6);
		},
		//调整片区顺序switchZone
		*switchZone({ payload }, { call, put, select }){
			const activeAreaId=yield select(({cityManagement})=>cityManagement.activeAreaId);
			const currentPage=yield select(({cityManagement})=>cityManagement.currentPage);
			const response = yield call(switchZone,payload);
			if(response.data.status=='success'){
				//刷新页面
				yield put({
					type:'queryZones',
					payload:{
						id:activeAreaId,
						pageNo:currentPage,
					}});
			}
			response.err&&message.error('系统出错！',6)
		},

		//编辑片区
		*editZone({ payload }, { call, put, select }){
			const response = yield call(editZone,payload);
			if(response.data.status=='success'){
				const activeAreaId=yield select(({cityManagement})=>cityManagement.activeAreaId);
				yield put({type:'queryZones',payload:{id:activeAreaId}});
				yield put({type:'setState', payload:{editState:false}})
			}
			response.err&&message.error('修改失败！',6)
		},

		//关闭城市
		*closeCity({ payload }, { call, put, select }) {
			const closeCityModal=yield select(({cityManagement})=>cityManagement.closeCityModal);
			yield put({type:'setState',payload:{closeCityModal:{...closeCityModal,submitLoading:true}}});
			const response  = yield call(closeCity, parse(payload.params));
			// console.log('关闭城市返回的response:',response);
			if(response.data.status=='success'){
				message.success('关闭成功',6);
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
        yield put({type:'countCity'});
				yield put({type:'query',payload:{state:'开通',}});
        yield put({type:'query',payload:{state:'准备中'}});
				yield put({type:'query',payload:{state:'关闭',}})
			}

		},
		//开通城市
		*openCity({ payload }, { call, put }) {
			const response  = yield call(openCity, parse(payload.params));
			// console.log('开通城市返回的response:',response);
			if(response.data.status=='success'){
				message.success('开通成功',6);
				payload.resolve();
        yield put({type:'countCity'});
				yield put({type:'query',payload:{state:'开通'}});
				yield put({type:'query',payload:{state:'准备中'}});
				yield put({type:'query',payload:{state:'关闭'}})
			}
		},
    //获取未开通城市
    *getOutCity({ payload }, { call, put }){
      const {data} = yield call(findNotAddCities,{...payload});
      const arrOption=data.data;
      const option=_toCascaderOptions(data.data);
      if(data.data){
        yield put({
          type:'setState',
          payload:{
            addCityModalState:{
    					visible:true,
    				},
            arrOptions:arrOption,
            options:option,
          }
        })
      }
    },
    *countCity({payload},{call ,put}){
      const {data} = yield call(countCities,{...payload});
      if(data.data){
        yield put({
          type:'setState',
          payload:{
            close:data.data.close,
            open:data.data.open,
            prepare:data.data.prepare,
          }
        })
      }
    },
    *queryPianqy({payload},{call ,put}){
      // console.log(payload,'payload');
      const {data} = yield call(queryfindArea,{...payload});
      if(data.data){
        yield put({
          type:'setState',
          payload:{
            areaResponse:{},
          }
        })
      }
    },
    *eidtCityModalopened({payload},{call ,put}){
      const {data} = yield call(editArea,{...payload});
      if(data.data){
        yield put({
          type:'setState',
          payload:{
            eidtCityModalopened:false,
          }
        })
        message.success('修改成功！')
      }else{
        yield put({
          type:'setState',
          payload:{
            eidtCityModalopened:false,
          }
        })
        message.error('修改失败！')
      }
    },
    *eidtCityPreparation({payload},{call ,put}){
      const {data} = yield call(editArea,{...payload});
      if(data.data){
        yield put({
          type:'setState',
          payload:{
            eidtCityModalpreparation:false,
          }
        })
        message.success('修改成功！')
      }else{
        yield put({
          type:'setState',
          payload:{
            eidtCityModalpreparation:false,
          }
        })
        message.error('修改失败！')
      }
    },
    *eidtCityModalClosed({payload},{call ,put}){
      const {data} = yield call(editArea,{...payload});
      if(data.data){
        yield put({
          type:'setState',
          payload:{
            eidtCityModalClosed:false,
          }
        })
        message.success('修改成功！')
      }else{
        yield put({
          type:'setState',
          payload:{
            eidtCityModalClosed:false,
          }
        })
        message.error(data.message)
      }
    },
    *deletCityZones({payload},{call ,put,select}){
      const activeAreaId=yield select(({cityManagement})=>cityManagement.activeAreaId);
      const {data} = yield call(deleteZone,{...payload});
      if(data.data){
        yield put({type:'countCity'})
        if(activeAreaId){
          yield put({type:'queryZones',payload:{id:activeAreaId}});
        }
        yield put({type:'query',payload:{state:'准备中'}});
        yield put({type:'query',payload:{state:'关闭'}});
        message.success('删除成功！')
      }else{
        message.error(data.message)
      }
    },
    *initqueryFecth({payload},{call ,put,select}){
      yield put({type:'countCity'});
      yield put({type:'query',payload:{state:'开通'}});
      yield put({type:'query',payload:{state:'准备中'}});
      yield put({type:'query',payload:{state:'关闭'}});
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
				if (location.pathname === '/cityManagement/openCity') {
					//获取行政区划,暂时放在本地，不用远程获取
					// dispatch({
					// 	type: 'getArea',`
					// });
					//发起fetch城市管理页面 初始数据
          dispatch({
            type:'initqueryFecth'
          })

				}else if(location.pathname==='/cityManagement/openCity/divisionManagement'){
					//发起fetch区划管理页面 初始数据
					dispatch({
						type:'setState',
						payload:{
							currentProvince:location.state.currentProvince,
							currentCityId:location.state.currentCityId,
              cityCode:location.state.cityCode,
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
          if(location.state.firstAreaId){
            // dispatch({type:'queryPianqy',payload:{cityId:location.state.currentCityId}});

            dispatch({type:'queryZones',payload:{id:location.state.firstAreaId}});
          }else{
            dispatch({type:'queryPianqy',payload:{cityId:location.state.currentCityId}});
          }
				}
			});

		},
	}
}
