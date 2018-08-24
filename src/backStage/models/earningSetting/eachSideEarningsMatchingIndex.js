import {findAllOcations,deleteOcationsFetch,findAllallocationPlans,
  findAllByAreaCode,findAlltradingServiceChargesFectch,
  findAllAreasOpen,editAllOcations,findOneOcations,tradingCenterFindAll,
} from '../../services/earningSetting/eachSideEarningsMatchingIndex';
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
	namespace: 'eachSideEarningsMatchingIndex',
	state: {
    dataSource:[],
    loading:true,
    pageNo:0,
    total:'',
    options:[],
    originalArray:[],
    editModalStatus:false,
    areaCode:'',
    areaPath:'',
    id:'',
    tcId:'',
    tradingCenterName:'',
    commissionName:'',
    tradingServiceChargesName:'',
    originalTraingArr:[],
    traingArr:[],
    tradingServiceList:[],
    allocationPlansList:[],
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/earningSetting/allEarningsMatching'){
          dispatch({type:'initialFindAll'})
          // dispatch({type:'findAll',
          //   payload:{pageNo:0,}
          // })  //初始化列表
          // dispatch({type:'findCity'})  //查询城市
          //// dispatch({type:'findTrading'})
        }
			});
		},
	},
	effects: {
    *initialFindAll({ payload },{ call, put }){
      yield put({type:'findAll',
        payload:{pageNo:0,}
      })  //初始化列表
      yield put({type:'findCity'})  //查询城市
    },
    *findCity({ payload },{ call, put }){
      const  {data,err}  = yield call(findAllAreasOpen,{...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      const arroption=_toCascaderOptions(data.data);
      yield put ({
        type:'initail',payload:{
          options:arroption,
          originalArray:data.data,
        }
      })
    },
    *findtradingServiceChargesList({ payload },{ call, put }){
      const  {data,err}  = yield call(findAlltradingServiceChargesFectch,{...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        const tradingList=[];
        // console.log(data.data,'data.datass');
        data.data.tradingServiceCharges.map((item,index)=>(
          tradingList.push(item.name)
        ))
        yield put({
          type:'initail',
          payload:{
            tradingServiceList:tradingList,
          }
        })
      }else{
        message.error(data.message)
      }
    },
    *findallocationPlansList({ payload },{ call, put }){
      const  {data,err}  = yield call(findAllallocationPlans,{...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        const allocationList=[];
        // console.log(data.data,'data');
        data.data.commissions.map((item,index)=>(
          allocationList.push(item.name)
        ))
        yield put({
          type:'initail',
          payload:{
            allocationPlansList:allocationList,
          }
        })
      }else{
        message.error(data.message)
      }
    },
    //编辑时获取所有的交易中心名称
    *findTraingArr({ payload },{ call, put }){
      const  {data,err}  = yield call(findAllByAreaCode,{...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      const traingArr=[];
      if(data.data){
        data.data.map(item=>(
					traingArr.push({
						name:item.name,
						id:item.id,
					})
				))
        yield put ({
          type:'initail',payload:{
            traingArr:traingArr,
            originalTraingArr:data.data,
          }
        })
      }
    },
    // *findTrading({ payload },{ call, put }){
    //   const {data}=yield call(tradingCenterFindAll,{...payload})
    //
    // },
    *findcascaderChange({ payload },{ call, put }){
      const {data,err}=yield call(findAllByAreaCode,{...payload})
      if(err){
				return message.error('出错了，请联系管理员');
			}
      const traingArr=[];
      if(data.data){
        data.data.map(item=>(
					traingArr.push({
						name:item.name,
						id:item.id,
					})
				))
        yield put ({
          type:'initail',payload:{
            traingArr:traingArr,
            originalTraingArr:data.data,
          }
        })
      }
    },
    *findAll({ payload }, { call, put }){
      const  {data,err}  = yield call(findAllOcations,{pageNo:0});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      const dataSource=[];
      if(data.data){
        data.data.allocations.map((item,index)=>(
          dataSource.push({
            key:index,
            number:index+1,
            areaCode:item.areaCode,
            province:(!!item.areaPath.split('/')[1]?item.areaPath.split('/')[1]:'全部'),
            city:(!!item.areaPath.split('/')[2]?item.areaPath.split('/')[2]:'全部'),
            county:(!!item.areaPath.split('/')[3]?item.areaPath.split('/')[3]:'全部'),
            id:item.id,//收益分配编号
            tcId:item.tcId,//交易中心id
            tradingCenterName:(!!item.tradingCenterName?item.tradingCenterName:'全部'),//交易中心名字
            commissionName:(!!item.commission && item.commission.name),//佣金配比方案名字
            commissionBroker:(!!item.commission && item.commission.broker),//佣金配比经纪人占比
            commissionCityAgency:(!!item.commission && item.commission.cityAgency),//佣金配比市级代理占比
            commissionCountyAgency:(!!item.commission && item.commission.countyAgency),//佣金配比区县代理占比
            commissionMaster:(!!item.commission && item.commission.master),//佣金配比师傅角色占比
            commissionPlatform:(!!item.commission && item.commission.platform),//佣金配比平台占比
            commissionProvinceAgency:(!!item.commission && item.commission.provinceAgency),//佣金配比省级代理占比
            commissionTradingCenter:(!!item.commission && item.commission.tradingCenter),//佣金配比交易中心占比
            tradingServiceChargesName:(!!item.tradingServiceCharges && item.tradingServiceCharges.name),//交易服务费名称
            tradingServiceChargesCityAgency:(!!item.tradingServiceCharges && item.tradingServiceCharges.cityAgency),//交易服务费市级代理占比
            tradingServiceChargesCountyAgency:(!!item.tradingServiceCharges && item.tradingServiceCharges.countyAgency),//交易服务费区县代理占比
            tradingServiceChargesPlatform:(!!item.tradingServiceCharges && item.tradingServiceCharges.platform),//交易服务费平台占比
            tradingServiceChargesProvinceAgency:(!!item.tradingServiceCharges && item.tradingServiceCharges.provinceAgency),//交易服务费省级代理占比
            tradingServiceChargesTradingCenter:(!!item.tradingServiceCharges && item.tradingServiceCharges.tradingCenter),//交易服务费交易中心占比
          })
        ))
        yield put({
          type:'initail',
          payload:{
            dataSource:dataSource,
            total:data.data.totalElements,
            pageNo:data.data.number+1,
            loading:false,
            editModalStatus:false,
            keyWord:'',
            areaPath:'',
            pageNo:0,
          }
        });
      }
    },
    *editBeforeOcations({ payload }, { call, put }){
      const {data,err} = yield call(findOneOcations,{...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        yield put({
          type:'initail',
          payload:{
            editModalStatus:true,
            areaCode:data.data.areaCode,
            areaPath:data.data.areaPath,
            id:data.data.id,
            tcId:data.data.tcId,
            tradingCenterName:data.data.tradingCenterName,
            commissionName:(!!data.data.commission?data.data.commission.name:''),
            tradingServiceChargesName:(!!data.data.tradingServiceCharges?data.data.tradingServiceCharges.name:''),
          }
        });
      }else{
        message.error(`${data.message}`);
      }
    },
    *editAllOcationsOk({ payload }, { call, put }){
      const {data,err} = yield call(editAllOcations,{...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        yield put({type:'findAll'})
      }else{
        yield put ({type:'initail',payload:{
          loading:false,
          editModalStatus:false,
          areaPath:'',
          keyWord:'',
        }})
        message.error(`${data.message}`)
      }
    },
    *pageOnchange({ payload }, { call, put }){
      const {data,err} = yield call(findAllOcations,{pageNo:payload.pageNo-1,keyWord:payload.keyWord,areaPath:payload.areaPath});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      const dataSource=[];
      if(data.data){
        data.data.allocations.map((item,index)=>(
          dataSource.push({
            key:index,
            number:index+1,
            areaCode:item.areaCode,
            province:(!!item.areaPath.split('/')[1]?item.areaPath.split('/')[1]:'全部'),
            city:(!!item.areaPath.split('/')[2]?item.areaPath.split('/')[2]:'全部'),
            county:(!!item.areaPath.split('/')[3]?item.areaPath.split('/')[3]:'全部'),
            id:item.id,//收益分配编号
            tcId:item.tcId,//交易中心id
            tradingCenterName:(!!item.tradingCenterName?item.tradingCenterName:'全部'),//交易中心名字
            commissionName:(!!item.commission && item.commission.name),//佣金配比方案名字
            commissionBroker:(!!item.commission && item.commission.broker),//佣金配比经纪人占比
            commissionCityAgency:(!!item.commission && item.commission.cityAgency),//佣金配比市级代理占比
            commissionCountyAgency:(!!item.commission && item.commission.countyAgency),//佣金配比区县代理占比
            commissionMaster:(!!item.commission && item.commission.master),//佣金配比师傅角色占比
            commissionPlatform:(!!item.commission && item.commission.platform),//佣金配比平台占比
            commissionProvinceAgency:(!!item.commission && item.commission.provinceAgency),//佣金配比省级代理占比
            commissionTradingCenter:(!!item.commission && item.commission.tradingCenter),//佣金配比交易中心占比
            tradingServiceChargesName:(!!item.tradingServiceCharges && item.tradingServiceCharges.name),//交易服务费名称
            tradingServiceChargesCityAgency:(!!item.tradingServiceCharges && item.tradingServiceCharges.cityAgency),//交易服务费市级代理占比
            tradingServiceChargesCountyAgency:(!!item.tradingServiceCharges && item.tradingServiceCharges.countyAgency),//交易服务费区县代理占比
            tradingServiceChargesPlatform:(!!item.tradingServiceCharges && item.tradingServiceCharges.platform),//交易服务费平台占比
            tradingServiceChargesProvinceAgency:(!!item.tradingServiceCharges && item.tradingServiceCharges.provinceAgency),//交易服务费省级代理占比
            tradingServiceChargesTradingCenter:(!!item.tradingServiceCharges && item.tradingServiceCharges.tradingCenter),//交易服务费交易中心占比
          })
        ))
        yield put({
          type:'initail',
          payload:{
            dataSource:dataSource,
            total:data.data.totalElements,
            pageNo:data.data.number+1,
            loading:false,
          }
        });
      }
    },
    *handleReset({ payload }, { call, put }){
      yield put({type:'findAll'})
    },
    *handleSubmit({ payload }, { call, put }){
      const {data,err} = yield call(findAllOcations,{...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      const dataSource=[];
      if(data.data){
        data.data.allocations.map((item,index)=>(
          dataSource.push({
            key:index,
            number:index+1,
            areaCode:item.areaCode,
            province:(!!item.areaPath.split('/')[1]?item.areaPath.split('/')[1]:'全部'),
            city:(!!item.areaPath.split('/')[2]?item.areaPath.split('/')[2]:'全部'),
            county:(!!item.areaPath.split('/')[3]?item.areaPath.split('/')[3]:'全部'),
            id:item.id,//收益分配编号
            tcId:item.tcId,//交易中心id
            tradingCenterName:(!!item.tradingCenterName?item.tradingCenterName:'全部'),//交易中心名字
            commissionName:(!!item.commission && item.commission.name),//佣金配比方案名字
            commissionBroker:(!!item.commission && item.commission.broker),//佣金配比经纪人占比
            commissionCityAgency:(!!item.commission && item.commission.cityAgency),//佣金配比市级代理占比
            commissionCountyAgency:(!!item.commission && item.commission.countyAgency),//佣金配比区县代理占比
            commissionMaster:(!!item.commission && item.commission.master),//佣金配比师傅角色占比
            commissionPlatform:(!!item.commission && item.commission.platform),//佣金配比平台占比
            commissionProvinceAgency:(!!item.commission && item.commission.provinceAgency),//佣金配比省级代理占比
            commissionTradingCenter:(!!item.commission && item.commission.tradingCenter),//佣金配比交易中心占比
            tradingServiceChargesName:(!!item.tradingServiceCharges && item.tradingServiceCharges.name),//交易服务费名称
            tradingServiceChargesCityAgency:(!!item.tradingServiceCharges && item.tradingServiceCharges.cityAgency),//交易服务费市级代理占比
            tradingServiceChargesCountyAgency:(!!item.tradingServiceCharges && item.tradingServiceCharges.countyAgency),//交易服务费区县代理占比
            tradingServiceChargesPlatform:(!!item.tradingServiceCharges && item.tradingServiceCharges.platform),//交易服务费平台占比
            tradingServiceChargesProvinceAgency:(!!item.tradingServiceCharges && item.tradingServiceCharges.provinceAgency),//交易服务费省级代理占比
            tradingServiceChargesTradingCenter:(!!item.tradingServiceCharges && item.tradingServiceCharges.tradingCenter),//交易服务费交易中心占比
          })
        ))
        yield put({
          type:'initail',
          payload:{
            dataSource:dataSource,
            total:data.data.totalElements,
            pageNo:data.data.number+1,
            keyWord:payload.keyWord,
            areaPath:payload.areaPath,
            loading:false,
          }
        });
      }
    },

    *deletOcations({ payload }, { call, put }){
      const {data,err} = yield call(deleteOcationsFetch,{...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        yield put({type:'findAll',
        });
        message.success('删除成功')
      }else{
        message.error('删除失败');
      }
    },
	},
	reducers: {
    initail(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
