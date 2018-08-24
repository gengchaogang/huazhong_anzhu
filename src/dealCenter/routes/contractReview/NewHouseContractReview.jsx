import React from 'react'
import {connect} from 'dva'
import { routerRedux } from 'dva/router';
import {Table,Button,Tabs, message,Badge} from 'antd';
const TabPane = Tabs.TabPane;
import SearchInput from '../../../commons/View/SearchInput'

import ProjectPublishAuditModal from '../../components/contractReview/ProjectPublishAuditModal'
import ProjectDownSelvesAuditModal from '../../components/contractReview/ProjectDownSelvesAuditModal'

import './newHouseContractReview.css'
import '../../../commons/css/common.css';
// import {
// 	judgeJurisdiction,
// } from '../../../commons/utils/currencyFunction'
import PromptModal from'../../../commons/View/PromptModal'
import commonFinalCode from '../../../commons/utils/commonFinalCode.js';
import {
	renderUnitPriceStr,
} from '../../../commons/utils/publicFunction'
import commonUtil from '../../../commons/utils/commonUtil.js';
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow'
import AuditExplainModal from '../../components/contractReview/AuditExplainModal'


/*****************************************************/
/*****************************************************/
/**********  新房项目：发布、下架审核 ******************/
/*****************************************************/
/*****************************************************/



