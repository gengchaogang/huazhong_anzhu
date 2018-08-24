import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Table, Button } from 'antd';
import './CreateProjectConcessions.css';
import DxPanel from '../../../../commons/components/DxPanel';
import TableList from '../../../components/newHouseOnline/createProjectConcessions/tableList';
import EditItem from '../../../components/newHouseOnline/createProjectConcessions/editItemModal';
import CreateGroupBuying from '../../../components/newHouseOnline/createProjectConcessions/createGroupBuying';
import PromptModal from'../../../../commons/View/PromptModal'
function CreateProjectConcessions({ location, dispatch,createProjectConcessions}) {
  const {
    selectedRowKeys,
    delLoading,
    totalElements,
    pageSize,
    houseTypeNames,
    promptObj,
    concessionsId,
    current,
    projectId,
    isEdit,
    reEdit,
    resultData,
  }=createProjectConcessions//TableList所用属性
  const {
    submitLoading,
    modalVisible,
    applicability,
  }=createProjectConcessions//CreateGroupBuying所用属性
  const {
    edit_submitLoading,
    edit_modalVisible,
    edit_applicability,
    edit_record,
    edit_changeVisible,
    edit_changeApplicability,
    edit_changeSubmitLoading,
    tableOneData,
  }=createProjectConcessions//EditItem所用属性
  //改变创建团购modal的开关
  const changeVisible=(bool)=>{
    dispatch({
      type:'createProjectConcessions/changeVisible',
      payload:{
        modalVisible:bool,
      }
    });
  };
  //改变编辑modal的开关
  const changeEditVisible=(record,bool)=>{
    dispatch({
      type:'createProjectConcessions/changeEditVisible',
      payload:{
        edit_record:record,
        edit_modalVisible:bool,
      }
    });
  };
  const tableListProps={
    projectId,
    resultData,
    current,
    reEdit,
  	selectedRowKeys,
  	delLoading,
    totalElements,
    pageSize,
    changeEditVisible,
  	// onSelectChange:(selectedRowKeys)=>{
  	// 	dispatch({
  	// 		type:'createProjectConcessions/onSelectChange',
  	// 		payload:{
  	// 			selectedRowKeys
  	// 		}
  	// 	});
  	// },
    changeDelLoading:(bool)=>{
      dispatch({
        type:'createProjectConcessions/changeDelLoading',
        payload:{
          delLoading:bool,
        }
      })
    },
  };
  const createGroupBuyingProps={
    submitLoading,
    modalVisible,
    applicability,
    changeVisible,
    houseTypeNames,
    changeApplicability:(applicability)=>{
      dispatch({
        type:'createProjectConcessions/changeApplicability',
        payload:{
          applicability:applicability
        }
      })
    },
    changeSubmitLoading:(bool)=>{
      dispatch({
        type:'createProjectConcessions/changeApplicability',
        payload:{
          submitLoading:bool
        }
      })
    },
  };
  const editItemProps={
    houseTypeNames,
    edit_record,
    edit_submitLoading,
    edit_modalVisible,
    edit_applicability,
    changeEditVisible,
    tableOneData,
    changeApplicability:(applicability)=>{
      dispatch({
        type:'createProjectConcessions/changeApplicability',
        payload:{
          edit_applicability:applicability
        }
      })
    },
    changeSubmitLoading:(bool)=>{
      dispatch({
        type:'createProjectConcessions/changeApplicability',
        payload:{
          edit_submitLoading:bool
        }
      })
    },
  };
  const confirmUpload=(data)=>{
    data.projectId=projectId;
    dispatch({
      type:'createProjectConcessions/addConcessions',
      payload:data
    })
  }
  const editUpload=(data)=>{
    data.id=concessionsId;
    data.projectId=projectId;
    dispatch({
      type:'createProjectConcessions/editConcessions',
      payload:data
    })
  }
  const onOkCallBack=()=>{
    if(promptObj.todo==='closeModalAndFetch'){
      if(promptObj.type==='success'){
        dispatch({
          type:"createProjectConcessions/closeModalAndFetch"
        })
      }else{
        dispatch({
          type:'createProjectConcessions/togglePrompt',
          payload:{
            visible:false
          }
        })
      }
    }
    if(promptObj.todo==='closeAndFetch'){
      if(promptObj.type==='success'){
        dispatch({
          type:"createProjectConcessions/closeModalAndFetch"
        })
      }else{
        dispatch({
          type:'createProjectConcessions/togglePrompt',
          payload:{
            visible:false
          }
        })
      }
    }
    if(promptObj.todo==='closeModal'){
      dispatch({
        type:"createProjectConcessions/togglePrompt",
        payload:{
          visible:false
        }
      })
    }
  }
  const onCancelCallBack=()=>{

  }
  const toBack=()=>{
    dispatch(routerRedux.push({
      pathname:'/newHouseOnline/projectManagement/createProject/createProjectTable',
      state:{
        projectId:projectId,
        isEdit:isEdit,
        reEdit,
      }
    }))
  }
  const toNext=()=>{
    dispatch(routerRedux.push({
      pathname:'/newHouseOnline/projectManagement/createProject/uploadAptitude',
      state:{
        projectId:projectId,
        isEdit:isEdit,
        reEdit,
      }
    }))
  }
  return (
    <div className='container'>
      <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack}/>
      <DxPanel title="创建电商优惠">
        <div className='buttonCreate'>
          <Button type="primary" style={{borderColor:'#43B38D', backgroundColor:'#43B38D'}} onClick={()=>{changeVisible(true)}}>创建团购</Button>
          <CreateGroupBuying {...createGroupBuyingProps} onOk={confirmUpload}/>
          <TableList {...tableListProps}dispatch={dispatch}/>
        </div>
        <EditItem {...editItemProps} onOk={editUpload}/>
        <div className='footer'>
        	<Button type="ghost" onClick={toBack}>返回上一步</Button>
        	<Button type="primary" onClick={toNext} style={{borderColor:'#43B38D', backgroundColor:'#43B38D'}} >下一步上传项目资质</Button>
        </div>
      </DxPanel>
    </div>
  );
}
function mapStateToProps({ createProjectConcessions }) {
  return { createProjectConcessions }
}
export default connect(mapStateToProps)(CreateProjectConcessions);
