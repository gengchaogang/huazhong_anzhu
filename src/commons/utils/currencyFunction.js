import{
  renderTotalMoneyStr,
  renderUnitPriceStr,
  renderMoneyStr,
  renderResoucesAreaStr,
  renderRentMeony,
  handleNumWithPointZero,
  floorTwoNumber,
  accMul,
} from './publicFunction'
//////////////////组装树型结构函数  扁平化Map
export function treeMenuMap(a){
    this.map=new Map();
    this.tree=a||[];
    this.groups={};
};
treeMenuMap.prototype={
  init:function(parentKey){
      this.group();
      const result={
        treeArr:this.getDom(this.groups[parentKey]),
        treeMap:this.map
      }
      return result;
  },
  group:function(){
      for(var i=0;i<this.tree.length;i++){
          if(this.groups[this.tree[i].parentKey]){
              this.groups[this.tree[i].parentKey].push(this.tree[i]);
          }else{
              this.groups[this.tree[i].parentKey]=[];
              this.groups[this.tree[i].parentKey].push(this.tree[i]);
          }
      }
  },
  getDom:function(a){
      if(!a){return []}
      var html=[];
      for(var i=0;i<a.length;i++){
          const item=Object.assign({},a[i],{children:this.getDom(this.groups[a[i].key])})
          html.push(item);
          this.map.set(a[i].key,item)
      };
      return html;
  }
};
//title排序函数
export function sortTitleFun(mapArr,trackArr){
  const trackMap = new Map();
  trackArr.map(item=>{
    trackMap.set(item.type,item)
  })
  const newArr = mapArr.map(item=>({
    ...trackMap.get(item)
  }))
  return newArr
}
//依据track数据生成详情JSONData
//新房
export function creatTrackJSON(responseData){
  const {trackDetail}=responseData;
  if(!!trackDetail){
    let trackData={};
    trackDetail.map(item=>{
      const detailType=judgeResponse(item.detailType,'');
      if(detailType==='意向项目'){
        trackData.projectName=judgeResponse(JSON.parse(item.detailContent).name,'');
      }
      else if(detailType==='客户信息'){
        const customer=JSON.parse(item.detailContent);
        trackData.customerInfo=[
          {
            label:'姓名',
            value:customer.name,
          },{
            label:'性别',
            value:customer.gender,
          },{
            label:'手机号',
            value:customer.phone,
          },{
            label:'身份证号',
            value:customer.idNumber,
          }
        ]
      }
      else if(detailType==='意向房源'){
        let house=null;
        try {
          house=JSON.parse(item.detailContent);
        } catch (e) {
          house=null;
        }
        if(!!house){
          trackData.houseInfo={
            houseInfo:{
              id:house.id,
              area:house.area,
              buildingNumber:house.buildingNumber,
              unit:house.unit,
              roomNumber:house.roomNumber,
              houseRoom:house.houseRoom,
              livingRoom:house.livingRoom,
              cookRoom:house.cookRoom,
              bathRoom:house.bathRoom,
              floorArea:house.floorArea,
              imgUrl:house.housePic,
              price:house.price,
              totalPrice:house.totalPrice,
            }
          }
        }else{
          trackData.houseInfo=null
        }
      }
      else if(detailType==='报备经纪人'){
        if(item.detailContent==null){
          trackData.brokerInfo=null;
        }else{
          const broker=JSON.parse(item.detailContent);
          trackData.brokerInfo={
            data:[
              {
                label:'姓名',
                value:broker.name,
              },{
                label:'性别',
                value:broker.gender,
              },{
                label:'联系电话',
                value:broker.phone,
              }
            ],
            picUrl:broker.logo,
          }
        }
      }
      else if(detailType==='看房记录'){
        const visitRecord=JSON.parse(item.detailContent);
        trackData.visitRecord=visitRecord.map(record=>({
          label:record.date,
          value:record.content,
        }))
      }
      else if(detailType==='团购意向房源'){
        const house=JSON.parse(item.detailContent);
        // const currentDate=new Date(responseData.currentDate);
        // const holdToDate=new Date(house.holdToDate);
        // console.log('currentDate',currentDate);
        // console.log('holdToDate',holdToDate);
        // const restTime=holdToDate-currentDate;
        // console.log('restTime',restTime);
        // const restDays=restTime/(1000*60*60*24);
        //剩余毫秒数
        const restTime=new Date(house.holdToDate)-new Date(responseData.currentDate);
        //剩余天数（向下取整）
        const restDays=Math.floor(restTime/(1000*60*60*24));
        // console.log('restDays',restDays);
        //余 毫秒数
        const otherTime=restTime-(restDays*(1000*60*60*24));
        // console.log('otherTime',otherTime);
        //剩余小时数（向下取整）
        const restHours=Math.floor(otherTime/(1000*60*60));
        // console.log('restHours',restHours);
        trackData.groupBuyHouseInfo={
          houseInfo:{
            id:house.id,
            area:house.area,
            buildingNumber:house.buildingNumber,
            unit:house.unit,
            houseTypeName:house.houseTypeName,
            roomNumber:house.roomNumber,
            houseRoom:house.houseRoom,
            livingRoom:house.livingRoom,
            cookRoom:house.cookRoom,
            bathRoom:house.bathRoom,
            floorArea:house.floorArea,
            imgUrl:house.housePic,
            price:house.price,
            totalPrice:house.totalPrice,
            restTime:`${restDays}天${restHours}小时`,
          }
        }
      }
      else if(detailType==='已购电商优惠'){
        const buyDiscount=JSON.parse(item.detailContent);
        trackData.groupBuyDiscountInfo={
          key:item.id,
          pic:buyDiscount.projectFavorableName,
          details:buyDiscount.favorableSuitableType,
          number:buyDiscount.payOrderNumber,
          payAway:buyDiscount.payType,
          paySerialNumber:buyDiscount.paySerialNumber,
          payCustomer:buyDiscount.customerName,
          customerPhone:buyDiscount.customerPhone,
          payTime:buyDiscount.payFinishTime,
          payCash:buyDiscount.groupbuyMoney,
          payStatus:buyDiscount.status,
        }
      }
      else if(detailType==='意向合同'){
        const agreementObj=JSON.parse(item.detailContent);
        if(!!agreementObj.agreementPics){
          trackData.agreementInfo=JSON.parse(agreementObj.agreementPics).map(item=>({
            src:item,
            id:item,
            title:'',
          }))
        }else{
          trackData.agreementInfo=[];
        }
      }
      else if(detailType==='成交房源'){
        const house=JSON.parse(item.detailContent);
        trackData.commitHouseInfo={
          houseInfo:{
            id:house.id,
            area:house.area,
            buildingNumber:house.buildingNumber,
            unit:house.unit,
            roomNumber:house.roomNumber,
            houseRoom:house.houseRoom,
            livingRoom:house.livingRoom,
            cookRoom:house.cookRoom,
            bathRoom:house.bathRoom,
            floorArea:house.floorArea,
            imgUrl:house.housePic,
            price:house.price,
            totalPrice:house.totalPrice,
          }
        }
      }
      else if(detailType==='成交价格'){
        const commitAmount=JSON.parse(item.detailContent);
        trackData.commitAmount=[
          {
            label:'实际成交单价',
            value:isNull(commitAmount.unitPrice,''),
          },{
            label:'实际成交总价',
            value:isNull(commitAmount.totalPrice,''),
          },{
            label:'支付方式',
            value:isNull(commitAmount.payType,''),
          }
        ]
      }
      else if(detailType==='成交经纪人'){
        if(item.detailContent==null){
          trackData.commitBrokerInfo=null;
        }else{
          const broker=JSON.parse(item.detailContent);
          trackData.commitBrokerInfo={
            data:[
              {
                label:'姓名',
                value:broker.name,
              },{
                label:'性别',
                value:broker.gender,
              },{
                label:'联系电话',
                value:broker.phone,
              }
            ],
            picUrl:broker.logo,
          }
        }
      }
      else if(detailType==='成交佣金'){
        const commitAmount=JSON.parse(item.detailContent);
        trackData.commissionAmount=[
          {
            label:'团购佣金总额',
            value:isNull(commitAmount['团购佣金总额'],''),
          },{
            label:'平台抽佣',
            value:isNull(commitAmount['平台抽佣'],''),
          },{
            label:'实际佣金金额',
            value:isNull(commitAmount['实际佣金金额'],''),
          }
        ]
      }
      else if(detailType==='成交合同或协议'){
        const agreementObj=JSON.parse(item.detailContent);
        if(!!agreementObj){
          trackData.commitAgreement=agreementObj.map(item=>({
            src:item,
            id:item,
            title:'',
          }))
        }else{
          trackData.commitAgreement=[];
        }
      }
      else if(detailType==='成交审核'){
        const commitRecord=JSON.parse(item.detailContent);
        trackData.commitRecord=commitRecord.map(record=>{
          // console.log('record',record);

          if(checkStringIsJSON(record.content)){
            console.log('record',record);
            const commissionInfo=JSON.parse(record.content);
            console.log('commissionInfo',commissionInfo);
            //在这里处理 佣金分配信息
            return({
              label:record.date,
              value:record.content,
            })
          }else{
            return({
              label:record.date,
              value:record.content,
            })
          }
        })
      }
    });
    return trackData;
  }else{
    return {}
  }
}
//二手房出售
export function creatSeconHouseSellTrackJSON(trackDetail,transCode){
  if(!!trackDetail){
    let trackData={};
    trackDetail.map(item=>{
      const detailType=isNull(item.detailType,'');
      if(detailType==='报成交经纪人'){
        if(item.detailContent==null){
          trackData.brokerInfo=null;
        }else{
          const broker=JSON.parse(item.detailContent);
          trackData.brokerInfo={
            data:[
              {
                label:'姓名',
                value:isNull(broker.name,''),
              },{
                label:'性别',
                value:isNull(broker.sex,''),
              },{
                label:'联系电话',
                value:isNull(broker.phone,''),
              }
            ],
            picUrl:isNull(broker.img,''),
          }
        }
      }
      else if(detailType==='报成交客户'){
        if(item.detailContent==null){
          trackData.customerInfo=null;
        }else{
          const customer=JSON.parse(item.detailContent);
          trackData.customerInfo=[
            {
              label:'姓名',
              value:isNull(customer.name,''),
            },{
              label:'性别',
              value:isNull(customer.sex,''),
            },{
              label:'手机号',
              value:isNull(customer.phone,''),
            },{
              label:'身份证号',
              value:isNull(customer.idNumber,''),
            }
          ]
        }
      }
      else if(detailType==='客户所属经纪人'){
        if(item.detailContent==null){
          trackData.customerBrokerInfo=null;
        }else{
          const broker=JSON.parse(item.detailContent);
          trackData.customerBrokerInfo={
            data:[
              {
                label:'姓名',
                value:isNull(broker.name,''),
              },{
                label:'性别',
                value:isNull(broker.sex,''),
              },{
                label:'联系电话',
                value:isNull(broker.phone,''),
              }
            ],
            id:isNull(broker.id,null),
            picUrl:isNull(broker.img,''),
          }
        }
      }
      else if(detailType==='合作成交佣金分配比例'){
        if(item.detailContent==null){
          trackData.dealCommissionProportion=null;
        }else{
          const dealCommissionProportion=JSON.parse(item.detailContent);
          trackData.dealCommissionProportion=[
            {
              label:'买方经纪人',
              value:isNull(dealCommissionProportion.customerBrokerRate,'--'),
            },{
              label:'卖方经纪人',
              value:isNull(dealCommissionProportion.brokerRate,'--'),
            }
          ]
        }
      }
      else if(detailType==='意向房源'){
        const house=JSON.parse(item.detailContent);
        const houseBasic=JSON.parse(house.resourcesInfo);
        trackData.houseInfo={
          houseInfo:{
            id:isNull(house.resourcesId,''),
            key:`key_${isNull(house.resourcesId,'')}`,
            village:isNull(house.communityName,''),
            propertyType:isNull(houseBasic.resourcesType,''),
            info:isNull(houseBasic.default,''),
            brokerId:isNull(house.brokerId,''),
            resourcesId:isNull(house.resourcesId,''),
            area:`${getJSONValue(isNull(house.resourcesInfo,''),'floorArea')}㎡`,
            price:`${getJSONValue(isNull(house.resourcesInfo,''),'uintPirce')}元`,
            totalPrice:`${isNull(house.totalPrice,'-')}元`,
            loan:isNull(houseBasic.supportMortgage,'不支持')==='不支持'?false:true,
            transCode:isNull(transCode,''),
          }
        }
      }
      else if(detailType==='房源委托信息'){
        if(!!item.detailContent){
          let agreementObj=null;
          try {
            agreementObj=JSON.parse(item.detailContent);
          } catch (e) {
            agreementObj=null;
          }
          if(!!agreementObj){
            trackData.houseEntrustAgreementPics=agreementObj.map(item=>({
              src:isNull(item,''),
              id:isNull(item,''),
              title:'',
            }))
          }
        }else{
          trackData.houseEntrustAgreementPics=null;
        }
      }
      else if(detailType==='房源报成交记录'){
        let detailContent=[];
        try{
          detailContent=JSON.parse(item.detailContent);
        }catch(err){

        }
        // console.log('detailContent',detailContent);
        trackData.reportRecord=[];
        detailContent.map(record=>{
          let detailContent;
          try{
            detailContent=JSON.parse(record.content);
          }catch(err){
            detailContent=null;
          }
          if(!!detailContent){
            if(!!detailContent.detailContentType && detailContent.detailContentType==='TimeLine'){
              trackData.reportRecord.push({
                label:isNull(record.date,''),
                value:isNull(detailContent.desc,''),
              })
            }
          }else{
            trackData.reportRecord.push({
              label:isNull(record.date,''),
              value:'——'
            })
          }
        })
      }
      else if(detailType==='已支付意向金'){
        let detailContent=null;
        try{
          detailContent=JSON.parse(item.detailContent);
        }catch(err){
          trackData.intentsInfo=null;
        }
        if(!!detailContent){
          trackData.intentsInfo={
            id:isNull(detailContent.orderNumber,''),
            payWay:isNull(detailContent.paymentMethod,'-'),
            paySerialNumber:isNull(detailContent.serialNumber,'-'),
            payTime:isNull(detailContent.paymentDateTime,'-'),
            customer:isNull(detailContent.customerName,'-'),
            phoneNumber:isNull(detailContent.customerPhone,'-'),
            price:`${isNull(detailContent.unitPrice,'-')}元`,
            totalPrice:`${isNull(detailContent.totalPrice,'-')}元`,
            intentsPrice:`${isNull(detailContent.amount,'-')}元`,
            payStatus:isNull(detailContent.paymentStatus,'-'),
          }
        }
      }
      else if(detailType==='意向合同或意向收据'){
        if(!!item.detailContent){
          let agreementObj=[];
          try {
            agreementObj=JSON.parse(item.detailContent);
          } catch (e) {
          }
          trackData.intentsAgreements=agreementObj.map((item,index)=>{
            if(!!item){
              return ({
                src:isNull(item,''),
                id:isNull(item,`key_${index}`),
                title:'',
              })
            }
          })
        }else{
          trackData.intentsAgreements=[];
        }
      }
      else if(detailType === '意向金退款办理'){
        if(!!item.detailContent){
          trackData.intentionRefundInfos=creatSHTimeLineData(item.detailContent,'出售意向金退款办理');
        }else{
          trackData.intentionRefundInfos=null;
        }
      }
      else if(detailType==='已支付首付款'){
        let detailContent=null;
        try{
          detailContent=JSON.parse(item.detailContent);
        }catch(err){
          trackData.downPaymentInfo=null;
        }
        if(!!detailContent){
          trackData.downPaymentInfo={
            id:isNull(detailContent.orderNumber,''),
            payWay:isNull(detailContent.paymentMethod,''),
            paySerialNumber:isNull(detailContent.serialNumber,''),
            payTime:isNull(detailContent.paymentDateTime,''),
            dealTotalPrice:`${isNull(detailContent.totalPrice,'')}元`,
            customer:isNull(detailContent.customerName,''),
            phoneNumber:isNull(detailContent.customerPhone,''),
            proportion:isNullRate(detailContent.firstpaymentRatio,''),
            intentsDeductible:`${isNull(detailContent.deductedIntention,'-')}元`,
            payAmount:`${isNull(detailContent.amount,'')}元`,
            payStatus:isNull(detailContent.paymentStatus,''),
          }
        }
      }
      else if(detailType==='请上传首付款协议/合同'){
        if(!!item.detailContent){
          let agreementObj=[];
          try {
            agreementObj=JSON.parse(item.detailContent);
          } catch (e) {
          }
          trackData.downPaymentAgreements=agreementObj.map((item,index)=>{
            if(!!item){
              return ({
                src:isNull(item,''),
                id:isNull(item,`key_${index}`),
                title:'',
              })
            }
          })
        }else{
          trackData.downPaymentAgreements=[];
        }
      }
      else if(detailType === '首付款退款业务'){
        if(!!item.detailContent){
          trackData.downPaymentRefundInfos=creatSHTimeLineData(item.detailContent,'首付款退款办理');
        }else{
          trackData.intentionRefundInfos=null;
        }
      }
      else if(detailType==='佣金支付'){
        let detailContent=null;
        try{
          detailContent=JSON.parse(item.detailContent);
        }catch(err){
          trackData.commissionInfo=null;
        }
        if(!!detailContent){
          trackData.commissionInfo={
            orderNumber:isNull(detailContent.orderNumber,''),
            payWay:isNull(detailContent.paymentMethod,''),
            paySerialNumber:isNull(detailContent.serialNumber,''),
            payTime:isNull(detailContent.paymentDateTime,''),
            dealTotalPrice:`${isNull(detailContent.totalPrice,'-')}元`,
            dealUnitPrice:`${isNull(detailContent.unitPrice,'-')}元`,
            undertaker:isNull(detailContent.undertaker,''),
            serviceCharge:`${isNull(detailContent.serviceCharge,'-')}元`,
            proportion:isNullRate(detailContent.commissionRate,'-'),
            payAmount:`${isNull(detailContent.amount,'-')}元`,
            payStatus:isNull(detailContent.paymentStatus,''),

          }
        }
      }
      else if(detailType==='买卖居间协议/佣金协议'){
        if(!!item.detailContent){
          let agreementObj=[];
          try {
            agreementObj=JSON.parse(item.detailContent);
          } catch (e) {
          }
          trackData.commissionAgreements=agreementObj.map((item,index)=>{
            if(!!item){
              return ({
                src:isNull(item,''),
                id:isNull(item,`key_${index}`),
                title:'',
              })
            }
          })
        }else{
          trackData.commissionAgreements=[];
        }
      }
      else if(detailType === '佣金退款协议办理'){
        if(!!item.detailContent){
          trackData.commissionRefundInfos=creatSHTimeLineData(item.detailContent,'佣金退款协议办理');
        }else{
          trackData.commissionRefundInfos=null;
        }
      }
      else if(detailType==='房屋过户信息'){
        if(!!item.detailContent){
          trackData.transferInfo=creatSHTimeLineData(item.detailContent,'过户信息');
        }else{
          trackData.transferInfo=null;
        }
      }
      else if(detailType==='房源贷款信息'){
        if(!!item.detailContent){
          trackData.loanInfo=creatSHTimeLineData(item.detailContent);
        }else{
          trackData.loanInfo=null;
        }
      }
      else if(detailType==='二手房解押办理'){
        if(!!item.detailContent){
          trackData.relieveLoadInfo=creatSHTimeLineData(item.detailContent,'出售解押办理');
        }else{
          trackData.relieveLoadInfo=null;
        }
      }
      else if(detailType==='成交资金释放账户'){
        if(!!item.detailContent){
          let commitReleaseFund=null;//成交释放信息
          let releaseInfos=null;//释放详细信息
          try{
            commitReleaseFund=JSON.parse(item.detailContent);
            releaseInfos=JSON.parse(commitReleaseFund.releaseInfos);
            console.log('releaseInfos',releaseInfos);
          }catch(e){
            trackData.commitReleaseFundInfo=null;
            releaseInfos=null;
          }
          if(!!commitReleaseFund){
            let picList=null;
            try{
              picList=JSON.parse(commitReleaseFund.images).map((item,index)=>{
                if(!!item){
                  return ({
                    src:isNull(item,''),
                    id:isNull(item,`key_${index}`),
                    title:'',
                  })
                }
              });
            }catch(e){
              picList=null;
            }
            const commitReleaseFundInfo={//返回的主体数据
              formData:[],
              picList:picList,
              ownerInfo:null,
            }
            let showOwnerInfo=false;//是否显示业主信息
            if(!!releaseInfos){
              releaseInfos.map(releaseInfoItem=>{
                commitReleaseFundInfo.formData.push({
                  label:'解押类型',
                  value:isNull(releaseInfoItem.releaseType,'-'),
                })
                commitReleaseFundInfo.formData.push({
                  label:'解押金额',
                  value:`${isNull(releaseInfoItem.releaseAmount,'0')}元`,
                })
                commitReleaseFundInfo.formData.push({
                  label:'收款方',
                  value:isNull(releaseInfoItem.releaseOwner,false)?'业主':'购房者',
                })
              })
            }
            if(showOwnerInfo){
              commitReleaseFundInfo.ownerInfo=[
                {
                  label:'业主姓名',
                  value:isNull(commitReleaseFund.ownerName,'-'),
                },{
                  label:'开户银行',
                  value:isNull(commitReleaseFund.ownerBank,'-'),
                },{
                  label:'开户支行',
                  value:isNull(commitReleaseFund.ownerBankSubbranch,'-'),
                },{
                  label:'开户银行卡号',
                  value:isNull(commitReleaseFund.ownerBankCard,'-'),
                },{
                  label:'业主联系电话',
                  value:isNull(commitReleaseFund.ownerPhone,'-'),
                }
              ]
            }
            // const commitReleaseFundInfo={
            //   formData:[
            //     {
            //       label:'业主姓名',
            //       value:isNull(commitReleaseFund.ownerName,'-'),
            //     },{
            //       label:'开户银行',
            //       value:isNull(commitReleaseFund.ownerBank,'-'),
            //     },{
            //       label:'开户支行',
            //       value:isNull(commitReleaseFund.ownerBankSubbranch,'-'),
            //     },{
            //       label:'开户银行卡号',
            //       value:isNull(commitReleaseFund.ownerBankCard,'-'),
            //     },{
            //       label:'业主联系电话',
            //       value:isNull(commitReleaseFund.ownerPhone,'-'),
            //     }
            //   ],
            //   picList:picList,
            // }
            trackData.commitReleaseFundInfo=commitReleaseFundInfo;
          }
        }else{
          trackData.commitReleaseFundInfo=null;
        }
      }
      else if(detailType==='成交分佣设置'){
        if(!!item.detailContent){
          let commitCommission=null;
          try{
            commitCommission=JSON.parse(item.detailContent);
          }catch(e){
            trackData.commitCommissionInfo=null;
          }
          if(!!commitCommission){
            console.log('commitCommission',commitCommission);
            let surplusAmount=null;
            try{
              surplusAmount=Number(commitCommission.commissionAmount)*(1-Number(commitCommission.platformCommissionRate));
            }catch(e){
              surplusAmount=null;
            }
            const formData=[
              {
                label:'成交佣金总额',
                value:`${isNull(commitCommission.commissionAmount,'-')/100}元`,
              },{
                label:'平台抽佣',
                value:`${isNull(Number(commitCommission.platformCommissionRate)*100,'-')}%`,
              },{
                label:'交易服务费',
                value:`${isNull(commitCommission.serviceCharge,'-')/100}元`,
              },{
                label:'剩余佣金总额',
                value:`${isNull(surplusAmount,'-')/100}元`,
              },{
                label:'成交方式',
                value:isNull(commitCommission.transactionMode,'-'),
              },{
                label:'房源经纪人',
                value:`${isNull(Number(commitCommission.brokerCommissionRate)*100,'-')}% ${isNull(commitCommission.brokerCommissionAmount/100,'-')}元`,
              },{
                label:'客户经纪人',
                value:`${isNull(Number(commitCommission.customerBrokerCommissionRate)*100,'-')}% ${isNull(commitCommission.customerBrokerCommissionAmount/100,'-')}元`,
              }
            ]
            trackData.commitCommissionInfo=formData;
          }
        }else{
          trackData.commitCommissionInfo=null;
        }
      }
      else if(detailType==='房屋成交信息'){
        if(!!item.detailContent){
          trackData.commitInfo=creatSHTimeLineData(item.detailContent,'二手房出售成交执行分佣');
        }else{
          trackData.commitInfo=null;
        }
      }
    });
    console.log('trackData',trackData);
    return trackData;
  }else{
    return {}
  }
}

