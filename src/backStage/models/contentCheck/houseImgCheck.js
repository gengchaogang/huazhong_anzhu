import {
  findAllAreas,
  findGroup,
  getInitTableDataFetch,
} from '../../services/contentCheck/houseImgCheck';
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
	namespace: 'houseImgCheck',
	state: {
    totalElements:null,
    tableData:[],
    tableLoading:true,
    areaPath:[],
    pageNo:'',
    area:'',
    keyword:'',
    resourcesType:'',
    cascaderOptions:[],//城市级联数组
    cascaderOriginal:[],//城市级联原数组
    labelOptions:[],//标签数组
    promptObj:{
     visible:false,
     description:'',
     title:'',
     promptFor:'default',
     okText:'确定',
     type:'',
     todo:'',
   },
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/contentCheck/houseImgCheck') {
          dispatch({type:'initailFindAll'})
          // dispatch({type: 'findAreas'});
          // dispatch({type: 'findLabel',
          //   payload:{
          //     groups:[
          //       {areaPath:'',
          //       typeName:'新房物业类型',}
          //     ]
          //   }
          // });
          // dispatch({
          //   type:"getInitTableData",
          //   payload:{
          //     pageSize:10,
          //     pageNo:0
          //   }
          // })
				}
			});
		},
	},
	effects: {
    *initailFindAll({payload},{call,put}){
      yield put({
        type:'findAreas',
      });
      yield put({
        type:'findLabel',
        payload:{
          groups:[
            {areaPath:'',
            typeName:'新房物业类型',}
          ]
        }
      });
      yield put({
        type:'getInitTableData',
        payload:{
          pageSize:10,
          pageNo:0,
          area:'130000/130600',
          keyword:'',
          resourcesType:'',
        }
      })
    },
    *getInitTableData({payload},{call,put}){
      const {data,err}=yield call(getInitTableDataFetch,{...payload})
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(!!data&&data.status==='success'){
        const tableData=[];
        const totalElements=data.data.totalElements;
        data.data.content.map((item,index)=>{
          tableData.push({
            number:index+1,
            key:item.id,
            area:item.area,
            areaName:item.areaName,
            communityName:item.communityName,
            houseName:item.houseName,
            id:item.id,
            resourcesNumber:item.resourcesNumber,
            resourcesType:item.resourcesType,
            updateDate:item.updateDate,
            updateNumber:item.updateNumber,
          })
        })
        yield put({
          type:"saveTableData",
          payload:{
            tableData:tableData,
            totalElements:totalElements,
            tableLoading:false,
            pageNo:data.data.number+1,
            area:payload.area,
            keyword:payload.keyword,
            resourcesType:payload.resourcesType,
          }
        })
      }else{
        yield put({type:'togglePrompt',payload:{
          type:'error',
          title:'失败!',
          description:`${data.message}`,
          visible:true,
          todo:"closeModal"
        }})
      }
    },
    *findAreas({ payload }, { call, put }){
      const  {data,err}  = yield call(findAllAreas, parse(payload));
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        yield put({
          type:'initailSuccess',
          payload:{
            cascaderOptions:_toCascaderOptions(data.data),
            cascaderOriginal:data.data,
          }
        })
      }else{
        message.error(`${data.message}`)
      }
    },
    *findLabel({ payload }, { call, put }){
      const  {data,err}  = yield call(findGroup, parse(payload));
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        let labelOptions;
        data.data.map(item=>(
          item.typeName=='新房物业类型'?
          labelOptions=item.nameAndValues:''
        ))
        yield put ({
          type:'initailSuccess',
          payload:{
            labelOptions:labelOptions,
          }
        })
      }else{
        message.error(`${data.message}`)
      }
    },
	},
	reducers: {
		initailSuccess(state,{payload}){
			return { ...state, ...payload };
		},
    togglePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
		saveAreaPath(state,{payload}){
			return { ...state, ...payload };
		},
		changeLoading(state,{payload}){
			return { ...state, ...payload };
		},
		saveTableData(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
