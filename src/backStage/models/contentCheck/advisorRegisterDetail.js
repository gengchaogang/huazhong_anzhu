import {findAudit,audit,findGroup} from '../../services/contentCheck/advisorRegisterDetail';
import { parse } from 'qs';
import {message} from 'antd';
import { routerRedux } from 'dva/router';
export default {
	namespace: 'advisorRegisterDetail',
	state: {
    id:'',
    auditStatus:'',//审核状态
    reasons:'',//不通过原因
    auditTime:'',//审核时间
    auditUserName:'',//审核人员
    createDateTime:'',//注册时间
    phoneNumber:'',//手机号码
    companyName:'',//企业名称
    corporation:'',//企业法人
    licenseNumber:'',//营业执照编号
    licensePic:'',//营业执照附件url
    refuseModal:false,
    labelArr:[],
		watchBigStatus:false,
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/contentCheck/advisorRegister/advisorRegisterDetail') {
          dispatch({type:'findDetail',
            payload:{
              id:location.state.id,
            }
          })
				}
			});
		},
	},
	effects: {
    *findDetail({ payload }, { call, put }){
      const {data,err}=yield call(findAudit, {...payload})
			if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        yield put({type:'initailSuccess',
          payload:{
            auditStatus:data.data.auditStatus,
            auditTime:data.data.auditTime,
            auditUserId:data.data.auditUserId,
            auditUserLoginName:data.data.auditUserLoginName,
            auditUserName:data.data.auditUserName,
            code:data.data.code,
            companyAddress:data.data.companyAddress,
            companyName:data.data.companyName,
            corporation:data.data.corporation,
            createDateTime:data.data.createDateTime,
            licenseNumber:data.data.licenseNumber,
            licensePic:data.data.licensePic,
            licenseType:data.data.licenseType,
            id:data.data.id,
            name:data.data.name,
            phoneNumber:data.data.phoneNumber,
            reasons:(!!data.data.reasons && data.data.reasons.join('，')),
          }
        })
      }
    },
    *findeLabel({ payload }, { call, put }){
      const {data,err}=yield call(findGroup, {...payload})
			if(err){
				return message.error('出错了，请联系管理员');
			}
      let labelArr;
      if(data.data){
        data.data.map(item=>(
          item.typeName=='拒绝原因'?labelArr=item.nameAndValues:''
        ))
        yield put({
          type:'initailSuccess',
          payload:{labelArr:labelArr,
					}
        })
      }else{
				yield put({
          type:'initailSuccess',
          payload:{
						refuseModal:false,
					}
        })
        message.error(`${data.message}`)
      }
    },
    *passSure({ payload }, { call, put }){
      const {data,err}=yield call(audit, {...payload})
			if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data){
        message.success('审核通过')
				yield put(routerRedux.goBack());
      }else{
        message.error(`${data.message}`);
      }
    },
    *submitRefuse({ payload }, { call, put }){
      const {data,err}=yield call(audit, {...payload})
			if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        message.success('拒绝成功')
				yield put({type:'initailSuccess',payload:{refuseModal:false}})
				yield put(routerRedux.goBack());
      }else{
        message.error(`${data.message}`)
        yield put({type:'initailSuccess',payload:{refuseModal:false}})
      }
    }
	},
	reducers: {
		initailSuccess(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
