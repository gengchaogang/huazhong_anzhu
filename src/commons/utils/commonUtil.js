/** 一些方法 */
var commonUtil = {};


var lastClickTime = 0;
var clickStep = 800;
/**
防止重复点击
*/
commonUtil.isFirstClick = function () {
  let b = true;
  //change by duxianqiu 屏蔽单击判定 会导致后面的点击无效
  // let date = new Date();
  // let nowTime = date.getTime();
  // if ((nowTime - lastClickTime) < clickStep) {
  //   b = false;
  // }else {
  //   lastClickTime = nowTime;
  // }
  return b;
}

/** 封装行政区划数据 */
commonUtil.createEopData = function(eopOptions){
  let eopObj = {};
  let eopRootArray = [];
  let eopArray = [];
  eopOptions.map((item,index)=>{
    let tempItem = {};
    tempItem.value = item.code;
    tempItem.label = item.lable;
    eopObj[item.code] = tempItem;

    const pCode = item.pCode;
    if(pCode){
      if(eopObj[pCode]){
        if(!eopObj[pCode]["children"]){
            eopObj[pCode]["children"] = [];
        }
        eopObj[pCode]["children"].push(tempItem);
      }
    }else{
      eopRootArray.push(item.code);
    }
  });
  eopRootArray.map((item)=>{
    const tempObj = eopObj[item];
    if(tempObj){
      eopArray.push(tempObj);
    }
  });
  return eopArray;
}

/** 解析 标签数据 */
commonUtil.ansyslabelsData = function(labelsList){
  var labels = {};
  if (labelsList != null && labelsList.length > 0) {
      labelsList.map((item,index)=>{
          let _key = "";
          let _array = [];
          if (item['typeName']) {
              _key = item['typeName'];
          }
          if (item['nameAndValues']) {
              _array = item['nameAndValues'];
          }
          if (_key != null && _key.length > 0) {
              labels[_key] = _array;
          }
      });
  }
  return labels;
}

const getlabelsByTypeName=(labels, typeName)=>{
    var _array = [];
    if (labels != null && labels[typeName]) {
        _array = labels[typeName];
    }
    return _array;
}

export default commonUtil;
