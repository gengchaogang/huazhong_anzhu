import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import {Button, Tabs, Input, Row,Table,Popover} from 'antd';
import { Link } from 'dva/router'
import { routerRedux } from 'dva/router'
import SearchInput from '../../../../commons/View/SearchInput'
import SecondHouseRentDetails from '../../../components/SecondHouseRentDetails'
function DealDoneDetails({dispatch}) {
  const rentalBroker='报出租经纪人';
	const tenant='租户';
	const tenantOwnedBroker='租户所属经纪人';
	const proportionCommissionsCommission='合作成交佣金分佣比例';
	const rentalListings='出租房源';
	const listingInformation='房源委托信息';
	const listingRecords='房源出租记录';
  const intentionRentGold='出租意向金';
  const intentionRentRentalReceipt='租房意向金收据';
  const rentalCommissionsPaid='已支付租房佣金';
  const uploadedRentalContractReceipt='已上传租房居间合同或收据';
  const progressRentalInstallments='租房分期办理进度';
  const setTransactionSubCommissioned='成交分佣设置';
  const secondHandHouseTransactions='二手房出成交';
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
        intentionRentRentalReceipt={intentionRentRentalReceipt}
        rentalCommissionsPaid={rentalCommissionsPaid}
        uploadedRentalContractReceipt={uploadedRentalContractReceipt}
        progressRentalInstallments={progressRentalInstallments}
        setTransactionSubCommissioned={setTransactionSubCommissioned}
        secondHandHouseTransactions={secondHandHouseTransactions}
			/>
		</div>
	);
}

DealDoneDetails.propTypes = {
}
function mapStateToProps({dealDoneDetails}) {
	return { dealDoneDetails };
}

export default connect(mapStateToProps)(DealDoneDetails)
