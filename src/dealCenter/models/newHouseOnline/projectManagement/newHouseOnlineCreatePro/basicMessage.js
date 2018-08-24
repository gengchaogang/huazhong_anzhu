import lodash from 'lodash';
import {uploadBasicMessage,editBasicMessage,getInitDataFetch,getLabelDataFetch,getInitCitysFetch} from '../../../../services/newHouseOnline/createNewProject/basicMessage';
function _toCascaderOptions(arr){
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
function _getNameArrByCode(arr, code){
  var nameArr = [], item;
  for(var i=arr.length-1; i>=0; i--){
    item = arr[i];
    if(item.code == code){
      nameArr.push(item.label);
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

function _getNamePathsByCode(arr, code){
  var nameArr = _getNameArrByCode(arr, code);
  return "/"+nameArr.join("/");
}
import moment from 'moment'
import qs from 'qs'
import { routerRedux } from 'dva/router';
const initialState={
  address:null,
  initAreaCode:null,
  areaPath:null,
  initMarkers:[],
  areaAndCode:[],
  buildingTypeTags:[],
  houseTypesTags:[],
  characteristicTags:[],
  fitmentTypeTags:[],
  initHouseTypesTags:[],
  initCharacteristicTags:[],
  initFitmentTypeTags:[],
  initBuildingTypeTags:[],
  formData:[],
  longitude:'', //项目详细经度
  latitude:'', //项目详细纬度
  timeToOnline:'',//项目上线时间
  openingTime:'',//开盘时间
  deliverTime:'',//交房时间
  isEdit:null,
  reEdit:false,
  projectName:"创建",
  projectId:null,
  labelData:null,
  promptObj:{
   visible:false,
   description:'',
   title:'',
   promptFor:'default',
   okText:'确定',
   type:'',
   todo:'',
 },
};

export default {
  namespace: 'basicMessage',
  state:initialState,
  reducers: {
    setDefaultState(state,action){
      return lodash.cloneDeep(initialState);
    },
    togglePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    initEdit(state,action){
      return{...state,...action.payload}
    },
    saveAreaCode(state,action){
      return{...state,...action.payload}
    },
    saveFormData(state,action){

      return{...state,formData:action.payload,...action.payload}
    },
    changeState(state,action){
      return{...state,isEdit:action.payload.isEdit}
    },
    saveLabelData(state,action){
      return{...state,...action.payload}
    },
    saveProjectId(state,action){
      return{...state,...action.payload}
    },
    changeMarkers(state,action){
      return{...state,...action.payload}
    },
    changeinitMarkers(state,action){
      return{...state,...action.payload}
    },
    saveTags(state,action){
      return{...state,...action.payload}
    },
    saveAreaPath(state,action){
      return{...state,...action.payload}
    },
    saveAddress(state,action){
      return{...state,...action.payload}
    },
  },
  subscriptions:{
    setup({ dispatch, history }) {
         history.listen(location => {
          if(location.pathname === '/newHouseOnline/projectManagement/createProject/basicMessage'){
            dispatch({
              type:"setDefaultState",
            })
            setTimeout(()=>dispatch({
              type:'initComponent',
              payload:location.state,
            }),0);
          }
         });
       },
  },
  effects:{
    *initComponent({payload},{put}){


      yield put({  //获取标签
        type:"getLabelData",
        payload:{
          groups:[{
            typeName:'新房物业类型',
            areaPath:''
          },{
            typeName:'新房特色',
            areaPath:null
          },{
            typeName:'装修情况',
            areaPath:null
          },{
            typeName:'楼栋建筑类型',
            areaPath:null
          }]
        }
      });
      yield put({
        type:"getInitCitys",
      })
      if(!!payload && !!payload.projectId){
        yield put({  //保存projectId并修改是否编辑的状态
          type:'initEdit',
          payload:{projectId:payload.projectId,isEdit:true,reEdit:!!payload.reEdit}
        });
        yield put({  //发起查询此id对应数据请求
          type:'getInitData',
          payload:{
            id:payload.projectId
          }
        });
      }else{
        yield put({
          type:"changeState",
          payload:{
            isEdit:false
          }
        })
      }
    },
    *getInitCitys({payload},{call,put}){
      const areaAndCode=[];
      const {data}=yield call(getInitCitysFetch)
      if(!!data&&data.status==='success'){
        if(!!data.data){
          const reusltData=_toCascaderOptions(data.data)
          yield put({type:"saveAreaCode",payload:{
            areaAndCode:reusltData
          }})
        }
      }
    },
    *uploadMessages({payload},{select,call,put}){  //上传项目基本资料
        const isEdit = yield select(({ basicMessage }) => basicMessage.isEdit);
        const uploadData=payload;
        const onsellDateTime=moment(payload.timeToOnline).format('YYYY-MM-DD HH:mm:ss')
        uploadData.onsellDateTime=onsellDateTime;
        delete uploadData.timeToOnline
        const  propertyType=[];
        payload.propertyType.map(item=>{
          propertyType.push(item)
        })
        uploadData.propertyType=propertyType
        const characteristic=[]
        payload.characteristic.map(item=>{
          characteristic.push(item)
        })
        uploadData.characteristic=characteristic
        let decoration;
        payload.decoration.map(item=>{
          decoration=item
        })
        uploadData.decoration=decoration

        let buildingType=[];
        payload.buildingType.map(item=>{
          buildingType.push(item)
        })
        uploadData.buildingType=buildingType
        uploadData.areaCode=uploadData.areaCode.join('/')
        const {data}=yield call(uploadBasicMessage,{...uploadData});
        //data=>result
        //测试默认上传成功
        if(!!data&&data.status==="success"){
          yield put({type:'saveProjectId',payload:{projectId:data.data}});
          yield put({type:'togglePrompt',payload:{
            type:'success',
            title:'成功!',
            description:'添加项目基本资料成功!',
            visible:true,
            todo:"closeAndToNext"
          }})
        }else{
          yield put({type:'togglePrompt',payload:{
            type:'error',
            title:'失败!',
            description:'添加项目基本资料失败!',
            visible:true,
            todo:"closeModal"
          }})
        }
    },
    *editMessage({payload},{call,put,select}){ //编辑项目基本资料
      const uploadData=payload;
      console.log('payload编辑项目基本资料',payload);
      const onsellDateTime=moment(payload.timeToOnline).format('YYYY-MM-DD HH:mm:ss')
      uploadData.onsellDateTime=onsellDateTime
      delete uploadData.timeToOnline
      const  propertyType=[];
      payload.propertyType.map(item=>{
        propertyType.push(item)
      })
      uploadData.propertyType=propertyType
      const characteristic=[]
      payload.characteristic.map(item=>{
        characteristic.push(item)
      })
      uploadData.characteristic=characteristic
      let decoration;
      payload.decoration.map(item=>{
        decoration=item
      })
      uploadData.decoration=decoration
      let buildingType=[];
      payload.buildingType.map(item=>{
        buildingType.push(item)
      })
      uploadData.buildingType=buildingType
      uploadData.areaCode=uploadData.areaCode.join('/')
      const longitude = yield select(({ basicMessage }) => basicMessage.longitude);
      const latitude = yield select(({ basicMessage }) => basicMessage.latitude);
      uploadData.longitude=longitude;
      uploadData.latitude=latitude;
        const {data}=yield call(editBasicMessage,{...uploadData});
        if(data.status==='success'){
          yield put({type:'togglePrompt',payload:{
            type:'success',
            title:'成功!',
            description:'编辑项目基本资料成功!',
            visible:true,
            todo:"closeAndToNext"
          }})
        }else{
          yield put({type:'togglePrompt',payload:{
            type:'error',
            title:'失败!',
            description:'编辑项目基本资料失败!',
            visible:true,
            todo:"closeModal"
          }})
        }
      },
    *getInitData({payload},{call,put}){ //如果一开始操作就是编辑状态想后台拿初始数据
        const {data}=yield call(getInitDataFetch,payload);
        if(!!data&&data.status==='success'){
          if(!!data.data){
            if(!!data.data.areaPath){
              const initAreaCode=data.data.areaCode.split('/')
              yield put({
                type:"saveAreaCode",
                payload:{
                  initAreaCode:initAreaCode,
                  areaPath:data.data.areaPath
                }
              })
            }
            const initCharacteristicTags=[];
            const initFitmentTypeTags=[];
            const initHouseTypesTags=[];
            let initBuildingTypeTags=[];

            if(!!data.data.propertyType){
                data.data.propertyType.map(item=>{
                  initHouseTypesTags.push(item)
                })
            }
            if(!!data.data.characteristic){
              data.data.characteristic.map(item=>{
                initCharacteristicTags.push(item)
              })
            }
            if(!!data.data.decoration){
              initFitmentTypeTags.push(data.data.decoration)
            }
            if(!!data.data.buildingType){
              initBuildingTypeTags=data.data.buildingType
            }
            yield put({
              type:"saveTags",
              payload:{
                initHouseTypesTags:initHouseTypesTags,
                initCharacteristicTags:initCharacteristicTags,
                initFitmentTypeTags:initFitmentTypeTags,
                initBuildingTypeTags:initBuildingTypeTags,
              }
            })
            yield put({type:'saveFormData',payload:{formData:data.data,projectId:payload.id,isEdit:true}})
            if(!!data.data.latitude&&!!data.data.longitude){
              yield put({type:'changeinitMarkers',payload:{
                // initMarkers:data.data.coordinates.split(',')
                initMarkers:[{position:[data.data.longitude,data.data.latitude],content:null}],
                longitude:data.data.longitude,
                latitude:data.data.latitude,
              }})
            }
          }
        }else{
          yield put({type:'togglePrompt',payload:{
            type:'error',
            title:'失败!',
            description:`获取初始数据失败:${data.message}`,
            visible:true,
            todo:"closeModal"
          }})
        }
    },
    *getLabelData({payload},{call,put}){
      const houseTypesTags=[];
      const characteristicTags=[];
      const fitmentTypeTags=[];
      const buildingTypeTags=[];
      const {data}=yield call(getLabelDataFetch,{...payload});
      if(!!data&&data.status==='success'){
        if(!!data.data){
          const resultData=data.data;
          resultData.map(item=>{
            if(item.typeName==='新房物业类型'){
              item.nameAndValues.map(i=>{
                houseTypesTags.push(i.name)
              })
            }
            if(item.typeName==='新房特色'){
              item.nameAndValues.map(i=>{
                characteristicTags.push(i.name)
              })
            }
            if(item.typeName==='装修情况'){
              item.nameAndValues.map(i=>{
                fitmentTypeTags.push(i.name)
              })
            }
            if(item.typeName==='楼栋建筑类型'){
              item.nameAndValues.map(i=>{
                buildingTypeTags.push(i.name)
              })
            }
          })
          yield put({type:'saveLabelData',payload:{
            houseTypesTags:houseTypesTags,
            characteristicTags:characteristicTags,
            fitmentTypeTags:fitmentTypeTags,
            buildingTypeTags:buildingTypeTags,
          }})
        }
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:`获取标签数据失败:${data.message}`,
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *getLabel({payload},{call,put}){
      const getLabelData=yield call(getLabelDataFetch,{...payload});
      const label=yield put({ type: 'setState', payload: {getLabelData:getLabelData} });
    }
  },
}
