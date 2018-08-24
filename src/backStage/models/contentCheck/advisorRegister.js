import {findAllAudit,findAllAreasOpen} from '../../services/contentCheck/advisorRegister';
import { parse } from 'qs';
import {message} from 'antd';
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
	namespace: 'advisorRegister',
	state: {
    auditStatus:'待审核',//初始状态
    pendingAudit:[],//待审核数组
    loginFailed:[],//注册失败数组
    total:'',//总条数
    pageNo:0,//当前页码
    loading:true,
    cascaderOptions:[],//城市级联数组
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/contentCheck/advisorRegister') {
          dispatch({type:'initailFindAll'})
          // dispatch({type:'findCity'})
          // dispatch({
          //   type:'findeDataSource',
          //   payload:{
          //     auditStatus:'待审核',
          //   }
          // })
				}
			});
		},
	},
	effects: {
    *initailFindAll({payload},{call,put}){
      yield put({type:'findCity'});
      yield put({
        type:'findeDataSource',
        payload:{auditStatus:'待审核',fullPath:'/河北省/保定市'}
      })
    },
    *findCity({payload},{call,put}){
      const  {data,err}  = yield call(findAllAreasOpen, parse(payload));
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        yield put({
          type:'initailSuccess',
          payload:{
            cascaderOptions:_toCascaderOptions(data.data)
          }
        })
      }else{
        message.error(`${data.message}`)
      }
    },
    *findeDataSource({ payload }, { call, put }){
      const  {data,err}  = yield call(findAllAudit, parse(payload));
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        const pendingAudit=[];
        data.data.content.map((item,index)=>(
          pendingAudit.push({
            key:item.id,
            number:index+1,
            status:'待审核',
            createDateTime:item.createDateTime,
            loginName:item.loginName,
            companyName:item.companyName,
            fullPath:item.fullPath,
          })
        ))
        yield put({
          type:'initailSuccess',
          payload:{
            pendingAudit:pendingAudit,
            total:data.data.totalElements,
            auditStatus:payload.auditStatus,
            loading:false,
            pageNo:data.data.number+1,
          }
        })
      }else{
        message.error(`${data.message}`)
      }
    },
    *changeAuditStatus({ payload }, { call, put }){
      const  {data,err}  = yield call(findAllAudit, parse(payload));
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        const pendingAudit=[];
        const loginFailed=[];
        if(payload.auditStatus=='待审核'){
          data.data.content.map((item,index)=>(
            pendingAudit.push({
              key:item.id,
              number:index+1,
              status:'待审核',
              createDateTime:item.createDateTime,
              loginName:item.loginName,
              companyName:item.companyName,
              fullPath:item.fullPath,
            })
          ))
        }else{
          data.data.content.map((item,index)=>(
            loginFailed.push({
              key:item.id,
              number:index+1,
              status:'审核失败',
              auditTime:item.createDateTime,
              loginName:item.loginName,
              companyName:item.companyName,
              fullPath:item.fullPath,
              reasons:(!!item.reasons && item.reasons.join(',')),
            })
          ))
        }
        yield put({
          type:'initailSuccess',
          payload:{
            pendingAudit:pendingAudit,
            loginFailed:loginFailed,
            auditStatus:payload.auditStatus,
            total:data.data.totalElements,
            pageNo:1,
            loading:false,
          }
        })
      }else{
        message.error(`${data.message}`)
      }
    },
    *formSearch({ payload }, { call, put }){
      const  {data,err}  = yield call(findAllAudit, parse(payload));
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        const pendingAudit=[];
        const loginFailed=[];
        if(payload.auditStatus=='待审核'){
          data.data.content.map((item,index)=>(
            pendingAudit.push({
              key:item.id,
              number:index+1,
              status:'待审核',
              createDateTime:item.createDateTime,
              loginName:item.loginName,
              companyName:item.companyName,
              fullPath:item.fullPath,
            })
          ))
        }else{
          data.data.content.map((item,index)=>(
            loginFailed.push({
              key:item.id,
              number:index+1,
              status:'审核失败',
              auditTime:item.createDateTime,
              loginName:item.loginName,
              companyName:item.companyName,
              fullPath:item.fullPath,
              reasons:(!!item.reasons && item.reasons.join(',')),
            })
          ))
        }
        yield put({
          type:'initailSuccess',
          payload:{
            pendingAudit:pendingAudit,
            loginFailed:loginFailed,
            keyword:payload.keyword,
            fullPath:payload.fullPath,
            auditStatus:payload.auditStatus,
            total:data.data.totalElements,
            pageNo:data.data.number+1,
            loading:false,
          }
        })
      }else{
        message.error(`${data.message}`)
      }
    },
    *pageOnchange({ payload }, { call, put }){
      const  {data,err}  = yield call(findAllAudit, {...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        const pendingAudit=[];
        const loginFailed=[];
        if(payload.auditStatus=='待审核'){
          data.data.content.map((item,index)=>(
            pendingAudit.push({
              key:item.id,
              number:index+1,
              createDateTime:item.createDateTime,
              loginName:item.loginName,
              companyName:item.companyName,
              fullPath:item.fullPath,
            })
          ))
        }else{
          data.data.content.map((item,index)=>(
            loginFailed.push({
              key:item.id,
              number:index+1,
              auditTime:item.createDateTime,
              loginName:item.loginName,
              companyName:item.companyName,
              fullPath:item.fullPath,
              reasons:(!!item.reasons && item.reasons.join(',')),
            })
          ))
        }
        yield put({
          type:'initailSuccess',
          payload:{
            pendingAudit:pendingAudit,
            loginFailed:loginFailed,
            keyword:payload.keyword,
            fullPath:payload.fullPath,
            total:data.data.totalElements,
            pageNo:data.data.number+1,
            auditStatus:payload.auditStatus,
            loading:false,
          }
        })
      }else{
        message.error(`${data.message}`)
      }
    },
    *resetField({ payload }, { call, put }){
      const  {data,err}  = yield call(findAllAudit, {...payload});
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        const pendingAudit=[];
        const loginFailed=[];
        if(payload.auditStatus=='待审核'){
          data.data.content.map((item,index)=>(
            pendingAudit.push({
              key:item.id,
              number:index+1,
              createDateTime:item.createDateTime,
              loginName:item.loginName,
              companyName:item.companyName,
              fullPath:item.fullPath,
            })
          ))
        }else{
          data.data.content.map((item,index)=>(
            loginFailed.push({
              key:item.id,
              number:index+1,
              auditTime:item.createDateTime,
              loginName:item.loginName,
              companyName:item.companyName,
              fullPath:item.fullPath,
              reasons:(!!item.reasons && item.reasons.join(',')),
            })
          ))
        }
        yield put({
          type:'initailSuccess',
          payload:{
            pendingAudit:pendingAudit,
            loginFailed:loginFailed,
            keyword:'',
            fullPath:'',
            auditStatus:payload.auditStatus,
            total:data.data.totalElements,
            pageNo:data.data.number+1,
            loading:false,
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
	},
}