//二手房出租
export function creatSeconHouseRentTrackJSON(trackDetail){
  if(!!trackDetail){
    let trackData={};
    trackDetail.map(item=>{
      const detailType=isNull(item.detailType,'');
      if(detailType==='报出租经纪人'){
        if(item.detailContent==null){
          trackData.brokerInfo=null;
        }else{
          const broker=JSON.parse(item.detailContent);
          trackData.brokerInfo={
            data:[
              {
                label:'姓名',
                value:isNull(broker.name,''),
              },{
                label:'性别',
                value:isNull(broker.sex,''),
              },{
                label:'联系电话',
                value:isNull(broker.phone,''),
              }
            ],
            picUrl:isNull(broker.img,''),
          }
        }
      }
      else if(detailType==='租户'){
        if(item.detailContent==null){
          trackData.customerInfo=null;
        }else{
          const customer=JSON.parse(item.detailContent);
          trackData.customerInfo=[
            {
              label:'姓名',
              value:isNull(customer.name,''),
            },{
              label:'性别',
              value:isNull(customer.sex,''),
            },{
              label:'手机号',
              value:isNull(customer.phone,''),
            },{
              label:'身份证号',
              value:isNull(customer.idNumber,''),
            }
          ]
        }
      }
      else if(detailType==='租户所属经纪人'){
        if(item.detailContent==null){
          trackData.customerBrokerInfo=null;
        }else{
          const broker=JSON.parse(item.detailContent);
          trackData.customerBrokerInfo={
            data:[
              {
                label:'姓名',
                value:isNull(broker.name,''),
              },{
                label:'性别',
                value:isNull(broker.sex,''),
              },{
                label:'联系电话',
                value:isNull(broker.phone,''),
              }
            ],
            picUrl:isNull(broker.img,''),
            id:isNull(broker.id,''),
          }
        }
      }
      else if(detailType==='合作成交佣金分配比例'){
        if(item.detailContent==null){
          trackData.dealCommissionProportion=null;
        }else{
          const dealCommissionProportion=JSON.parse(item.detailContent);
          trackData.dealCommissionProportion=[
            {
              label:'佣金协调时间',
              value:isNull(dealCommissionProportion.commissionCoordinationDateTime,'--'),
            },{
              label:'买方经纪人',
              value:isNull(dealCommissionProportion.brokerRate,'--'),
            },{
              label:'卖方经纪人',
              value:isNull(dealCommissionProportion.customerBrokerRate,'--'),
            }
          ]
        }
      }
      else if(detailType==='出租房源'){
        const house=JSON.parse(item.detailContent);
        const houseBasic=JSON.parse(house.resourcesInfo);
        trackData.houseInfo={
          houseInfo:{
            id:isNull(houseBasic.resourcesNumber,''),
            key:`key_${isNull(houseBasic.resourcesId,'')}`,
            village:isNull(house.communityName,''),
            area:isNull(houseBasic.floorArea,''),
            propertyType:isNull(houseBasic.resourcesType,''),
            info:isNull(houseBasic.default,''),
            rentType:isNull(houseBasic.rentType,'无字段'),
            rentTerm:isNull(house.leaseTerm,'-'),
            rentPrice:isNull(houseBasic.price,'-'),
            rentWay:isNull(houseBasic.rentType,'无字段'),
            operation:'',
          }
        }
      }
      else if(detailType==='房源委托信息'){
        if(!!item.detailContent){
          let agreementObj=[];
          try {
            agreementObj=JSON.parse(item.detailContent);
          } catch (e) {
            trackData.houseEntrustAgreementPics=null;
          }
          if(!!trackData.houseEntrustAgreementPics){
            agreementObj.map(item=>{
              if(!!item){
                trackData.houseEntrustAgreementPics.push({
                  src:isNull(item,''),
                  id:isNull(item,''),
                  title:'',
                })
              }
            })
          }
        }else{
          trackData.houseEntrustAgreementPics=[];
        }
      }
      else if(detailType==='房源出租记录'){
        if(!!item.detailContent){
          trackData.reportRecord=creatSHTimeLineData(item.detailContent);
        }else{
          trackData.reportRecord=null;
        }
      }
      else if(detailType==='出租意向金'){
        let detailContent=null;
        try{
          detailContent=JSON.parse(item.detailContent);
        }catch(err){
          trackData.intentsInfo=null;
        }
        if(!!detailContent){
          trackData.intentsInfo={
            id:isNull(detailContent.orderNumber,'-'),
            payWay:isNull(detailContent.paymentMethod,''),
            paySerialNumber:isNull(detailContent.serialNumber,'-'),
            payTime:isNull(detailContent.paymentDateTime,'-'),
            customer:isNull(detailContent.customerName,'-'),
            rentCommission:isNull(detailContent.amount,'-'),
            commissionAmount:isNull(detailContent.actualRent,'-'),
            payStatus:isNull(detailContent.paymentStatus,'-'),
          }
        }
      }
      else if(detailType==='租房意向金收据'){
        if(!!item.detailContent){
          let agreementObj=[];
          try {
            agreementObj=JSON.parse(item.detailContent);
          } catch (e) {
          }
          trackData.intentsAgreements=agreementObj.map((item,index)=>{
            if(!!item){
              return ({
                src:isNull(item,''),
                id:isNull(item,`key_${index}`),
                title:'',
              })
            }
          })
        }else{
          trackData.intentsAgreements=[];
        }
      }
      else if(detailType==='意向金退款办理'){
        if(!!item.detailContent){
          trackData.intentsRefundInfo=creatSHTimeLineData(item.detailContent);
        }else{
          trackData.intentsRefundInfo=null;
        }
      }
      else if(detailType==='已支付租房佣金'){
        let detailContent=null;
        try{
          detailContent=JSON.parse(item.detailContent);
        }catch(err){
          trackData.commissionInfo=null;
        }
        if(!!detailContent){
          trackData.commissionInfo={
            orderNumber:isNull(detailContent.orderNumber,'-'),
            payWay:isNull(detailContent.paymentMethod,'-'),
            paySerialNumber:isNull(detailContent.serialNumber,'-'),
            dealRentPrice:`${isNull(detailContent.actualRent,'-')}元`,//
            customer:isNull(detailContent.customerName,'-'),
            payTime:isNull(detailContent.paymentDateTime,'-'),
            commissionDeductible:`${isNull(detailContent.intentionAmount,'-')}元`,//
            dealCommission:`${isNull(detailContent.amount,'-')}元`,//
            payStatus:isNull(detailContent.paymentStatus,'-'),
          }
        }
      }
      else if(detailType==='已上传租房居间合同或收据'){
        if(!!item.detailContent){
          let agreementObj=[];
          try {
            agreementObj=JSON.parse(item.detailContent);
          } catch (e) {
          }
          trackData.commissionAgreements=agreementObj.map((item,index)=>{
            if(!!item){
              return ({
                src:isNull(item,''),
                id:isNull(item,`key_${index}`),
                title:'',
              })
            }
          })
        }else{
          trackData.commissionAgreements=[];
        }
      }
      else if(detailType==='房屋过户信息'){
        if(!!item.detailContent){
          trackData.transferInfo=creatSHTimeLineData(item.detailContent);
        }else{
          trackData.transferInfo=null;
        }
      }
      else if(detailType==='房源贷款信息'){
        if(!!item.detailContent){
          trackData.loanInfo=creatSHTimeLineData(item.detailContent);
        }else{
          trackData.loanInfo=null;
        }
      }
      else if(detailType==='二手房解押办理'){
        if(!!item.detailContent){
          trackData.relieveLoadInfo=creatSHTimeLineData(item.detailContent);
        }else{
          trackData.relieveLoadInfo=null;
        }
      }
      else if(detailType==='成交资金释放账户'){
        if(!!item.detailContent){
          let commitReleaseFund=null;
          try{
            commitReleaseFund=JSON.parse(item.detailContent);
          }catch(e){
            trackData.commitReleaseFundInfo=null;
          }
          if(!!commitReleaseFund){
            let picList=null;
            try{
              picList=JSON.parse(commitReleaseFund.images).map((item,index)=>{
                if(!!item){
                  return ({
                    src:isNull(item,''),
                    id:isNull(item,`key_${index}`),
                    title:'',
                  })
                }
              });
            }catch(e){
              picList=null;
            }
            const commitReleaseFundInfo={
              formData:[
                {
                  label:'业主姓名',
                  value:isNull(commitReleaseFund.ownerName,'-'),
                },{
                  label:'开户银行',
                  value:isNull(commitReleaseFund.ownerBank,'-'),
                },{
                  label:'开户支行',
                  value:isNull(commitReleaseFund.ownerBankSubbranch,'-'),
                },{
                  label:'开户银行卡号',
                  value:isNull(commitReleaseFund.ownerBankCard,'-'),
                },{
                  label:'业主联系电话',
                  value:isNull(commitReleaseFund.ownerPhone,'-'),
                },{
                  label:'释放金额',
                  value:isNull(commitReleaseFund.releaseAmount,'-'),
                },{
                  label:'释放类型',
                  value:isNull(commitReleaseFund.releaseType,'-'),
                }
              ],
              picList:picList,
            }
            trackData.commitReleaseFundInfo=commitReleaseFundInfo;
          }
        }else{
          trackData.commitReleaseFundInfo=null;
        }
      }
      else if(detailType==='成交分佣设置'){
        if(!!item.detailContent){
          let commitCommission=null;
          try{
            commitCommission=JSON.parse(item.detailContent);
          }catch(e){
            trackData.commitCommissionInfo=null;
          }
          if(!!commitCommission){
            let surplusAmount=null;
            try{
              surplusAmount=Number(commitCommission.commissionAmount)*(1-Number(commitCommission.platformCommissionRate));
            }catch(e){
              surplusAmount=null;
            }
            const formData=[
              {
                label:'成交佣金总额',
                value:`${isNull(commitCommission.commissionAmount,'-')}元`,
              },{
                label:'平台抽佣',
                value:isNullRate(commitCommission.platformCommissionRate,'-'),
              },{
                label:'交易服务费',
                value:`${isNull(commitCommission.serviceCharge,'-')}元`,
              },{
                label:'剩余佣金总额',
                value:`${isNull(surplusAmount,'-')}元`,
              },{
                label:'成交方式',
                value:isNull(commitCommission.transactionMode,'-'),
              }
            ]
            if(isNull(commitCommission.transactionMode,'-')==='合作成交'){
              formData.push({
                label:'房源经纪人',
                value:`${isNullRate(commitCommission.brokerCommissionRate)} ${surplusAmount*isNull(commitCommission.brokerCommissionRate,0)}元`,
              })
              formData.push({
                label:'客源经纪人',
                value:`${isNullRate(1-commitCommission.brokerCommissionRate)} ${surplusAmount-(surplusAmount*isNull(commitCommission.brokerCommissionRate,0))}元`,
              })
            }
            else if(isNull(commitCommission.transactionMode,'-')==='自有客户'){
              formData.push({
                label:'房源经纪人',
                value:`100% ${surplusAmount}元`,
              })
            }
            trackData.commitCommissionInfo=formData;
          }
        }else{
          trackData.commitCommissionInfo=null;
        }
      }
      else if(detailType==='房屋成交信息'){
        if(!!item.detailContent){
          trackData.commitInfo=creatSHTimeLineData(item.detailContent,'二手房出租成交执行分佣');
        }else{
          trackData.commitInfo=null;
        }
      }
      else if(detailType==='租房分期办理进度'){
        if(!!item.detailContent){
          trackData.loanInfo=creatSHTimeLineData(item.detailContent,'租房分期办理进度');
        }else{
          trackData.loanInfo=null;
        }
      }
    });
    console.log('trackData',trackData);
    return trackData;
  }else{
    return {}
  }
}

