import React from 'react'
import {
  judgeJurisdiction,
  isNull,
} from '../commons/utils/currencyFunction'
import { Router, Route, IndexRoute,Redirect,IndexRedirect} from 'dva/router'
import IndexPage from './routes/IndexPage'
import Main from './routes/Main'
import Login from './routes/Login'
import Test from '../commons/routes/Test'
import Information from './routes/Information'
import InformationInfo from './routes/InformationInfo'
import Instructions from './routes/Instructions'
import AccountManagement from './routes/AccountManagement'

// import NewHouseDeal from './routes/tradeManagement/newHouseTrade/NewHouseDeal'
import NewHouseTrade from './routes/tradeManagement/newHouseTrade/NewHouseTrade'
import ProjectDetails from './routes/tradeManagement/newHouseTrade/ProjectDetails'
import CreatClient from './routes/tradeManagement/newHouseTrade/CreatClient'
import CreatGroupBuy from './routes/tradeManagement/newHouseTrade/CreatGroupBuy'
import CreatTransactions from './routes/tradeManagement/newHouseTrade/CreatTransactions'
import CustomerDoLook from './routes/tradeManagement/newHouseTrade/CustomerDoLook'
// import DoLookDetails from './routes/tradeManagement/newHouseTrade/DoLookDetails'
import GroupBuyDetails from './routes/tradeManagement/newHouseTrade/GroupBuyDetails'
import UploadGroupBuyAgreement from './routes/tradeManagement/newHouseTrade/UploadGroupBuyAgreement'
import NewHouseTradeInfoDetails from './routes/tradeManagement/newHouseTrade/NewHouseTradeInfoDetails'
import HousesManagement from './routes/tradeManagement/newHouseTrade/HousesManagement'
// import GroupBuyRefundApply from './routes/tradeManagement/newHouseTrade/GroupBuyRefundApply'
import NHGroupBuyRefundApply from './routes/tradeManagement/newHouseTrade/NHGroupBuyRefundApply'
import NHGroupBuyRefundAuditInfo from './routes/tradeManagement/newHouseTrade/NHGroupBuyRefundAuditInfo'
import NHCommitApply from './routes/tradeManagement/newHouseTrade/NHCommitApply'
import NHCommitAuditInfo from './routes/tradeManagement/newHouseTrade/NHCommitAuditInfo'



import UploadData from './routes/tradeManagement/newHouseTrade/UploadData'
import DealDetails from './routes/tradeManagement/newHouseTrade/DealDetails'
import InventoryControl from './routes/tradeManagement/newHouseTrade/InventoryControl'
// import NavBar from './routes/newHouseOnline/createPro/NavBar'
//↓du
//二手房交易
//出售
import SecondHouseSellTrade from './routes/tradeManagement/secondHouseSellTrade/SecondHouseSellTrade'
import SecondHouseSellTradeInfoDetails from './routes/tradeManagement/secondHouseSellTrade/SecondHouseSellTradeInfoDetails'
import SecondHouseRelieveLoan from './routes/tradeManagement/secondHouseSellTrade/SecondHouseRelieveLoan'
// import SecondHouseRelieveLoanDetails from './routes/tradeManagement/secondHouseSellTrade/SecondHouseRelieveLoanDetails'
import SecondHouseSellTransaction from './routes/tradeManagement/secondHouseSellTrade/SecondHouseSellTransaction';
import SecondHouseSellTransactionReject from './routes/tradeManagement/secondHouseSellTrade/SecondHouseSellTransactionReject';
import SecondHouseSellDealIntentsAdd from './routes/tradeManagement/secondHouseSellTrade/SecondHouseSellDealIntentsAdd';
import SecondHouseSellDealUploadIntentsAgreement from './routes/tradeManagement/secondHouseSellTrade/SecondHouseSellDealUploadIntentsAgreement';
import SecondHouseSellDealIntentsAgreementDetails from './routes/tradeManagement/secondHouseSellTrade/SecondHouseSellDealIntentsAgreementDetails';
import SecondHouseSellDealIntentsRefundDetails from './routes/tradeManagement/secondHouseSellTrade/SecondHouseSellDealIntentsRefundDetails';
import SecondHouseSellDownPaymentAdd from './routes/tradeManagement/secondHouseSellTrade/SecondHouseSellDownPaymentAdd';
import SecondHouseSellDealUploadDownPaymentAgreement from './routes/tradeManagement/secondHouseSellTrade/SecondHouseSellDealUploadDownPaymentAgreement';
import SecondHouseSellDealDownPaymentRefundDetails from './routes/tradeManagement/secondHouseSellTrade/SecondHouseSellDealDownPaymentRefundDetails';
import SecondHouseSellCommissionAdd from './routes/tradeManagement/secondHouseSellTrade/SecondHouseSellCommissionAdd';
import SecondHouseSellDealUploadCommissionAgreement from './routes/tradeManagement/secondHouseSellTrade/SecondHouseSellDealUploadCommissionAgreement';
import SecondHouseSellLoanApply from './routes/tradeManagement/secondHouseSellTrade/SecondHouseSellLoanApply';
import SecondHouseSellTransferApply from './routes/tradeManagement/secondHouseSellTrade/SecondHouseSellTransferApply';
import SecondHouseSellCommitApply from './routes/tradeManagement/secondHouseSellTrade/SecondHouseSellCommitApply';
import SecondHouseSellHousesDetails from './routes/tradeManagement/secondHouseSellTrade/SecondHouseSellHousesDetails';
import SHSellIntentsRefundApply from './routes/tradeManagement/secondHouseSellTrade/SHSellIntentsRefundApply';
import SHSellIntentsRefundAuditInfo from './routes/tradeManagement/secondHouseSellTrade/SHSellIntentsRefundAuditInfo';
import SHSellDownPaymentRefundApply from './routes/tradeManagement/secondHouseSellTrade/SHSellDownPaymentRefundApply';
import SHSellDownPaymentRefundAuditInfo from './routes/tradeManagement/secondHouseSellTrade/SHSellDownPaymentRefundAuditInfo';
import SHSellCommissionRefundApply from './routes/tradeManagement/secondHouseSellTrade/SHSellCommissionRefundApply';
import SHSellCommissionRefundAuditInfo from './routes/tradeManagement/secondHouseSellTrade/SHSellCommissionRefundAuditInfo';
import SHRelieveLoanApplyInfo from './routes/tradeManagement/secondHouseSellTrade/SHRelieveLoanApplyInfo';
import SHSellLoanApplyInfo from './routes/tradeManagement/secondHouseSellTrade/SHSellLoanApplyInfo';
import SHSellTransferApplyInfo from './routes/tradeManagement/secondHouseSellTrade/SHSellTransferApplyInfo';
import SHSellCommitApplyInfo from './routes/tradeManagement/secondHouseSellTrade/SHSellCommitApplyInfo';


