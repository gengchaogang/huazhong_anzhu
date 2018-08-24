import React from 'react';
import {connect} from 'dva';
import { routerRedux } from 'dva/router';
import {Row,Col,Input,Button,Modal,message} from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'
import Panel from '../../../../commons/components/Panel'
import DxUpLoadPic from '../../../../commons/View/DxUpLoadPic'
import './shopsImgs.css'

import '../../../../commons/css/common.css';
import '../../../../commons/css/list.css';

import PromptModal from '../../../../commons/View/PromptModal';
import commonFinalCode from '../../../../commons/utils/commonFinalCode.js';
import commonUtil from '../../../../commons/utils/commonUtil.js';
import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow';
const confirm = Modal.confirm;

function ShopsImgs({dispatch,shopsImgs}){
  const {
    showPicList,promptObj,loadingShadow,picListData,
    } = shopsImgs;

  var {houseBaseInfo} = shopsImgs;
  var {resourcesType} = houseBaseInfo;
  var {saleWay} = houseBaseInfo;

  const upLoadPicProps={
    url: commonFinalCode.addFileApiName,
    maxNum:20,//最大上传数
    maxSize:5,//文件大小限值
    showPicList:showPicList,//state管理图片list
    doCover:true,
    hideName:true,
    showDetail:true,
    changeList:(data)=>{
      dispatch({
        type:"shopsImgs/showPicList",
        payload:data
      })
    },//更新list回调
  }

  // 返回上
  const toBack=()=>{
    // 判断返回哪里
    if (resourcesType == commonFinalCode.senondHouseResourcesType_zz) {
        // 住宅
        if (saleWay == commonFinalCode.senondHouseSaleWay_cs) {
            // 出售
            dispatch(routerRedux.push({
              pathname:'/houseResourceSaleManagement/secondHandHouseSell/createSecondHandSellResource/houseResourceInfos',
              state:{ //这里传入projectId 跳转到下一个页面时监听路由把值存在state中
                  houseBaseInfo:houseBaseInfo
              }
            }))
        }else if (saleWay == commonFinalCode.senondHouseSaleWay_cz) {
            // 出租
            dispatch(routerRedux.push({
              pathname:'/houseResourceRentManagement/secondHandHouseRent/createSecondHandRentResource/houseResourceInfosRent',
              state:{ //这里传入projectId 跳转到下一个页面时监听路由把值存在state中
                  houseBaseInfo:houseBaseInfo
              }
            }))
        }
    }else if (resourcesType == commonFinalCode.senondHouseResourcesType_sp) {
        // 商铺
        if (saleWay == commonFinalCode.senondHouseSaleWay_cs) {
            // 出售
            dispatch(routerRedux.push({
              pathname:'/houseResourceSaleManagement/shopsSell/createShopsSellResource/shopsResourceInfos',
              state:{ //这里传入projectId 跳转到下一个页面时监听路由把值存在state中
                  houseBaseInfo:houseBaseInfo
              }
            }))
        }else if (saleWay == commonFinalCode.senondHouseSaleWay_cz) {
            // 出租
            dispatch(routerRedux.push({
              pathname:'/houseResourceRentManagement/shopsRent/createShopsRentResource/shopsResourceInfosRent',
              state:{ //这里传入projectId 跳转到下一个页面时监听路由把值存在state中
                  houseBaseInfo:houseBaseInfo
              }
            }))
        }
    }else if (resourcesType == commonFinalCode.senondHouseResourcesType_xzl) {
        // 写字楼
        if (saleWay == commonFinalCode.senondHouseSaleWay_cs) {
            // 出售
            dispatch(routerRedux.push({
              pathname:'/houseResourceSaleManagement/officeSell/createOfficeSellResource/officeResourceInfos',
              state:{ //这里传入projectId 跳转到下一个页面时监听路由把值存在state中
                  houseBaseInfo:houseBaseInfo
              }
            }))
        }else if (saleWay == commonFinalCode.senondHouseSaleWay_cz) {
            // 出租
            dispatch(routerRedux.push({
              pathname:'/houseResourceRentManagement/officeRent/createOfficeRentResource/officeResourceInfosRent',
              state:{ //这里传入projectId 跳转到下一个页面时监听路由把值存在state中
                  houseBaseInfo:houseBaseInfo
              }
            }))
        }
    }
  }

  const toNext=()=>{
    if(showPicList.length){
      dispatch({
        type:'shopsImgs/submitData',
        payload:{
        },
      });
    }else{
      message.error("请上传至少一张房源图片!")
    }
  }

  const onOkCallBack=()=>{
      if(promptObj.todo==='closeModal'){
        dispatch({
          type:"shopsImgs/togglePrompt",
          payload:{
            visible:false
          }
        })
      }
  }
  const onCancelCallBack=()=>{}

  const deletePic=(id)=>{
      confirm({
          title: "确定删除该图片？",
          onOk() {
            dispatch({
                type:"shopsImgs/deletePic",
                payload:{
                  id:id,
                }
            })
          },
          onCancel() {},
      });
  }


  return(
    <div className="houseImgs">
      <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack}/>
      <DxLoadingShadow visible={loadingShadow} />
      <Panel title={<div className="ant-form-item-required">房源图片</div>}/>
      <div className="houseReImgs">
        <div className="tips">
          上传说明：图片清晰可见；图片大小不超过5M；不得上传 gif 格式或者其他格式的动态图；不得发布虚假的房源图片；不得在图片上加盖任何水印。
        </div>
        <Row>
          <Col>
            <DxUpLoadPic {...upLoadPicProps}/>
          </Col>
          <Col>
            <div className="operation_button">
              <Button type="ghost" onClick={toBack}>上一步</Button>
              <Button type="primary" onClick={toNext}>下一步</Button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

function mapStateToProps({shopsImgs}){
  return{shopsImgs}
}
export default connect(mapStateToProps)(ShopsImgs)