/***************************    track 2.0 新房track数据转换    *****************************************************/
//传入  trackDetail (Array)
//返回  JSON数组
export function renderNHTrackDataJSON(responseData){
  const {trackDetail}=responseData;
  const nhTrackData = [];
  const mapSortArr=[
    '交易中心','意向项目','客户信息','确看意向房源','报备经纪人','看房记录','已购电商优惠',
    '团购锁定意向房源','电商收据/意向合同','电商优惠动态','实际成交房源','成交佣金','成交经纪人',
    '成交合同或协议','房屋成交信息','成交价格'
  ];
  if(!!trackDetail){
    trackDetail.map(item=>{
      switch (item.detailType) {
        case '意向房源':
          nhTrackData.push({
            type:'确看意向房源',
            value:renderNHIntentsHouse(item.detailContent),
          })
          break;
        case '报备经纪人':
          nhTrackData.push({
            type:'报备经纪人',
            value:renderNHReportBroker(item.detailContent),
          })
          break;
        case '客户信息':
          nhTrackData.push({
            type:'客户信息',
            value:renderCustomerInfo(item.detailContent),
          })
          break;
        case '看房记录':
          nhTrackData.push({
            type:'看房记录',
            value:renderHNVisitHouse(item.detailContent),
          })
          break;
        case '意向项目':
          nhTrackData.push({
            type:'意向项目',
            value:renderHNIntentsProject(item.detailContent),
          })
          break;
        case '团购意向房源':
          nhTrackData.push({
            type:'团购锁定意向房源',
            value:renderHNGroupBuyIntentsHouse(item.detailContent,responseData.currentDate),
          })
          break;
        case '已购电商优惠':
          nhTrackData.push({
            type:'已购电商优惠',
            value:renderHNGroupBuyOrder(item.detailContent),
          })
          break;
        case '电商优惠动态':
          nhTrackData.push({
            type:'电商优惠动态',
            value:renderNHGroupBuyRecordList(item.detailContent),
          })
          break;
        case '意向合同':
          nhTrackData.push({
            type:'电商收据/意向合同',
            value:renderHNGroupBuyAgreement(item.detailContent),
          })
          break;
        case '团购退款审核':
          nhTrackData.push({
            type:'团购退款审核',
            value:renderNHGroupBuyRefundAudit(item.detailContent),
          })
          break;
        case '成交房源':
          nhTrackData.push({
            type:'实际成交房源',
            value:renderNHCommitHouse(item.detailContent),
          })
          break;
        case '成交价格':
          nhTrackData.push({
            type:'成交价格',
            value:renderNHCommitOrder(item.detailContent),
          })
          break;
        case '成交经纪人':
          nhTrackData.push({
            type:'成交经纪人',
            value:renderNHReportBroker(item.detailContent),
          })
          break;
        case '成交佣金':
          nhTrackData.push({
            type:'成交佣金',
            value:renderNHCommision(item.detailContent),
          })
          break;
        case '成交合同或协议':
          nhTrackData.push({
            type:'成交合同或协议',
            value:renderNHCommitAgreement(item.detailContent),
          })
          break;
        // case '成交审核':
        //   nhTrackData.push({
        //     type:'成交审核',
        //     value:renderNHCommitAudit(item.detailContent),
        //   })
        //   break;
        case '房屋成交信息':
          nhTrackData.push({
            type:'房屋成交信息',
            // value:creatSHTimeLineData(item.detailContent,'房屋成交信息'),
            value:renderNHSellCommitInfo(item.detailContent,'房屋成交信息'),
          })
          break;
        default:
          console.log('item.detailType',item.detailType);
      }
    })
  }
  console.log('nhTrackData',nhTrackData);
  return JSON.stringify(sortTitleFun(mapSortArr,nhTrackData));
}

//【新房】track 意向房源
export function renderNHIntentsHouse(detailContent){
  let result = null;
  let house = parseTrackJSON(detailContent);
  if(!!house){
    result = {
      id:house.id,
      area:house.area,
      buildingNumber:house.buildingNumber,
      unit:house.unit,
      roomNumber:house.roomNumber,
      houseRoom:house.houseRoom,
      livingRoom:house.livingRoom,
      cookRoom:house.cookRoom,
      bathRoom:house.bathRoom,
      floorArea:house.floorArea,
      imgUrl:house.housePic,
      price:house.price,
      totalPrice:house.totalPrice,
    }
  }
  return result;
}
//track 经纪人
export function renderNHReportBroker(detailContent){
  let result = null;
  const broker = parseTrackJSON(detailContent);
  if(!!broker){
    result = {
      data:[
        {
          label:'姓名',
          value:broker.name,
        },{
          label:'性别',
          value:broker.gender,
        },{
          label:'联系电话',
          value:broker.phone,
        }
      ],
      picUrl:broker.logo,
    }
  }
  return result;
}
//track 客户信息
export function renderCustomerInfo(detailContent){
  let result = null;
  let customer = parseTrackJSON(detailContent);
  if(!!customer){
    result = [
      {
        label:'姓名',
        value:customer.name,
      },{
        label:'性别',
        value:customer.gender,
      },{
        label:'手机号',
        value:customer.phone,
      },{
        label:'身份证号',
        value:customer.idNumber,
      }
    ]
  }
  return result;
}
//【新房】track 看房记录
export function renderHNVisitHouse(detailContent){
  let result = null;
  let visitRecord = parseTrackJSON(detailContent);
  if(!!visitRecord){
    result = visitRecord.map(record=>({
      label:record.date,
      value:record.content,
    }))
  }
  return result
}
//【新房】track 意向项目
export function renderHNIntentsProject(detailContent){
  let result = null;
  const projectInfo = parseTrackJSON(detailContent);
  if(!!projectInfo){
    result = {
      name:isNull(projectInfo.name,'-'),
      id:isNull(projectInfo.id,null),
    }
  }
  return result;
}
//【新房】track 团购意向房源
export function renderHNGroupBuyIntentsHouse(detailContent,currentDate){
  console.log('currentDate',currentDate);
  let result = null;
  const house = parseTrackJSON(detailContent);
  console.log('house',house);
  if(!!house){
    // const currentDate=new Date(responseData.currentDate);
    // const holdToDate=new Date(house.holdToDate);
    // console.log('currentDate',currentDate);
    // console.log('holdToDate',holdToDate);
    // const restTime=holdToDate-currentDate;
    // console.log('restTime',restTime);
    // const restDays=restTime/(1000*60*60*24);
    //剩余毫秒数
    const restTime=new Date(house.holdToDate)-new Date(currentDate);
    console.log('剩余毫秒数restTime',restTime);
    //剩余天数（向下取整）
    const restDays=Math.floor(restTime/(1000*60*60*24));
    console.log('剩余天数（向下取整）',restDays);
    // console.log('restDays',restDays);
    //余 毫秒数
    const otherTime=restTime-(restDays*(1000*60*60*24));
    console.log('余 毫秒数',otherTime);
    // console.log('otherTime',otherTime);
    //剩余小时数（向下取整）
    const restHours=Math.floor(otherTime/(1000*60*60));
    console.log('剩余小时数（向下取整）',restHours);
    // console.log('restHours',restHours);
    result = {
      id:house.id,
      area:house.area,
      buildingNumber:house.buildingNumber,
      unit:house.unit,
      houseTypeName:house.houseTypeName,
      roomNumber:house.roomNumber,
      houseRoom:house.houseRoom,
      livingRoom:house.livingRoom,
      cookRoom:house.cookRoom,
      bathRoom:house.bathRoom,
      floorArea:house.floorArea,
      imgUrl:house.housePic,
      price:house.price,
      totalPrice:house.totalPrice,
      restTime:`${restDays}天${restHours}小时`,
    }
  }
  return result;
}
//【新房】track 已购电商优惠
export function renderHNGroupBuyOrder(detailContent){
  let result = null;
  let buyDiscount = parseTrackJSON(detailContent)
  if(!!buyDiscount){
    result = {
      key:'groupBuyOrder',
      pic:buyDiscount.projectFavorableName,
      details:buyDiscount.favorableSuitableType,
      number:buyDiscount.payOrderNumber,
      payAway:buyDiscount.payType,
      paySerialNumber:buyDiscount.paySerialNumber,
      payCustomer:buyDiscount.customerName,
      customerPhone:buyDiscount.customerPhone,
      payTime:buyDiscount.payFinishTime,
      payCash:`${buyDiscount.groupbuyMoney}元`,
      payStatus:buyDiscount.status,
    }
  }
  return result
}
//【新房】track 电商优惠动态
export function renderNHGroupBuyRecordList(detailContent){
  let result = null;
  const auditList = parseTrackJSON(detailContent);
  if(!!auditList){
    // console.log('auditList',auditList);
    result = creatNHGroupBuyTimeLineData(auditList,'电商优惠动态');
  }
  return result;
}
// //【新房】track 房屋成交信息
// export function renderNHHousingTransactionInformation(detailContent){
//   let result = null;
//   const auditList = parseTrackJSON(detailContent);
//   if(!!auditList){
//     // console.log('auditList',auditList);
//     result = creatNHGroupBuyTimeLineData(auditList,'房屋成交信息');
//   }
//   return result;
// }
//【新房】track 意向合同
export function renderHNGroupBuyAgreement(detailContent){
  let result = null;
  const agreementInfo = parseTrackJSON(detailContent)
  if(!!agreementInfo && !!agreementInfo.agreementPics){
    const agreementPics = parseTrackJSON(agreementInfo.agreementPics)
    if(!!agreementPics){
      result = agreementPics.map(item=>({
        src:item,
        id:item,
        title:'',
      }))
    }
  }
  return result
}
//【新房】track 团购退款审核
export function renderNHGroupBuyRefundAudit(detailContent){
  let result = null;
  const auditList = parseTrackJSON(detailContent);
  if(!!auditList){
    console.log('auditList',auditList);
    result = renderNHGroupBuyRefundAuditList(auditList);
  }
  return result;
}
//从track数据中，取到最新的type的值
export function getNewTypeTrackJSONData(trackJSON,type){
  let result = null;
  if(!!trackJSON){
    const trackArr = parseTrackJSON(trackJSON);
    if(!!trackArr){
      let index = trackArr.length-1;
      for(index;index>=0;index--){
        if(trackArr[index].type === type){
          result = trackArr[index].value;
          index = -1;
        }
      }
    }
  }
  return result
}
//【新房】track 成交房源
export function renderNHCommitHouse(detailContent){
  let result = null;
  const house = parseTrackJSON(detailContent);
  if(!!house){
    result = {
      id:house.id,
      area:house.area,
      buildingNumber:house.buildingNumber,
      unit:house.unit,
      roomNumber:house.roomNumber,
      houseRoom:house.houseRoom,
      livingRoom:house.livingRoom,
      cookRoom:house.cookRoom,
      bathRoom:house.bathRoom,
      floorArea:house.floorArea,
      imgUrl:house.housePic,
      price:house.price,
      totalPrice:house.totalPrice,
    }
  }
  return result
}
//【新房】track 成交价格
export function renderNHCommitOrder(detailContent){
  let result = null;
  const orderInfo = parseTrackJSON(detailContent);
  if(!!orderInfo){
    result = [
      {
        label:'实际成交单价',
        value:isNull(orderInfo.unitPrice,''),
      },{
        label:'实际成交总价',
        value:isNull(orderInfo.totalPrice,''),
      },{
        label:'支付方式',
        value:isNull(orderInfo.payType,''),
      }
    ]
  }
  return result
}
//【新房】track 成交佣金
export function renderNHCommision(detailContent){
  let result = null;
  const commissionInfo = parseTrackJSON(detailContent);
  if(!!commissionInfo){
    result = [
      {
        label:'团购佣金总额',
        value:`${isNull(commissionInfo['团购佣金总额'],'')}元`,
      },
      {
        label:'平台抽佣比例',
        value:isNullRate(commissionInfo['平台抽佣'],'-'),
      },
      {
        label:'平台抽佣金额',
        value:`${isNull(commissionInfo['平台抽佣金额'],'')}元`,
      },
      {
        label:'实际佣金金额',
        value:`${isNull(commissionInfo['实际佣金金额'],'')}元`,
      }
    ]
  }
  return result
}
//【新房】track 成交合同或协议
export function renderNHCommitAgreement(detailContent){
  let result = null;
  const commitAgrs = parseTrackJSON(detailContent);
  if(!!commitAgrs){
    result = commitAgrs.map(item=>({
      src:item,
      id:item,
      title:'',
    }))
  }
  return result
}
//【新房】track 成交审核
export function renderNHCommitAudit(detailContent){
  let result = null;
  const commitAuditArr = parseTrackJSON(detailContent)
  if(!!commitAuditArr){
    result = [];
    commitAuditArr.map(record=>{
      if(checkStringIsJSON(record.content)){
        console.log('record',record);
        const commissionInfo=JSON.parse(record.content);
        console.log('commissionInfo',commissionInfo);
        const commissionArr = renderCommitCommissionInfo(commissionInfo,'nh')
        console.log('commissionArr',commissionArr);
        let commissionStr = '';
        commissionArr.map(item=>{
          commissionStr += `${item.label}：${item.value}，`
        })
        // const content = `佣金总额：${isNull(commissionInfo.)}元`
        //在这里处理 佣金分配信息
        result.push({
          label:record.date,
          value:commissionStr,
        })
      }else{
        result.push({
          label:record.date,
          value:record.content,
        })
      }
    })
  }
  return result;
}
//【新房】teack 房屋成交信息
export function renderNHCommitApplyInfo(detailContent){
  let result = null;
  const commitInfoArr = parseTrackJSON(detailContent)
  if(!!commitInfoArr){
    console.log('commitInfoArr',commitInfoArr);
  }
  return result
}



