import {findAllFetch,findSubDeptsAndUsers,editBM,deleteBMfetch,addBMfetch,
  deleteMemberfetch,findOne,findDeptIdAndName,findRoleIdAndName,addMemberFetch,
  adjustDepartment,
} from '../../services/enterpriseFramework/personnelManage';
import { parse } from 'qs';
import { message} from 'antd';
const noop=()=>{};

function toTreeRoot({name, count, children: rc}){
  var children = [];
  var root = {id: "root",key: "root", title: `${name}（${count}）`, isRoot: true, children, name,count };
  root._lastUpdateTime = +new Date();
  root.draggable = false;
  var treeData = [root];
  rc && rc.forEach(item=>{
    children.push(toItem(root, item, true));
  });
  return treeData;
}

function updateTree(id, treeData, data){
  var item = findById(treeData, id, true),count=0;
  item.children = [];
  data.depts.forEach(dept=>{
    count += dept.count;
    item.children.push(toItem(item, dept, true));
  });
  data.userItems.forEach(user=>{
    count++;
    item.children.push(toItem(item, user));
  });
  const increase = Math.round(count - item.count);
  updateItemCount(item, increase);
}

function updateItemCount(item, increase){
  if(!item)return;
  if(increase){
    let parent = item;
    do{
      parent.count += increase;
      parent.title = `${parent.name}（${parent.count}）`;
    }while(parent = parent.parent);
  }
}

function toItem(parent, {id,name,count}, isDept){
  var item = {id, name, parent}
  if(isDept){
    item.isDept = isDept;
    item.count = count;
    item.title = `${name}（${count}）`;
    item.key = "dept_"+id;
  }else {
    item.title = name;
    item.isLeaf = true;
    item.key = "user_"+id;
  }
  return item;
}

function findById(arr, id, isDept){
  var item;
  if(!arr) return;
  if(!id || id == "root")return arr[0];//空Id 返回ROOT
  for(var i=0; i<arr.length; i++){
    item = arr[i];
    if((item.id == id) && (item.isDept == isDept)){
      return item;
    }else if (item.children) {
      item = findById(item.children, id, isDept);
      if(item){
        return item;
      }
    }
  }
}

function setTableItemKey(item){
  item.key = ""+item.id;
}

