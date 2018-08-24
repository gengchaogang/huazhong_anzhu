import {
  getInitTableDataFetch,
  getInitCitysFetch,
  addAdvertisementFetch,
  deleteOneFetch,
  getOneDataFetch,
  editAdvertisementFetch,
  moveUpFetch,
  moveDownFetch,
  onLineFetch,
  offLineFetch,
} from '../../services/adManagement/putManage';
import {message} from 'antd';
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
export default {
  namespace: 'putManage',
  state: {
    imgSrc:'',
    oneData:{},
    isEdit:false,
    areaPath:[],
    tableLoading:true,
    tableData:[],
    visible:false,
    areaAndCode:[],
    showPicList:[],
    areaOrgin:[],
    promptObj:{
     visible:false,
     description:'',
     title:'',
     promptFor:'default',
     okText:'确定',
     type:'',
     todo:'',
    },
    pageNo:'',
    total:'',
  },
  subscriptions:{
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/adManagement/putManage'){
          // dispatch({
          //   type:"getInitTableData"
          // })
          // dispatch({
          //   type:"getInitCitys"
          // })
          dispatch({type:'initialFindAll'})
        }
      });
    },
  },
  reducers: {
    togglePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    saveTableData(state,action){
      return{...state,...action.payload}
    },
    changeLoading(state,action){
      return{...state,...action.payload}
    },
    changeVisible(state,action){
      return{...state,...action.payload}
    },
    saveAreaCode(state,action){
      return{...state,...action.payload}
    },
    changePicList(state,action){
      return{...state,showPicList:action.payload}
    },
    changeIsEdit(state,action){
      return{...state,...action.payload}
    },
    saveOneData(state,action){
      return{...state,...action.payload}
    },
    changePicLists(state,action){
      return{
        ...state,
        showPicList:action.payload.showPicList,
      }
    }
  },
	effects: {
    *initialFindAll({payload},{call,put}){
      yield put({type:'getInitTableData',payload:{pageNo:0,pageSize:10}});
      yield put({type:'getInitCitys'});
    },
    *getInitTableData({payload},{call,put}){
      // console.log({...payload},'payloadpayload');
      const {data,err}= yield call(getInitTableDataFetch,{...payload})
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(!!data&&data.status==="success"){
        const resultData=[];
        data.data.content.map((item,index)=>{
          resultData.push({
            key:item.id,
            address:item.address,
            headline:item.headline,
            areaPath:item.areaPath,
            number:index+1,
            sortIdx:item.sortIdx,
            status:item.status,
            apkType:item.apkType,
          })
        })
        yield put({
          type:"saveTableData",
          payload:{
            tableData:resultData,
            total:data.data.totalElements,
            pageNo:data.data.number+1,
          }
        })
        yield put ({
          type:"changeLoading",
          payload:{
            tableLoading:false
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:'获取初始数据失败,请重新刷新页面!',
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *getInitCitys({payload},{call,put}){
      const areaAndCode=[];
      const {data,err}=yield call(getInitCitysFetch)
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(!!data&&data.status==='success'){
        if(!!data.data){
          const reusltData2=[];
          const reusltData=_toCascaderOptions(data.data)
          reusltData.map(item=>{
            reusltData2.push({
              value:item.value,
              label:item.label,
              children:item.children.map(i=>{
                return{
                  value:i.value,
                  label:i.label
                }
              })
            })
          })
          yield put({type:"saveAreaCode",payload:{
            areaAndCode:reusltData2,
            areaOrgin:data.data,
          }})
        }
      }
    },
    *addAdvertisement({payload},{call,put}){
      const {data,err}=yield call(addAdvertisementFetch,{...payload})
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(!!data&&data.status==='success'){
        yield put({type:'togglePrompt',payload:{
          type:'success',
          title:'成功!',
          description:'添加广告成功!',
          visible:true,
          todo:"closeModalAndFetch"
        }})
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:data.message,
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *editAdvertisement({payload},{call,put}){
      const {data,err}=yield call(editAdvertisementFetch,{...payload})
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(!!data&&data.status==='success'){
        yield put({type:'togglePrompt',payload:{
          type:'success',
          title:'成功!',
          description:'编辑广告成功!',
          visible:true,
          todo:"closeModalAndFetch"
        }})
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:data.message,
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *getOneData({payload},{call,put}){
      const {data,err}=yield call(getOneDataFetch,{...payload})
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(!!data&&data.status==='success'){
        const showPicList=[]
        const oneData={}
        let imgSrc;
        const resultData=data.data
        oneData.id=resultData.id,
        oneData.headline=resultData.headline,
        oneData.code=resultData.code.split('/'),
        oneData.address=resultData.address,
        oneData.source=resultData.source,
        oneData.areaPath=resultData.areaPath,        
        imgSrc=resultData.url,
        oneData.apkType=resultData.apkType,
        showPicList.push({
          name:resultData.headline,
          id:resultData.url,
          isCover:false,
          src:resultData.url,
          rename:false
        })
        yield put({type:'changePicLists',payload:{
          showPicList:showPicList,
        }})
        yield put({
          type:"saveOneData",
          payload:{
            oneData:oneData,
            visible:true,
            imgSrc:imgSrc
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:'获取数据失败!',
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *deleteOne({payload},{call,put}){
      const {data,err}=yield call(deleteOneFetch,{...payload})
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(!!data&&data.status==='success'){
        yield put({type:'togglePrompt',payload:{
          type:'success',
          title:'成功!',
          description:'删除广告成功!',
          visible:true,
          todo:"closeModalAndFetch"
        }})
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:'删除广告失败!',
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *moveUp({payload},{call,put}){
      const {data,err}=yield call(moveUpFetch,{...payload})
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(!!data&&data.status==='success'){
        yield put({type:'togglePrompt',payload:{
          type:'success',
          title:'成功!',
          description:'广告上移成功!',
          visible:true,
          todo:"closeModalAndFetch"
        }})
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:'广告上移失败!',
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *moveDown({payload},{call,put}){
      const {data,err}=yield call(moveDownFetch,{...payload})
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(!!data&&data.status==='success'){
        yield put({type:'togglePrompt',payload:{
          type:'success',
          title:'成功!',
          description:'广告下移成功!',
          visible:true,
          todo:"closeModalAndFetch"
        }})
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:'广告下移失败!',
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *onLine({payload},{call,put}){
      const {data,err}=yield call(onLineFetch,{...payload})
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(!!data&&data.status==="success"){
        yield put({type:'togglePrompt',payload:{
          type:'success',
          title:'成功!',
          description:'广告上线成功!',
          visible:true,
          todo:"closeModalAndFetch"
        }})
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:'广告上线失败!',
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *offLine({payload},{call,put}){
      const {data,err}=yield call(offLineFetch,{...payload})
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(!!data&&data.status==='success'){
        yield put({type:'togglePrompt',payload:{
          type:'success',
          title:'成功!',
          description:'广告下线成功!',
          visible:true,
          todo:"closeModalAndFetch"
        }})
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:'广告下线失败!',
          visible:true,
          todo:"closeModal"
        }})
      }
    }
	},
}
