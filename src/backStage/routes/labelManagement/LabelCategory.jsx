import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import { Link } from 'dva/router'
import {Button,Table,Modal,Row,Input,Select,Form, Cascader} from 'antd';
import SearchBox from '../../components/labelManagement/SearchBoxCategory'
import TableCategory from '../../components/labelManagement/TableCategory'
import AddCategoryModal from '../../components/labelManagement/AddCategoryModal';
import './labelManagement.css'

function LabelCategory({dispatch, labelManagement}) {
	const {
	}=labelManagement;
	const showAddCategoryModal=()=>{
		dispatch({
			type:'labelManagement/getAreaCode',
			payload:{
				AddCategoryModalVisible:true,
			}
		})
	};
	return (
		<div className="labelCategory">
			<SearchBox/>
			<Button onClick={showAddCategoryModal} type='ghost' icon='plus'>添加类别</Button>
			<AddCategoryModal/>
			<TableCategory/>
		</div>
	);
}

LabelCategory.propTypes = {

};

function mapStateToProps({ labelManagement }) {
	return { labelManagement }
}

export default connect(mapStateToProps)(LabelCategory)
