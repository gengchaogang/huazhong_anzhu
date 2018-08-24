import main from './main'
import login from './login'
import indexPage from './indexPage'
import step from './resourceManagement/newHousePro/createPro/step'
import newHousePro from './resourceManagement/newHousePro';
import secondNavBar from './resourceManagement/secondhandHouseSell/secondhandHouseSelling/secondNavBar'
import secondhandHouseSell from './resourceManagement/secondhandHouseSell';
import cityManagement from './cityManagement';
import brokerIdIndex from './idManagement/brokerIdIndex';
import brokerIdDetail from './idManagement/brokerIdDetail';
//帐号管理>客户列表
import customerIndex from './idManagement/customerManagement'

import advisorIdIndex from './idManagement/advisorIdIndex';
import advisorIdDetail from './idManagement/advisorIdDetail';
import dealCenterIdIndex from './idManagement/dealCenterIdIndex';
import dealCenterIdDetail from './idManagement/dealCenterIdDetail';
import agentIdIndexNewAccount from './idManagement/agentIdIndexNewAccount';
import agentIdIndex from './idManagement/agentIdIndex';
import agentIdDetail from './idManagement/agentIdDetail';
import newAccount from './idManagement/newAccount';
import labelManagement from './labelManagement';
import earningSetting from './earningSetting/eachSideEarningMatch';
import availabilityDetails from './resourceManagement/storeSell/saleingShops/availabilityDetails';
import zhangHuGuanLiBroker from './accountManagement/zhangHuGuanLiBroker';
import zhangHuDetail from './accountManagement/zhangHuDetail';
import brokerDetailed from './accountManagement/brokerDetailed';
import accountTutor from './accountManagement/accountTutor';
import accountTutorDetail from './accountManagement/accountTutorDetail';
import dealCenterSettlement from './accountManagement/dealCenterSettlement';
import agentSettlement from './accountManagement/agentSettlement';
import tutorDetailed from './accountManagement/tutorDetailed';
import accountDealCenter from './accountManagement/accountDealCenter';
import accountDealCenterDetail from './accountManagement/accountDealCenterDetail';
import dealCenterDetailIncome from './accountManagement/dealCenterDetailIncome';
import zhangHuGuanLiAgent from './accountManagement/zhangHuGuanLiAgent';
import accountAgentDetail from './accountManagement/accountAgentDetail';
import agentDetailIncome from './accountManagement/agentDetailIncome';
import platformFund from './financeManagement/platformFund';
import platformFundDetail from './financeManagement/platformFundDetail';
import platformSettlement from './financeManagement/platformSettlement';
import platformEarningBalanceDetail from './financeManagement/platformEarningBalanceDetail';
import expenditureDetail from './financeManagement/expenditureDetail';
import platformEarningBalance from './financeManagement/platformEarningBalance';

//楼盘字典小区
import residentialArea from './developmentDictionary/residentialArea';
//楼盘字典新建编辑
import createCell from './developmentDictionary/createCell'
//楼盘字典相册管理
import photoManagement from './developmentDictionary/photoManagement'
//楼盘字典小区定位
import positionMap from './developmentDictionary/positionMap'
//楼盘字典楼栋管理
import loudongManagement from './developmentDictionary/loudongManagement'
//楼盘字典房号
import watchHousingNumber from './developmentDictionary/watchHousingNumber'
import watchHousingNumberShop from './developmentDictionary/watchHousingNumberShop'
import watchHousingNumberOffice from './developmentDictionary/watchHousingNumberOffice'
//楼盘字典商铺
import shopsManagement from './developmentDictionary/shopsManagement';
//楼盘字典创建页面
import shopsCreateShangPu from './developmentDictionary/shopsCreateShangPu';
//楼盘字典商铺楼栋管理
import shopsLoudongManagement from './developmentDictionary/shopsLoudongManagement';
//楼盘字典商铺楼栋管理
import shopsPosition from './developmentDictionary/shopsPosition';
//楼盘字典商铺相册管理
import shopsPhotoManagement from './developmentDictionary/shopsPhotoManagement';
//楼盘字典写字楼管理
import officeBuilding from './developmentDictionary/officeBuilding'
//楼盘字典写字楼楼栋管理
import officeLoudongManagement from './developmentDictionary/officeLoudongManagement'
//楼盘字典写字楼相册管理
import officePhotoManagement from './developmentDictionary/officePhotoManagement'
//楼盘字典写字楼创建
import officceCreateBuilding from './developmentDictionary/officceCreateBuilding'

