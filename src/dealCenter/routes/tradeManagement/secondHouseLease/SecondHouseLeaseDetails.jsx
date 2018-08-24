import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import {Button, Tabs, Input, Row,Table} from 'antd';
import { Link } from 'dva/router'
import { routerRedux } from 'dva/router'
import SecondHouseRentDetails from '../../../components/SecondHouseRentDetails'
function SecondHouseLeaseDetails({dispatch}) {
	const rentalBroker='报出租经纪人';
	const tenant='租户';
	const tenantOwnedBroker='租户所属经纪人';
	const proportionCommissionsCommission='合作成交佣金分佣比例';
	const rentalListings='出租房源';
	const listingInformation='房源委托信息';
	const listingRecords='房源出租记录';
	const intentionRentGold='出租意向金';
	const rentAgreement='租房意向金协议';
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
				intentionRentGold={intentionRentGold}
				rentAgreement={rentAgreement}
			/>
		</div>
	);
}
SecondHouseLeaseDetails.propTypes = {
}
function mapStateToProps({secondHouseLeaseDetails}) {
	return { secondHouseLeaseDetails };
}
export default connect(mapStateToProps)(SecondHouseLeaseDetails)
