import main from './main'
import login from './login'
import indexPage from './indexPage'
import information from './information'
import informationInfo from './informationInfo'
import accountManagement from './accountManagement'
import newHouseDeal from './DealManage/newHouseDeal/newHouseDeal'
// import newHouseDeal from './DealManage/newHouseDeal/newHouseDeal'
///du///
//新房
import newHouseTrade from './tradeManagement/newHouseTrade/newHouseTrade'
import creatClient from './tradeManagement/newHouseTrade/creatClient'
import creatGroupBuy from './tradeManagement/newHouseTrade/creatGroupBuy'
import customerDoLook from './tradeManagement/newHouseTrade/customerDoLook'
import creatTransactions from './tradeManagement/newHouseTrade/creatTransactions'
import projectDetails from './tradeManagement/newHouseTrade/projectDetails'
import uploadGroupBuyAgreement from './tradeManagement/newHouseTrade/uploadGroupBuyAgreement'
import newHouseTradeInfoDetails from './tradeManagement/newHouseTrade/newHouseTradeInfoDetails'
import housesManagement from './tradeManagement/newHouseTrade/housesManagement'
import nhGroupBuyRefundApply from './tradeManagement/newHouseTrade/nhGroupBuyRefundApply'
import nhGroupBuyRefundAuditInfo from './tradeManagement/newHouseTrade/nhGroupBuyRefundAuditInfo'
import nhCommitApply from './tradeManagement/newHouseTrade/nhCommitApply'
import nhCommitAuditInfo from './tradeManagement/newHouseTrade/nhCommitAuditInfo'
//二手房
import secondHouseSellTrade from './tradeManagement/secondHouseSellTrade/secondHouseSellTrade'
import secondHouseSellTradeInfoDetails from './tradeManagement/secondHouseSellTrade/secondHouseSellTradeInfoDetails'
import secondHouseSellDealUploadIntentsAgreement from './tradeManagement/secondHouseSellTrade/secondHouseSellDealUploadIntentsAgreement'
import secondHouseSellDealUploadDownPaymentAgreement from './tradeManagement/secondHouseSellTrade/secondHouseSellDealUploadDownPaymentAgreement'
import secondHouseSellLoanApply from './tradeManagement/secondHouseSellTrade/secondHouseSellLoanApply'
import secondHouseSellTransferApply from './tradeManagement/secondHouseSellTrade/secondHouseSellTransferApply'
import secondHouseSellCommitApply from './tradeManagement/secondHouseSellTrade/secondHouseSellCommitApply'

import secondHouseRelieveLoan from './tradeManagement/secondHouseSellTrade/secondHouseRelieveLoan'
import secondHouseRelieveLoanDetails from './tradeManagement/secondHouseSellTrade/secondHouseRelieveLoanDetails'
import secondHouseSellDealIntentsAdd from './tradeManagement/secondHouseSellTrade/secondHouseSellDealIntentsAdd'
import secondHouseSellDownPaymentAdd from './tradeManagement/secondHouseSellTrade/secondHouseSellDownPaymentAdd'
import secondHouseSellCommissionAdd from './tradeManagement/secondHouseSellTrade/secondHouseSellCommissionAdd'
import secondHouseSellDealUploadCommissionAgreement from './tradeManagement/secondHouseSellTrade/secondHouseSellDealUploadCommissionAgreement'
import secondHouseSellHousesDetails from './tradeManagement/secondHouseSellTrade/secondHouseSellHousesDetails'
import shSellIntentsRefundApply from './tradeManagement/secondHouseSellTrade/shSellIntentsRefundApply'
import shSellIntentsRefundAuditInfo from './tradeManagement/secondHouseSellTrade/shSellIntentsRefundAuditInfo'
import shSellDownPaymentRefundApply from './tradeManagement/secondHouseSellTrade/shSellDownPaymentRefundApply'
import shSellDownPaymentRefundAuditInfo from './tradeManagement/secondHouseSellTrade/shSellDownPaymentRefundAuditInfo'
import shSellCommissionRefundApply from './tradeManagement/secondHouseSellTrade/shSellCommissionRefundApply'
import shSellCommissionRefundAuditInfo from './tradeManagement/secondHouseSellTrade/shSellCommissionRefundAuditInfo'
import shRelieveLoanApplyInfo from './tradeManagement/secondHouseSellTrade/shRelieveLoanApplyInfo'
import shSellLoanApplyInfo from './tradeManagement/secondHouseSellTrade/shSellLoanApplyInfo'
import shSellTransferApplyInfo from './tradeManagement/secondHouseSellTrade/shSellTransferApplyInfo'
import shSellCommitApplyInfo from './tradeManagement/secondHouseSellTrade/shSellCommitApplyInfo'
//二手房出租
import secondHouseRentTrade from './tradeManagement/secondHouseRentTrade/secondHouseRentTrade'
import secondHouseRentTradeInfoDetails from './tradeManagement/secondHouseRentTrade/secondHouseRentTradeInfoDetails'
import secondHouseRentDealIntentsAdd from './tradeManagement/secondHouseRentTrade/secondHouseRentDealIntentsAdd'
import secondHouseRentDealUploadIntentsAgreement from './tradeManagement/secondHouseRentTrade/secondHouseRentDealUploadIntentsAgreement'
import secondHouseRentCommissionAdd from './tradeManagement/secondHouseRentTrade/secondHouseRentCommissionAdd'
import secondHouseRentDealUploadCommissionAgreement from './tradeManagement/secondHouseRentTrade/secondHouseRentDealUploadCommissionAgreement'
import secondHouseRentLoanApply from './tradeManagement/secondHouseRentTrade/secondHouseRentLoanApply'
import secondHouseRentCommitApply from './tradeManagement/secondHouseRentTrade/secondHouseRentCommitApply'
import secondHouseRentHousesDetails from './tradeManagement/secondHouseRentTrade/secondHouseRentHousesDetails'
import shRentIntentsRefundApply from './tradeManagement/secondHouseRentTrade/shRentIntentsRefundApply'
import shRentIntentsRefundAuditInfo from './tradeManagement/secondHouseRentTrade/shRentIntentsRefundAuditInfo'
import shRentCommissionRefundApply from './tradeManagement/secondHouseRentTrade/shRentCommissionRefundApply'
import shRentCommissionRefundAuditInfo from './tradeManagement/secondHouseRentTrade/shRentCommissionRefundAuditInfo'
import shRentCommitApplyInfo from './tradeManagement/secondHouseRentTrade/shRentCommitApplyInfo'

