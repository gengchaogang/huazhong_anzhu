import lodash from 'lodash';
import { routerRedux } from 'dva/router'
import {
  isNull,
  creatHouseInfo,
  getJSONValue,
  checkJSON,
} from '../../../../commons/utils/currencyFunction'
import {
  renderTotalMoneyStr,
} from '../../../../commons/utils/publicFunction'
import {
  getCommitListFetch,
  getWaitProcessingListFetch,
  getWaitTransactionListFetch,
  rejectProcessingApplyFetch,
  acceptProcessingApplyFetch,
  unlockHouseFetch,
  getBaoChengJiao,
  commitData,
  getCommitAuditRecord,
  getIntentionRefundAuditRecord,
  getPayDownRefundAuditRecord,
  getCommissionRefundAuditRecord,
  getRelieveLoanAuditRecord,
  getLoanAuditRecord,
  getTransferAuditRecord,

  getIntentionRefundPreData,
  postIntentionRefundApplyFetch,
  revokeIntentionRefundApply,

  getPayDownRefundPreData,
  postPayDownRefundApplyFetch,
  revokePayDownRefundApply,

  getCommissionRefundPreData,
  postCommissionRefundApplyFetch,
  revokeCommissionRefundApply,

  revokeRelieveLoanRefundApply,
  revokeLoanRefundApply,
  revokeTransferRefundApply,
  revokeCommitApply,
}from '../../../services/tradeManagement/secondHouseSellTrade/secondHouseSellTrade'
import {
  getAuditorList,
}from '../../../services/userFetch'
const initState={
  activeTableData:[],//激活tab表格数据
  activeTableDataBao:[],//激活tab表格数据

  activeTabKey:'hasConfirmed',//激活的tab的key
  loading:false,
  searchKeyWord:'',
  tableLoading:true,//表格loading
  pagination:{//分页
    total:1,
    current:1,
  },
  promptObj:{//提示
    visible:false,
    title:'提示',
    todo:'default',
  },
  rejectProcessingModel:{//驳回模态框
    visible:false,
    rejectReson:'',
    rejectId:null,
  },
  revokeRefundModal:{//撤回申请模态框
    visible:false,
    transCode:null,
    confirmLoading:false,
    title:'',
    type:'default',
  },
  confirmModal:{//确认模态框
    title:null,
    visible:false,
    description:null,
    okText:null,
    cancelText:null,
  },
  stepModal:{//审核步骤模态框
    title:'',
    visible:false,
    confirmLoading:false,
    type:'default',
    stepList:[],//step数组
    width:1000,//模态框宽度
    stepStatus:'process',//当前进度状态
    current:0,//审核进度
    showDataInfo:null,//JSON
    inputValue:'',
    uploadPicList:[],
    selectList:[],
    selectValue:null,
    transCode:null,
    applyId:null,
  },
}

