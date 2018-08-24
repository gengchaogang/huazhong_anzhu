import {findAllContract,findAllAreas,editContract,deleteContractFetch,isHasFetch,addContract,findGroup} from '../../services/contractManagement/contractAgreementModulesManage';
import { parse } from 'qs';
import {message,Modal} from 'antd';
const _toCascaderOptions=(arr)=>{
  var options = [];
  var map = {};
  arr.forEach(({code,pCode,lable})=>{
    var option = {value: lable, label:lable}, children;
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
	namespace: 'contractAgreementModulesManage',
	state: {
    dataSource:[],
    loading:true,
    total:'',
    pageNo:0,
    keyword:'',//搜索关键字
    city:'',//搜索城市
    cityArr:[],
    projectId:'',
    key:'',
    agreementName:'',
    agreementType:'',
    labelArr:[],//标签数组
    dxLoading:false,
    uploadContractStatus:false,
    editStatus:false,
    warningStatus:false,
    areaPath:'',
    most:[],
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/contractManagement/contractAgreementModulesManage') {
          // dispatch({type:'findCity'})
          // dispatch({type:'findAll'})
          dispatch({type:'initailFindAll'})
				}
			});
		},
	},
	effects: {
    *initailFindAll({ payload }, { call, put }){
      yield put({type:'findCity'})
      yield put({type:'findAll'})
    },
    //获取城市列表
    *findCity({ payload }, { call, put }){
      const  {data,err}  = yield call(findAllAreas, {...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        let cityArr;
        cityArr=_toCascaderOptions(data.data);
        yield put({type:'initailSuccess',
          payload:{
            cityArr:cityArr,
          }
        })
      }else{
        message.error(`${data.message}`)
      }
    },
    //初始化获取表格内容
    *findAll({ payload }, { call, put }){
      const  {data,err}  = yield call(findAllContract, {...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        const dataSource=[]
        data.data.content.map((item,index)=>(
          dataSource.push({
            key:item.id,
            number:index+1,
            url:item.url,
            agreementType:item.agreementType,
            agreementName:item.agreementName,
            areaPath:item.areaPath,
            updateDate:item.updateDate,
            userName:item.userName,
          })
        ))
        yield put({
          type:'initailSuccess',
          payload:{
            dataSource:dataSource,
            loading:false,
            total:data.data.totalElements,
            pageNo:data.data.number+1,
            keyword:'',
            city:'',
            agreementName:'',
            key:'',
            id:'',
            editStatus:false,
            uploadContractStatus:false,
            warningStatus:false,
            areaPath:'',
            agreementType:'',
            most:[],
          }
        })
      }else{
        message.error(`${data.message}`)
      }
    },
    *isHasExistence({ payload }, { call, put }){
      const  {data,err}  = yield call(isHasFetch, {...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.status=='success'){
        if(data.data===true){
          yield put({type:'initailSuccess',
            payload:{warningStatus:true,
              areaPath:payload.areaPath,
              agreementType:payload.agreementType,
            }
          })
        }else{
          const contract=yield call(addContract,{...payload})
          if(contract.data.data){
            yield put({type:'findAll'})
            message.success('保存成功')
          }
        }
      }
    },
    //搜索
    *searchContract({ payload }, { call, put }){
      const  {data,err}  = yield call(findAllContract, {...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        const dataSource=[]
        data.data.content.map((item,index)=>(
          dataSource.push({
            key:item.id,
            number:index+1,
            url:item.url,
            agreementType:item.agreementType,
            agreementName:item.agreementName,
            areaPath:item.areaPath,
            updateDate:item.updateDate,
            userName:item.userName,
          })
        ))
        yield put({
          type:'initailSuccess',
          payload:{
            dataSource:dataSource,
            loading:false,
            keyword:payload.keyword,
            city:payload.city,
            total:data.data.totalElements,
            pageNo:data.data.number+1,
          }
        })
      }else{
        message.error(`${data.message}`)
      }
    },
    //分页
    *paginationChange({ payload }, { call, put }){
      const  {data,err}  = yield call(findAllContract, {...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        const dataSource=[]
        data.data.content.map((item,index)=>(
          dataSource.push({
            key:item.id,
            number:index+1,
            url:item.url,
            agreementType:item.agreementType,
            agreementName:item.agreementName,
            areaPath:item.areaPath,
            updateDate:item.updateDate,
            userName:item.userName,
          })
        ))
        yield put({
          type:'initailSuccess',
          payload:{
            dataSource:dataSource,
            loading:false,
            keyword:payload.keyword,
            city:payload.city,
            total:data.data.totalElements,
            pageNo:data.data.number+1,
          }
        })
      }else{
        message.error(`${data.message}`)
      }
    },
    //重置
    *resetField({ payload }, { call, put }){
      const  {data,err}  = yield call(findAllContract, {...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        const dataSource=[]
        data.data.content.map((item,index)=>(
          dataSource.push({
            key:item.id,
            number:index+1,
            url:item.url,
            agreementType:item.agreementType,
            agreementName:item.agreementName,
            areaPath:item.areaPath,
            updateDate:item.updateDate,
            userName:item.userName,
          })
        ))
        yield put({
          type:'initailSuccess',
          payload:{
            dataSource:dataSource,
            loading:false,
            keyword:payload.keyword,
            city:payload.city,
            total:data.data.totalElements,
            pageNo:data.data.number+1,
          }
        })
      }else{
        message.error(`${data.message}`)
      }
    },
    //删除
    *deleteContract({ payload }, { call, put }){
      const  {data,err}  = yield call(deleteContractFetch, {...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        yield put({type:'findAll'})
        message.success('删除成功')
      }else{
        message.error(`${data.message}`)
      }
    },
    //获取标签
    *uploadContract({ payload }, { call, put }){
      const  {data,err}  = yield call(findGroup, {...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        let labelArr;
        data.data.map(item=>(
          item.typeName=='协议类型'?
          (labelArr=item.nameAndValues):''
        ))
        yield put({type:'initailSuccess',
          payload:{labelArr:labelArr}
        })
      }
    },
    //上传确定
    *uploadSure({ payload }, { call, put }){
      const  {data,err}  = yield call(addContract, {...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        yield put({type:'findAll'})
        message.success('保存成功')
      }else{
        message.error(data.message);
        yield put({type:'findAll'})
      }
    },

    *editOk({ payload }, { call, put }){
      const  {data,err}  = yield call(editContract, {...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        yield put({type:'findAll'})
        message.success('保存成功')
      }else{
        message.error(data.message)
      }
    }
	},
	reducers: {
		initailSuccess(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
