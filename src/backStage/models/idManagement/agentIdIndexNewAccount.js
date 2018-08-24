import {findOneFetch,findGroup,findAllCitiesFetch,edit,getRole,getRegions,add} from '../../services/idManagement/agentIdIndexNewAccount';
import { parse } from 'qs';
import {message} from 'antd';
import { routerRedux } from 'dva/router';
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
export default {
	namespace: 'agentIdIndexNewAccount',
	state: {
		documentType:[],//证件类型标签
		showPicList:[],
		address:'',
		areaCode:'',
		areaName:'',
		businessLicense:'',
		businessLicenseCode:'',
		certificateType:'',
		city:'',
		cityCode:'',
		id:'',
		legalPerson:'',
		loginName:'',
		name:'',
		phoneNumber:'',
		principal:'',
		role:'',
		cascaderOptions:[],//城市级联数组
		orginOptions:[],//城市级联原数组
		defaultAreaCode:[],
		defaultOptionalArea:[],
		roleLevel:[],
		roleCity:[],//可选区域
		orginRoleCity:[],//可选区域原数组
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/idManagement/agentIdIndex/agentIdIndexNewAccount') {
					dispatch({type:'findLabel',
						payload:{
							groups:[{areaPath:null,typeName:'营业执照证件类型'}]
						}
					})
					dispatch({type:'findAgentLevel'});
					dispatch({type:'findAllCities'});
					if(!!location.state){
						dispatch({type: 'findOne',payload:{id:location.state.id}});
					}else{
						dispatch({type:'querySuccess',
							payload:{
								showPicList:[],
								address:'',
								areaCode:'',
								areaName:'/河北省/保定市',
								businessLicense:'',
								businessLicenseCode:'',
								certificateType:'',
								city:'',
								cityCode:'',
								id:'',
								legalPerson:'',
								loginName:'',
								name:'',
								phoneNumber:'',
								principal:'',
								role:'',
								defaultAreaCode:[],
								defaultOptionalArea:[],
							}
						});
					}
				}
			});
		},
	},
	effects: {
		*findAllCities({ payload }, { call, put }){
			const  {data}  = yield call(findAllCitiesFetch, {...payload});
			if(!!data.data){
				yield put({type:'querySuccess',
					payload:{
						cascaderOptions:_toCascaderOptions(data.data),
						orginOptions:data.data
					}
				})
			}else{
				message.error('获取城市失败')
			}
		},
		*findAgentLevel({ payload }, { call, put }){
			const  {data}  = yield call(getRole, {...payload});
			if(data.data){
				const roleLevel=[];
				data.data.map((item,index)=>(
					roleLevel.push(item.role)
				))
				yield put({type:'querySuccess',
					payload:{
						roleLevel:roleLevel,
					}
				})
			}
		},
		*findLabel({ payload }, { call, put }){
			const  {data}  = yield call(findGroup, {...payload});
			if(data.data){
				const documentType=[];
				data.data[0].nameAndValues.map((item,index)=>(
					documentType.push(item.value)
				))
				yield put({
					type:'querySuccess',
					payload:{documentType:documentType}
				})
			}else{
				message.error('获取标签值失败')
			}
		},
    *findOne({ payload }, { call, put }){
      const  {data}  = yield call(findOneFetch, {...payload});
      if(data.data){
				const options=yield call(findAllCitiesFetch,{...payload});
				let orginOptions;
				let cascaderOptions;
				if(!!options.data.data){
					cascaderOptions=_toCascaderOptions(options.data.data);
					orginOptions=options.data.data;
				}
				let arr;
				let defaultOptionalArea;
				if(!!data.data.areaCode){
					arr=_getCode(orginOptions,data.data.cityCode);
					defaultOptionalArea=_getCode(orginOptions,data.data.areaCode);
				}
				const showPicList=[];
				if(!!data.data.businessLicense){
					showPicList.push({
						id:data.data.businessLicense,
            rename:false,
						name:'',
						isCover:false,
            src:data.data.businessLicense,
					})
				}
				yield put({
					type:'querySuccess',
					payload:{
						address:data.data.address,
						areaCode:data.data.areaCode,
						defaultAreaCode:arr,
						defaultOptionalArea:defaultOptionalArea,
						showPicList:showPicList,
						areaName:data.data.areaName,
						businessLicense:data.data.businessLicense,
						businessLicenseCode:data.data.businessLicenseCode,
						certificateType:data.data.certificateType,
						city:data.data.city,
						cityCode:data.data.cityCode,
						id:data.data.id,
						legalPerson:data.data.legalPerson,
						loginName:data.data.loginName,
						name:data.data.name,
						phoneNumber:data.data.phoneNumber,
						principal:data.data.principal,
						role:data.data.role,
					}
				})
			}
    },
		*editAgent({ payload }, { call, put }){
			const  {data}  = yield call(edit, {...payload});
			if(data.data){
				message.success('编辑成功')
				yield put(routerRedux.goBack());
			}else{
				message.error(data.message)
			}
		},
		*addAgent({ payload }, { call, put }){
			const  {data}  = yield call(add, {...payload});
			if(data.data){
				message.success('添加成功')
				yield put(routerRedux.goBack());
			}else{
				message.error(data.message)
			}
		},
		*selectChange({ payload }, { call, put }){
			const  {data}  = yield call(getRegions, {...payload});
			if(!!data){
				let roleCity;
				roleCity=_toCascaderOptions(data.data);
				yield put({type:'querySuccess',
					payload:{
						roleCity:roleCity,
						orginRoleCity:data.data,
					}
				})
			}
		},
	},
	reducers: {
		querySuccess(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
