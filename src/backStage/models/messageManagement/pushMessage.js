import {getManualPush,findAllAreasOpen,addPush,deleteManualPush
} from '../../services/messageManagement/pushMessage';
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
	namespace: 'pushMessage',
	state: {
    loading:false,
    cascaderArr:[],//城市级联列表
    showPicList:[],//图片
    sendTable:[],
    pageNo:'',
    total:'',
    receiveArea:'',
    title:'',
    toRoleName:'',
    loading:false,
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/messageManagement/pushMessage'){
          dispatch({
            type:'findArea'
          })
        }
			});
		},
	},
	effects: {
    //查询已开通城市
    *findArea({ payload }, { call, put }){
      const {data,err}=yield call(findAllAreasOpen)
      if(err){
        return message.error('获取城市列表失败，请联系管理员')
      }
      if(data.data){
        yield put({type:'initail',payload:{
          cascaderArr:_toCascaderOptions(data.data),
        }})
      }else{
        message.error(data.message)
      }
    },
    //添加推送消息
    *sendMessage({ payload }, { call, put }){
      const data=yield call(addPush,{...payload})
      if(data.data){
        yield put({type:'initail',
          payload:{
            showPicList:[],
          }
        })
        message.success('推送成功')
      }else{
        message.error('推送失败')
      }
    },
    //查看推送消息
    *callback({ payload }, { call, put }){
      const {data,err}=yield call(getManualPush,{...payload})
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        const sendTable=[];
        data.data.content.map((item,index)=>(
          sendTable.push({
            key:item.id,
            isDeleted:item.isDeleted,
            picKey:item.picKey,
            receiveArea:item.receiveArea,
            sendDateTime:item.sendDateTime,
            sendStatus:item.sendStatus,
            title:item.title,
            toRoleName:item.toRoleName,
          })
        ))
        yield put({
          type:'initail',
          payload:{
            sendTable:sendTable,
            pageNo:data.data.number+1,
            total:data.data.totalElements,
            receiveArea:payload.receiveArea,
            title:payload.title,
            toRoleName:payload.toRoleName,
            loading:false,
          }
        })
      }else{
        message.error(`出错_${data.message}`)
        yield put({type:'initail',payload:{loading:false}})
      }
    },
    //删除
    *deleteMessage({ payload }, { call, put ,select}){
      const {data,err}=yield call(deleteManualPush,{...payload})
      if(err){
        yield put({type:'initail',payload:{loading:false}})
        return message.error('删除失败，请联系管理员')
      }
      if(data){
        const pageNo=yield select(({pushMessage})=>pushMessage.pageNo);
        const title=yield select(({pushMessage})=>pushMessage.title);
        const receiveArea=yield select(({pushMessage})=>pushMessage.receiveArea);
        const toRoleName=yield select(({pushMessage})=>pushMessage.toRoleName);
        yield put({
          type:'callback',
          payload:{
            pageSize:10,
            pageNo:pageNo-1,
            title:title,
            receiveArea:receiveArea,
            toRoleName:toRoleName,
          }
        })
      }else{
        message.error(`删除失败_${data.message}`)
        yield put({type:'initail',payload:{loading:false}})
      }
    }
	},
	reducers: {
		initail(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