function removeItem(item){
  const parent = item.parent;
  const children = parent.children;
  const isDept = item.isDept;
  if(children.length == 1){
    children.length = 0;
    item.parent = null;
    return parent;
  }else {
    let nextItem;
    children.some((child, i, arr)=>{
      if(child == item){
        if(i == arr.length-1){
          nextItem = arr[i-1];
        }else {
          nextItem = arr[i+1];
          if(isDept && !nextItem.isDept){
            nextItem = arr[i-1];
            if(!nextItem){
              nextItem = child.parent;
            }
          }
        }
        child.parent = null;
        arr.splice(i,1);
        return true;
      }
    });
    return nextItem;
  }
}
export default {
	namespace: 'personnelManage',
	state: {
    loading:false,
    treeData:[],
    treeProps:{
      autoExpandParent: true,
      defaultExpandedKeys: ['root'],
      defaultSelectedKeys: ['root'],
    },
    loadPromises:{},
    name:'',
    id:'',
    type:'root',
    dataSource:[],
    addMemberStatus:false,
    editBMStatus:false,
    addBMStatus:false,
    selectedArr:[],
    bMidArr:[],
    roleNameArr:[],
    adjustmentStatus:false,//调整部门
    selectedRowKeys:[],//选中项
    loading:false,
    total:'',
    pageNo:0,
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/enterpriseFramework/personnelManage'){
          // dispatch({type:'findAll'})
          // dispatch({type:'initail',payload:{loading:true}})
          dispatch({type:'initailFindAll'})
        }
			});
		},
	},
	effects: {
    *initailFindAll({ payload }, { call, put }){
      yield put({type:'findAll'})
      yield put({type:'initail',payload:{loading:true}})
    },
		//初始化请求表格数据
    *findAll({ payload }, { call, put }){
      const {data}=yield call(findAllFetch,{...payload})
      if(data.data){
        const treeData=toTreeRoot(data.data);
        const dataSource=[];
        data.data.userItems.content.map((item,index)=>(
          dataSource.push({
            key:item.id,
            loginName:item.loginName,
            name:item.name,
            phoneNumber:item.phoneNumber,
            role:item.role,
            url:item.url,
          })
        ))
        yield put({
          type:'initail',
          payload:{
            treeData:treeData,
            dataSource:dataSource,
            name:data.data.name,
            pageNo:data.data.userItems.number+1,
            total:data.data.userItems.totalElements,
            editBMStatus:false,
            addMemberStatus:false,
            id:'',
            selectedArr:[],
            adjustmentStatus:false,
            selectedRowKeys:[],
            loading:false,
          }
        })
      }
    },
    *queryTreeSubItems({payload, res},{put, call, select}){
      const {id} = payload;
      // if(id == "root") {
      //   res&&res();
      //   return;
      // }
      const treeData = yield select(({ personnelManage }) => personnelManage.treeData);
      const item = findById(treeData, id, true);
      const now = +new Date();
      if(!item._lastUpdateTime){
        item._lastUpdateTime = now;
      }else {
        if(now - item._lastUpdateTime > 1000*10){
          item._lastUpdateTime = now;
        }else {
          if(res){
            res();
            return;
          }
        }
      }
      res = res || noop;
      const loadPromises = yield select(({ personnelManage }) => personnelManage.loadPromises);
      if(loadPromises.res){
        loadPromises.res();
      }
      loadPromises.res = res;
      const params = id == "root" ? {}: {id};
      const{data, err} = yield call(findSubDeptsAndUsers, params);

      if(loadPromises.res == res){
        loadPromises.res = false;
      }

      if(err){
				message.info('查询错误！'+err.message,6);
        res();
				return;
			}
      if(data.status == "success"){
        updateTree(id, treeData, data.data);
				yield put({type: 'setTreeData', treeData});
      }else {
      	// message.info('查询错误！'+data.message,6);
      }
      res();
    },
    *updateBySelectedTreeItem({payload, res},{put, call, select}){
      const {data}=yield call(findSubDeptsAndUsers,{...payload});
      if(!!data){
        const dataSource=[];
        data.data.allUserItems.content.map((item,index)=>(
          dataSource.push({
            key:item.id,
            loginName:item.loginName,
            name:item.name,
            phoneNumber:item.phoneNumber,
            role:item.role,
            url:item.url,
          })
        ))
        yield put({
          type:'initail',
          payload:{
            dataSource:dataSource,
            editBMStatus:false,
            name:payload.name,
            selectedArr:[],
            selectedRowKeys:[],
            loading:false,
            pageNo:data.data.allUserItems.number+1,
            total:data.data.allUserItems.totalElements,
          }
        })
      }
    },
    *findUersTable({payload},{put, call ,select}){
      const {data}=yield call(findOne,{...payload});
      if(!!data){
        const dataSource=[];
        dataSource.push({
          key:data.data.id,
          loginName:data.data.loginName,
          name:data.data.name,
          phoneNumber:data.data.phoneNumber,
          role:data.data.role,
          url:data.data.url,
        })
        yield put({
          type:'initail',
          payload:{
            dataSource:dataSource,
            loading:false,
          }
        })
      }
    },
    //编辑部门
    *editBMok({payload},{put, call ,select}){
      const id=yield select(({personnelManage})=>personnelManage.id)
      const {data}=yield call(editBM,{...payload});
      const name=payload.name
      if(!!data){
        const newTree=yield call(findAllFetch,{...payload})
        if(newTree.data.data){
          const treeData=toTreeRoot(newTree.data.data);
          yield put({type:'initail',
            payload:{
              treeData:treeData,
              editBMStatus:false,
              name:name,
            }
          })
        }
      }else{
        message.error(data.message)
      }
    },
    *deleteBM({payload},{put, call}){
      const {data}=yield call(deleteBMfetch,{...payload})
      if(data.data){
        yield put({type:'findAll'})
      }else{
        message.error(data.message)
      }
    },
    *addBMok({payload},{put, call ,select}){
      const id=yield select(({personnelManage})=>personnelManage.id)
      const {data}=yield call(addBMfetch,{...payload});
      const name=payload.name;
      if(!!data){
        const newTree=yield call(findAllFetch,{...payload})
        if(newTree.data.data){
          const treeData=toTreeRoot(newTree.data.data);
          yield put({type:'initail',
            payload:{
              treeData:treeData,
              addBMStatus:false,
              loading:false,
              name:name,
            }
          })
        }
      }else{
        message.error(data.message)
      }
    },
    *deleteMember({payload},{put, call ,select}){
      const id=yield select(({personnelManage})=>personnelManage.id);
      const type=yield select(({personnelManage})=>personnelManage.type);
      // console.log(type,id,'type');
      const {data}=yield call(deleteMemberfetch,{...payload});
      if(!!data.data){
        if(type=='dept' && id){
          yield put({type:'updateBySelectedTreeItem',payload:{id:id}})
        }else{
          yield put({type:'findAll'})
        }
      }else{
        message.error(data.message)
      }
    },
    *addBeforeSearch({payload},{put, call}){
      const {data}=yield call(findDeptIdAndName,{...payload})
      const roleName=yield call(findRoleIdAndName,{...payload})
      const bMidArr=[];
      const roleNameArr=[];
      if(!!data.data && !!roleName.data){
        data.data.map((item,index)=>(
          bMidArr.push({
            name:item.name,
            departmentId:item.id,
          })
        ))
        roleName.data.data.map((item,index)=>(
          roleNameArr.push({
            name:item.name,
            roleIds:item.id,
          })
        ))
        yield put({
          type:'initail',
          payload:{bMidArr:bMidArr,roleNameArr:roleNameArr}
        })
      }else{
        message.error('查询出错')
      }
    },
    *addMemberAndadd({payload},{put, call}){
      const {data}=yield call(addMemberFetch,{...payload})
      if(!!data.data){
        message.success('创建成功')
      }else{
        message.error(data.message)
      }
    },
    *addEmployeesAndCancel({payload},{put, call}){
      const {data}=yield call(addMemberFetch,{...payload})
      if(!!data.data){
        yield put({type:'findAll'})
        message.success('创建成功')
      }else{
        message.error(data.message)
      }
    },
    //调整员工部门之前获取所有部门
    *adjustmentDepartment({payload},{put, call}){
      const {data}=yield call(findDeptIdAndName,{...payload})
      if(!!data.data){
        const bMidArr=[];
        data.data.map((item,index)=>(
          bMidArr.push({
            name:item.name,
            departmentId:item.id,
          })
        ))
        yield put({type:'initail',
          payload:{
            bMidArr:bMidArr,
            adjustmentStatus:true,
          }
        })
      }else{
        message.error(data.message)
      }
    },
    //调整员工部门
    *adjustmentOk({payload},{put, call}){
      const {data}=yield call(adjustDepartment,{...payload});
      if(!!data.data){
        yield put({type:'findAll'})
        message.success('调整部门成功')
      }else{
        message.error(data.message)
      }
    }
	},
	reducers: {
		initail(state,{payload}){
			return { ...state, ...payload };
		},
    setTreeData(state,{treeData, payload}){
      return {...state, ...payload, treeData:treeData};
    },
	},
}
