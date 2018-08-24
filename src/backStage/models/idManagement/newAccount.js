import {findAllAreasOpen,findCitiesFetch,
  findFullPathByBePartOf,findOpeartor,add,findOneFecth,edit} from '../../services/idManagement/newAccount';
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
	namespace: 'newAccount',
	state: {
		cascaderOptions:[],//营业地址级联数组
		orginCascader:[],//营业地址级联原数组
		initMarkers:[],
		latitude:'',
		longitude:'',
		tradingCenterPic:[],//交易中心图片
		licensePic:[],//营业执照图片
		cityOptions:[],//所在城市级联数组
		orgincityOptions:[],//所在城市级联原数组
    areaCity:[],//地区选择数组
    orginareaCity:[],//地区选择原数组
    opeartor:[],//
    address:'',
    agencyId:'',
    areaAgency:'',
    areaCode:'',
    bePartOf:'',
    businessPath:'',
    businessPathCode:'',
    businessPhone:'',
    commonLicenseNumber:'',
    companyAddress:'',
    companyFullPath:'',
    companyFullPathCode:'',
    companyName:'',
    contacts:'',
    contactsPhone:'',
    corporation:'',
    fullPath:'',
    header:'',
    latitude:'',
    licenseNumber:'',
    licensePic:[
      {id:'',
      isCover:false,
      name:'',
      rename:false,
      src:'',}
    ],
    licenseType:'',
    loginName:'',
    longitude:'',
    name:'',
    tradingCenterPic:[
      {id:'',
      isCover:false,
      name:'',
      rename:false,
      src:'',}
    ],
    id:'',
    defultbusiness:[],
    defaultCity:[],
    defaultBePartOf:[],
    loading:true,
    mapChangePosition:'',
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/idManagement/dealCenterIdIndex/newAccount') {
          dispatch({
            type:'clearState',
            payload:{
              cascaderOptions:[],//营业地址级联数组
          		orginCascader:[],//营业地址级联原数组
          		initMarkers:[],
          		latitude:'',
          		longitude:'',
          		tradingCenterPic:[],//交易中心图片
          		licensePic:[],//营业执照图片
          		cityOptions:[],//所在城市级联数组
          		orgincityOptions:[],//所在城市级联原数组
              areaCity:[],//地区选择数组
              orginareaCity:[],//地区选择原数组
              opeartor:[],//
              address:'',
              agencyId:'',
              areaAgency:'',
              areaCode:'',
              bePartOf:'',
              businessPath:'',
              businessPathCode:'',
              businessPhone:'',
              commonLicenseNumber:'',
              companyAddress:'',
              companyFullPath:'',
              companyFullPathCode:'',
              companyName:'',
              contacts:'',
              contactsPhone:'',
              corporation:'',
              fullPath:'',
              header:'',
              latitude:'',
              licenseNumber:'',
              licensePic:[

              ],
              licenseType:'',
              loginName:'',
              longitude:'',
              name:'',
              tradingCenterPic:[

              ],
              id:'',
              defultbusiness:[],
              defaultCity:[],
              defaultBePartOf:[],
              mapChangePosition:'',
            }
          })
          dispatch({
						type:'findAllAreas'
					})
					dispatch({
						type:'findCities'
					})
          if(!!location.state){
            dispatch({
              type:'findOne',
              payload:{
                id:location.state.id
              }
            })
          }
				}
			});
		},
	},
	effects: {
		*findAllAreas({ payload }, { call, put }){
      const  {data}  = yield call(findAllAreasOpen,{...payload});
      if(!!data.data){
				const cascader=_toCascaderOptions(data.data)
				yield put({
					type:'setState',
					payload:{
						cascaderOptions:cascader,
						orginCascader:data.data,
					}
				})
			}
    },
		*findCities({ payload }, { call, put }){
      const  {data}  = yield call(findCitiesFetch,{...payload});
      if(!!data.data){
				const cascaderCity=_toCascaderOptions(data.data)
				yield put({
					type:'setStateFindCities',
					payload:{
						cityOptions:cascaderCity,
						orgincityOptions:data.data,
					}
				})
			}
    },
		*getArea({ payload }, { call, put }){
      const  {data}  = yield call(findFullPathByBePartOf,{...payload});
      if(!!data.data){
				const areaCitys=_toCascaderOptions(data.data)
				yield put({
					type:'setState',
					payload:{
						areaCity:areaCitys,
						orginareaCity:data.data,
					}
				})
			}
    },
		*cascaderChange({ payload }, { call, put }){
      const  {data}  = yield call(findOpeartor,{...payload});
      if(!!data.data){
				yield put({
					type:'setState',
					payload:{
						opeartor:data.data,
					}
				})
			}
    },
    *addSubmit({ payload }, { call, put }){
      const  {data}  = yield call(add,{...payload});
      if(!!data.data){
        message.success('创建成功')
				yield put(routerRedux.goBack());
			}else{
        message.error(`${data.message}`);
      }
    },
    *editSubmit({ payload }, { call, put }){
      const  {data}  = yield call(edit,{...payload});
      if(!!data.data){
        message.success('编辑成功')
				yield put(routerRedux.goBack());
			}else{
        message.error(`${data.message}`);
      }
    },
    *findOne({ payload }, { call, put }){
      const  {data}  = yield call(findOneFecth,{...payload});
      if(!!data.data){
        const tradingArr=[];
        if(data.data.tradingCenterPic){
          tradingArr.push({
            id:data.data.tradingCenterPic,
            isCover:false,
            name:'',
            rename:false,
            src:data.data.tradingCenterPic,
          })
        }
        const licensePicArr=[];
        if(data.data.licensePic){
          licensePicArr.push({
            id:data.data.licensePic,
            isCover:false,
            name:'',
            rename:false,
            src:data.data.licensePic,
          })
        }
        //渲染营业地址
        const  arrProvinces  = yield call(findAllAreasOpen,{...payload});
        let arr;
        if(!!arrProvinces.data.data && !!data.data.businessPathCode){
          arr	=_getCode(arrProvinces.data.data,data.data.businessPathCode);
        }
        //渲染所在城市
        const arrCitys=yield call(findCitiesFetch);
        let defaultCitys;
        if(!!arrCitys.data.data && !!data.data.companyFullPathCode){
          defaultCitys	=_getCode(arrCitys.data.data,data.data.companyFullPathCode);
        }
        //渲染地区
        const areaChose=yield call(findFullPathByBePartOf,{bePartOf:data.data.bePartOf});
        let defaultBePartOfs;
        let areaCitys;
        if(data.data.bePartOf=='总部'){
          defaultBePartOfs=[];
          areaCitys=[];
        }else{
          if(!!areaChose.data.data){
            defaultBePartOfs	=_getCode(areaChose.data.data,data.data.areaCode);
            areaCitys=_toCascaderOptions(areaChose.data.data)
          }
        }
        //渲染代理商
        let defultAgents;
        if(data.data.bePartOf=='总部'){
          defultAgents=[]
        }else{
          const defultAgent=yield call(findOpeartor,{areaCode:data.data.areaCode})
          defultAgents=defultAgent.data.data;
        }
        yield put({
          type:'setState',
          payload:{
            address:data.data.address,
            agencyId:data.data.agencyId,
            areaAgency:data.data.areaAgency,
            areaCode:data.data.areaCode,
            bePartOf:data.data.bePartOf,
            businessPath:data.data.businessPath,
            businessPathCode:data.data.businessPathCode,
            businessPhone:data.data.businessPhone,
            commonLicenseNumber:data.data.commonLicenseNumber,
            companyAddress:data.data.companyAddress,
            companyFullPath:data.data.companyFullPath,
            companyFullPathCode:data.data.companyFullPathCode,
            companyName:data.data.companyName,
            contacts:data.data.contacts,
            contactsPhone:data.data.contactsPhone,
            corporation:data.data.corporation,
            fullPath:data.data.fullPath,
            header:data.data.header,
            latitude:data.data.latitude,
            licenseNumber:data.data.licenseNumber,
            licensePic:licensePicArr,
            licenseType:data.data.licenseType,
            loginName:data.data.loginName,
            longitude:data.data.longitude,
            name:data.data.name,
            tradingCenterPic:tradingArr,
            id:data.data.id,
            defultbusiness:arr,
            defaultCity:defaultCitys,
            defaultBePartOf:defaultBePartOfs,
            areaCity:areaCitys,
            opeartor:defultAgents,
            loading:false,
          }
        })
      }
    }
	},
	reducers: {
		setState(state,{payload}){
			return { ...state, ...payload };
		},
		clearState(state,{payload}){
			return { ...state, ...payload };
		},
		setStateFindCities(state,{payload}){
			return { ...state, ...payload };
		},
	}
}