//二手房出租
import SecondHouseRentTrade from  './routes/tradeManagement/secondHouseRentTrade/SecondHouseRentTrade';
import SecondHouseRentTradeInfoDetails from  './routes/tradeManagement/secondHouseRentTrade/SecondHouseRentTradeInfoDetails';
import SecondHouseRentDealIntentsAdd from  './routes/tradeManagement/secondHouseRentTrade/SecondHouseRentDealIntentsAdd';
import SecondHouseRentDealUploadIntentsAgreement from  './routes/tradeManagement/secondHouseRentTrade/SecondHouseRentDealUploadIntentsAgreement';
import SecondHouseRentCommissionAdd from  './routes/tradeManagement/secondHouseRentTrade/SecondHouseRentCommissionAdd';
import SecondHouseRentDealUploadCommissionAgreement from  './routes/tradeManagement/secondHouseRentTrade/SecondHouseRentDealUploadCommissionAgreement';
import SecondHouseRentLoanApply from  './routes/tradeManagement/secondHouseRentTrade/SecondHouseRentLoanApply';
import SecondHouseRentCommitApply from  './routes/tradeManagement/secondHouseRentTrade/SecondHouseRentCommitApply';
import SecondHouseRentHousesDetails from './routes/tradeManagement/secondHouseRentTrade/SecondHouseRentHousesDetails';
import SHRentIntentsRefundApply from './routes/tradeManagement/secondHouseRentTrade/SHRentIntentsRefundApply';
import SHRentIntentsRefundAuditInfo from './routes/tradeManagement/secondHouseRentTrade/SHRentIntentsRefundAuditInfo';
import SHRentCommissionRefundApply from './routes/tradeManagement/secondHouseRentTrade/SHRentCommissionRefundApply';
import SHRentCommissionRefundAuditInfo from './routes/tradeManagement/secondHouseRentTrade/SHRentCommissionRefundAuditInfo';
import SHRentCommitApplyInfo from './routes/tradeManagement/secondHouseRentTrade/SHRentCommitApplyInfo';
//↑du

//交易管理/二手房交易
import SecondHouseSellDeal from './routes/tradeManagement/secondHouseSellDeal/SecondHouseSellDeal';
import SecondHouseSaleRejectedDetails from './routes/tradeManagement/secondHouseSellDeal/SecondHouseSaleRejectedDetails';
import SecondHouseSaleDetails from './routes/tradeManagement/secondHouseSellDeal/SecondHouseSaleDetails';
import PayIntentionMoney from './routes/tradeManagement/secondHouseSellDeal/PayIntentionMoney';
import PayTheDownPayment from './routes/tradeManagement/secondHouseSellDeal/PayTheDownPayment';
import PayACommission from './routes/tradeManagement/secondHouseSellDeal/PayACommission';
import PropertyDetention from './routes/tradeManagement/secondHouseSellDeal/PropertyDetention';
import SecondHouseSaleTransactionDetails from './routes/tradeManagement/secondHouseSellDeal/SecondHouseSaleTransactionDetails';
import SecondHouseSalelistingDetails from './routes/tradeManagement/secondHouseSellDeal/SecondHouseSalelistingDetails';

//财务审核
import NewHouseElectricityExamination from './routes/financialManagement/NewHouseElectricityExamination';
import SecondHouseSellExamine from './routes/financialManagement/SecondHouseSellExamine';
import SecondHouseLeaseExamine from './routes/financialManagement/SecondHouseLeaseExamine';
import NewHouseRevenueManagement from './routes/financialManagement/NewHouseRevenueManagement';
import SecondHouseRevenueManagement from './routes/financialManagement/SecondHouseRevenueManagement';
import ServiceFeeRevenueManagement from './routes/financialManagement/ServiceFeeRevenueManagement';
import SHSellIntentsFinanceAudit from './routes/financialManagement/SHSellIntentsFinanceAudit';
import SHSellDownPaymentFinanceAudit from './routes/financialManagement/SHSellDownPaymentFinanceAudit';
import SHSellCommissionFinanceAudit from './routes/financialManagement/SHSellCommissionFinanceAudit';
import SHSellCommitFinanceAudit from './routes/financialManagement/SHSellCommitFinanceAudit';
import SHRentIntentsFinanceAudit from './routes/financialManagement/SHRentIntentsFinanceAudit';
import SHRentCommissionFinanceAudit from './routes/financialManagement/SHRentCommissionFinanceAudit';
import SHRentCommitFinanceAudit from './routes/financialManagement/SHRentCommitFinanceAudit';
import NHGroupBuyRefundFinacialAudit from './routes/financialManagement/NHGroupBuyRefundFinacialAudit';
import NHCommitFinacialAudit from './routes/financialManagement/NHCommitFinacialAudit';