//收益设置收益分配
import eachSideEarningsMatchingIndex from './earningSetting/eachSideEarningsMatchingIndex'
//收益设置佣金配比方案
import brokerageMatching from './earningSetting/brokerageMatching'


//广告管理
import putManage from './adManagement/putManage'

//新房管理首页
import newHouseProIndex from './resourceManagement/newHousePro/newHouseProIndex'
import projectDetailsBackStage from './resourceManagement/newHousePro/projectDetailsBackStage'
//房源管理项目下架
import houseResourceOffline from './resourceManagement/houseResourceOffline/houseResourceOffline'
import houseResourceOfflineDetail from './resourceManagement/houseResourceOffline/houseResourceOfflineDetail'
import secHouseShopOffceDetail from './resourceManagement/houseResourceOffline/secHouseShopOffceDetail'
//新房管理二手房在首详情
import secHandSellingNavBar from './resourceManagement/secondhandHouseSell/secondhandHouseSelling/details/secHandSellingNavBar'
import secHandSellingDetails from './resourceManagement/secondhandHouseSell/secondhandHouseSelling/details/secHandSellingDetails'
import secHandSellingVideoAndImgs from './resourceManagement/secondhandHouseSell/secondhandHouseSelling/details/secHandSellingVideoAndImgs'
import secHandSellingAgentBroker from './resourceManagement/secondhandHouseSell/secondhandHouseSelling/details/secHandSellingAgentBroker'
import secHandSellingRecord from './resourceManagement/secondhandHouseSell/secondhandHouseSelling/details/secHandSellingRecord'
import secHandSellingDeal from './resourceManagement/secondhandHouseSell/secondhandHouseSelling/details/secHandSellingDeal'
//新房管理二手房已售详情
import secHandSelledNavBar from './resourceManagement/secondhandHouseSell/secondhandHouseSelled/details/secHandSelledNavBar'
import secHandSelledDetails from './resourceManagement/secondhandHouseSell/secondhandHouseSelled/details/secHandSelledDetails'
import secHandSelledVideoAndImgs from './resourceManagement/secondhandHouseSell/secondhandHouseSelled/details/secHandSelledVideoAndImgs'
import secHandSelledAgentBroker from './resourceManagement/secondhandHouseSell/secondhandHouseSelled/details/secHandSelledAgentBroker'
import secHandSelledRecord from './resourceManagement/secondhandHouseSell/secondhandHouseSelled/details/secHandSelledRecord'
import secHandSelledDeal from './resourceManagement/secondhandHouseSell/secondhandHouseSelled/details/secHandSelledDeal'

