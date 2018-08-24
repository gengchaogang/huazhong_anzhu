/** 通用API返回数据解析 */
var analysisUtil = {};

function analysisError(data) {
  var obj = {};
  obj.isSuccess = false;
  obj.msg = "返回数据为空";
  try {
    if (data != null && data['status'] == 'error') {
        obj.msg = data['message'];
        const message = data['message'];
        if (message && message['tip']) {
          obj.msg = message['tip'];
        }
    }
  } catch (e) {
    // console.log(e);
  }
  return obj;
}

/**
解析分页数据 ，注意：占用了key、indexXh 类型。
content               数据列表 array
first                 是否第一页
last                  是否最后一页
number                当前页码
numberOfElements      当前有多少条数据
size                  pageSize
totalElements         总共有多少条数据
totalPages            总共有多少页
*/
analysisUtil.analysisGetPageDataResponse = function (responseObj) {
  var obj = {};
  obj.isSuccess = false;
  obj.msg = "解析错误";

  if (responseObj['data']) {
    var data = responseObj['data'];
    if (data != null) {
      try {
        if (data['status'] == 'success') {
          if(data['data']) {
            obj = data['data'];
            if (obj['status'] && obj['error']) {
              obj.isSuccess = false;
              obj.msg = obj['message'];
            }else {
              obj.total = 0;
              if (obj['totalElements'] != undefined) {
                obj.total = obj['totalElements'];
              }
              if (obj['number'] != undefined) {
                var _number = obj['number'];
                obj.pageNo = _number;
                obj.current = _number+1;
              }
              obj.pageSize = 0;
              if(obj['size'] != undefined) {
                obj.pageSize = obj['size'];
              }
              obj.isSuccess = true;
              obj.msg = "加载成功";

              var content = obj.content;
              var resultData = [];
              if (content && content != null && content.length > 0) {
                content.map((item, index)=> {
                  item['key'] = "key_"+Math.random();
                  // item['indexXh'] = `${index+1}`;
                  let pageNo=parseInt(obj.pageNo);
                  let pageSize=parseInt(obj.pageSize);
                  let currentNo=pageNo*pageSize;
                  item['indexXh'] = `${currentNo+index+1}`;
                  resultData.push(item);
                });
              }
              obj.content = resultData;
            }
          }
        }else {
          return analysisError(data);
        }
      } catch (e) {
        // console.log(e);
      }
    }else {
      obj.msg = "返回数据为空";
    }
  }else if (responseObj['err']) {
      try {
        obj.isSuccess = false;
        const _response = responseObj.err.response;
        if (_response) {
          let _msg = "访问错误：" + _response['statusText'] + " " +_response['status'];
          obj.msg = _msg;
        }
      } catch (e) {
        // console.log(e)
      }
  }
  return obj;
}


/**
解析返回数据格式为：{"status":"", "data":{}}
*/
analysisUtil.analysisDataResponse = function (responseObj) {
  var obj = {};
  obj.isSuccess = false;
  obj.msg = "解析错误";
  if (responseObj['data']) {
    var data = responseObj['data'];
    if (data != null) {
      try {
        if (data['status'] == 'success') {
          if(data['data']) {
            obj = data['data'];
            const isArrayData = isArray(obj);
            if(isArrayData){
              const newObj = {};
              newObj.content = obj;
              newObj.isSuccess = true;
              newObj.msg = "加载成功";
              obj = newObj;

            }else{
              if (obj['status'] && obj['error']) {
                obj.isSuccess = false;
                obj.msg = obj['message'];
              }else {
                obj.isSuccess = true;
                obj.msg = "加载成功";
              }
            }

          }
        }else {
          return analysisError(data);
        }
      } catch (e) {
        // console.log(e);
      }
    }else {
      obj.msg = "返回数据为空";
    }
  }else if (responseObj['err']) {
      try {
        obj.isSuccess = false;
        const _response = responseObj.err.response;
        if (_response) {
          let _msg = "访问错误：" + _response['statusText'] + " " +_response['status'];
          obj.msg = _msg;
        }
      } catch (e) {
        // console.log(e)
      }
  }
  return obj;
}



function isArray(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
 }





export default analysisUtil;
