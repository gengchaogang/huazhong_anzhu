import baseApi from '../../../commons/service/baseApi';

function log(res){
  const {data, err} = res;
  if(err){
    console.error(err);
  }else {
    console.log(data);
  }
  return res;
}

export async function getGroupList(){
  return baseApi("/miss-anzhu-trading-center/group/findAllList");
}

export async function addGroup(params){
  return baseApi("/miss-anzhu-trading-center/group/add", params);
}

export async function updateGroup(params){
  return baseApi("/miss-anzhu-trading-center/group/update", params);
}

export async function deleteGroup(params){
  return baseApi("/miss-anzhu-trading-center/group/delete", params);
}


export async function getAuthorities(){
  return baseApi("/miss-anzhu-trading-center/authority/findAll");
  // return new Promise(res=>{
  //   setTimeout(()=>{
  //     var data = [];
  //     data.push({name: "交易管理",code: "T_C_JYGL", children:[
  //       {name: "新房交易",code: "T_C_XFJY", children:[
  //         {name: "录客户",code: "lkh"},
  //         {name: "录团购",code: "ltg"},
  //         {name: "录成交",code: "lcj"},
  //         {name: "申请退款",code: "sqtk"},
  //         {name: "报表导出",code: "bbdc"},
  //       ]},
  //       {name: "二手房交易",code: "esfjy", children:[
  //         {name: "报成交驳回",code: "bcjbh"},
  //         {name: "办理购房意向",code: "blgfyx"},
  //         {name: "办理购房首付",code: "blgfsf"},
  //         {name: "办理购房佣金",code: "blgfyj"},
  //         {name: "申请购房贷款",code: "sqgfdk"},
  //       ]},
  //       {name: "二手房出租",code: "esfcz", children:[
  //         {name: "报出租驳回",code: "bczbh"},
  //         {name: "办理租房意向",code: "blzfyx"},
  //         {name: "申请租房分期",code: "sqzffq"},
  //         {name: "办理租房佣金",code: "blzfyj"},
  //         {name: "办理成交",code: "blcj"},
  //         {name: "申请退款",code: "sqeszftk"},
  //       ]},
  //     ]});
  //     data.push({name: "财务管理",code: "cwgl", children:[
  //       {name: "新房电商审核",code: "xfdsgl", children:[
  //         {name: "新房成交审核",code: "xfcjsh"},
  //         {name: "新房退款审核",code: "xftksh"},
  //       ]},
  //       {name: "二手房出售审核",code: "esfcssh", children:[
  //         {name: "二手房成交审核",code: "esfcjsh"},
  //         {name: "二手房退款审核",code: "esftksh"},
  //       ]},
  //       {name: "交易中心收支管理",code: "jyzxszgl", children:[
  //         {name: "交易服务费收益",code: "jyfwfsy"},
  //         {name: "交易服务费支出",code: "jyfwfzc"},
  //       ]},
  //     ]});
  //     data.push({name: "企业管理",code: "qygl", children:[
  //       {name: "组织架构管理",code: "AUTHORITY_A_USER"},
  //       {name: "企业管理",code: "AUTHORITY_B_USER"},
  //     ]});
  //     res({data:{status:"success", data: data}});
  //   },1000);
  // });
}
