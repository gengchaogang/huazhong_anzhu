import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button, Upload, Icon, Modal } from 'antd';
import './UploadAptitude.css';
import DxPanel from '../../../../commons/components/DxPanel'
import DxUpLoadPic from '../../../../commons/View/DxUpLoadPic'
import PromptModal from'../../../../commons/View/PromptModal'
import ReleaseAudit from './ReleaseAudit'
function UploadAptitude({ dispatch,uploadAptitude }){
  const{
    showInitPicList,
    projectId,
    isEdit,
    visible,
    showReleasePicList,
    promptObj,
    resultData,
    picId,
    employees,
    reEdit,
  }=uploadAptitude
  const upLoadPicProps={
    url:'/miss-anzhu-aliyun-file/putfile',
    maxNum:10,//最大上传数
    maxSize:2,//文件大小限值
    showPicList:showInitPicList,//state管理图片list
    doCover:false,
    changeList:(data)=>{
      console.log('data',data)
      dispatch({
        type:"uploadAptitude/changePicList",
        payload:data
      })
    },//更新list回调
  }
  const upLoadReleasePicProps={
    url:'/miss-anzhu-aliyun-file/putfile',
    maxNum:10,//最大上传数
    maxSize:2,//文件大小限值
    showPicList:showReleasePicList,//state管理图片list
    doCover:false,
    changeList:(data)=>{
      dispatch({
        type:"uploadAptitude/changeReleasePicList",
        payload:data
      })
    },//更新list回调
  }
  const showModal=()=>{
    if(showInitPicList.length===0){
      dispatch({
        type:"uploadAptitude/togglePrompt",
        payload:{
          type:'error',
          title:'失败!',
          description:'上传项目资质图片不能为空!',
          visible:true,
          todo:'closeTipModal'
        }
      })
    }
    else{
      const pictures=[];
      showInitPicList.map(item=>{
        if(item.id !== '' && item.id.indexOf('picID_') === -1){
          pictures.push({
            title : item.name,
            accessCode : item.id,
          })
        }
        else{
          pictures.push({
            title : item.name,
            path : item.src,
          })
        }
        // pictures.push({accessCode:item.id,title:item.name})
      })
      console.log('showInitPicList',showInitPicList)
      console.log('pictures',pictures)
      dispatch({
        type:'uploadAptitude/uploadPic',
        payload:{
          projectId:projectId,
          pictures:pictures,
          id:picId
        }
      })
      dispatch({
        type:'uploadAptitude/showModalAndFetch',
        payload:{
          projectId:projectId
        }
      })
    }
  }
  const addModalOk=(data)=>{
    data.projectId=projectId
    const accessCode=[];
    showReleasePicList.map(item=>{
      accessCode.push(item.id)
    })
    data.accessCode=accessCode;
    data.employeesId=data.employees.key;
    data.employeesName=data.employees.label;
    dispatch({
      type:'uploadAptitude/uploadData',
      payload:data
    })
    dispatch({
      type:'uploadAptitude/changeReleasePicList',
      payload:[]
    })
  }
  const addModalOnCancel=()=>{
    dispatch({
      type:"uploadAptitude/closeModal",
      payload:{
        visible:false
      }
    })

    dispatch({
      type:'uploadAptitude/getInitImg',
      payload:{
        projectId:projectId
      }
    })
    dispatch({
      type:'uploadAptitude/changeReleasePicList',
      payload:[]
    })
  }
  const onOkCallBack=()=>{
    if(promptObj.todo==='closeTipModal'){
      if(promptObj.type==="error"){
        dispatch({
          type:'uploadAptitude/togglePrompt',
          payload:{
            visible:false
          }
        })
      }
    }else if(promptObj.todo==='closeBothModal'){
      dispatch({
        type:"uploadAptitude/togglePrompt",
        payload:{
          visible:false
        }
      })
      dispatch({
        type:"uploadAptitude/closeModal",
        payload:{
          visible:false
        }
      })
      sessionStorage.setItem('project_manage','audit');
      dispatch(routerRedux.push({
        pathname:"/newHouseOnline/projectManagement"
      }))
    }
  }
  const onCancelCallBack=()=>{

  }
  const toBack=()=>{
    dispatch(routerRedux.push({
      pathname:'/newHouseOnline/projectManagement/createProject/createProjectConcessions',
      state:{
        projectId:projectId,
        isEdit:isEdit,
        reEdit,
      }
    }))
  }
  return (
    <div className='uploadAptitudeContainer'>
      <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack}/>
      <ReleaseAudit
        visible={visible}
        upLoadReleasePicProps={upLoadReleasePicProps}
        onOk={addModalOk}
        onCancel={addModalOnCancel}
        employees={employees}
        resultData={resultData}/>
      <DxPanel title="上传项目资质">
          <DxUpLoadPic {...upLoadPicProps}/>
        <div style={{margin:'16px 0',textAlign:'right'}}>
  	    	<Button style={{borderColor:'#43B38D',marginLeft:0, backgroundColor:'#43B38D'}} type="primary"
            onClick={showModal}
            >发布申请</Button>
          <Button type="ghost" onClick={toBack}>返回</Button>
        </div>
      </DxPanel>
    </div>
  );
}
function mapStateToProps({ uploadAptitude }) {
  return { uploadAptitude }
}
export default connect(mapStateToProps)(UploadAptitude);