//二手房出租
import secondhandRentIndex from './resourceManagement/secondhandHouseRent/secondhandRentIndex'
//新房管理二手房出租详情
import secHandRentingNavBar from './resourceManagement/secondhandHouseRent/secondhandHouseRenting/details/secHandRentingNavBar'
import secHandRentingDetails from './resourceManagement/secondhandHouseRent/secondhandHouseRenting/details/secHandRentingDetails'
import secHandRentingVideoAndImgs from './resourceManagement/secondhandHouseRent/secondhandHouseRenting/details/secHandRentingVideoAndImgs'
import secHandRentingAgentBroker from './resourceManagement/secondhandHouseRent/secondhandHouseRenting/details/secHandRentingAgentBroker'
import secHandRentingRecord from './resourceManagement/secondhandHouseRent/secondhandHouseRenting/details/secHandRentingRecord'
import secHandRentingDeal from './resourceManagement/secondhandHouseRent/secondhandHouseRenting/details/secHandRentingDeal'
//新房管理二手房已租详情
import secHandRentedNavBar from './resourceManagement/secondhandHouseRent/secondhandHouseRented/details/secHandRentedNavBar'
import secHandRentedDetails from './resourceManagement/secondhandHouseRent/secondhandHouseRented/details/secHandRentedDetails'
import secHandRentedVideoAndImgs from './resourceManagement/secondhandHouseRent/secondhandHouseRented/details/secHandRentedVideoAndImgs'
import secHandRentedAgentBroker from './resourceManagement/secondhandHouseRent/secondhandHouseRented/details/secHandRentedAgentBroker'
import secHandRentedRecord from './resourceManagement/secondhandHouseRent/secondhandHouseRented/details/secHandRentedRecord'
import secHandRentedDeal from './resourceManagement/secondhandHouseRent/secondhandHouseRented/details/secHandRentedDeal'
//商铺出售首页
import storeSell from './resourceManagement/storeSell/storeSell'
//新房管理商铺在首详情
import storeSellingNavBar from './resourceManagement/storeSell/storeSelling/storeSellingNavBar'
import storeSellingDetails from './resourceManagement/storeSell/storeSelling/storeSellingDetails'
import storeSellingVideoAndImgs from './resourceManagement/storeSell/storeSelling/storeSellingVideoAndImgs'
import storeSellingAgentBroker from './resourceManagement/storeSell/storeSelling/storeSellingAgentBroker'
import storeSellingRecord from './resourceManagement/storeSell/storeSelling/storeSellingRecord'
import storeSellingDeal from './resourceManagement/storeSell/storeSelling/storeSellingDeal'
//新房管理商铺已售详情
import storeSelledNavBar from './resourceManagement/storeSell/storeSelled/storeSelledNavBar'
import storeSelledDetails from './resourceManagement/storeSell/storeSelled/storeSelledDetails'
import storeSelledVideoAndImgs from './resourceManagement/storeSell/storeSelled/storeSelledVideoAndImgs'
import storeSelledAgentBroker from './resourceManagement/storeSell/storeSelled/storeSelledAgentBroker'
import storeSelledRecord from './resourceManagement/storeSell/storeSelled/storeSelledRecord'
import storeSelledDeal from './resourceManagement/storeSell/storeSelled/storeSelledDeal'
// //商铺出售首页
import storeRent from './resourceManagement/storeRent/storeRent'
//新房管理商铺在租详情
import storeRentingNavBar from './resourceManagement/storeRent/storeRenting/storeRentingNavBar'
import storeRentingDetails from './resourceManagement/storeRent/storeRenting/storeRentingDetails'
import storeRentingVideoAndImgs from './resourceManagement/storeRent/storeRenting/storeRentingVideoAndImgs'
import storeRentingAgentBroker from './resourceManagement/storeRent/storeRenting/storeRentingAgentBroker'
import storeRentingRecord from './resourceManagement/storeRent/storeRenting/storeRentingRecord'
import storeRentingDeal from './resourceManagement/storeRent/storeRenting/storeRentingDeal'
// //新房管理商铺已租详情
import storeRentedNavBar from './resourceManagement/storeRent/storeRented/storeRentedNavBar'
import storeRentedDetails from './resourceManagement/storeRent/storeRented/storeRentedDetails'
import storeRentedVideoAndImgs from './resourceManagement/storeRent/storeRented/storeRentedVideoAndImgs'
import storeRentedAgentBroker from './resourceManagement/storeRent/storeRented/storeRentedAgentBroker'
import storeRentedRecord from './resourceManagement/storeRent/storeRented/storeRentedRecord'
import storeRentedDeal from './resourceManagement/storeRent/storeRented/storeRentedDeal'

