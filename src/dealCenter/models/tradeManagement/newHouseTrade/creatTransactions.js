import lodash from 'lodash';
import {
  treeMenuMap,
  renderNHTrackDataJSON,
  getNewTypeTrackJSONData,
  isNull,
  clearProjectInfoInStorage,
} from '../../../../commons/utils/currencyFunction'
import {
  renderTotalMoney,
} from '../../../../commons/utils/publicFunction'
import { routerRedux } from 'dva/router'
import {
  postTransactionInfoFetch,
  editCommitAddInfoFetch,
  getTransactionOrderInfoDataFetch,
  addTransactionsApplyFetch,
  findGroupCustomerInfoFetch,
}from '../../../services/tradeManagement/newHouseTrade/creatTransactions'
import {
  getAuditorList,
}from '../../../services/userFetch'
import {
  getProjectHousesIntentionSellFetch,
}from '../../../services/tradeManagement/newHouseTrade/creatGroupBuy'
import {
  getTrackInfoFetch,
}from '../../../services/tradeManagement/newHouseTrade/newHouseTrack'
import {
  getProjectDetailFetch,
} from '../../../services/tradeManagement/newHouseTrade/newHouseTrade';
const initState={
  creatTransactionsModal:{
    visible:false,
  },
  trackJSON:null,
  projectId:null,
  projectName:null,
  projectInfo:null,
  lastCommitData:null,
  auditingModal:{//审核
    value:false,
    staffData:[],
    slectValue:[],
  },
  promptObj:{
    visible:false,
    description:'',
    title:'',
    okText:'确定',
    todo:'default',
  },
  loading:true,
  type:'normal',
  groupKey:null,
  isReApply:false,
  chooseCustomerModal:{
    visible:false,
    customerList:[],
    selectCustomerInfo:null,
  },
  houseTreeData:[],
  houseTreeMap:new Map(),
  selectHouseKey:[],
  upLoadPicList:[],
  applyUploadList:[],//申请成交上传图片
  showHouseObj:{
    picUrl:'',
    key:'defalut',
    areaInfo:'',
    priceInfo:'',
    cellStatus:'',
  },
  applyModal:{
    visible:false,
    orderInfo:null,
    auditorList:[],
    selectAuditor:'',
    applyExplain:'',
    applyPicList:[],
    commissionInfo:null,
  },
}
export default {
  namespace: 'creatTransactions',
  state: lodash.cloneDeep(initState),
  subscriptions: {
   setup({ dispatch, history }) {
     history.listen(location => {
       if (location.pathname === '/tradeManagement/newHouseTrade/creatTransactions'){
         dispatch({
           type:'initComponent',
           payload:location.state,
         })
       }
    });
   },
  },
  effects:{
    //初始化组件状态
    *initComponent({payload},{put}){
      yield put({type:'doInitState'});
      if(!!payload && !!payload.projectId){
        yield put({
          type:'getProjectInfoData',
          payload:payload.projectId,
        })
      }
      if(!!payload && !!payload.groupKey && !!payload.projectId){
        if(!!payload.todo && payload.todo === 'reApply'){
          //重新申请成交
          yield put({
            type:'setIsReApply',
            payload:true,
          })
          yield put({
            type:'initNormalType',
            payload:{
              projectId:payload.projectId,
              groupKey:payload.groupKey,
            }
          })
        }else{
          //已经确定了项目,获取之前的数据
          yield put({
            type:'initNormalType',
            payload:{
              projectId:payload.projectId,
              groupKey:payload.groupKey,
            }
          })
        }
      }else if(!!payload.projectId && !!payload.projectName){
        //快捷入口进入
        yield put({
          type:'initQuickType',
          payload:{
            projectId:payload.projectId,
            projectName:payload.projectName,
          }
        })
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请联系管理员',
            title:'获取交易数据失败',
            okText:'确定',
            todo:'defalut',
          },
        });
      }
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
    //正常录成交流程初始化页面数据
    *initNormalType({payload},{put}){
      yield put({
        type:'findTrackByGroupKey',
        payload,
      })
    },
    //获取track数据
    *findTrackByGroupKey({payload},{select,put,call}){
      const {isReApply} = yield select(({creatTransactions})=>creatTransactions);

      const {data}=yield call(getTrackInfoFetch,{groupKey:payload.groupKey});
      if(!!data){
        if(data.status==='success'){
          const {trackDetail}=data.data;
          const trackJSON = renderNHTrackDataJSON(data.data);
          if(!!isReApply){
            const lastCommitArr = getNewTypeTrackJSONData(trackJSON,'成交价格')
            yield put({
              type:'updateLastCommitData',
              payload:JSON.stringify({
                unitPrice:isNull(lastCommitArr[0].value),
                totalPrice:renderTotalMoney(lastCommitArr[1].value),
                payType:isNull(lastCommitArr[2].value),
              })
            })
          }
          yield put({
            type:'initTrackData',
            payload:{
              trackJSON,
              groupKey:payload.groupKey,
            },
          })
          //获取track数据成功之后才获取销控表数据
          yield put({
            type:'getProjectHousesIntention',
            payload:payload.projectId,
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
    //点击申请提交，判断是否填完所有信息
    *checkTransactionData({payload},{select,call,put}){
      const {selectHouseKey,houseTreeMap,groupKey,upLoadPicList,isReApply}=yield select(({creatTransactions})=>creatTransactions);
      if(selectHouseKey.length===0 || upLoadPicList.length===0){
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请确认所有必填信息填写完整',
            title:'申请成交失败！',
            okText:'确定',
            todo:'default',
          },
        })
      }else{
        //打开录成交模态框
        // yield put({
        //   type:'openApplyModal'
        // })
        //申请模态框压入页面  changed by duxianqiu 17/05/16
        const house=houseTreeMap.get(selectHouseKey.join('/'));
        const {data}=yield call(isReApply?editCommitAddInfoFetch:postTransactionInfoFetch,{
          contracts:JSON.stringify(upLoadPicList.map(item=>item.id)),
          groupKey,
          houseId:house.id,
          payType:payload.payType,
          totalPrice:Number(payload.totalPrice)*10000,
          unitPrice:payload.unitPrice,
        })
        if(!!data){
          if(data.status==='success' && data.data.groupKey){
            //获取审核人员列表
            // yield put({type:'getAuditorListData'})
            // yield put({
            //   type:'getTransactionOrderInfoData',
            //   payload:data.data.groupKey,
            // })
            //申请模态框压入页面  changed by duxianqiu 17/05/16
            yield put(routerRedux.push({
              pathname: '/tradeManagement/newHouseTrade/nhCommitApply',
              state:{
                groupKey,
              },
            }))
          }else{
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:data.message,
                title:'申请成交失败！',
                okText:'确定',
                todo:'closeAddModal',
              },
            })
          }
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'请求失败，请联系管理员',
              title:'申请成交失败！',
              okText:'确定',
              todo:'closeAddModal',
            },
          })
        }
      }
    },
    //关闭提示框行为判断
    *closePrompt({ payload }, { select,call, put }){
      const {todo} = yield select(({ creatTransactions }) => creatTransactions.promptObj);
      switch (todo) {
        case 'default':
          yield put({type:'switchPrompt',payload:{visible:false}});
          break;
        case 'getOut':
          yield put(routerRedux.goBack());
        case 'closeAddModal':
          yield put({type:'clooseApplyModal'});
        default:
          yield put({type:'switchPrompt',payload:{visible:false}});
          break;
      }
    },
    //获取团购意向房源数据
    *getProjectHousesIntention({payload},{select,call,put}){
      const {isReApply} = yield select(({creatTransactions})=>creatTransactions);
      console.log('isReApply',isReApply);
      const {data}=yield call(getProjectHousesIntentionSellFetch,{projectId:payload});
      if(!!data){
        if(data.status==='success'){
          const houseInfoList=data.data;
          const {trackJSON}=yield select(({creatTransactions})=>creatTransactions);
          const defaultHouseDepend = isReApply?'实际成交房源':'团购锁定意向房源'
          const goupBuyHouse = getNewTypeTrackJSONData(trackJSON,defaultHouseDepend)
          let selectHouseKey=[];
          let goupBuyHouseObj=null;
          if(!!JSON.parse(trackJSON) && !!goupBuyHouse){
            //将track中录团购的房源数据注入响应房源销控表数组中
            goupBuyHouseObj={
              area:goupBuyHouse.area,
              bathRoom:goupBuyHouse.bathRoom,
              buildingNumber:goupBuyHouse.buildingNumber,
              cookRoom:goupBuyHouse.cookRoom,
              floorArea:goupBuyHouse.floorArea,
              housePic:[goupBuyHouse.imgUrl],
              houseRoom:goupBuyHouse.houseRoom,
              houseTypeName:goupBuyHouse.houseTypeName,
              id:goupBuyHouse.id,
              livingRoom:goupBuyHouse.livingRoom,
              price:goupBuyHouse.price,
              projectId:payload,
              roomNumber:goupBuyHouse.roomNumber,
              state:'',
              totalPrice:goupBuyHouse.totalPrice,
              unit:goupBuyHouse.unit,
            };
            selectHouseKey=[
              goupBuyHouseObj.area,
              goupBuyHouseObj.buildingNumber,
              goupBuyHouseObj.unit,
              goupBuyHouseObj.roomNumber,
            ]
            houseInfoList.push(goupBuyHouseObj);
          }

          const areaMap=new Map();
          const intentionMap=new Map();
          const areaSet=new Set();
          houseInfoList.map(item=>{
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
              projectId:payload,
              selectHouseKey:selectHouseKey,
              showHouseObj:!!goupBuyHouseObj?Object.assign({},goupBuyHouseObj,{imgUrl:goupBuyHouseObj.housePic[0]}):initState.showHouseObj,
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
        const {houseTreeMap}=yield select(({creatTransactions})=>creatTransactions);
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
      }
    },
    //申请理由输入框赋值，限制长度为20
    *changeApplyExplain({payload},{put}){
      if(payload.length>=21){
        //长度超过不赋值
      }else{
        //长度满足基本法
        yield put({
          type:'changeApplyExplainValue',
          payload,
        })
      }
    },
    //获取申请成交订单数据
    *getTransactionOrderInfoData({payload},{call,put}){
      const{data}=yield call(getTransactionOrderInfoDataFetch,{groupKey:payload});
      if(!!data){
        if(data.status==='success' && data.data.id){
          const result=data.data;
          const orderTableData={
            key:isNull(result.id,''),
            project:isNull(result.projectName,''),
            propertyType:isNull(result.propertyType,''),
            intentionHouse:isNull(result.houseName,''),
            groupBuyType:isNull(result.discountName,''),
            unitPrice:isNull(result.totalPrice,''),
            totalPrice:isNull(result.unitPrice,''),
            commission:isNull(result.brokerage,''),
            agent:isNull(result.brokerName,''),
            time:isNull(result.createTime,''),
          }
          const commissionArr=[
            {
              label:'佣金总额',
              value:`${isNull(result.brokerage,'')}元`,
            },{
              label:'平台抽佣',
              value:`${isNull(result.ptBrokerage,'')}%`,
            },{
              label:'交易服务费',
              value:`${isNull(result.txCharge,'')}元`,
            },{
              label:'剩余佣金总额',
              value:`${isNull(result.residualCommission,'')}元`,
            },{
              label:'成交方式',
              value:isNull(result.txMode,''),
            },{
              label:'佣金比例',
              value:`${isNull(result.commissionRate,'')}%`,
            },{
              label:'佣金分配金额',
              value:`${isNull(result.commissionAmount,'')}元`,
            }
          ];
          yield put({
            type:'setApplyModalOrderInfo',
            payload:{
              orderInfo:JSON.stringify(orderTableData),
              commissionInfo:JSON.stringify(commissionArr),
            }
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取成交申请信息失败！',
              okText:'确定',
              todo:'closeAddModal',
            },
          })
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请求失败，请联系管理员',
            title:'获取成交申请信息失败！',
            okText:'确定',
            todo:'closeAddModal',
          },
        })
      }
    },
    //发起成交审核申请
    *doApplyTransactions({payload},{select,call,put}){
      const {
        groupKey,
        applyModal:{
          auditorList,
          selectAuditor,
          applyExplain,
          applyPicList,
        },
      }=yield select(({creatTransactions})=>creatTransactions);
      //输入状态判断
      if(!groupKey || auditorList.length===0 || selectAuditor==='' || applyPicList.length===0 || applyExplain.length===0){
        //信息不完整
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请确认你所填信息的完整',
            title:'成交申请失败！',
            okText:'确定',
            todo:'defalt',
          },
        })
      }else{
        let auditUserName;
        auditorList.map(item=>{
          if(item.id===selectAuditor){
            auditUserName=item.name;
          }
        });
        const picArr=applyPicList.map(item=>{
          return item.id;
        });
        const {data}=yield call(addTransactionsApplyFetch,{
          groupKey,
          auditUserName,
          auditUserId:selectAuditor,
          attachments:JSON.stringify(picArr),
          auditDesc:applyExplain,
        });
        if(!!data){
          if(data.status==='success' && !!data.data.id){
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:'',
                title:'成交申请成功！',
                okText:'确定',
                todo:'getOut',
              },
            })
          }else{
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:data.message,
                title:'申请成交失败！',
                okText:'确定',
                todo:'default',
              },
            })
          }
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'请求失败，请联系管理员',
              title:'申请成交失败！',
              okText:'确定',
              todo:'default',
            },
          })
        }
      }
    },
    //获取成交审核人员列表数据
    *getAuditorListData({payload},{select,call,put}){
      const {data}=yield call(getAuditorList,{name:'成交审核'});
      if(!!data && data.status==='success'){
        const auditorList=data.data.map(item=>({
          name:item.name,
          id:`${item.userId}`,
        }));
        yield put({
          type:'initAuditorList',
          payload:auditorList,
        })
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:isNull(data.message,'获取审核人员列表失败'),
            title:'申请成交失败！',
            okText:'确定',
            todo:'default',
          },
        })
      }
    },
    // //获取已团购中用户信息
    // *getGroupBuyCustomerInfo({payload},{call,put}){
    //   const {data}=yield call(getGroupBuyCustomerInfoFetch,{
    //     projectId:payload,
    //
    //   })
    // },
    //选择团购客户
    *selectCustomerKey({payload},{select,call,put}){
      const {customerList} = yield select(({ creatTransactions }) => creatTransactions.chooseCustomerModal);
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
    //搜索团购客户数据
    *searchCustomer({payload},{select,call,put}){
      const {projectId}=yield select(({creatTransactions})=>creatTransactions);
      const {data}=yield call(findGroupCustomerInfoFetch,{keyword:payload,projectId,});
      if(!!data){
        if(data.status==='success' && !!data.data.content){
          const customerList=data.data.content.map(item=>({
              id:item.id,
              groupKey:item.groupKey,
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
              description:data.data.message,
              title:'获取团购客户信息失败！',
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
            title:'获取团购客户信息失败！',
            okText:'确定',
          },
        });
      }
    },
    //确认选择确看客户
    *sureDoSelectCustomer({payload},{select,call,put}){
      //关闭模态框，显示选择的客户信息
      const {chooseCustomerModal:{selectCustomerInfo},projectId}=yield select(({creatTransactions})=>creatTransactions);
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
        const {data}=yield call(getTrackInfoFetch,{groupKey:selectCustomerInfo.groupKey})
        if(!!data){
          if(data.status==='success' && !!data.data.trackDetail){
            const {trackDetail}=data.data;
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
    },
    //放弃选择团购客户
    *giveUpSelectCustomer({payload},{select,call,put}){
      const {customerList,selectCustomerInfo} = yield select(({ creatTransactions }) => creatTransactions.chooseCustomerModal);
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

  },
  reducers: {
    doInitState(state,action){
      return lodash.cloneDeep(initState);
    },
    initTrackData(state,action){
      return {...state,...action.payload,loading:false}
    },
    switchPrompt(state,action){
      return{...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    onlyClosePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{visible:false})}
    },
    initHouseTreeData(state,action){
      return {...state,...action.payload,}
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
      }
    },
    changeSelectHouseKey(state,action){
      return {...state,selectHouseKey:action.payload}
    },
    updatePicList(state,action){
      return {...state,upLoadPicList:action.payload}
    },
    updateApplyUploadList(state,action){
      return {...state,applyUploadList:action.payload}
    },
    openApplyModal(state,action){
      return {...state,applyModal:{...initState.applyModal,visible:true}}
    },
    clooseApplyModal(state,action){
      return {...state,applyModal:{...initState.applyModal,visible:false}}
    },
    changeApplyExplainValue(state,action){
      return {...state,applyModal:{...state.applyModal,applyExplain:action.payload}}
    },
    changeSelectAuditor(state,action){
      return {...state,applyModal:{...state.applyModal,selectAuditor:action.payload}}
    },
    setApplyModalOrderInfo(state,action){
      return {...state,applyModal:{...state.applyModal,...action.payload}}
    },
    initAuditorList(state,action){
      return {...state,applyModal:{...state.applyModal,auditorList:action.payload}}
    },
    initQuickType(state,action){
      return {...initState,type:'quick',...action.payload,loading:false}
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
    initTrackDataSetGroupKey(state,action){
      return {...state,...action.payload,loading:false}
    },
    updateProjectInfo(state,action){
      return {...state,projectInfo:action.payload}
    },
    setIsReApply(state,action){
      return {...state,isReApply:action.payload}
    },
    updateLastCommitData(state,action){
      return {...state,lastCommitData:action.payload}
    },
  },
}
