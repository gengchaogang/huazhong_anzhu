import {
  getSellHouseInfo
} from '../../../services/tradeManagement/secondHouseSellTrade/secondHouseSellHousesDetails'
import { routerRedux } from 'dva/router'
import {
  isNull,
  transJSONString,
} from '../../../../commons/utils/currencyFunction'
const initState={
  loading:true,
  dataInfo:null,
  houseId:null,
  brokerId:null,
  promptObj:{
    visible:false,
    title:'提示',
    todo:'default',
  },
}
export default {
  namespace: 'secondHouseSellHousesDetails',
  state:initState,
  subscriptions: {
   setup({ dispatch, history }) {
     history.listen(location => {
       if (location.pathname === '/tradeManagement/secondHouseSellTrade/secondHouseSellHousesDetails'){
         if(!!location.state && !!location.state.transCode){
           dispatch({
             type:'doInitState'
           })
           dispatch({
             type:'getHouseInfoData',
             payload:location.state.transCode,
           })
         }else{
           dispatch({
             type: 'switchPrompt',
             payload:{
               visible:true,
               description:'未获得transCode',
               title:'获取数据失败',
               okText:'确定',
               todo:'goOut',
             },
           })
         }
       }
    });
   },
  },
  effects:{
    //获取房源详情
    *getHouseInfoData({payload},{call,put}){
      const {data}=yield call(getSellHouseInfo,{transCode:payload});
      if(!!data){
        if(data.status==='success' && !!data.data){
	        const tradeInfo=data.data;
	        const resourcesInfo=transJSONString(isNull(tradeInfo.resourcesInfo,''));
	        const ownerInfo=transJSONString(isNull(tradeInfo.ownerInfo,''));
	        // console.log('tradeInfo',tradeInfo);
	        // console.log('resourcesInfo',resourcesInfo);
	        // console.log('ownerInfo',ownerInfo);

          //房源图片
          const housePics=[];
          //目前只有一张
          if(!!isNull(resourcesInfo.fileUrl,false)){
            housePics.push({
              id:`223_${resourcesInfo.fileUrl}`,
              src:resourcesInfo.fileUrl,
              isCover:false,
              title:'',
            })
          }
          // if(isNull(tradeInfo.delegationAgreementFiles,[]).length!==0){
          //   tradeInfo.delegationAgreementFiles.map({
          //     houseAgreements.push({
          //       id:isNull(item.id,`key_${index}`),
          //       src:isNull(item.path,''),
          //       isCover:isNull(item.isMain,'否')==='是',
          //       title:isNull(item.name,''),
          //     })
          //   })
          // }
	        //把有关业主的所有图片组装到一起
	        let houseAgreements=[];
	        let picsArr=[];//临时储存所有图片（除房源图片外）
	        let delegationAgreementFiles=[];//委托协议图片
	        picsArr=picsArr.concat(ownerInfo.idUrls);//身份证
	        picsArr=picsArr.concat(ownerInfo.propertyUrls);//房产证
	        try {
		        delegationAgreementFiles=JSON.parse(tradeInfo.delegationAgreementFiles);
	        } catch (e) {
		        delegationAgreementFiles=[];
	        }
	        picsArr=picsArr.concat(delegationAgreementFiles);
	        picsArr.map((item,index)=>{
		        houseAgreements.push({
			        id:`key_${index}`,
			        src:isNull(item,''),
			        isCover:false,
			        title:'',
		        })
	        });
          let houseBasicInfoFromData=[];
          //组装characteristics
	        let characteristicsArr=[]
	        try{
	          JSON.parse(resourcesInfo.characteristics).map((item,index)=>{
		          characteristicsArr.push({id:index,name:item})
            })
          }catch (e) {
		        characteristicsArr = []
	        }
          console.log('resourceInfo???????????????',resourcesInfo);
          //根据房源类型以及租售方式展示不同的内容字段
	        if (resourcesInfo.resourcesType === '住宅' && resourcesInfo.saleWay === '出售') {
		        houseBasicInfoFromData=[
              {
                label:'挂牌时间',
                value:isNull(resourcesInfo.createDate,'-'),
              },{
                label:'所在区域',
                value:isNull(resourcesInfo.areaName,'-'),
              },{
                label:'小区名称',
                value:isNull(resourcesInfo.communityName,'-'),
              },{
                label:'租售方式',
                value:isNull(resourcesInfo.saleWay,'-'),
              },{
                label:'房源详细',
                value:isNull(resourcesInfo.detailed,'-'),
              },{
                label:'房源户型',
                value:isNull(resourcesInfo.houseType,'-'),
              },{
                label:'建筑面积',
                value:isNull(resourcesInfo.floorArea + '㎡','-'),
              },{
                label:'装修情况',
                value:isNull(resourcesInfo.decoration,'-'),
              },{
                label:'房屋朝向',
                value:isNull(resourcesInfo.orientations,'-'),
              },{
                label:'房源楼层',
                value:isNull(resourcesInfo.storey+'/'+resourcesInfo.totalFloors,'-'),
              },{
                label:'抵押信息',
                value:isNull(resourcesInfo.mortgage,'-')
              },{
                label:'支持贷款',
                value:isNull(resourcesInfo.supportMortgage,'-')
              },{
                label:'核心卖点',
                value:isNull(resourcesInfo.coreSellingPoint,'-')
              },{
				        label:'房源特色',
				        value:isNull(characteristicsArr,'-')
			        }
            ];
	        } else if (resourcesInfo.resourcesType === '商铺' && resourcesInfo.saleWay === '出售') {
	          //解析可经营类别
		        let businessCategoryString='';
		        if(resourcesInfo.businessCategory){
			        try{
				        businessCategoryString = JSON.parse(resourcesInfo.businessCategory).join('、');
			        }catch (e){
				        businessCategoryString='';
			        }
		        }
		        houseBasicInfoFromData=[
              {
                label:'挂牌时间',
                value:isNull(resourcesInfo.createDate,'-')
              },
              {
                label:'所在区域',
                value:isNull(resourcesInfo.areaName,'-')
              }, {
                label:'楼盘名称',
                value:isNull(resourcesInfo.communityName,'-')
              }, {
                label:'租售方式',
                value:isNull(resourcesInfo.saleWay,'-')
              }, {
                label:'房源详细',
                value:isNull(resourcesInfo.detailed,'-')
              }, {
                label:'建筑面积',
                value:isNull(resourcesInfo.floorArea + '㎡','-')
              }, {
                label:'楼层',
                value:isNull(resourcesInfo.storey+'/'+resourcesInfo.totalFloors,'-')
              }, {
                label:'建筑年代',
                value:isNull(resourcesInfo.buildingAge+'年','-')
              }, {
                label:'商铺类型',
                value:isNull(resourcesInfo.shopType,'-')
              }, {
                label:'可经营类别',
                value:isNull(businessCategoryString,'-')
              }, {
                label:'是否可分割',
                value:isNull(resourcesInfo.split,'-')
              }, {
                label:'装修情况',
                value:isNull(resourcesInfo.decoration,'-')
              },{
				        label:'核心卖点',
				        value:isNull(resourcesInfo.coreSellingPoint,'-')
			        },{
				        label:'房源特色',
				        value:isNull(characteristicsArr,'-')
			        }
            ];
	        } else if (resourcesInfo.resourcesType === '写字楼' && resourcesInfo.saleWay === '出售') {
		        houseBasicInfoFromData=[
              {
                label:'挂牌时间',
                value:isNull(resourcesInfo.createDate,'-')
              }, {
                label:'所在区域',
                value:isNull(resourcesInfo.areaName,'-')
              }, {
                label:'楼盘名称',
                value:isNull(resourcesInfo.communityName,'-')
              }, {
                label:'租售方式',
                value:isNull(resourcesInfo.saleWay,'-')
              }, {
                label:'房源详细',
                value:isNull(resourcesInfo.detailed,'-')
              }, {
                label:'建筑面积',
                value:isNull(resourcesInfo.floorArea + '㎡','-')
              }, {
                label:'楼层',
                value:isNull(resourcesInfo.storey+'/'+resourcesInfo.totalFloors,'-')
              }, {
                label:'写字楼类型',
                value:isNull(resourcesInfo.officeBuildingType,'-')
              }, {
                label:'是否可分割',
                value:isNull(resourcesInfo.split,'-')
              }, {
                label:'是否可注册',
                value:isNull(resourcesInfo.officeBuildingRegistered,'-')
              }, {
                label:'装修情况',
                value:isNull(resourcesInfo.decoration,'-')
              }, {
                label:'物业费',
                value:isNull(resourcesInfo.propertyCosts+'元','-')
              }, {
                label:'建筑年代',
                value:isNull(resourcesInfo.buildingAge+'年','-')
              }, {
				        label:'核心卖点',
				        value:isNull(resourcesInfo.coreSellingPoint,'-')
			        }, {
				        label:'房源特色',
				        value:isNull(characteristicsArr,'-')
			        }
            ]
	        }
          yield put({
            type:'setHouseInfo',
            payload:{
              ...payload,
              dataInfo:JSON.stringify({
                houseNumber:isNull(resourcesInfo.resourcesNumber,'-'),
                housePics,
                houseBasicInfo:houseBasicInfoFromData,
                houseAgreements,
              }),
            }
          })
        }else{
          yield put({
            type: 'switchPrompt',
            payload:{
              visible:true,
              description:data.message,
              title:'获取交易数据失败',
              todo:'goOut',
            },
          });
        }
      }else{
        yield put({
          type: 'switchPrompt',
          payload:{
            visible:true,
            description:'请求失败',
            title:'获取交易数据失败',
            todo:'goOut',
          },
        });
      }
    },
    //提示模态框行为判断
    *closePrompt({payload},{select,call,put}){
      const{todo}=yield select(({secondHouseSellHousesDetails})=>secondHouseSellHousesDetails.promptObj);
      switch (todo) {
        case 'default':
          yield put({
            type:'onlyClosePrompt'
          });
          break;
        case 'goOut':
          yield put({
            type:'onlyClosePrompt'
          });
          yield put(routerRedux.goBack());
          break;
        default:
          yield put({
            type:'onlyClosePrompt'
          });
          break;
      }
    },
  },
  reducers: {
    //初始化state
    doInitState(state,action){
      return initState;
    },
    //切换提示模态框state
    switchPrompt(state,action){
      return{...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    //关闭提示模态框
    onlyClosePrompt(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{visible:false})}
    },
    //初始化房源信息
    setHouseInfo(state,action){
      return {...state,...action.payload}
    },
  },
}