//写字楼出售首页
import officeSell from './resourceManagement/officeSell/officeSell'
//新房管理写字楼在首详情
import officeSellingNavBar from './resourceManagement/officeSell/officeSelling/officeSellingNavBar'
import officeSellingDetails from './resourceManagement/officeSell/officeSelling/officeSellingDetails'
import officeSellingVideoAndImgs from './resourceManagement/officeSell/officeSelling/officeSellingVideoAndImgs'
import officeSellingAgentBroker from './resourceManagement/officeSell/officeSelling/officeSellingAgentBroker'
import officeSellingRecord from './resourceManagement/officeSell/officeSelling/officeSellingRecord'
import officeSellingDeal from './resourceManagement/officeSell/officeSelling/officeSellingDeal'
//新房管理写字楼已售详情
import officeSelledNavBar from './resourceManagement/officeSell/officeSelled/officeSelledNavBar'
import officeSelledDetails from './resourceManagement/officeSell/officeSelled/officeSelledDetails'
import officeSelledVideoAndImgs from './resourceManagement/officeSell/officeSelled/officeSelledVideoAndImgs'
import officeSelledAgentBroker from './resourceManagement/officeSell/officeSelled/officeSelledAgentBroker'
import officeSelledRecord from './resourceManagement/officeSell/officeSelled/officeSelledRecord'
import officeSelledDeal from './resourceManagement/officeSell/officeSelled/officeSelledDeal'
//写字楼出售首页
import officeRent from './resourceManagement/officeRent/officeRent'
import officeRentDetail from './resourceManagement/officeRent/officeRentDetail'




import serviceMatching from './earningSetting/serviceMatching'
import newCreateMatchProject from './earningSetting/newCreateMatchProject'
//权限设置
import jolesManagement from './accessManagement/jolesManagement'
//内容审核
import houseImgCheck from './contentCheck/houseImgCheck'
import houseImgCheckDetail from './contentCheck/houseImgCheckDetail'
import advisorRegister from './contentCheck/advisorRegister'
import advisorRegisterDetail from './contentCheck/advisorRegisterDetail'
import removeRelationApplication from './contentCheck/removeRelationApplication'
import dealDetailMaster from './contentCheck/dealDetailMaster'
import feedback from './contentCheck/feedback'
import brokerNameCertificate from './contentCheck/brokerNameCertificate'
import authenticationDetail from './contentCheck/authenticationDetail'
import applicationWithdrawal from './contentCheck/applicationWithdrawal'


import brokerUploadCommunity from './contentCheck/brokerUploadCommunity'
//合同管理
import contractAgreementModulesManage from './contractManagement/contractAgreementModulesManage'
//师徒设置
import promoteMaster from './mentoringSetting/promoteMaster'
import promotePrentice from './mentoringSetting/promotePrentice'
//培训
import trainContent from './train/trainContent'
import trainRichTest from './train/trainRichTest'
//消息
import systemMessage from './messageManagement/systemMessage'
import pushMessage from './messageManagement/pushMessage'
//企业架构
import personnelManage from './enterpriseFramework/personnelManage'
//设置
import modifyPassword from './setting/modifyPassword'
import apkManagement from './apkVersion/apkManagement'