import HouseResourceInfo from './routes/tradeManagement/secondHouseDeal/HouseResourceInfo';


import SecondHandHouseMortgageDeal from './routes/loanManagement/SecondHandHouseMortgageDeal';
import SecondHandHouseSolution from './routes/loanManagement/SecondHandHouseSolution';
import SecondHandHouseRentalLoans from './routes/loanManagement/SecondHandHouseRentalLoans';


//交易管理/二手房出租交易
import SecondHouseLease from  './routes/tradeManagement/secondHouseLease/SecondHouseLease';
import SecondHouseLeaseDetails from './routes/tradeManagement/secondHouseLease/SecondHouseLeaseDetails';
import ApplicationStaging from './routes/tradeManagement/secondHouseLease/ApplicationStaging';
import ListingDetails from './routes/tradeManagement/secondHouseLease/ListingDetails';
import PaymentCommission from './routes/tradeManagement/secondHouseLease/PaymentCommission';
import DealWithTransactions from './routes/tradeManagement/secondHouseLease/DealWithTransactions';
import HandleIntention from './routes/tradeManagement/secondHouseLease/HandleIntention';
import RentPendingDetails from './routes/tradeManagement/secondHouseLease/RentPendingDetails';
import RentDetails from './routes/tradeManagement/secondHouseLease/RentDetails';
import SupplementalAgreement from './routes/tradeManagement/secondHouseLease/SupplementalAgreement';
import DealDoneDetails from './routes/tradeManagement/secondHouseLease/DealDoneDetails';

//企业管理
import BusinessInformationManagement from './routes/businessManagement/BusinessInformationManagement'
import OrganizeStructureManagement from './routes/businessManagement/OrganizeStructureManagement'
import RoleManagement from './routes/businessManagement/RoleManagement'
import EmployeeInformation from './routes/businessManagement/EmployeeInformation'
import CreatEmployee from './routes/businessManagement/CreatEmployee'

// //过户办理
import SecondHandHouseTransfer from './routes/transferManagement/SecondHandHouseTransfer'
import ContractTemplate from './routes/contractTemplate/ContractTemplate'
//数据分析
import TradeStatistics from './routes/dataAnalysis/TradeStatistics'
import TeamStatistics from './routes/dataAnalysis/TeamStatistics'
import CommissionStatistics from './routes/dataAnalysis/CommissionStatistics'

//操作日志
import OperationLog from './routes/operationLog/OperationLog'
//成交/合同审核
import NewHouseContractReview from './routes/contractReview/NewHouseContractReview'
import NewhousetransactionContractReview from './routes/contractReview/NewHouseTransactionContractReview'
import SecondHandHouseSalesAudit from './routes/contractReview/SecondHandHouseSalesAudit'
import SecondHandHouseRentalAudit from './routes/contractReview/SecondHandHouseRentalAudit'
import SHSellIntentsContractAudit from './routes/contractReview/SHSellIntentsContractAudit'
import SHSellDownPaymentContractAudit from './routes/contractReview/SHSellDownPaymentContractAudit'
import SHSellCommissionContractAudit from './routes/contractReview/SHSellCommissionContractAudit'
import SHSellCommitContractAudit from './routes/contractReview/SHSellCommitContractAudit'
import SHRentIntentsContractAudit from './routes/contractReview/SHRentIntentsContractAudit'
import SHRentCommissionContractAudit from './routes/contractReview/SHRentCommissionContractAudit'
import SHRentCommitContractAudit from './routes/contractReview/SHRentCommitContractAudit'
import NHGroupBuyRefundContractAudit from './routes/contractReview/NHGroupBuyRefundContractAudit'
import NHCommitContractAudit from './routes/contractReview/NHCommitContractAudit'

