/**
 * Created by Jason on 2017/1/3.
 */
import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import {Button, Tabs, Input, Row} from 'antd';
const TabPane = Tabs.TabPane;
import { Link } from 'dva/router'

import WaitingDeal from './waitingDeal/WaitingDeal'
import Dealt from './Dealt'
import PendingTreatment from './PendingTreatment'
import SelectPicture from '../../../../commons/UI/SelectPicture'

function SecondHouseSellIndex({secondDeal,dispatch}) {
	//表格上方tag切换回调
	const tableTagOnChange=(key)=>{
		console.log('?????????????argu',key);
	}
	const {showDealProgress,currentRow}=secondDeal;
	return (
		<div>
			<div>
				<Input placeholder="请在此输入筛选关键字进行搜索，例如客户姓名，经纪人姓名"/>
				<Button type="default">搜索</Button>
			</div>
			<div>
				<Tabs onChange={tableTagOnChange} type="card">
					<TabPane tab='待处理' key='hasReported'>
						<SelectPicture
							size={2}
							total={10}
						/>
						<PendingTreatment/>
					</TabPane>
					<TabPane tab='待成交' key='waitingDeal'>
						<WaitingDeal/>
					</TabPane>
					<TabPane tab='已成交' key='hasGroupPurchase'>
						<Dealt/>
					</TabPane>
				</Tabs>
			</div>
		</div>
	);
}

SecondHouseSellIndex.propTypes = {
}
function mapStateToProps({secondDeal}) {
	return { secondDeal };
}

export default connect(mapStateToProps)(SecondHouseSellIndex)
