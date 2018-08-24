import {
  treeMenuMap,
  renderNHTrackDataJSON,
  isNull,
  clearProjectInfoInStorage,
} from '../../../../commons/utils/currencyFunction'
import { routerRedux } from 'dva/router'
import {
  searchHouseFetch,
  getHouseTableListFetch,
  getProjectHousesIntentionSellFetch,
  getHouseGroupBuyTypesFetch,
  creatGroupBuyDealListFetch,
  getOrderInfoFetch,
  payGroupBuyFetch,
  searchCustomerInfoFetch,
}from '../../../services/tradeManagement/newHouseTrade/creatGroupBuy'
import {
  getTrackInfoFetch,
}from '../../../services/tradeManagement/newHouseTrade/newHouseTrack'
import {
  getProjectDetailFetch,
} from '../../../services/tradeManagement/newHouseTrade/newHouseTrade';

const initState={
  loading:true,
  type:'quick',//quick快捷入口、normal正常录团购
  groupBuyId:null,
  projectInfo:null,
  promptObj:{
    visible:false,
    description:'',
    title:'',
    okText:'确定',
    todo:'default',
  },
  //正常程序state
  trackJSON:null,
  groupKey:null,
  //快捷入口state
  lockProject:true,//限制项目
  projectId:null,
  projectName:null,
  projectList:[],
  chooseCustomerModal:{
    visible:false,
    customerList:[],
    selectCustomerInfo:null,
  },
  houseTreeData:[],
  houseTreeMap:new Map(),
  selectHouseKey:[],
  showHouseObj:{
    picUrl:'',
    key:'defalut',
    areaInfo:'',
    priceInfo:'',
    cellStatus:'',
  },
  discountList:[],
  discountMap:new Map(),
  selectDiscount:{
    holdDays:null,
    beyondDays:null,
    id:null,
  },
  payModal:{
    visible:false,
    orderInfo:null,
    loading:true,
    serialNumber:'',
  },
}
export default {
  namespace: 'creatGroupBuy',
  state: initState,
  subscriptions: {
   setup({ dispatch, history }) {
     history.listen(location => {
       if (location.pathname === '/tradeManagement/newHouseTrade/creatGroupBuy') {
         dispatch({
           type:'initComponent',
           payload:location.state,
         });

       }
    });
   },
  },
  effects:{
    //初始组件状态
    *initComponent({payload},{put}){
      yield put({type:'doInitState'});
      if(!!payload && (!!payload.projectId || !!payload.groupKey)){
        const {projectId,groupKey,projectName}=payload;
         yield put({
           type:'getProjectInfoData',
           payload:projectId,
         })
         if(!!groupKey && !!projectId){
           //从报备或者确看过来
           yield put({
             type:'setType',
             payload:{
               type:'normal',
               groupKey,
               projectId,
             }
           })
           yield put({
             type:'findTrackByGroupKey',
             payload:groupKey,
           });
           yield put({
             type:'getProjectHousesIntention',
             payload:projectId,
           });
         }else{
           //从快捷入口过来
           yield put({
             type:'quitInitProject',
             payload:{
               projectId,
               projectName,
             },
           })
         }
      }else{
       yield put({
         type: 'switchPrompt',
         payload:{
           visible:true,
           description:'请联系管理员',
           title:'获取初始信息失败',
           okText:'确定',
         },
       });
      }
    },
    *getGroupBuyInfo({payload},{call,put}){
      //发起请求获取之前的报备数据
    },
    //获取项目列表数据
    *getProjectListData({payload},{call,put}){

    },
    //获取项目简要信息
    *getProjectInfoData({payload},{call,put}){
      const {data}=yield call(getProjectDetailFetch,{id:payload});
      if(!!data){
        if(data.status==='success'){
          const projectData=data.data;
          if(isNull(projectData.isOffProject,false)){
            clearProjectInfoInStorage()
            yield put(routerRedux.push({
              pathname:'/indexPage'
            }))
          }else{
            const projectInfo={
              name:isNull(projectData.name,''),
              img:isNull(projectData.isCoverPicPaths,''),
              basicInfos:[
                {
                  label:'项目负责人',
                  value:isNull(projectData.contact,''),
                },{
                  label:'联系电话',
                  value:isNull(projectData.phone,''),
                }
              ],
              tradeInfos:[
                {
                  label:'已售团购',
                  value:`${isNull(projectData.discount,'0')}套`,
                },{
                  label:'已成交',
                  value:`${isNull(projectData.transactionsNumber,'0')}套`,
                },{
                  label:'剩余套数',
                  value:`${isNull(projectData.laveNumber,'0')}套`,
                },{
                  label:'团购优惠结束时间',
                  value:isNull(projectData.endOfProjectActivity,'-'),
                }
              ],
            }
            yield put({
              type:'updateProjectInfo',
              payload:JSON.stringify(projectInfo),
            })
          }
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取项目信息失败',
              okText:'确定',
              todo:'other',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请求失败，请联系管理员',
            title:'获取项目信息失败',
            okText:'确定',
            todo:'other',
          },
        });
      }
    },
    //锁定项目，获取数据（暂未使用）
    *lockPojectGetData({payload},{call,put}){
      const {projectId,projectName}=payload;
      yield put({
        type:'lockProject',
        payload,
      });
    },
    //搜索确看客户数据
    *searchCustomer({payload},{select,call,put}){
      const {projectId}=yield select(({creatGroupBuy})=>creatGroupBuy);
      const {data}=yield call(searchCustomerInfoFetch,{keyword:payload,projectId,});
      if(!!data){
        if(data.status==='success' && !!data.data.content){
          const customerList=data.data.content.map(item=>({
              id:item.groupKey,
              name:item.customerName,
              phoneNumber:item.customerPhone,
              idNumber:item.idNumber,
              gender:item.customerSex,
              isSelect:false,
          }));
          yield put({
            type:'updateCustomerList',
            payload:customerList,
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取确看客户信息失败！',
              okText:'确定',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请求失败，请联系管理员',
            title:'获取确看客户信息失败！',
            okText:'确定',
          },
        });
      }
    },
    //放弃选择确看客户
    *giveUpSelectCustomer({payload},{select,call,put}){
      const {customerList,selectCustomerInfo} = yield select(({ creatGroupBuy }) => creatGroupBuy.chooseCustomerModal);
      if(selectCustomerInfo==null || selectCustomerInfo.show===undefined || selectCustomerInfo.show==false){
        //并未选择客户，清空
        yield put({
          type:'initChooseCustomerModal'
        })
      }else{
        //已经选择好客户，只是关闭模态框
        yield put({
          type:'closeChooseCustomerModal'
        })
      }
    },
    //选择确看客户
    *selectCustomerKey({payload},{select,call,put}){
      const {customerList} = yield select(({ creatGroupBuy }) => creatGroupBuy.chooseCustomerModal);
      let selectCustomerInfo={};
      const newList=customerList.map(item=>{
        if(item.id!==payload){
          return Object.assign({},item,{isSelect:false});
        }else{
          selectCustomerInfo=Object.assign({},item,{show:false,isSelect:false});
          return Object.assign({},item,{isSelect:true});
        }
      });
      yield put({
        type:'updateSelectCustomer',
        payload:{
          customerList:newList,
          selectCustomerInfo,
        },
      })
    },
    //确认选择确看客户
    *sureDoSelectCustomer({payload},{select,call,put}){
      //关闭模态框，显示选择的客户信息
      const {chooseCustomerModal:{selectCustomerInfo},projectId}=yield select(({creatGroupBuy})=>creatGroupBuy);
      if(selectCustomerInfo==null || selectCustomerInfo==undefined ||selectCustomerInfo.id==undefined){
        //没选择
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请选择确看用户',
            title:'您尚未选择确看客户！',
            okText:'确定',
            todo:'defalut',
          },
        });
      }else{
        yield put({
          type:'doChooseCustomerCloseModal',
          payload:{
            visible:false,
            selectCustomerInfo:Object.assign({},selectCustomerInfo,{show:true}),
            customerList:[],
          }
        });
        const {data}=yield call(getTrackInfoFetch,{groupKey:selectCustomerInfo.id})
        if(!!data){
          if(data.status==='success'){
            const {trackDetail}=data.data;
            console.log('trackDetail',trackDetail);
            yield put({
              type:'initTrackDataSetGroupKey',
              payload:{
                trackJSON:renderNHTrackDataJSON(data.data),
                groupKey:selectCustomerInfo.id,
              },
            })
            yield put({
              type:'getProjectHousesIntention',
              payload:projectId,
            })
          }else{
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:data.message,
                title:'获取交易数据失败',
                okText:'确定',
              },
            });
          }
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'请联系管理员',
              title:'获取交易数据失败',
              okText:'确定',
            },
          });
        }
      }
      //获取track信息展示

    },
    //点击立即支付的回调发送团购信息
    *sendGroupBuyInfo({payload},{select,call,put}){
      const {
        groupKey,
        houseTreeMap,
        selectHouseKey,
        selectDiscount,
      }=yield select(({creatGroupBuy})=>creatGroupBuy);
      const projectFavorableId=selectDiscount.id;
      const house=houseTreeMap.get(selectHouseKey.join('/'));
      if(!!house && !!projectFavorableId && !!house.id && !!groupKey){
        //打开支付模态框
        yield put({type:'openPayModal'});
        const {data}=yield call(creatGroupBuyDealListFetch,{
          groupKey,
          houseId:house.id,
          projectFavorableId,
        });
        if(!!data){
          if(data.status==='success' && !!data.data.id){
            const response=yield call(getOrderInfoFetch,{groupbuyId:data.data.id});
            if(!!response.data){
              if(response.data.status==='success'){
                const resInfo=response.data.data;
                const orderInfo={
                  discountName:!!resInfo.projectFavorableName?resInfo.projectFavorableName:'',
                  amount:!!resInfo.groupbuyMoney?resInfo.groupbuyMoney:'',
                  orderNumber:!!resInfo.payOrderNumber?resInfo.payOrderNumber:'',
                  bankCard:!!resInfo.unionpayNumber?resInfo.unionpayNumber:'',
                  idNumber:!!resInfo.customerIDNumber?resInfo.customerIDNumber:'',
                  customerName:!!resInfo.customerName?resInfo.customerName:'',
                  phoneNumber:!!resInfo.customerPhone?resInfo.customerPhone:'',
                  payId:!!resInfo.groupbuyId?resInfo.groupbuyId:'',
                };
                yield put({
                  type:'setOrderInfo',
                  payload:{
                    payModal:{
                      visible:true,
                      orderInfo:JSON.stringify(orderInfo),
                      loading:false,
                    },
                    groupBuyId:data.data.id,
                  }
                })
              }else{
                yield put({
                  type: 'switchPrompt',
                  payload:{
                    visible:true,
                    description:response.data.message,
                    title:'获取团购订单失败！',
                    okText:'确定',
                  },
                });
              }
            }else{
              yield put({
                type: 'switchPrompt',
                payload:{
                  visible:true,
                  description:'请求失败，请联系管理员',
                  title:'获取团购订单失败！',
                  okText:'确定',
                },
                todo:'closePayModal',
              });
            }
          }else{
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:data.message,
                title:'获取团购id失败！',
                okText:'确定',
                todo:'closePayModal',
              },
            });
          }
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'请求失败，请联系管理员',
              title:'获取团购id失败！',
              okText:'确定',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请确认所有信息填写完整！',
            title:'创建团购信息失败！',
            okText:'确定',
            todo:'default',
          },
        });
      }
    },
    //关闭提示框行为判断
    *closePrompt({ payload }, { select,call, put }){
      const {todo} = yield select(({ creatGroupBuy }) => creatGroupBuy.promptObj);
      switch (todo) {
        case 'default':
          yield put({type:'switchPrompt',payload:{visible:false}});
          break;
        case 'getOut':
          yield put(routerRedux.goBack());
        case 'closePayModal':
          yield put({
            type:'closeBuyModal',
          });
        default:
          yield put({type:'switchPrompt',payload:{visible:false}});
          break;
      }
    },
    // //获取项目销控表数据
    // *getHouseTableList({payload},{select,call,put}){
    //   const{projectId}=yield select((creatGroupBuy)=>creatGroupBuy);
    //   console.log('projectId',projectId);
    //   const {data}=yield call(getHouseTableListFetch,{projectId,pageNo:0,pageSize:1000000});
    //   console.log('data',data);
    // },
    //获取团购意向房源数据
    *getProjectHousesIntention({payload},{call,put}){
      const {data}=yield call(getProjectHousesIntentionSellFetch,{projectId:payload});
      if(!!data){
        if(data.status==='success'){
          const areaMap=new Map();
          const intentionMap=new Map();
          const areaSet=new Set();
          const result=data.data;
          result.map(item=>{
            areaSet.add(`${item.area}/${item.buildingNumber}/${item.unit}/${item.roomNumber}`);
            intentionMap.set(`${item.area}/${item.buildingNumber}/${item.unit}/${item.roomNumber}`,{
              area:item.area,
              bathRoom:item.bathRoom,
              buildingNumber:item.buildingNumber,
              cookRoom:item.cookRoom,
              floorArea:item.floorArea,
              housePic:item.housePic,
              houseRoom:item.houseRoom,
              houseTypeName:item.houseTypeName,
              id:item.id,
              isLead:item.isLead,
              livingRoom:item.livingRoom,
              price:item.price,
              projectId:item.projectId,
              roomNumber:item.roomNumber,
              state:item.state,
              totalPrice:item.totalPrice,
              unit:item.unit,
            })
          })
          areaSet.forEach((value, key)=>{
            value.split('/').reduce((prev,next,index,arr)=>{
              if(index===0){
                areaMap.set(next,{
                  key:next,
                  parentKey:'root',
                  title:arr[index],
                });
                return next;
              }else if(index===arr.length-1){
                areaMap.set(`${prev}/${next}`,{
                  key:`${prev}/${next}`,
                  parentKey:prev,
                  title:arr[index],
                });
              }else{
                areaMap.set(`${prev}/${next}`,{
                  key:`${prev}/${next}`,
                  parentKey:prev,
                  title:arr[index],
                });
                return `${prev}/${next}`;
              }
            },'');
          });
          const treeArr=[];
          areaMap.forEach((areaItem,key)=>{
            treeArr.push({
              label:areaItem.title,
              value:areaItem.title,
              key:areaItem.key,
              parentKey:areaItem.parentKey,
            });
          });
          const treeObj=new treeMenuMap(treeArr).init('root');
          yield put({
            type:'initHouseTreeData',
            payload:{
              houseTreeData:treeObj.treeArr,
              houseTreeMap:intentionMap,
            }
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'查询意向户源列表失败',
              okText:'确定',
              type:'error',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请求失败，请联系管理员',
            title:'查询意向户源列表失败',
            okText:'确定',
          },
        });
      }
    },
    //选择团购意向房源
    *doSelectHouseKey({payload},{select,put}){
      yield put({
        type:'changeSelectHouseKey',
        payload,
      })
      if(payload.length===0){
        const showHouseObj={
          picUrl:'',
          key:'defalut',
          areaInfo:'',
          priceInfo:'',
          cellStatus:'',
        };
        yield put({type:'clearShowHouseObj'})
      }else{
        const selectKey=payload.join('/');
        const {houseTreeMap}=yield select(({creatGroupBuy})=>creatGroupBuy);
        const selectObj=houseTreeMap.get(selectKey);
        const showHouseObj={
          id:selectObj.id,
          area:selectObj.area,
          bathRoom:selectObj.bathRoom,
          buildingNumber:selectObj.buildingNumber,
          cookRoom:selectObj.cookRoom,
          floorArea:selectObj.floorArea,
          houseRoom:selectObj.houseRoom,
          imgUrl:selectObj.housePic[0],
          livingRoom:selectObj.livingRoom,
          price:selectObj.price,
          roomNumber:selectObj.roomNumber,
          totalPrice:selectObj.totalPrice,
          unit:selectObj.unit,
          cellStatus:`销售状态：${selectObj.state}`,
        };
        yield put({type:'initShowHouseObj',payload:showHouseObj});
        yield put({type:'getHouseGroupBuyTypes',payload:selectObj.id});
      }
    },
    //获取选中的房源对应的团购类型和信息
    *getHouseGroupBuyTypes({payload},{select,call,put}){
      const{data}=yield call(getHouseGroupBuyTypesFetch,{id:payload});
      if(!!data){
        if(data.status==='success'){
          const discountMap=new Map();
          const discountList=[];
          data.data.map(item=>{
            discountMap.set(item.id,{
              holdDays:item.holdDays,
              beyondDays:'【超过期限尚未定义字段】',
              id:item.id,
            });
            discountList.push({
              title:item.name,
              value:item.id,
            });
          });
          yield put({
            type:'initDisCountList',
            payload:{
              discountList,
              discountMap,
            }
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取房源团购优惠信息失败',
              okText:'确定',
              todo:'defalut',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'无法获取响应信息',
            title:'获取房源团购优惠信息失败！',
            okText:'确定',
            todo:'defalut',
          },
        });
      }
    },
    //获取track数据
    *findTrackByGroupKey({payload},{put,call}){
      const {data}=yield call(getTrackInfoFetch,{groupKey:payload});
      if(!!data){
        if(data.status==='success'){
          const {trackDetail}=data.data;
          yield put({
            type:'initTrackData',
            payload:renderNHTrackDataJSON(data.data),
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取交易数据失败',
              okText:'确定',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请联系管理员',
            title:'获取交易数据失败',
            okText:'确定',
          },
        });
      }
    },
    //选择团购优惠类型
    *selectDiscountType({payload},{select,put}){
      const {discountMap}=yield select(({creatGroupBuy})=>creatGroupBuy);
      const selectDiscount={
        holdDays:discountMap.get(payload).holdDays,
        beyondDays:discountMap.get(payload).beyondDays,
        id:payload,
      };
      yield put({
        type:'updataSelectDiscount',
        payload:selectDiscount,
      })
    },
    //支付团购
    *payGroupBuy({payload},{call,put}){
      const {data}=yield call(payGroupBuyFetch,{
        customerIDNumber:payload.idNumber,
        customerName:payload.customerName,
        customerPhone:payload.phoneNumber,
        groupbuyId:payload.payId,
        payType:payload.payWay,
        unionpayNumber:payload.bankCard,
      })
      if(!!data){
        if(data.status==='success' && !!data.data.payOrderNumber){
          const serialNumber=data.data.payOrderNumber;
          yield put({
            type:'initSerialNumber',
            payload:serialNumber,
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'请联系管理员',
              title:'获取团购流水号失败',
              todo:'payAgain',
              okText:'确定',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请联系管理员',
            title:'获取团购流水号失败',
            todo:'payAgain',
            okText:'确定',
          },
        });
      }
    },
  },
  reducers: {
    doInitState(state,action){
      return initState;
    },
    changeSelectHouseKey(state,action){
      return {...state,selectHouseKey:action.payload}
    },
    initShowHouseObj(state,action){
      return {...state,showHouseObj:action.payload}
    },
    clearShowHouseObj(state,action){
      return {
        ...state,
        showHouseObj:{
          key:'defalut'
        },
        selectHouseKey:[],
        selectDiscount:{
          holdDays:null,
          beyondDays:null,
          id:null,
        },
        discountMap:new Map(),
        discountList:[],
      }
    },
    initHouseTreeData(state,action){
      return {...state,...action.payload,}
    },
    //切换项目
    selectProject(state,action){
      return {...state,projectId:action.payload}
    },
    openPayModal(state,action){
      return {...state,payModal:Object.assign({},initState.payModal,{visible:true})}
    },
    closeBuyModal(state,action){
      return {...state,payModal:Object.assign({},initState.payModal,{visible:false})}
    },
    switchPrompt(state,action){
      return{...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    onlyClosePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{visible:false})}
    },
    lockProject(state,action){
      return {...state,lockProject:true,...action.payload}
    },
    setType(state,action){
      return {...state,...action.payload}
    },
    initTrackData(state,action){
      return {...state,trackJSON:action.payload,loading:false}
    },
    initTrackDataSetGroupKey(state,action){
      return {...state,...action.payload,loading:false}
    },
    initDisCountList(state,action){
      return {...state,...action.payload,selectDiscount:{
        holdDays:null,
        beyondDays:null,
        id:null,
      }}
    },
    updataSelectDiscount(state,action){
      return {...state,selectDiscount:action.payload}
    },
    quitInitProject(state,action){
      return {...state,...action.payload,loading:false,lockProject:true,type:'quick'}
    },
    setOrderInfo(state,action){
      return {...state,payModal:action.payload.payModal,groupBuyId:action.payload.groupBuyId}
    },
    initSerialNumber(state,action){
      return {...state,payModal:Object.assign({},state.payModal,{serialNumber:action.payload})}
    },
    openChooseCustomerModal(state,action){
      return {...state,chooseCustomerModal:{...state.chooseCustomerModal,visible:true}}
    },
    updateSelectCustomer(state,action){
      return {...state,chooseCustomerModal:{...state.chooseCustomerModal,...action.payload}}
    },
    updateCustomerList(state,action){
      return {...state,chooseCustomerModal:{...state.chooseCustomerModal,customerList:action.payload}}
    },
    doChooseCustomerCloseModal(state,action){
      return {...state,chooseCustomerModal:{...state.chooseCustomerModal,...action.payload}}
    },
    initChooseCustomerModal(state,action){
      return {...state,chooseCustomerModal:initState.chooseCustomerModal,groupKey:null}
    },
    closeChooseCustomerModal(state,action){
      return {...state,chooseCustomerModal:{...state.chooseCustomerModal,visible:false,customerList:[]}}
    },
    updateProjectInfo(state,action){
      return {...state,projectInfo:action.payload}
    },
  },
}