//【二手房出售】Track
export function renderSHSellTrackDataJSON(trackDetail,transCode){
  const shSellTrackData = [];
  const mapSortArr=['交易中心','房源报成交经纪人','房源报成交客户','客户所属经纪人','合作成交佣金分配比例',
  '意向房源','房源委托信息','房源报成交记录','支付意向金','意向合同/协议','意向金支付动态','已支付首付款',
  '首付款协议/合同','已支付佣金','买卖居间协议/佣金协议','佣金支付动态','解押贷款申请','购房分期贷款申请',
  '房屋过户申请','成交资金释放账户','成交分佣设置','房屋成交信息'];
  if(!!trackDetail && !!transCode){
    trackDetail.map(item=>{
      switch (item.detailType) {
        case '交易中心':
          shSellTrackData.push({
            type:'交易中心',
            value:renderTradeCenterInfo(item.detailContent),
          })
          break;
        case '报成交经纪人':
          shSellTrackData.push({
            type:'房源报成交经纪人',
            value:renderSHBroker(item.detailContent),
          })
          break;
        case '客户所属经纪人':
          shSellTrackData.push({
            type:'客户所属经纪人',
            value:renderSHBroker(item.detailContent),
          })
          break;
        case '合作成交佣金分配比例':
          shSellTrackData.push({
            type:'合作成交佣金分配比例',
            value:renderSHSellCommissionRate(item.detailContent),
          })
          break;
        case '意向房源':
          shSellTrackData.push({
            type:'意向房源',
            value:renderSHSellIntentsHouse(item.detailContent,transCode),
          })
          break;
        case '房源委托信息':
          shSellTrackData.push({
            type:'房源委托信息',
            value:renderSHPicList(item.detailContent),
          })
          break;
        case '房源报成交记录':
          shSellTrackData.push({
            type:'房源报成交记录',
            value:renderSHTimeList(item.detailContent),
          })
          break;
        case '已支付意向金':
          shSellTrackData.push({
            type:'支付意向金',
            value:renderSHSellIntentsOrder(item.detailContent),
          })
          break;
        case '报成交客户':
          shSellTrackData.push({
            type:'房源报成交客户',
            value:renderSHSellCustomerInfo(item.detailContent),
          })
          break;
        case '意向合同或意向收据':
          shSellTrackData.push({
            type:'意向合同/协议',
            value:renderSHPicList(item.detailContent),
          })
          break;
        case '意向金退款办理':
          shSellTrackData.push({
            type:'意向金退款办理',
            value:renderSHSellIntentsRefundAudit(item.detailContent),
          })
          break;
        case '已支付首付款':
          shSellTrackData.push({
            type:'已支付首付款',
            value:renderSHSellDownPaymentOrder(item.detailContent),
          })
          break;
        case '请上传首付款协议/合同':
          shSellTrackData.push({
            type:'首付款协议/合同',
            value:renderSHPicList(item.detailContent),
          })
          break;
        case '首付款退款业务':
          shSellTrackData.push({
            type:'首付款退款业务',
            value:renderSHSellDownPaymentRefundAudit(item.detailContent),
          })
          break;
        case '佣金支付':
          shSellTrackData.push({
            type:'已支付佣金',
            value:renderSHSellCommissionOrder(item.detailContent),
          })
          break;
        case '佣金支付动态':
          shSellTrackData.push({
            type:'佣金支付动态',
            value:renderSHSellRecordList(item.detailContent),
          })
          break;
        case '意向金支付动态':
          shSellTrackData.push({
            type:'意向金支付动态',
            value:renderSHSellIntentionMoneyRecordList(item.detailContent),
          })
          break;
        case '解押贷款申请':
          shSellTrackData.push({
            type:'解押贷款申请',
            value:renderSHSellLoanMortgage(item.detailContent),
          })
          break;
        case '购房分期贷款申请':
          shSellTrackData.push({
            type:'购房分期贷款申请',
            value:renderSHSellPurchaseApplication(item.detailContent),
          })
          break;
        case '买卖居间协议/佣金协议':
          shSellTrackData.push({
            type:'买卖居间协议/佣金协议',
            value:renderSHPicList(item.detailContent),
          })
          break;
        case '佣金退款协议办理':
          shSellTrackData.push({
            type:'佣金退款协议办理',
            value:renderSHSellCommissionRefundAudit(item.detailContent),
          })
          break;
        case '房屋过户信息':
          shSellTrackData.push({
            type:'房屋过户信息',
            value:renderSHSellTransferAudit(item.detailContent),
          })
          break;
        case '房屋过户申请':
          shSellTrackData.push({
            type:'房屋过户申请',
            value:renderSHSellTransferApplication(item.detailContent),
          })
          break;
        case '房源贷款信息':
          shSellTrackData.push({
            type:'房源贷款信息',
            value:renderSHSellLoanAudit(item.detailContent),
          })
          break;
        case '二手房解押办理':
          shSellTrackData.push({
            type:'二手房解押办理',
            value:renderSHSellRelieveLoanAudit(item.detailContent),
          })
          break;
        case '成交资金释放账户':
          shSellTrackData.push({
            type:'成交资金释放账户',
            value:renderSHSellCommitReleaseFund(item.detailContent),
          })
          break;
        case '成交分佣设置':
          shSellTrackData.push({
            type:'成交分佣设置',
            value:renderSHSellCommitCommissionInfo(item.detailContent),
          })
          break;
        case '房屋成交信息':
          shSellTrackData.push({
            type:'房屋成交信息',
            value:renderSHSellCommitInfo(item.detailContent),
          })
          break;
        default:
          console.log('item.detailType',item.detailType);
      }
    })
  }
  console.log('shSellTrackData',shSellTrackData);

  return JSON.stringify(sortTitleFun(mapSortArr,shSellTrackData))
}
//【二手房出售】track 交易中心
export function renderTradeCenterInfo(detailContent){
  let result = null;
  const tradeCenter = parseTrackJSON(detailContent)
  if(!!tradeCenter){
    result = [
      {
        label:'名称',
        value:isNull(tradeCenter.name,'')
      },
      {
        label:'地址',
        value:isNull(tradeCenter.address,'')
      },
      {
        label:'联系电话',
        value:isNull(tradeCenter.phone,'')
      },
    ]
  }
  return result
}
//【二手房出售】track 报成交经纪人
export function renderSHBroker(detailContent){
  let result = null;
  const brokerInfo = parseTrackJSON(detailContent)
  if(!!brokerInfo){
    result = {
      data:[
        {
          label:'姓名',
          value:isNull(brokerInfo.name,''),
        },{
          label:'性别',
          value:isNull(brokerInfo.sex,''),
        },{
          label:'联系电话',
          value:isNull(brokerInfo.phone,''),
        }
      ],
      picUrl:isNull(brokerInfo.img,''),
      id:isNull(brokerInfo.id,''),
    }
  }
  return result
}
//【二手房出售】track 合作成交佣金分配比例
export function renderSHSellCommissionRate(detailContent){
  let result = null;
  const dealCommissionProportion = parseTrackJSON(detailContent)
  if(!!dealCommissionProportion){
    result = [
      {
        label:'佣金协调时间',
        value:isNull(dealCommissionProportion.commissionCoordinationDateTime,'-'),
      }
    ]
    if(isNull(dealCommissionProportion.customerBrokerRate,false)){
      result.push({
        label:'买方经纪人',
        value:isNullRate(dealCommissionProportion.customerBrokerRate,'-'),
      })
    }
    if(isNull(dealCommissionProportion.customerBrokerCommissionAmount,false)){
      result.push({
        label:'买方经纪人',
        value:`${isNull(dealCommissionProportion.customerBrokerCommissionAmount,'-')}元`,
      })
    }
    if(isNull(dealCommissionProportion.brokerRate,false)){
      result.push({
        label:'卖方经纪人',
        value:isNullRate(dealCommissionProportion.brokerRate,'-'),
      })
    }
    if(isNull(dealCommissionProportion.brokerCommissionAmount,false)){
      result.push({
        label:'卖方经纪人',
        value:`${isNull(dealCommissionProportion.brokerCommissionAmount,'-')}元`,
      })
    }
  }
  return result
}
//【二手房出售】track 意向房源
export function renderSHSellIntentsHouse(detailContent,transCode){
  let result = null;
  const house = parseTrackJSON(detailContent);
  if(!!house){
    const houseBasic = parseTrackJSON(house.resourcesInfo)
    if(!!houseBasic){
      result = {
        id:isNull(house.resourcesId,''),
        key:`key_${isNull(house.resourcesId,'')}`,
        resourcesNumber:`${isNull(houseBasic.resourcesNumber,'-')}`,
        village:isNull(house.communityName,''),
        propertyType:isNull(houseBasic.resourcesType,''),
        info:isNull(houseBasic.default,''),
        brokerId:isNull(house.brokerId,''),
        resourcesId:isNull(house.resourcesId,''),

        // area:`${getJSONValue(isNull(house.resourcesInfo,''),'floorArea')}㎡`,
        // price:`${getJSONValue(isNull(house.resourcesInfo,''),'uintPirce')}元`,
        area:`${isNull(house.resourcesArea,'-')}㎡`,
        price:renderUnitPriceStr(house.unitPrice,'-'),
        totalPrice:renderTotalMoneyStr(house.totalPrice,'-'),

        loan:isNull(houseBasic.supportMortgage,'不支持')==='不支持'?false:true,
        transCode:isNull(transCode,''),
      }
    }
  }
  return result
}
//【二手房出售】track 图片list '['','']'
export function renderSHPicList(detailContent){
  let result = null;
  const picList = parseTrackJSON(detailContent)
  if(!!picList){
    result = picList.map(item=>({
      src:isNull(item,''),
      id:isNull(item,''),
      title:'',
    }))
  }
  return result
}
//【二手房出售】track 时间轴格式数据
export function renderSHTimeList(detailContent){
  let result = null;
  let visitRecord = parseTrackJSON(detailContent);
  if(!!visitRecord){
    result = visitRecord.map(record=>({
      label:record.date,
      value:record.content,
    }))
  }
  return result
  // let result = null;
  // const timeData = parseTrackJSON(detailContent)
  // if(!!timeData){
  //   result = [];
  //   timeData.map(record=>{
  //     const recordContent = parseTrackJSON(record.content);
  //     if(!!recordContent){
  //       if(!!recordContent.detailContentType && recordContent.detailContentType==='TimeLine'){
  //         result.push({
  //           label:isNull(record.date,''),
  //           value:isNull(recordContent.desc,''),
  //         })
  //       }
  //     }
  //   })
  // }
  // return result
}
//【二手房出售】track 已支付意向金
export function renderSHSellIntentsOrder(detailContent){
  let result = null;
  const orderInfo = parseTrackJSON(detailContent)
  if(!!orderInfo){
    result = {
      id:isNull(orderInfo.orderNumber,''),
      payWay:isNull(orderInfo.paymentMethod,'-'),
      paySerialNumber:isNull(orderInfo.serialNumber,'-'),
      payTime:isNull(orderInfo.paymentDateTime,'-'),
      customer:isNull(orderInfo.customerName,'-'),
      phoneNumber:isNull(orderInfo.customerPhone,'-'),
      price:`${isNull(orderInfo.unitPrice,'-')}元`,
      totalPrice:renderTotalMoneyStr(orderInfo.totalPrice,'-'),
      intentsPrice:`${isNull(orderInfo.amount,'-')}元`,
      payStatus:isNull(orderInfo.paymentStatus,'-'),
    }
  }
  return result
}
//【二手房出售】track 报成交客户
export function renderSHSellCustomerInfo(detailContent){
  let result = null;
  const customer = parseTrackJSON(detailContent)
  if(!!customer){
    result = [
      {
        label:'姓名',
        value:isNull(customer.name,''),
      },{
        label:'性别',
        value:isNull(customer.sex,''),
      },{
        label:'手机号',
        value:isNull(customer.phone,''),
      },{
        label:'身份证号',
        value:isNull(customer.idNumber,'-'),
      }
    ]
  }
  return result
}
//【二手房出售】track 意向金退款办理
export function renderSHSellIntentsRefundAudit(detailContent){
  let result = null;
  if(!!detailContent){
    result = creatSHTimeLineData(detailContent,'出售意向金退款办理')
  }
  return result
}
//【二手房出售】track 已支付首付款
export function renderSHSellDownPaymentOrder(detailContent){
  let result = null;
  const orderInfo = parseTrackJSON(detailContent)
  if(!!orderInfo){
    result = {
      id:isNull(orderInfo.orderNumber,''),
      payWay:isNull(orderInfo.paymentMethod,''),
      paySerialNumber:isNull(orderInfo.serialNumber,''),
      payTime:isNull(orderInfo.paymentDateTime,''),
      dealTotalPrice:renderTotalMoneyStr(orderInfo.totalPrice,''),
      customer:isNull(orderInfo.customerName,''),
      phoneNumber:isNull(orderInfo.customerPhone,''),
      proportion:isNullRate(orderInfo.firstpaymentRatio,''),
      intentsDeductible:`${isNull(orderInfo.deductedIntention,'-')}元`,
      payAmount:`${isNull(orderInfo.amount,'')}元`,
      payStatus:isNull(orderInfo.paymentStatus,''),
    }
  }
  return result
}
//【二手房出售】track 首付款退款办理
export function renderSHSellDownPaymentRefundAudit(detailContent){
  let result = null;
  if(!!detailContent){
    result = creatSHTimeLineData(detailContent,'首付款退款办理')
  }
  return result
}
//【二手房出售】track 佣金支付
export function renderSHSellCommissionOrder(detailContent){
  let result = null;
  const orderInfo = parseTrackJSON(detailContent)
  if(!!orderInfo){
    result = {
      orderNumber:isNull(orderInfo.orderNumber,''),
      payWay:isNull(orderInfo.paymentMethod,''),
      paySerialNumber:isNull(orderInfo.serialNumber,''),
      payTime:isNull(orderInfo.paymentDateTime,''),
      dealTotalPrice:renderTotalMoneyStr(orderInfo.totalPrice,'-'),
      dealUnitPrice:`${isNull(orderInfo.unitPrice,'-')}元`,
      undertaker:isNull(orderInfo.undertaker,''),
      serviceCharge:`${isNull(orderInfo.serviceCharge,'-')}元`,
      proportion:`${isNullRate(orderInfo.commissionRate,'-')}`,
      payAmount:`${isNull(orderInfo.amount,'-')}元`,
      payStatus:isNull(orderInfo.paymentStatus,''),
    }
  }
  return result
}
//【二手房出售】track 佣金支付动态
export function renderSHSellRecordList(detailContent){
  let result = null;
  const auditList = parseTrackJSON(detailContent);
  if(!!auditList){
    // console.log('auditList',auditList);
    result = creatNHGroupBuyTimeLineData(auditList,'佣金支付动态');
  }
  return result;
}
//【二手房出售】track 房屋过户申请
export function renderSHSellTransferApplication(detailContent){
  let result = null;
  const auditList = parseTrackJSON(detailContent);
  if(!!auditList){
    // console.log('auditList',auditList);
    result = creatNHGroupBuyTimeLineData(auditList,'房屋过户申请');
  }
  return result;
}
//【二手房出售】track 意向金支付动态
export function renderSHSellIntentionMoneyRecordList(detailContent){
  let result = null;
  const auditList = parseTrackJSON(detailContent);
  if(!!auditList){
    // console.log('auditList',auditList);
    result = creatNHGroupBuyTimeLineData(auditList,'意向金支付动态');
  }
  return result;
}
//【二手房出售】track 解押贷款申请
export function renderSHSellLoanMortgage(detailContent){
  let result = null;
  const auditList = parseTrackJSON(detailContent);
  if(!!auditList){
    // console.log('auditList',auditList);
    result = creatNHGroupBuyTimeLineData(auditList,'解押贷款申请');
  }
  return result;
}
//【二手房出售】track 购房分期贷款申请
export function renderSHSellPurchaseApplication(detailContent){
  let result = null;
  const auditList = parseTrackJSON(detailContent);
  if(!!auditList){
    // console.log('auditList',auditList);
    result = creatNHGroupBuyTimeLineData(auditList,'购房分期贷款申请');
  }
  return result;
}
//【二手房出售】track 佣金退款办理
export function renderSHSellCommissionRefundAudit(detailContent){
  let result = null;
  if(!!detailContent){
    result = creatSHTimeLineData(detailContent,'佣金退款协议办理')
  }
  return result
}
//【二手房出售】track 过户信息
export function renderSHSellTransferAudit(detailContent){
  let result = null;
  if(!!detailContent){
    result = creatSHTimeLineData(detailContent,'过户信息')
  }
  return result
}
//【二手房出售】track 贷款信息
export function renderSHSellLoanAudit(detailContent){
  let result = null;
  if(!!detailContent){
    result = creatSHTimeLineData(detailContent)
  }
  return result
}
//【二手房出售】track 二手房解押办理
export function renderSHSellRelieveLoanAudit(detailContent){
  let result = null;
  if(!!detailContent){
    result = creatSHTimeLineData(detailContent,'出售解押办理')
  }
  return result
}
//【二手房出售】track 成交资金释放账户
export function renderSHSellCommitReleaseFund(detailContent){
  // console.log('进入，‘。。。。。。。。。。。。。。。’');
  let result = null;
  if(!!detailContent){
    let commitReleaseFund;//成交释放信息
    try{
      commitReleaseFund=JSON.parse(detailContent);
    }catch(e){
      result = null;
    }
    if(!!commitReleaseFund[0]){
      let dataKey=Object.keys(commitReleaseFund[0]);
      let dataArr=[];
      if(dataKey.includes('releaseType')){
        dataArr.push({
          label:'释放类型',
          value:isNull(commitReleaseFund[0].releaseType,'-'),
        })
      }
      if(dataKey.includes('releaseAmount')){
        dataArr.push({
          label:'释放金额',
          value:`${isNull(commitReleaseFund[0].releaseAmount,'-')}元`,
        })
      }
      if(dataKey.includes('releaseWay')){
        dataArr.push({
          label:'释放方式',
          value:isNull(commitReleaseFund[0].releaseWay,'-'),
        })
      }
      if(dataKey.includes('ownerName')){
        dataArr.push({
          label:'业主姓名',
          value:isNull(commitReleaseFund[0].ownerName,'-'),
        })
      }
      if(dataKey.includes('ownerPhone')){
        dataArr.push({
          label:'业主联系电话',
          value:isNull(commitReleaseFund[0].ownerPhone,'-'),
        })
      }
      if(dataKey.includes('ownerIDNumber')){
        dataArr.push({
          label:'业主身份证号',
          value:isNull(commitReleaseFund[0].ownerIDNumber,'-'),
        })
      }
      if(dataKey.includes('customerName')){
        dataArr.push({
          label:'支付客户姓名',
          value:isNull(commitReleaseFund[0].customerName,'-'),
        })
      }
      if(dataKey.includes('serialNumber')){
        dataArr.push({
          label:'支付流水号',
          value:isNull(commitReleaseFund[0].serialNumber,'-'),
        })
      }

      if(dataKey.includes('customerPhone')){
        dataArr.push({
          label:'联系电话',
          value:isNull(commitReleaseFund[0].customerPhone,'-'),
        })
      }
      if(dataKey.includes('ownerBank')){
        dataArr.push({
          label:'开户银行',
          value:isNull(commitReleaseFund[0].ownerBank,'-'),
        })
      }
      if(dataKey.includes('ownerBankSubbranch')){
        dataArr.push({
          label:'开户支行',
          value:isNull(commitReleaseFund[0].ownerBankSubbranch,'-'),
        })
      }
      if(dataKey.includes('ownerBankCard')){
        dataArr.push({
          label:'开户银行卡号',
          value:isNull(commitReleaseFund[0].ownerBankCard,'-'),
        })
      }
      if(dataKey.includes('ownerBankCity')){
        dataArr.push({
          label:'开户银行城市',
          value:isNull(commitReleaseFund[0].ownerBankCity,'-'),
        })
      }
      return dataArr
    }
  }
  // let result = null;
  // if(!!detailContent){
  //   let commitReleaseFund=null;//成交释放信息
  //   let releaseInfos=null;//释放详细信息
  //   try{
  //     commitReleaseFund=JSON.parse(detailContent);
  //     releaseInfos=JSON.parse(commitReleaseFund.releaseInfos);
  //     console.log('releaseInfos',releaseInfos);
  //   }catch(e){
  //     result = null;
  //     releaseInfos=null;
  //   }
  //   if(!!commitReleaseFund){
  //     let picList=null;
  //     try{
  //       picList=JSON.parse(commitReleaseFund.images).map((item,index)=>{
  //         if(!!item){
  //           return ({
  //             src:isNull(item,''),
  //             id:isNull(item,`key_${index}`),
  //             title:'',
  //           })
  //         }
  //       });
  //     }catch(e){
  //       picList=null;
  //     }
  //     const commitReleaseFundInfo={//返回的主体数据
  //       formData:[],
  //       picList:picList,
  //       ownerInfo:null,
  //     }
  //     let showOwnerInfo=true;//是否显示业主信息
  //     if(!!releaseInfos){
  //       releaseInfos.map(releaseInfoItem=>{
  //         commitReleaseFundInfo.formData.push({
  //           label:'解押类型',
  //           value:isNull(releaseInfoItem.releaseType,'-'),
  //         })
  //         commitReleaseFundInfo.formData.push({
  //           label:'解押金额',
  //           value:`${isNull(releaseInfoItem.releaseAmount,'0')}元`,
  //         })
  //         commitReleaseFundInfo.formData.push({
  //           label:'收款方',
  //           value:isNull(releaseInfoItem.releaseOwner,false)?'业主':'购房者',
  //         })
  //       })
  //     }
  //     if(showOwnerInfo){
  //       commitReleaseFundInfo.ownerInfo=[
  //         {
  //           label:'业主姓名',
  //           value:isNull(commitReleaseFund.ownerName,'-'),
  //         },{
  //           label:'开户银行',
  //           value:isNull(commitReleaseFund.ownerBank,'-'),
  //         },{
  //           label:'开户支行',
  //           value:isNull(commitReleaseFund.ownerBankSubbranch,'-'),
  //         },{
  //           label:'开户银行卡号',
  //           value:isNull(commitReleaseFund.ownerBankCard,'-'),
  //         },{
  //           label:'业主联系电话',
  //           value:isNull(commitReleaseFund.ownerPhone,'-'),
  //         }
  //       ]
  //     }
  //     result = commitReleaseFundInfo
  //   }
  // }
  // return result
}
//【二手房出售】track 成交分佣设置
export function renderSHSellCommitCommissionInfo(detailContent){
  let result = null;
  const commitCommission = parseTrackJSON(detailContent)
  if(!!commitCommission){
    let surplusAmount=null;
    try{
      surplusAmount=floorTwoNumber(Number(commitCommission.commissionAmount)*(1-Number(commitCommission.platformCommissionRate)));
    }catch(e){
      surplusAmount=null;
    }
    const formData=[
      {
        label:'成交佣金总额',
        value:`${isNull(commitCommission.commissionAmount,'-')}元`,
      },{
        label:'平台抽佣',
        value:isNullRate(commitCommission.platformCommissionRate,'-'),
      },{
        label:'交易服务费',
        value:`${isNull(commitCommission.serviceCharge,'-')}元`,
      },{
        label:'剩余佣金总额',
        value:renderMoneyStr(surplusAmount),
      },{
        label:'成交方式',
        value:isNull(commitCommission.transactionMode,'-'),
      }
    ]
    if(isNull(commitCommission.transactionMode,'-') === '合作成交'){
      if(isNull(commitCommission.customerBrokerCommissionRate,0) == 0){
        formData.push({
          label:'房源经纪人',
          value:renderMoneyStr(commitCommission.brokerCommissionAmount,'-'),
        })
        formData.push({
          label:'客户经纪人',
          value:renderMoneyStr(commitCommission.customerBrokerCommissionAmount,'-'),
        })
      }
      else{
        formData.push({
          label:'房源经纪人',
          value:`${isNullRate(commitCommission.brokerCommissionRate,'-')} ${renderMoneyStr(commitCommission.brokerCommissionAmount,'-')}`,
        })
        formData.push({
          label:'客户经纪人',
          value:`${isNullRate(commitCommission.customerBrokerCommissionRate,'-')} ${renderMoneyStr(commitCommission.customerBrokerCommissionAmount,'-')}`,
        })
      }
    }
    else{
      formData.push({
        label:'经纪人',
        value:renderMoneyStr(commitCommission.brokerCommissionAmount),
      })
    }
    result = formData;
  }
  return result
}
//【二手房出售】track 房屋成交信息
export function renderSHSellCommitInfo(detailContent){
  let result = null;
  if(!!detailContent){
    result = creatSHTimeLineData(detailContent,'二手房出售成交执行分佣')
  }
  return result
}
//【新房】track 房屋成交信息
export function renderNHSellCommitInfo(detailContent){
  let result = null;
  if(!!detailContent){
    result = creatNHTimeLineData(detailContent,'房屋成交信息')
  }
  return result
}

