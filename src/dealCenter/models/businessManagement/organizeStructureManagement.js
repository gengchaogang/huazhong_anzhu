import {
  creatChildNodeBM,//创建下级部门
  editBM,//编辑部门
  saveDept,//保存部门
  getRoot,
  getSubDeptsAndUsers,
  getDeptUsers,
  deleteDept,
  getUserInfo,
  saveUser,
  deleteUser,
  deleteUsers,
  getAllGroups,
  resetUserOptPassword,
  resetUserPassword,
  activeUser,
  changeAgentToDepartFetch,
  getAllDepartmentsFetch,
} from '../../services/businessManagement/organizeStructureManagement';
import {findAllAreas} from '../../../commons/service/findAllAreas'
import {message} from 'antd';

import {
  treeMenuMap,
  isNull,
} from '../../../commons/utils/currencyFunction'
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
  data.users.forEach(user=>{
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

import lodash from 'lodash';
const initState = {
    mianData:'Map',
    loading: 0,
    treeData: [],
    treeSelectItem: {},
    treeSelectId:'1',
    tableSelectKeys:[],
    tableData: [],
    changeDepartModal:{
      visible:false,
      treeArr:[],
    },
    treeProps:{
      autoExpandParent: true,
      defaultExpandedKeys: ['root'],
      defaultSelectedKeys: ['root'],
    },
    promptObj:{
      visible:false,
      description:'',
      title:'',
      okText:'确定',
      type:'',
    },
    showType: "list",// list : 员工列表，detail ：员工详细，save ：添加或编辑员工
    // canDeleteDept: false,
    userItem: {},//查看的员工
    saveUserModelState:{
      item: {},
      groups: [],
      isUpdate: false,
    },
    saveDeptModelState:{
      visible:false,
      // type:'editBM',
      item: {},
      isUpdate: false,
    },
    deptModelState:{
      visible: false,
    },
    loadPromises:{},
}
export default {
  namespace: 'organizeStructureManagement',
  state: lodash.cloneDeep(initState),
  subscriptions: {
     setup({ dispatch, history }) {
       history.listen(location => {
         if (location.pathname === '/businessManagement/organizeStructureManagement') {
          //  获取角色分类，所有部门
           dispatch({
             type: 'init',
           });
         }
       });
     },
   },
  effects:{
    *init(action, {call, put}){
      const{data, err} = yield call(getRoot);
      if(err){
				message.info('查询错误！'+err.message,6);
        yield put({type: 'setTreeData', treeData: []});
				return;
			}
      if(data.status == "success"){
        const tableData = data.data.userItems || [];
        tableData.forEach(setTableItemKey);
        yield put({type: 'setTableData', payload: {tableData}});

        const treeData = toTreeRoot(data.data);
        const treeSelectItem = treeData[0];
				yield put({type: 'setTreeData', treeData, payload: {treeSelectItem}});
      }else {
      	message.info('查询错误！'+data.message,6);
        yield put({type: 'setTreeData', treeData: {}});
      }
    },
    // *openModal({ item, isUpdate }, {call, put }) {
    //   yield put({type:'initModal',item, isUpdate});
    // },
    *preSaveDept({name},{put, call, select}){
      yield put({type: "showLoading"});
      const saveDeptModelState = yield select(({ organizeStructureManagement }) => organizeStructureManagement.saveDeptModelState);
      const {item,isUpdate} = saveDeptModelState;
      item._beUpdateName = name;
      let params;
      if(isUpdate){
        params = {id: item.id, name};
      }else {
        params = {...item, name};
      }
      const { data, err } = yield call(saveDept, params);
      if(err){
        yield put({type: "hideLoading"});
				message.info('保存错误！'+err.message,6);
				return;
			}
      if(data.status=='success'){
        delete item._beUpdateName;
        yield put({
          type:'closeModal',
        });
        yield put({type: "hideLoading"});
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description: isUpdate?'编辑部门成功！':'添加子部门成功！',
            title:'提示',
            okText:'确定',
            type:'success',
          },
        });
        yield put({type: "showLoading"});
        if(isUpdate){
          item.name = name;
          item.title = `${name}（${item.count}）`;
        }else {
          const treeData = yield select(({ organizeStructureManagement }) => organizeStructureManagement.treeData);
          const parent = findById(treeData, item.parentId, true);
          if(parent._lastUpdateTime){
            yield put({type: "queryTreeSubItems", payload:{id: item.parentId}});
          }
        }
        yield put({type: "hideLoading"});
      }else{
        yield put({type: "hideLoading"});
        yield put({
          type: 'switchPrompt',
          payload:{
            visible: true,
            description: data.message,
            title: isUpdate?'编辑部门失败！':'添加子部门失败！',
            okText:'确定',
            type:'error',
          },
        });
      }
    },

    *queryTreeSubItems({payload, res},{put, call, select}){
      const {id} = payload;
      // if(id == "root") {
      //   res&&res();
      //   return;
      // }
      const treeData = yield select(({ organizeStructureManagement }) => organizeStructureManagement.treeData);
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
      const loadPromises = yield select(({ organizeStructureManagement }) => organizeStructureManagement.loadPromises);
      if(loadPromises.res){
        loadPromises.res();
      }
      loadPromises.res = res;
      const params = id == "root" ? {}: {id};
      const{data, err} = yield call(getSubDeptsAndUsers, params);

      if(loadPromises.res == res){
        loadPromises.res = false;
      }

      if(err){
				message.info('查询错误！'+err.message,6);
        res();
				return;
			}
      if(data.status == "success"){
        console.log("queryTreeSubItems>treeData>",treeData);
        updateTree(id, treeData, data.data);
				yield put({type: 'setTreeData', treeData});
      }else {
      	message.info('查询错误！'+data.message,6);
      }
      res();
    },

    *preShowRoot({ payload }, {select, call, put, take }){
      const treeData = yield select(({ organizeStructureManagement }) => organizeStructureManagement.treeData);
      const treeSelectItem = findById(treeData, "root");

      yield put({type: "setTreeSelectItem", payload: {treeSelectItem, showType: "list"}});
      yield put({type: "loadDeptUsers"});
    },

    *preShowDept({ id }, {select, call, put, take }){
      const treeData = yield select(({ organizeStructureManagement }) => organizeStructureManagement.treeData);
      const treeSelectItem = findById(treeData, id, true);

      yield put({type: "setTreeSelectItem", payload: {treeSelectItem, showType: "list"}});
      yield put({type: "loadDeptUsers", id})
    },

    *loadDeptUsers({ id }, {select, call, put, take }){
      const{data, err} = yield call(getDeptUsers, {id});
      console.log('loadDeptUsers>',data);
      if(err){
        // yield put({type: "hideLoading"});
        message.info('读取员工列表错误！'+err.message,6);
        return;
      }
      let tableData;
      if(data.status=='success'){
        tableData = data.data.content;
        tableData && tableData.forEach(setTableItemKey);
      }else {
        message.info('查询员工列表错误！'+data.message,6);
        tableData = [];
      }
      yield put({type: 'setTableData', payload: {tableData}});
    },

    *preShowUser({ id }, {select, call, put, take }){
      const treeData = yield select(({ organizeStructureManagement }) => organizeStructureManagement.treeData);
      const treeSelectItem = findById(treeData, id);

      yield put({type: "setTreeSelectItem", payload: {treeSelectItem, showType: "detail"}});
      yield put({type: "getDetailUser", id})
    },

    *updateBySelectedTreeItem({ item, selected }, { select, call, put }){
      // yield put({type:'showList'});
      if(selected){
        if(item.isRoot){
          yield put({
            type:'preShowRoot',
          });
          return;
        }
        if (item.isDept) {
          yield put({
            type:'preShowDept',
            id: item.id,
          });
        } else {
          yield put({
            type:'preShowUser',
            id: item.id,
          });
        }
      }else {
        if(!item.isRoot){
            yield put({
            type:'preShowRoot',
          });
        }
      }
    },

    *tryDeleteDept({ item }, { select, call, put }){
      if(!item.isDept)return;
      yield put({type: "showLoading"});
      const { data, err } = yield call(deleteDept, {id: item.id});
      if(err){
        yield put({type: "hideLoading"});
        message.info('保存错误！'+err.message,6);
        return;
      }
      if(data.status=='success'){
        let nextShowDeptItem = removeItem(item);
        yield put({
          type:'preShowDept',
          id: nextShowDeptItem.id,
        });
        yield put({type: "hideLoading"});
        yield put({
          type: 'switchPrompt',
          payload:{
            visible: true,
            description: '删除部门成功',
            title:'提示',
            okText:'确定',
            type:'success',
          },
        });
      }else {
        yield put({type: "hideLoading"});
        yield put({
          type: 'switchPrompt',
          payload:{
            visible: true,
            description: data.message,
            title: '删除部门失败！',
            okText:'确定',
            type:'error',
          },
        });
      }
    },

    *prepareAddUser(action,{ select, call, put, take }){
      yield put({type: "showLoading"});
      const { data, err } = yield call(getAllGroups);
      if(err){
        yield put({type: "hideLoading"});
        message.info('查询组错误！'+err.message,6);
        return;
      }
      if(data.status=='success'){
        yield put({type: "showAdd", groups: data.data});
        yield put({type: "hideLoading"});
      }else {
        yield put({type: "hideLoading"});
        yield put({
          type: 'switchPrompt',
          payload:{
            visible: true,
            description: data.message,
            title: '查询组信息失败！',
            okText:'确定',
            type:'error',
          },
        });
      }
    },

    *trySaveUser({values},{ select, call, put, take }){
      let saveUserModelState = yield select(({organizeStructureManagement})=>organizeStructureManagement.saveUserModelState);
      values.groups.forEach((item,i,arr)=>{arr[i] = +item});
      const oldItem = saveUserModelState.item;
      saveUserModelState = {...saveUserModelState, item: values};
      yield put({type: "showLoading", payload: {saveUserModelState}});

      const treeSelectItem = yield select(({organizeStructureManagement})=>organizeStructureManagement.treeSelectItem);
      const deptItem = treeSelectItem.isDept ? treeSelectItem : treeSelectItem.parent;
      if(saveUserModelState.isUpdate){
        values.id = oldItem.id;
      }else {
        values.departmentId = deptItem.id;
      }

      const { data, err } = yield call(saveUser, values);
      if(err){
        // yield put({type: "updateAddItem", item: values})
        yield put({type: "hideLoading"});
        message.info(`${saveUserModelState.isUpdate?'编辑':'添加'}员工错误！`+err.message,6);
        return;
      }
      if(data.status=='success'){
        if(saveUserModelState.isUpdate){
          yield put({type: "getDetailUser", id: oldItem.id});
        }else {
          yield put({type: "loadDeptUsers", id: deptItem.id});
          yield put({type: "showList"});
          if(deptItem._lastUpdateTime){
            yield put({type: "queryTreeSubItems", payload:{id: deptItem.id}});
          }else {
            updateItemCount(deptItem, 1);
          }
        }
        yield put({type: "hideLoading"});
      }else {
        yield put({type: "hideLoading"});
        yield put({
          type: 'switchPrompt',
          payload:{
            visible: true,
            description: data.message,
            title: '查询组信息失败！',
            okText:'确定',
            type:'error',
          },
        });
      }
    },

    *getDetailUser({ id }, { select, call, put }){
      yield put({type: "showLoading"});
      const { data, err } = yield call(getUserInfo, {id});
      if(err){
        yield put({type: "hideLoading"});
        message.info('查询错误！'+err.message,6);
        return;
      }
      if(data.status=='success'){
        data.data.deptId = data.data.departmentId;
        yield put({type: "showDetail", item: data.data});
        yield put({type: "hideLoading"});
      }else {
        yield put({type: "hideLoading"});
        yield put({
          type: 'switchPrompt',
          payload:{
            visible: true,
            description: data.message,
            title: '查询员工详细信息失败！',
            okText:'确定',
            type:'error',
          },
        });
      }
    },

    *tryResetUserOptPassword({item}, { select, call, put }){
      const { data, err } = yield call(resetUserOptPassword, {id:item.id});
      if(err){
        message.info('重置员工操作密码错误！'+err.message,6);
        return;
      }
      if(data.status=='success'){
        yield put({
          type: 'switchPrompt',
          payload:{
            visible: true,
            description: `重置员工“${item.name}”的操作密码成功！`,
            title: '重置员工操作密码成功！',
            okText:'确定',
            type:'success',
          },
        });
      }else {
        yield put({
          type: 'switchPrompt',
          payload:{
            visible: true,
            description: data.message,
            title: '重置员工操作密码失败！',
            okText:'确定',
            type:'error',
          },
        });
      }
    },

    *tryResetUserLoginPassword({item}, { select, call, put }){
      const { data, err } = yield call(resetUserPassword, {id:item.id});
      if(err){
        message.info('重置员工登陆密码错误！'+err.message,6);
        return;
      }
      if(data.status=='success'){
        yield put({
          type: 'switchPrompt',
          payload:{
            visible: true,
            description: `重置员工“${item.name}”的登陆密码成功！`,
            title: '重置员工登陆密码成功！',
            okText:'确定',
            type:'success',
          },
        });
      }else {
        yield put({
          type: 'switchPrompt',
          payload:{
            visible: true,
            description: data.message,
            title: '重置员工登陆密码失败！',
            okText:'确定',
            type:'error',
          },
        });
      }
    },

    *prepareUpdateUser({id},{ select, call, put, take, fork, join }){
      yield put({type: "showLoading"});
      const task = yield fork(getAllGroups);
      const {data,err} = yield call(getUserInfo, {id});
      if(err){
        yield put({type: "hideLoading"});
        message.info('查询员工信息错误！'+err.message,6);
        return;
      }
      const groupRes = yield join(task);
      console.log('groupRes>',groupRes);
      const {data: groupData, err: groupErr} = groupRes;
      if(groupErr){
        yield put({type: "hideLoading"});
        message.info('查询组权限错误！'+err.message,6);
        return;
      }
      if(data.status=='success' && groupData.status=='success'){
        const groupItems = data.data.groupItems;
        data.data.groups = (groupItems||[]).map(({id,name})=>''+id);

        yield put({type: "showUpdate", groups: groupData.data, item: data.data});
        yield put({type: "hideLoading"});
      }else {
        yield put({type: "hideLoading"});
        if(data.status=='success'){
          yield put({
            type: 'switchPrompt',
            payload:{
              visible: true,
              description: groupData.message,
              title: '查询组信息失败！',
              okText:'确定',
              type:'error',
            },
          });
        }else {
          yield put({
            type: 'switchPrompt',
            payload:{
              visible: true,
              description: data.message,
              title: '查询员工信息失败！',
              okText:'确定',
              type:'error',
            },
          });
        }

      }
    },

    //调整员工部门 打开模态框
    *openChangeDepartModal({payload},{call,put}){
      const {data} = yield call(getAllDepartmentsFetch,{
        pageNo:0,
        pageSize:100000,
      })
      if(!!data && data.status === 'success'){
        // console.log('data',data);
        const treeArr = data.data.content.map(item=>({
          label:`${item.name}`,
          value:`${item.id}`,
          key:`${item.id}`,
          parentKey:isNull(item.parentId,'root'),
        }));
        // console.log('treeArr',treeArr);
        const treeObj=new treeMenuMap(treeArr).init('root');
        // console.log('treeObj',treeObj);
        yield put({
          type:'doOpenChangeDepartModal',
          payload:{
            visible:true,
            treeArr:treeObj.treeArr,
          }
        })
      }else{
        message.info('获取部门数据失败');
      }
      // const testArr = [
      //   {
      //     id:1,
      //     name:'测试01',
      //     parentId:null,
      //     sortIdx:1,
      //   },
      //   {
      //     id:2,
      //     name:'测试02',
      //     parentId:null,
      //     sortIdx:2,
      //   },
      //   {
      //     id:11,
      //     name:'测试011',
      //     parentId:1,
      //     sortIdx:1,
      //   },
      //   {
      //     id:12,
      //     name:'测试012',
      //     parentId:1,
      //     sortIdx:2,
      //   },
      //   {
      //     id:21,
      //     name:'测试011',
      //     parentId:2,
      //     sortIdx:1,
      //   },
      //   {
      //     id:22,
      //     name:'测试012',
      //     parentId:2,
      //     sortIdx:2,
      //   },
      // ]
    },
    *tryDeleteUser({item},{ select, call, put, take }){
      yield put({type: "showLoading"});
      console.log("tryDeleteUser> deleteItem> ",item);
      const { data, err } = yield call(deleteUser, {id: item.id});
      if(err){
        yield put({type: "hideLoading"});
        message.info('删除员工错误！'+err.message,6);
        return;
      }
      if(data.status=='success'){
        const treeSelectItem = yield select(({organizeStructureManagement})=>organizeStructureManagement.treeSelectItem);
        let deptItem;
        console.log("tryDeleteUser select treeItem>",treeSelectItem);
        if(treeSelectItem.isRoot){
          const treeData = yield select(({ organizeStructureManagement }) => organizeStructureManagement.treeData);
          deptItem = findById(treeData, item.deptId, true);
          console.log("delete user dept on tree > ", deptItem);
          if(deptItem){
            //部门已加载到树上
            updateItemCount(deptItem, -1);
          }else {
            //未加载部门，需从新加载所有部门信息树
            yield put({type: "queryTreeSubItems", payload:{id: "root"}});
          }
          yield put({type:'preShowRoot'});
        }else {
          let treeItem;
          if (treeSelectItem.isLeaf) {
            treeItem = treeSelectItem;
          }else {
            treeItem = findById(treeSelectItem.children, item.id);
          }
          if (treeItem) {
            //员工已在树上
            updateItemCount(treeItem.parent, -1);
            const nextShowItem = removeItem(treeItem);
            yield put({type: "updateBySelectedTreeItem", item: nextShowItem, selected:true});
          } else {
            //未加载部门，需从新加载该部门信息树
            yield put({type: "queryTreeSubItems", payload:{id: treeSelectItem.id}});
            yield put({type:'preShowDept', id: treeSelectItem.id});
          }
        }
        yield put({type: "hideLoading"});
      }else {
        yield put({type: "hideLoading"});
        yield put({
          type: 'switchPrompt',
          payload:{
            visible: true,
            description: data.message,
            title: '删除员工失败！',
            okText:'确定',
            type:'error',
          },
        });
      }
    },

    *tryDeleteUsers({userIds},{ select, call, put, take }){
      //deleteUsers
      yield put({type: "showLoading"});
      console.log("tryDeleteUser> deleteItemIds> ",userIds);
      const { data, err } = yield call(deleteUsers, {ids: userIds});
      if(err){
        yield put({type: "hideLoading"});
        message.info('删除员工错误！'+err.message,6);
        return;
      }
      if(data.status=='success'){
        const treeSelectItem = yield select(({organizeStructureManagement})=>organizeStructureManagement.treeSelectItem);
        console.log("tryDeleteUser select treeItem>",treeSelectItem);
        let deptItem;
        if(treeSelectItem.isRoot){
          yield put({type: "queryTreeSubItems", payload:{id: "root"}});
          yield put({type:'preShowRoot'});
        }else {
          yield put({type: "queryTreeSubItems", payload:{id: treeSelectItem.id}});
          yield put({type:'preShowDept', id: treeSelectItem.id});
        }
        yield put({type: "hideLoading"});
      }else {
        yield put({type: "hideLoading"});
        yield put({
          type: 'switchPrompt',
          payload:{
            visible: true,
            description: data.message,
            title: '删除员工失败！',
            okText:'确定',
            type:'error',
          },
        });
      }
    },

    *tryActive({id},{ select, call, put, take }){
      const { data, err } = yield call(activeUser, {id: id});
      if(err){
        // yield put({type: "hideLoading"});
        message.info('激活员工错误！'+err.message,6);
        return;
      }
      if(data.status=='success'){
        message.info('激活短信发送成功！',6);
      }else {
        message.info('激活短信发送失败！'+data.message,6);
      }
    },
    //移动员工到部门
    *changeAgentToDepart({payload},{call,put,select}){
      console.log('payload',payload);
      const {userItem} = yield select(({organizeStructureManagement})=>organizeStructureManagement)
      if(!!userItem){
        const {data} = yield call(changeAgentToDepartFetch,{
          departmentId:payload,
          id:userItem.id,
        })
        if(!!data && data.status === 'success' && !!data.data){
          message.info('移动员工到部门成功!');
          yield put({
            type:'closeChangeDepartModal'
          })
          
        }else{
          message.info('移动员工到部门失败!'+data.message?data.message:'请求失败');
        }
      }

    },
  },
  reducers: {
    tableSelectChange(state,action) {
      return {...state,tableSelectKeys:action.payload};
    },
    openModal(state, {item, isUpdate}){
      delete item._beUpdateName;
      return {...state,saveDeptModelState:{visible:true,item,isUpdate}};
    },
    closeModal(state){
      return {...state,saveDeptModelState:Object.assign({},state.saveDeptModelState,{visible:false})};
    },
    switchPrompt(state,action){
      return{...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    setTreeData(state,{treeData, payload}){
      return {...state, ...payload, treeData:treeData};
    },
    setTreeSelectItem(state, {payload}){
      const treeSelectItem = payload.treeSelectItem;
      // const defaultExpandedKeys = [treeSelectItem.key];
      // const defaultSelectedKeys = [treeSelectItem.key];
      const selectedKeys = [treeSelectItem.key];
      const treeProps = {...state.treeProps,selectedKeys};
      return {...state,...payload,treeProps};
    },
    showList(state){
      return {...state , showType: "list"};
    },
    showAdd(state, {groups, item={}}){
      const saveUserModelState = state.saveUserModelState;
      return {...state, saveUserModelState: {...saveUserModelState, groups, item, isUpdate: false}, showType: "save"}
    },
    updateAddItem(state,{item}){
      const saveUserModelState = state.saveUserModelState;
      return {...state, saveUserModelState: {...saveUserModelState, item}}
    },
    showUpdate(state, {groups, item}){
      const saveUserModelState = state.saveUserModelState;
      return {...state, saveUserModelState: {...saveUserModelState, groups, isUpdate: true, item}, showType: "save"}
    },
    showDetail(state, {item}){
      return {...state, showType: "detail",userItem: item}
    },

    setTableData(state, {payload}){
      //tableData
      return {...state, ...payload}
    },

    showLoading(state, {payload}){
      return {...state, loading: state.loading+1, ...payload}
    },
    hideLoading(state){
      return {...state, loading: state.loading-1}
    },
    closeChangeDepartModal(state,action){
      return {...state,changeDepartModal:{...lodash.cloneDeep(initState).changeDepartModal}}
    },
    doOpenChangeDepartModal(state,action){
      return {...state,changeDepartModal:{...lodash.cloneDeep(initState).changeDepartModal,...action.payload}}
    },
  },
}
