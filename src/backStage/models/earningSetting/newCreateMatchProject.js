import {findAllAreas,findCommissions,
	findTradingServiceCharges,
	add,
	addCommissions,
	addService,
	findAllByAreaCode,
} from '../../services/earningSetting/newCreateMatchProject';
import { parse } from 'qs';
import {message} from 'antd';
import { routerRedux } from 'dva/router';
const _getName=(arr, code)=>{
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
const _getNamePathsByCode=(arr, code)=>{
  var nameArr = _getName(arr, code);
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

export default {
	namespace:'newCreateMatchProject',
	state:{
		options:[],//城市级联数组,
		originalArray:[],//城市级联原数组,
		commissionSchemeStatus:false,
		commissionDataSource:[],//佣金配比
		commissionTotal:'',//佣金分配总数
		commissionPage:0,//佣金分配当前页数
		commissionName:'',//佣金配比名称
		commissionAgent:'',//佣金配比经纪人
		commissionCity:'',//佣金配比市级代理
		commissionCounty:'',//佣金配比县级代理
		commissionMaster:'',//佣金配比师傅角色
		commissionPlatform:'',//佣金配比平台
		commissionProvince:'',//佣金配比省级代理
		commissionTradingCenter:'',//佣金配比交易中心
		showCommission:false,
		tradingServiceChargesStatus:false,//交易服务费模态框
		tradingServiceChargesDataSource:[],
		tradingServiceChargesName:'',
		tradingServiceChargesCity:'',
		tradingServiceChargesCounty:'',
		tradingServiceChargesPlatform:'',
		tradingServiceChargesProvince:'',
		tradingServiceChargesTradingCenter:'',
		showTradingServiceCharges:false,
		areaCode:'',
		areaPath:'',
		tradingArr:[],
		tradingCenterName:'',
		tcId:'',
		CommissionRatioStatus:false,//创建佣金配比方案
		servicesRatioStatus:false,//创建交易服务费配比方案
	},
	subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/earningSetting/allEarningsMatching/newCreateMatchProject') {
					// dispatch({type: 'initail'});
					// dispatch({type:'findAllTrading'})
					dispatch({type:'initailFindAll'})
				}
			});
		},
	},
	effects: {
		*initailFindAll({ payload }, { call, put }){
			yield put({type: 'initail'});
			yield put({type:'findAllTrading'})
		},
		*initail({ payload }, { call, put }){
      const {data,err} = yield call(findAllAreas,{...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				yield put({
					type:'setState',
					payload:{
						options:_toCascaderOptions(data.data),
						originalArray:data.data,
						commissionSchemeStatus:false,
						commissionDataSource:[],//佣金配比
						commissionTotal:'',//佣金分配总数
						commissionPage:0,//佣金分配当前页数
						commissionName:'',//佣金配比名称
						commissionAgent:'',//佣金配比经纪人
						commissionCity:'',//佣金配比市级代理
						commissionCounty:'',//佣金配比县级代理
						commissionMaster:'',//佣金配比师傅角色
						commissionPlatform:'',//佣金配比平台
						commissionProvince:'',//佣金配比省级代理
						commissionTradingCenter:'',//佣金配比交易中心
						showCommission:false,
						tradingServiceChargesStatus:false,//交易服务费模态框
						tradingServiceChargesDataSource:[],
						tradingServiceChargesName:'',
						tradingServiceChargesCity:'',
						tradingServiceChargesCounty:'',
						tradingServiceChargesPlatform:'',
						tradingServiceChargesProvince:'',
						tradingServiceChargesTradingCenter:'',
						showTradingServiceCharges:false,
						areaCode:'',
						areaPath:'',
						tradingArr:[],
						tradingCenterName:'',
					}
				})
			}else{
				message.error(`${data.message}`)
			}
    },
		*findAllTrading({payload},{ call, put ,select}){
			const {data}=yield call(findAllByAreaCode,{...payload})
			if(data.data){
				// console.log(data,'data');
			}else{
				message.error(`${data.message}`)
			}
		},
		//获取交易中心名字
		*cascaderGetAreaTrading({payload},{ call, put ,select}){
			const originalArr=yield select(({newCreateMatchProject})=>newCreateMatchProject.originalArray)
			const {data,err}=yield call(findAllByAreaCode,{...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
			const tradingArr=[];
			if(data.data){
				// console.log(data.data);
				data.data.map(item=>(
					tradingArr.push({
						name:item.name,
						id:item.id,
					})
				))
				yield put({
					type:'setState',
					payload:{
						areaCode:payload.code,
						areaPath:_getNamePathsByCode(originalArr,payload.code),
						tradingArr:tradingArr,
					}
				})
			}
		},
		*searchFucCommission({payload},{ call, put }){
			const {data,err}=yield call(findCommissions,{...payload})
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				const commissionDataSource = [];
				data.data.commissions.map((item,index)=>(
					commissionDataSource.push(
						{
							key:index,
							commissionName:item.name,
							commissionAgent:item.broker+'%',
							commissionPlatform:item.platform+'%',
							commissionProvince:item.provinceAgency+'%',
							commissionCity:item.cityAgency+'%',
							commissionCounty:item.countyAgency+'%',
							commissionTradingCenter:item.tradingCenter+'%',
							commissionMaster:item.master+'%',
						}
					)
				))
				yield put({
					type:'setState',
					payload:{
						commissionSchemeStatus:true,
						commissionKeyWord:payload.name,
						commissionPage:data.data.number+1,
						commissionTotal:data.data.totalElements,
						commissionDataSource:commissionDataSource,
					}
				})
			}else{
				message.error(`${data.message}`)
			}
		},
		*pageOnchangeCommission({ payload }, { call, put }){
			const {data,err}=yield call(findCommissions,{...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				const commissionDataSource = [];
				data.data.commissions.map((item,index)=>(
					commissionDataSource.push(
						{
							key:index,
							commissionName:item.name,
							commissionAgent:item.broker+'%',
							commissionPlatform:item.platform+'%',
							commissionProvince:item.provinceAgency+'%',
							commissionCity:item.cityAgency+'%',
							commissionCounty:item.countyAgency+'%',
							commissionTradingCenter:item.tradingCenter+'%',
							commissionMaster:item.master+'%',
						}
					)
				))
				yield put({
					type:'setState',
					payload:{
						commissionSchemeStatus:true,
						commissionTotal:data.data.totalElements,
						commissionPage:data.data.number+1,
						commissionDataSource:commissionDataSource,
					}
				})
			}else{
				message.error(`${data.message}`)
			}
		},
		*commissionChose({ payload }, { call, put }){
      const {data,err} = yield call(findCommissions,{...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				const commissionDataSource = [];
				data.data.commissions.map((item,index)=>(
					commissionDataSource.push(
						{
							key:index,
							commissionName:item.name,
							commissionAgent:item.broker+'%',
							commissionPlatform:item.platform+'%',
							commissionProvince:item.provinceAgency+'%',
							commissionCity:item.cityAgency+'%',
							commissionCounty:item.countyAgency+'%',
							commissionTradingCenter:item.tradingCenter+'%',
							commissionMaster:item.master+'%',
						}
					)
				))
				yield put({
					type:'setState',
					payload:{
						commissionSchemeStatus:true,
						commissionTotal:data.data.totalElements,
						commissionPage:data.data.number+1,
						commissionDataSource:commissionDataSource,
					}
				})
			}else{
				message.error(`${data.message}`)
			}
    },
		//交易服务费获取列表
		*tradingServiceChose({ payload }, { call, put }){
      const {data,err} = yield call(findTradingServiceCharges,{...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				const tradingServiceChargesDataSource = [];
				data.data.tradingServiceCharges.map((item,index)=>(
					tradingServiceChargesDataSource.push(
						{
							key:index,
							tradingServiceChargesName:item.name,
							tradingServiceChargesPlatform:item.platform+'%',
							tradingServiceChargesProvince:item.provinceAgency+'%',
							tradingServiceChargesCity:item.cityAgency+'%',
							tradingServiceChargesCounty:item.countyAgency+'%',
							tradingServiceChargesTradingCenter:item.tradingCenter+'%',
						}
					)
				))
				yield put({
					type:'setState',
					payload:{
						tradingServiceChargesStatus:true,
						tradingServiceChargesTotal:data.data.totalElements,
						tradingServiceChargesPage:data.data.number+1,
						tradingServiceChargesDataSource:tradingServiceChargesDataSource,
					}
				})
			}else{
				message.error(`${data.message}`)
			}
    },
		//交易服务费分页
		*pageOnchangeTradingServiceCharges({ payload }, { call, put }){
			const {data,err}=yield call(findTradingServiceCharges,{...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				const tradingServiceChargesDataSource = [];
				data.data.tradingServiceCharges.map((item,index)=>(
					tradingServiceChargesDataSource.push(
						{
							key:index,
							tradingServiceChargesName:item.name,
							tradingServiceChargesPlatform:item.platform+'%',
							tradingServiceChargesProvince:item.provinceAgency+'%',
							tradingServiceChargesCity:item.cityAgency+'%',
							tradingServiceChargesCounty:item.countyAgency+'%',
							tradingServiceChargesTradingCenter:item.tradingCenter+'%',
						}
					)
				))
				yield put({
					type:'setState',
					payload:{
						tradingServiceChargesTotal:data.data.totalElements,
						tradingServiceChargesPage:data.data.number+1,
						tradingServiceChargesDataSource:tradingServiceChargesDataSource,
					}
				})
			}else{
				message.error(`${data.message}`)
			}
		},
		//交易服务费搜索
		*searchFucService({ payload }, { call, put }){
			const {data,err}=yield call(findTradingServiceCharges,{...payload})
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				const tradingServiceChargesDataSource = [];
				data.data.tradingServiceCharges.map((item,index)=>(
					tradingServiceChargesDataSource.push(
						{
							key:index,
							tradingServiceChargesName:item.name,
							tradingServiceChargesPlatform:item.platform+'%',
							tradingServiceChargesProvince:item.provinceAgency+'%',
							tradingServiceChargesCity:item.cityAgency+'%',
							tradingServiceChargesCounty:item.countyAgency+'%',
							tradingServiceChargesTradingCenter:item.tradingCenter+'%',
						}
					)
				))
				yield put({
					type:'setState',
					payload:{
						tradingServiceChargesStatus:true,
						tradingServiceChargesKeyWord:payload.name,
						tradingServiceChargesPage:data.data.number+1,
						tradingServiceChargesTotal:data.data.totalElements,
						tradingServiceChargesDataSource:tradingServiceChargesDataSource,
					}
				})
			}else{
				message.error(`${data.message}`)
			}
		},
		//创建收益分配
		*createProfit({ payload }, { call, put }){
			const {data,err}=yield call(add,{...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				message.success('创建成功');
				yield put({
					type:'setState',
					payload:{
						areaCode:'',
						areaPath:'',
						commissionName:'',
						tcId:'',
						tradingCenterName:'',
						tradingServiceChargesName:'',
					}
				})
				yield put(routerRedux.goBack());
			}else{
				message.error(`${data.message}`);
			}
		},
		*creatCommissionModalOk({ payload }, { call, put }){
			const {data,err}=yield call(addCommissions,{...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				message.success('创建成功');
				yield put({
					type:'setState',
					payload:{CommissionRatioStatus:false}
				})
			}else {
				message.error(`${data.message}`);
				yield put({
					type:'setState',
					payload:{CommissionRatioStatus:false}
				})
			}
		},
		*creatServicesModalOk({ payload }, { call, put }){
			const {data,err}=yield call(addService,{...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				message.success('创建成功');
				yield put({
					type:'setState',
					payload:{servicesRatioStatus:false}
				})
			}else {
				message.error(`${data.message}`);
				yield put({
					type:'setState',
					payload:{servicesRatioStatus:false}
				})
			}
		},
	},
	reducers: {
		setState(state,{payload}){
			return { ...state, ...payload };
		},
		commissionSchemeOk(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
