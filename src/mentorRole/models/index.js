import main from './main'
import indexEntrance from './indexPage/indexEntrance'
import indexPage from './indexPage'
import indexPageX from './indexPageX'
import accountSetting from './accountSetting'
//消息管理
import remindMsgManagement from './remindMsgManagement/remindMsgManagement'
import remindMsgInfo from './remindMsgManagement/remindMsgInfo'
//公司房源
import allHouseResourceSell from './allHouse/allHouseResourceSell'
import allHouseResourceDetail from './allHouse/allHouseResourceDetail'
//客户管理
import customerManage from './customerManage/customerManage'
import managePage from './customerManage/managePage'
import editPage from './customerManage/editPage'
//二手房出售
import secondHandHouseSell from './houseResourceManagement/secondHandHouseSell/secondHandHouseSell'
import createSecondHandSellResource from './houseResourceManagement/secondHandHouseSell/createSecondHandSellResource'
import houseResourceInfos from './houseResourceManagement/secondHandHouseSell/houseResourceInfos'
import houseImgs from './houseResourceManagement/secondHandHouseSell/houseImgs'
import ownerInfos from './houseResourceManagement/secondHandHouseSell/ownerInfos'
import assignAgent from './houseResourceManagement/secondHandHouseSell/assignAgent'
//二手房出租
import secondHandHouseRent from './houseResourceManagement/secondHandHouseRent/secondHandHouseRent'
import createSecondHandRentResource from './houseResourceManagement/secondHandHouseRent/createSecondHandRentResource'
import houseResourceInfosRent from './houseResourceManagement/secondHandHouseRent/houseResourceInfosRent'
import houseImgsRent from './houseResourceManagement/secondHandHouseRent/houseImgsRent'
import ownerInfosRent from './houseResourceManagement/secondHandHouseRent/ownerInfosRent'
import assignAgentRent from './houseResourceManagement/secondHandHouseRent/assignAgentRent'
//商铺出售
import shopsSell from './houseResourceManagement/shopsSell/shopsSell'
import createShopsSellResource from './houseResourceManagement/shopsSell/createShopsSellResource'
import shopsResourceInfos from './houseResourceManagement/shopsSell/shopsResourceInfos'
import shopsImgs from './houseResourceManagement/shopsSell/shopsImgs'
import shopsOwnerInfos from './houseResourceManagement/shopsSell/shopsOwnerInfos'
import assignAgentShopsSell from './houseResourceManagement/shopsSell/assignAgentShopsSell'
//商铺出租
import shopsRent from './houseResourceManagement/shopsRent/shopsRent'
import createShopsRentResource from './houseResourceManagement/shopsRent/createShopsRentResource'
import shopsResourceInfosRent from './houseResourceManagement/shopsRent/shopsResourceInfosRent'
import shopsImgsRent from './houseResourceManagement/shopsRent/shopsImgsRent'
import shopsOwnerInfosRent from './houseResourceManagement/shopsRent/shopsOwnerInfosRent'
import assignAgentShopsRent from './houseResourceManagement/shopsRent/assignAgentShopsRent'
//写字楼出售
import officeSell from './houseResourceManagement/officeSell/officeSell'
import createOfficeSellResource from './houseResourceManagement/officeSell/createOfficeSellResource'
import officeResourceInfos from './houseResourceManagement/officeSell/officeResourceInfos'
import officeImgs from './houseResourceManagement/officeSell/officeImgs'
import officeOwnerInfos from './houseResourceManagement/officeSell/officeOwnerInfos'
import assignAgentOffice from './houseResourceManagement/officeSell/assignAgentOffice'


//写字楼出租
import officeRent from './houseResourceManagement/officeRent/officeRent'
import createOfficeRentResource from './houseResourceManagement/officeRent/createOfficeRentResource'
import officeResourceInfosRent from './houseResourceManagement/officeRent/officeResourceInfosRent'
import officeImgsRent from './houseResourceManagement/officeRent/officeImgsRent'
import officeOwnerInfosRent from './houseResourceManagement/officeRent/officeOwnerInfosRent'
import assignAgentOfficeRent from './houseResourceManagement/officeRent/assignAgentOfficeRent'