function NewHouseContractReview({dispatch,newHouseContractReview}){
	const {
		activeKey,
		projectPublishAuditModal,
		projectDownSelvesAudit,
		projectDownSelvesAuditModal,
		tableLoading,
		resultTableData,
		promptObj,
		loadingShadow,
		projectPublishDealPage,
		projectDownDealPage,
		pagination,
		}=newHouseContractReview;



	const publishColumnsRender=(dataIndex,text,record)=>{
			const handlePulishClick=()=>{
				dispatch({
					type:'newHouseContractReview/setState',
					payload:{
						projectPublishAuditModal:{
							...projectPublishAuditModal,
							currentRecord:record,
							visible:true,
						}
					}
				});

				dispatch({
						type:"newHouseContractReview/initPublish",
						payload:{
							record,
							isDown:false,
						},
				});

			};

			if(dataIndex=='status'){
				return (
					<div>
						<p>项目发布</p>
						<span className={(text==='驳回发布')?'red_cursor':'blue_cursor'} onClick={handlePulishClick}>{(record.nextStatus=='等待审核')?'审核':text}</span>
					</div>
				)
			}else if(dataIndex=='operation'){
				return(
					<a className='green_cursor' onClick={()=>dispatch(routerRedux.push({
							pathname:'/tradeManagement/newHouseTrade/projectDetails',
							state:{
								projectId:record.id,
								projectName:record.name,
							}
						}))}>详情</a>
				)
			}
	};
	const placeholdershow=(key)=>{
		// console.log(key,'keykey');
    let _key='';
    if(key=='publish'){
      _key='请在此输入筛选关键字进行搜索，支持项目名称，所在区域，创建人'
      return _key
    }else{
      _key='请在此输入筛选关键字进行搜索，支持项目名称，所在区域，创建人'
      return _key
    }
  }
	const searchInputProps={
		placeholder:placeholdershow(activeKey),
		searchFuc:(value)=>dispatch({
			type:'newHouseContractReview/changeKeyWords',
			payload:value,
		}),
		clearFuc:()=>dispatch({
			type:'newHouseContractReview/changeKeyWords',
			payload:'',
		}),
		type:'button',
		buttonTitle:'搜索',
	};

	const tableTagOnChange=(e)=>{
		dispatch({
			type:'newHouseContractReview/changeTableTab',
			payload:e,
		})
			// dispatch({
			// 	type:'newHouseContractReview/setState',
			// 	payload:{
			// 		activeKey:e,
			// 	}
			// });
			//
			// //在此发起fetch请求
			// if(e==='publish'){
			// 	dispatch({
			// 		type:'newHouseContractReview/getInitPublishTableData',
			// 		payload:{
			// 			pageNo: 0,
			// 			pageSize: projectPublishDealPage.pageSize,
			// 		}
			// 	})
			// }else if(e==='downShelves') {
			// 	dispatch({
			// 		type:"newHouseContractReview/getInitDownShelvesTableData",
			// 		payload:{
			// 			pageNo: 0,
			// 			pageSize: projectDownDealPage.pageSize,
			// 		}
			// 	})
			// }
	};


	/** -------------------------项目发布审核 start------------------------------- */
	/** 项目发布审核分页 */
	const paginationProjectPublish={
			showQuickJumper: commonFinalCode.showQuickJumper,
			pageSize: pagination.pageSize,
			current: pagination.current,
			defaultCurrent:1,
			total: pagination.total,
			showTotal:total => `共${pagination.total}条数据`,
			onChange:(page,pageSize)=>{
				dispatch({
					type:'newHouseContractReview/changePage',
					payload:page,
				})
			},
			// onChange:(page,pageSize)=>{
			// 	dispatch({
			// 		type:'newHouseContractReview/getInitPublishTableData',
			// 		payload:{
			// 			pageNo:page-1,
			// 			pageSize:projectPublishDealPage.pageSize,
			// 		}
			// 	})
			// },
	};
	const columnsPublish=[
		{
			title: '序号',
			dataIndex: 'indexXh',
		},{
			title: '项目名称',
			dataIndex: 'name',
			render:(text,record)=><span className='blue_cursor' onClick={()=>dispatch(routerRedux.push({
				pathname:'/tradeManagement/newHouseTrade/projectDetails',
				state:{
					projectId:record.id,
					projectName:text,
				}
			}))}>{text}</span>,
		},{
			title: '所在区域',
			dataIndex: 'areaPath',
		},{
			title: '房源单价',
			dataIndex: 'price',
			render:(text,record)=>renderUnitPriceStr(text)
		},{
			title: '电商优惠',
			dataIndex:'discount',
			render:(text,record)=>{
				return(
					<span>{text}个</span>
				)
			}
		},{
			title: '创建时间',
			dataIndex: 'createDateTime',
		},{
			title: '上线时间',
			dataIndex: 'onsellDateTime',
		},{
			title: '在售房源',
			dataIndex: 'sellTotle',
		},{
			title: '创建人',
			dataIndex: 'createUser',
		},{
			title: '审核状态',
			dataIndex: 'status',
			render:(text,record)=>{
				return publishColumnsRender('status',text,record);
			}
		},{
			title: '操作',
			dataIndex:'operation',
			render:(text,record)=>{
				return publishColumnsRender('operation',text,record);
			}
		},
	];


	/** --------------------------------项目下架 start----------------------------- */
	/** 项目发布审核分页 */
	const paginationProjectDown={
			showQuickJumper: commonFinalCode.showQuickJumper,
			pageSize: pagination.pageSize,
			current: pagination.current,
			defaultCurrent:1,
			total: pagination.total,
			showTotal:total => `共${pagination.total}条数据`,
			onChange:(page,pageSize)=>{
				dispatch({
					type:'newHouseContractReview/changePage',
					payload:page,
				})
			},
			// onChange:(page,pageSize)=>{
			// 	dispatch({
			// 		type:'newHouseContractReview/getInitDownShelvesTableData',
			// 		payload:{
			// 			pageNo:page-1,
			// 			pageSize:projectDownDealPage.pageSize,
			// 		}
			// 	})
			// },
	};


	const ShelvesColumnsRender=(dataIndex,text,record)=>{
		const toPinControlTable=()=>{
			message.info('跳转到房源销控表,待处理',4);
		};

		const handleClick=()=>{
				dispatch({
					type:'newHouseContractReview/changeProjectDownSelvesAuditModal',
					payload:{
							...projectDownSelvesAuditModal,
							currentRecord:record,
							visible:true,
					}
				});

				dispatch({
						type:"newHouseContractReview/initPublish",
						payload:{
							record,
							isDown:true,
						},
				});
		};
		switch (dataIndex){
			case 'status':
				return (
					<div>
						<p>申请下架</p>
						<span className={(text==='驳回下架')?'red_cursor':'blue_cursor'} onClick={handleClick}>{text}</span>
					</div>
				);
			case 'operation':
				return (
					<a className='green_cursor' onClick={()=>{
				    dispatch(routerRedux.push({
				      pathname: `/tradeManagement/newHouseTrade/projectDetails`,
				      state:{
				        projectId:record.id,
				        projectName:record.name
				      }
				    }))
				  }}>详情</a>
				);
			default:
				break;
		}
	};

	// 下架
	const columnsDownShelves=[
		{
			title: '序号',
			dataIndex: 'indexXh',
		},{
			title: '项目名称',
			dataIndex: 'name',
		},{
			title: '所在区域',
			dataIndex: 'areaPath',
		},{
			title: '房源单价',
			dataIndex: 'price',
			render:(text,record)=>renderUnitPriceStr(text)
		},{
			title: '带看数',
			dataIndex: 'lookNumber',
		},{
			title:'已售优惠',
			dataIndex:'discount',
			render:(text,record)=>{
				return (
					<span>{text}个</span>
				);
			}
		},{
			title:'成交套数',
			dataIndex:'sellTotle'
		},{
			title: '创建时间',
			dataIndex: 'createDateTime',
		},
		// {
		// 	title: '下架时间',
		// 	dataIndex: 'offlineDate',
		// },
		{
			title: '创建人',
			dataIndex: 'createUser',
		},{
			title: '审核状态',
			dataIndex: 'status',
			render:(text,record)=>{
				return ShelvesColumnsRender('status',text,record)
			}
		},{
			title: '操作',
			dataIndex: 'operation',
			render:(text,record)=>{
				return ShelvesColumnsRender('operation',text,record)
			}
		},
	];

	const onOkCallBack=()=>{
		if(promptObj.todo==='closeModal'){
			dispatch({
				type:"newHouseContractReview/togglePrompt",
				payload:{
					visible:false
				}
			})
		}

		if((promptObj.todo === "closeModalAndSendFetch")
			|| (promptObj.todo === 'closeModalAndSendDownPaymentFetch')
			|| (promptObj.todo === 'closeModalAndSendCommissionFetch') ){
				dispatch({
					type:'newHouseContractReview/closeAllModal',
				})
				// // 完成
				// dispatch({
				// 	type:"newHouseContractReview/togglePrompt",
				// 	payload:{
				// 		visible:false
				// 	}
				// })
				//
				// // 关闭审核框
				// dispatch({
				// 	type:'auditExplainModal/closeModal',
				// 	payload:{
				// 		visible:false
				// 	}
				// });
				// // 关闭上线审核框
				// dispatch({
				// 	type:'newHouseContractReview/setState',
				// 	payload:{
				// 		projectPublishAuditModal:{
				// 			...projectPublishAuditModal,
				// 			visible:false,
				// 		}
				// 	}
				// });
				//
				// // 关闭下架审核框
				// dispatch({
				// 	type:'newHouseContractReview/setState',
				// 	payload:{
				// 		projectDownSelvesAuditModal:{
				// 			...projectDownSelvesAuditModal,
				// 			visible:false,
				// 		}
				// 	}
				// });
				//
				// if(activeKey === 'publish') {
				// 		// 重新加载成交审核列表列表
				// 		dispatch({
				// 			type:"newHouseContractReview/getInitPublishTableData",
				// 			payload:{
				// 				pageNo: projectPublishDealPage.pageNo,
				// 				pageSize: projectPublishDealPage.pageSize,
				// 			}
				// 		})
				// }else if(activeKey === 'downShelves') {
				// 	dispatch({
				// 		type:'newHouseContractReview/getInitDownShelvesTableData',
				// 		payload:{
				// 			pageNo: projectDownDealPage.pageNo,
				// 			pageSize: projectDownDealPage.pageSize,
				// 		}
				// 	})
				// }
		}
	};
	const onCancelCallBack=()=>{

	};

	return (
		<div className="newHouseContractReview">
			<PromptModal zIndex={5000} {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack}/>
			<div className='anzhu_dx_container_box'>
				<SearchInput {...searchInputProps}/>
			</div>
			<DxLoadingShadow visible={loadingShadow} />
			<AuditExplainModal/>
			<div style={{paddingTop:20}}>
				<Tabs
					activeKey={activeKey}
					defaultActiveKey="publish"
					onChange={tableTagOnChange}
					type="card"
					>

					<TabPane tab='项目发布审核' key='publish'>
						<Table
							loading={tableLoading}
							className='newhousedeal-table'
							dataSource={projectPublishDealPage.content}
							columns={columnsPublish}
							pagination={paginationProjectPublish}
							rowKey={renderTableKey}
						/>
						<ProjectPublishAuditModal newHouseContractReview={newHouseContractReview}/>
					</TabPane>

					<TabPane tab='项目下架审核' key='downShelves'>
						<Table
						loading={tableLoading}
							className='newhousedeal-table'
							dataSource={projectDownDealPage.content}
							columns={columnsDownShelves}
							pagination={paginationProjectDown}
							rowKey={renderTableKey}
						/>
						<ProjectDownSelvesAuditModal newHouseContractReview={newHouseContractReview}/>
					</TabPane>

				</Tabs>
			</div>
		</div>
	)
}

function mapStateToProps({newHouseContractReview}){
	return {newHouseContractReview}
}
function renderTableKey(record){
	return record.indexXh
}
export default connect(mapStateToProps)(NewHouseContractReview);
