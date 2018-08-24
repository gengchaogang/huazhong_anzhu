import {
  getGroupList,//组列表
  getAuthorities,//权限集合
  addGroup,
  updateGroup,
  deleteGroup,
} from '../../services/businessManagement/roleManagement';
import {
  isNull,
} from '../../../commons/utils/currencyFunction'
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

function toTableData(dataArr, codeItemMap){
  const code2Name=code=>{const name = codeItemMap[code].name; return {code, name}};
  const noChildren = item=>!item.children;
  const toTableItem=(item)=>{
    const permissions = [];
    (item.codes||[]).forEach(code=>{
      const treeItem = codeItemMap[code];
      if(!treeItem.children || !treeItem.children.length){
        //只显示叶子节点权限
        permissions.push({code, name: treeItem.name});
      }
    });
    // console.log("permissions>",permissions);
    // var permissions = (item.codes||[]).map(code2Name);
    var obj = {name: item.name, key: item.id, value: item.code,operation:item.id,permissions:permissions,employees:isNull(item.employeeNames,[])};
    return obj;
  };
  return dataArr.map(toTableItem);
}

function toEditData(tableData, id){
  var item;
  for(var i=0; i<tableData.length; i++){
    item = tableData[i];
    if(item.key == id){
      return {permissions: item.permissions.map(toCode), name: item.name};
    }
  }
}

const findCodePath = (treeData, code, {name})=>{
  var path = [{code,name}];
  const root = {children: treeData, value: "root", label: "root"};
  const walker = (parent, code)=>{
    if(parent.children.some(item=>{
      if(item.value == code){
        return true;
      }else if (item.children) {
        return walker(item, code);
      }
    })){
      if(parent.value != "root")
        path.push({code: parent.value, name: parent.label});
      return true;
    }
  };
  walker(root, code);
  path.reverse();
  return path;
};

const combi = (parentNode, path, level = 0)=>{
  if(!parentNode.children){
    parentNode.children = [];
  }
  const pathNode = path[level];
  const code = pathNode.code;
  let node;
  parentNode.children.some(tmp=>{
    if(tmp.code == code){
      node = tmp;
      return true;
    }
  });
  if(!node){
    parentNode.children.push(pathNode);
    node = pathNode;
  }
  level++;
  if(level < path.length){
    combi(node, path, level);
  }
};

const toCode=({code})=>code;