//【二手房出租】track
export function renderSHRentTrackDataJSON(trackDetail,transCode){
  const shRentTrackData = [];
  const mapSortArr=[
    '交易中心','报出租经纪人','承租方/租户','租户所属经纪人','合作成交佣金分配比例','出租房源','房源委托信息',
    '房源出租记录','出租意向金','租房意向金收据','意向金支付信息','租房佣金','已上传租房居间合同或收据',
    '佣金支付动态','租房分期','成交资金释放账户','成交分佣设置','房屋出租成交信息'
  ];
  if(!!trackDetail && !!transCode){
    trackDetail.map(item=>{
      switch (item.detailType) {
        case '交易中心':
          shRentTrackData.push({
            type:'交易中心',
            value:renderTradeCenterInfo(item.detailContent),
          })
          break;
        case '报出租经纪人':
          shRentTrackData.push({
            type:'报出租经纪人',
            value:renderSHBroker(item.detailContent),
          })
          break;
        case '租户所属经纪人':
          shRentTrackData.push({
            type:'租户所属经纪人',
            value:renderSHBroker(item.detailContent),
          })
          break;
        case '合作成交佣金分配比例':
          shRentTrackData.push({
            type:'合作成交佣金分配比例',
            value:renderSHRentCommissionRate(item.detailContent),
          })
          break;
        case '出租房源':
          shRentTrackData.push({
            type:'出租房源',
            value:renderSHRentIntentsHouse(item.detailContent,transCode),
          })
          break;
        case '租户':
          shRentTrackData.push({
            type:'承租方/租户',
            value:renderSHSellCustomerInfo(item.detailContent),
          })
          break;
        case '房源委托信息':
          shRentTrackData.push({
            type:'房源委托信息',
            value:renderSHPicList(item.detailContent),
          })
          break;
        case '房源出租记录':
          shRentTrackData.push({
            type:'房源出租记录',
            value:renderSHTimeList(item.detailContent),
          })
          break;
        case '出租意向金':
          shRentTrackData.push({
            type:'出租意向金',
            value:renderSHRentIntentsOrder(item.detailContent),
          })
          break;
        case '租房意向金收据':
          shRentTrackData.push({
            type:'租房意向金收据',
            value:renderSHPicList(item.detailContent),
          })
          break;
        case '意向金退款办理':
          shRentTrackData.push({
            type:'意向金退款办理',
            value:renderSHRentIntentsRefundAudit(item.detailContent),
          })
          break;
        case '已支付租房佣金':
          shRentTrackData.push({
            type:'租房佣金',
            value:renderSHRentCommissionOrder(item.detailContent),
          })
          break;
        case '佣金退款协议办理':
          shRentTrackData.push({
            type:'佣金退款协议办理',
            value:creatSHTimeLineData(item.detailContent,'佣金退款协议办理'),
          })
          break;
        case '已上传租房居间合同或收据':
          shRentTrackData.push({
            type:'已上传租房居间合同或收据',
            value:renderSHPicList(item.detailContent),
          })
          break;
        case '房源贷款信息':
          shRentTrackData.push({
            type:'房源贷款信息',
            value:creatSHTimeLineData(item.detailContent),
          })
          break;
        case '成交资金释放账户':
          shRentTrackData.push({
            type:'成交资金释放账户',
            value:renderSHRentCommitReleaseFund(item.detailContent),
          })
          break;
        case '佣金支付动态':
          shRentTrackData.push({
            type:'佣金支付动态',
            value:renderSHSellRecordList(item.detailContent),
          })
          break;
        case '租房分期':
          shRentTrackData.push({
            type:'租房分期',
            value:renderSHRentRentingStage(item.detailContent),
          })
          break;
        case '意向金支付信息':
          shRentTrackData.push({
            type:'意向金支付信息',
            value:renderSHRentIntentionMoneyRecordList(item.detailContent),
          })
          break;
        // case '房源报成交记录':
        //   shRentTrackData.push({
        //     type:'房源报成交记录',
        //     value:renderSHTimeList(item.detailContent),
        //   })
        //   break;
        case '成交分佣设置':
          shRentTrackData.push({
            type:'成交分佣设置',
            value:renderSHRentCommitCommissionInfo(item.detailContent),
          })
          break;
        case '房屋成交信息':
          shRentTrackData.push({
            type:'房屋出租成交信息',
            value:creatSHTimeLineData(item.detailContent,'二手房出租成交执行分佣'),
          })
          break;
        // case '租房分期办理进度':
        //   shRentTrackData.push({
        //     type:'租房分期办理进度',
        //     value:creatSHTimeLineData(item.detailContent,'租房分期办理进度'),
        //   })
        //   break;
        default:
          console.log('item.detailType',item.detailType);
      }
    })
  }
  console.log('shRentTrackData',shRentTrackData);
  return JSON.stringify(sortTitleFun(mapSortArr,shRentTrackData))
}
//【二手房出租】track 合作成交佣金分配比例
export function renderSHRentCommissionRate(detailContent){
  let result = null;
  const dealCommissionProportion = parseTrackJSON(detailContent)
  if(!!dealCommissionProportion){
    result = [
      {
        label:'佣金协调时间',
        value:isNull(dealCommissionProportion.commissionCoordinationDateTime,'-'),
      }
    ]
    if(isNull(dealCommissionProportion.customerBrokerRate,false)){
      result.push({
        label:'租客经纪人',
        value:isNullRate(dealCommissionProportion.customerBrokerRate,'-'),
      })
    }
    if(isNull(dealCommissionProportion.customerBrokerCommissionAmount,false)){
      result.push({
        label:'租客经纪人',
        value:`${isNull(dealCommissionProportion.customerBrokerCommissionAmount,'-')}元`,
      })
    }
    if(isNull(dealCommissionProportion.brokerRate,false)){
      result.push({
        label:'房东经纪人',
        value:isNullRate(dealCommissionProportion.brokerRate,'-'),
      })
    }
    if(isNull(dealCommissionProportion.brokerCommissionAmount,false)){
      result.push({
        label:'房东经纪人',
        value:`${isNull(dealCommissionProportion.brokerCommissionAmount,'-')}元`,
      })
    }
  }
  return result
}
//【二手房出租】track 出租房源
export function renderSHRentIntentsHouse(detailContent,transCode){
  let result = null;
  const house = parseTrackJSON(detailContent);
  if(!!house){
    const houseBasic = parseTrackJSON(house.resourcesInfo);
    if(!!houseBasic){
      result = {
        id:isNull(houseBasic.resourcesNumber,''),
        key:`key_${isNull(houseBasic.resourcesId,'')}`,
        village:isNull(house.communityName,''),
        area:renderResoucesAreaStr(houseBasic.floorArea,'-'),
        propertyType:isNull(houseBasic.resourcesType,''),
        info:isNull(houseBasic.default,''),
        rentType:isNull(house.rentPayment,'-'),
        rentTerm:`${isNull(house.leaseTerm,'-')}月`,
        rentPrice:renderRentMeony(house.actualRent,houseBasic.resourcesType),
        rentWay:isNull(house.rentalMode,'-'),
        transCode,
        operation:'',
      }
    }
  }
  return result
}
//【二手房出租】track 已支付意向金
export function renderSHRentIntentsOrder(detailContent){
  let result = null;
  const orderInfo = parseTrackJSON(detailContent)
  if(!!orderInfo){
    console.log(orderInfo,'orderInfo>>>>>>>>>>>>>>>>>>>>>>>>>');
    result = {
      id:isNull(orderInfo.orderNumber,'-'),
      payWay:isNull(orderInfo.paymentMethod,''),
      paySerialNumber:isNull(orderInfo.serialNumber,'-'),
      payTime:isNull(orderInfo.paymentDateTime,'-'),
      customer:isNull(orderInfo.customerName,'-'),
      rentCommission:renderRentMeony(orderInfo.actualRent),
      commissionAmount:`${isNull(orderInfo.amount,'-')}元`,
      payStatus:isNull(orderInfo.paymentStatus,'-'),
    }
  }
  return result
}
//【二手房出租】track 意向金退款办理
export function renderSHRentIntentsRefundAudit(detailContent){
  let result = null;
  if(!!detailContent){
    result = creatSHTimeLineData(detailContent,'出租意向金退款办理')
  }
  return result
}
//【二手房出租】track 成交资金释放账户
export function renderSHRentCommitReleaseFund(detailContent){
  let result = null;
  if(!!detailContent){
    let commitReleaseFund;//成交释放信息
    try{
      commitReleaseFund=JSON.parse(detailContent);
    }catch(e){
      result = null;
    }
    if(!!commitReleaseFund[0]){
      let dataKey=Object.keys(commitReleaseFund[0]);
      let dataArr=[];
      if(dataKey.includes('releaseType')){
        dataArr.push({
          label:'释放类型',
          value:isNull(commitReleaseFund[0].releaseType,'-'),
        })
      }
      if(dataKey.includes('releaseAmount')){
        dataArr.push({
          label:'释放金额',
          value:`${isNull(commitReleaseFund[0].releaseAmount,'-')}元`,
        })
      }
      if(dataKey.includes('releaseWay')){
        dataArr.push({
          label:'释放方式',
          value:isNull(commitReleaseFund[0].releaseWay,'-'),
        })
      }
      if(dataKey.includes('ownerName')){
        dataArr.push({
          label:'业主姓名',
          value:isNull(commitReleaseFund[0].ownerName,'-'),
        })
      }
      if(dataKey.includes('ownerPhone')){
        dataArr.push({
          label:'业主联系电话',
          value:isNull(commitReleaseFund[0].ownerPhone,'-'),
        })
      }
      if(dataKey.includes('ownerIDNumber')){
        dataArr.push({
          label:'业主身份证号',
          value:isNull(commitReleaseFund[0].ownerIDNumber,'-'),
        })
      }
      if(dataKey.includes('customerName')){
        dataArr.push({
          label:'支付客户姓名',
          value:isNull(commitReleaseFund[0].customerName,'-'),
        })
      }
      if(dataKey.includes('serialNumber')){
        dataArr.push({
          label:'支付流水号',
          value:isNull(commitReleaseFund[0].serialNumber,'-'),
        })
      }

      if(dataKey.includes('customerPhone')){
        dataArr.push({
          label:'联系电话',
          value:isNull(commitReleaseFund[0].customerPhone,'-'),
        })
      }
      if(dataKey.includes('ownerBank')){
        dataArr.push({
          label:'开户银行',
          value:isNull(commitReleaseFund[0].ownerBank,'-'),
        })
      }
      if(dataKey.includes('ownerBankSubbranch')){
        dataArr.push({
          label:'开户支行',
          value:isNull(commitReleaseFund[0].ownerBankSubbranch,'-'),
        })
      }
      if(dataKey.includes('ownerBankCard')){
        dataArr.push({
          label:'开户银行卡号',
          value:isNull(commitReleaseFund[0].ownerBankCard,'-'),
        })
      }
      if(dataKey.includes('ownerBankCity')){
        dataArr.push({
          label:'开户银行城市',
          value:isNull(commitReleaseFund[0].ownerBankCity,'-'),
        })
      }
      return dataArr
    }
  }
  // if(!!detailContent){
  //   let commitReleaseFund=null;//成交释放信息
  //   let releaseInfos=null;//释放详细信息
  //   try{
  //     commitReleaseFund=JSON.parse(detailContent);
  //     releaseInfos=JSON.parse(commitReleaseFund.releaseInfos);
  //     console.log('releaseInfos',releaseInfos);
  //   }catch(e){
  //     result = null;
  //     releaseInfos=null;
  //   }
  //   if(!!commitReleaseFund){
  //     let picList=null;
  //     try{
  //       picList=JSON.parse(commitReleaseFund.images).map((item,index)=>{
  //         if(!!item){
  //           return ({
  //             src:isNull(item,''),
  //             id:isNull(item,`key_${index}`),
  //             title:'',
  //           })
  //         }
  //       });
  //     }catch(e){
  //       picList=null;
  //     }
  //     const commitReleaseFundInfo={//返回的主体数据
  //       formData:[],
  //       picList:picList,
  //       ownerInfo:null,
  //     }
  //     let showOwnerInfo=false;//是否显示业主信息
  //     if(!!releaseInfos){
  //       releaseInfos.map(releaseInfoItem=>{
  //         commitReleaseFundInfo.formData.push({
  //           label:'解押类型',
  //           value:isNull(releaseInfoItem.releaseType,'-'),
  //         })
  //         commitReleaseFundInfo.formData.push({
  //           label:'解押金额',
  //           value:`${isNull(releaseInfoItem.releaseAmount,'0')}元`,
  //         })
  //         commitReleaseFundInfo.formData.push({
  //           label:'收款方',
  //           value:isNull(releaseInfoItem.releaseOwner,false)?'业主':'购房者',
  //         })
  //       })
  //     }
  //     if(showOwnerInfo){
  //       commitReleaseFundInfo.ownerInfo=[
  //         {
  //           label:'业主姓名',
  //           value:isNull(commitReleaseFund.ownerName,'-'),
  //         },{
  //           label:'开户银行',
  //           value:isNull(commitReleaseFund.ownerBank,'-'),
  //         },{
  //           label:'开户支行',
  //           value:isNull(commitReleaseFund.ownerBankSubbranch,'-'),
  //         },{
  //           label:'开户银行卡号',
  //           value:isNull(commitReleaseFund.ownerBankCard,'-'),
  //         },{
  //           label:'业主联系电话',
  //           value:isNull(commitReleaseFund.ownerPhone,'-'),
  //         }
  //       ]
  //     }
  //     result = commitReleaseFundInfo
  //   }
  // }

}
//【二手房出租】track 成交分佣设置
export function renderSHRentCommitCommissionInfo(detailContent){
  let result = null;
  const commitCommission = parseTrackJSON(detailContent)
  if(!!commitCommission){
    let surplusAmount=null;
    try{
      surplusAmount=Number(commitCommission.commissionAmount)*(1-Number(commitCommission.platformCommissionRate));
    }catch(e){
      surplusAmount=null;
    }
    const formData=[
      {
        label:'成交佣金总额',
        value:`${isNull(commitCommission.commissionAmount,'-')}元`,
      },{
        label:'平台抽佣',
        value:isNullRate(commitCommission.platformCommissionRate,'-'),
      },{
        label:'交易服务费',
        value:`${isNull(commitCommission.serviceCharge,'-')}元`,
      },{
        label:'剩余佣金总额',
        value:`${isNull(surplusAmount,'-')}元`,
      },{
        label:'成交方式',
        value:isNull(commitCommission.transactionMode,'-'),
      },{
        label:'房东经纪人',
        value:`${isNullRate(commitCommission.brokerCommissionRate,'-')} ${isNull(commitCommission.brokerCommissionAmount,'-')}元`,
      },{
        label:'租客经纪人',
        value:`${isNullRate(commitCommission.customerBrokerCommissionRate,'-')} ${isNull(commitCommission.customerBrokerCommissionAmount,'-')}元`,
      }
    ]
    result = formData;
  }
  return result
}
//【二手房出租】track 佣金支付
export function renderSHRentCommissionOrder(detailContent){
  let result = null;
  const orderInfo = parseTrackJSON(detailContent)
  if(!!orderInfo){
    result = {
      orderNumber:isNull(orderInfo.orderNumber,'-'),
      payWay:isNull(orderInfo.paymentMethod,'-'),
      paySerialNumber:isNull(orderInfo.serialNumber,'-'),
      dealRentPrice:`${isNull(orderInfo.actualRent,'-')}元`,//
      customer:isNull(orderInfo.customerName,'-'),
      payTime:isNull(orderInfo.paymentDateTime,'-'),
      commissionDeductible:`${isNull(orderInfo.intentionAmount,'-')}元`,
      dealCommission:`${isNull(orderInfo.amount,'-')}元`,//
      payStatus:isNull(orderInfo.paymentStatus,'-'),
    }
  }
  return result
}
//【二手房出租】 track 意向金支付信息
export function renderSHRentIntentionMoneyRecordList(detailContent){
  let result = null;
  const auditList = parseTrackJSON(detailContent);
  if(!!auditList){
    // console.log('auditList',auditList);
    result = creatNHGroupBuyTimeLineData(auditList,'意向金支付信息');
  }
  return result;
}
//【二手房出租】 track 租房分期
export function renderSHRentRentingStage(detailContent){
  let result = null;
  const auditList = parseTrackJSON(detailContent);
  if(!!auditList){
    // console.log('auditList',auditList);
    result = creatNHGroupBuyTimeLineData(auditList,'租房分期');
  }
  return result;
}