///du//

import inventoryControl from './DealManage/newHouseDeal/inventoryControl'
// import creatGroupBuy from './DealManage/newHouseDeal/creatGroupBuy'
import secondDeal from './DealManage/secondDeal/secondDeal'

// 财务审核
import newHouseElectricityExamination from './financialManagement/newHouseElectricityExamination'
import secondHandHouseFinancialSalesAudit from './financialManagement/secondHandHouseFinancialSalesAudit'
import secondHandHouseFinancialRentalAudit from './financialManagement/secondHandHouseFinancialRentalAudit'
import newHouseRevenueManagement from './financialManagement/newHouseRevenueManagement'
import shSellIntentsFinanceAudit from './financialManagement/shSellIntentsFinanceAudit'
import shSellDownPaymentFinanceAudit from './financialManagement/shSellDownPaymentFinanceAudit'
import shSellCommissionFinanceAudit from './financialManagement/shSellCommissionFinanceAudit'
import shSellCommitFinanceAudit from './financialManagement/shSellCommitFinanceAudit'
import shRentIntentsFinanceAudit from './financialManagement/shRentIntentsFinanceAudit'
import shRentCommissionFinanceAudit from './financialManagement/shRentCommissionFinanceAudit'
import shRentCommitFinanceAudit from './financialManagement/shRentCommitFinanceAudit'
import secondHouseRevenueManagement from './financialManagement/secondHouseRevenueManagement'
import serviceFeeRevenueManagement from './financialManagement/serviceFeeRevenueManagement'
import nhGroupBuyRefundFinacialAudit from './financialManagement/nhGroupBuyRefundFinacialAudit'
import nhCommitFinacialAudit from './financialManagement/nhCommitFinacialAudit'


import secondHandHouseTransfer from './transferManagement/secondHandHouseTransfer'
import auditPassOrRejectModal from './transferManagement/auditPassOrRejectModal'


import secondLeaseDeal from './DealManage/secondLeaseDeal/secondLeaseDeal'
//企业管理
import organizeStructureManagement from './businessManagement/organizeStructureManagement'
import employeeInformation from './businessManagement/employeeInformation'
import creatEmployee from './businessManagement/creatEmployee'
import roleManagement from './businessManagement/roleManagement'
import businessInformationManagement from './businessManagement/businessInformationManagement'

