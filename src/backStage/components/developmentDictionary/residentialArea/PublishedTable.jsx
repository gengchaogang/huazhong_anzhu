import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import {Tabs,Button,Table,Modal,Row,Input,Select,Form, Cascader} from 'antd';
const confirm = Modal.confirm;


function PublishedTable({location, dispatch, residentialArea}) {
	const {closeCityModal, tablePublish, activeKey}=residentialArea;
	const {tableLoading, response}=tablePublish;
	const tableData=response.data?response.data.data.content:[];
	const totalElements=response.data?response.data.data.totalElements:0;
	const size=response.data?response.data.data.size:0;
	const number=response.data?response.data.data.number:0;

	const columnsRender=(dataIndex,text,record)=>{
		if(dataIndex==='area'){
			let zones=record.zones;
			if(zones.length!=0){
				let string='';
				for(let k=0; k<zones.length; k++){
					if(k==0){
						string+=zones[k].name
					}else {
						string+=('、'+zones[k].name)
					}
				}
				return(<span>{string}</span>)
			}else{
				return (<span style={{color:'#ddd'}}>未添加</span>)
			}
		}
		if(dataIndex==='operation'){
			let showConfirm=()=>{
				confirm({
					title: '确认是否关闭城市?',
					content: '关闭城市后，经纪人将无法切换到此城市，且此城市中所有房源将被下架，请谨慎操作。',
					okText:"继续关闭",
					cancelText:"取消",
					onOk() {
						dispatch({
							type:'residentialArea/setState',
							payload:{
								closeCityModal:{
									...closeCityModal,
									code:record.code,
									visible:true,
								},
							}
						})
					},
					onCancel() {},
				});
			};
			//相册管理
			const toPicManagement=()=>{
				dispatch(routerRedux.push({
					pathname:'/residentialArea/openCity/divisionManagement',
					state:{
						currentCityName:record.name,
						currentCityStatus:activeKey,
						firstAreaId:record.zones[0]?record.zones[0].id:null,//第一个片区id

						currentProvince:record.province,
						currentCityId:record.id,
						activeAreaId:record.zones[0]?record.zones[0].id:null,
					},
				}));
			};

			//楼栋管理
			const toCommunityBuilding=()=>{

			};
			//编辑
			const preEdit=()=>{

			};
			//下架
			const preUnPublish=()=>{

			};
			return(
				<span>
					<a onClick={toCommunityBuilding}>楼栋管理</a>
					<span className="ant-divider" />
					<a onClick={toPicManagement}>相册管理</a>
					<span className="ant-divider" />
					<a onClick={preEdit}>编辑</a>
					<span className="ant-divider" />
					<a onClick={preUnPublish}>下架</a>
				</span>
			);
		}
	};
	const columns=[
		{
			title: '序号',
			dataIndex: 'number',
			key:'number',
		},
		{
			title: '地区',
			dataIndex:'province',
			key:'area',
		},
		{
			title: '小区名称',
			dataIndex: 'cellName',
			key:'cellName',
		},
		{
			title: '楼栋',
			dataIndex: 'louDong',
			key:'louDong',
		},
		{
			title: '总户数',
			dataIndex: 'totalHouseholds',
			key:'totalHouseholds',
		},
		{
			title: '在售',
			dataIndex: 'stocking',
			key:'stocking',
		},
		{
			title: '在租',
			dataIndex: 'renting',
			key:'renting',
		},
		{
			title: '发布时间',
			dataIndex: 'releaseTime',
			key:'releaseTime',
		},
		{
			title: '操作',
			render:(text,record)=>{
				return columnsRender('operation', text, record);
			}
		}
	];
	const onPageChange=(page)=>{
		console.log('page',page);
		dispatch({
			type:'residentialArea/query',
			payload:{
				state:'open',
				pageNo:page-1,
				state:'已发布',
			}
		})
	};
	const pagination={
		total:totalElements,
		showTotal:total => `共 ${total} 项`,
		showQuickJumper:true,
		pageSize:size,
		defaultCurrent:1,
		onChange:onPageChange,
	};
	return (
		<Table
			loading={tableLoading}
			columns={columns}
			dataSource={tableData}
			rowKey={record => record.id}
			pagination={pagination}
		/>
	);
}

PublishedTable.propTypes = {

}

function mapStateToProps({ residentialArea }) {
	return { residentialArea }
}

export default connect(mapStateToProps)(PublishedTable)
