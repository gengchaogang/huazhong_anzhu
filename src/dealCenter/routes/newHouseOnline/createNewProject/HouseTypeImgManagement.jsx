import React from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router'
import TitleBar from '../../../../commons/UI/TitleBar';
import CheckableTags from '../../../../commons/UI/CheckableTags';
import DxPanel from '../../../../commons/components/DxPanel'
import "./HouseTypeImgManagement.css"
import CreateHouseType from './../createPro/CreateHouseType'
import {Button,Row,Col,Table,Icon,Form,Radio,Switch,Tag} from 'antd';
import img1 from '../../../assets/images/img1.jpg';
import img2 from '../../../assets/images/img2.jpg';
import img3 from '../../../assets/images/img3.jpg';
import CreateHouseTypeModal from './CreateHouseTypeModal'
import PromptModal from'../../../../commons/View/PromptModal'
const CheckableTag = Tag.CheckableTag;
const houseTypesTags=[]
function HouseTypeImgManagement({dispatch,houseTypeImgManagement,onSubmit,label}){
  const {
    totalElements,
    createhousetype,
    loading,
    selectedRowKeys,
    reEdit,
    projectId,
    isEdit,
    promptObj,
    data,
    hauseTypeSales,
    residentialRoom
  }=houseTypeImgManagement
  const columns = [{
    title: '全选',
    dataIndex: 'img',
    width:'10%',
    render: text => <a><img src={text} style={{width:'100px',height:'100px'}}/></a>,
    }, {
      title: '',
      width:'55%',
      dataIndex: 'info',
      render: text =>
      <div className="tableContent">
        <Row>
          <Col sm={24} md={24} className="houseTypeName">{text.type}</Col>
          <Col sm={24} md={24}>
            <CheckableTags
              tags={text.tip}
              disabled multiple={true}
              customStyle={{border:'1px solid #ddd',
                padding:'4px 8px',
                fontSize:'14px',
                background:'rgb(66, 179, 139)',
                color:'#fff'}}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={24} md={6}>居室: {text.housewear}</Col>
          <Col sm={24} md={6}>建筑面积: {text.buildArea}</Col>
          {/*          <Col sm={24} md={6}>套内面积: {text.houseArea}</Col>*/}
        </Row>
        <Row>
          <Col sm={24} md={6}>参考均价: {text.referencePrice}</Col>
          <Col sm={24} md={6}>参考总价: {text.priceTotal}</Col>
          <Col sm={24} md={6}>{text.isLead?"主力户型":null}</Col>
        </Row>
      </div>
    }, {
          title: '',
          width:'25%',
          className:"text-align",
          dataIndex: 'date',
    }];
  const onSelectChange=(selectedRowKeys)=>{
    dispatch({
        type:'houseTypeImgManagement/modifySelect',
        payload:selectedRowKeys
      })
    }
  const rowSelection = {
    selectedRowKeys,
    onChange:onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  const onDelete=()=>{
    dispatch({
      type:"houseTypeImgManagement/deleteHouseTypes",
      payload:{id:selectedRowKeys}
    })
    dispatch({
      type:'houseTypeImgManagement/clearTableData',
      payload:{
        selectedRowKeys:[],
      }
    })
    }
  const toBack=()=>{
    dispatch(
      routerRedux.push({
        pathname:'newHouseOnline/projectManagement/createProject/uploadProjectPhoto',
        state:{
          projectId:projectId,
          isEdit:true,
          reEdit,
        }
      })
    )
  }
  const toNext=()=>{
      if(data.length===0){
        dispatch({
          type:"houseTypeImgManagement/togglePrompt",
          payload:{
            type:'error',
            title:'跳转到下一步失败!',
            description:'户型至少创建一项!',
            visible:true,
            todo:'closeModal',
          }
        })
      }
      else{
        dispatch(
          routerRedux.push({
            pathname:'newHouseOnline/projectManagement/createProject/createProjectTable',
            state:{
              projectId:projectId,
              isEdit:isEdit,
              reEdit,
            }
          })
        )
      }

  }
  const onOkCallBack=()=>{
    if(promptObj.todo==="closeAddHouseTypeModal"){
      if(promptObj.type==='success'){
        dispatch({
          type:'houseTypeImgManagement/closeAddHouseTypeModal'
        })
      }else{
        dispatch({
          type:"houseTypeImgManagement/togglePrompt",
          payload:{
            visible:false,
          }
        })
      }
    }
    if(promptObj.todo==="closeAndSendFetch"){
      if(promptObj.type==='success'){
        dispatch({
          type:'houseTypeImgManagement/closeAndSendFetch'
        })
      }else{
        dispatch({
          type:"houseTypeImgManagement/togglePrompt",
          payload:{
            visible:false,
          }
        })
      }
    }
    if(promptObj.todo==='closeModal'){
      dispatch({
        type:'houseTypeImgManagement/togglePrompt',
        payload:{
          visible:false
        }
      })
    }
  }
  const onCancelCallBack=()=>{}
  const pagination={
    total:totalElements,
    showTotal:(totalElements)=>{return(`共 ${totalElements}项`)},
    pageSiz:10,
    onChange:(page)=>{
      dispatch({
        type:"houseTypeImgManagement/getInitHouseTypesData",
        payload:{
          pageSiz:10,
          pageNo:page-1
        }
      })
    }
  }
  return(
    <div>
      <DxPanel title="项目室内户型图">
        <PromptModal visible={promptObj.visible} type={promptObj.type} title={promptObj.title} okText={promptObj.okText} cancelText={promptObj.cancelText}  onOk={onOkCallBack} onCancel={onCancelCallBack}/>
        <div className="showImg">
          <div className="buttonGroup">
            <Button type="primary" onClick={onDelete} disabled={reEdit || !hasSelected} loading={loading}>删除房源</Button>
            <CreateHouseTypeModal label={label} residentialRoom={residentialRoom}/>
            <span style={{ marginLeft: 8 }}>{hasSelected ? `选中 ${selectedRowKeys.length} 项` : ''}</span>
          </div>
          <Table  id="imgTable"rowSelection={rowSelection} columns={columns} dataSource={data} pagination={pagination} />
          <div className='next'>
            <Button type="ghost" onClick={toBack}>返回上一步</Button>
            <Button type="primary" onClick={toNext}>下一步创建项目项控表</Button>
          </div>
        </div>
      </DxPanel>
    </div>
  )
}
function mapStateToProps({ houseTypeImgManagement }) {
  return { houseTypeImgManagement }
}
export default connect(mapStateToProps)(HouseTypeImgManagement);