//track 解析JSON
export function parseTrackJSON(str){
  let result = null;
  if(!!str){
    try {
      result = JSON.parse(str)
    } catch (e) {
      result = null;
    }
  }
  return result
}
//【新房团购退款】审核记录
export function renderNHGroupBuyRefundAuditList(auditList){
  const result = [];
  auditList.map(item=>{
    const recordItem = {
      date:isNull(item.date,''),
      type:'timeData',
      content:null,
      remarks:'',
      images:[],
    }
    const recordDetail = parseTrackJSON(item.content);
    if(!!recordDetail){
      recordItem.content = isNull(recordDetail.content,null)
      recordItem.remarks = isNull(recordDetail['结果'],'')
      recordItem.images = isNull(recordDetail['文件'],[])
    }
    result.push(recordItem);
  })
  return result;
}

//【成交分佣】成交分佣明细 新房二手房公用
export function renderCommitCommissionInfo(commitInfo,type){
  console.log('进入》》》》》》》》》》》');
  console.log(commitInfo,'commitInfo>>>>>>>>>>>>>>>>>>>>');
  let result = null;
  if(!!commitInfo){
    if(type === 'nh'){
      result = [
        {
          label:'佣金总额',
          value:`${isNull(commitInfo.totalCommission,'-')}元`,
        },
        // {
        //   label:'交易服务费',
        //   value:`${isNull(commitInfo.totalServiceCharge,'-')}元`,
        // },
        {
          label:'平台抽佣比例',
          value:isNullRate(commitInfo.platScale,'-'),
        },
        {
          label:'平台抽佣金额',
          value:`${isNull(commitInfo.platformMoney,'-')}元`,
        },
        {
          label:'剩余佣金金额',
          value:`${isNull(commitInfo.brokerMoney,'-')}元`,
        },
      ]
      const {customerBrokerInfo} = commitInfo;
      if(isNull(commitInfo.isHaveBroker,false)){
        console.log('进入，commitInfo.isHaveBroker');
        //有经纪人
        if(!!customerBrokerInfo){
          const {tutBroker} = customerBrokerInfo
          if(isNull(customerBrokerInfo.isTutor,false)){
            result.push({
              label:'经纪人导师',
              value:`${isNullRate(tutBroker.tutScale,'-')} ${isNull(tutBroker.tutorMoney,'-')}元`
            })
            result.push({
              label:'经纪人',
              value:`${isNull(customerBrokerInfo.brokerName,'-')} ${isNullRate(tutBroker.brokerScale,'-')} ${isNull(tutBroker.brokerMoney,'-')}元 ${isNull(customerBrokerInfo.brokerMoneyAddress,'-')}`,
            })
          }
          else{
            //房源经纪人 没有导师
            result.push({
              label:'经纪人',
              value:`${isNull(customerBrokerInfo.brokerName,'-')} ${isNull(customerBrokerInfo.brokerMoney,'-')}元 ${isNull(customerBrokerInfo.brokerMoneyAddress,'-')}`,
            })
          }
        }
      }else{
        //没有经纪人
        result.push({
          label:'交易中心',
          value:` ${isNull(commitInfo.brokerMoney,'-')}元`,
        })
      }
    }
    else{
      result = [
        {
          label:'佣金总额',
          value:`${isNull(commitInfo.totalCommission,'-')}元`,
        },
        {
          label:'交易服务费',
          value:`${isNull(commitInfo.totalServiceCharge,'0')}元`,
        },
        {
          label:'平台抽佣比例',
          value:isNullRate(commitInfo.platScale,'-'),
        },
        {
          label:'平台抽佣金额',
          value:`${isNull(commitInfo.platformMoney,'-')}元`,
        },
        {
          label:'剩余佣金金额',
          value:`${isNull(commitInfo.brokerMoney,'-')}元`,
        },
      ]
      const {houseBrokerInfo,customerBrokerInfo} = commitInfo;
      if(isNull(commitInfo.tradeType,'') === '合作成交'){
        //合作成交
        result.push({
          label:'成交方式',
          value:'合作成交',
        })
        if(isNull(commitInfo.isFixationMoney,false)){
          //固定金额

          //房源经纪人
          if(!!houseBrokerInfo){
            if(isNull(houseBrokerInfo.isTutor,false)){
              //房源经纪人 有导师
              const {tutBroker} = houseBrokerInfo
              //确保导师信息有效
              if(!!tutBroker){
                //房源经纪人部分
                result.push({
                  label:'房源分佣金额',
                  value:`${isNull(houseBrokerInfo.brokerMoney,'-')}元`,
                })
                result.push({
                  label:'房源经纪人导师',
                  value:`${isNullRate(tutBroker.tutScale,'-')} ${isNull(tutBroker.tutorMoney,'-')}元`
                })
                result.push({
                  label:'房源经纪人',
                  value:`${isNull(houseBrokerInfo.brokerName,'-')} ${isNullRate(tutBroker.brokerScale,'-')} ${isNull(tutBroker.brokerMoney,'-')}元 ${isNull(houseBrokerInfo.brokerMoneyAddress,'-')}`,
                })
              }
            }
            else{
              //房源经纪人 没有导师
              result.push({
                label:'房源经纪人',
                value:`${isNull(houseBrokerInfo.brokerName,'-')} ${isNull(houseBrokerInfo.brokerMoney,'-')}元 ${isNull(houseBrokerInfo.brokerMoneyAddress,'-')}`,
              })
            }
          }
          //客源经纪人
          if(!!customerBrokerInfo){
            if(isNull(customerBrokerInfo.isTutor,false)){
              //客源经纪人 有导师
              const {tutBroker} = customerBrokerInfo
              if(!!tutBroker){
                //导师信息有效
                result.push({
                  label:'客源分佣金额',
                  value:`${isNull(customerBrokerInfo.brokerMoney,'-')}元`,
                })
                result.push({
                  label:'客源经纪人导师',
                  value:`${isNullRate(tutBroker.tutScale,'-')} ${isNull(tutBroker.tutorMoney,'-')}元`
                })
                result.push({
                  label:'客源经纪人',
                  value:`${isNull(customerBrokerInfo.brokerName,'-')} ${isNullRate(tutBroker.brokerScale,'-')} ${isNull(tutBroker.brokerMoney,'-')}元 ${isNull(customerBrokerInfo.brokerMoneyAddress,'-')}`,
                })
              }
            }
            else{
              //房源经纪人 没有导师
              result.push({
                label:'客源经纪人',
                value:`${isNull(customerBrokerInfo.brokerName,'-')} ${isNull(customerBrokerInfo.brokerMoney,'-')}元 ${isNull(customerBrokerInfo.brokerMoneyAddress,'-')}`,
              })
            }
          }
        }
        else{
          //比例分配

          //房源经纪人导师判断
          if(!!houseBrokerInfo){
            if(isNull(houseBrokerInfo.isTutor,false)){
              //房源经纪人 有导师
                //房源经纪人部分
              const {tutBroker} = houseBrokerInfo
              if(!!tutBroker){
                //确保导师信息存在
                result.push({
                  label:'房源分佣',
                  value:`${isNullRate(houseBrokerInfo.brokerScale,'-')} ${isNull(houseBrokerInfo.brokerMoney,'-')}元`,
                })
                result.push({
                  label:'房源经纪人导师',
                  value:`${isNullRate(tutBroker.tutScale,'-')} ${isNull(tutBroker.tutorMoney,'-')}元`
                })
                result.push({
                  label:'房源经纪人',
                  value:`${isNull(houseBrokerInfo.brokerName,'-')} ${isNullRate(tutBroker.brokerScale,'-')} ${isNull(tutBroker.brokerMoney,'-')}元 ${isNull(houseBrokerInfo.brokerMoneyAddress,'-')}`,
                })
              }
            }
            else{
              //房源经纪人 没有导师
              result.push({
                label:'房源经纪人',
                value:`${isNull(houseBrokerInfo.brokerName,'-')}
                ${isNullRate(houseBrokerInfo.brokerScale,'-')} ${isNull(houseBrokerInfo.brokerMoney)}元 ${isNull(houseBrokerInfo.brokerMoneyAddress,'-')}`,
              })
            }
          }
          //客源经纪人导师判断
          if(!!customerBrokerInfo){
            if(isNull(customerBrokerInfo.isTutor,false)){
              //客源经纪人 有导师
              const {tutBroker} = customerBrokerInfo
              if(!!tutBroker){
                //确保导师信息存在
                result.push({
                  label:'客源分佣',
                  value:`${isNullRate(customerBrokerInfo.brokerScale,'-')} ${isNull(customerBrokerInfo.brokerMoney,'-')}元`,
                })
                result.push({
                  label:'客源经纪人导师',
                  value:`${isNullRate(tutBroker.tutScale,'-')} ${isNull(tutBroker.tutorMoney,'-')}元`
                })
                result.push({
                  label:'客源经纪人',
                  value:`${isNull(customerBrokerInfo.brokerName,'-')} ${isNullRate(tutBroker.brokerScale,'-')} ${isNull(tutBroker.brokerMoney,'-')}元 ${isNull(customerBrokerInfo.brokerMoneyAddress,'-')}`,
                })
              }
            }
            else{
              //客源经纪人 没有导师
              result.push({
                label:'客源经纪人',
                value:`${isNull(customerBrokerInfo.brokerName,'-')}
                ${isNullRate(customerBrokerInfo.brokerScale,'-')} ${isNull(customerBrokerInfo.brokerMoney)}元 ${isNull(customerBrokerInfo.brokerMoneyAddress,'-')}`,
              })
            }
          }

        }
      }
      else{
        //自有客户
        result.push({
          label:'成交方式',
          value:'自有客户',
        })
        if(!!houseBrokerInfo){
          //只有房源经纪人
          if(isNull(houseBrokerInfo.isTutor,false)){
            //有导师
            const {tutBroker} = houseBrokerInfo
            result.push({
              label:'房源分佣',
              value:`${isNullRate(commitInfo.brokerScale,'-')} ${isNull(houseBrokerInfo.brokerMoney,'-')}元`,
            })
            result.push({
              label:'经纪人导师',
              value:`${isNullRate(tutBroker.tutScale,'-')} ${isNull(tutBroker.tutorMoney,'-')}元`
            })
            result.push({
              label:'经纪人',
              value:`${isNull(houseBrokerInfo.brokerName,'-')} ${isNullRate(tutBroker.brokerScale,'-')} ${isNull(tutBroker.brokerMoney,'-')}元 ${isNull(houseBrokerInfo.brokerMoneyAddress,'-')}`,
            })
          }else{
            //没有导师
            result.push({
              label:'经纪人',
              value:`${isNull(houseBrokerInfo.brokerName,'-')} ${isNull(commitInfo.brokerMoney,'-')}元 ${isNull(houseBrokerInfo.brokerMoneyAddress,'-')}`,
            })
          }
        }
      }
    }
  }
  return result
}

//避免响应的值无效引起前端业务结构报错
//传入服务器值，和无效后的默认值
export function judgeResponse(response,defaultValue){
  if(response===undefined || response===null){
    if(window.navigator.userAgent.indexOf("Chrome") && window.chrome){
      console.log(`%c 服务器返回值-${response}无效!`, 'font-size:14pt;color:orange')
    }
    return defaultValue;
  }else{
    return response;
  }
}
export function isValid(value){
  if(value===0){
    return true;
  }else if(value===false){
    return true;
  }else{
    if(!!value){
      return true;
    }else{
      return false;
    }
  }
}
//避免响应的值无效引起前端业务结构报错
//传入服务器值，和无效后的默认值
export function isNull(response,defaultValue,name){
  if(response===0){
    return response;
  }else{
    if(!!response){
      return response;
    }else{
      // if(window.navigator.userAgent.indexOf("Chrome") && window.chrome){
      //   console.log(`%c 服务器返回值-${name}无效!`, 'font-size:14pt;color:orange')
      // }
      return defaultValue;
    }
  }
}

//判断比例
export function isNullRate(response,defaultValue,rateLen){
  if(response===0){
    return response;
  }else{
    if(!!response){
      if(String(response).includes('%')){
        return response;
      }
      // else if(response>1){
      //   //大于1
      //   return `${response}%`
      // }
      else{

        let rateNum = accMul(response,100);
        if(isNull(rateLen,false)){
          return `${rateNum.toFixed(rateLen)}%`
        }else{
          return `${handleNumWithPointZero(rateNum)}%`
        }
      }
    }else{
      // if(window.navigator.userAgent.indexOf("Chrome") && window.chrome){
      //   console.log(`%c 服务器返回值-${name}无效!`, 'font-size:14pt;color:orange')
      // }
      return defaultValue;
    }
  }
}
//传入对象 key数组 取最后一位的值
export function getKeysValue(obj,keys,defaultValue){
  if(!isNull(obj,true)){
    return defaultValue;
  }else{
    let targetObj=obj;
    let result=null;
    for(let i=0;i<keys.length;i++){
      if(targetObj===null){
        i=keys.length;
      }else{
        if(i===keys.length-1){
          result=isNull(targetObj[keys[i]],null);
        }else{
          targetObj=isNull(targetObj[keys[i]],null);
        }
      }
    }
    return result
  }
}
// //组装数组返回对应对象
// export function splitArray(arr,agrs,kes){
//   let resultObj=null;
//   if(arr.length===0){
//     agrs.map(item=>{
//       resultObj[item]=[];
//     })
//   }else{
//     arr
//   }
//   return resultObj;
// }
//依据房源信息JSON组装房源数据
export function creatHouseInfo(str){
  if(!!str && JSON.parse(str)){
    const houseObj=JSON.parse(str);
    // let houseInfoArr=[
    //   !!houseObj.communityName?houseObj.communityName:'',
    //   !!houseObj.buildingName?`${houseObj.buildingName}号楼`:'——',
    //   !!houseObj.unitNumber?`${houseObj.unitNumber}单元`:'——',
    //   !!houseObj.houseNumber?`${houseObj.houseNumber}号`:'——',
    // ];
    // return houseInfoArr.join('/');
    if(!!houseObj.default){
      return houseObj.default
    }else{
      return '——'
    }
  }else{
    return '——';
  }
}
//取JSON Object 中某字段的值 无值返回null
export function getJSONValue(json,key){
  let value=null;
  try{
    value=JSON.parse(json)[key];
  }catch(e){
    value=null;
  }finally{
    // console.log(value,'>>>>>>>value');
    return value;
  }
}
/*
判断JSON字符串能否被转译，
能===>转译
不能==>null
*/

export function transJSONString(jsonStr){
  let value=null;
  try{
    value=JSON.parse(jsonStr);
  }catch(e){
    value=null;
  }finally{
    return value;
  }
}
//判断对象下的深子级值是否有效
// export function objectValueValid(obj,agr){
//   agr.map()
// }

