import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import {Button, Tabs, Input, Row,Table,Popover} from 'antd';
import { Link } from 'dva/router'
import { routerRedux } from 'dva/router'
import SearchInput from '../../../../commons/View/SearchInput'
import SecondHouseRentDetails from '../../../components/SecondHouseRentDetails'
function RentDetails({dispatch}) {
	const rentalBroker='报出租经纪人';
	const tenant='租户';
	const tenantOwnedBroker='租户所属经纪人';
	const proportionCommissionsCommission='合作成交佣金分佣比例';
	const rentalListings='出租房源';
	const listingInformation='房源委托信息';
	const listingRecords='房源出租记录';
	const reasonsRefusal='驳回理由';
	return (
		<div>
			<SecondHouseRentDetails
				rentalBroker={rentalBroker}
				tenant={tenant}
				tenantOwnedBroker={tenantOwnedBroker}
				proportionCommissionsCommission={proportionCommissionsCommission}
				rentalListings={rentalListings}
				listingInformation={listingInformation}
				listingRecords={listingRecords}
				reasonsRefusal={reasonsRefusal}
			/>
		</div>
	);
}

RentDetails.propTypes = {
}
function mapStateToProps({rentDetails}) {
	return { rentDetails };
}

export default connect(mapStateToProps)(RentDetails)
