import React from 'react'
import {connect} from 'dva'
// import moment from 'moment';
import {Table,Button,Tabs} from 'antd';
import './ProjectManagement.css'
import SearchInput from '../../../commons/View/SearchInput'
import DealCenterOffLineModal from '../../components/newHouseOnline/projectManagement/DealCenterOffLineModal'
import NewHouseDetailsModal from '../../components/newHouseOnline/projectManagement/NewHouseDetailsModal'
import NewHousePulishDetailsModal from '../../components/newHouseOnline/projectManagement/NewHousePulishDetailsModal'
import PromptModal from '../../../commons/View/PromptModal'
import DxConfirmModal from '../../../commons/components/DxConfirmModal'
import ReleaseAudit from './createNewProject/ReleaseAudit'
const TabPane = Tabs.TabPane;
import { routerRedux ,Link} from 'dva/router'
function ProjectManagement({dispatch,projectManagement}){
  const {
    employees,
    showReleasePicList,
    releaseAuditVisible,
    releaseAuditData,
    totalElements,
    projectId,
    tableLoading,
    saleItems,
    audit,
    currentRecord,
    saleItemsTableData,
    offLineTableData,
    auditTableData,
    eidtTableData,
    visible,
    showPicList,
    offLineDate,
    promptObj,
    currentPage,
    reEditModal,
    currentKey,
    pagination,
    confirmModal,
    activeTabelData,
  }=projectManagement;
  const placeholdershow=(key)=>{
    let _key='';
    if(key=='saleItems'){
      _key='请在此输入筛选关键字进行搜索，支持项目名称，所在区域，创建人'
      return _key
    }else if(key=='audit'){
      _key='请在此输入筛选关键字进行搜索，支持项目名称，所在区域，审核人，创建人'
      return _key
    }else if(key=='underFrameProject'){
      _key='请在此输入筛选关键字进行搜索，支持项目名称，所在区域，创建人'
      return _key
    }else{
      _key='请在此输入筛选关键字进行搜索，支持项目名称，所在区域，创建人'
      return _key
    }
  }
  const searchInputProps={
    placeholder:placeholdershow(currentKey),
    searchFuc:(value)=>dispatch({
      type:'projectManagement/changeKeyWords',
      payload:value,
    }),
    clearFuc:()=>dispatch({
      type:'projectManagement/changeKeyWords',
      payload:'',
    }),
    // searchFuc:(value)=>{
    //   if(currentKey==="saleItems"){
    //     dispatch({
    //       type:"projectManagement/getInitTableData",
    //       payload:{
    //         pageSize:10,
    //         pageNo:0,
    //         keyword:value
    //       }
    //     })
    //   }else if(currentKey==="audit"){
    //     dispatch({
    //       type:"projectManagement/getInitAuditData",
    //       payload:{
    //         pageSize:10,
    //         pageNo:0,
    //         keyword:value
    //       }
    //     })
    //   }else if(currentKey==='underFrameProject'){
    //     dispatch({
    //       type:"projectManagement/getInitOffLineData",
    //       payload:{
    //         pageSize:10,
    //         pageNo:0,
    //         keyword:value
    //       }
    //     })
    //   }
    // },
    type:'button',
    buttonTitle:'搜索',
  }
  const tableTagOnChange=(key)=>{
    dispatch({
      type:"projectManagement/changeActiveTagKeys",
      payload:{
        currentKey:key,
        tableLoading:true,
      }
    })
  }

  const renderEidtOpt=(record)=>{
    console.log('record',record);
    if(!!record.isEditAgain || !!record.isOnline){
      //再编辑项目
      return (<span className="edit" onClick={()=>dispatch({
        type:'projectManagement/openReEditModal',
        payload:record.id,
      })}>编辑</span>)
    }else{
      return(<span className="edit" onClick={()=>toEdit(record)}>编辑</span>)
    }
  }
  const auditTable=[
    {
      title: '序号',
      dataIndex: 'number',
    },
    {
      title: '项目名称',
      dataIndex: 'name',
    },
    {
      title: '所在区域',
      dataIndex: 'areaPath',
    },
    {
      title: '在售房源',
      dataIndex: 'sellTotle',
    },
    {
      title: '房源单价',
      dataIndex: 'price',
    },
    {
      title: '电商优惠',
      dataIndex: 'discount',
      render:(text)=>`${text}个`
    },
    {
      title: '创建时间',
      dataIndex: 'createDateTime',
    },
    {
      title: '上线时间',
      dataIndex: 'onsellDateTime',
    },
    {
      title: '审核人',
      dataIndex: 'auditor',
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      render:(text,record,index)=>renderOnSaleProjectTableStatus(record)
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render:(text,record,index)=>{
        if(record.projectStatusType==="上架"&&record.status==='审核通过'){
          return(
            <div className="operation">
              <span className="details" onClick={()=>toDetails(record)}>详情</span>
            </div>
          )
        }else{
          return(
            <div className="operation">
              {renderAuditTableEditExt(record.status) && renderEidtOpt(record)}
              <span className="details" onClick={()=>toDetails(record)}>详情</span>
            </div>
          )
        }
      }
    },
  ];
  const editTable=[
    {
      title: '序号',
      dataIndex: 'number',
    },
    {
      title: '项目名称',
      dataIndex: 'name',
    },
    {
      title: '所在区域',
      dataIndex: 'areaPath',
    },
    {
      title: '创建时间',
      dataIndex: 'createDateTime',
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render:(text)=><p>草稿</p>
    },
    {
      title:'操作',
      dataIndex:'operation',
      render:(text,record)=><div className="operation">
        {renderEidtOpt(record)}
      </div>
    }
  ];
  const underFrameProject=[
    {
      title: '序号',
      dataIndex: 'number',
    },
    {
      title: '项目名称',
      dataIndex: 'name',
    },
    {
      title: '所在区域',
      dataIndex: 'areaPath',
    },
    {
      title: '在售房源',
      dataIndex: 'sellTotle',
    },
    {
      title: '房源单价',
      dataIndex: 'price',
    },
    {
      title: '带看数',
      dataIndex: 'lookNumber',
    },
    {
      title: '已售优惠',
      dataIndex: 'dealNumber',
    },
    {
      title: '成交套数',
      dataIndex: 'transactions',
    },
    {
      title: '下架时间',
      dataIndex: 'offlineDate',
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render:(text,record,index)=>{
        return(<span className="details" onClick={()=>toDetails(record)}>详情</span>)
      }
    },
  ];
  const toEdit=(record)=>{
    dispatch(routerRedux.push({
      pathname:'/newHouseOnline/projectManagement/createProject/basicMessage',
      state:{
        projectId:record.id
      }
    }))
  }
  // const judgeToedit=(e,record)=>{
  //   console.log('judgeToedit',record);
  //   if(!!record.isEditAgain){
  //     //再编辑项目
  //     dispatch({
  //       type:'projectManagement/openReEditModal',
  //       payload:record.id,
  //     })
  //   }else{
  //     toEdit(record)
  //   }
  // }
  const toDetails=(record)=>{
    dispatch(routerRedux.push({
      pathname: `/tradeManagement/newHouseTrade/projectDetails`,
      state:{
        projectId:record.id,
        projectName:record.name
      }
    }));
  }
  const showOffLineModal=(record)=>{
    dispatch({
      type:"projectManagement/showOffLineModal",
      payload:{
        visible:true,
      }
    })
    dispatch({
      type:"projectManagement/saveOffLineData",
      payload:{
        projectId:record.key,
        currentRecord:record
      }
    })
  }
  const toSellControlTable=(record)=>{
    // dispatch(routerRedux.push({
    //   pathname:'/tradeManagement/newHouseTrade/projectDetails',
    //   state:{
    //     projectId:record.id,
    //     projectName:record.name,
    //     current:3
    //   }
    // }))
  }
  const showDetailsModal=(record)=>{
    console.log('record',record);
    // if(record.status==='下架申请'&&record.nextStatus==='等待审核'){
    //   dispatch({
    //     type:'projectManagement/showDetailsModal',
    //     payload:{
    //       visible:true,
    //       currentRecord:record
    //     }
    //   })
    //   dispatch({
    //     type:"projectManagement/projectsAuditOne",
    //     payload:{
    //       id:record.id
    //     }
    //   })
    // }
    // if(record.projectStatusType==='下架'){
    //   if(record.status==="驳回下架"){
    //     dispatch({
    //       type:'projectManagement/showDetailsModal',
    //       payload:{
    //         visible:true,
    //         currentRecord:record
    //       }
    //     })
    //     dispatch({
    //       type:"projectManagement/projectsAuditOne",
    //       payload:{
    //         id:record.id
    //       }
    //     })
    //   }
    // }else
    if(record.status==="发布申请"){
      dispatch({
        type:"projectManagement/showPublishDetailsModal",
        payload:{
          publishVisible:true,
          currentRecord:record
        }
      })
      dispatch({
        type:"projectManagement/projectsByOne",
        payload:{
          id:record.id,
          status:'上架',
        }
      })
    }else if(record.projectStatusType==='上架'){
      if(record.status==='驳回发布'){
        dispatch({
          type:"projectManagement/showPublishDetailsModal",
          payload:{
            publishVisible:true,
            currentRecord:record
          }
        })
        dispatch({
          type:"projectManagement/projectsByOne",
          payload:{
            id:record.id,
            status:'上架',
          }
        })
      }else if(record.status="审核通过"){
        dispatch({
          type:"projectManagement/showPublishDetailsModal",
          payload:{
            publishVisible:true,
            currentRecord:record
          }
        })
        dispatch({
          type:"projectManagement/projectsByOne",
          payload:{
            id:record.id,
            status:'上架',
          }
        })
      }
    }
  }

  const createProjectClick=()=>{
    dispatch(routerRedux.push({
      pathname: `/newHouseOnline/projectManagement/createProject`,
    }));
  }
  // const handleCallBackOk=()=>{
  //   if(promptObj.todo==='closeModalAndFetch'){
  //     dispatch({
  //       type:"projectManagement/togglePrompt",
  //       payload:{
  //         visible:false
  //       }
  //     })
  //     dispatch({
  //       type:"projectManagement/showPublishDetailsModal",
  //       payload:{
  //         publishVisible:false
  //       }
  //     })
  //     dispatch({
  //       type:"projectManagement/showOffLineModal",
  //       payload:{
  //         visible:false
  //       }
  //     })
  //     dispatch({
  //       type:"projectManagement/getInitTableData",
  //       payload:{
  //         pageSize:10,
  //         pageNo:currentPage,
  //       }
  //     })
  //   }
  //   if(promptObj.todo==="closeModal"){
  //     dispatch({
  //       type:"projectManagement/togglePrompt",
  //       payload:{
  //         visible:false
  //       }
  //     })
  //   }
  //   if(promptObj.todo==="closeBothModal"){
  //     dispatch({
  //       type:"projectManagement/togglePrompt",
  //       payload:{
  //         visible:false
  //       }
  //     })
  //     dispatch({
  //       type:"projectManagement/releaseAuditModal",
  //       payload:{
  //         releaseAuditVisible:false
  //       }
  //     })
  //   }
  //   if(promptObj.todo==='closeModalAndSendFetch'){
  //     dispatch({
  //       type:"projectManagement/togglePrompt",
  //       payload:{visible:false}
  //     })
  //     dispatch({
  //       type:"projectManagement/showPublishDetailsModal",
  //       payload:{publishVisible:false}
  //     })
  //   }
  // }
  const handleCallBackOnCancel=()=>{}

  const upLoadReleasePicProps={
    url:'/miss-anzhu-aliyun-file/putfile',
    maxNum:10,//最大上传数
    maxSize:2,//文件大小限值
    showPicList:showReleasePicList,//state管理图片list
    doCover:false,
    changeList:(data)=>{
      dispatch({
        type:"projectManagement/changeReleasePicList",
        payload:data
      })
    },//更新list回调
  }
  const addModalOk=(data)=>{
    data.projectId=projectId
    const accessCode=[];
    showReleasePicList.map(item=>{
      accessCode.push(item.id)
    })
    data.accessCode=accessCode;
    dispatch({
      type:'projectManagement/uploadData',
      payload:data
    })
    dispatch({
      type:'projectManagement/changeReleasePicList',
      payload:[]
    })
    dispatch({
      type:'projectManagement/getInitAuditData',
      payload:{
        pageNo:0,
        pageSize:10
      }
    })
  }
  const addModalOnCancel=()=>{
    dispatch({
      type:"projectManagement/closeReleaseAuditModal",
      payload:{
        releaseAuditVisible:false
      }
    })
    dispatch({
      type:'uploadAptitude/changeReleasePicList',
      payload:[]
    })
  }
  const confirmModalProps={
    ...confirmModal,
    onOk:()=>dispatch({
      type:'projectManagement/confirmModalOkCallBack'
    }),
    onCancel:()=>dispatch({
      type:'projectManagement/confirmModalCancelCallBack'
    }),
    afterClose:()=>dispatch({
      type:'projectManagement/confirmModalAfterCloseCallBack'
    })
  }

  const publicTableProps = {
    dataSource:activeTabelData,
    loading:tableLoading,
    rowKey:renderTableKey,
    pagination:{
      ...pagination,
      showTotal:(totalElements)=>{return(`总${totalElements}项`)},
      defaultCurrent:1,
      showQuickJumper:true,
      onChange:(newPage)=>dispatch({
        type:'projectManagement/changePage',
        payload:newPage,
      }),
    },
  }
  //在售项目状态
  function renderOnSaleProjectTableStatus(record){
    const {status} = record;
    if(status === '上线'){
      return <div>
        <p>已上线</p>
      </div>
    }
    else if(status === '再编辑'){
      return <div>
        <p>再编辑</p>
      </div>
    }
    else if(status === '待上线'){
      return <div>
        <p>待上线</p>
      </div>
    }
    else if(status === '发布申请'){
      return <div>
        <p>发布申请</p>
        <p className='blue_cursor' onClick={()=>dispatch({
            type:'projectManagement/getOnSaleAuditInfo',
            payload:record,
          })}>待审核</p>
      </div>
    }
    else if(status === '撤回发布'){
      return <div>
        <p>发布申请</p>
        <p className='red_cursor' onClick={()=>dispatch({
            type:'projectManagement/getOnSaleAuditInfo',
            payload:record,
          })}>已撤回</p>
      </div>
    }
    else if(status === '驳回发布'){
      return <div>
        <p>发布申请</p>
        <p className='red_cursor' onClick={()=>dispatch({
            type:'projectManagement/getOnSaleAuditInfo',
            payload:record,
          })}>已驳回</p>
      </div>
    }
    else if(status === '审核通过'){
      return <div>
        <p>发布申请</p>
        <p className='blue_cursor' onClick={()=>dispatch({
            type:'projectManagement/getOnSaleAuditInfo',
            payload:record,
          })}>已通过</p>
      </div>
    }
    else if(status === '下架申请'){
      return <div>
        <p>申请下架</p>
        <p className='blue_cursor' onClick={()=>dispatch({
            type:'projectManagement/getProOffLineAuditInfo',
            payload:record,
          })}>待审核</p>
      </div>
    }
    else if(status === '撤回下架'){
      return <div>
        <p>申请下架</p>
        <p className='red_cursor' onClick={()=>dispatch({
            type:'projectManagement/getProOffLineAuditInfo',
            payload:record,
          })}>已撤回</p>
      </div>
    }
    else if(status === '驳回下架'){
      return <div>
        <p>申请下架</p>
        <p className='red_cursor' onClick={()=>dispatch({
            type:'projectManagement/getProOffLineAuditInfo',
            payload:record,
          })}>已驳回</p>
      </div>
    }
    else if(status === '已下架'){
      return <div>
        <p>申请下架</p>
        <p className='blue_cursor' onClick={()=>dispatch({
            type:'projectManagement/getProOffLineAuditInfo',
            payload:record,
          })}>已下架</p>
      </div>
    }
    {/*

      {
        if(record.status === '下架申请'){
          return <div className="offlineAppliy">
            <span>申请下架</span>
            <span className={record.nextStatus==="等待审核"?'waitAduit':'reject'} onClick={()=>showDetailsModal(record)}>{record.nextStatus}</span>
          </div>
        }
        else if(record.status === '上线'){
          return <div>
            <div>已上线</div>
          </div>
        }
        else if(record.status === '撤回下架'){
          return <div className="offlineAppliy">
            <span>申请下架</span>
            <span className='reject' onClick={()=>showDetailsModal(record)}>撤回下架</span>
          </div>
        }
        else if(record.status === '再编辑'){
          return <div>
            <div>再编辑</div>
          </div>
        }
        else if(record.status === '发布申请'){
          return <div className="offlineAppliy">
            <span>发布申请</span>
            <span className={record.nextStatus==="等待审核"?'waitAduit':'reject'} onClick={()=>showDetailsModal(record)}>{record.nextStatus}</span>
          </div>
        }
        else if(record.status === '审核通过'){
          if(record.nextStatus === '待上线'){
            return <div>
              <div>待上线</div>
            </div>
          }
          else{
            return <div></div>
          }
        }
        else if(record.status === '驳回发布'){
          return <div className="offlineAppliy">
            <span>重新发布</span>
            <span className='reject' onClick={()=>showDetailsModal(record)}>驳回发布</span>
          </div>
        }
      }
    */}
  }
  const onSaleProTabelColumns = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '项目名称',
      dataIndex: 'name',
    },
    {
      title: '所在区域',
      dataIndex: 'areaPath',
    },
    {
      title: '房源单价',
      dataIndex: 'price',
    },
    {
      title: '带看数',
      dataIndex: 'lookNumber',
    },
    {
      title: '已售优惠',
      dataIndex: 'discount',
    },
    {
      title: '成交套数',
      dataIndex: 'transactions',
    },
    {
      title: '创建时间',
      dataIndex: 'createDateTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render:(text,record,index)=>renderOnSaleProjectTableStatus(record)
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
    },
    {
      title: '房源销控',
      dataIndex: 'sellTotle',
      render:(text,record,index)=><Link className='deal_operation' to={{pathname:'/tradeManagement/newHouseTrade/projectDetails',state:{
        projectId:record.id,
        projectName:record.name,
        current:3,
      }}}>{text}</Link>
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render:(text,record,index)=>{
        if(record.status === '下架申请' || record.status === '撤回发布'){
          return (<div>
              <span className='newhousedeal-operation' onClick={()=>toDetails(record)}>详情</span>
            </div>)
        }
        else if(record.status === '上线' || record.status === '驳回下架'){
          return  (
            <div>
               <span className='newhousedeal-operation' onClick={()=>dispatch({
                   type:'projectManagement/renderConfirmModalTodo',
                   payload:{
                     record,
                     todo:'offlineApply'
                   },
                 })}>下架</span>
              <span className='newhousedeal-operation' onClick={()=>toDetails(record)}>详情</span>
              <span className='newhousedeal-operation' onClick={()=>dispatch({
                  type:'projectManagement/openReEditModal',
                  payload:record.id,
                })}>编辑</span>
            </div>
          )
        }
        else if(record.status === '发布申请'){
          return  (
            <div>
               <span className='newhousedeal-operation' onClick={()=>dispatch({
                   type:'projectManagement/renderConfirmModalTodo',
                   payload:{
                     record,
                     todo:'offlineApply'
                   },
                 })}>下架</span>
              <span className='newhousedeal-operation' onClick={()=>toDetails(record)}>详情</span>
            </div>
          )
        }
        else if(record.status === '再编辑'){
          return  (
            <div>
              <span className='newhousedeal-operation' onClick={()=>toDetails(record)}>详情</span>
              <span className='newhousedeal-operation' onClick={()=>dispatch({
                  type:'projectManagement/openReEditModal',
                  payload:record.id,
                })}>编辑</span>
              <span className='newhousedeal-operation' onClick={()=>dispatch({
                  type:'projectManagement/renderConfirmModalTodo',
                  payload:{
                    record,
                    todo:'reEditOfflineApply'
                  },
                })}>下架</span>
            </div>
          )
        }
        else if(record.status === '撤回下架'){
          return  (
            <div>
               <span className='newhousedeal-operation' onClick={()=>dispatch({
                   type:'projectManagement/renderConfirmModalTodo',
                   payload:{
                     record,
                     todo:'offlineApply'
                   },
                 })}>下架</span>
              <span className='newhousedeal-operation' onClick={()=>toDetails(record)}>详情</span>
            </div>
          )
        }
        else{
          if(record.status === '审核通过'){
            if(record.projectStatusType === '上架'){
              return (
                <div>
                  <span className='newhousedeal-operation' onClick={()=>toDetails(record)}>详情</span>
                  <span className='newhousedeal-operation' onClick={()=>dispatch({
                      type:'projectManagement/openReEditModal',
                      payload:record.id,
                    })}>编辑</span>
                  <span className='newhousedeal-operation' onClick={()=>dispatch({
                      type:'projectManagement/renderConfirmModalTodo',
                      payload:{
                        record,
                        todo:'reEditOfflineApply'
                      },
                    })}>下架</span>
                </div>
              )
            }
          }
          else if(record.status === '驳回发布'){
            if(record.projectStatusType === '上架'){
              return  (
                <div>
                   <span className='newhousedeal-operation' onClick={()=>dispatch({
                       type:'projectManagement/renderConfirmModalTodo',
                       payload:{
                         record,
                         todo:'offlineApply'
                       },
                     })}>下架</span>
                 <span className='newhousedeal-operation' onClick={()=>dispatch({
                     type:'projectManagement/openReEditModal',
                     payload:record.id,
                   })}>编辑</span>
                  <span className='newhousedeal-operation' onClick={()=>toDetails(record)}>详情</span>
                </div>
              )
            }

          }
        }
      }
    },
  ]
  return (
    <div className="projectManagement">
      <NewHouseDetailsModal/>
      <NewHousePulishDetailsModal/>
      <DealCenterOffLineModal/>
      <DxConfirmModal {...confirmModalProps}/>
      <ReleaseAudit visible={releaseAuditVisible} upLoadReleasePicProps={upLoadReleasePicProps}
        onOk={addModalOk} onCancel={addModalOnCancel} resultData={releaseAuditData}/>
      <DxConfirmModal visible={reEditModal.visible} title='确认修改项目？' description='上线项目编辑会导致该项目重新进入审核状态！' onOk={()=>dispatch({
          type:'projectManagement/doReEditProject'
        })} onCancel={()=>dispatch({type:'projectManagement/closeClearReEditModal'})} afterClose={()=>dispatch({
          type:'projectManagement/goToReEdit'
        })}/>
      <PromptModal {...promptObj} onOk={()=>dispatch({
          type:'projectManagement/judgePropTodo',
          payload:promptObj.todo,
        })} onCancel={handleCallBackOnCancel}/>
      <div style={{paddingTop:20}}>
        <Button type='primary' onClick={createProjectClick}>创建项目</Button>
      </div>
      <div className='anzhu_dx_container_box'>
        <SearchInput {...searchInputProps}/>
      </div>
      <div style={{paddingTop:20}}>
        <Tabs onChange={tableTagOnChange} type="card" activeKey={currentKey}>
          <TabPane tab='在售项目' key='saleItems'>
            <Table className='newhousedeal-table' columns={onSaleProTabelColumns} {...publicTableProps}/>
          </TabPane>
          <TabPane tab='审核中' key='audit'>
            <Table className='newhousedeal-table'  columns={auditTable} {...publicTableProps}/>
          </TabPane>
          <TabPane tab='已下架项目' key='underFrameProject'>
            <Table className='newhousedeal-table' columns={underFrameProject} {...publicTableProps}/>
          </TabPane>
          <TabPane tab='编辑中项目' key='editTable'>
            <Table className='newhousedeal-table' columns={editTable} {...publicTableProps}/>
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

function mapStateToProps({projectManagement}){
  return {projectManagement}
}
function renderTableKey(record){
  return record.id;
}
function renderAuditTableEditExt(status){
  let result = false;
  if(status === '驳回发布'){
    result = true
  }
  return result
}
export default connect(mapStateToProps)(ProjectManagement);
