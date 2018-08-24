import React, { PropTypes } from 'react'
import {Steps, Button, message}from 'antd'
const Step = Steps.Step;
import textPic from '../../../assets/yay.jpg'
import DxPanel from '../../../../commons/components/DxPanel'
import ProjectBasicInfo from '../../../components/resourceManagement/newHousePro/newHouseProIndex/projectDetailsItem/ProjectBasicInfo'
import ProjectAlbum from '../../../components/resourceManagement/newHousePro/newHouseProIndex/projectDetailsItem/ProjectAlbum'
import HouseImgInfo from '../../../components/resourceManagement/newHousePro/newHouseProIndex/projectDetailsItem/HouseImgInfo'
import HousesSalesTable from '../../../components/resourceManagement/newHousePro/newHouseProIndex/projectDetailsItem/HousesSalesTable'
import ProjectDiscounts from '../../../components/resourceManagement/newHousePro/newHouseProIndex/projectDetailsItem/ProjectDiscounts'
import ProjectCertificates from '../../../components/resourceManagement/newHousePro/newHouseProIndex/projectDetailsItem/ProjectCertificates'
import PromptModal from '../../../../commons/View/PromptModal'
import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import './ProjectDetails.css'

function ProjectDetails({dispatch,projectDetailsBackStage}){
  const {
    projectId,
    projectList,
    showData,
    loading,
    current,
    promptObj,
    total,
    pageNo,
    picCredentialsList,
    pagination:{
      currentPage,
      totalPage,
    },
  }=projectDetailsBackStage;
  const projectSteps = [
    {
      title: '项目信息',
      content: <ProjectBasicInfo type='select' onChange={(value)=>dispatch({type:'projectDetailsBackStage/selectProject',payload:value})} selectProject={projectId} showData={showData} projectList={projectList}/>,
    }, {
      title: '项目相册',
      content: loading?<DxLoadingShadow visible={loading}/>:<ProjectAlbum mainData={showData}/>,
    }, {
      title: '户型图',
      content: loading?<DxLoadingShadow visible={loading}/>:<HouseImgInfo mainData={showData} current={pageNo} total={total} onpageChange={(pageNumber)=>dispatch({type:'projectDetailsBackStage/changeImgNumber',payload:pageNumber})}/>,
    }, {
      title: '项目销控表',
      content:loading?<DxLoadingShadow visible={loading}/>:<HousesSalesTable mainData={showData} current={pageNo} total={total} onpageChange={(pageNumber)=>dispatch({type:'projectDetailsBackStage/changePageNumber',payload:pageNumber})}/>,
    }, {
      title: '项目优惠',
      content: loading?<DxLoadingShadow visible={loading}/>:<ProjectDiscounts mainData={showData} current={pageNo} total={total} onpageChange={(pageNumber)=>dispatch({type:'projectDetailsBackStage/changePageDiscounts',payload:pageNumber})}/>,
    }, {
      title: '项目资质',
      content: <ProjectCertificates picCredentialsList={picCredentialsList}/>,
    }
  ];
  function promptOkCallBack(){
    const {todo}=promptObj;
    console.log('todo',todo);
    switch(todo){
      case 'getOut':
        return dispatch({type:'projectDetailsBackStage/getOut'})
      default:
        return dispatch({type:'projectDetailsBackStage/togglePromptObj',payload:{visible:false}})
    }
  }
  function promptCancelCallBack(){
    const {todo}=promptObj;
    console.log('todo',todo);
  }
  const stepwatch=(key)=>{
    console.log(key,'key');
    if(key=='项目信息'){
      dispatch({type:'projectDetailsBackStage/goPrev',payload:1})
    }else if (key=='项目相册') {
      dispatch({type:'projectDetailsBackStage/goPrev',payload:2})
    }else if(key=='户型图'){
      dispatch({type:'projectDetailsBackStage/goPrev',payload:3})
    }else if(key=='项目销控表'){
      dispatch({type:'projectDetailsBackStage/goPrev',payload:4})
    }else if(key=='项目优惠'){
      dispatch({type:'projectDetailsBackStage/goPrev',payload:5})
    }else if(key=='项目资质'){
      dispatch({type:'projectDetailsBackStage/goPrev',payload:6})
    }
  }
  return(
    <div className='newHouseTrade_projectDetails'>
      <PromptModal {...promptObj} onOk={promptOkCallBack} onCancel={promptCancelCallBack}/>
      <Steps current={current} className='newHouseTrade_projectDetails_step' style={{cursor:'pointer'}}>
        {projectSteps.map(item => <Step key={item.title} title={item.title} onClick={()=>stepwatch(item.title)}/>)}
      </Steps>
      <div className="steps-content">{projectSteps[current].content}</div>
      <div className="steps-action">
        {
          current < projectSteps.length - 1
          &&
          <Button type='primary' onClick={()=>dispatch({type:'projectDetailsBackStage/goNext',payload:current})}>下一步</Button>
        }
        {
          current > 0
          &&
          <Button type='ghost' onClick={()=>dispatch({type:'projectDetailsBackStage/goPrev',payload:current})}>
            上一步
          </Button>
        }
        <Button type='ghost' onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
      </div>
    </div>
  )
}
ProjectDetails.propTypes={

}
function mapStateToProps({projectDetailsBackStage}) {
  return {projectDetailsBackStage}
}

export default connect(mapStateToProps)(ProjectDetails)