export const pathMap=new Map([
  ['',{title:'首页',path:''}],
  // ['index',{title:'首页',path:'index'}],
  ['tradeManagement',{title:'交易管理',path:'tradeManagement'}],
  ['newHouseTrade',{title:'新房交易',path:'newHouseTrade'}],
  ['projectDetails',{title:'项目详情',path:'projectDetails'}],
  ['creatClient',{title:'录客户',path:'creatClient'}],
  ['creatGroupBuy',{title:'录团购',path:'creatGroupBuy'}],
  ['creatTransactions',{title:'录成交',path:'creatTransactions'}],
  ['customerDoLook',{title:'客户确看',path:'customerDoLook'}],
  ['doLookDetails',{title:'确看详情',path:'doLookDetails'}],//后删
  ['groupBuyDetails',{title:'团购详情',path:'groupBuyDetails'}],//后删
  ['uploadGroupBuyAgreement',{title:'上传团购协议',path:'uploadGroupBuyAgreement'}],//后删
  // ['inventoryControl',{title:'团购详情',path:'inventoryControl'}],//后删
  ['newHouseTradeInfoDetails',{title:'新房交易详情',path:'newHouseTradeInfoDetails'}],//后删
  ['housesManagement',{title:'销控表管理',path:'housesManagement'}],//后删
  ['dealDetails',{title:'交易详情',path:'dealDetails'}],
]);


export function checkJSONArray(jsonArr){
  if(typeof(jsonArr)==='string'){
    let result=null;
    try{
      result=JSON.parse(jsonArr);
    }catch(e){
      result=null;
    }
    return result;
  }else{
    return jsonArr;
  }
}
export function parseJSONArray(jsonArr){
  if(!!jsonArr){
    let result=[];
    try{
      result=JSON.parse(jsonArr)
    }catch(e){
      result=[];
    }finally{
      return result;
    }
  }else{
    return [];
  }




  if(typeof(jsonArr)==='string'){
    let result=null;
    try{
      result=JSON.parse(jsonArr);
    }catch(e){
      result=null;
    }
    return result;
  }else{
    return jsonArr;
  }
}


//判断对象中某个数值是否有效
export function checkNum(obj,index){
  let result=false;
  try{
    if(obj[index]>0){
      result=true;
    }
  }catch(e){
    result=false;
  }
  return result;
}
//判断JSON格式数据是否有效，如有则直接解析
export function checkJSON(json){
  let jsonObj=null;
  try{
    jsonObj=JSON.parse(json);
  }catch(e) {
    jsonObj=false;
  }
  return jsonObj
}

//二手房 类时间轴JSON装换格式
export function creatSHTimeLineData(jsonArr,formDataType){
  let resultArr=null;
  try{
    resultArr=JSON.parse(jsonArr);
  }catch(e){
    return null;
  }
  if(!!resultArr){
    const timeArr=resultArr.map(item=>{
      let content=null;
      try{
        content=JSON.parse(item.content);
      }catch(e){
        return {
          date:isNull(item.date,''),
          content:'',
        }
      }
      if(!!content){
        if(content.detailContentType==='JSONObject'){
          return{
            date:isNull(item.date,''),
            type:'formData',
            content:isNull(content,null),
            images:checkJSONArray(isNull(content.imgs,[])),
            formDataType,
          }
        }
        else if(content.detailContentType==='TimeLine'){
          return{
            date:isNull(item.date,''),
            type:'timeData',
            content:isNull(content.desc,null),
            remarks:isNull(content.memo,null),
            images:checkJSONArray(isNull(content.imgs,[])),
          }
        }
      }
    })
    return timeArr;
  }
}
//新房专用 房屋成交信息
export function creatNHTimeLineData(jsonArr,formDataType){
  let resultArr=null;
  try{
    resultArr=JSON.parse(jsonArr);
  }catch(e){
    return null;
  }
  if(!!resultArr){
    const timeArr=resultArr.map(item=>{
      let content=null;
      try{
        content=JSON.parse(item.content);
      }catch(e){
        return {
          date:isNull(item.date,''),
          content:'',
        }
      }
      if(!!content){
        if(content.detailContentType==='JSONObject'){
          return{
            date:isNull(item.date,''),
            type:'formData',
            content:isNull(content,null),
            desc:isNull(content.desc,null),
            memo:isNull(content.memo,null),
            images:checkJSONArray(isNull(content.imgs,[])),
            formDataType,
          }
        }
        else if(content.detailContentType==='TimeLine'){
          return{
            date:isNull(item.date,''),
            type:'timeData',
            content:isNull(content.desc,null),
            remarks:isNull(content.memo,null),
            images:checkJSONArray(isNull(content.imgs,[])),
          }
        }
      }
    })
    return timeArr;
  }
}
// //二手房出售成交第三方执行分佣后track数据
// if(content.title==='佣金分配明细'){
//
// }
export function creatNHGroupBuyTimeLineData(jsonArr,formDataType){
  console.log('第一步，‘》》》》》》》》》》》》jsonArr’',formDataType,jsonArr);
  let resultArr=jsonArr;
  // try{
  //   resultArr=JSON.parse(jsonArr);
  // }catch(e){
  //   return null;
  // }
  // console.log('resultArrresultArrresultArr','resultArrresultArrresultArr>>>');
  if(!!resultArr){
    const timeArr=resultArr.map(item=>{
      let content=null;
      try{
        content=JSON.parse(item.content);
      }catch(e){
        return {
          date:isNull(item.date,''),
          content:'',
        }
      }
      if(!!content){
        // console.log(content,'contentcontent');
        let orderObj;
        if(!!content.order){
          try{
            orderObj=JSON.parse(content.order);
          }catch(e){
            orderObj=null;
          }
        }
        // console.log(orderObj,'orderObj>>>');
        let ownerObj;
        if(!!content.owner){
          try{
            orderObj=JSON.parse(content.owner);
          }catch(e){
            ownerObj=null;
          }
        }
        if(content.detailContentType==='JSONObject'){
          return{
            date:isNull(item.date,''),
            type:'formData',
            content:isNull(content,null),
            images:checkJSONArray(isNull(content.imgs,[])),
            formDataType,
          }
        }
        else if(content.detailContentType==='TimeLine'){
          // console.log('...........................>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
          return{
            date:isNull(item.date,''),
            type:'timeData',
            content:isNull(content.desc,null),
            remarks:isNull(content.memo,null),
            refund:isNull(content.refund,null),
            customerCommit:isNull(content.customerCommit,null),
            images:checkJSONArray(isNull(content.imgs,[])),
            orderObj:orderObj,
            ownerObj:ownerObj,
            formDataType:formDataType,
          }
        }
      }
    })
    return timeArr;
  }
}
/******** 构建行政区划选择数据结构 ********/

export function creatZoningData(a){
    this.map=new Map();
    this.tree=a||[];
    this.groups={};
};
creatZoningData.prototype={
  init:function(parentKey){
      this.group();
      const result={
        treeArr:this.getDom(this.groups[parentKey]),
        treeMap:this.map
      }
      return result;
  },
  group:function(){
      for(var i=0;i<this.tree.length;i++){
          if(this.groups[this.tree[i].pCode]){
              this.groups[this.tree[i].pCode].push(this.tree[i]);
          }else{
              this.groups[this.tree[i].pCode]=[];
              this.groups[this.tree[i].pCode].push(this.tree[i]);
          }
      }
  },
  getDom:function(a){
      if(!a){return []}
      var html=[];
      for(var i=0;i<a.length;i++){
          const item=Object.assign({},a[i],{
            children:this.getDom(this.groups[a[i].code]),
            value:a[i].lable,
            label:a[i].lable,
          })
          html.push(item);
          this.map.set(a[i].code,item)
      };
      return html;
  }
};
/*************************  从sessionStorage中取出行政区划数据   *******************************/
export function getAllProvinceAndCityArrFromSession(){
  let selectProvinceCityOpts;
  try {
    selectProvinceCityOpts=JSON.parse(sessionStorage.getItem('all_province_city')).arr;
  } catch (e) {
    selectProvinceCityOpts=[];
  } finally {
    return selectProvinceCityOpts
  }
}



//
/*******************  储存交易中心及选择的新房项目信息  *********************
*localStorage
*
*/
export function setCenterProjectInfo(centerCode){
  //判断localStorage中是否有该交易中心的储存信息
  if(!localStorage.getItem(centerCode)){
    const centerInfo={
      projectId:null,
      projectName:null,
    }
    localStorage.setItem(centerCode,JSON.stringify(centerInfo));
  }
  //在sessionStorage中储存当前的交易中心code
  sessionStorage.setItem('tradeCenter',centerCode);
}
/*******************  提取储存的新房项目信息  *********************
*localStorage
*
*/
export function getProjectInfoInStorage(){
  let projectObj={
    projectId:null,
    projectName:null,
  };
  try {
    const centerCode=sessionStorage.getItem('tradeCenter');
    const projectInfoObj=JSON.parse(localStorage.getItem(centerCode));
    projectObj.projectId = projectInfoObj.projectId;
    projectObj.projectName = projectInfoObj.projectName;
  } catch (e) {
    projectObj={
      projectId:null,
      projectName:null,
    };
  } finally {
    return projectObj;
  }
}
/*******************  储存新房项目信息  *********************
*localStorage
*
*/
export function setProjectInfoInStorage(projectId,projectName){
  const centerCode=sessionStorage.getItem('tradeCenter');
  const projectInfo={
    projectId,
    projectName,
  }
  localStorage.setItem(centerCode,JSON.stringify(projectInfo));
}
/*******************  清空新房项目信息  *********************
*localStorage
*
*/
export function clearProjectInfoInStorage(){
  const centerCode=sessionStorage.getItem('tradeCenter');
  localStorage.removeItem(centerCode);
}

/************     二手房退款，收款方：业主，applyInfo=>Obj      **************/
export function buildRefundOwnerInfo(applyInfo,type='obj'){
  if(type==='obj'){
    if(applyInfo.returnedToOwner){
      const result={
        ownerName:isNull(applyInfo.ownerName,'-'),
        ownerPhone:isNull(applyInfo.ownerPhone,'-'),
        ownerBank:isNull(applyInfo.ownerBank,'-'),
        ownerSubbranch:isNull(applyInfo.ownerSubbranch,'-'),
        ownercardNumber:isNull(applyInfo.ownercardNumber,'-'),
        bankProvinceCity:`${isNull(applyInfo.ownerBankProvince,'-')}/${isNull(applyInfo.ownerBankCity,'-')}`,
      }
      return result;
    }else{
      return null;
    }
  }
  else if (type==='arr') {
    if(applyInfo.returnedToOwner){
      const result=[
        {
          label:'业主姓名',
          value:isNull(applyInfo.ownerName,'-'),
        },{
          label:'业主手机号',
          value:isNull(applyInfo.ownerPhone,'-'),
        },{
          label:'业主开户行',
          value:isNull(applyInfo.ownerPhone,'-'),
        },{
          label:'业主开户行支行',
          value:isNull(applyInfo.ownerSubbranch,'-'),
        },{
          label:'业主银行卡卡号',
          value:isNull(applyInfo.ownercardNumber,'-'),
        },{
          label:'开户行所属省市',
          value:`${isNull(applyInfo.ownerBankProvince,'-')}/${isNull(applyInfo.ownerBankCity,'-')}`,
        }
      ];
      return result;
    }else{
      return null;
    }
  }
}

//判断审核状态
//传入auditStatus
export function renderAuditStatus(type,auditStatus,role){
  console.log('type',type);
  console.log('auditStatus',auditStatus);
  let result=null;
  if(!!type && !!auditStatus){
    if(type==='commons'){//普通退款审核
      if(auditStatus === '已撤回申请'){
        result={
          current:1,
          status:'wait',
          canAudit:false,
          canRevoke:false,
        }
      }else if(auditStatus==='等待退款审核'){
        result={
          current:1,
          status:'wait',
          canAudit:isNull(role,'')==='contract',
          canRevoke:true,
        }
      }
      else if(auditStatus==='退款审核通过'){
        result={
          current:1,
          status:'success',
          canAudit:isNull(role,'')==='contract',
          canRevoke:false,
        }
      }
      else if(auditStatus==='退款申请驳回'){
        result={
          current:1,
          status:'error',
          canAudit:isNull(role,'')==='end',
          canRevoke:false,
        }
      }
      else if(auditStatus==='等待财务审核'){
        result={
          current:2,
          status:'wait',
          canAudit:isNull(role,'')==='finance',
          canRevoke:false,
        }
      }
      else if(auditStatus==='财务审核驳回'){
        result={
          current:2,
          status:'error',
          canAudit:isNull(role,'')==='contract',
          canRevoke:false,
        }
      }
      else if(auditStatus==='财务审核通过'){
        result={
          current:2,
          status:'success',
          canAudit:isNull(role,'')==='end',
          canRevoke:false,
        }
      }
      else if(auditStatus==='已执行退款'){
        result={
          current:4,
          status:'success',
          canAudit:isNull(role,'')==='end',
          canRevoke:false,
        }
      }
    }
    else if(type==='commit'){//成交审核
      if(auditStatus === '已撤回申请'){
        result={
          current:1,
          status:'wait',
          canAudit:false,
          canRevoke:false,
          canReApply:true,
        }
      }else if(auditStatus==='等待成交审核'){
        result={
          current:1,
          status:'wait',
          canAudit:isNull(role,'')==='contract',
          canRevoke:true,
          canReApply:false,
        }
      }
      else if(auditStatus==='成交审核通过'){
        result={
          current:1,
          status:'success',
          canAudit:isNull(role,'')==='contract',
          canRevoke:false,
          canReApply:false,
        }
      }
      else if(auditStatus==='成交申请驳回'){
        result={
          current:1,
          status:'error',
          canAudit:isNull(role,'')==='end',
          canRevoke:false,
          canReApply:true,
        }
      }
      else if(auditStatus==='等待财务审核'){
        result={
          current:2,
          status:'wait',
          canAudit:isNull(role,'')==='finance',
          canRevoke:false,
          canReApply:false,
        }
      }
      else if(auditStatus==='财务审核驳回'){
        result={
          current:2,
          status:'error',
          canAudit:isNull(role,'')==='contract',
          canRevoke:false,
          canReApply:true,
        }
      }
      else if(auditStatus==='财务审核通过'){
        result={
          current:2,
          status:'success',
          canAudit:isNull(role,'')==='end',
          canRevoke:false,
          canReApply:false,
        }
      }
      else if(auditStatus==='待分佣'){
        result={
          current:3,
          status:'wait',
          canAudit:isNull(role,'')==='end',
          canRevoke:false,
          canReApply:false,
        }
      }
      else if(auditStatus==='已分佣'){
        result={
          current:3,
          status:'finish',
          canAudit:isNull(role,'')==='end',
          canRevoke:false,
          canReApply:false,
        }
      }
    }
    else if(type==='sellLoan'){//出售贷款
      if(auditStatus === '已撤回申请'){
        result={
          current:1,
          status:'wait',
          canAudit:false,
          canRevoke:false,
        }
      }else if(auditStatus==='等待受理'){
        result={
          current:1,
          status:'wait',
          canAudit:isNull(role,'')==='handle',
          canRevoke:true,
        }
      }
      else if(auditStatus==='贷款申请已受理'){
        result={
          current:1,
          status:'success',
          canAudit:isNull(role,'')==='approval',
          canRevoke:false,
        }
      }
      else if(auditStatus==='贷款申请驳回'){
        result={
          current:1,
          status:'error',
          canAudit:isNull(role,'')==='end',
          canRevoke:false,
        }
      }
      else if(auditStatus==='等待批款'){
        result={
          current:2,
          status:'wait',
          canAudit:isNull(role,'')==='approval',
          canRevoke:false,
        }
      }
      else if(auditStatus==='批款驳回'){
        result={
          current:2,
          status:'error',
          canAudit:isNull(role,'')==='approval',
          canRevoke:false,
        }
      }
      else if(auditStatus==='已批款'){
        result={
          current:2,
          status:'success',
          canAudit:isNull(role,'')==='end',
          canRevoke:false,
        }
      }
    }
    else if(type==='relieveLoan'){//出售解押
      if(auditStatus === '已撤回申请'){
        result={
          current:1,
          status:'wait',
          canAudit:false,
          canRevoke:false,
        }
      }else if(auditStatus==='等待受理'){
        result={
          current:1,
          status:'wait',
          canAudit:isNull(role,'')==='handle',
          canRevoke:true,
        }
      }
      else if(auditStatus==='解押申请已受理'){
        result={
          current:1,
          status:'success',
          canAudit:isNull(role,'')==='approval',
          canRevoke:false,
        }
      }
      else if(auditStatus==='解押申请驳回'){
        result={
          current:1,
          status:'error',
          canAudit:isNull(role,'')==='end',
          canRevoke:false,
        }
      }
      else if(auditStatus==='等待批款'){
        result={
          current:2,
          status:'wait',
          canAudit:isNull(role,'')==='approval',
          canRevoke:false,
        }
      }
      else if(auditStatus==='解押驳回'){
        result={
          current:2,
          status:'error',
          canAudit:isNull(role,'')==='approval',
          canRevoke:false,
        }
      }
      else if(auditStatus==='已批款'){
        result={
          current:2,
          status:'success',
          canAudit:isNull(role,'')==='end',
          canRevoke:false,
        }
      }
    }
  }
  return result;
}
//二手房审核 请求体组装
export function renderSHAduitRequestAgr({todo,auditor,images,optPassword,reason}){
  const result={
    images,
    oprationPwd:isNull(optPassword,'null'),
    reason,
  }
  if(todo==='pass' && !!auditor){
    result.toUserId=auditor.key;
    result.toUserName=auditor.label;
  }
  return result
}
//检查字符串是否可以转译
export function checkStringIsJSON(str){
  let result=true;
  let resultStr=null;
  try {
    resultStr=JSON.parse(str)
  } catch (e) {
    result=false;
  } finally {
    return result
  }
}