export default {
  namespace: 'roleManagement',
  state: {
    mianData:'Map',
    codeItemMap: {},
    treeData:[],
    treeSelectId:'1',
    tableSelectKeys:[],
    tableData:[],
    loading:true,
    promptObj:{
      visible:false,
      content:'',
      title:'',
      okText:'确定',
      type:'',
    },
    modalState:{
      visible:false,
      type:'editRole',
      activeId: 0,
    }
  },
  subscriptions: {
     setup({ dispatch, history }) {
       history.listen(location => {
         if (location.pathname === '/businessManagement/roleManagement') {
          //  dispatch({
          //    type: 'init',
          //  });
          // changed by duxianqiu 17/05/19 修复栈溢出
           setTimeout(()=>dispatch({
             type:'init',
           }),0);
         }
       });
     },
   },
  effects:{
    *init(action,{call, put, take,fork, join}){
      // yield put({type: "showLoading"});
      yield put({type: "initTreeData"});
      // yield take("roleManagement/setTreeData");
      // yield put({type: "initTableData"});
      // yield take("roleManagement/setTableData");
    },
    *initTreeData(action,{call, put}){
      const {data,err} = yield call(getAuthorities);
      if(err){
				message.info('查询权限集合错误！'+err.message,6);
				return;
			}
      if(data.status == "success"){
        const codeItemMap = {};
        const treeData = toTreeData(data.data, codeItemMap);
				yield put({type: 'setTreeData', treeData, codeItemMap});
        yield put({type: "initTableData"});
      }else {
      	message.info('查询权限集合错误！'+data.message,6);
      }
    },
    *initTableData(action,{call, put, select}){
      const {data,err} = yield call(getGroupList);
      if(err){
				message.info('查询组错误！'+err.message,6);
				return;
			}
      if(data.status == "success"){
        const codeItemMap = yield select(({ roleManagement }) => roleManagement.codeItemMap);
        const tableData = toTableData(data.data, codeItemMap);
        console.log('tableData',tableData);
				yield put({type: 'setTableData', payload: {tableData,tableSelectKeys:[]}});
      }else {
      	message.info('查询组错误！'+data.message,6);
      }
    },
    *preSaveGroup({payload}, {call, put, select}){
      const {codeItemMap,modalState, treeData} = yield select(({ roleManagement }) => roleManagement);
      const id = modalState.activeId;
      const service = id ? updateGroup: addGroup;
      // const codes = (payload.permissions || []).reduce((root, code)=>{
      //   const path = findCodePath(treeData, code, codeItemMap[code]);
      //   combi(root, path);
      //   return root;
      // },{children:[]}).children;
      // console.log(codes);
      const exists = {};
      const codes = (payload.permissions || []).map(code=>{
        // return {code, name:codeItemMap[code]};
        // 父级及祖上等都要保存
        return findCodePath(treeData, code, codeItemMap[code]);
      }).reduce((codes, path)=>{
        var item;
        for(var i=0,len=path.length; i<len; i++){
          item = path[i];
          if(!exists[item.code]){
            codes.push(item);
            exists[item.code] = true
          }
        }
        return codes;
      },[]);

      const params = {name: payload.name, codes};
      id && (params.id = id);
      const {data,err} = yield call(service, params);
      if(err){
				message.info('查询错误！'+err.message,6);
        yield put({type: 'initModal',payload:{item: payload}});
				return;
			}
      if(data.status == "success"){
        const codeItemMap = yield select(({ roleManagement }) => roleManagement.codeItemMap);
				yield put({type: 'setTableData', payload: {tableData: toTableData(data.data, codeItemMap)}});
      }else {
      	message.info('添加组错误！'+data.message,6);
        yield put({type: 'initModal',payload:{item: payload}});
      }
    },

    *preShowEditModel({id},{put,select}){
      const tableData = yield select(({ roleManagement }) => roleManagement.tableData);
      const editObj = toEditData(tableData, id);
      yield put({type: 'initModal',payload:{type: 'editRole', item: editObj, activeId: id}});
    },

    *tryDelete(state, {call, put, select}){
      const tableSelectKeys = yield select(({ roleManagement }) => roleManagement.tableSelectKeys);
      if(!tableSelectKeys || !tableSelectKeys.length){
        return;
      }
      const {data,err} = yield call(deleteGroup, {ids: tableSelectKeys});
      if(err){
				message.info('删除错误！'+err.message,6);
        // yield put({type: 'initModal',payload:{item: payload}});
				return;
			}
      if(data.status == "success"){

        const codeItemMap = yield select(({ roleManagement }) => roleManagement.codeItemMap);
				yield put({type: 'setTableData', payload: {tableData: toTableData(data.data, codeItemMap),tableSelectKeys:[]}});
      }else {
      	message.info('删除组错误！'+data.message,6);
        // yield put({type: 'initModal',payload:{item: payload}});
      }
    },
  },
  reducers: {
    initState(state, {treeData, tableData}){
      return {...state,treeData,tableData,loading:false,};
    },
    setTreeData(state, {treeData,codeItemMap}){
      return {...state,treeData,codeItemMap};
    },
    setTableData(state, {payload}){
      return {...state,...payload,loading:false,modalState:Object.assign({},state.modalState,{visible:false})};
    },
    tableSelectChange(state,action) {
      return {...state,tableSelectKeys:action.payload};
    },
    initModal(state,action){
      return {...state,modalState:{...action.payload,visible:true}};
    },
    closeModal(state){
      return {...state,modalState:Object.assign({},state.modalState,{visible:false})};
    },
    updateData(state,action){
      return{...state,...action.payload}
    },
    switchPrompt(state,action){
      return{...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    switchLoading(state,action){
      return{...state,loading:action.payload}
    },
    showLoading(state,action){
      return{...state,loading:true}
    },
    hideLoading(state,action){
      return{...state,loading:false}
    },
  },
}
