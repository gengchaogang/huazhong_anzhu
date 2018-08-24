import{
  getInitConcessionsDataFetch,
  addConcessionsFetch,
  editConcessionsFetch,
  deleteIdsFetch,
  searchOneDataFetch,
  getInitHouseTypeNamesFetch
}from '../../../../services/newHouseOnline/createNewProject/createProjectConcessions';
import moment from 'moment'
import lodash from 'lodash';
const initialState={
  current:0,
  projectId:null,
  isEdit:null,
  reEdit:null,
  houseTypeNames:[],
  resultData:[],
  totalElements:null,
  tableOneData:[],
  //控制表格组件
  concessionsId:null,
  selectedRowKeys: [],
  delLoading: false,
  pageSize:10,
  //控制创建团购的modal
  submitLoading: false,
  modalVisible: false,
  applicability:'',//适用范围
  //控制编辑模态框
  eidt_modalVisible:false,
  edit_submitLoading:false,
  edit_applicability:'',
  edit_record:{
    key: null,
    xh: null,
    yhmc:null,
    yhje:null,
    sxje:null,
    hdyxq:null,
    sylx:null,
    tgsdfy:null,
    cjsj:null,
  },
  promptObj:{
   visible:false,
   description:'',
   title:'',
   promptFor:'default',
   okText:'确定',
   type:'',
   todo:'',
 },
}
export default {
  namespace: 'createProjectConcessions',
  state:initialState,
  reducers: {
    setDefaultState(state,action){
      return lodash.cloneDeep(initialState);
    },
    saveIdAndState(state,action){
      return{...state,...action.payload}
    },
    clearSelectedRowKeys(state){
      return{...state,selectedRowKeys:[]}
    },
    modifySelect(state,anction){
      return{...state,selectedRowKeys:anction.payload}
    },
    //改变删除按钮loading;
    changeDelLoading(state,action){
      return {...state,...action.payload};
    },
    //控制创建团购的modal
    changeVisible(state,action){
      return {...state,...action.payload};
    },
    //控制创建团购的modal中的表单
    changeApplicability(state,action){
      return {...state, ...action.payload };
    },
    changeSubmitLoading(state,action){
      return {...state, ...action.payload };
    },
    //控制editmodal的visible
    changeEditVisible(state,action){
      return {...state,...action.payload};
    },
    togglePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    changeKey(state,action){
      return{...state,...action.payload}
    },
    changePageNumber(state,action){
      return{...state,...action.payload}
    },
    saveResultData(state,action){
      return{...state,...action.payload}
    },
    saveTotalPage(state,action){
      return{...state,...action.payload}
    },
    saveTableOneData(state,action){
      return{...state,...action.payload}
    },
    changeApplicability(state,action){
      return{...state,...action.payload}
    },
    saveHouseNames(state,action){
      return{...state,...action.payload}
    },
  },
  subscriptions:{
     setup({ dispatch, history }) {
         history.listen(location => {
          if(location.pathname === '/newHouseOnline/projectManagement/createProject/createProjectConcessions'){
            dispatch({
              type:"setDefaultState",
            })
            if(!!location.state && !!location.state.projectId){
              dispatch({
                type:"saveIdAndState",
                payload:{
                  projectId:location.state.projectId,
                  isEdit:location.state.isEdit,
                  reEdit:location.state.reEdit,
                }
              })
              dispatch({
                type:'getInitConcessionsData',
                payload:{
                  projectId:location.state.projectId,
                  pageSize:10,
                  pageNo:0,
                }
              })
              dispatch({
                type:"getInitHouseTypeNames",
                payload:{
                  projectId:location.state.projectId
                }
              })
            }else{
              dispatch({
                type:'togglePrompt',
                payload:{
                  type:'error',
                  title:'失败!',
                  description:`projectId丢失,请重新创建项目!`,
                  visible:true,
                  todo:"closeModal"
                }
              })
            }
          }
         });
       },
    },
    effects:{
      *getInitHouseTypeNames({payload},{call,put}){
        const {data}=yield call(getInitHouseTypeNamesFetch,{...payload})
        if(!!data&&data.status==="success"){
          if(!!data.data){
            yield put({type:"saveHouseNames",payload:{
              houseTypeNames:data.data
            }})
          }
        }
      },
      *getInitConcessionsData({payload},{call,put}){
        const {data}=yield call(getInitConcessionsDataFetch,{...payload})
        if(!!data&&data.status==='success'){
          if(!!data.data&&!!data.data.content){
            const result=data.data.content;
            const resultData=[];
            result.map((item,index)=>{
              if(!!item.areaFrom&&!!item.areaTo){
                resultData.push({
                  key:item.id,
                  number:`${index+1}`,
                  name:item.name,
                  originalPrice:item.originalPrice,
                  price:item.price,
                  validDate:item.validDate,
                  houseType:`${item.areaFrom}㎡-${item.areaTo}㎡`,
                  holdDays:item.holdDays,
                  createDateTime:item.createDateTime
                })
              }else{
                resultData.push({
                  key:item.id,
                  number:`${index+1}`,
                  name:item.name,
                  originalPrice:item.originalPrice,
                  price:item.price,
                  validDate:item.validDate,
                  houseType:item.discounts.map(i=>{return(`${i.name}/`)}),
                  holdDays:item.holdDays,
                  createDateTime:item.createDateTime
                })
              }
            })
            yield put({type:'saveResultData',payload:{
              resultData:resultData
            }})
            const totalElements=data.data.totalElements;
            yield put({type:'saveTotalPage',payload:{
              totalElements:totalElements
            }})
          }
        }else{
          yield put({type:'togglePrompt',payload:{
            type:'error',
            title:'失败!',
            description:`获取初始列表数据失败:${data.message}`,
            visible:true,
            todo:"closeModal"
          }})
        }
      },
      *closeModalAndFetch({payload},{select,call,put}){
        const projectId = yield select(({ createProjectConcessions }) => createProjectConcessions.projectId);
        yield put({
          type:'togglePrompt',
          payload:{
            visible:false,
          }
        })
        yield put({
          type:'changeApplicability',
          payload:{
            applicability:''
          }
        })
        yield put({
          type:'getInitConcessionsData',
          payload:{
            projectId:projectId
          }
        })
      },
      *addConcessions({payload},{call,put,select}){
        const {houseTypeNames}=yield select(({createProjectConcessions})=>createProjectConcessions);
        console.log('houseTypeNames',houseTypeNames);
        const upLoadData=payload
        const validDate=[];
        const discounts=[];
        upLoadData.createDateTime=moment(upLoadData.createDateTime).format("YYYY-MM-DD HH:mm:ss")
        upLoadData.validDate.map(item=>{
          validDate.push(moment(item).format('YYYY-MM-DD HH:mm:ss'))
        })
        const s1 = validDate[0].replace(/-/g, "/");
        const s2 = validDate[1].replace(/-/g, "/");
        const d1 = new Date(s1);
        const d2 = new Date(s2);
        var time= d2.getTime() - d1.getTime();
        var days = parseInt(time / (1000 * 60 * 60 * 24));
        //  alert("相差天数: " + days);
        upLoadData.activityPeriodFrom=validDate[0];
        upLoadData.activityPeriodTo=validDate[1];
        upLoadData.validDate=days;
        delete upLoadData.applicability
        delete upLoadData.createDatetime
        if(!!upLoadData.houseType){
          upLoadData.houseType.map(item=>{
            let typeId=null;
            houseTypeNames.map(typeNameItem=>{
              if(typeNameItem.name===item){
                typeId=typeNameItem.id;
              }
            })
            discounts.push({
              name:item,
              id:typeId,
            })
          })
          upLoadData.discounts=discounts
          upLoadData.houseType=1
        }
        const {data}=yield call(addConcessionsFetch,{...payload})
        if(!!data&&data.status==='success'){
          yield put({type:'togglePrompt',payload:{
            type:'success',
            title:'成功!',
            description:'添加团购优惠成功!',
            visible:true,
            todo:"closeModalAndFetch"
          }})
        }else{
          yield put({type:'togglePrompt',payload:{
            type:'error',
            title:'失败!',
            description:`添加团购优惠失败:${data.message}`,
            visible:true,
            todo:"closeModal"
          }})
        }
      },
      *editConcessions({payload},{call,put}){
        const upLoadData=payload
        const validDate=[];
        const discounts=[];
        upLoadData.createDateTime=moment(upLoadData.createDateTime).format("YYYY-MM-DD HH:mm:ss")
        upLoadData.validDate.map(item=>{
          validDate.push(moment(item).format('YYYY-MM-DD HH:mm:ss'))
        })
        const s1 = validDate[0].replace(/-/g, "/");
        const s2 = validDate[1].replace(/-/g, "/");
        const d1 = new Date(s1);
        const d2 = new Date(s2);
        var time= d2.getTime() - d1.getTime();
        var days = parseInt(time / (1000 * 60 * 60 * 24));
        //  alert("相差天数: " + days);
        upLoadData.activityPeriodFrom=validDate[0];
        upLoadData.activityPeriodTo=validDate[1];
        upLoadData.validDate=days;
        delete upLoadData.applicability
        delete upLoadData.createDatetime
        if(!!upLoadData.houseType){
          upLoadData.houseType.map(item=>{
            discounts.push({
              name:item
            })
          })
          upLoadData.discounts=discounts
          upLoadData.houseType=1
        }
        const {data}=yield call(editConcessionsFetch,{...payload})
        if(!!data&&data.status==='success'){
          yield put({type:'togglePrompt',payload:{
            type:'success',
            title:'成功!',
            description:'编辑团购优惠成功!',
            visible:true,
            todo:"closeModalAndFetch"
          }})
        }else{
          yield put({type:'togglePrompt',payload:{
            type:'error',
            title:'失败!',
            description:'编辑团购优惠失败!',
            visible:true,
            todo:"closeModal"
          }})
        }
      },
      *deleteIds({payload},{call,put}){
        const {data}=yield call(deleteIdsFetch,{...payload})
        if(!!data&&data.status==='success'){
          yield put({type:'togglePrompt',payload:{
            type:'success',
            title:'成功!',
            description:'删除成功!',
            visible:true,
            todo:"closeAndFetch"
          }})
        }else{
          yield put({type:'togglePrompt',payload:{
            type:'error',
            title:'失败!',
            description:`删除失败:${data.message}`,
            visible:true,
            todo:"closeAndFetch"
          }})
        }
      },
      *changePage({payload},{call,put}){
        const {data}=yield call(getInitConcessionsDataFetch,{...payload})
        if(!!data&&data.status==='success'){
          return
        }else{
          yield put({type:'togglePrompt',payload:{
            type:'error',
            title:'失败!',
            description:`页面跳转失败:${data.message}`,
            visible:true,
            todo:"closeAndFetch"
          }})
        }
      },
      *searchOneData({payload},{call,put}){
        const {data}=yield call(searchOneDataFetch,{...payload})
        if(data.status==='success'){
          if(!!data.data.houseType){
            const resultData=data.data
            const tableOneData={
              name:resultData.name,
              validDate:[resultData.activityPeriodFrom,resultData.activityPeriodTo],
              houseType:resultData.discounts.map(item=>{return item.name}),
              holdDays:resultData.holdDays,
              id:resultData.id,
              applicability:'houseType',
              originalPrice:resultData.originalPrice,
              price:resultData.price
            }
            yield put({
              type:'saveTableOneData',
              payload:{
                tableOneData:tableOneData
              }
            })
            yield put({
              type:'changeApplicability',
              payload:{
                edit_applicability:tableOneData.applicability
              }
            })
          }else{
            const resultData=data.data
            const tableOneData={
              name:resultData.name,
              validDate:[resultData.activityPeriodFrom,resultData.activityPeriodTo],
              areaFrom:resultData.areaFrom,
              areaTo:resultData.areaTo,
              holdDays:resultData.holdDays,
              id:resultData.id,
              applicability:'houseArea',
              originalPrice:resultData.originalPrice,
              price:resultData.price
            }
            yield put({
              type:'saveTableOneData',
              payload:{
                tableOneData:tableOneData
              }
            })
            yield put({
              type:'changeApplicability',
              payload:{
                edit_applicability:tableOneData.applicability
              }
            })
          }
        }else{
          yield put({type:'togglePrompt',payload:{
            type:'error',
            title:'失败!',
            description:`查询此条数据失败:${data.message}`,
            visible:true,
            todo:"closeModal"
          }})
        }
      }
    },
}
