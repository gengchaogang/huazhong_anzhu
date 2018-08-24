import React from 'react'
import {connect} from 'dva'
import { routerRedux } from 'dva/router';
import {Table,Button,Modal,Input,Row,Col} from 'antd'
import DxPanel from '../../../commons/components/DxPanel'
import PromptModal from '../../../commons/View/PromptModal'

function CommissionAdjustRecord({commissionAdjustRecord,dispatch}){

  const {tableLoading,promptObj,pageInfo}=commissionAdjustRecord

  const columns=[{
    title:"时间",
    dataIndex:"optTime"
    },{
      title:"物业类型",
      dataIndex:"propertyType"
    },{
      title:"调整比例",
      dataIndex:'tutorScale'
    },{
      title:"操作账号",
      dataIndex:"optUserName"
    }];

  const paginationInfo = {
			pageSize: pageInfo.pageSize,
			current:pageInfo.current,
			defaultCurrent:1,
			total:pageInfo.total,
			showTotal:total => `共${total}条数据`,
			onChange:(pageNo)=>{
				dispatch(
        {
					type:'commissionAdjustRecord/findCommissionEditRecord',
					payload:{
						pageNo:pageNo-1,
						pageSize:pageInfo.pageSize,
					}
				})
			},
	};

  const onOkCallBack=()=>{
    if(promptObj.todo==='closeModal'){
      dispatch({
        type:"commissionAdjustRecord/togglePrompt",
        payload:{
          visible:false
        }
      })
    }
  }

  const onCancelCallBack=()=>{}

  return(
    <div className="commissionInstalled">
      <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack}/>
      <DxPanel title="佣金调整记录">
        <div className="content">
          <Row>
            <Col>
              <Table loading={tableLoading} columns={columns} dataSource={pageInfo.content} pagination={paginationInfo}/>
            </Col>
          </Row>
        </div>
      </DxPanel>
    </div>
  )
}
function mapStateToProps({commissionAdjustRecord}){
  return{commissionAdjustRecord}
}
export default connect(mapStateToProps)(CommissionAdjustRecord)
