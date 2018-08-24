import {findAllProvinces,findGroup,addOfficeBuilding,editOfficeBuilding,findOfficeBuilding} from '../../services/developmentDictionary/officceCreateBuilding';
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
const  _toCascaderOptions=(arr)=>{
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
	namespace: 'officceCreateBuilding',
	state: {
    showPicList:[],//上传图片
		defaultareaCode:[],
		initMarkers:[],//地图。。
		arrOptions:[],//获取所有城市级联的数组
		allProvinces:[],//城市级联原数组(未做处理的后端返回的数组)
		name:'',
    areaZone:'',
    jianzhuType:[],//建筑类型
    officeType:[],//写字楼类型
    officeLevel:[],//写字楼级别
		areaCode:[],//城市当前编码
		areaName:'',//当前城市
		address:'',//地址
		latitude:'',//纬度
		longitude:'',//经度
		propertyCosts:'',//物业费
		typePrefix:'',//商铺类别前缀
		typeSuffix:'',//商铺类别后缀
		numberOfPlies:'',//总层数
		developers:'',//开发商
		constructionTime:'',//建筑年代
		buildingType:'',//建筑类型
		estateCompany:'',//建物业公司
		timeOfCompletion:'',//竣工时间
		floorArea:'',//占地面积
		areaOfStructure:'',//建筑面积
		bayArea:'',//开间面积
		passengerElevatorNumber:'',//客梯数量
		transferNumber:'',//货梯数量
		airCondition:'',//空调数量
		decorateState:'',//装修状况
		parkingSpaces:'',
		id:'',//当前商铺id
    loading:false,
    mapOfChangeAddress:'',
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/developmentDictionary/officeBuilding/officceCreateBuilding') {
					dispatch({
						type:'initialSuccess',
						payload:{
							name:'',
              showPicList:[],
              officeType:[],
              jianzhuType:[],
							areaCode:[],//城市当前编码
							defaultareaCode:[],
					    areaName:'',//当前城市
              areaZone:'',
					    address:'',//地址
							latitude:'',//纬度
							longitude:'',//经度
							propertyCosts:'',//物业费
							typePrefix:'',//商铺类别前缀
							typeSuffix:'',//商铺类别后缀
					    numberOfPlies:'',//总层数
					    developers:'',//开发商
					    constructionTime:'',//建筑年代
					    buildingType:'',//建筑类型
					    estateCompany:'',//建物业公司
					    timeOfCompletion:'',//竣工时间
					    floorArea:'',//占地面积
					    areaOfStructure:'',//建筑面积
					    bayArea:'',//开间面积
					    passengerElevatorNumber:'',//客梯数量
					    transferNumber:'',//货梯数量
					    airCondition:'',//空调数量
					    decorateState:'',//装修状况
					    parkingSpaces:'',
              loading:false,
              id:'',
						}
					})
					dispatch({
            type: 'initial',
          });
          dispatch({
            type:'findLabel',
            payload:{
              groups:[
                {
                  typeName:'写字楼类型',
                  areaPath:null,
                },
                {
                  typeName:'楼栋建筑类型',
                  areaPath:null,
                },
                {
                  typeName:'写字楼级别',
                  areaPath:null,
                },
              ]
              // typeNames:['物业类型','楼盘字典新建商铺建筑类型']
            }
          })
					if(location.state){
						dispatch({type:'findData',
							payload:{
								id:location.state.id
							}
						})
            dispatch({
							type:'initialSuccess',
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
    *initial({ payload }, { call, put }){
      const  {data,err}  = yield call(findAllProvinces, parse(payload));
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        yield put ({
          type: 'initialSuccess',
          payload: {
						arrOptions:_toCascaderOptions(data.data),
						allProvinces:data.data,
          },
        });
      }
    },
    *findLabel({ payload }, { call, put}){
			const  {data,err}  = yield call(findGroup, parse(payload));
      if(err){
				return message.error('出错了，请联系管理员');
			}
      let officeTypes=[];
      let jianzhuTypes=[];
      let officeLevel=[];
			if(data.data){
        for(let i=0;i<data.data.length;i++){
          if(data.data[i].typeName=='写字楼类型'){
            data.data[i].nameAndValues.map(item=>(
              officeTypes.push(item.value)
            ))
            // officeTypes=data.data[i].names
          }else if(data.data[i].typeName=='楼栋建筑类型'){
            data.data[i].nameAndValues.map(item=>(
              jianzhuTypes.push(item.value)
            ))
            // jianzhuTypes=data.data[i].names
          }else if(data.data[i].typeName=='写字楼级别'){
            data.data[i].nameAndValues.map(item=>(
              officeLevel.push(item.value)
            ))
            // jianzhuTypes=data.data[i].names
          }
        }
				yield put ({
					type: 'initialSuccess',
					payload: {
						jianzhuType:jianzhuTypes,
						officeType:officeTypes,
						officeLevel:officeLevel,
					},
				});
			}
		},
		*createOffice({ payload }, { call, put }){
			const  {data,err}  = yield call(addOfficeBuilding, parse(payload));
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        yield put ({
					type: 'initialSuccess',
					payload: {
						showPicList:[],
					},
				});
        yield put(routerRedux.goBack());
        message.success('创建成功');
      }else{
        message.error(data.message);
      }
		},
		*findData({ payload }, { call, put ,select}){
      const  {data,err}  = yield call(findOfficeBuilding,{...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        const  arrProvinces  = yield call(findAllProvinces,{...payload});
        let arr;
        if(!!arrProvinces.data.data && !!data.data.areaCode){
          arr	=_getCode(arrProvinces.data.data,data.data.areaCode);
        }
        const showImg=[];
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
          type: 'initialSuccess',
          payload: {
						name:data.data.name,
						id:payload.id,
            showPicList:showImg,
            loading:false,
						defaultareaCode:arr,
						areaCode:data.data.areaCode,//城市当前编码
				    areaName:data.data.areaName,//当前城市
				    address:data.data.address,//地址
				    areaZone:data.data.areaZone,//
						latitude:data.data.latitude,//纬度
						longitude:data.data.longitude,//经度
						propertyCosts:(data.data.propertyCosts===null?'':(data.data.propertyCosts.toString())),//物业费
						typePrefix:data.data.typePrefix,//商铺类别前缀
						typeSuffix:data.data.typeSuffix,//商铺类别后缀
				    numberOfPlies:(data.data.numberOfPlies===null?'':(data.data.numberOfPlies.toString())),//总层数
				    developers:data.data.developers,//开发商
				    constructionTime:(data.data.constructionTime===null?'':(data.data.constructionTime.toString())),//建筑年代
				    buildingType:data.data.buildingType,//建筑类型
				    estateCompany:data.data.estateCompany,//建物业公司
				    timeOfCompletion:data.data.timeOfCompletion,//竣工时间
				    floorArea:data.data.floorArea,//占地面积
				    areaOfStructure:data.data.areaOfStructure,//建筑面积
				    bayArea:data.data.bayArea,//开间面积
				    passengerElevatorNumber:(data.data.passengerElevatorNumber===null?'':(data.data.passengerElevatorNumber.toString())),//客梯数量
				    transferNumber:(data.data.transferNumber===null?'':(data.data.transferNumber.toString())),//货梯数量
				    airCondition:data.data.airCondition,//空调数量
				    decorateState:data.data.decorateState,//装修状况
				    parkingSpaces:(data.data.parkingSpaces===null?'':(data.data.parkingSpaces.toString())),//停车位
          },
        });
      }
    },
		*editOffice({ payload }, { call, put }){
			const  {data,err}  = yield call(editOfficeBuilding, parse(payload));
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        yield put(routerRedux.goBack());
        message.success('修改成功');
      }else{
        message.error(data.message);
      }
		},
	},
	reducers: {
		initialSuccess(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
