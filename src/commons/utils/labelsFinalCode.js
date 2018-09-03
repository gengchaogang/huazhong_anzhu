import React from 'react';
import { Select, Radio, } from 'antd';
const Option = Select.Option;
const RadioGroup = Radio.Group;

/** 标签 */
var labelsFinalCode = {};
/** ------------------------通用标签 start---------------------------- */



/** ------------------------通用标签 end------------------------------ */

/** ------------------------新房 start-------------------------------- */



/** ------------------------新房 end---------------------------------- */


labelsFinalCode.labelHzsx = "合作速销分佣比例";           // 装修情况
labelsFinalCode.labelZxqk = "装修情况";           // 装修情况
labelsFinalCode.labelFwcx = "房源朝向";           // 房源朝向
labelsFinalCode.labelHxjg = "户型结构";           // 户型结构
labelsFinalCode.labelJzlx = "建筑类型";           // 建筑类型
labelsFinalCode.labelGnfs = "供暖方式";           // 供暖方式
labelsFinalCode.labelDt = "电梯";           // 电梯
labelsFinalCode.labelJznd = "建筑年代";           // 建筑年代
labelsFinalCode.labelZzcszj = "住宅出售总价";           // 住宅出售总价
labelsFinalCode.labelZzmj = "住宅面积";           // 住宅面积
labelsFinalCode.labelZzzj = "住宅租金";           // 住宅租金


/** ------------------------二手房 start------------------------------ */
labelsFinalCode.labelSecondHouseFyts = "二手房出售特色";
labelsFinalCode.labelSecondHouseFyhx = "住宅户型";
labelsFinalCode.labelSecondHouseFyjs = "住宅居室";
labelsFinalCode.labelSecondHouseFyfjpz = "二手房房间配置";

labelsFinalCode.labelSecondHouseZzczts = "二手房出租特色";
labelsFinalCode.labelZzzpfs = "二手房租赁支付方式";

//--------------------------商铺标签 start
labelsFinalCode.labelShopsSpte = "商铺出售特色";
labelsFinalCode.labelShopsSplx = "商铺类型";
labelsFinalCode.labelShopsPmlx = "铺面类型";
labelsFinalCode.labelShopsSpkjyfw = "经营类目";
labelsFinalCode.labelShopsCzts = "商铺出租特色";
labelsFinalCode.labelShops_czzjdw = "出租租金单位";              // 元/月、元/㎡/月
labelsFinalCode.labelShops_spmj = "商铺面积";              // 商铺面积
labelsFinalCode.labelShops_spzj = "商铺租金";              // 商铺租金

//--------------------------商铺标签 end

//--------------------------写字楼标签 start
labelsFinalCode.labelHouseOffice_xzllx = "写字楼类型";
labelsFinalCode.labelHouseOffice_xzljb = "写字楼级别";
labelsFinalCode.labelXzlcsts = "写字楼出售特色";
labelsFinalCode.labelXzlczts = "写字楼出租特色";
labelsFinalCode.labelHouse_wylx = "物业类型";
labelsFinalCode.labelHouse_xzlmj = "写字楼面积";
labelsFinalCode.labelHouse_xzlcszj = "写字楼出售总价";
labelsFinalCode.labelHouse_xzlzj = "写字楼租金";
labelsFinalCode.labelHouse_xzlqzfkfs = "求租付款方式";


//--------------------------写字楼标签 end
// 银行
labelsFinalCode.labelHouse_yh = "银行";

/** ------------------------二手房 end-------------------------------- */

/** 创建下拉框选择项  Option */
labelsFinalCode.getSelectOptionsByLabelName = function (labels, typeName) {
  if (labels != null && labels[typeName]) {
    const _array = labels[typeName];
    return _array.map((item, index) => {
      return (
        <Option key={index} value={item.name}>{item.name}</Option>
      )
    })
  }
}
labelsFinalCode.getSelectOptionsByLabelNameReuturn = function (labels, typeName) {
  if (labels != null && labels[typeName]) {
    const _array = labels[typeName];
    return _array.map((item, index) => {
      return (
        <Option key={index} value={item.value}>{item.name}</Option>
      )
    })
  }
}

/** CheckableTags  选择项 */
labelsFinalCode.getlabelsByTypeName = function (labels, typeName) {
  var _array = [];
  if (labels != null && labels[typeName]) {
    _array = labels[typeName];
  }
  return _array;
}


/** 单选 Radio*/
labelsFinalCode.getSelectRadioByLabelName = function (labels, typeName) {
  if (labels != null && labels[typeName]) {
    const _array = labels[typeName];
    return _array.map((item, index) => {
      return (
        <Radio key={index} value={item.name}>{item.name}</Radio>
      )
    })
  }
}


export default labelsFinalCode;
