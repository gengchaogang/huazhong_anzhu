import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input,Table,Tabs,Button,Modal,Cascader} from 'antd';
import DxPanel from '../../../../commons/components/DxPanel'
import SearchKeyBox from '../../../components/searchKeyBox/SearchKeyBox'
import './RemoveRelationApplication.css'
const TabPane = Tabs.TabPane;
function RemoveRelationApplication({dispatch,removeRelationApplication}) {
  const {cascaderOptions,dataApplyList,dataDisposeList,masterStatus,
    relationship,total,pageNo,cityNames,name,loading
  }=removeRelationApplication;
  const columns=[
    {
      title:'序号',
      dataIndex:'number',
    },
    {
      title:'申请时间',
      dataIndex:'time',
    },
    {
      title:'关系',
      dataIndex:'relationship',
    },
    {
      title:'申请人',
      dataIndex:'applyBrokerName',
    },
    {
      title:'角色',
      dataIndex:'applyBrokerRole',
    },
    {
      title:'申请人所在地区',
      dataIndex:'applyBrokerCityNames',
    },
    {
      title:'关系人',
      dataIndex:'relationBrokerName',
    },
    {
      title:'角色',
      dataIndex:'relationBrokerRole',
    },
    {
      title:'关系人所在地区',
      dataIndex:'relationBrokerCityNames',
    },
    {
      title:'操作',
      dataIndex:'operation',
      render:(text,record)=>{
        if(masterStatus=='待处理'){
          return (
            <span className='operationColor' onClick={()=>dealDetail(record.key)}>处理</span>
          )
        }else{
          return (
            <span className='operationColor' onClick={()=>dealDetail(record.key)}>详情</span>
          )
        }
      }
    }
  ]
  //处理详情
  const dealDetail=(key)=>{
    dispatch(routerRedux.push({
			pathname: `/contentCheck/removeRelationApplication/dealDetailMaster`,
      state:{
        id:key,
        masterStatus:masterStatus,
        relationship:relationship,
      }
		}));
  }
  //搜索
  const formSearch=(data)=>{
    dispatch({
      type:'removeRelationApplication/initailSuccess',
      payload:{loading:true}
    })
    if(data.relationship=='师徒'){
      if(masterStatus=='待处理'){
        let cityNames;
        if(!!data.city){
          cityNames='/'+data.city.join('/')
        }
        dispatch({
          type:'removeRelationApplication/findApplyList',
          payload:{
            cityNames:cityNames,
            name:data.keyword,
            pageNo:0,
          }
        })
      }else if(masterStatus=='已处理'){
        let cityNames;
        if(!!data.city){
          cityNames='/'+data.city.join('/')
        }
        dispatch({
          type:'removeRelationApplication/findDisposeList',
          payload:{
            cityNames:cityNames,
            name:data.keyword,
            pageNo:0,
          }
        })
      }
    }else{
      if(masterStatus=='待处理'){
        let cityNames;
        if(!!data.city){
          cityNames='/'+data.city.join('/')
        }
        dispatch({
          type:'removeRelationApplication/findBrokerStateApplyList',
          payload:{
            cityNames:cityNames,
            name:data.keyword,
            pageNo:0,
          }
        })
      }else if(masterStatus=='已处理'){
        let cityNames;
        if(!!data.city){
          cityNames='/'+data.city.join('/')
        }
        dispatch({
          type:'removeRelationApplication/findBrokerStateList',
          payload:{
            cityNames:cityNames,
            name:data.keyword,
            pageNo:0,
          }
        })
      }
    }
  }
  //重置
  const resetField=()=>{

  }
  const callback=(key)=>{
    dispatch({
      type:'removeRelationApplication/initailSuccess',
      payload:{loading:true}
    })
    if(relationship=='师徒'){
      if(key=='已处理'){
        dispatch({
          type:'removeRelationApplication/findDisposeList',
          payload:{
            cityNames:'',
            name:'',
            pageNo:0,
          }
        })
      }else {
        dispatch({
          type:'removeRelationApplication/findApplyList',
          payload:{
            cityNames:'',
            name:'',
            pageNo:0,
          }
        })
      }
    }else{
      if(key=='已处理'){
        dispatch({
          type:'removeRelationApplication/findBrokerStateList',
          payload:{
            cityNames:'',
            name:'',
            pageNo:0,
          }
        })
      }else {
        dispatch({
          type:'removeRelationApplication/findBrokerStateApplyList',
          payload:{
            cityNames:'',
            name:'',
            pageNo:0,
          }
        })
      }
    }
    dispatch({
      type:'removeRelationApplication/initailSuccess',
      payload:{masterStatus:key}
    })
  }
  const pagination={
    total:total,
    showTotal:total => `共 ${total} 项`,
    current:pageNo,
    onChange:(page)=>{
      dispatch({
        type:'removeRelationApplication/initailSuccess',
        payload:{loading:true}
      })
      if(relationship=='师徒'){
        if(masterStatus=='待处理'){
          dispatch({
            type:'removeRelationApplication/findApplyList',
            payload:{
              pageNo:page-1,
              cityNames:cityNames,
              name:name,
            }
          })
        }else{
          dispatch({
            type:'removeRelationApplication/findDisposeList',
            payload:{
              pageNo:page-1,
              cityNames:cityNames,
              name:name,
            }
          })
        }
      }else{
        if(masterStatus=='待处理'){
          dispatch({
            type:'removeRelationApplication/findBrokerStateApplyList',
            payload:{
              pageNo:page-1,
              cityNames:cityNames,
              name:name,
            }
          })
        }else{
          dispatch({
            type:'removeRelationApplication/findBrokerStateList',
            payload:{
              pageNo:page-1,
              cityNames:cityNames,
              name:name,
            }
          })
        }
      }
    },
  }
  return (
    <div>
      <SearchKeyBox areaSelet={true} onChange={formSearch} resetField={resetField}
        cascaderOptions={cascaderOptions}
        isMaster={true}
        placeholder='搜索名称'/>
      <Tabs defaultActiveKey='待处理' onChange={callback} type='card'>
        <TabPane tab="待处理" key="待处理">
          <Table columns={columns} dataSource={dataApplyList}
            pagination={pagination}
            loading={loading}
          />
        </TabPane>
        <TabPane tab="已处理" key="已处理">
          <Table columns={columns} dataSource={dataDisposeList}
            pagination={pagination}
            loading={loading}
          />
        </TabPane>
      </Tabs>
    </div>
  );
}

function mapStateToProps({removeRelationApplication}) {
  return {removeRelationApplication}
}

export default connect(mapStateToProps)(RemoveRelationApplication);