import directAssignAgent from './houseResourceManagement/directAssignAgent'
import assignAgentModal from './houseResourceManagement/assignAgentModal'
//经纪人管理
import agentGroups from './agentManagement/agentGroups/agentGroups'
import detaileInfors from './agentManagement/agentGroups/detaileInfors'
import applicationAcceptance from './agentManagement/applicationAcceptance'
import inactiveAgent from './agentManagement/inactiveAgent'
import peoplePosition from './agentManagement/peoplePosition'
//企业管理
import businessInfos from './businessManagement/businessInfos'
//账户管理
import commissionRecord from './accountManagement/commissionRecord'
import commissionRecordDetails from './accountManagement/commissionRecordDetails'
import pwdManagement from './accountManagement/pwdManagement'
import bankCardManagement from './accountManagement/bankCardManagement'
//佣金设置
import commissionInstalled from './commissionSetting/commissionInstalled'
import commissionAdjustRecord from './commissionSetting/commissionAdjustRecord'
//数据统计
import basicStatistics from './dataStatistics/basicStatistics'
import businessStatistics from './dataStatistics/businessStatistics'
import dealStatistics from './dataStatistics/dealStatistics'
import standardHome from './dataStatistics/standardHome'
import standardManage from './dataStatistics/standardManage'
import standardCreate from './dataStatistics/standardCreate'
import dailyCount from './dataStatistics/dailyCount'
import dailyCountOne from './dataStatistics/dailyCountOne'
//登陆
import login from './logIn/logIn'
import mentorRegister from './logIn/mentorRegister'
import writePhone from './logIn/writePhone'
import perfectInformation from './logIn/perfectInformation'
//找回密码
import retrievePwd from './logIn/retrievePwd'
import getCodeByPhone from './logIn/getCodeByPhone'
import reSetPassWrod from './logIn/reSetPassWrod'


//二手房已售详情
import secHandSellingNavBar from './houseResourceManagement/secondHandHouseSell/details/secHandSellingNavBar'
import secHandSellingDetails from './houseResourceManagement/secondHandHouseSell/details/secHandSellingDetails'
import secHandSellingVideoAndImgs from './houseResourceManagement/secondHandHouseSell/details/secHandSellingVideoAndImgs'
import secHandSellingAgentBroker from './houseResourceManagement/secondHandHouseSell/details/secHandSellingAgentBroker'
import secHandSellingRecord from './houseResourceManagement/secondHandHouseSell/details/secHandSellingRecord'
import secHandSellingDeal from './houseResourceManagement/secondHandHouseSell/details/secHandSellingDeal'

//二手房出租详情
import secHandRentingNavBar from './houseResourceManagement/secondHandHouseRent/details/secHandRentingNavBar'
import secHandRentingDetails from './houseResourceManagement/secondHandHouseRent/details/secHandRentingDetails'
import secHandRentingVideoAndImgs from './houseResourceManagement/secondHandHouseRent/details/secHandRentingVideoAndImgs'
import secHandRentingAgentBroker from './houseResourceManagement/secondHandHouseRent/details/secHandRentingAgentBroker'
import secHandRentingRecord from './houseResourceManagement/secondHandHouseRent/details/secHandRentingRecord'
import secHandRentingDeal from './houseResourceManagement/secondHandHouseRent/details/secHandRentingDeal'
//写字楼出售详情
import officeSellingNavBar from './houseResourceManagement/officeSell/details/officeSellingNavBar'
import officeSellingDetails from './houseResourceManagement/officeSell/details/officeSellingDetails'
import officeSellingVideoAndImgs from './houseResourceManagement/officeSell/details/officeSellingVideoAndImgs'
import officeSellingAgentBroker from './houseResourceManagement/officeSell/details/officeSellingAgentBroker'
import officeSellingRecord from './houseResourceManagement/officeSell/details/officeSellingRecord'
import officeSellingDeal from './houseResourceManagement/officeSell/details/officeSellingDeal'