//新房电商
import ProjectManagement from './routes/newHouseOnline/ProjectManagement'
import NewHouseOnlineCreateProject from './routes/newHouseOnline/NewHouseOnlineCreateProject'
//一下内容add by jc
import CreateProject from './routes/newHouseOnline/createNewProject/CreateProject'
import BasicMessage from './routes/newHouseOnline/createNewProject/BasicMessage'
import CreateProjectConcessions from  './routes/newHouseOnline/createNewProject/CreateProjectConcessions'
import HouseTypeImgManagement from  './routes/newHouseOnline/createNewProject/HouseTypeImgManagement'
import CreateProjectTable from  './routes/newHouseOnline/createNewProject/CreateProjectTable'
import UploadAptitude from  './routes/newHouseOnline/createNewProject/UploadAptitude'
import UploadProjectPhoto from  './routes/newHouseOnline/createNewProject/UploadProjectPhoto'
//以上内容 add by jc
export default function({ history }) {
  return (
    <Router history={history}>
      <Redirect from='/' to='/indexPage'/>
      <Route path="/" name='' breadcrumbName='首页' component={Main} onEnter={checkLogin}>
        <Route path='indexPage' component={IndexPage}/>
        <Route path='information' name='information' breadcrumbName='消息管理'>
          <IndexRoute component={Information}/>
          <Route path='informationInfo' component={InformationInfo} name='informationInfo' breadcrumbName='消息详情'/>
        </Route>
        <Route path='accountManagement' component={AccountManagement} name='accountManagement' breadcrumbName='账号设置'/>
        <Redirect from='tradeManagement' to='tradeManagement/newHouseTrade'/>
        <Route path='tradeManagement' name='tradeManagement' breadcrumbName='交易管理'>
          <Route path='newHouseTrade' name='newHouseTrade' breadcrumbName='新房交易'>
            <IndexRoute component={NewHouseTrade} onEnter={judgeRouter} qxCode='TRADINGCENTER_NEWHOUSE_DEAL'/>
            <Route path='projectDetails' component={ProjectDetails} name='projectDetails' breadcrumbName='项目详情'/>
            <Route path='creatClient' component={CreatClient} name='creatClient' breadcrumbName='录客户' onEnter={judgeRouter} qxCode='TRADINGCENTER_NEWHOUSE_RECORDCUSTOMER'/>
            <Route path='creatGroupBuy' component={CreatGroupBuy} name='creatGroupBuy' breadcrumbName='办理团购' onEnter={judgeRouter} qxCode='TRADINGCENTER_NEWHOUSE_DEAL'/>
            <Route path='creatTransactions' component={CreatTransactions} name='creatTransactions' breadcrumbName='办理成交' onEnter={judgeRouter} qxCode='TRADINGCENTER_NEWHOUSE_DEAL'/>
            <Route path='customerDoLook' component={CustomerDoLook} name='customerDoLook' breadcrumbName='客户确看' onEnter={judgeRouter} qxCode='TRADINGCENTER_NEWHOUSE_DEAL'/>
            {/*<Route path='doLookDetails' component={DoLookDetails} name='doLookDetails' breadcrumbName='确看详情'/>*/}
            {/*<Route path='groupBuyRefundApply' component={GroupBuyRefundApply} name='groupBuyRefundApply' breadcrumbName='团购退款申请'/>*/}
            {/*<Route path='groupBuyDetails' component={GroupBuyDetails}/>*/}
            <Route path='uploadGroupBuyAgreement' component={UploadGroupBuyAgreement} name='uploadGroupBuyAgreement' breadcrumbName='上传团购协议' onEnter={judgeRouter} qxCode='TRADINGCENTER_NEWHOUSE_DEAL'/>
            <Route path='nhGroupBuyRefundApply' component={NHGroupBuyRefundApply} name='nhGroupBuyRefundApply' breadcrumbName='电商团购退款申请' onEnter={judgeRouter} qxCode='TRADINGCENTER_NEWHOUSE_RECORDGROUPPURCHASE'/>
            <Route path='nhGroupBuyRefundAuditInfo' component={NHGroupBuyRefundAuditInfo} name='nhGroupBuyRefundAuditInfo' breadcrumbName='电商团购退款审核详情' onEnter={judgeRouter} qxCode='TRADINGCENTER_NEWHOUSE_RECORDGROUPPURCHASE'/>
            <Route path='nhCommitApply' component={NHCommitApply} name='nhCommitApply' breadcrumbName='新房成交申请' onEnter={judgeRouter} qxCode='TRADINGCENTER_NEWHOUSE_DEAL'/>
            <Route path='nhCommitAuditInfo' component={NHCommitAuditInfo} name='nhCommitAuditInfo' breadcrumbName='新房成交审核详情' onEnter={judgeRouter} qxCode='TRADINGCENTER_NEWHOUSE_DEAL'/>
            {/*<Route path='uploadData' component={UploadData}/>*/}
            {/*<Route path='dealDetails' component={DealDetails}/>*/}
            <Route path='inventoryControl' component={InventoryControl}/>
            <Route path='newHouseTradeInfoDetails' component={NewHouseTradeInfoDetails} name='newHouseTradeInfoDetails' breadcrumbName='交易详情'/>
            <Route path='housesManagement' component={HousesManagement} name='housesManagement' breadcrumbName='房源管理' onEnter={judgeRouter} qxCode='TRADINGCENTER_NEWHOUSE_DEAL'/>
          </Route>
          <Route path='secondHouseSellTrade' name='secondHouseSellTrade' breadcrumbName='二手房出售' >
            <IndexRoute component={SecondHouseSellTrade} onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_SALE'/>
            <Route path='secondHouseRelieveLoan' component={SecondHouseRelieveLoan} name='secondHouseRelieveLoan' breadcrumbName='二手房解押' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_SALE_MORTGAGE'/>
            <Route path='secondHouseSellTradeInfoDetails' component={SecondHouseSellTradeInfoDetails} name='secondHouseSellTradeInfoDetails' breadcrumbName='交易详情'/>
            {/*<Route path='secondHouseRelieveLoanDetails' component={SecondHouseRelieveLoanDetails}/>*/}
            <Route path='secondHouseSellTransaction' component={SecondHouseSellTransaction} name='secondHouseSellTransaction' breadcrumbName='成交申请' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_SALE_HANDLE_CLINCHADEAL'/>
            {/*<Route path='secondHouseSellTransactionReject' component={SecondHouseSellTransactionReject}/>*/}
            <Route path='secondHouseSellDealIntentsAdd' component={SecondHouseSellDealIntentsAdd} name='secondHouseSellDealIntentsAdd' breadcrumbName='支付意向金' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_SALE_INTENTION'/>
            <Route path='secondHouseSellDealUploadIntentsAgreement' component={SecondHouseSellDealUploadIntentsAgreement} name='secondHouseSellDealUploadIntentsAgreement' breadcrumbName='上传意向金合同' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_SALE_INTENTION'/>
            {/*<Route path='secondHouseSellDealIntentsAgreementDetails' component={SecondHouseSellDealIntentsAgreementDetails}/>*/}
            {/*<Route path='secondHouseSellDealIntentsRefundDetails' component={SecondHouseSellDealIntentsRefundDetails}/>*/}
            <Route path='secondHouseSellDownPaymentAdd' component={SecondHouseSellDownPaymentAdd} name='secondHouseSellDownPaymentAdd' breadcrumbName='支付首付款' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_SALE_DOWNPAYMENT'/>
            <Route path='secondHouseSellDealUploadDownPaymentAgreement' component={SecondHouseSellDealUploadDownPaymentAgreement} name='secondHouseSellDealUploadDownPaymentAgreement' breadcrumbName='上传首付款合同' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_SALE_DOWNPAYMENT'/>
            {/*<Route path='secondHouseSellDealDownPaymentRefundDetails' component={SecondHouseSellDealDownPaymentRefundDetails}/>*/}
            <Route path='secondHouseSellCommissionAdd' component={SecondHouseSellCommissionAdd} name='secondHouseSellCommissionAdd' breadcrumbName='支付佣金' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_SALE_COMMISSIONPAYMENT'/>
            <Route path='secondHouseSellDealUploadCommissionAgreement' component={SecondHouseSellDealUploadCommissionAgreement} name='secondHouseSellDealUploadCommissionAgreement' breadcrumbName='上传佣金协议' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_SALE_COMMISSIONPAYMENT'/>
            <Route path='secondHouseSellLoanApply' component={SecondHouseSellLoanApply} name='secondHouseSellLoanApply' breadcrumbName='申请贷款' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_SALE_LOANAPPLICATION'/>
            <Route path='secondHouseSellTransferApply' component={SecondHouseSellTransferApply} name='secondHouseSellTransferApply' breadcrumbName='过户申请' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_SALE_TRANSFER'/>
            <Route path='secondHouseSellCommitApply' component={SecondHouseSellCommitApply} name='secondHouseSellCommitApply' breadcrumbName='成交申请' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_SALE_HANDLE_CLINCHADEAL'/>
            <Route path='secondHouseSellHousesDetails' component={SecondHouseSellHousesDetails} name='secondHouseSellHousesDetails' breadcrumbName='出售房源详情'/>
            <Route path='shSellIntentsRefundApply' component={SHSellIntentsRefundApply} name='shSellIntentsRefundApply' breadcrumbName='二手房出售意向金退款申请' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_SALE_INTENTION'/>
            <Route path='shSellIntentsRefundAuditInfo' component={SHSellIntentsRefundAuditInfo} name='shSellIntentsRefundAuditInfo' breadcrumbName='二手房出售意向金退款审核详情' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_SALE_INTENTION'/>
            <Route path='shSellDownPaymentRefundApply' component={SHSellDownPaymentRefundApply} name='shSellDownPaymentRefundApply' breadcrumbName='二手房出售首付款退款申请' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_SALE_DOWNPAYMENT'/>
            <Route path='shSellDownPaymentRefundAuditInfo' component={SHSellDownPaymentRefundAuditInfo} name='shSellDownPaymentRefundAuditInfo' breadcrumbName='二手房出售首付款退款审核详情' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_SALE_DOWNPAYMENT'/>
            <Route path='shSellCommissionRefundApply' component={SHSellCommissionRefundApply} name='shSellCommissionRefundApply' breadcrumbName='二手房出售佣金退款申请' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_SALE_COMMISSIONPAYMENT'/>
            <Route path='shSellCommissionRefundAuditInfo' component={SHSellCommissionRefundAuditInfo} name='shSellCommissionRefundAuditInfo' breadcrumbName='二手房出售佣金退款审核详情' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_SALE_COMMISSIONPAYMENT'/>
            <Route path='shRelieveLoanApplyInfo' component={SHRelieveLoanApplyInfo} name='shRelieveLoanApplyInfo' breadcrumbName='二手房出售解押审核详情' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_SALE_MORTGAGE'/>
            <Route path='shSellLoanApplyInfo' component={SHSellLoanApplyInfo} name='shSellLoanApplyInfo' breadcrumbName='二手房出售贷款审核详情' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_SALE_LOANAPPLICATION'/>
            <Route path='shSellTransferApplyInfo' component={SHSellTransferApplyInfo} name='shSellTransferApplyInfo' breadcrumbName='二手房出售过户审核详情' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_SALE_TRANSFER'/>
            <Route path='shSellCommitApplyInfo' component={SHSellCommitApplyInfo} name='shSellCommitApplyInfo' breadcrumbName='二手房出售成交审核详情' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_SALE_HANDLE_CLINCHADEAL'/>
          </Route>
          <Route path='secondHouseRentTrade' name='secondHouseRentTrade' breadcrumbName='二手房出租'>
            <IndexRoute components={SecondHouseRentTrade} onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_RENT'/>
            <Route path='secondHouseRentTradeInfoDetails' component={SecondHouseRentTradeInfoDetails} name='secondHouseRentTradeInfoDetails' breadcrumbName='交易详情'/>
            <Route path='secondHouseRentDealIntentsAdd' component={SecondHouseRentDealIntentsAdd} name='SecondHouseRentDealIntentsAdd' breadcrumbName='添加意向金' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_RENT_INTENTION'/>
            <Route path='secondHouseRentDealUploadIntentsAgreement' component={SecondHouseRentDealUploadIntentsAgreement} name='secondHouseRentDealUploadIntentsAgreement' breadcrumbName='上传意向合同' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_RENT_INTENTION'/>
            <Route path='secondHouseRentCommissionAdd' component={SecondHouseRentCommissionAdd} name='secondHouseRentCommissionAdd' breadcrumbName='添加佣金' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_RENT_COMMISSION'/>
            <Route path='secondHouseRentDealUploadCommissionAgreement' component={SecondHouseRentDealUploadCommissionAgreement} name='secondHouseRentDealUploadCommissionAgreement' breadcrumbName='上传佣金协议' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_RENT_COMMISSION'/>
            <Route path='secondHouseRentLoanApply' component={SecondHouseRentLoanApply} name='secondHouseRentLoanApply' breadcrumbName='申请分期' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_RENT_INSTALLMENT'/>
            <Route path='secondHouseRentCommitApply' component={SecondHouseRentCommitApply} name='secondHouseRentCommitApply' breadcrumbName='成交申请' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_RENT_HANDLE_CLINCHADEAL'/>
            <Route path='secondHouseRentHousesDetails' component={SecondHouseRentHousesDetails} name='secondHouseRentHousesDetails' breadcrumbName='出租房源详情'/>
            <Route path='shRentIntentsRefundApply' component={SHRentIntentsRefundApply} name='shRentIntentsRefundApply' breadcrumbName='二手房出租意向金退款申请' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_RENT_INTENTION'/>
            <Route path='shRentIntentsRefundAuditInfo' component={SHRentIntentsRefundAuditInfo} name='shRentIntentsRefundAuditInfo' breadcrumbName='二手房出租意向金退款审核详情' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_RENT_INTENTION'/>
            <Route path='shRentCommissionRefundApply' component={SHRentCommissionRefundApply} name='shRentCommissionRefundApply' breadcrumbName='二手房出租佣金退款申请' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_RENT_COMMISSION'/>
            <Route path='shRentCommissionRefundAuditInfo' component={SHRentCommissionRefundAuditInfo} name='shRentCommissionRefundAuditInfo' breadcrumbName='二手房出租佣金退款审核详情' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_RENT_COMMISSION'/>
            <Route path='shRentCommitApplyInfo' component={SHRentCommitApplyInfo} name='shRentCommitApplyInfo' breadcrumbName='二手房出租成交审核详情' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_RENT_HANDLE_CLINCHADEAL'/>
          </Route>
        </Route>

        <Redirect from='businessManagement' to='businessManagement/businessInformationManagement'/>
        <Route path='businessManagement' name='businessManagement' breadcrumbName='企业管理'>
          <IndexRoute component={BusinessInformationManagement} onEnter={judgeRouter} qxCode='TRADINGCENTER_ENTERPRISE_INFORMATION_MANAGEMENT'/>
          <Route path='businessInformationManagement' component={BusinessInformationManagement} name='businessInformationManagement' breadcrumbName='企业信息管理' onEnter={judgeRouter} qxCode='TRADINGCENTER_ENTERPRISE_INFORMATION_MANAGEMENT'/>
          <Route path='organizeStructureManagement' component={OrganizeStructureManagement} name='organizeStructureManagement' breadcrumbName='组织架构管理' onEnter={judgeRouter} qxCode='TRADINGCENTER_ORGANIZATION_STRUCTURE_MANAGEMENT'/>
          <Route path='roleManagement' component={RoleManagement} name='roleManagement' breadcrumbName='角色管理' onEnter={judgeRouter} qxCode='TRADINGCENTER_GROUPAUTHORITY_MANAGEMENT'/>
        </Route>
        <Redirect from='financialManagement' to='financialManagement/newHouseElectricityExamination'/>
        <Route path='financialManagement' name='financialManagement' breadcrumbName='财务管理'>
          {/*<Route path='newHouseElectricityExamination' component={NewHouseElectricityExamination} name='newHouseElectricityExamination' breadcrumbName='电商交易审核'/>*/}
          <Route path='newHouseElectricityExamination' name='newHouseElectricityExamination' breadcrumbName='新房交易审核'>
            <IndexRoute component={NewHouseElectricityExamination} onEnter={judgeRouter} qxCode='TRADINGCENTER_NEWHOUSE_ELECTRICITY_TRANSACTION_APPROVAL'/>
            <Route path='nhGroupBuyRefundFinacialAudit' name='nhGroupBuyRefundFinacialAudit' breadcrumbName='新房电商团购退款财务审核' component={NHGroupBuyRefundFinacialAudit} onEnter={judgeRouter} qxCode='TRADINGCENTER_NEWHOUSE_REFUND_FINANCIAL_AUDIT'/>
            <Route path='nhCommitFinacialAudit' name='nhCommitFinacialAudit' breadcrumbName='新房成交财务审核' component={NHCommitFinacialAudit} onEnter={judgeRouter} qxCode='TRADINGCENTER_NEWHOUSE_DEAL_FINANCIAL_AUDIT'/>
          </Route>
          <Route path='secondHouseSellExamine' name='secondHouseSellExamine' breadcrumbName='二手房出售审核'>
            <IndexRoute component={SecondHouseSellExamine} onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_SALE_FINANCIAL_APPROVAL'/>
            <Route path='shSellIntentsFinanceAudit' name='shSellIntentsFinanceAudit' breadcrumbName='二手房出售意向金退款财务审核' component={SHSellIntentsFinanceAudit} onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_REFUND_FINANCIAL_AUDIT'/>
            <Route path='shSellDownPaymentFinanceAudit' name='shSellDownPaymentFinanceAudit' breadcrumbName='二手房出售首付款退款财务审核' component={SHSellDownPaymentFinanceAudit} onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_REFUND_FINANCIAL_AUDIT'/>
            <Route path='shSellCommissionFinanceAudit' name='shSellCommissionFinanceAudit' breadcrumbName='二手房出售佣金退款财务审核' component={SHSellCommissionFinanceAudit} onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_REFUND_FINANCIAL_AUDIT'/>
            <Route path='shSellCommitFinanceAudit' name='shSellCommitFinanceAudit' breadcrumbName='二手房出售成交财务审核' component={SHSellCommitFinanceAudit} onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_DEAL_FINANCIAL_AUDIT'/>
          </Route>
          <Route path='secondHouseLeaseExamine' name='secondHouseLeaseExamine' breadcrumbName='二手房出租审核'>
            <IndexRoute component={SecondHouseLeaseExamine} onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_RENT_FINANCIAL_AUDIT'/>
            <Route path='shRentIntentsFinanceAudit' name='shRentIntentsFinanceAudit' breadcrumbName='二手房出租意向金退款财务审核' component={SHRentIntentsFinanceAudit} onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_RENT_REFUND_FINANCIAL_AUDIT'/>
            <Route path='shRentCommissionFinanceAudit' name='shRentCommissionFinanceAudit' breadcrumbName='二手房出租佣金退款财务审核' component={SHRentCommissionFinanceAudit} onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_RENT_REFUND_FINANCIAL_AUDIT'/>
            <Route path='shRentCommitFinanceAudit' name='shRentCommitFinanceAudit' breadcrumbName='二手房出租成交财务审核' component={SHRentCommitFinanceAudit} onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_RENT_FINANCIAL_AUDIT'/>
          </Route>
          <Route path='newHouseRevenueManagement' component={NewHouseRevenueManagement} name='newHouseRevenueManagement' breadcrumbName='新房交易收支管理' onEnter={judgeRouter} qxCode='TRADINGCENTER_NEWHOUSE_DEAL_PAYMENTS_MANAGEMENT'/>
          <Route path='secondHouseRevenueManagement' component={SecondHouseRevenueManagement} name='secondHouseRevenueManagement' breadcrumbName='二手房交易收支管理' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_DEAL_PAYMENTS_MANAGEMENT'/>
          <Route path='serviceFeeRevenueManagement' component={ServiceFeeRevenueManagement} name='serviceFeeRevenueManagement' breadcrumbName='服务费收益管理' onEnter={judgeRouter} qxCode='TRADINGCENTER_SERVICEFEE_REVENUE_MANAGEMENT'/>
        </Route>
        <Redirect from='loanManagement' to='loanManagement/secondHandHouseSolution'/>
        <Route path='loanManagement' name='loanManagement' breadcrumbName='贷款管理'>
          <Route path='secondHandHouseMortgageDeal' component={SecondHandHouseMortgageDeal} name='secondHandHouseMortgageDeal' breadcrumbName='二手房贷款办理' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_LOAN'/>
          <Route path='secondHandHouseSolution' component={SecondHandHouseSolution} name='secondHandHouseSolution' breadcrumbName='二手房解押贷款办理' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_SIGN_LOAN'/>
          <Route path='secondHandHouseRentalLoans' component={SecondHandHouseRentalLoans} name='secondHandHouseRentalLoans' breadcrumbName='二手房出租分期办理' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_RENT_INSTALLMENT_MANAGEMENT'/>
        </Route>
        <Redirect from='transferManagement' to='transferManagement/secondHandHouseTransfer'/>
        <Route path='transferManagement' name='transferManagement' breadcrumbName='过户管理'>
          <Route path='secondHandHouseTransfer' component={SecondHandHouseTransfer} name='secondHandHouseTransfer' breadcrumbName='二手房过户办理' onEnter={judgeRouter} qxCode='TRADINGCENTER_CHANGENAME_MANAGEMENT'/>
        </Route>
        <Redirect from='dataAnalysis' to='dataAnalysis/tradeStatistics'/>
        <Route path='dataAnalysis' name='dataAnalysis' breadcrumbName='数据分析'>
          {/*<Route path='tradeStatistics' component={TradeStatistics}/>
          <Route path='teamStatistics' component={TeamStatistics}/>
          <Route path='commissionStatistics' component={CommissionStatistics}/>*/}
          <Route path='tradeStatistics' component={TradeStatistics} name='tradeStatistics' breadcrumbName='交易统计' onEnter={judgeRouter} qxCode='TRADINGCENTER_TRADING_STATISTICAL'/>
          <Route path='teamStatistics' component={TeamStatistics} name='teamStatistics' breadcrumbName='团队统计' onEnter={judgeRouter} qxCode='TRADINGCENTER_TEAM_STATISTICAL'/>
          <Route path='commissionStatistics' component={CommissionStatistics} name='commissionStatistics' breadcrumbName='交易服务费统计' onEnter={judgeRouter} qxCode='TRADINGCENTER_SERVICEFEE_STATISTICAL'/>
        </Route>
        <Route path='operationLog' name='operationLog' breadcrumbName='操作日志'>
          <IndexRoute component={OperationLog} onEnter={judgeRouter} qxCode='TRADINGCENTER_OPERATION_LOG'/>
        </Route>
        <Route path='contractTemplate' name='contractTemplate' breadcrumbName='合同模板'>
          <IndexRoute component={ContractTemplate} onEnter={judgeRouter} qxCode='TRADINGCENTER_CONTRACT_TEMPLATE'/>
        </Route>
        <Route path='instructions' name='instructions' breadcrumbName='使用帮助'>
          <IndexRoute component={Instructions} onEnter={judgeRouter} qxCode='TRADINGCENTER_USE_HELP'/>
        </Route>
        <Redirect from='contractReview' to='contractReview/newHouseContractReview'/>
        <Route path='contractReview' name='contractReview' breadcrumbName='合同审核'>
          <Route path='newHouseContractReview' component={NewHouseContractReview} name='newHouseContractReview' breadcrumbName='新房项目审核' onEnter={judgeRouter} qxCode='TRADINGCENTER_PROJECT_ISSUED_AUDIT'/>
          {/*<Route path='newhousetransactionContractReview' component={NewhousetransactionContractReview} name='newhousetransactionContractReview' breadcrumbName='新房交易合同审核'/>*/}
          <Route path='newhousetransactionContractReview' name='newhousetransactionContractReview' breadcrumbName='新房交易合同审核'>
            <IndexRoute component={NewhousetransactionContractReview} onEnter={judgeRouter} qxCode='TRADINGCENTER_NEWHOUSE_CONTRACT_AUDIT'/>
            <Route path='nhGroupBuyRefundContractAudit' component={NHGroupBuyRefundContractAudit} name='nhGroupBuyRefundContractAudit' breadcrumbName='新房电商团购退款合同审核' onEnter={judgeRouter} qxCode='TRADINGCENTER_NEWHOUSE_ELECTRICITY_CONTRACT_AUDIT'/>
            <Route path='nhCommitContractAudit' component={NHCommitContractAudit} name='nhCommitContractAudit' breadcrumbName='新房成交合同审核' onEnter={judgeRouter} qxCode='TRADINGCENTER_TRADING_CONTRACT_AUDIT'/>
          </Route>
          {/*<Route path='secondHandHouseSalesAudit' component={SecondHandHouseSalesAudit} name='secondHandHouseSalesAudit' breadcrumbName='二手房出售合同审核'/>*/}
          <Redirect from='contractReview' to='contractReview/newHouseContractReview'/>
          <Route path='secondHandHouseSalesAudit' name='secondHandHouseSalesAudit' breadcrumbName='二手房出售合同审核'>
            <IndexRoute component={SecondHandHouseSalesAudit} onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_SELL_CONTRACT_AUDIT'/>
            <Route path='shSellIntentsContractAudit' component={SHSellIntentsContractAudit} name='shSellIntentsContractAudit' breadcrumbName='二手房出售意向金退款合同审核' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_REFUND_CONTRACT_AUDIT'/>
            <Route path='shSellDownPaymentContractAudit' component={SHSellDownPaymentContractAudit} name='shSellDownPaymentContractAudit' breadcrumbName='二手房出售首付款退款合同审核' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_REFUND_CONTRACT_AUDIT'/>
            <Route path='shSellCommissionContractAudit' component={SHSellCommissionContractAudit} name='shSellCommissionContractAudit' breadcrumbName='二手房出售佣金退款合同审核' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_REFUND_CONTRACT_AUDIT'/>
            <Route path='shSellCommitContractAudit' component={SHSellCommitContractAudit} name='shSellCommitContractAudit' breadcrumbName='二手房出售成交合同审核' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_DEAL_CONTRACT_AUDIT'/>
          </Route>
          <Route path='secondHandHouseRentalAudit' name='secondHandHouseRentalAudit' breadcrumbName='二手房出租合同审核'>
            <IndexRoute component={SecondHandHouseRentalAudit} onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_RENT_CONTRACT_APPROVE'/>
            <Route path='shRentIntentsContractAudit' component={SHRentIntentsContractAudit} name='shRentIntentsContractAudit' breadcrumbName='二手房出租意向金退款合同审核' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_RENT_REFUND_CONTRACT_AUDIT'/>
            <Route path='shRentCommissionContractAudit' component={SHRentCommissionContractAudit} name='shRentCommissionContractAudit' breadcrumbName='二手房出租佣金退款合同审核' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_RENT_REFUND_CONTRACT_AUDIT'/>
            <Route path='shRentCommitContractAudit' component={SHRentCommitContractAudit} name='shRentCommitContractAudit' breadcrumbName='二手房出租成交合同审核' onEnter={judgeRouter} qxCode='TRADINGCENTER_SECONDHAND_RENT_CONTRACT_AUDIT'/>
          </Route>
        </Route>
        <Redirect from='newHouseOnline' to='newHouseOnline/projectManagement'/>
        <Route path='newHouseOnline' name='newHouseOnline' breadcrumbName='新房电商'>
          <Route path='projectManagement' name='projectManagement' breadcrumbName='项目管理'>
            <IndexRoute component={ProjectManagement} onEnter={judgeRouter} qxCode='TRADINGCENTER_PROJECT_MANAGEMENT'/>
            {/*<Route path="createPro">
                <Route path='navbar' component={NavBar}/>
            </Route>*/}
            <Redirect from='createProject' to='createProject/basicMessage'/>
              <Route path="createProject" component={CreateProject} name='createProject' breadcrumbName='创建项目'>
                <Route path='basicMessage' component={BasicMessage}/>
                <Route path='uploadProjectPhoto' component={UploadProjectPhoto}/>
                <Route path='houseTypeImgManagement' component={HouseTypeImgManagement}/>
                <Route path='createProjectConcessions' component={CreateProjectConcessions}/>
                <Route path='uploadAptitude' component={UploadAptitude}/>
                <Route path='createProjectTable' component={CreateProjectTable}/>
              </Route>
          </Route>
        </Route>
      </Route>
      <Route path='/login' component={Login}/>
    </Router>
  )
}
function checkLogin(nextState, replace){
  // console.log('nextState',nextState);
  if(!sessionStorage.getItem('anzhu_login')){
    //未登录
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}
//路由权限判断
function judgeRouter(nextState,replace){
  setTimeout(judgeRouterJurisdiction(nextState,replace),300);
}
function judgeRouterJurisdiction(nextState,replace){
  // console.log('nextState',nextState);
  const code = nextState.routes[nextState.routes.length-1].qxCode
  // console.log('code',code);
  if(!!code && judgeJurisdiction(code)){
    //具有权限
    // console.log('具有权限');
  }else{
    //不具有权限推向首页
    // console.log('不具有权限推向首页');
    replace({
      pathname: '/indexPage',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}
// checkJurisdiction()
// function test1(nextState, replace){
//   if(1===1){
//     //未登录
//     replace({
//       pathname: '/indexPage',
//       state: { nextPathname: nextState.location.pathname }
//     })
//   }
// }
// function test2(nextState, replace,c){
//   console.log('c',c);
//   if(1===2){
//     //未登录
//     replace({
//       pathname: '/indexPage',
//       state: { nextPathname: nextState.location.pathname }
//     })
//   }
// }