//一下内容add by jc
// import createConcessions from './DealManage/newHouseDeal/createPro/createConcessions'
// import CreateHouseType from './DealManage/newHouseDeal/createPro/CreateHouseType'
// import createNewHouse from './DealManage/newHouseDeal/createPro/createNewHouse'
// import CreateProjectTable from './DealManage/newHouseDeal/createPro/CreateProjectTable'
// import ImgManagement from './DealManage/newHouseDeal/createPro/ImgManagement'
// import step from './DealManage/newHouseDeal/createPro/step'
// import uploadAptitude from './DealManage/newHouseDeal/createPro/uploadAptitude'
import createProjectConcessions from './newHouseOnline/projectManagement/newHouseOnlineCreatePro/createProjectConcessions'
import basicMessage from './newHouseOnline/projectManagement/newHouseOnlineCreatePro/basicMessage'
import createProjectTable from './newHouseOnline/projectManagement/newHouseOnlineCreatePro/createProjectTable'
import houseTypeImgManagement from './newHouseOnline/projectManagement/newHouseOnlineCreatePro/houseTypeImgManagement'
import createProject from './newHouseOnline/projectManagement/newHouseOnlineCreatePro/createProject'
import uploadAptitude from './newHouseOnline/projectManagement/newHouseOnlineCreatePro/uploadAptitude'
import uploadProjectPhoto from './newHouseOnline/projectManagement/newHouseOnlineCreatePro/uploadProjectPhoto'
import projectManagement from './newHouseOnline/projectManagement/projectManagement'

//以上内容add by jc
//数据分析
import tradeStatistics from './dataAnalysis/tradeStatistics'
import teamStatistics from './dataAnalysis/teamStatistics'
import commissionStatistics from './dataAnalysis/commissionStatistics'
//贷款管理
import secondHandHouseMortgageDeal from './loanManagement/secondHandHouseMortgageDeal'
import secondHandHouseSolution from './loanManagement/secondHandHouseSolution'
import secondHandHouseRentalLoans from './loanManagement/secondHandHouseRentalLoans'

//新房确看详情
import doLookDetails from './tradeManagement/newHouseTrade/doLookDetails'
import groupBuyDetails from './tradeManagement/newHouseTrade/groupBuyDetails'
import dealDetails from './tradeManagement/newHouseTrade/dealDetails'

//操作日志
import operationLog from './operationLog';
//成交/合同审核
import newHouseContractReview from './contractReview/newHouseContractReview'
import newHouseTransactionContractReview from './contractReview/newHouseTransactionContractReview'
import auditExplainModal from './contractReview/auditExplainModal'
import secondHandHouseSalesAudit from './contractReview/secondHandHouseSalesAudit'
import secondHandHouseRentalAudit from './contractReview/secondHandHouseRentalAudit'
import shSellIntentsContractAudit from './contractReview/shSellIntentsContractAudit'
import shSellDownPaymentContractAudit from './contractReview/shSellDownPaymentContractAudit'
import shSellCommissionContractAudit from './contractReview/shSellCommissionContractAudit'
import shSellCommitContractAudit from './contractReview/shSellCommitContractAudit'
import shRentIntentsContractAudit from './contractReview/shRentIntentsContractAudit'
import shRentCommissionContractAudit from './contractReview/shRentCommissionContractAudit'
import shRentCommitContractAudit from './contractReview/shRentCommitContractAudit'
import nhGroupBuyRefundContractAudit from './contractReview/nhGroupBuyRefundContractAudit'
import nhCommitContractAudit from './contractReview/nhCommitContractAudit'

//合同模板
import contractTemplate from './contractTemplate/contractTemplate'

