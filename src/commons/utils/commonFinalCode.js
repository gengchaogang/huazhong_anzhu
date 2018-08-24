/** 定义一些全局用到的变量 */
var commonFinalCode = {};

commonFinalCode.pageSize = 10;
commonFinalCode.maxPageSize = 10000;
commonFinalCode.showQuickJumper = false;

commonFinalCode.promptObj={
  visible:false,
  description:'',
  title:'',
  promptFor:'default',
  okText:'确定',
  type:'',
  todo:'',
};


//------------------------------apiName start------------------------------

commonFinalCode.addFileApiName = "/miss-anzhu-aliyun-file/putfile";               // 上传文件API名称
commonFinalCode.findGroupApiName = "/miss-anzhu-operation/labels/findGroup";      // 查询标签
commonFinalCode.findAllAreasApiName = "/miss-anzhu-operation/service-regions/findAllAreas"    // 查询区域信息

commonFinalCode.deleteSencondHouseApiName = "/miss-anzhu-secdhouse-resource/main/delHouse";   // 二手房 删除房源信息
commonFinalCode.getHouseBasseInfoApiName = "/miss-anzhu-secdhouse-resource/main/findOneHouseBaseInfo";    // 得到房源详细信息（用作编辑用）
commonFinalCode.getMyHousePicListApiName = "/miss-anzhu-secdhouse-resource/main/findMyHousePicList";      // 我的饿房源图片数据


//------------------------------apiName end--------------------------------

commonFinalCode.senondHouseResourcesType_zz = "住宅";
commonFinalCode.senondHouseResourcesType_sp = "商铺";
commonFinalCode.senondHouseResourcesType_xzl = "写字楼";

commonFinalCode.senondHouseSaleWay_cs = "出售";
commonFinalCode.senondHouseSaleWay_cz = "出租";


//------------------------------------提示信息 start --------
commonFinalCode.deleteConfirm_msg = "确认删除该项数据？";
commonFinalCode.deleteSuccess_msg = "删除成功！";


//------------------------------------提示信息 end ----------

export default commonFinalCode;
