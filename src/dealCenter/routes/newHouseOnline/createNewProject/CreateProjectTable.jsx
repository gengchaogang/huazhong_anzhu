import React from 'react'
import {connect} from 'dva'
import DxPanel from '../../../../commons/components/DxPanel'
import './CreateProjectTable.css'
import {routerRedux} from 'dva/router'
import HouseEdit from './HouseEdit'
import PromptModal from'../../../../commons/View/PromptModal'
import BandHouseTypeModal from './BandHouseTypeModal'
import {Button,Table,Row,Col,Input,Upload} from 'antd'
function CreateProjectTable({createProjectTable,dispatch}){
  const {
    houseTypeName,
    loading,
    houseTypeData,
    stairType,
    decoration,
    selectedRowKeys,
    visible,
    projectId,
    isEdit,
    houseResourceId,
    promptObj,
    houseTypeNames,
    bandModal,
    disabled,
    reEdit,
    houseEditTitle,
    tableOneData,
    resultData,
    totalElements,
    current
  } =createProjectTable;
  const columns = [{
    title: '序号',
    dataIndex: 'number',
    render: text => <span>{text}</span>,
    }, {
      title: '区域',
      dataIndex: 'area',
    }, {
      title: '单元',
      dataIndex: 'unit',
    },{
      title:'楼梯类型',
      dataIndex:'stairType'
    },{
      title:"装修状况",
      dataIndex:'decoration',
    },{
      title:'楼层',
      dataIndex:"floor"
    },{
      title:'总楼层',
      dataIndex:'totalFloor',
    },{
      title:'房号',
      dataIndex:'houseNumber'
    },{
        title:'楼号',
        dataIndex:'buildingNumber',
    },{
      title:'房源类型',
      dataIndex:'housingType'
    },{
      title:'建筑面积 (㎡)',
      dataIndex:'floorArea'
    },{
      title:'销售单价 (元)',
      dataIndex:'price'
    },{
      title:'销售总价 (元)',
      dataIndex:'totalPrice'
    },{
      title:'户型',
      dataIndex:'houseTypeName'
    },{
      title:'销售状态',
      dataIndex:'state'
    },{
      title:'操作',
      render:(text,record,index,)=>{
        return(
          <div>
            <Button type="primary" disabled={reEdit} onClick={()=>{
                dispatch({
                  type:"createProjectTable/changeKey",
                  payload:{
                    houseResourceId:record.key
                  }
                })
                dispatch({
                  type:"createProjectTable/getTableOneData",
                  payload:{
                    id:record.key
                  }
                })
                dispatch({
                  type:"createProjectTable/openModalAndChangeSatae",
                  payload:{
                    visible:true,
                    disabled:false,
                    houseEditTitle:"房源编辑"
                  }
                })
              }}>编辑
            </Button>
            <Button type="primary" onClick={()=>{
              dispatch({
                type:"createProjectTable/openModalAndChangeSatae",
                payload:{
                  visible:true,
                  disabled:true,
                  houseEditTitle:"房源查看"
                }
              })
                dispatch({
                  type:"createProjectTable/getTableOneData",
                  payload:{
                    id:record.key
                  }
                })
              }}>查看</Button>
          </div>
        )}
    }];
// rowSelection object indicates the need for row selection
  const hasSelected = selectedRowKeys.length > 0;
  const onSelectChange=(selectedRowKeys)=>{
    dispatch({
        type:'createProjectTable/modifySelect',
        payload:selectedRowKeys
      })
    }
  const rowSelection = {
    selectedRowKeys,
    onChange:onSelectChange,
  };
  const pagination={
    total:totalElements,
    // current:current,
    defaultCurrent:1,
    showQuickJumper:true,
    onChange:(page)=>{
      dispatch({
        type:"createProjectTable/saveCurrentPage",
        payload:{
          current:page-1
        }
      })
      dispatch({
        type:"createProjectTable/changePage",
        payload:{
          pageNo:page-1,
          pageSize:10,
          projectId:projectId,
          state:''
        }
      })
    }
  }
  const deleteHouseResource=()=>{
      dispatch({
        type:'createProjectTable/modifyLoading'
      });
      dispatch({
        type:'createProjectTable/deleteHouseResource',
        payload:selectedRowKeys
      })
      dispatch({
        type:'createProjectTable/modifyBoth'
      })
    }
  const bandHouseType=()=>{
    dispatch({
      type:'createProjectTable/openBandModal',
      payload:{
        bandModal:true
      }
    })
  }
  const uploadProps={
    showUploadList:false,
    name:"file",
    method:"post",
    data:{
      projectId:projectId
    },
    action:"/miss-anzhu-newhouse-project/projects/houses/upload",
    onChange:(info)=>{
      if(!!info&&info.file.status==='done'){
        if(!!info.file.response&&info.file.response.status==='success'){
          dispatch({
              type:'createProjectTable/getInitProjectTableData',
              payload:{
                projectId:projectId,
                pageNo:0,
                pageSize:10,
                state:''
              }
          })
        }
      }
    }
  }
  const editModalOk=(data)=>{
    if(!!houseTypeName){
      data.houseTypeName=houseTypeName
    }
    dispatch({
      type:"createProjectTable/uploadEditData",
      payload:data
    })
  }
  const editModalOnCancel=()=>{
    dispatch({
      type:"createProjectTable/closeModal",
      payload:{
        visible:false
      }
    })
  }
  const onOkCallBack=()=>{
    if(promptObj.todo==="closeModal"){
      if(promptObj.type==='success'){
        dispatch({
            type:"createProjectTable/closeModal",payload:{visible:false}
        })
        dispatch({
          type:'createProjectTable/togglePrompt',
          payload:{
            visible:false
          }
        })
      }else{
        dispatch({
          type:'createProjectTable/togglePrompt',
          payload:{
            visible:false
          }
        })
      }
    }else if(promptObj.todo==="deleteHouseResource"){
      if(promptObj.type==='success'){
        dispatch({
          type:'createProjectTable/closeAndFetch'
        })
      }else{
        dispatch({
          type:'createProjectTable/togglePrompt',
          payload:{
            visible:false
          }
        })
      }
    }else if(promptObj.todo==='editOkSendFetch'){
      if(promptObj.type==="success"){
        dispatch({
            type:"createProjectTable/togglePrompt",payload:{visible:false}
        })
        dispatch({
          type:'createProjectTable/closeModal',
          payload:{
            visible:false
          }
        })
        dispatch({
          type:'createProjectTable/getInitProjectTableData',
          payload:{
            pageNo:0,
            pageSize:10,
            projectId:projectId,
            state:''
          }
        })
      }
    }else if(promptObj.todo==='default'){
      dispatch({
        type:'createProjectTable/togglePrompt',
        payload:{
          visible:false
        }
      })
    }
  }
  const onCancelCallBack=()=>{}
  const bandModalOk=(data)=>{
    data.ids=selectedRowKeys
    dispatch({
      type:'createProjectTable/bandHouseType',
      payload:data
    })
  }
  const bandModalOnCancel=()=>{
    dispatch({
      type:"createProjectTable/closeBandModal",
      payload:{
        bandModal:false
      }
    })
  }
  const toBack=()=>{
    dispatch(routerRedux.push({
      pathname:'/newHouseOnline/projectManagement/createProject/houseTypeImgManagement',
      state:{
        projectId:projectId,
        isEdit:isEdit,
        reEdit,
      }
    }))
  }
  const toNext=()=>{
    dispatch({
      type:'createProjectTable/judgeHouseHasHouseType',
    })
  }
  const handleSelectChange=(option)=>{
    dispatch({
      type:"createProjectTable/saveHouseNames",
      payload:{
        houseTypeName:option.props.children
      }
    })
  }
  const houseEditProps={
    projectId,
    visible,
    disabled,
    houseEditTitle,
    onOk:editModalOk,
    onCancel:editModalOnCancel,
    houseResourceId,
    houseTypeNames,
    handleSelectChange:handleSelectChange,
  }
  return(
    <DxPanel title="项目销控表">
      <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack}/>
      <div className="CreateProjectTable">
        <HouseEdit
          {...houseEditProps}
          tableOneData={!!tableOneData?tableOneData:[]}  houseTypeData={!!houseTypeData?houseTypeData:[]}
          stairType={!!stairType?stairType:[]}
          decoration={!!decoration?decoration:[]}/>

        <BandHouseTypeModal visible={bandModal} houseTypeNames={houseTypeNames}onOk={bandModalOk} onCancel={bandModalOnCancel}/>
        <Row>
          <Col span={8}>
            <div style={{ marginBottom: 16 }}>
              <Button type='primary' disabled={reEdit || !hasSelected} onClick={bandHouseType}>绑定户型</Button>
              <Button type="primary" onClick={deleteHouseResource}
                disabled={reEdit || !hasSelected} loading={loading}
              >删除房源</Button>
              <span style={{ marginLeft: 8 }}>{hasSelected ? `选中 ${selectedRowKeys.length} 项` : ''}</span>
            </div>
          </Col>
          <Col span={8} offset={8}>
            <div style={{float:'right'}}>
              <Upload {...uploadProps}>
                <Button type="primary" disabled={reEdit}>上传新房销控表</Button>
              </Upload>
              <a href="http://anzhu.oss-cn-qingdao.aliyuncs.com/000basefile/%E9%A1%B9%E7%9B%AE%E9%94%80%E6%8E%A7%E8%A1%A8.xlsx" download='新房销控表模板'><Button type="primary" disabled={reEdit}>下载新房销控表模板</Button></a>
            </div>
          </Col>
        </Row>

        <Table rowSelection={rowSelection} columns={columns} dataSource={resultData} pagination={pagination} />
        <div className="toright">
          <Button type="ghost" onClick={toBack}>返回上一步</Button>
          <Button type="primary" onClick={toNext}>下一步创建电商优惠</Button>
        </div>
      </div>
    </DxPanel>
  )
}



function mapStateToProps({ createProjectTable }) {
  return { createProjectTable }
}
export default connect(mapStateToProps)(CreateProjectTable);