export default [
  main,
  login,//登录页
  indexPage,
  accountManagement,
  information,
  informationInfo,
  // 新房,
  newHouseTrade,
  creatGroupBuy,
  customerDoLook,
  creatTransactions,
  projectDetails,
  uploadGroupBuyAgreement,
  newHouseTradeInfoDetails,
  housesManagement,
  nhGroupBuyRefundApply,
  nhGroupBuyRefundAuditInfo,
  nhCommitApply,
  nhCommitAuditInfo,
  // 二手房,
  secondHouseSellTrade,//二手房出售
  secondHouseSellTradeInfoDetails,//二手房出售交易详情
  secondHouseSellDealUploadIntentsAgreement,//二手房出售意向金上传合同
  secondHouseSellDealUploadDownPaymentAgreement,//二手房出售首付款上传合同
  secondHouseRelieveLoan,//二手房解贷
  secondHouseRelieveLoanDetails,//二手房解贷详情
  secondHouseSellDealIntentsAdd,//二手房意向金
  secondHouseSellDownPaymentAdd,//二手房首付款
  secondHouseSellCommissionAdd,//二手房佣金
  secondHouseSellDealUploadCommissionAgreement,//二手房出售上传佣金合同
  secondHouseSellLoanApply,//二手房出售申请贷款分期
  secondHouseSellTransferApply,//二手房出售申请过户
  secondHouseSellCommitApply,//二手房出售申请成交
  secondHouseSellHousesDetails,//二手房出售房源详情
  shSellIntentsRefundApply,//二手房出售意向金退款申请
  shSellIntentsRefundAuditInfo,//二手房出售意向金退款申请审核详情
  shSellDownPaymentRefundApply,//二手房出售首付款退款申请
  shSellDownPaymentRefundAuditInfo,//二手房出售首付款退款申请审核详情
  shSellCommissionRefundApply,//二手房出售佣金退款申请
  shSellCommissionRefundAuditInfo,//二手房出售佣金退款申请审核详情
  shRelieveLoanApplyInfo,//二手房出售解押申请审核详情
  shSellLoanApplyInfo,//二手房出售贷款申请审核详情
  shSellTransferApplyInfo,//二手房出售过户申请审核详情
  shSellCommitApplyInfo,//二手房出售成交申请审核详情

  secondHouseRentTrade,//二手房出租
  secondHouseRentTradeInfoDetails,//二手房出租详情
  secondHouseRentDealIntentsAdd,//二手房出租缴纳意向
  secondHouseRentDealUploadIntentsAgreement,//二手房出租上传意向合同
  secondHouseRentCommissionAdd,//二手房出租缴纳佣金
  secondHouseRentDealUploadCommissionAgreement,//二手房出租上传佣金合同
  secondHouseRentLoanApply,//二手房出租申请分期
  secondHouseRentCommitApply,//二手房出租成交申请
  secondHouseRentHousesDetails,//二手房出租房源详情
  shRentIntentsRefundApply,//二手房出租意向金退款申请
  shRentIntentsRefundAuditInfo,//二手房出租意向金退款审核详情
  shRentCommissionRefundApply,//二手房出租佣金退款申请
  shRentCommissionRefundAuditInfo,//二手房出租佣金退款审核详情
  shRentCommitApplyInfo,//二手房出租成交审核详情

  inventoryControl,
  newHouseElectricityExamination,
  secondHandHouseFinancialSalesAudit,
  secondHandHouseFinancialRentalAudit,
  secondLeaseDeal,
  organizeStructureManagement,
  employeeInformation,
  creatEmployee,
  roleManagement,
  // createConcessions,
  // CreateHouseType,
  // createNewHouse,
  // CreateProjectTable,
  // ImgManagement,
  // step,
  // uploadAptitude,
  //一下为创建新房state
  createProjectConcessions,
  basicMessage,
  createProjectTable,
  houseTypeImgManagement,
  createProject,
  uploadAptitude,
  uploadProjectPhoto,
  projectManagement,
  //以上为创建新房state
  secondHandHouseTransfer,
  auditPassOrRejectModal,

  creatClient,
  businessInformationManagement,
  tradeStatistics,
  teamStatistics,
  commissionStatistics,

  newHouseRevenueManagement,
  nhGroupBuyRefundFinacialAudit,//新房团购退款财务审核
  nhCommitFinacialAudit,//新房成交财务审核
  secondHouseRevenueManagement,
  serviceFeeRevenueManagement,
  shSellIntentsFinanceAudit,//二手房出售意向金财务审核
  shSellDownPaymentFinanceAudit,//二手房出售首付款财务审核
  shSellCommissionFinanceAudit,//二手房出售佣金财务审核
  shSellCommitFinanceAudit,//二手房出售成交财务审核
  shRentIntentsFinanceAudit,//二手房出租意向金退款财务审核
  shRentCommissionFinanceAudit,//二手房出租佣金退款财务审核
  shRentCommitFinanceAudit,//二手房出租成交财务审核
  //贷款管理
  secondHandHouseMortgageDeal,
  secondHandHouseSolution,
  secondHandHouseRentalLoans,

  doLookDetails,
  groupBuyDetails,
  dealDetails,
	operationLog,
  //以下为合同审核State
	newHouseContractReview,
	newHouseTransactionContractReview,
  auditExplainModal,
  secondHandHouseSalesAudit,
  secondHandHouseRentalAudit,
  shSellIntentsContractAudit,//二手房出售意向金退款合同审核
  shSellDownPaymentContractAudit,//二手房出售意向金退款合同审核
  shSellCommissionContractAudit,//二手房出售佣金退款合同审核
  shSellCommitContractAudit,//二手房出售成交合同审核
  shRentIntentsContractAudit,//二手房出租意向金退款合同审核
  shRentCommissionContractAudit,//二手房出租佣金退款合同审核
  shRentCommitContractAudit,//二手房出租成交合同审核
  nhGroupBuyRefundContractAudit,//新房团购退款合同审核
  nhCommitContractAudit,//新房成交合同审核
  //以上为合同审核State
  //合同模板
  contractTemplate,
]
