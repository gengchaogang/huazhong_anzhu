import React from 'react'
import {connect } from 'dva'
import { routerRedux } from 'dva/router';
import {Steps,Button,Form,message} from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'
import './SecHouseShopOffceDetail.css'
import SecHouseShopOffceHousingDetails from './SecHouseShopOffceHousingDetails'
import SecHouseShopOffceImg from './SecHouseShopOffceImg'
import SecHouseShopOffceBroker from './SecHouseShopOffceBroker'
import SecHouseShopOffceTapeRecord from './SecHouseShopOffceTapeRecord'
import SecHouseShopOffceDone from './SecHouseShopOffceDone'

const FormItem=Form.Item;
const Step = Steps.Step;
function SecHouseShopOffceDetail({dispatch,secHouseShopOffceDetail,form}){
  const {current,
    houseBaseInfo,
    listOwer,
    brokerPromotion,
    offLineInfos,
    guideArr,
    total,
    pageNo,
    id,
    status,
    transCode,
    track,
    issaleWay,
    trackJSON,
  }=secHouseShopOffceDetail;
  // console.log(transCode,'guideArr');
  const {getFieldDecorator}=form;
  //带看记录分页
  const pageChange=(key)=>{
    dispatch({
      type:'officeRentDetail/findAllGuide',
      payload:{
        pageNo:key-1,
        id:id,
        status:status,
      }
    })
  }
  //带看记录状态切换
  const radioChange=(key)=>{
    dispatch({
      type:'officeRentDetail/findAllGuide',
      payload:{
        pageNo:0,
        id:id,
        status:(key=='全部'?'':key)
      }
    })
  }
  const steps = [{
    title: '房源详情',
    content: <SecHouseShopOffceHousingDetails houseBaseInfo={houseBaseInfo} listOwer={listOwer} offLineInfos={offLineInfos}/>,
    },
    {
      title: '视频图片',
      content: <SecHouseShopOffceImg houseBaseInfo={houseBaseInfo}/>,
    },
    {
      title: '代理经纪人',
      content: <SecHouseShopOffceBroker brokerPromotion={brokerPromotion}/>,
    },
    {
      title: '带看记录',
      content: <SecHouseShopOffceTapeRecord guideArr={guideArr} total={total} pageNo={pageNo} pageChange={pageChange} radioChange={radioChange}/>,
    },
    {
      title: '成交',
      content:<SecHouseShopOffceDone issaleWay={issaleWay} trackJSON={trackJSON}/>,
    },
  ];
  const next=()=>{
    const currents =current + 1;
    dispatch({
      type:'secHouseShopOffceDetail/setState',
      payload:{current:currents}
    })
    if(currents==3){
      dispatch({
        type:'secHouseShopOffceDetail/findAllGuide',
        payload:{
          id:id,
          pageNo:0,
          status:'',
        }
      })
    }
    if(currents==4 && transCode){
      dispatch({
        type:'secHouseShopOffceDetail/findAllTransCode',
        payload:{groupKey:transCode}
      })
    }
  }
  const prev=()=>{
    const currents =current - 1;
    dispatch({
      type:'secHouseShopOffceDetail/setState',
      payload:{current:currents}
    })
  }
  const stepwatch=(key)=>{
    if(key=='房源详情'){
      dispatch({
        type:'secHouseShopOffceDetail/setState',
        payload:{current:0}
      })
    }else if(key=='视频图片'){
      dispatch({
        type:'secHouseShopOffceDetail/setState',
        payload:{current:1}
      })
    }else if(key=='代理经纪人'){
      dispatch({
        type:'secHouseShopOffceDetail/setState',
        payload:{current:2}
      })
    }else if(key=='带看记录'){
      dispatch({
        type:'secHouseShopOffceDetail/setState',
        payload:{current:3}
      })
      if(!!id){
        dispatch({
          type:'secHouseShopOffceDetail/findAllGuide',
          payload:{
            id:id,
            pageNo:0,
            status:'',
          }
        })
      }
    }else if(key=='成交'){
      dispatch({
        type:'secHouseShopOffceDetail/setState',
        payload:{current:4}
      })
      if(!!transCode){
        dispatch({
          type:'secHouseShopOffceDetail/findAllTransCode',
          payload:{groupKey:transCode}
        })
      }
    }
  }
  const goback=()=>{
    dispatch(routerRedux.goBack());
    dispatch({
      type:'secHouseShopOffceDetail/setState',
      payload:{current:0}
    })
  }
  return(
    <div>
      <DxPanel title=" ">
        <Steps current={current}>
          {steps.map(item => <Step key={item.title} title={item.title} onClick={()=>stepwatch(item.title)}/>)}
        </Steps>
      </DxPanel>
      <div>{steps[current].content}</div>
        <div>
          {
            current < steps.length - 1
            &&
            <Button type="primary" onClick={next}>下一步</Button>
          }
          {
            current === steps.length - 1
            &&
            <Button type="primary" onClick={() => message.success('！已经是最后一步了')}>完成</Button>
          }
          {
            current > 0
            &&
            <Button type='ghost' style={{ marginLeft: 8 }} onClick={prev}>
              上一步
            </Button>
          }
          <Button type='ghost gobackghost' onClick={goback}>返回</Button>
        </div>
    </div>
  )
}
function mapStateToProps({secHouseShopOffceDetail}){
  return{secHouseShopOffceDetail}
}
SecHouseShopOffceDetail = Form.create({})(SecHouseShopOffceDetail);
export default connect(mapStateToProps)(SecHouseShopOffceDetail)
