import {
  isNull,
  parseTrackJSON,
} from './currencyFunction'
//总价 转换
//生成总价 金额（数值）
export function renderTotalMoney(num){
  if(num !== null && num !== undefined && num !== ''){
    const newNum = Math.floor(Number(num));
    if(newNum % 10000 === 0){
      return newNum/10000
    }else{
      // const num1 = Math.floor(newNum/10000);
      // const num2 = Math.floor((newNum % 10000)/1000);
      // const num3 = Math.floor((newNum % 1000)/100);
      return Number(`${Math.floor(newNum/10000)}.${Math.floor((newNum % 10000)/1000)}${Math.floor((newNum % 1000)/100)}`)
    }
  }else{
    return 0
  }
}
//生成总价 金额（带单位）
export function renderTotalMoneyStr(num){
  const newNum = handleNumWithPointZero(num);
  if(newNum === '-'){
    return '-'
  }else{
    return `${renderTotalMoney(newNum)}万元`
  }
}
//元 转换
export function renderMoneyStr(num){
  const newNum = handleNumWithPointZero(num);
  if(newNum === '-'){
    return '-'
  }else{
    return `${isNull(newNum)}元`
  }
}
//单价 元/㎡
export function renderUnitPriceStr(num){
  const newNum = handleNumWithPointZero(num);
  if(newNum === '-'){
    return '-'
  }else{
    return `${isNull(newNum,'-')}元/㎡`
  }
}

//面积 ㎡
export function renderResoucesAreaStr(num){
  const newNum = handleNumWithPointZero(num);
  if(newNum === '-'){
    return '-'
  }else{
    return `${newNum}㎡`
  }
  // const numStr = `${isNull(num,'-')}`;
  // if(judgeStrEndWith(numStr,'.0')){
  //   return `${numStr.substring(0,numStr.length-2)}㎡`
  // }else{
  //   return `${numStr}㎡`
  // }
}
//租金
export function renderRentMeony(num,resourcesType){
  const newNum = handleNumWithPointZero(num);
  if(newNum === '-'){
    return '-'
  }else{
    if(!!resourcesType){
      if(resourcesType === '住宅'){
        return `${isNull(newNum,'-')}元/月`
      }
      else if(resourcesType === '商铺' || resourcesType === '写字楼'){
        return `${isNull(newNum,'-')}元/㎡/天`
      }
    }else{
      return `${isNull(newNum,'-')}元/月`
    }
  }
}
//生成租金  单位
export function renderRentMeonyUnit(resourcesType){
  if(!!resourcesType){
    if(resourcesType === '住宅'){
      return '元/月'
    }
    else if(resourcesType === '商铺' || resourcesType === '写字楼'){
      return '元/㎡/天'
    }
  }else{
    return '元/月'
  }
}
//JSON数组评成字符串
export function renderJSONArrayToStr(JSONArray){
  const arr = parseTrackJSON(JSONArray)
  if(arr){
    return arr.join('、')
  }else{
    return ''
  }

}
// export function splictStrZero() {
//
// }
//字符串以某段字符结尾
export function judgeStrEndWith(str,endStr){
  const d=str.length-endStr.length;
  return (d>=0 && str.lastIndexOf(endStr)==d)
}

//虚拟按钮执行下载
export function creatDownLoadBtn(fileName,content){
  let aLink = document.createElement('a');
  // let blob = new Blob([content]);
  // console.log('blob',blob);
  let evt = document.createEvent("HTMLEvents");
  evt.initEvent("onclick", false, false);//initEvent
  aLink.download = fileName;
  // aLink.href = URL.createObjectURL(blob);
  aLink.href = content;
  aLink.dispatchEvent(evt);
}
//向下取两位小数
export function floorTwoNumber(num){
  return Number(Number(num).toString().match(/^\d+(?:\.\d{0,2})?/))
}
//处理 尾数为.00 的数字
export function handleNumWithPointZero(num){
  const newNum = isNull(num,'-');
  if(judgeStrEndWith(newNum,'.00')){
    return `${newNum.substring(0,newNum.length-3)}`
  }
  else if(judgeStrEndWith(newNum,'.0')){
    return `${newNum.substring(0,newNum.length-2)}`
  }
  else{
    return `${newNum}`
  }
}
//**.**%转换为0.****
export function getNumByPersent(per){
  console.log('per',per)
  if(per === ''){
    return ''
  }else{
    // return ((Number(per)*100)/10000)
    return accDiv(per,100)
  }
}
//解决浮点数计算问题
//调用：accAdd(arg1,arg2)
//返回值：arg1加上arg2的精确结果
export function accAdd(arg1,arg2){
  var r1,r2,m;
  try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
  try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
  m=Math.pow(10,Math.max(r1,r2))
  return (arg1*m+arg2*m)/m
}
//调用：accSub(arg1,arg2)
//返回值：arg1减上arg2的精确结果
export function accSub(arg1,arg2){
    return accAdd(arg1,-arg2);
}
//调用：accMul(arg1,arg2)
//返回值：arg1乘以arg2的精确结果
export function accMul(arg1,arg2){
  var m=0,s1=arg1.toString(),s2=arg2.toString();
  try{m+=s1.split(".")[1].length}catch(e){}
  try{m+=s2.split(".")[1].length}catch(e){}
  return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
}
//调用：accDiv(arg1,arg2)
//返回值：arg1除以arg2的精确结果
export function accDiv(arg1,arg2){
  console.log('arg1',arg1)
    var t1=0,t2=0,r1,r2;
    try{t1=arg1.toString().split(".")[1].length}catch(e){}
    try{t2=arg2.toString().split(".")[1].length}catch(e){}
    r1=Number(arg1.toString().replace(".",""))
    r2=Number(arg2.toString().replace(".",""))
    return accMul((r1/r2),Math.pow(10,t2-t1));
    // with(Math){
    //     r1=Number(arg1.toString().replace(".",""))
    //     r2=Number(arg2.toString().replace(".",""))
    //     return (r1/r2)*pow(10,t2-t1);
    // }
}
