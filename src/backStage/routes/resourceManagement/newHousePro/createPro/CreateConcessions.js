import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

import { Table, Button } from 'antd';
import './createConcessions.css';
import TitleBar from '../../../../../commons/UI/TitleBar';
import TableList from '../../../../components/resourceManagement/newHousePro/create/createConcessions/TableList';
import EditItem from '../../../../components/resourceManagement/newHousePro/create/createConcessions/EditItem';
import CreateGroupBuying from '../../../../components/resourceManagement/newHousePro/create/createConcessions/CreateGroupBuying';


function CreateConcessions({ location, dispatch,createConcessions,next,prev }) {
  const {selectedRowKeys,delLoading,total,pageSize}=createConcessions//TableList所用属性
  const {submitLoading,modalVisible,applicability }=createConcessions//CreateGroupBuying所用属性
  const {
    edit_submitLoading,
    edit_modalVisible,
    edit_applicability,
    edit_record,

    edit_changeVisible,
    edit_changeApplicability,
    edit_changeSubmitLoading,
  }=createConcessions//EditItem所用属性
  
  //改变创建团购modal的开关
  const changeVisible=(bool)=>{
    console.log('in changeVisible bool>',bool)
    dispatch({
      type:'createConcessions/changeVisible',
      payload:{
        modalVisible:bool,
      }
    });
  };
  //改变编辑modal的开关
  const changeEditVisible=(record,bool)=>{
    console.log('in changeVisible bool>',bool)
    dispatch({
      type:'createConcessions/changeEditVisible',
      payload:{
        edit_record:record,
        edit_modalVisible:bool,
      }
    });
  };
  const tableListProps={
  	selectedRowKeys,
  	delLoading,
    total,
    pageSize,

    changeEditVisible,
  	onSelectChange:(selectedRowKeys)=>{
  		console.log('selectedRowKeys>>>>>>',selectedRowKeys);
  		dispatch({
  			type:'createConcessions/onSelectChange',
  			payload:{
  				selectedRowKeys
  			}
  		});
  	},
    changeDelLoading:(bool)=>{
      dispatch({
        type:'createConcessions/changeDelLoading',
        payload:{
          delLoading:bool,
        }
      })
    },
  };
  const createGroupBuyingProps={
    submitLoading,
    modalVisible,
    applicability,
    
    changeVisible,
    changeApplicability:(applicability)=>{
      dispatch({
        type:'createConcessions/changeApplicability',
        payload:{
          applicability:applicability
        }
      })
    },
    changeSubmitLoading:(bool)=>{
      console.log('in changeSubmitLoading');
      dispatch({
        type:'createConcessions/changeApplicability',
        payload:{
          submitLoading:bool
        }
      })
    },
  };
  const editItemProps={
    edit_record,
    edit_submitLoading,
    edit_modalVisible,
    edit_applicability,

    changeEditVisible,
    changeApplicability:(applicability)=>{
      dispatch({
        type:'createConcessions/changeApplicability',
        payload:{
          edit_applicability:applicability
        }
      })
    },
    changeSubmitLoading:(bool)=>{
      console.log('in changeSubmitLoading');
      dispatch({
        type:'createConcessions/changeApplicability',
        payload:{
          edit_submitLoading:bool
        }
      })
    },
  };
  return (
    <div className='container'>
      <TitleBar title='创建电商优惠'/>
      <div className='buttonCreate'>
        <Button type="primary" style={{borderColor:'#43B38D', backgroundColor:'#43B38D'}} onClick={()=>{changeVisible(true)}}>创建团购</Button>
        <CreateGroupBuying {...createGroupBuyingProps}/>
      </div>
      <TableList {...tableListProps}/>
      <EditItem {...editItemProps}/>
      <div className='footer'>
      	<Button type="default" onClick={prev}>返回上一步</Button>
      	<Button type="primary" style={{borderColor:'#43B38D', backgroundColor:'#43B38D'}} onClick={next}>下一步上传项目资质</Button>
      </div>
    </div>
  );
}
function mapStateToProps({ createConcessions }) {
  return { createConcessions }
}
export default connect(mapStateToProps)(CreateConcessions);