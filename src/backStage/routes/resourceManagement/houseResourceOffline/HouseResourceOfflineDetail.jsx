import React from 'react'
import {connect } from 'dva'
import { routerRedux } from 'dva/router';
import {Steps,Button,Form,message} from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'
import './HouseResourceOfflineDetail.css'
import NewHouseDetail from './NewHouseDetail'
import NewHouseImg from './NewHouseImg'
import NewHouseMangement from './NewHouseMangement'
import NewHouseSellControlTable from './NewHouseSellControlTable'
import NewHouseDiscountArr from './NewHouseDiscountArr'
import NewHouseCertificatesImg from './NewHouseCertificatesImg'
const FormItem=Form.Item;
const Step = Steps.Step;
function HouseResourceOfflineDetail({dispatch,houseResourceOfflineDetail,form}){
  const {current,
    newHouseDetailObj,
    id,
    transCode,
    newHouseImgArr,
    mangementSource,
    sellControltotal,
    sellControlpageNo,
    sellControlTableArr,
    discountArr,
    discounttotal,
    discountpageNo,
    certificatesImgArr
  }=houseResourceOfflineDetail;
  const {getFieldDecorator}=form;
  //销控表分页
  const sellControlChange=(key)=>{
    dispatch({
      type:'houseResourceOfflineDetail/newHouseSellControlTable',
      payload:{projectId:id,pageNo:key-1,pageSize:10}
    })
  }
  //项目优惠分页
  const discountArrChange=(key)=>{
    dispatch({
      type:'houseResourceOfflineDetail/newHouseDiscount',
      payload:{projectId:id,pageNo:key-1,pageSize:10}
    })
  }
  const steps = [{
    title: '项目信息',
    content: <NewHouseDetail newHouseDetailObj={newHouseDetailObj}/>,
    },
    {
      title: '项目相册',
      content: <NewHouseImg newHouseImgArr={newHouseImgArr}/>,
    },
    {
    title: '户型图管理',
    content: <NewHouseMangement mangementSource={mangementSource}/>,
    },
    {
    title: '项目销控表',
    content: <NewHouseSellControlTable sellControlTableArr={sellControlTableArr}
      sellControltotal={sellControltotal} sellControlpageNo={sellControlpageNo}
      sellControlChange={sellControlChange}
      />,
    },
    {
    title: '项目优惠',
    content: <NewHouseDiscountArr discountArr={discountArr}
        discounttotal={discounttotal} discountpageNo={discountpageNo} discountArrChange={discountArrChange}
      />,
    },
    {
    title: '项目资质',
    content: <NewHouseCertificatesImg certificatesImgArr={certificatesImgArr}/>,
    },
  ];

  //带看记录的回调
  const next=()=>{
    const currents =current + 1;
    switch (currents) {
      case 1:
        dispatch({
          type:'houseResourceOfflineDetail/newHouseImg',
          payload:{projectId:id}
        })
        break;
      case 2:
        dispatch({
          type:'houseResourceOfflineDetail/newHouseMangement',
          payload:{projectId:id,pageNo:0,pageSize:10000}
        })
        break;
      case 3:
        dispatch({
          type:'houseResourceOfflineDetail/newHouseSellControlTable',
          payload:{projectId:id,pageNo:0,pageSize:10}
        })
        break;
      case 4:
        dispatch({
          type:'houseResourceOfflineDetail/newHouseDiscount',
          payload:{projectId:id,pageNo:0,pageSize:10}
        })
        break;
      case 5:
        dispatch({
          type:'houseResourceOfflineDetail/newHouseQualification',
          payload:{projectId:id}
        })
        break;

      default:

    }
    dispatch({
      type:'houseResourceOfflineDetail/setState',
      payload:{current:currents}
    })
  }
  const prev=()=>{
    const currents =current - 1;
    dispatch({
      type:'houseResourceOfflineDetail/setState',
      payload:{current:currents}
    })
  }
  const goback=()=>{
    dispatch(routerRedux.goBack());
    dispatch({
      type:'houseResourceOfflineDetail/setState',
      payload:{current:0}
    })
  }
  const stepClick=(key)=>{
    switch (key) {
      case '项目信息':
        dispatch({
          type:'houseResourceOfflineDetail/houseResourceOfflineDetail',
          payload:{projectId:id}
        })
        dispatch({
          type:'houseResourceOfflineDetail/setState',
          payload:{current:0}
        })
        break;
      case '项目相册':
        dispatch({
          type:'houseResourceOfflineDetail/newHouseImg',
          payload:{projectId:id}
        })
        dispatch({
          type:'houseResourceOfflineDetail/setState',
          payload:{current:1}
        })
        break;
      case '户型图管理':
        dispatch({
          type:'houseResourceOfflineDetail/newHouseMangement',
          payload:{projectId:id,pageNo:0,pageSize:10000}
        })
        dispatch({
          type:'houseResourceOfflineDetail/setState',
          payload:{current:2}
        })
        break;
      case '项目销控表':
        dispatch({
          type:'houseResourceOfflineDetail/newHouseSellControlTable',
          payload:{projectId:id,pageNo:0,pageSize:10}
        })
        dispatch({
          type:'houseResourceOfflineDetail/setState',
          payload:{current:3}
        })
        break;
      case '项目优惠':
        dispatch({
          type:'houseResourceOfflineDetail/newHouseDiscount',
          payload:{projectId:id,pageNo:0,pageSize:10}
        })
        dispatch({
          type:'houseResourceOfflineDetail/setState',
          payload:{current:4}
        })
        break;
      case '项目资质':
        dispatch({
          type:'houseResourceOfflineDetail/newHouseQualification',
          payload:{projectId:id}
        })
        dispatch({
          type:'houseResourceOfflineDetail/setState',
          payload:{current:5}
        })
        break;

      default:

    }

  }
  return(
    <div>
      <DxPanel title=" ">
        <Steps current={current}>
          {steps.map(item => <Step key={item.title} title={item.title} onClick={()=>stepClick(item.title)}/>)}
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
function mapStateToProps({houseResourceOfflineDetail}){
  return{houseResourceOfflineDetail}
}
HouseResourceOfflineDetail = Form.create({})(HouseResourceOfflineDetail);
export default connect(mapStateToProps)(HouseResourceOfflineDetail)
