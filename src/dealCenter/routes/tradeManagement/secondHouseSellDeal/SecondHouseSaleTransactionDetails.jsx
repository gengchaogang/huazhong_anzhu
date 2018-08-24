import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { routerRedux } from 'dva/router'
import SecondHouseForSaleDetails from '../../../components/SecondHouseForSaleDetails'

function SecondHouseSaleTransactionDetails({dispatch}) {
	const reportedBrokers='报成交经纪人';
	const reportedTransactionCustomers='报成交客户';
	const customerBroker='客户所属经纪人';
	const proportionCommissions='合作成交佣金分配比例';
	const intentionHouse='意向房源';
	const listingInformation='房源委托信息';
	const houseSourceReportedTransactionRecords='房源报成交记录';

  const hasBeenPaidIntentionMoney='已支付意向金';
  const intentContractAgreement='意向合同/协议';
  const downPaymentPaid='已支付首付款';
  const downPaymentAgreementContract='首付款协议/合同';
  const commissionsPaid='已支付佣金';
  const interimAgreementCommissionAgreement='买卖居间协议/佣金协议';
  const housingLoanInformation='房源贷款信息';
  const houseTransferInformation='房屋过户信息';
  const transactionFundsReleaseAccount='成交资金释放账户';
  const setTransactionSubCommissioned='成交分佣设置';
  const houseTransactionInformation='房屋成交信息';
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

        hasBeenPaidIntentionMoney={hasBeenPaidIntentionMoney}
        intentContractAgreement={intentContractAgreement}
        downPaymentPaid={downPaymentPaid}
        downPaymentAgreementContract={downPaymentAgreementContract}
        commissionsPaid={commissionsPaid}
        interimAgreementCommissionAgreement={interimAgreementCommissionAgreement}
        housingLoanInformation={housingLoanInformation}
        houseTransferInformation={houseTransferInformation}
        transactionFundsReleaseAccount={transactionFundsReleaseAccount}
        setTransactionSubCommissioned={setTransactionSubCommissioned}
        houseTransactionInformation={houseTransactionInformation}
      />
		</div>
	);
}

SecondHouseSaleTransactionDetails.propTypes = {
}
function mapStateToProps({secondHouseSaleTransactionDetails}) {
	return { secondHouseSaleTransactionDetails };
}

export default connect(mapStateToProps)(SecondHouseSaleTransactionDetails)
