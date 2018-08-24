import {labelsfindAllFtech,findAllProvincesFtech,
	createXiaoQuServicesFtech,findCommunityFtech,editCommunityFtech} from '../../services/developmentDictionary/createCell';
import { parse } from 'qs';
import { message} from 'antd';
import { routerRedux } from 'dva/router';
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
	namespace: 'createCell',
	state: {
		showPicList:[],//上传图片
		initMarkers:[],//地图。。
		id:'',
		areaAndCode:[],
		arrOptions:[],
		areaCode:'',//	区域编号
    areaName:'',//区域名称
		areaZone:'',//片区
    address:'',//小区详细地址
    buildingType:[],//建筑类型
    constructionTime:'',//建筑年代
    developers:'',//开发商
    estateCompany:'',//物业公司
    greeningRate:'',//绿化率
    heatingMode:'',//供暖方式
    latitude:'',//小区位置(纬度)
    longitude:'',//小区位置(经度)
    name:'',//小区名称
    numberOfBuilding:'',//楼栋数
    ownType:'',//产权类型
    parkingFees:'',//停车费
    parkingSpaces:'',//停车位
    propertyCosts:'',//物业费
    rateOfCapacity:'',//容积率
    ratioOfParkingSpaces:'',//车位配比
    totalHouseholds:'',//总户数
    totalOfBuilding:'',//楼栋总数
    buildingTypes:[],
    heatingModes:[],
		options:[],
		defaultAreaName:[],
		loading:false,
		mapOfChangeAddress:'',
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/developmentDictionary/residentialArea/createCell') {
					dispatch({
						type:'inint',
						payload:{
							showPicList:[],
							areaCode:'',//	区域编号
					    areaName:'',//区域名称
							areaZone:'',//片区
					    address:'',//小区详细地址
					    buildingType:[],//建筑类型
					    constructionTime:'',//建筑年代
					    developers:'',//开发商
					    estateCompany:'',//物业公司
					    greeningRate:'',//绿化率
					    heatingMode:'',//供暖方式
					    latitude:'',//小区位置(纬度)
					    longitude:'',//小区位置(经度)
					    name:'',//小区名称
					    numberOfBuilding:'',//楼栋数
					    ownType:'',//产权类型
					    parkingFees:'',//停车费
					    parkingSpaces:'',//停车位
					    propertyCosts:'',//物业费
					    rateOfCapacity:'',//容积率
					    ratioOfParkingSpaces:'',//车位配比
					    totalHouseholds:'',//总户数
					    totalOfBuilding:'',//楼栋总数
							defaultAreaName:[],
							id:'',
							loading:false,
						}
					})
					dispatch({
						type:'labelsfindAll',
						payload:{
							groups:[
								{
                  typeName:'小区建筑类型',
                  areaPath:null,
                },
                {
                  typeName:'供暖方式',
                  areaPath:null,
                },
							]
						}
					})
					dispatch({
						type:'findAllProvinces',
					})
					if(location.state){
						dispatch({type:'findData',
							payload:{
								id:location.state.id
							}
						})
						dispatch({
							type:'inint',
							payload:{
								loading:true,
							}
						})
					}
				}
			});
		},
	},
	effects: {
    *labelsfindAll({ payload }, { call, put }){
      const  {data,err}  = yield call(labelsfindAllFtech,{...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
			let buildingTypes=[];
			let heatingModes=[];
			if(data.data){
				for(let k in data.data){
					if(data.data[k].typeName=='小区建筑类型'){
						data.data[k].nameAndValues.map(item=>(
              buildingTypes.push(item.value)
            ))
					}else if(data.data[k].typeName=='供暖方式'){
						data.data[k].nameAndValues.map(item=>(
              heatingModes.push(item.value)
            ))
					}
				}
				yield put ({
          type: 'inint',
          payload: {
						buildingTypes:buildingTypes,
						heatingModes:heatingModes,
          },
        });
			}
    },
    *findAllProvinces({ payload }, { call, put }){
      const  {data,err}  = yield call(findAllProvincesFtech,{...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data){
				yield put ({
          type: 'inint',
          payload: {
						areaAndCode:_toCascaderOptions(data.data),
						arrOptions:data.data,
          },
        });
			}
    },
    *findData({ payload }, { call, put,select }){
      const  {data,err}  = yield call(findCommunityFtech,{...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				const showImg=[];
				const areaName=data.data.areaName.split('/');
				areaName.splice(0,1);
				const  arrProvinces  = yield call(findAllProvincesFtech,{...payload});
        let arr;
        if(!!arrProvinces.data.data && !!data.data.areaCode){
          arr	=_getCode(arrProvinces.data.data,data.data.areaCode);
        }
				data.data.keys.map((item,index)=>{
          showImg.push({
            id:item.url,
            isCover:item.comment,
            name:'',
            rename:false,
            src:item.url,
          })
        })
        yield put ({
          type: 'inint',
          payload: {
						id:payload.id,
						loading:false,
						showPicList:showImg,
						defaultAreaName:arr,
						areaCode:data.data.areaCode,//	区域编号
				    areaName:data.data.areaName,//区域名称
						areaZone:data.data.areaZone,//片区
				    address:data.data.address,//小区详细地址
				    buildingType:data.data.buildingType,//建筑类型
				    constructionTime:(data.data.constructionTime===null?'':(data.data.constructionTime.toString())),//建筑年代
				    developers:data.data.developers,//开发商
				    estateCompany:data.data.estateCompany,//物业公司
				    greeningRate:(data.data.greeningRate===null?'':(data.data.greeningRate.toString())),//绿化率
				    heatingMode:data.data.heatingMode==''?'':data.data.heatingMode,//供暖方式
				    latitude:data.data.latitude,//小区位置(纬度)
				    longitude:data.data.longitude,//小区位置(经度)
				    name:data.data.name,//小区名称
				    numberOfBuilding:(data.data.numberOfBuilding===null?'':(data.data.numberOfBuilding.toString())),//楼栋数
				    ownType:(data.data.ownType===null?'':(data.data.ownType.toString())),//产权类型
				    parkingFees:data.data.parkingFees,//停车费
				    parkingSpaces:(data.data.parkingSpaces===null?'':(data.data.parkingSpaces.toString())),//停车位
				    propertyCosts:(data.data.propertyCosts===null?'':(data.data.propertyCosts.toString())),//物业费
				    rateOfCapacity:(data.data.rateOfCapacity===null?'':(data.data.rateOfCapacity.toString())),//容积率
				    ratioOfParkingSpaces:(data.data.ratioOfParkingSpaces===null?'':(data.data.ratioOfParkingSpaces.toString())),//车位配比
				    totalHouseholds:(data.data.totalHouseholds===null?'':(data.data.totalHouseholds.toString())),//总户数
				    totalOfBuilding:(data.data.totalOfBuilding===null?'':(data.data.totalOfBuilding.toString())),//楼栋总数
          },
        });
      }else {
      	message.error('获取信息失败')
      }
    },
		*editXiaoQu({ payload }, { call, put }){
			const {data,err} = yield call(editCommunityFtech,{...payload})
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.status=='success'){
	        yield put ({
	          type: 'initialSuccess',
	          payload: {
							showPicList:[],
							areaCode:'',//	区域编号
					    areaName:'',//区域名称
					    address:'',//小区详细地址
							areaZone:'',
					    buildingType:[],//建筑类型
					    constructionTime:'',//建筑年代
					    developers:'',//开发商
					    estateCompany:'',//物业公司
					    greeningRate:'',//绿化率
					    heatingMode:'',//供暖方式
					    latitude:'',//小区位置(纬度)
					    longitude:'',//小区位置(经度)
					    name:'',//小区名称
					    numberOfBuilding:'',//楼栋数
					    ownType:'',//产权类型
					    parkingFees:'',//停车费
					    parkingSpaces:'',//停车位
					    propertyCosts:'',//物业费
					    rateOfCapacity:'',//容积率
					    ratioOfParkingSpaces:'',//车位配比
					    totalHouseholds:'',//总户数
					    totalOfBuilding:'',//楼栋总数
							defaultAreaName:[],
							loading:false,
	          },
	        });
				message.success('编辑成功');
				yield put(routerRedux.goBack());
			}else{
				message.error(data.message);
			}
		},
		*createXiaoQu({ payload }, { call, put }){
			const {data} = yield call(createXiaoQuServicesFtech,{...payload})
			if(data.status=='success'){
				yield put ({
					type: 'initialSuccess',
					payload: {
						showPicList:[],
					},
				});
				message.success('保存成功');
				yield put(routerRedux.goBack());
			}else{
				message.error(data.message);
			}
		},
	},
	reducers: {
		inint(state,{payload}){
			return { ...state, ...payload };
		},
		inintMap(state,action){
			return { ...state, ...action.payload };
		},
	},
}
