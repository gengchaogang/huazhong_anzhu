import {findAllFetch,deleteFetch,searchPowerFetch,add,findOne,edit} from '../../services/accessManagement/jolesManagement';
import { parse } from 'qs';
import {message} from 'antd';

function toTreeData(dataArr, codeItemMap){
  const toTreeItem=(item)=>{
    var obj = {label: item.name, key: item.code, value: item.code};
    codeItemMap[item.code] = item;
    if(item.children){
      obj.children = item.children.map(toTreeItem);
    }
    return obj;
  };
  return dataArr.map(toTreeItem);
}
const delet=(arr)=>{
  // console.log(arr,'arrarr');
  arr.some((item,index)=>{
    if(item.key=='BACKSTAGE_ACCOUNT_MANAGEMENT'){
      arr.splice(index,1)
    }
  })
  arr.some((item,index)=>{
    if(item.key=='BACKSTAGE_CONTENT_AUDIT'){
      arr.splice(index,1)
    }
  })
  arr.some((item,index)=>{
    if(item.key=='BACKSTAGE_HOUSING_MANAGEMENT'){
      arr.splice(index,1)
    }
  })
  //楼盘字典
  arr.some((item,index)=>{
    if(item.key=='BACKSTAGE_BUILDING_DICTIONARY'){
      arr.splice(index,1)
    }
  })
  //师徒设置
  arr.some((item,index)=>{
    if(item.key=='BACKSTAGE_TEACHERANDPUPIL_SET'){
      arr.splice(index,1)
    }
  })
  //处罚机制
  arr.some((item,index)=>{
    if(item.key=='BACKSTAGE_PUNISHMENT_MECHANISM'){
      arr.splice(index,1)
    }
  })
  //账户管理
  arr.some((item,index)=>{
    if(item.key=='BACKSTAGE_LEDGER_MANAGEMENT'){
      arr.splice(index,1)
    }
  })
  //财务管理
  arr.some((item,index)=>{
    if(item.key=='BACKSTAGE_FINANCIAL_MANAGEMENT'){
      arr.splice(index,1)
    }
  })
  //消息管理
  arr.some((item,index)=>{
    if(item.key=='BACKSTAGE_INFORMATION_MANAGEMENT'){
      arr.splice(index,1)
    }
  })
  //合同协议管理
  arr.some((item,index)=>{
    if(item.key=='BACKSTAGE_CONTRACT_AGREEMENT_MANAGEMENT'){
      arr.splice(index,1)
    }
  })
  //新房项目
  arr.some((item,index)=>{
    if(item.key=='BACKSTAGE_NEWHOUSE_PROJECT'){
      arr.splice(index,1)
    }
  })
  //二手房出售
  arr.some((item,index)=>{
    if(item.key=='BACKSTAGE_SECONDHAND_SELL'){
      arr.splice(index,1)
    }
  })
  //二手房出租
  arr.some((item,index)=>{
    if(item.key=='BACKSTAGE_SECONDHAND_RENT'){
      arr.splice(index,1)
    }
  })
  //商铺出租
  arr.some((item,index)=>{
    if(item.key=='BACKSTAGE_SHOP_RENT'){
      arr.splice(index,1)
    }
  })
  //商铺出售
  arr.some((item,index)=>{
    if(item.key=='BACKSTAGE_SHOP_SELL'){
      arr.splice(index,1)
    }
  })
  //写字楼出售
  arr.some((item,index)=>{
    if(item.key=='BACKSTAGE_OFFICE_SELL'){
      arr.splice(index,1)
    }
  })
  //写字楼出租
  arr.some((item,index)=>{
    if(item.key=='BACKSTAGE_OFFICE_RENT'){
      arr.splice(index,1)
    }
  })
  //房源下架
  arr.some((item,index)=>{
    if(item.key=='BACKSTAGE_HOUSING_SHELVES'){
      arr.splice(index,1)
    }
  })
  //标签管理
  arr.some((item,index)=>{
    if(item.key=='BACKSTAGE_LABEL_MANAGEMENT'){
      arr.splice(index,1)
    }
  })
  //标签配置
  arr.some((item,index)=>{
    if(item.key=='BACKSTAGE_LABEL_CONFIGURATION'){
      arr.splice(index,1)
    }
  })
  //收益设置
  arr.some((item,index)=>{
    if(item.key=='BACKSTAGE_EARNINGS_SET'){
      arr.splice(index,1)
    }
  })
  // console.log(arr,'shuzuarr');
  return arr
}
export default {
	namespace: 'jolesManagement',
	state: {
		createRoleNameStatus:false,
		dataSource:[],
		total:'',
		pageNo:'',
		pageSize:10,
		loading:false,
		treeData:[],
    codes:[],
    name:'',
    id:'',
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/accessManagement/jolesManagement') {
					// dispatch({type:'initailSuccess',payload:{loading:true}})
					dispatch({
            type: 'initail',
						payload:{
							pageSize:10,
						}
          });
				}
			});
		},
	},
	effects: {
    *initail({ payload }, { call, put }){
      const  {data}  = yield call(findAllFetch,{...payload});
      if(data.data){
				const dataSource=[];
				data.data.content.map((item,index)=>(
					dataSource.push({
						key:item.id,
						number:index+1,
						createTime:item.createTime,
						name:item.name,
						updateTime:item.updateTime,
						updateUser:item.updateUser,
					})
				))
        yield put ({
          type: 'initailSuccess',
          payload: {
            dataSource:dataSource,
						total:data.data.totalElements,
						pageNo:data.data.number+1,
            createRoleNameStatus:false,
            codes:[],
            id:'',
            name:'',
						pageSize:10,
						loading:false,
          },
        });
      }
    },
		*deleteData({ payload }, { call, put }){
			const  {data}  = yield call(deleteFetch,{...payload});
			if(data.data){
				yield put({type:'initail',payload:{pageNo:0,pageSize:10}})
			}else{
				yield put({type:'initailSuccess',payload:{loading:false}})
				message.error(data.message)
			}
		},
		//查询权限列表
		*searchPower({ payload }, { call, put }){
			const  {data}  = yield call(searchPowerFetch,{...payload});
			if(data.data){
				const codeItemMap = {};
        const treeData = toTreeData(data.data, codeItemMap);
				yield put({
					type:'initailSuccess',
					payload:{treeData:treeData,
						createRoleNameStatus:true,
					}
				})
			}
		},
    *addRole({ payload }, { call, put }){
      const  {data,err}  = yield call(add,{...payload});
      if(err){
        message.error('添加失败，请联系管理员')
      }
      if(!!data.data){
        message.success('添加成功')
        yield put({
          type:'initail',
          payload:{
            pageNo:0,
          }
        })
      }else{
        message.error(data.message);
      }
    },
    *findOneBeforEdit({ payload }, { call, put }){
      const  {data}  = yield call(findOne,{...payload});
      if(!!data){
        const codes=[];
        data.data.codes.map((item,index)=>(
          codes.push({
            label:item.name,
            key:item.code,
            value:item.code,
          })
        ))
        yield put({
          type:'initailSuccess',
          payload:{
            createRoleNameStatus:true,
            codes:delet(codes),
            name:data.data.name,
            id:data.data.id,
          }
        })
      }
    },
    *editRole({ payload }, { call, put }){
      const  {data}  = yield call(edit,{...payload});
      if(!!data){
        message.success('编辑成功')
        yield put({
          type:'initail',
          payload:{
            pageNo:0,
          }
        })
      }else{
        message.error(data.message);
      }
    },
	},
	reducers: {
		initailSuccess(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
