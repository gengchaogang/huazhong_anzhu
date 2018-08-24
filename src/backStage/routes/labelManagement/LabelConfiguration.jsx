import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import { Link } from 'dva/router'
import {Tabs,Button,Table,Modal,Row,Input,Select,Form, Cascader} from 'antd';
const TabPane = Tabs.TabPane;
import DxPanel from '../../../commons/components/DxPanel'
import LabelCategory from './LabelCategory';
import LabelContent from './LabelContent';
import './labelManagement.css'

function LabelConfiguration({dispatch,labelManagement,form}) {
	const {
		tabActiveKey,
	}=labelManagement;
	const tabsCallBack=(key)=>{
		dispatch({
			type:'labelManagement/toggleTab',
			payload:key,
		})
	};
	return (
    <DxPanel title='标签管理'>
      <div className='labelManagement'>
        <Tabs onChange={tabsCallBack} type='card'>
          <TabPane tab='标签类别' key='labelType'>
            <LabelCategory/>
          </TabPane>
          <TabPane tab='标签内容' key='label'>
            <LabelContent/>
          </TabPane>
        </Tabs>
      </div>
    </DxPanel>
	);
}

LabelConfiguration.propTypes = {

};
function mapStateToProps({ labelManagement }) {
	return { labelManagement }
}

export default connect(mapStateToProps)(LabelConfiguration)