export default {
  namespace: 'secondHouseSellTrade',
  state: lodash.cloneDeep(initState),
  subscriptions: {
   setup({ dispatch, history }) {
     history.listen(location => {
       if (location.pathname === '/tradeManagement/secondHouseSellTrade'){
        //  dispatch({type:'initComponent'})
         setTimeout(()=>dispatch({
           type:'initComponent',
         }),0);
       }
    });
   },
  },
  effects:{
    //初始化组将状态
    *initComponent({payload},{put}){
      //初始化state
      yield put({type:'doInitState'});
      if(sessionStorage.getItem('sh_sell_trade_tab')){
        yield put({
          type:'updateTabskey',
          payload:sessionStorage.getItem('sh_sell_trade_tab'),
        })
      }
      //获取激活tab表格数据
      yield put({type:'getActiveTabTableData'});
    },
    //切换tab
    *changeTabKeys({payload},{call,put}){
      sessionStorage.setItem('sh_sell_trade_tab',payload);
      yield put({
        type:'updateTabskey',
        payload,
      })
      yield put({type:'getActiveTabTableData'})
    },
    //搜索设置keyValue
    *setSearchKeyWordValue({payload},{put}){
      yield put({
        type:'setSearchKeyWord',
        payload,
      })
      yield put({
        type:'getActiveTabTableData',
      })
    },
    //根据搜索值获取报成交table列表

    *getBaoChengJiao({payload},{put,call}){
      const {data}=yield call(getBaoChengJiao,payload);
  if(data.status!='error'){
      //    const tableDatass=data.data.content;
      data.data.data.key=1;
       data.data.data.operation='报成交'
    //  console.log()
      const arr= {
         key:1,
         ownerName: '123',
         ownerPhone:'333',
         brokerName:'2321',
         houseName:'3232',
         operation:'报成交',
       }
       const tableDatass=[];
       tableDatass.push(data.data.data)
       // const tableDatass= [
       //     {
       //       key:1,
       //       serialNumber: '123',
       //       brokerName:'333',
       //       communityName:'2321',
       //       propertyType:'3232'
       //     }
       //   ]
          yield put({
            type:'updateActiveTableDataByBao',
            payload:{
              activeTableDataBao:tableDatass,
              tableLoading:false,
            }
          })
        }
      },
          *commitData({payload},{put,call}){
            const {data}=yield call(commitData,payload);

            //    const tableDatass=data.data.content;
            const arr= {
               key:1,
               ownerName: '123',
               ownerPhone:'333',
               brokerName:'2321',
               houseName:'3232',
               operation:'报成交',
             }
             const tableDatass=[];
             tableDatass.push(arr)
             // const tableDatass= [
             //     {
             //       key:1,
             //       serialNumber: '123',
             //       brokerName:'333',
             //       communityName:'2321',
             //       propertyType:'3232'
             //     }
             //   ]
                yield put({
                  type:'updateActiveTableDataByBao',
                  payload:{
                    activeTableDataBao:tableDatass,
                    tableLoading:false,
                  }
                })},
    //获取当前tab下对应的表格数据
    *getActiveTabTableData({payload},{select,call,put}){
      const {activeTabKey,searchKeyWord}=yield select(({secondHouseSellTrade})=>secondHouseSellTrade);
      const agrObj={
        pageNo:0,
        keyWords:searchKeyWord,
      }
      //payload 之中传入keyword或分页信息
      if(!!payload && !!payload.pageNo){
        //传入了分页信息，先更新分页state
        agrObj.pageNo=payload.pageNo-1;
        yield put({
          type:'updatePageNo',
          payload:payload.pageNo,
        })
      }
      const {data}=yield call(getActiveTabTableDataFetch(activeTabKey),agrObj);
      if(!!data){
        if(data.status==='success'){
          const tableData=assembleTableDataByKey(activeTabKey,data.data.content);
          yield put({
            type:'updateActiveTableData',
            payload:{
              activeTableData:tableData,
              tableLoading:false,
              pagination:{
                total:data.data.totalElements,
                current:data.data.number+1,
              },
            }
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取表格数据失败',
              okText:'确定',
              todo:'default',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请求失败，请联系管理员',
            title:'获取表格数据失败',
            okText:'确定',
            todo:'default',
          },
        });
      }
    },
    //受理报成交申请
    *acceptProcessingApply({payload},{call,put}){
      const {data}=yield call(acceptProcessingApplyFetch,{transCode:payload});
      if(!!data){
        if(data.status==='success' && !!data.data){
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              title:'接收申请成功！',
              okText:'确定',
              todo:'init',
            },
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'接受申请失败！',
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
            title:'接受申请失败！',
            okText:'确定',
            todo:'default',
          },
        })
      }
    },
    //打开驳回报成交申请模态框
    *openRejectProcessingApply({payload},{call,put}){
      yield put({
        type:'initRejectProcessingApply',
        payload:{
          visible:true,
          rejectReson:'',
          rejectId:payload,
        }
      })
    },
    //执行驳回成交申请
    *doRejectProcessingApply({payload},{select,call,put}){
      const {rejectReson,rejectId}=yield select(({secondHouseSellTrade})=>secondHouseSellTrade.rejectProcessingModel);
      if(rejectReson.length===0 || rejectId===null){
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请确认所有信息填写完整！',
            title:'驳回申请失败！',
            okText:'确定',
            todo:'default',
          },
        })
      }else{
        const {data}=yield call(rejectProcessingApplyFetch,{
          reason:rejectReson,
          transCode:rejectId,
        });
        if(!!data){
          if(data.status==='success' && data.data){
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:'',
                title:'驳回申请成功！',
                okText:'确定',
                todo:'closeRejectProcessingApplyModal',
              },
            })
          }else{
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:data.message,
                title:'驳回申请失败！',
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
              title:'驳回申请失败！',
              okText:'确定',
              todo:'default',
            },
          })
        }
      }
    },
    //打开stepModal获取数据
    *getStepModalData({payload},{select,call,put}){
      // console.log('payload',payload);
      yield put({type:'setLoading',payload:true});
      if(!payload.isApply){
        const {data}=yield call(checkSHSellAuditorFetchByType(payload.type),{applyId:payload.applyId});
        if(!!data){
          if(data.status==='success'){
            yield put({
              type:'initStepsModalData',
              payload:creatRefundInfo(payload,data.data),
            });
          }else{
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:data.message,
                title:'获取审核信息失败！',
                okText:'确定',
                todo:'closeLoading',
              },
            })
          }
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'请求失败',
              title:'获取审核信息失败！',
              okText:'确定',
              todo:'closeLoading',
            },
          })
        }
      }else{
        const {data}=yield call(getRefundApplyPreData(payload),{transCode:payload.transCode});
        if(!!data){
          if(data.status==='success'){
            const response=yield call(getAuditorList,{name:getAuditorAuthorityName(payload)});
            if(!!response.data){
              if(response.data.status==='success'){
                const auditorList=response.data.data.map(item=>({
                  name:item.name,
                  id:`${item.userId}`,
                }));
                yield put({
                  type:'initStepsModalData',
                  payload:setRefundApplyPreData(payload,data.data,auditorList),
                });
              }else{
                yield put({
                  type: 'switchPrompt',
                  payload:{
                    visible:true,
                    description:response.data.message,
                    title:'获取审核人员列表失败！',
                    okText:'确定',
                    todo:'closeStepModal',
                  },
                })
              }
            }else{
              yield put({
                type: 'switchPrompt',
                payload:{
                  visible:true,
                  description:'请求失败',
                  title:'获取审核人员列表失败！',
                  okText:'确定',
                  todo:'closeStepModal',
                },
              })
            }
          }else{
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:data.message,
                title:'获取申请信息失败！',
                okText:'确定',
                todo:'closeLoading',
              },
            })
          }
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'请求失败',
              title:'获取申请信息失败！',
              okText:'确定',
              todo:'closeLoading',
            },
          })
        }
      }
    },
    //获取审核人员列表
    *getAuditorListData({payload},{select,call,put}){
      const{data}=yield call(getAuditorList,{name:getAuditorAuthorityName(payload)});
      if(!!data){
        if(data.status==='success'){
          const auditorList=data.data.map(item=>({
            name:item.name,
            id:`${item.userId}`,
          }));
          yield put({
            type:'initStepsAuditingModalStateAuditingManList',
            payload:auditorList,
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取审核人员列表失败！',
              okText:'确定',
              todo:'closeStepModal',
            },
          })
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请求失败',
            title:'获取审核人员列表失败！',
            okText:'确定',
            todo:'closeStepModal',
          },
        })
      }
    },
    //【意向金退款】发起申请
    *postIntensRefundApplyData({payload},{select,call,put}){
      yield put({
        type:'setStepModalLoading',
        payload:true,
      })
      const {data}=yield call(postIntentionRefundApplyFetch,{
        images:payload.images,
        ownerName:isNull(payload.ownerName,''),
        ownerPhone:isNull(payload.ownerPhone,''),
        ownercardNumber:isNull(payload.ownerBankCard,''),
        ownerBank:isNull(payload.ownerBank,''),
        ownerSubbranch:isNull(payload.ownerSubbranch,''),
        ownerIDNumber:isNull(payload.ownerIDNumber,''),
        ownerBankProvince:isNull(payload.ownerBankProvinceCity,['',''])[0],
        ownerBankCity:isNull(payload.ownerBankProvinceCity,['',''])[1],
        refundReason:isNull(payload.reason,''),
        intentionReturnedToOwner:isNull(payload.returnedToOwner,false),
        toUserId:isNull(payload.auditor,''),
        toUserName:isNull(payload.auditorName,''),
        transCode:isNull(payload.transCode,''),
      });
      if(!!data){
        if(data.status==='success' && !!data.data){
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'',
              title:'意向金退款申请成功！',
              okText:'确定',
              todo:'closeAllModal',
            },
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'意向金退款申请失败！',
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
            description:'请求失败！',
            title:'意向金退款申请失败！',
            okText:'确定',
            todo:'default',
          },
        })
      }
    },
    //【首付款退款】发起申请
    *postPayDownRefundApplyData({payload},{select,call,put}){
      const {data}=yield call(postPayDownRefundApplyFetch,{
        images:payload.images,
        ownerName:isNull(payload.ownerName,''),
        ownerPhone:isNull(payload.ownerPhone,''),
        ownercardNumber:isNull(payload.ownerBankCard,''),
        ownerBank:isNull(payload.ownerBank,''),
        ownerSubbranch:isNull(payload.ownerSubbranch,''),
        ownerIDNumber:isNull(payload.ownerIDNumber,''),
        ownerBankProvince:isNull(payload.ownerBankProvinceCity,['',''])[0],
        ownerBankCity:isNull(payload.ownerBankProvinceCity,['',''])[1],
        refundReason:isNull(payload.reason,''),
        firstpaymentReturnedToOwner:isNull(payload.returnedToOwner,false),
        toUserId:isNull(payload.auditor,''),
        toUserName:isNull(payload.auditorName,''),
        transCode:isNull(payload.transCode,''),
      });
      if(!!data){
        if(data.status==='success' && !!data.data){
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'',
              title:'首付款退款申请成功！',
              okText:'确定',
              todo:'closeAllModal',
            },
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'首付款退款申请失败！',
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
            description:'请求失败！',
            title:'首付款退款申请失败！',
            okText:'确定',
            todo:'default',
          },
        })
      }
    },
    //【佣金退款】发起申请
    *postCommissionRefundApplyData({payload},{select,call,put}){
      const {data}=yield call(postCommissionRefundApplyFetch,{
        images:payload.images,
        ownerName:isNull(payload.ownerName,''),
        ownerPhone:isNull(payload.ownerPhone,''),
        ownercardNumber:isNull(payload.ownerBankCard,''),
        ownerBank:isNull(payload.ownerBank,''),
        ownerSubbranch:isNull(payload.ownerSubbranch,''),
        ownerIDNumber:isNull(payload.ownerIDNumber,''),
        ownerBankProvince:isNull(payload.ownerBankProvinceCity,['',''])[0],
        ownerBankCity:isNull(payload.ownerBankProvinceCity,['',''])[1],
        refundReason:isNull(payload.reason,''),
        returnedToOwner:isNull(payload.returnedToOwner,false),
        toUserId:isNull(payload.auditor,''),
        toUserName:isNull(payload.auditorName,''),
        transCode:isNull(payload.transCode,''),
      });
      if(!!data){
        if(data.status==='success' && !!data.data){
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'',
              title:'佣金退款申请成功！',
              okText:'确定',
              todo:'closeAllModal',
            },
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'佣金退款申请失败！',
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
            description:'请求失败！',
            title:'佣金退款申请失败！',
            okText:'确定',
            todo:'default',
          },
        })
      }
    },
    //【退款】撤回申请
    *revokeRefundApply({payload},{call,put}){
      yield put({
        type:'openRevokeRefundModal',
        payload:creatRevokeRefundModalState(payload),
      })
    },
    //【发起撤回退款申请】
    *postRevokeRefundData({payload},{call,put}){
      yield put({
        type:'setRevokeRefundModalLoading',
        payload:true,
      })
      const {transCode,images,type,cancelReason}=payload;
      const {data}=yield call(checkRevokeRefundFetch(type),{
        cancelReason,
        images,
        transCode,
      });
      if(!!data){
        if(data.status==='success' && !!data.data){
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'',
              title:'撤回退款申请成功！',
              okText:'确定',
              todo:'closeAllModal',
            },
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'撤回退款申请失败！',
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
            description:'',
            title:'撤回退款申请失败！',
            okText:'确定',
            todo:'default',
          },
        })
      }
    },
    //【关闭交易】打开确认
    *closeTrade({payload},{call,put}){
      if(!!payload){
        yield put({
          type: 'openComfirmModal',
          payload:{
            visible:true,
            description:'关闭当前交易，系统将自动释放该房源，是否继续？',
            title:'关闭交易',
            okText:'继续',
            cancelText:'取消',
            transCode:payload,
            todo:'confirmCloseTrade',
          },
        })
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'无效transCode',
            title:'申请解锁房源失败！',
            okText:'确定',
            todo:'default',
          },
        })
      }
    },
    //【关闭交易】打开确认
    *baoChengJiao({payload},{call,put}){
      if(!!payload){
        yield put({
          type: 'openComfirmModal',
          payload:{
            visible:true,
            description:'是否要报成交？',
            title:'报成交',
            okText:'继续',
            cancelText:'取消',
            transCode:payload,
            todo:'baoChengJiao',
          },
        })
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'无效transCode',
            title:'失败！',
            okText:'确定',
            todo:'default',
          },
        })
      }
    },
    *sendBaoChengJiao({payload},{call,put,select}){
      yield put({
        type:'closeComfirmModal'
      })
      const {data}=yield call(commitData,payload);
      let num=true;
      if(data.status=='error'){num=true}else{num=false}

      yield put({
        type: 'switchPrompt',
        payload:{
          visible:true,
          description:`${isNull(num,false)?'此房屋已经被其他客户报成交！':'报成交成功'}`,
          title:'提示',
          okText:'确定',
          todo:'default',
        },
      })
        yield put({
          type:'changeTabKeys',
          payload:'hasConfirmed',
        })


        yield put({
          type:'updateActiveTableDataByBao',
          payload:{
            activeTableDataBao:[],
            tableLoading:false,
          }
        })

    },
    //【解锁房源】执行解锁房源
    *postCloseTradeApply({payload},{call,put,select}){
      const {transCode,} = yield select(({secondHouseSellTrade})=>secondHouseSellTrade.confirmModal);
      yield put({
        type:'closeComfirmModal'
      })
      const {data}=yield call(unlockHouseFetch,{transCode:payload});
      if(!!data && data.status==='success'){
        if(isNull(data.data.unlockSuccess,false)){
          //执行关闭交易成功
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:'',
              title:'关闭交易成功！',
              okText:'确定',
              todo:'init',
            },
          })
        }else{
          if(isNull(data.data.hasIntention,false) || isNull(data.data.hasFirstpayment,false)){
            yield put({
              type: 'switchPrompt',
              payload:{
                visible:true,
                description:`您好，由于客户已缴纳${isNull(data.data.hasIntention,false)?'“意向金”':''}${isNull(data.data.hasFirstpayment,false)?'“首付款”':''}${isNull(data.data.hasCommission,false)?'“居间服务费”':''}导致该交易无法关闭，若要强制关闭交易，请妥善处理以上交易资金去向后再关闭当前交易。`,
                title:'关闭交易失败！',
                okText:'知道了',
                todo:'default',
              },
            })
          }else{
            if(isNull(data.data.hasCommission,false)){
              yield put({
                type: 'openComfirmModal',
                payload:{
                  visible:true,
                  description:'您好，由于该交易客户已缴纳“居间服务费”导致该交易无法关闭，若要强制关闭交易，请选择执行佣金退款申请或执行失败成交申请。',
                  title:'关闭交易',
                  okText:'执行佣金退款申请',
                  cancelText:'执行失败成交申请',
                  transCode,
                  todo:'confirmCommissionRefund',
                },
              })
            }
          }
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:isNull(data.message,'请求失败，请刷新重试'),
            title:'申请解锁房源失败！',
            okText:'确定',
            todo:'default',
          },
        })
      }

    },
    /*************确认模态框相关*****************/
    //【取消判断】
    *cancelComfirmModal({payload},{select,put}){
      const {todo,transCode} = yield select(({secondHouseSellTrade})=>secondHouseSellTrade.confirmModal);
      if(todo==='confirmCloseTrade'){//确认是否关闭交易
        yield put({
          type:'closeComfirmModal',
        })
      }
      else if(todo==='confirmCommissionRefund'){
        //执行失败成交申请
        yield put({
          type:'closeComfirmModal',
        })
        yield put(routerRedux.push({
          pathname:'/tradeManagement/secondHouseSellTrade/secondHouseSellCommitApply',
          state:{
            transCode,
            failCommit:true,
          }
        }))
      }
      else{//其他，无todo
        yield put({
          type:'closeComfirmModal',
        })
      }
    },
    //【确认判断】
    *onOkComfirmModal({payload},{select,put}){
      const {todo,transCode} = yield select(({secondHouseSellTrade})=>secondHouseSellTrade.confirmModal);
      if(todo==='confirmCloseTrade'){//确认是否关闭交易
        yield put({
          type:'postCloseTradeApply',
          payload:transCode,
        })
      }else if(todo==='baoChengJiao'){
        yield put({
          type:'sendBaoChengJiao',
          payload:transCode,
        })
        //console.log(123)
      }

      else if(todo==='confirmCommissionRefund'){
        //执行佣金退款申请
        yield put({
          type:'closeComfirmModal',
        })
        yield put(routerRedux.push({
          pathname:'/tradeManagement/secondHouseSellTrade/shSellCommissionRefundApply',
          state:{
            transCode,
          }
        }))
      }
      else{//其他，无todo
        yield put({
          type:'closeComfirmModal',
        })
      }
    },
    //提示模态框行为判断
    *closePrompt({payload},{select,call,put}){
      const{todo}=yield select(({secondHouseSellTrade})=>secondHouseSellTrade.promptObj);
      switch (todo) {
        case 'default':
          yield put({
            type:'onlyClosePrompt'
          });
          break;
        case 'closeLoading':
          yield put({
            type:'onlyClosePrompt'
          });
          yield put({
            type:'setLoading',
            payload:false,
          });
          break;
        case 'init':
          yield put({
            type:'onlyClosePrompt'
          });
          yield put({
            type:'getActiveTabTableData'
          });
          break;
        case 'closeStepModal':
          yield put({
            type:'onlyClosePrompt'
          });
          yield put({
            type:'closeStepsAuditingModal'
          });
          break;
        case 'closeStepRevokeModal':
          yield put({
            type:'onlyClosePrompt'
          });
          yield put({
            type:'closeStepsRevokeAuditingModal'
          });
          yield put({
            type:'getActiveTabTableData'
          });
          break;
        // case 'confirmUnlockHouse':
        //   yield put({
        //     type:'onlyClosePrompt'
        //   });
        //   yield put({
        //     type:'doUnlockHouse',
        //     payload:transCode,
        //   });
        //   break;
        case 'closeRejectProcessingApplyModal':
          yield put({
            type:'onlyClosePrompt'
          });
          yield put({
            type:'closeRejectProcessingApply'
          });
          yield put({
            type:'getActiveTabTableData'
          });
          break;
        case 'closeAllModal':
          yield put({
            type:'onlyClosePrompt'
          });
          yield put({
            type:'closeAllModal'
          });
          yield put({
            type:'getActiveTabTableData'
          });
          break;
        default:
          yield put({
            type:'onlyClosePrompt'
          });
          break;
      }
    },
  },
  reducers: {
    //初始化state
    doInitState(state,action){
      return lodash.cloneDeep(initState);
    },
    setSearchKeyWord(state,action){
      return {...state,searchKeyWord:action.payload}
    },
    //关闭所有modal
    closeAllModal(state,action){
      return {
        ...state,
        rejectProcessingModel:lodash.cloneDeep(initState).rejectProcessingModel,
        revokeRefundModal:lodash.cloneDeep(initState).revokeRefundModal,
        stepModal:lodash.cloneDeep(initState).stepModal,
      }
    },
    //更新分页state
    updatePageNo(state,action){
      return {...state,pagination:{...state.pagination,...action.payload}}
    },
    //切换提示模态框state
    switchPrompt(state,action){
      return{...state,promptObj:{...state.promptObj,...action.payload}}
    },
    //关闭提示模态框
    onlyClosePrompt(state,action){
      return {...state,promptObj:lodash.cloneDeep(initState).promptObj}
    },
    //更新激活表格数据
    updateActiveTableData(state,action){
      return {...state,...action.payload}
    },
    updateActiveTableDataByBao(state,action){
      return {...state,...action.payload}
    },
    //打开成交申请模态框初始id
    initRejectProcessingApply(state,action){
      return {...state,rejectProcessingModel:{...action.payload}}
    },
    //修改成交驳回模态框驳回原因
    changeRejectProcessingReson(state,action){
      if(action.payload.length>=51){
        return state;
      }else{
        return {...state,rejectProcessingModel:{...state.rejectProcessingModel,rejectReson:action.payload}}
      }
    },
    //关闭成交驳回模态框
    closeRejectProcessingApply(state,action){
      return {...state,rejectProcessingModel:lodash.cloneDeep(initState).rejectProcessingModel}
    },
    //切换tabs设置表格loading
    updateTabskey(state,action){
      return {...state,activeTabKey:action.payload,tableLoading:true}
    },
    //更新步骤模态框
    initStepsModalData(state,action){
      return {...state,stepModal:{...lodash.cloneDeep(initState).stepModal,...action.payload}}
    },
    //设置loading
    setLoading(state,action){
      return {...state,loading:action.payload}
    },
    //【审核步骤模态框】关闭审核步骤模态框
    closeStepsAuditingModal(state,action){
      return {...state,stepModal:lodash.cloneDeep(initState).stepModal}
    },
    //关闭审核步骤\撤回申请模态框
    closeStepsRevokeAuditingModal(state,action){
      return {...state,stepModal:{...lodash.cloneDeep(initState).stepModal,uploadPicList:[],},revokeRefundModal:initState.revokeRefundModal}
    },
    //【审核步骤模态框】更新上传图片数组
    changeStepModalUploadPicList(state,action){
      return {...state,stepModal:{...state.stepModal,uploadPicList:action.payload}}
    },
    //【撤回申请模态框】切换loading
    setStepModalLoading(state,action){
      return {...state,stepModal:{...state.stepModal,confirmLoading:action.payload}}
    },
    //【审核步骤模态框】更新input输入值
    changeStepModalInputValue(state,action){
      if(action.payload.length<=20){
        return {...state,stepModal:{...state.stepModal,inputValue:action.payload}}
      }else{
        return state
      }
    },
    //【审核步骤模态框】初始化审核人员列表数据
    initStepsAuditingModalStateAuditingManList(state,action){
      return {...state,stepModal:{...state.stepModal,selectList:action.payload}}
    },
    //【审核步骤模态框】审核模态框select变化
    initStepsAuditingModalStateSelectChange(state,action){
      return {...state,stepModal:{...state.stepModal,selectValue:action.payload}}
    },
    //【撤回申请模态框】打开模态框
    openRevokeRefundModal(state,action){
      return {...state,revokeRefundModal:{...action.payload,confirmLoading:false}}
    },
    //【撤回申请模态框】关闭模态框
    closeRevokeRefund(state,action){
      return {...state,revokeRefundModal:lodash.cloneDeep(initState).revokeRefundModal}
    },
    //【撤回申请模态框】切换loading
    setRevokeRefundModalLoading(state,action){
      return {...state,revokeRefundModal:{...state.revokeRefundModal,confirmLoading:action.payload}}
    },
    //【确认模态框】关闭
    closeComfirmModal(state,action){
      return {...state,confirmModal:{...state.confirmModal,visible:false}}
    },
    //【确认模态框】关闭后回调
    afterCloseComfirmModal(state,action){
      return {...state,confirmModal:lodash.cloneDeep(initState).confirmModal}
    },
    //【确认模态框】打开模态框
    openComfirmModal(state,action){
      return {...state,confirmModal:{...state.confirmModal,...action.payload}}
    },

  },
}
//已经activeKey分类请求表格数据
function getActiveTabTableDataFetch(activeKey){
  switch (activeKey) {
    case 'handle':
      return getWaitProcessingListFetch;
    case 'hasConfirmed':
      return getWaitTransactionListFetch;
    case 'hasTraded':
      return getCommitListFetch;
    default:
      return getWaitProcessingListFetch;
  }
}
function assembleTableDataByBaoChengJiao(datas){
  return datas.map((item,index)=>({
    serialNumber:isNull(item.id,index+1),
    transCode:isNull(item.transCode,`item_${index}`),
    brokerName:isNull(item.brokerName,'-'),
    brokerPhone:isNull(item.brokerPhone,'-'),
    communityName:isNull(item.communityName,'-'),
    propertyType:isNull(item.propertyType,'-'),
    orderTime:isNull(item.appointmentDatetime,'-'),
    resourcesInfo:creatHouseInfo(isNull(item.resourcesInfo,'-')),
    customerName:isNull(item.customerName,'-'),
    transactionMode:isNull(item.transactionMode,'-'),
    reportDateTime:isNull(item.reportDateTime,'-'),
    showStatus:isNull(item.reportStatus,'-'),
    rejectReason:isNull(item.rejectReason,'-'),
    hasClass:isNull(item.reportStatus,'')==='待处理',
  }));
}
//构造表格数据格式
function assembleTableDataByKey(activeKey,datas){
  let resourcesNumber=null;
  switch (activeKey) {
    case 'handle':
      return datas.map((item,index)=>({
        serialNumber:isNull(item.id,index+1),
        transCode:isNull(item.transCode,`item_${index}`),
        brokerName:isNull(item.brokerName,'-'),
        brokerPhone:isNull(item.brokerPhone,'-'),
        communityName:isNull(item.communityName,'-'),
        propertyType:isNull(item.propertyType,'-'),
        orderTime:isNull(item.appointmentDatetime,'-'),
        resourcesInfo:creatHouseInfo(isNull(item.resourcesInfo,'-')),
        customerName:isNull(item.customerName,'-'),
        transactionMode:isNull(item.transactionMode,'-'),
        reportDateTime:isNull(item.reportDateTime,'-'),
        showStatus:isNull(item.reportStatus,'-'),
        rejectReason:isNull(item.rejectReason,'-'),
        hasClass:isNull(item.reportStatus,'')==='待处理',
      }));
    // case 'hasConfirmed':
    //   return datas.map((item,index)=>{
    //     let testHoseInfo=null;
    //     try {
    //       testHoseInfo=JSON.parse(item.resourcesInfo);
    //     } catch (e) {
    //       console.log('testHoseInfo',testHoseInfo);
    //     } finally {
    //       console.log('testHoseInfo',testHoseInfo);
    //     }
    //     return {
    //     // serialNumber:item.aaa,
    //     transCode:isNull(item.transCode,`item_${index}`),
    //     brokerName:isNull(item.brokerName,`item_${index}`),
    //     brokerPhone:isNull(item.brokerPhone,''),
    //     communityName:isNull(item.communityName,''),
    //     propertyType:isNull(item.propertyType,''),
    //     resourcesInfo:creatHouseInfo(isNull(item.resourcesInfo,'')),
    //     customerName:isNull(item.customerName,''),
    //     transactionMode:isNull(item.transactionMode,''),
    //     reportDateTime:isNull(item.reportDateTime,''),
    //     handler:isNull(item.processingPeople,''),
    //     showStatus:isNull(item.reportStatus,''),
    //     reportStatus:isNull(item.reportStatus,''),
    //     transStatus:isNull(item.transStatus,''),
    //     applyId:!!checkJSON(item.processingDataJson)?checkJSON(item.processingDataJson).applyId:null,
    //     processingStatus:isNull(item.processingStatus,false),
    //     processingDateTime:isNull(item.processingDateTime,''),
    //     commissionComplete:isNull(item.commissionComplete,false),
    //     commitComplete:isNull(item.commitComplete,false),
    //     firstpaymentComplete:isNull(item.firstpaymentComplete,false),
    //     intentionComplete:isNull(item.intentionComplete,false),
    //     loanComplete:isNull(item.loanComplete,false),
    //     releaseComplete:isNull(item.releaseComplete,false),
    //     transferComplete:isNull(item.transferComplete,false),
    //     houseId:getJSONValue(item.resourcesInfo,'id'),
    //     brokerId:isNull(item.brokerId,null),
    //   }});
    case 'hasConfirmed':
      return datas.map((item,index)=>({
        serialNumber:isNull(item.id,index+1),
        transCode:isNull(item.transCode,`item_${index}`),
        brokerName:isNull(item.brokerName,`item_${index}`),
        brokerPhone:isNull(item.brokerPhone,''),
        communityName:isNull(item.communityName,''),
        propertyType:isNull(item.propertyType,''),
        resourcesInfo:creatHouseInfo(isNull(item.resourcesInfo,'')),
        customerName:isNull(item.customerName,''),
        transactionMode:isNull(item.transactionMode,''),
        reportDateTime:isNull(item.reportDateTime,''),
        handler:isNull(item.processingPeople,''),
        showStatus:isNull(item.reportStatus,''),
        reportStatus:isNull(item.reportStatus,''),
        transStatus:isNull(item.transStatus,''),
        applyId:!!checkJSON(item.processingDataJson)?checkJSON(item.processingDataJson).applyId:null,
        processingStatus:isNull(item.processingStatus,false),
        processingDateTime:isNull(item.processingDateTime,''),
        commissionComplete:isNull(item.commissionComplete,false),
        commitComplete:isNull(item.commitComplete,false),
        firstpaymentComplete:isNull(item.firstpaymentComplete,false),
        intentionComplete:isNull(item.intentionComplete,false),
        loanComplete:isNull(item.loanComplete,false),
        releaseComplete:isNull(item.releaseComplete,false),
        transferComplete:isNull(item.transferComplete,false),
        houseId:getJSONValue(item.resourcesInfo,'id'),
        brokerId:isNull(item.brokerId,null),
        isClosed:isNull(item.isClosed,false),
        commissionContractsUploaded:isNull(item.commissionContractsUploaded,false),
        firstpaymentContractsUploaded:isNull(item.firstpaymentContractsUploaded,false),
        intentionContractsUploaded:isNull(item.intentionContractsUploaded,false),
      }));
    case 'hasTraded':
      return datas.map((item,index)=>({
        serialNumber:isNull(item.id,index+1),
        transCode:isNull(item.transCode,`item_${index}`),
        brokerName:isNull(item.brokerName,`item_${index}`),
        communityName:isNull(item.communityName,''),
        propertyType:isNull(item.propertyType,''),
        resourcesInfo:creatHouseInfo(isNull(item.resourcesInfo,'')),
        customerName:isNull(item.customerName,''),
        applyId:!!checkJSON(item.processingDataJson)?checkJSON(item.processingDataJson).applyId:null,
        transactionMode:isNull(item.transactionMode,''),
        reportDateTime:isNull(item.reportDateTime,''),
        handler:isNull(item.processingPeople,''),
        showStatus:isNull(item.reportStatus,''),
        transStatus:isNull(item.transStatus,''),
        processingDateTime:isNull(item.processingDateTime,''),
        commissionComplete:isNull(item.commissionComplete,false),
        commitComplete:isNull(item.commitComplete,false),
        firstpaymentComplete:isNull(item.firstpaymentComplete,false),
        intentionComplete:isNull(item.intentionComplete,false),
        loanComplete:isNull(item.loanComplete,false),
        releaseComplete:isNull(item.releaseComplete,false),
        transferComplete:isNull(item.transferComplete,false),
        processingStatus:isNull(item.processingStatus,false),
        assigncommission:isNull(item.assigncommission,false),
        houseId:getJSONValue(item.resourcesInfo,'id'),
        brokerId:isNull(item.brokerId,null),
      }));
    default:
      return datas.map((item,index)=>({
        serialNumber:isNull(item.id,index+1),
        transCode:isNull(item.transCode,`item_${index}`),
        brokerName:isNull(item.brokerName,''),
        brokerPhone:isNull(item.brokerPhone,''),
        communityName:isNull(item.communityName,''),
        propertyType:isNull(item.propertyType,''),
        resourcesInfo:isNull(item.resourcesInfo,''),
        customerName:isNull(item.customerName,''),
        transactionMode:isNull(item.transactionMode,''),
        reportDateTime:isNull(item.reportDateTime,''),
        showStatus:isNull(item.reportStatus,''),
      }));
  }
}
//根据type选择对应的fetch
function checkSHSellAuditorFetchByType(type){
  if(type==='intention'){
    return getIntentionRefundAuditRecord;
  }else if(type==='loan'){
    return getLoanAuditRecord;
  }else if(type==='transfer'){
    return getTransferAuditRecord;
  }else if(type==='commit'){
    return getCommitAuditRecord;
  }else if(type==='relieveLoan'){
    return getRelieveLoanAuditRecord;
  }else if(type==='payDown'){
    return getPayDownRefundAuditRecord;
  }else if(type==='commission'){
    return getCommissionRefundAuditRecord;
  }
}
//待成交审核响应内容生成
function creatRefundInfo(payload,data){
  const {current,status}=payload;
  // console.log('payload',payload);
  if(payload.type==='payDown'){
    const {orderinfo,applyinfo,auditinfos}=data;
    const showData={
      orderInfo:{
        orderNumber:isNull(orderinfo.orderNumber,'-'),
        payWay:isNull(orderinfo.paymentMethod ,'-'),
        paySerialNumber:isNull(orderinfo.serialNumber,'-'),
        payTime:isNull(orderinfo.paymentDateTime,'-'),
        payCustomer:isNull(orderinfo.customerName,'-'),
        customerPhone:isNull(orderinfo.customerPhone,'-'),
        unitPrice:isNull(orderinfo.unitPrice,'-'),
        totalPrice:renderTotalMoneyStr(orderinfo.totalPrice,'-'),
        payDownRatio:isNull(orderinfo.payDownRatio,'无字段'),
        deductedIntention:isNull(orderinfo.deductedIntention,'无字段'),
        payAmount:isNull(orderinfo.amount,'-'),
        payStatus:isNull(orderinfo.paymentStatus,'-'),
        transCode:isNull(orderinfo.transCode,null),
      },
      applyInfo:{
        formData:[
          {
            label:'退款原因',
            value:isNull(applyinfo.refundReason,''),
          },{
            label:'收款方',
            value:isNull(applyinfo.returnedToOwner,false)?'业主':'顾客',
          }
        ],
        applyPics:isNull(applyinfo.images,[]).map((item,index)=>({
          title:'',
          src:item,
          id:`PicKey_${index}`
        })),
      },
      auditInfo:isNull(auditinfos,[]).map(item=>({
        date:isNull(item.auditDateTime,'--'),
        content:isNull(item.auditInfo,'--'),
        remarks:`描述：${isNull(item.reason,'--')}`,
        images:isNull(item.images,null),
      })),
    }
    if(!!applyinfo.returnedToOwner){
      showData.applyInfo.formData.push({
        label:'业主姓名',
        value:isNull(applyinfo.ownerName,'-'),
      })
      showData.applyInfo.formData.push({
        label:'业主电话',
        value:isNull(applyinfo.ownerPhone,'-'),
      })
      showData.applyInfo.formData.push({
        label:'业主身份证号',
        value:isNull(applyinfo.ownerIDNumber,'-'),
      })
      showData.applyInfo.formData.push({
        label:'业主银行卡号',
        value:isNull(applyinfo.ownercardNumber,'-'),
      })
    }
    const stepList=[
      {
        title:'申请退款',
      },{
        title:'退款审核',
      },{
        title:'财务审核',
      },{
        title:'执行退款',
      }
    ];
    if(status==='error')stepList[current].description='已驳回';
    const stepModal={
      title:'二手房——首付款退款申请',
      current,
      stepStatus:status,
      visible:true,
      type:'payDown',
      stepList,
      showDataInfo:JSON.stringify(showData),
      transCode:isNull(orderinfo.transCode,null),
    }
    return stepModal;
  }
  else if(payload.type==='intention'){
    const {orderinfo,applyinfo,auditinfos}=data;
    const showData={
      orderInfo:{
        orderNumber:isNull(orderinfo.orderNumber,'-'),
        payWay:isNull(orderinfo.paymentMethod ,'-'),
        paySerialNumber:isNull(orderinfo.serialNumber,'-'),
        payTime:isNull(orderinfo.paymentDateTime,'-'),
        payCustomer:isNull(orderinfo.customerName,'-'),
        customerPhone:isNull(orderinfo.customerPhone,'-'),
        unitPrice:isNull(orderinfo.unitPrice,'-'),
        totalPrice:renderTotalMoneyStr(orderinfo.totalPrice,'-'),
        intentionAmount:isNull(orderinfo.amount,'-'),
        payStatus:isNull(orderinfo.paymentStatus,'-'),
        transCode:isNull(orderinfo.transCode,null),
      },
      applyInfo:{
        formData:[
          {
            label:'退款原因',
            value:isNull(applyinfo.refundReason,''),
          },{
            label:'收款方',
            value:isNull(applyinfo.returnedToOwner,false)?'业主':'顾客',
          }
        ],
        applyPics:isNull(applyinfo.images,[]).map((item,index)=>({
          title:'',
          src:item,
          id:`PicKey_${index}`
        })),
      },
      auditInfo:isNull(auditinfos,[]).map(item=>({
        date:isNull(item.auditDateTime,'--'),
        content:isNull(item.auditInfo,'--'),
        remarks:`描述：${isNull(item.reason,'--')}`,
        images:isNull(item.images,null),
      })),
    }
    if(!!applyinfo.returnedToOwner){
      showData.applyInfo.formData.push({
        label:'业主姓名',
        value:isNull(applyinfo.ownerName,'-'),
      })
      showData.applyInfo.formData.push({
        label:'业主电话',
        value:isNull(applyinfo.ownerPhone,'-'),
      })
      showData.applyInfo.formData.push({
        label:'业主银行卡号',
        value:isNull(applyinfo.ownercardNumber,'-'),
      })
      showData.applyInfo.formData.push({
        label:'开户银行',
        value:isNull(applyinfo.ownerBank,'-'),
      })
      showData.applyInfo.formData.push({
        label:'开户支行',
        value:isNull(applyinfo.ownerSubbranch,'-'),
      })
      showData.applyInfo.formData.push({
        label:'开户行所属省市',
        value:`${isNull(applyinfo.ownerBankProvince,'-')}/${isNull(applyinfo.ownerBankCity,'-')}`,
      })
    }
    const stepList=[
      {
        title:'申请退款',
      },{
        title:'退款审核',
      },{
        title:'财务审核',
      },{
        title:'执行退款',
      }
    ];
    if(status==='error')stepList[current].description='已驳回';
    const stepModal={
      title:'二手房——意向金退款申请',
      current,
      stepStatus:status,
      visible:true,
      type:'intention',
      stepList,
      showDataInfo:JSON.stringify(showData),
      transCode:isNull(orderinfo.transCode,null),
    }
    return stepModal;
  }
  else if(payload.type==='loan'){
    const {applyinfo,auditinfos}=data;
    let houseInfo=null;
    try{
      houseInfo=JSON.parse(applyinfo.resourcesInfo).default;
    }catch(e){
      houseInfo=null;
    }
    const compeleInfo=[];
    if(!!applyinfo.firstPayMentPaid){
      compeleInfo.push('首付款已支付')
    }
    if(!!applyinfo.intentionPaid){
      compeleInfo.push('意向金已支付')
    }
    if(!!applyinfo.commissionPaid){
      compeleInfo.push('中介佣金已支付')
    }

    const showData={
      orderInfo:{
        propertyType:isNull(applyinfo.propertyType,'--'),
        communityName:isNull(applyinfo.communityName,'--'),
        houseInfo:isNull(houseInfo,'--'),
        resourceArea:isNull(applyinfo.resourceArea,'--'),
        totalPrice:renderTotalMoneyStr(applyinfo.totalPrice,'--'),
        resourceSupportLoan:isNull(applyinfo.resourceSupportLoan,'--'),
        applyTime:isNull(applyinfo.applyDateTime,'--'),
      },
      applyInfo:{
        compeleInfo,
        formData:[
          {
            label:'贷款客户',
            value:isNull(applyinfo.customerName,'--'),
          },{
            label:'贷款人联系电话',
            value:isNull(applyinfo.customerPhone,'--'),
          },{
            label:'贷款类型',
            value:isNull(applyinfo.loanType,'--'),
          },{
            label:'贷款比例',
            value:isNull(applyinfo.loanRate,'--'),
          },{
            label:'贷款金额',
            value:isNull(applyinfo.loanAmount,'--'),
          },{
            label:'贷款期限',
            value:isNull(applyinfo.loanTerm,'--'),
          }
        ],
        applyPics:isNull(applyinfo.images,[]).map((item,index)=>({
          title:'',
          src:item,
          id:`PicKey_${index}`
        })),
      },
      auditInfo:isNull(auditinfos,[]).map(item=>({
        date:isNull(item.auditDateTime,'--'),
        content:isNull(item.auditInfo,'--'),
        remarks:`描述：${isNull(item.reason,'--')}`,
        images:isNull(item.images,null),
      })),
    }
    const stepList=[
      {
        title:'申请贷款',
      },{
        title:'办理贷款',
      },{
        title:'已批款',
      }
    ];
    if(status==='error')stepList[current].description='已驳回';
    const stepModal={
      title:'二手房——贷款申请',
      current,
      stepStatus:status,
      visible:true,
      type:'loan',
      stepList,
      showDataInfo:JSON.stringify(showData),
      transCode:isNull(payload.transCode,null),
    }
    return stepModal;
  }
  else if(payload.type==='relieveLoan'){
    const {applyinfo,auditinfos}=data;
    let houseInfo=null;
    try{
      houseInfo=JSON.parse(applyinfo.resourcesInfo).default;
    }catch(e){
      houseInfo=null;
    }
    const showData={
      orderInfo:{
        propertyType:isNull(applyinfo.propertyType,'--'),
        communityName:isNull(applyinfo.communityName,'--'),
        houseInfo:isNull(houseInfo,'--'),
        resourceArea:isNull(applyinfo.resourceArea,'--'),
        totalPrice:isNull(applyinfo.totalPrice,'--'),
        resourceSupportLoan:isNull(applyinfo.resourceSupportLoan,'--'),
        applyTime:isNull(applyinfo.applyDateTime,'--'),
      },
      applyInfo:{
        formData:[
          {
            label:'解押金额',
            value:isNull(applyinfo.totalPrice,'--'),
          },{
            label:'业主姓名',
            value:isNull(applyinfo.customerName,'--'),
          },{
            label:'业主电话',
            value:isNull(applyinfo.customerPhone,'--'),
          },{
            label:'解押说明',
            value:isNull(applyinfo.reason,'无字段'),
          }
        ],
        applyPics:isNull(applyinfo.images,[]).map((item,index)=>({
          title:'',
          src:item,
          id:`PicKey_${index}`
        })),
      },
      auditInfo:isNull(auditinfos,[]).map(item=>({
        date:isNull(item.auditDateTime,'--'),
        content:isNull(item.auditInfo,'--'),
        remarks:`描述：${isNull(item.reason,'--')}`,
        images:isNull(item.images,null),
      })),
    }
    const stepList=[
      {
        title:'申请贷款',
      },{
        title:'办理贷款',
      },{
        title:'已批款',
      }
    ];
    if(status==='error')stepList[current].description='已驳回';
    const stepModal={
      title:'二手房——解押申请',
      current,
      stepStatus:status,
      visible:true,
      type:'relieveLoan',
      stepList,
      showDataInfo:JSON.stringify(showData),
      transCode:isNull(payload.transCode,null),
    }
    return stepModal;
  }
  else if(payload.type==='commission'){
    const {orderinfo,applyinfo,auditinfos}=data;
    const showData={
      orderInfo:{
        orderNumber:isNull(orderinfo.orderNumber,'-'),
        payWay:isNull(orderinfo.paymentMethod ,'-'),
        paySerialNumber:isNull(orderinfo.serialNumber,'-'),
        payTime:isNull(orderinfo.paymentDateTime,'-'),
        undertaker:isNull(orderinfo.undertaker,'无字段'),
        undertakerPhone:isNull(orderinfo.undertakerPhone,'无字段'),
        totalPrice:renderTotalMoneyStr(orderinfo.totalPrice,'-'),
        commissionRatio:isNull(orderinfo.commissionRatio,'无字段'),
        commissionAmount:isNull(orderinfo.amount,'-'),
        payStatus:isNull(orderinfo.paymentStatus,'-'),
        transCode:isNull(orderinfo.transCode,null),
      },
      applyInfo:{
        formData:[
          {
            label:'退款原因',
            value:isNull(applyinfo.refundReason,''),
          },{
            label:'收款方',
            value:isNull(applyinfo.returnedToOwner,false)?'业主':'顾客',
          }
        ],
        applyPics:isNull(applyinfo.images,[]).map((item,index)=>({
          title:'',
          src:item,
          id:`PicKey_${index}`
        })),
      },
      auditInfo:isNull(auditinfos,[]).map(item=>({
        date:isNull(item.auditDateTime,'--'),
        content:isNull(item.auditInfo,'--'),
        remarks:`描述：${isNull(item.reason,'--')}`,
        images:isNull(item.images,null),
      })),
    }
    if(!!applyinfo.returnedToOwner){
      showData.applyInfo.formData.push({
        label:'业主姓名',
        value:isNull(applyinfo.ownerName,'-'),
      })
      showData.applyInfo.formData.push({
        label:'业主电话',
        value:isNull(applyinfo.ownerPhone,'-'),
      })
      showData.applyInfo.formData.push({
        label:'业主身份证号',
        value:isNull(applyinfo.ownerIDNumber,'-'),
      })
      showData.applyInfo.formData.push({
        label:'业主银行卡号',
        value:isNull(applyinfo.ownercardNumber,'-'),
      })
    }
    const stepList=[
      {
        title:'申请退款',
      },{
        title:'退款审核',
      },{
        title:'财务审核',
      },{
        title:'执行退款',
      }
    ];
    if(status==='error')stepList[current].description='已驳回';
    const stepModal={
      title:'二手房——佣金退款申请',
      current,
      stepStatus:status,
      visible:true,
      type:'commission',
      stepList,
      showDataInfo:JSON.stringify(showData),
      transCode:isNull(orderinfo.transCode,null),
    }
    return stepModal;
  }
  else if(payload.type==='commit'){
    const {orderinfo,applyinfo,auditinfos}=data;
    const showData={
      orderInfo:{
        houseInfo:creatHouseInfo(applyinfo.resourcesInfo),
        propertyType:isNull(applyinfo.propertyType,'-'),
        resourceArea:isNull(applyinfo.resourceArea,'-'),
        unitPrice:isNull(applyinfo.unitPrice,'-'),
        totalPrice:renderTotalMoneyStr(applyinfo.totalPrice,'-'),
        commissionAmount:isNull(applyinfo.commissionAmount,'-'),
        ownBroker:isNull(applyinfo.brokerName,'-'),
        customerBroker:isNull(applyinfo.customerBrokerName,'-'),
        commitDate:isNull(applyinfo.applyDateTime,'-'),
        transCode:isNull(applyinfo.transCode,null),
      },
      applyInfo:{
        formData:[
          {
            label:'佣金总额',
            value:isNull(applyinfo.commissionAmount,'-'),
          },{
            label:'平台抽佣',
            value:isNull(applyinfo.platformCommissionRate,'-'),
          },{
            label:'剩余佣金总额',
            value:`${(1-Number(applyinfo.platformCommissionRate))*Number(applyinfo.commissionAmount)}`,
          },{
            label:'成交方式',
            value:isNull(applyinfo.transactionMode,''),
          }
        ],
        applyPics:isNull(applyinfo.images,[]).map((item,index)=>({
          title:'',
          src:item,
          id:`PicKey_${index}`
        })),
      },
      auditInfo:isNull(auditinfos,[]).map(item=>({
        date:isNull(item.auditDateTime,'--'),
        content:isNull(item.auditInfo,'--'),
        remarks:`描述：${isNull(item.reason,'--')}`,
        images:isNull(item.images,null),
      })),
    }
    if(applyinfo.transactionMode==='合作成交'){
      showData.applyInfo.formData.push({
        label:'业主经纪人佣金比例',
        value:isNull(applyinfo.brokerCommissionRate,'-'),
      })
      showData.applyInfo.formData.push({
        label:'业主经纪人佣金金额',
        value:isNull(applyinfo.brokerCommissionAmount,'-'),
      })
      showData.applyInfo.formData.push({
        label:'买方经纪人佣金比例',
        value:isNull(applyinfo.customerBrokerCommissionRate,'-'),
      })
      showData.applyInfo.formData.push({
        label:'买方经纪人佣金金额',
        value:isNull(applyinfo.customerBrokerCommissionAmount,'-'),
      })
    }else{
      showData.applyInfo.formData.push({
        label:'经纪人佣金比例',
        value:isNull(applyinfo.brokerCommissionRate,'-'),
      })
      showData.applyInfo.formData.push({
        label:'经纪人佣金金额',
        value:isNull(applyinfo.brokerCommissionAmount,'-'),
      })
    }
    const stepList=[
      {
        title:'申请成交',
      },{
        title:'成交审核',
      },{
        title:'财务审核',
      },{
        title:'分佣',
      }
    ];
    if(status==='error')stepList[current].description='已驳回';
    const stepModal={
      title:'二手房——成交申请',
      current,
      stepStatus:status,
      visible:true,
      type:'commit',
      stepList,
      showDataInfo:JSON.stringify(showData),
      transCode:isNull(payload.transCode,null),
    }
    return stepModal;
  }
  else if(payload.type==='transfer'){
    const {applyinfo,auditinfos}=data;
    const compeleInfo=[];
    if(!!applyinfo.firstPayMentPaid){
      compeleInfo.push('首付款已支付')
    }
    if(!!applyinfo.intentionPaid){
      compeleInfo.push('意向金已支付')
    }
    if(!!applyinfo.commissionPaid){
      compeleInfo.push('中介佣金已支付')
    }
    if(!!applyinfo.loanApproved){
      compeleInfo.push('购房贷款')
    }
    const customerInfo=[];
    if(!!applyinfo.hasCustomerHouseholdRegister){
      customerInfo.push('户口本')
    }
    if(!!applyinfo.hasCustomerIDCard){
      customerInfo.push('身份证')
    }
    if(!!applyinfo.hasCustomerMarriageCertificate){
      customerInfo.push('结婚证')
    }
    const ownInfo=[];
    if(!!applyinfo.hasOwnerIDCard){
      ownInfo.push('身份证')
    }
    if(!!applyinfo.hasOwnerPropertyCertificate){
      ownInfo.push('房产证')
    }
    const showData={
      orderInfo:{
        houseCode:isNull(applyinfo.communityName,'-'),
        communityName:isNull(applyinfo.communityName,'-'),
        houseInfo:creatHouseInfo(applyinfo.resourcesInfo),
        resourceArea:isNull(applyinfo.resourceArea,'-'),
        traitName:isNull(applyinfo.traitName,'-'),
        unitPrice:isNull(applyinfo.unitPrice,'-'),
        totalPrice:renderTotalMoneyStr(applyinfo.totalPrice,'-'),
        resourceSupportLoan:isNull(applyinfo.resourceSupportLoan,false),
        transCode:isNull(payload.transCode,null),
      },
      applyInfo:{
        compeleInfo,
        customerInfo,
        ownInfo,
        customerFormData:[
          {
            label:'购房者姓名',
            value:isNull(applyinfo.customerName,''),
          },{
            label:'购房者电话',
            value:isNull(applyinfo.customerPhone,''),
          }
        ],
        ownFormData:[
          {
            label:'业主姓名',
            value:isNull(applyinfo.ownerName,'-'),
          },{
            label:'业主电话',
            value:isNull(applyinfo.ownerPhone,'-'),
          }
        ],
        applyPics:isNull(applyinfo.images,[]).map((item,index)=>({
          title:'',
          src:item,
          id:`PicKey_${index}`
        })),
      },
      auditInfo:isNull(auditinfos,[]).map(item=>({
        date:isNull(item.auditDateTime,'--'),
        content:isNull(item.auditInfo,'--'),
        remarks:`描述：${isNull(item.reason,'--')}`,
        images:isNull(item.images,null),
      })),
    }
    const stepList=[
      {
        title:'申请过户',
      },{
        title:'办理过户',
      },{
        title:'已过户',
      }
    ];
    if(status==='error')stepList[current].description='已驳回';
    const stepModal={
      title:'二手房——过户申请',
      current,
      stepStatus:status,
      visible:true,
      type:'transfer',
      stepList,
      showDataInfo:JSON.stringify(showData),
      transCode:isNull(payload.transCode,null),
    }
    return stepModal;
  }
}
//判断退款申请类型，返回请求fetch
function getRefundApplyPreData(payload){
  if(payload.type==='intention'){
    return getIntentionRefundPreData;
  }else if(payload.type==='payDown'){
    return getPayDownRefundPreData;
  }else if(payload.type==='commission'){
    return getCommissionRefundPreData;
  }
}
//退款申请响应数据依据类型组装数据 渲染
function setRefundApplyPreData(payload,data,auditorList){
  // console.log('payload',payload);
  // console.log('data',data);
  if(payload.type==='intention'){
    const showData={
      orderInfo:{
        orderNumber:isNull(data.orderNumber,'-'),
        payWay:isNull(data.paymentMethod ,'-'),
        paySerialNumber:isNull(data.serialNumber,'-'),
        payTime:isNull(data.paymentDateTime,'-'),
        payCustomer:isNull(data.customerName,'-'),
        customerPhone:isNull(data.customerPhone,'-'),
        unitPrice:isNull(data.intentions.unitPrice,'-'),
        totalPrice:renderTotalMoneyStr(data.intentions.totalPrice,'-'),
        intentionAmount:isNull(data.intentions.intentionAmount,'-'),
        payStatus:isNull(data.paymentStatus,'-'),
        transCode:isNull(data.intentions.transCode,null),
      },
    }
    const stepModal={
      title:'二手房——意向金退款申请',
      visible:true,
      type:'intentionApply',
      showDataInfo:JSON.stringify(showData),
      transCode:isNull(data.intentions.transCode,null),
      auditorList,
    }
    return stepModal;
  }
  else if(payload.type==='payDown'){
    const showData={
      orderInfo:{
        orderNumber:isNull(data.orderNumber,'-'),
        payWay:isNull(data.paymentMethod ,'-'),
        paySerialNumber:isNull(data.serialNumber,'-'),
        payTime:isNull(data.paymentDateTime,'-'),
        payCustomer:isNull(data.customerName,'-'),
        customerPhone:isNull(data.customerPhone,'-'),
        unitPrice:isNull(data.firstpayment.unitPrice,'-'),
        totalPrice:renderTotalMoneyStr(data.firstpayment.totalPrice,'-'),
        payDownRatio:isNull(data.firstpayment.firstpaymentRatio,'-'),
        deductedIntention:isNull(data.firstpayment.isDeductedIntention,false)?isNull(data.firstpayment.intentionAmount,'-'):'-',
        payAmount:isNull(data.firstpayment.firstpaymentAmount,'-'),
        payStatus:isNull(data.paymentStatus,'-'),
        transCode:isNull(data.firstpayment.transCode,null),
      },
    }
    const stepModal={
      title:'二手房——首付款退款申请',
      visible:true,
      type:'payDownApply',
      showDataInfo:JSON.stringify(showData),
      transCode:isNull(data.firstpayment.transCode,null),
      auditorList,
    }
    return stepModal;
  }
  else if(payload.type==='commission'){
    const showData={
      orderInfo:{
        orderNumber:isNull(data.orderNumber,'-'),
        payWay:isNull(data.paymentMethod ,'-'),
        paySerialNumber:isNull(data.serialNumber,'-'),
        payTime:isNull(data.paymentDateTime,'-'),
        undertaker:isNull(data.commission.undertaker,'-'),
        undertakerPhone:isNull(data.commission.undertakerPhone,'无字段'),
        totalPrice:renderTotalMoneyStr(data.commission.totalPrice,'-'),
        commissionRatio:isNull(data.commission.commissionRate,'-'),
        commissionAmount:isNull(data.commission.commissionAmount,'-'),
        payStatus:isNull(data.paymentStatus,'-'),
        transCode:isNull(data.commission.transCode,null),
      },
    }
    const stepModal={
      title:'二手房——佣金退款申请',
      visible:true,
      type:'commissionApply',
      showDataInfo:JSON.stringify(showData),
      transCode:isNull(data.commission.transCode,null),
      auditorList,
    }
    return stepModal;
  }
}
//获取审核人员对应权限
function getAuditorAuthorityName(payload){
  switch (payload.type) {
    case 'intention':
      return '二手房退款合同审核'
    case 'payDown':
      return '二手房退款合同审核'
    case 'commission':
      return '二手房退款合同审核'
    default:
      return '';
  }
}
//生成撤回退款申请模态框数据
function creatRevokeRefundModalState({type,transCode}){
  if(type==='intention'){
    return{
      visible:true,
      title:'撤回意向金退款申请',
      type,
      transCode,
    }
  }
  else if(type==='loan'){
    return{
      visible:true,
      title:'撤回贷款申请',
      type,
      transCode,
    }
  }
  else if(type==='payDown'){
    return{
      visible:true,
      title:'撤回首付款退款申请',
      type,
      transCode,
    }
  }
  else if(type==='relieveLoan'){
    return{
      visible:true,
      title:'撤回解押申请',
      type,
      transCode,
    }
  }
  else if(type==='commission'){
    return{
      visible:true,
      title:'撤回佣金退款申请',
      type,
      transCode,
    }
  }
  else if(type==='transfer'){
    return{
      visible:true,
      title:'撤回过户申请',
      type,
      transCode,
    }
  }
  else if(type==='commit'){
    return{
      visible:true,
      title:'撤回成交申请',
      type,
      transCode,
    }
  }
}
//选择撤回退款申请fetch
function checkRevokeRefundFetch(type){
  if(type==='intention'){
    return revokeIntentionRefundApply;
  }
  else if(type==='payDown'){
    return revokePayDownRefundApply;
  }
  else if(type==='commission'){
    return revokeCommissionRefundApply;
  }
  else if(type==='relieveLoan'){
    return revokeRelieveLoanRefundApply;
  }
  else if(type==='loan'){
    return revokeLoanRefundApply;
  }
  else if(type==='transfer'){
    return revokeTransferRefundApply;
  }
  else if(type==='commit'){
    return revokeCommitApply;
  }
}