//商铺出售已售详情
import storeSellingAgentBroker from './houseResourceManagement/shopsSell/details/storeSellingAgentBroker'
import storeSellingDeal from './houseResourceManagement/shopsSell/details/storeSellingDeal'
import storeSellingDetails from './houseResourceManagement/shopsSell/details/storeSellingDetails'
import storeSellingNavBar from './houseResourceManagement/shopsSell/details/storeSellingNavBar'
import storeSellingRecord from './houseResourceManagement/shopsSell/details/storeSellingRecord'
import storeSellingVideoAndImgs from './houseResourceManagement/shopsSell/details/storeSellingVideoAndImgs'
//商铺出租已租详情
import storeRentingAgentBroker from './houseResourceManagement/shopsRent/details/storeRentingAgentBroker'
import storeRentingDeal from './houseResourceManagement/shopsRent/details/storeRentingDeal'
import storeRentingDetails from './houseResourceManagement/shopsRent/details/storeRentingDetails'
import storeRentingNavBar from './houseResourceManagement/shopsRent/details/storeRentingNavBar'
import storeRentingRecord from './houseResourceManagement/shopsRent/details/storeRentingRecord'
import storeRentingVideoAndImgs from './houseResourceManagement/shopsRent/details/storeRentingVideoAndImgs'
//写字楼出租
import officeRentDetail from './houseResourceManagement/officeRent/officeRentDetail'
import myNew from './agentMd/agentMdFile/myNew'
import addMd from './agentMd/agentMdFile/addMd'



export default [
  main,
  indexEntrance,
  indexPage,
  indexPageX,
  accountSetting,

  remindMsgManagement,
  remindMsgInfo,
  //公司房源
  allHouseResourceSell,
  allHouseResourceDetail,
  //客户管理
  customerManage,
  managePage,
  editPage,
  //二手房出售
  secondHandHouseSell,
  createSecondHandSellResource,
  houseResourceInfos,
  houseImgs,
  ownerInfos,
  assignAgent,
  //二手房出租
  secondHandHouseRent,
  createSecondHandRentResource,
  houseResourceInfosRent,
  houseImgsRent,
  ownerInfosRent,
  assignAgentRent,
  //商铺出售
  shopsSell,
  createShopsSellResource,
  shopsResourceInfos,
  shopsImgs,
  shopsOwnerInfos,
  assignAgentShopsSell,
  //商铺出租
  shopsRent,
  createShopsRentResource,
  shopsResourceInfosRent,
  shopsImgsRent,
  shopsOwnerInfosRent,
  assignAgentShopsRent,
  //写字楼出售
  officeSell,
  createOfficeSellResource,
  officeResourceInfos,
  officeImgs,
  officeOwnerInfos,
  assignAgentOffice,
  //写字楼出租
  officeRent,
  createOfficeRentResource,
  officeResourceInfosRent,
  officeImgsRent,
  officeOwnerInfosRent,
  assignAgentOfficeRent,

  assignAgentModal,
  directAssignAgent,
  //经纪人管理
  agentGroups,
  detaileInfors,
  applicationAcceptance,
  inactiveAgent,
  peoplePosition,
  //企业管理
  businessInfos,
  //账户管理
  commissionRecord,
  commissionRecordDetails,
  pwdManagement,
  bankCardManagement,
  //佣金设置
  commissionInstalled,
  commissionAdjustRecord,
  //数据统计
  basicStatistics,
  businessStatistics,
  dealStatistics,
  standardHome,//达标线
  standardManage,
  standardCreate,
  dailyCount,
  dailyCountOne,
  //登陆
  login,
  mentorRegister,
  writePhone,
  perfectInformation,
  retrievePwd,
  getCodeByPhone,
  reSetPassWrod,
  //二手房已售详情
  secHandSellingNavBar,
  secHandSellingDetails,
  secHandSellingVideoAndImgs,
  secHandSellingAgentBroker,
  secHandSellingRecord,
  secHandSellingDeal,
  //二手房已租详情
  secHandRentingNavBar,
  secHandRentingDetails,
  secHandRentingVideoAndImgs,
  secHandRentingAgentBroker,
  secHandRentingRecord,
  secHandRentingDeal,
  //写字楼出售详情
  officeSellingNavBar,
  officeSellingDetails,
  officeSellingVideoAndImgs,
  officeSellingAgentBroker,
  officeSellingRecord,
  officeSellingDeal,
  //商铺出售详情
  storeSellingAgentBroker,
  storeSellingDeal,
  storeSellingDetails,
  storeSellingNavBar,
  storeSellingRecord,
  storeSellingVideoAndImgs,
  //商铺出租详情
  storeRentingAgentBroker,
  storeRentingDeal,
  storeRentingDetails,
  storeRentingNavBar,
  storeRentingRecord,
  storeRentingVideoAndImgs,
  //写字楼出租详情
  officeRentDetail,
  myNew,
  addMd
]
