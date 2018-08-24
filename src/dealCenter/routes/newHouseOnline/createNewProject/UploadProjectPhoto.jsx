import React from 'react'
import {routerRedux} from 'dva/router'
import {Form,Upload,message,Collapse,Icon,Button} from 'antd'
import {connect} from 'dva'
import DxPanel from '../../../../commons/components/DxPanel';
import DxUpLoadPic from '../../../../commons/View/DxUpLoadPic'
import PromptModal from'../../../../commons/View/PromptModal'
const Panel=Collapse.Panel;
const FormItem=Form.Item;
const UploadProjectPhoto=Form.create({
  onFiledsChange:(props,fileds)=>{

  },
  mapPropsToFileds:(props)=>{

  }
})(({uploadProjectPhoto,form,dispatch})=>{
  const {getFieldDecorator}=form;
  const {projectId,isEdit}=uploadProjectPhoto;
  const {
    showEffectPicList,
    showTrafficPicList,
    showSupportingPicList,
    picId,
    showEffectPicLoading,
    showTrafficPicLoading,
    showSupportingPicLoading,
    promptObj,
    reEdit,
  }=uploadProjectPhoto;
  const upLoadEffectPicProps={
    url:'/miss-anzhu-aliyun-file/putfile',
    maxNum:30,//最大上传数
    maxSize:2,//文件大小限值
    showPicList:showEffectPicList,//state管理图片list
    doCover:true,
    changeList:(data)=>{
      dispatch({
        type:"uploadProjectPhoto/changeEffectPicList",
        payload:data
      })
    },//更新list回调
    loadCallBack:(bool)=>dispatch({
      type:'uploadProjectPhoto/updateUploadLoading',
      payload:{
        showEffectPicLoading:bool,
      }
    }),
  }



  const upLoadTrafficPicProps={
    url:'/miss-anzhu-aliyun-file/putfile',
    maxNum:30,//最大上传数
    maxSize:2,//文件大小限值
    showPicList:showTrafficPicList,//state管理图片list
    doCover:false,
    changeList:(data)=>{
      dispatch({
        type:"uploadProjectPhoto/changeTrafficPicList",
        payload:data
      })
    },//更新list回调
    loadCallBack:(bool)=>dispatch({
      type:'uploadProjectPhoto/updateUploadLoading',
      payload:{
        showTrafficPicLoading:bool,
      }
    }),
  }
  const upLoadSupportingPicProps={
    url:'/miss-anzhu-aliyun-file/putfile',
    maxNum:30,//最大上传数
    maxSize:2,//文件大小限值
    showPicList:showSupportingPicList,//state管理图片list
    doCover:false,
    changeList:(data)=>{
      dispatch({
        type:"uploadProjectPhoto/changeSupportingPicList",
        payload:data
      })
    },//更新list回调
    loadCallBack:(bool)=>dispatch({
      type:'uploadProjectPhoto/updateUploadLoading',
      payload:{
        showSupportingPicLoading:bool,
      }
    }),
  }
  const backBasicMessage=()=>{
    dispatch(routerRedux.push({
      pathname:'/newHouseOnline/projectManagement/createProject/basicMessage',
      state:{
        projectId:projectId,
        reEdit:reEdit,
      }
    }))
  }
  const toNext=()=>{
    if(showEffectPicList.length===0||showTrafficPicList.length===0||showSupportingPicList.length===0){
      dispatch({
        type:"uploadProjectPhoto/togglePrompt",
        payload:{
            type:'error',
            title:'操作失败!',
            description:'您至少还有一项未上传图片!',
            visible:true,
            todo:"closeModal"
        }
      })
    }else if( showEffectPicLoading || showTrafficPicLoading || showSupportingPicLoading){
      dispatch({
        type:"uploadProjectPhoto/togglePrompt",
        payload:{
            type:'error',
            title:'操作失败!',
            description:'您还有图片处于上传状态中!',
            visible:true,
            todo:"closeModal"
        }
      })
    }else{
      if(!!isEdit){
        dispatch({
          type:'uploadProjectPhoto/editPic',
          payload:{
            showEffectPicList:showEffectPicList,
            showTrafficPicList:showTrafficPicList,
            showSupportingPicList:showSupportingPicList,
            projectId:projectId,
            picId:picId
          }
        })
        dispatch(routerRedux.push({
          pathname:'/newHouseOnline/projectManagement/createProject/houseTypeImgManagement',
          state:{
            projectId:projectId,
            isEdit:isEdit,
            reEdit,
          }
        }))
      }else{
        dispatch({
          type:'uploadProjectPhoto/upLoadPic',
          payload:{
            showEffectPicList:showEffectPicList,
            showTrafficPicList:showTrafficPicList,
            showSupportingPicList:showSupportingPicList,
            projectId:projectId
          }
        })
        dispatch(routerRedux.push({
          pathname:'/newHouseOnline/projectManagement/createProject/houseTypeImgManagement',
          state:{
            projectId:projectId,
            isEdit:isEdit,
            reEdit,
          }
        }))
      }
    }
  }
  const onOkCallBack=()=>{
    if(promptObj.todo==='closeModal'){
      dispatch({
        type:"uploadProjectPhoto/togglePrompt",
        payload:{
          visible:false
        }
      })
    }
  }
  const onCancelCallBack=()=>{}
    return (
      <div className='createProjectPic'>
        <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack}/>
        <DxPanel title="项目效果图">
          <DxUpLoadPic {...upLoadEffectPicProps}/>
        </DxPanel>
        <DxPanel title="项目交通图">
            <DxUpLoadPic {...upLoadTrafficPicProps}/>
        </DxPanel>
        <DxPanel title="项目配套图">
            <DxUpLoadPic {...upLoadSupportingPicProps}/>
        </DxPanel>
        <div style={{textAlign:'right'}}>
          <Button type="ghost" onClick={backBasicMessage}>返回上一步</Button>
          <Button type="primary" onClick={toNext}>下一步创建户型</Button>
        </div>
      </div>
    )
  })


function mapStateToProps({uploadProjectPhoto}){
  return {uploadProjectPhoto};
}
export default connect(mapStateToProps)(UploadProjectPhoto)
