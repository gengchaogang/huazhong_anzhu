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
        trackData.commitRecord=commitRecord.map(record=>({
          label:record.date,
          value:record.content,
        }))
      }
    });
    return trackData;
  }else{
    return {}
  }
}
//二手房出售
export function creatSeconHouseSellTrackJSON(trackDetail){
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
      else if(detailType==='交易中心'){
        if(item.detailContent==null){
          trackData.tradingCenterInfo=null;
        }else{
          const customer=JSON.parse(item.detailContent);
          trackData.tradingCenterInfo=[
            {
              label:'交易中心名称',
              value:isNull(customer.name,''),
            },{
              label:'联系电话',
              value:isNull(customer.phone,''),
            },{
              label:'地址',
              value:isNull(customer.address,''),
            }
          ]
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
            area:getJSONValue(isNull(house.resourcesInfo,''),'floorArea'),
            price:getJSONValue(isNull(house.resourcesInfo,''),'uintPirce'),
            totalPrice:isNull(house.totalPrice,'-'),
            loan:isNull(houseBasic.supportMortgage,'不支持')==='不支持'?false:true,
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
            payWay:isNull(detailContent.paymentMethod,''),
            paySerialNumber:isNull(detailContent.serialNumber,''),
            payTime:isNull(detailContent.paymentDateTime,''),
            customer:isNull(detailContent.customerName,''),
            phoneNumber:isNull(detailContent.customerPhone,''),
            price:isNull(detailContent.unitPrice,''),
            totalPrice:isNull(detailContent.totalPrice,''),
            intentsPrice:isNull(detailContent.amount,''),
            payStatus:isNull(detailContent.paymentStatus,''),
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
            dealTotalPrice:isNull(detailContent.totalPrice,''),
            customer:isNull(detailContent.customerName,''),
            phoneNumber:isNull(detailContent.customerPhone,''),
            proportion:isNull(detailContent.firstpaymentRatio,''),
            intentsDeductible:isNull(detailContent.deductedIntention,''),
            payAmount:isNull(detailContent.amount,''),
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
            dealTotalPrice:isNull(detailContent.totalPrice,''),
            dealUnitPrice:isNull(detailContent.unitPrice,''),
            undertaker:isNull(detailContent.undertaker,''),
            serviceCharge:isNull(detailContent.serviceCharge,''),
            proportion:isNull(detailContent.commissionRate,''),
            payAmount:isNull(detailContent.amount,''),
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
                value:`${isNull(Number(commitCommission.platformCommissionRate)*100,'-')}%`,
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
                label:'房源经纪人',
                value:`${isNull(Number(commitCommission.brokerCommissionRate)*100,'-')}% ${isNull(commitCommission.brokerCommissionAmount,'-')}元`,
              },{
                label:'客户经纪人',
                value:`${isNull(Number(commitCommission.customerBrokerCommissionRate)*100,'-')}% ${isNull(commitCommission.customerBrokerCommissionAmount,'-')}元`,
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
          console.log('JSON.parse(item.detailContent)',JSON.parse(item.detailContent));
          trackData.commitInfo=creatSHTimeLineData(item.detailContent);
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
      }else if(detailType==='交易中心'){
        if(item.detailContent==null){
          trackData.tradingCenterInfo=null;
        }else{
          const customer=JSON.parse(item.detailContent);
          trackData.tradingCenterInfo=[
            {
              label:'交易中心名称',
              value:isNull(customer.name,''),
            },{
              label:'联系电话',
              value:isNull(customer.phone,''),
            },{
              label:'地址',
              value:isNull(customer.address,''),
            }
          ]
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
              label:'手机号',
              value:isNull(customer.phone,''),
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
            orderNumber:isNull(detailContent.orderNumber,''),
            payWay:isNull(detailContent.paymentMethod,''),
            paySerialNumber:isNull(detailContent.serialNumber,''),
            dealRentPrice:isNull(detailContent.dealRentPrice,'无字段'),//
            customer:isNull(detailContent.customer,'无字段'),
            payTime:isNull(detailContent.paymentDateTime,''),
            commissionDeductible:isNull(detailContent.commissionDeductible,'无字段'),//
            dealCommission:isNull(detailContent.dealCommission,'无字段'),//
            payStatus:isNull(detailContent.paymentStatus,''),
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
                value:`${isNull(Number(commitCommission.platformCommissionRate)*100,'-')}%`,
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
                label:'房源经纪人',
                value:`${isNull(Number(commitCommission.brokerCommissionRate)*100,'-')}% ${isNull(commitCommission.brokerCommissionAmount,'-')}元`,
              },{
                label:'客户经纪人',
                value:`${isNull(Number(commitCommission.customerBrokerCommissionRate)*100,'-')}% ${isNull(commitCommission.customerBrokerCommissionAmount,'-')}元`,
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
          trackData.commitInfo=creatSHTimeLineData(item.detailContent);
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



// else if(detailType==='成交资金释放账户'){
//   if(!!item.detailContent){
//     trackData.capitalRelease=creatSHTimeLineData(item.detailContent);
//   }else{
//     trackData.capitalRelease=null;
//   }
// }
// else if(detailType==='成交分佣设置'){
//   if(!!item.detailContent){
//     trackData.commitCommission=creatSHTimeLineData(item.detailContent);
//   }else{
//     trackData.commitCommission=null;
//   }
// }

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
        }else if(content.detailContentType==='TimeLine'){
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




//从数组中获取每个子对象的某个字段的值并返回这些值的数组
export function getArrayObjectValue(arr,key){
  return arr.map(item=>item[key])
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
