import React from 'react'
import {connect} from 'dva'
import {Button,Steps,message} from 'antd'
import CreateNewHouse from './CreateNewHouse'
import UploadHousePhotoes from './UploadHousePhotoes'
import ImgManagement from './ImgManagement'
import CreateConcessions from './CreateConcessions'
import UploadAptitude from './UploadAptitude'
import CreateProjectTable from './CreateProjectTable'
import './NavBar.css'

const Step = Steps.Step;
function NavBar({dispatch,step}){
  const {current}=step;
  const next=()=>{
    dispatch({
      type:"step/next",
    });
  }
  const prev=()=>{
    dispatch({
      type:"step/prev",
    })
  }
  const returnValue=()=>{
    switch(step.current){
      case 0 : return ('')
    }
  }
  const steps = [
    {
    title: '填写项目信息',
    content:  <CreateNewHouse
      onSubmit={(data,)=>{
        //  处理data
        // console.log('data is',data)
        dispatch({
          type:'step/uploadNewHouse',
          payload:{
            ...data
          }
        })
      next();
    }}
    type="new"
    editable={true}
  />,
  }, {
    title: '上传项目相册',
    content:<UploadHousePhotoes next={next} prev={prev}/>
  },
  {
    title: '户型图管理',
    content: <ImgManagement next={next} prev={prev}/>,
  },{
    title:'创建项目销控表',
    content:<CreateProjectTable next={next} prev={prev}/>
  },{
    title:'创建电商优惠',
    content:<CreateConcessions next={next} prev={prev}/>
  },{
    title:'上传项目资质',
    content:<UploadAptitude next={next} prev={prev}/>
  }];


  return(
    <div>
      <Steps current={current}>
        {steps.map(item => <Step key={item.title} title={item.title}/>)}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
    </div>
  )
}
function mapStateToProps({ step}) {
  return { step }
}

export default connect(mapStateToProps)(NavBar)