//新房成交 生成审核详情
export function creatNHCommitAuditInfoData(tradeData,role){
  const result = {
    auditStatus:{
      status:'process',
      current:0,
      stepList:[
        {
          title:'申请成交'
        },{
          title:'成交审核'
        },{
          title:'财务审核'
        },{
          title:'执行分佣'
        }
      ]
    },
    orderData:null,
    commissionInfos:null,
    applyInfo:null,
    contractAuditInfo:null,
    financialAuditInfo:null,
    auditRecord:null,
    canRevoke:false,
    canAudit:false,
    canReApply:false,
  }
  //判断审核状态
  const {auditStatus}=tradeData;
  console.log('auditStatus',auditStatus);
  if(auditStatus === '待审核'){
    result.auditStatus.current = 1;
    result.auditStatus.status = 'wait';
    result.canRevoke = (!!role && role === 'applyer');
    result.canAudit = (!!role && role === 'contracter');
  }
  else if(auditStatus === '业务审核拒绝'){
    result.auditStatus.current = 1;
    result.auditStatus.status = 'error';
    result.auditStatus.stepList[1]={
      title:'成交审核',
      description:'已驳回',
    };
    result.canReApply = (!!role && role === 'applyer');
  }
  else if(auditStatus === '业务审核通过'){
    result.auditStatus.current = 2;
    result.auditStatus.status = 'wait';
    result.canAudit = (!!role && role === 'financialer');
  }
  else if(auditStatus === '财务审核拒绝'){
    result.auditStatus.current = 2;
    result.auditStatus.status = 'error';
    result.auditStatus.stepList[2]={
      title:'财务审核',
      description:'已驳回',
    };
    result.canReApply = (!!role && role === 'applyer');
  }
  else if(auditStatus === '待分佣'){
    result.auditStatus.current = 3;
    result.auditStatus.status = 'wait';
  }
  else if(auditStatus === '已分佣'){
    result.auditStatus.current = 3;
    result.auditStatus.status = 'finish';
  }

  //生成订单信息
  result.orderData = {
    key:isNull(tradeData.id,'-'),
    project:isNull(tradeData.projectName,'-'),
    propertyType:isNull(tradeData.propertyType,'-'),
    intentionHouse:isNull(tradeData.houseName,'-'),
    groupBuyType:isNull(tradeData.discountName,'-'),
    unitPrice:`${isNull(tradeData.unitPrice,'')}元`,
    totalPrice:renderTotalMoneyStr(tradeData.totalPrice,''),
    commission:`${isNull(tradeData.brokerage,'-')}元`,
    agent:isNull(tradeData.brokerName,'-'),
    time:isNull(tradeData.createTime,'-'),
    groupKey:isNull(tradeData.groupKey,null),
  }

  //生成佣金信息
  result.commissionInfos = [
    {
      label:'成交方式',
      value:isNull(tradeData.commitType,'-'),
    },
    {
      label:'佣金总额',
      value:`${isNull(tradeData.brokerage,'')}元`,
    },
    {
      label:'平台抽佣',
      value:`${isNull(tradeData.commissionRate,0)*100}%`,
    },
    {
      label:'剩余佣金总额',
      value:`${isNull(tradeData.residualCommission,'')}元`,
    },
    {
      label:'佣金分配金额',
      value:`${isNull(tradeData.commissionAmount,'')}元`,
    },
  ]

  //生成申请信息
  result.applyInfo={
    reason:isNull(tradeData.dealAuditDesc),
    applyPics:null,
  }
  try {
    result.applyInfo.applyPics = JSON.parse(tradeData.dealAttachments).map((item,index)=>({
      title:'',
      src:item,
      id:`PicKey_${index}`
    }))
  } catch (e) {
    result.applyInfo.applyPics = null;
  }

  //审核record
  result.auditRecord = [];
  if(!!tradeData.auditData){
    result.auditRecord = tradeData.listTimeData.map(item=>({
      time:isNull(item.time,'-'),
      content:isNull(item.aduitAutoDesc,'-'),
      remarks:`说明：${isNull(item.auditDesc,'-')}`,
      pics:parseTrackJSON(item.attachments),
      isReject:!isNull(item.isSuccess,true),
    }))
  }






  // //审核record 纯文字
  // result.auditRecord = [];
  // try {
  //   const auditArr = JSON.parse(tradeData.detailEntity.detailContent);
  //   auditArr.map(item=>{
  //     if(checkStringIsJSON(item.content)){
  //       const commissionInfo = parseTrackJSON(item.content)
  //       if(!!commissionInfo){
  //         const commissionArr = renderCommitCommissionInfo(commissionInfo,'nh');
  //         let commissionStr = '';
  //         commissionArr.map(item=>{
  //           commissionStr += `${item.label}：${item.value}，`
  //         })
  //         result.auditRecord.push(`${isNull(item.date,'-')} ${commissionStr}`)
  //       }
  //
  //     }else{
  //       result.auditRecord.push(`${isNull(item.date,'-')} ${isNull(item.content,'-')}`)
  //     }
  //   })
  // } catch (e) {
  //   result.auditRecord = [];
  // } finally {
  //
  // }

  // //合同审核记录
  // if(!!tradeData.dealAuditResultFile || !!tradeData.dealAuditResultDesc){
  //   result.contractAuditInfo = {
  //     reason:isNull(tradeData.dealAuditResultDesc,'-'),
  //     pics:[],
  //   }
  //   try {
  //     result.contractAuditInfo.pics = JSON.parse(tradeData.dealAuditResultFile).map((item,index)=>({
  //       title:'',
  //       src:item,
  //       id:`PicKey_${index}`
  //     }))
  //   } catch (e) {
  //     result.contractAuditInfo.pics = [];
  //   }
  // }
  //
  //
  // //财务审核记录
  // if(!!tradeData.financialAuditResultFile || !!tradeData.financialAuditResultDesc){
  //   result.financialAuditInfo = {
  //     reason:isNull(tradeData.financialAuditResultDesc,'-'),
  //     pics:[],
  //   }
  //   try {
  //     result.financialAuditInfo.pics = JSON.parse(tradeData.financialAuditResultFile).map((item,index)=>({
  //       title:'',
  //       src:item,
  //       id:`PicKey_${index}`
  //     }))
  //   } catch (e) {
  //     result.financialAuditInfo.pics = [];
  //   }
  // }


  return result;
}


//从数组中获取每个子对象的某个字段的值并返回这些值的数组
export function getArrayObjectValue(arr,key){
  return arr.map(item=>item[key])
}
/*********************  【权限数组】  *********************/
//注入sessionStorage >>jurisdictionArr
export function setJurisdictionArr(arr){
  // if(typeof arr === 'boolean'){
  //   if(!window.anzhuApp){
  //     window.anzhuApp = {
  //       'qx':new Set(['tradeCenter']),
  //     }
  //   }else{
  //     window.anzhuApp={
  //       'qx':new Set(['tradeCenter']),
  //     }
  //   }
  // }else{
  //   if(!window.anzhuApp){
  //     window.anzhuApp = {
  //       'qx':new Set(arr),
  //     }
  //   }else{
  //     window.anzhuApp={
  //       'qx':new Set(arr),
  //     }
  //   }
  // }
  // if(!!sessionStorage.getItem('jurisdictionArr')){
  //   sessionStorage.removeItem('jurisdictionArr');
  // }
  // if(typeof arr === 'boolean'){
  //   sessionStorage.setItem('jurisdictionArr',JSON.stringify(['tradeCenter']));
  // }else{
  //   sessionStorage.setItem('jurisdictionArr',JSON.stringify(arr));
  // }
  sessionStorage.setItem('jurisdictionArr',JSON.stringify(arr));
}
//读取sessionStorage >>jurisdictionArr
export function getJurisdictionArr(){
  if(!!sessionStorage.getItem('jurisdictionArr')){
    return sessionStorage.getItem('jurisdictionArr');
  }else{
    return [];
  }
}
//清空 权限
export function clearJurisdictionArr(){
  sessionStorage.removeItem('jurisdictionArr');
}
//权限判断 传入目标权限 判断是否具有该权限 返回布尔值
export function judgeJurisdiction(code){
  // console.log('code',code);
  // console.log('window.app',window.app);
  // if(!!code){
  //   if(!!window.anzhuApp && !!window.anzhuApp.qx){
  //     if(window.anzhuApp.qx.size === 1 && window.anzhuApp.qx.has('tradeCenter')){
  //       return true
  //     }else{
  //       return window.anzhuApp.qx.has(code)
  //     }
  //   }else{
  //     return false
  //   }
  // }else{
  //   return false;
  // }
  if(!!code){
    if(!!sessionStorage.getItem('jurisdictionArr')){
      const jurisdictionArr = JSON.parse(sessionStorage.getItem('jurisdictionArr'))
      // if(jurisdictionArr.length === 1 && jurisdictionArr.includes('tradeCenter')){
      //   return true
      // }else{
      //   return jurisdictionArr.includes(code)
      // }
      return jurisdictionArr.includes(code)
    }else{
      return false
    }
  }else{
    return false;
  }
}





//读取cookie
export function getCookieValue(){
  const reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  let arr=null;
  arr=document.cookie.match(reg);
  if(!!arr){
    return unescape(arr[2]);
  }else{
    return null;
  }
}
//设置cookie
export function setCookie(name,value){
　const exp=new Date();
　exp.setTime(exp.getTime()+24*60*60*1000);//有效期1小时
　document.cookie=`${name}=${escape(value)};expires=${exp.toGMTString()}`;
}
//删除cookie
export function delCookie(name) {
  let exp=new Date();
  exp.setTime(exp.getTime()+(-1*24*60*60*1000));
  const cval=getCookieValue(name);
　document.cookie=`${name}=${cval};expires=${exp.toGMTString()}`;
}
//清空所有cookie
export function clearCookie(){
  var myDate=new Date();
  myDate.setTime(-1000);//设置时间
  var data=document.cookie;
  var dataArray=data.split("; ");
  for(var i=0;i<dataArray.length;i++){
       var varName=dataArray[i].split("=");
       document.cookie=varName[0]+"=''; expires="+myDate.toGMTString();
  }
}
/***************  新房团购退款审核 状态、表格数据生成   *********************/
//add by duxianqiu 17/05/15
export function renderNHGroupBuyRefundAuditData(responseData,groupKey,role){
  if(!!responseData){
    const result = {
      orderData:null,
      applyInfo:null,
      contractAuditInfo:null,
      financialAuditInfo:null,
      auditStatus:null,
      auditRecord:null,
      canRevoke:false,
      canAudit:false,
      canReApply:false,
    }

    //审核进度
    const {refundStatus} = responseData;
    result.auditStatus={
      current:1,
      status:'wait',
      stepList:[
        {
          title:'申请退款'
        },{
          title:'退款审核'
        },{
          title:'财务审核'
        },{
          title:'执行退款'
        }
      ]
    }
    if(refundStatus === '待合同审核'){
      result.auditStatus.current = 1;
      result.auditStatus.status = 'wait';
      result.canRevoke = (!!role && role === 'applyer');
      result.canAudit = (!!role && role === 'contracter');
    }
    else if(refundStatus === '合同审核/已驳回'){
      result.auditStatus.current = 1;
      result.auditStatus.status = 'error';
      result.auditStatus.stepList[1]={
        title:'退款审核',
        description:'已驳回',
      };
      result.canReApply = (!!role && role === 'applyer');
    }
    else if(refundStatus === '待财务审核'){
      result.auditStatus.current = 2;
      result.auditStatus.status = 'wait';
      result.canAudit = (!!role && role === 'financialer');
    }
    else if(refundStatus === '财务审核/已驳回'){
      result.auditStatus.current = 2;
      result.auditStatus.status = 'error';
      result.auditStatus.stepList[2]={
        title:'财务审核',
        description:'已驳回',
      };
      result.canReApply = (!!role && role === 'applyer');
    }
    else if(refundStatus === '待退款'){
      result.auditStatus.current = 3;
      result.auditStatus.status = 'wait';
    }
    else if(refundStatus === '已退款'){
      result.auditStatus.current = 3;
      result.auditStatus.status = 'finish';
    }

    //订单信息
    result.orderData = {
      refundType:'电商团购',
      projectName:isNull(responseData.projectName,'-'),
      orderNumber:isNull(responseData.payOrderNumber,'-'),
      paySerialNumber:isNull(responseData.paySerialNumber,'-'),
      payWay:isNull(responseData.payType,'-'),
      customerName:isNull(responseData.customerName,'-'),
      customerPhone:isNull(responseData.customerPhone,'-'),
      payTime:isNull(responseData.payFinishTime,'-'),
      payAmount:`${isNull(responseData.groupbuyMoney,'-')}元`,
      payStatus:isNull(responseData.payStatus,'-'),
      operation:'',
      groupKey:isNull(groupKey,null),
    }

    //申请信息
    result.applyInfo = {
      reason:isNull(responseData.reason),
      applyPics:isNull(responseData.reasonPics,[]).map((item,index)=>({
        title:'',
        src:item,
        id:`PicKey_${index}`
      })),
    }
    //审核list 2.0
    result.auditRecord = renderTimerListPicRecordArr(isNull(responseData.refundSchedules,[]));
    // //审核record 纯文字
    // result.auditRecord = isNull(responseData.refundSchedules,[]);
    //
    // //合同审核记录
    // if(!!responseData.contractPics || !!responseData.contractComment){
    //   result.contractAuditInfo = {
    //     reason:isNull(responseData.contractComment,'-'),
    //     pics:isNull(responseData.contractPics,[]).map((item,index)=>({
    //       title:'',
    //       src:item,
    //       id:`PicKey_${index}`
    //     })),
    //   }
    // }
    //
    // //财务审核记录
    // if(!!responseData.financialPics || !!responseData.financialComment){
    //   result.financialAuditInfo = {
    //     reason:isNull(responseData.financialComment,'-'),
    //     pics:isNull(responseData.financialPics,[]).map((item,index)=>({
    //       title:'',
    //       src:item,
    //       id:`PicKey_${index}`
    //     })),
    //   }
    // }

    //【返回】
    return result;
  }else{
    return null;
  }
}
//生成 时间-文字-图片 数组结构
export function renderTimerListPicRecordArr(arr){
  let result = [];
  if(!!arr){
    arr.map(item=>{
      let itemObj = parseTrackJSON(item);
      if(!!itemObj){
        result.push({
          time:isNull(itemObj.time,'-'),
          content:isNull(itemObj.desc,'-'),
          remarks:`描述：${isNull(itemObj.reason,'-')}`,
          isReject:isNull(itemObj.reason,'-').includes('驳回'),
          pics:checkJSONArray(isNull(itemObj.images,[])),
        })
      }
    })
  }
  return result
}



//【交易中心】首页 快捷入口 路由地址配置
export function renderTradeCenterIndexPageEntranceRouter(type){
  const resultPath = [];
  if(type === '贷款'){
    if(judgeJurisdiction('TRADINGCENTER_SECONDHAND_SIGN_LOAN')){
      resultPath.push('loanManagement/secondHandHouseSolution')
    }
    else if(judgeJurisdiction('TRADINGCENTER_SECONDHAND_LOAN')){
      resultPath.push('loanManagement/secondHandHouseMortgageDeal')
    }
    else if(judgeJurisdiction('TRADINGCENTER_SECONDHAND_RENT_INSTALLMENT_MANAGEMENT')){
      resultPath.push('loanManagement/secondHandHouseRentalLoans')
    }
  }
  else if(type === '合同'){
    if(judgeJurisdiction('TRADINGCENTER_TRADING_CONTRACT_AUDIT')){
      resultPath.push('contractReview/newhousetransactionContractReview')
    }
    else if(judgeJurisdiction('TRADINGCENTER_SECONDHAND_SELL_CONTRACT_AUDIT')){
      resultPath.push('contractReview/secondHandHouseSalesAudit')
    }
    else if(judgeJurisdiction('TRADINGCENTER_SECONDHAND_RENT_CONTRACT_APPROVE')){
      resultPath.push('contractReview/secondHandHouseRentalAudit')
    }
  }
  else if(type === '财务'){
    if(judgeJurisdiction('TRADINGCENTER_NEWHOUSE_ELECTRICITY_TRANSACTION_APPROVAL')){
      resultPath.push('financialManagement/newHouseElectricityExamination')
    }
    else if(judgeJurisdiction('TRADINGCENTER_SECONDHAND_SALE_FINANCIAL_APPROVAL')){
      resultPath.push('financialManagement/secondHouseSellExamine')
    }
    else if(judgeJurisdiction('TRADINGCENTER_SECONDHAND_RENT_FINANCIAL_AUDIT')){
      resultPath.push('financialManagement/secondHouseLeaseExamine')
    }
  }

  if(resultPath.length === 0){
    return '/'
  }else{
    return resultPath[0]
  }
}
///设置交易中心员工 hasOptPwd sessionStorage
export function setUserHasOptPwd(bool){
  sessionStorage.setItem('hasOptPwd',bool)
}
///读取交易中心员工 hasOptPwd sessionStorage
export function getUserHasOptPwd(){
  if(sessionStorage.getItem('hasOptPwd')){
    const resultObj = sessionStorage.getItem('hasOptPwd');
    console.log('resultObj',resultObj);
    return JSON.parse(resultObj)
  }else{
    return false
  }
}
//总价 转换
export function renderTotalMoneyNum(num){
  const total = Number(isNull(num,0));
  if(total === 0){
    return 0
  }else{
    return (total/10000)
  }
}