export default [
  main,
  login,
  step,
  indexPage,
  ...newHousePro,
  secondNavBar,
  ...secondhandHouseSell,
  cityManagement,
	brokerIdIndex,
  brokerIdDetail,
	labelManagement,
  availabilityDetails,
	earningSetting,
  advisorIdIndex,
  advisorIdDetail,
  dealCenterIdIndex,
  dealCenterIdDetail,
  agentIdIndex,
  agentIdDetail,
  agentIdIndexNewAccount,
  zhangHuGuanLiBroker,
  zhangHuDetail,
  brokerDetailed,
  accountTutor,
  accountTutorDetail,
  dealCenterSettlement,
  agentSettlement,
  tutorDetailed,
  accountDealCenter,
  accountDealCenterDetail,
  dealCenterDetailIncome,
  zhangHuGuanLiAgent,
  accountAgentDetail,
  agentDetailIncome,
  positionMap,
  newAccount,
  residentialArea,
  createCell,
  photoManagement,
  watchHousingNumber,
  watchHousingNumberShop,
  watchHousingNumberOffice,
  loudongManagement,
  shopsManagement,
  shopsLoudongManagement,
  shopsCreateShangPu,
  shopsPosition,
  shopsPhotoManagement,
  officeBuilding,
  officeLoudongManagement,
  officePhotoManagement,
  officceCreateBuilding,

  eachSideEarningsMatchingIndex,
  brokerageMatching,


  //广告管理
  putManage,

  serviceMatching,
  newCreateMatchProject,


  //新房首页
  newHouseProIndex,
  projectDetailsBackStage,
  //房源管理项目下架
  houseResourceOffline,
  houseResourceOfflineDetail,
  secHouseShopOffceDetail,
  //新房管理二手房在售详情
  secHandSellingNavBar,
  secHandSellingDetails,
  secHandSellingVideoAndImgs,
  secHandSellingAgentBroker,
  secHandSellingRecord,
  secHandSellingDeal,
  //新房管理二手房已售详情
  secHandSelledNavBar,
  secHandSelledDetails,
  secHandSelledVideoAndImgs,
  secHandSelledAgentBroker,
  secHandSelledRecord,
  secHandSelledDeal,
  //二手房出租首页
  secondhandRentIndex,
  //二手房再租详情
  secHandRentingNavBar,
  secHandRentingDetails,
  secHandRentingVideoAndImgs,
  secHandRentingAgentBroker,
  secHandRentingRecord,
  secHandRentingDeal,
  //二手房已租详情
  secHandRentedNavBar,
  secHandRentedDetails,
  secHandRentedVideoAndImgs,
  secHandRentedAgentBroker,
  secHandRentedRecord,
  secHandRentedDeal,
  //商铺出售首页
  storeSell,
  //商铺在售详情
  storeSellingNavBar,
  storeSellingDetails,
  storeSellingVideoAndImgs,
  storeSellingAgentBroker,
  storeSellingRecord,
  storeSellingDeal,
  //商铺已售详情
  storeSelledNavBar,
  storeSelledDetails,
  storeSelledVideoAndImgs,
  storeSelledAgentBroker,
  storeSelledRecord,
  storeSelledDeal,
  //商铺出租首页
  storeRent,
  storeRentingNavBar,
  storeRentingDetails,
  storeRentingVideoAndImgs,
  storeRentingAgentBroker,
  storeRentingRecord,
  storeRentingDeal,
  storeRentedNavBar,
  storeRentedDetails,
  storeRentedVideoAndImgs,
  storeRentedAgentBroker,
  storeRentedRecord,
  storeRentedDeal,
  //写字楼首页
  officeSell,
  //在售详情,
  officeSellingNavBar,
  officeSellingDetails,
  officeSellingVideoAndImgs,
  officeSellingAgentBroker,
  officeSellingRecord,
  officeSellingDeal,
  officeSelledNavBar,
  officeSelledDetails,
  officeSelledVideoAndImgs,
  officeSelledAgentBroker,
  officeSelledRecord,
  officeSelledDeal,
  //写字楼出租
  officeRent,
  officeRentDetail,


  jolesManagement,
  houseImgCheck,
  houseImgCheckDetail,
  advisorRegister,
  advisorRegisterDetail,
  brokerUploadCommunity,
  contractAgreementModulesManage,
  promoteMaster,
  promotePrentice,
  trainContent,
  trainRichTest,
  systemMessage,
  pushMessage,
  personnelManage,
  modifyPassword,
  apkManagement,
  removeRelationApplication,
  dealDetailMaster,
  feedback,
  brokerNameCertificate,
  authenticationDetail,
  applicationWithdrawal,
  platformFund,
  platformFundDetail,
  platformSettlement,
  platformEarningBalanceDetail,
  expenditureDetail,
  platformEarningBalance,
  customerIndex,
]
