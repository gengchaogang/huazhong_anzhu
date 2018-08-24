import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import { Link } from 'dva/router'
import {Icon,Button,Table,Modal,Row,Input,Select,Form, Cascader} from 'antd';
import SearchBoxContent from '../../components/labelManagement/SearchBoxContent'
import TableContent from '../../components/labelManagement/TableContent'
import AddLabelModal from '../../components/labelManagement/AddLabelModal';
import './labelManagement.css'

function LabelContent({dispatch, labelManagement}) {
	const {
	}=labelManagement;
	const showAddCategoryModal=()=>{
		dispatch({
			type:'labelManagement/openAddLabelModal',
		})
	};
	return (
		<div className="LabelContent">
			<SearchBoxContent/>
			<Button onClick={showAddCategoryModal}><Icon type="plus" />添加标签</Button>
			<AddLabelModal/>
			<TableContent/>
		</div>
	);
}

LabelContent.propTypes = {

};

function mapStateToProps({ labelManagement }) {
	return { labelManagement }
}

export default connect(mapStateToProps)(LabelContent)
