import React, { PropTypes } from 'react'
import {Steps, Button, message}from 'antd'
const Step = Steps.Step;
import textPic from '../../../assets/yay.jpg'
import DxPanel from '../../../../commons/components/DxPanel'
import ProjectBasicInfo from '../../../components/NewHouseTrade/ProjectDetailsItem/ProjectBasicInfo'
import ProjectAlbum from '../../../components/NewHouseTrade/ProjectDetailsItem/ProjectAlbum'
import HouseImgInfo from '../../../components/NewHouseTrade/ProjectDetailsItem/HouseImgInfo'
import HousesSalesTable from '../../../components/NewHouseTrade/ProjectDetailsItem/HousesSalesTable'
import ProjectDiscounts from '../../../components/NewHouseTrade/ProjectDetailsItem/ProjectDiscounts'
import ProjectCertificates from '../../../components/NewHouseTrade/ProjectDetailsItem/ProjectCertificates'
import ProjectDetailsSteps from '../../../components/NewHouseTrade/ProjectDetailsItem/ProjectDetailsSteps'
import PromptModal from '../../../../commons/View/PromptModal'
import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'

import './ProjectDetails.css'


function ProjectDetails({dispatch,projectDetails}){
  const {
    projectId,
    projectList,
    showData,
    loading,
    current,
    promptObj,
    pagination:{
      currentPage,
      totalElems,
    },
  }=projectDetails;
  const projectSteps = [
    {
      title: '项目信息',
      content: <ProjectBasicInfo type='select' onChange={(value)=>dispatch({type:'projectDetails/selectProject',payload:value})} selectProject={projectId} showData={showData} projectList={projectList}/>,
    }, {
      title: '项目相册',
      content: loading?<DxLoadingShadow zIndex={1000} visible={loading}/>:<ProjectAlbum mainData={showData}/>,
    }, {
      title: '户型图',
      content: loading?<DxLoadingShadow zIndex={1000} visible={loading}/>:<HouseImgInfo mainData={showData} current={currentPage} total={totalElems} onChange={(pageNumber)=>dispatch({type:'projectDetails/changePageNumber',payload:pageNumber})}/>,
    }, {
      title: '项目销控表',
      content:loading?<DxLoadingShadow zIndex={1000} visible={loading}/>:<HousesSalesTable mainData={showData} current={currentPage} total={totalElems} onChange={(pageNumber)=>dispatch({type:'projectDetails/changePageNumber',payload:pageNumber})}/>,
    }, {
      title: '项目优惠',
      content: loading?<DxLoadingShadow zIndex={1000} visible={loading}/>:<ProjectDiscounts mainData={showData} current={currentPage} total={totalElems} onChange={(pageNumber)=>dispatch({type:'projectDetails/changePageNumber',payload:pageNumber})}/>,
    }, {
      title: '项目资质',
      content:  loading?<DxLoadingShadow zIndex={1000} visible={loading}/>:<ProjectCertificates mainData={showData}/>,
    }
  ];
  function promptOkCallBack(){
    const {todo}=promptObj;
    switch(todo){
      case 'getOut':
        return dispatch({type:'projectDetails/getOut'})
      default:
        return dispatch({type:'projectDetails/togglePromptObj',payload:{visible:false}})
    }
  }
  function promptCancelCallBack(){
    const {todo}=promptObj;
  }
  return(
    <div className='newHouseTrade_projectDetails'>
      <PromptModal {...promptObj} onOk={promptOkCallBack} onCancel={promptCancelCallBack}/>
      <Steps current={current} className='newHouseTrade_projectDetails_step'>
        {projectSteps.map(item => <Step key={item.title} title={item.title} />)}
      </Steps>
      <ProjectDetailsSteps current={current} currentChange={(index)=>dispatch({type:'projectDetails/goPrev',payload:index+1})}/>
      <div className="steps-content">{projectSteps[current].content}</div>
      <div className="steps-action">
        {
          current < projectSteps.length - 1
          &&
          <Button type='primary' onClick={()=>dispatch({type:'projectDetails/goNext',payload:current})}>下一步</Button>
        }
        {
          current > 0
          &&
          <Button type='ghost' onClick={()=>dispatch({type:'projectDetails/goPrev',payload:current})}>
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
function mapStateToProps({projectDetails}) {
  return {projectDetails}
}

export default connect(mapStateToProps)(ProjectDetails)
