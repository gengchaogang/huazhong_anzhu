import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { routerRedux } from 'dva/router'
import SecondHouseForSaleDetails from '../../../components/SecondHouseForSaleDetails'

function SecondHouseSaleRejectedDetails({dispatch}) {
	const reportedBrokers='报成交经纪人';
	const reportedTransactionCustomers='报成交客户';
	const customerBroker='客户所属经纪人';
	const proportionCommissions='合作成交佣金分配比例';
	const intentionHouse='意向房源';
	const listingInformation='房源委托信息';
	const houseSourceReportedTransactionRecords='房源报成交记录';
	const reasonsRefusal='驳回理由';
	return (
		<div>
      <SecondHouseForSaleDetails
				reportedBrokers={reportedBrokers}
				reportedTransactionCustomers={reportedTransactionCustomers}
				customerBroker={customerBroker}
				proportionCommissions={proportionCommissions}
				intentionHouse={intentionHouse}
				listingInformation={listingInformation}
				houseSourceReportedTransactionRecords={houseSourceReportedTransactionRecords}
				reasonsRefusal={reasonsRefusal}
			/>
		</div>
	);
}

SecondHouseSaleRejectedDetails.propTypes = {
}
function mapStateToProps({secondHouseSaleRejectedDetails}) {
	return { secondHouseSaleRejectedDetails };
}

export default connect(mapStateToProps)(SecondHouseSaleRejectedDetails)
