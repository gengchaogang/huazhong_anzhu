import {
  getProjectListFetch,
  getProjectBasicInfoFetch,
  getProjectAlbumInfoFetch,
  getHouseImgInfoFetch,
  getHousesSalesTableDataFetch,
  getProjectDiscountInfoDataFetch,
  getProjectCertificatesInfoDataFetch,
} from '../../../services/resourceManagement/newHousePro/projectDetailsBackStage';
import {isNull} from '../../../../commons/utils/currencyFunction'
import {parse} from 'qs';
import { routerRedux } from 'dva/router'
const creatBasicInfo=(type,data,projecName)=>{
  // console.log(data,'datadata');
  const result=[];
  if(type==='basicInfo'){
    result.push({label:'项目名称',value:data.name});
    result.push({
      label:'项目地址',
      value:isNull(data.areaPath,''),
    });
    result.push({label:'项目上线时间',value:isNull(data.onsellDateTime,'')});
    result.push({label:'项目带看保护期',value:isNull(data.protectDays,'')});
    result.push({label:'项目联系人',value:isNull(data.contact,'')});
    result.push({label:'项目联系电话',value:isNull(data.phone,'')});
  }else if(type==='buildingInfo'){
    result.push({label:'开盘时间',value:isNull(data.openingTime,'')});
    result.push({label:'交房时间',value:isNull(data.deliverTime,'')});
    result.push({
      label:'物业类型',
      value:isNull(data.propertyType,[]),
      layout:{
        lg:12,
        md:16,
        sm:24,
      },
    });
    result.push({label:'楼盘开发商',value:isNull(data.developers,'')});
    result.push({label:'售楼地址',value:isNull(data.saleAddress,'')});
    result.push({label:'建筑面积',value:isNull(data.floorArea,'')});
    result.push({
      label:'特色',
      value:isNull(data.characteristic,[]),
      layout:{
        lg:12,
        md:16,
        sm:24,
      },
    });
    result.push({label:'产权年限',value:isNull(data.ownLength,'')});
    result.push({
      label:'装修标准',
      value:isNull(data.decoration,''),
    });
    result.push({label:'容积率',value:isNull(data.capacityRate,'')});
    result.push({label:'绿化率',value:isNull(data.greeningRate,'')});
    result.push({label:'规划户数',value:isNull(data.houses,'')});
    result.push({label:'规划车位',value:isNull(data.parkingSize,'')});
    result.push({label:'物业公司',value:isNull(data.estateCompany,'')});
    result.push({label:'物业费',value:isNull(data.propertyCosts,'')});
    result.push({label:'供暖方式',value:isNull(data.heatingMode,'')});
    result.push({label:'水电燃气',value:(isNull(data.waterElectricityGas,false)?'有':'无')});
  }
  return result
}
const initState={
  projectId:'',
  // projectList:[],
  projectName:'',
  showData:'',
  loading:true,
  current:0,
  total:'',//销控表总数
  pageNo:'',//销控表当前页数
  picCredentialsList:[],  //图片列表
  promptObj:{
    visible:false,
    title:'',
    todo:'getOut',
  },
  pagination:{
    currentPage:1,
    totalPage:1,
  },
}

export default {
  namespace: 'projectDetailsBackStage',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname ==='/resourceManagement/newHousePro/projectDetails') {
          dispatch({type:'doInitState'})
          if(!!location.state && !!location.state.projectId){
            //已有项目id
            dispatch({
              type:'setProjectIdName',
              payload:{
                projectId:location.state.projectId,
                projectName:location.state.projectName,
              },
            })
            dispatch({
              type:'getCurrentData',
              payload:{
                projectId:location.state.projectId,
              },
            })
          }else{
            //未传id
            // dispatch({type:'getProjectListData'})
            dispatch({type:'togglePromptObj',payload:{
              visible:true,
              title:'获取项目详情失败',
              description:'请重新进入',
              okText:'退出',
            }})
          }
        }
      });
    },
  },
  effects:{
    *getCurrentData({payload},{select,put,call}){
      //判断当前进行到哪一步
      const {current,projectId} = yield select(({ projectDetailsBackStage }) => projectDetailsBackStage);
      if(current===0){
        yield put({type:'initProjectBasicInfo',payload:projectId})
      }else if(current===1){
        yield put({type:'initProjectAlbumInfo',payload:projectId})
      }else if(current===2){
        yield put({type:'initHouseImgInfo',payload:projectId})
      }else if(current===3){
        yield put({type:'initHousesSalesTable',payload:projectId})
      }else if(current===4){
        yield put({type:'getProjectDiscountInfoData',payload:{
          pageNo:1,
        }})
      }else if(current===5){
        yield put({type:'getProjectCertificatesInfoData'})
      }
    },

    *goNext({payload},{put,call}){
      yield put({type:'updateCurrent',payload:payload+1});
      yield put({type:'getCurrentData'})
    },
    *goPrev({payload},{put,call}){
      yield put({type:'updateCurrent',payload:payload-1});
      yield put({type:'getCurrentData'})
    },
    *selectProject({payload},{put,call}){
      yield put({type:'updateSelectProject',payload,});
      //获取项目基本数据
      yield put({type:'initProjectBasicInfo',payload})
    },
    //退出查看项目详情
    *getOut({payload},{put}){
      yield put({type:'togglePromptObj',payload:{visible:false}});
      yield put(routerRedux.goBack());
    },
    //获取项目基础信息
    *initProjectBasicInfo({payload},{select,call,put}){
      const {projectName} = yield select(({ projectDetailsBackStage }) => projectDetailsBackStage);
      const {data}=yield call(getProjectBasicInfoFetch,{id:payload})
      if(!!data){
        if(data.status==='success'){
          const showDataObj={
            basicInfo:creatBasicInfo('basicInfo',data.data,projectName),
            buildingInfo:creatBasicInfo('buildingInfo',data.data),
            address:isNull(data.data.address,''),
            coordinates:[isNull(data.data.longitude,'1'),isNull(data.data.latitude,'1')],
            introduced:isNull(data.data.introduced,''),
          }
          const showData=JSON.stringify(showDataObj);
          yield put({type:'setShowData',payload:showData})
        }else{
          //服务器响应失败
          yield put({
            type:'togglePromptObj',
            payload:{
              visible:true,
              title:'获取项目基本信息失败',
              description:'请重新进入',
              okText:'退出',
            },
          })
        }
      }else{
        //fetch失败
        yield put({
          type:'togglePromptObj',
          payload:{
            visible:true,
            title:'与服务器连接失败！',
            description:'请联系管理员',
            okText:'退出',
          },
        })
      }
    },
    //获取项目相册数据
    *initProjectAlbumInfo({payload},{select,call,put}){
      const {data}=yield call(getProjectAlbumInfoFetch,{projectId:payload})
      if(!!data){
        if(data.status==='success'){
          const picResult=data.data[0].pictures;
          const picData={
            designPicture:[],
            trafficPicture:[],
            matchingPicture:[],
          }
          picResult.map(item=>{
            if(item.type==='1'){
              picData.designPicture.push({
                title:item.title,
                id:item.id,
                src:item.path,
                isCover:item.cover,
              })
            }else if(item.type==='2'){
              picData.trafficPicture.push({
                title:item.title,
                id:item.id,
                src:item.path,
                isCover:item.cover,
              })
            }else if(item.type==='3'){
              picData.matchingPicture.push({
                title:item.title,
                id:item.id,
                src:item.path,
                isCover:item.cover,
              })
            }
          });
          const showData=JSON.stringify(picData);
          yield put({type:'setShowData',payload:showData})
        }else{
          //服务器响应失败
          yield put({
            type:'togglePromptObj',
            payload:{
              visible:true,
              title:'获取项目相册信息失败！',
              description:'请刷新',
              okText:'退出',
            },
          })
        }
      }else{
        //fetch失败
        yield put({
          type:'togglePromptObj',
          payload:{
            visible:true,
            title:'与服务器连接失败！',
            description:'请联系管理员',
            okText:'退出',
          },
        })
      }
    },
    //获取项目户型图数据
    *initHouseImgInfo({payload},{select,call,put}){
      const {data}=yield call(getHouseImgInfoFetch,{projectId:payload});
      if(!!data){
        if(data.status==='success'){
          const houseTypeArr=data.data.content.map((item,index)=>({
            imgSrc:isNull(item.pictures,[''])[0],
            name:isNull(item.name,''),
            tips:isNull(item.pictures,[]),
            room:`${isNull(item.houseRoom,'-')}室${isNull(item.bathRoom,'-')}厅${isNull(item.cookRoom,'-')}厨${isNull(item.bathRoom,'-')}卫`,
            floorArea:`${isNull(item.floorAreaStart,'-')}㎡~${isNull(item.floorAreaEnd,'-')}㎡`,
            innerArea:`${isNull(item.innerArea,'-')}㎡`,
            referencePrice:`${isNull(item.referencePrice,'-')}元/㎡`,
            referenceTotalPrice:`${isNull(item.referenceTotalPriceStart,'-')}万~${isNull(item.referenceTotalPriceEnd,'-')}万`,
            createTime:isNull(item.createDateTime,'-'),
            id:isNull(item.id,`index_${index}`),
          }));
          // console.log('houseTypeArr',houseTypeArr);
          const showData=JSON.stringify(houseTypeArr);
          yield put({
            type:"setProjectIdName",
            payload:{
              total:data.data.totalElements,
              pageNo:data.data.number+1,
            }
          })
          yield put({type:'setShowData',payload:showData})
        }else{
          //服务器响应失败
          yield put({
            type:'togglePromptObj',
            payload:{
              visible:true,
              title:'获取项目相册信息失败！',
              description:'请刷新',
              okText:'退出',
            },
          })
        }
      }else{
        //fetch失败
        yield put({
          type:'togglePromptObj',
          payload:{
            visible:true,
            title:'与服务器连接失败！',
            description:'请联系管理员',
            okText:'退出',
          },
        })
      }
    },
    //项目户型图分页
    *changeImgNumber({payload},{select,call,put}){
      const {projectId}=yield select(({projectDetailsBackStage})=>projectDetailsBackStage);
      const {data}=yield call(getHouseImgInfoFetch,{projectId:projectId,pageNo:payload});
      if(!!data){
        if(data.status==='success'){
          const houseTypeArr=data.data.content.map((item,index)=>({
            imgSrc:isNull(item.pictures,[''])[0],
            name:isNull(item.name,''),
            tips:isNull(item.pictures,[]),
            room:`${isNull(item.houseRoom,'-')}室${isNull(item.bathRoom,'-')}厅${isNull(item.cookRoom,'-')}厨${isNull(item.bathRoom,'-')}卫`,
            floorArea:`${isNull(item.floorAreaStart,'-')}㎡~${isNull(item.floorAreaEnd,'-')}㎡`,
            innerArea:`${isNull(item.innerArea,'-')}㎡`,
            referencePrice:`${isNull(item.referencePrice,'-')}元/㎡`,
            referenceTotalPrice:`${isNull(item.referenceTotalPriceStart,'-')}万~${isNull(item.referenceTotalPriceEnd,'-')}万`,
            createTime:isNull(item.createDateTime,'-'),
            id:isNull(item.id,`index_${index}`),
          }));
          // console.log('houseTypeArr',houseTypeArr);
          const showData=JSON.stringify(houseTypeArr);
          yield put({
            type:"setProjectIdName",
            payload:{
              total:data.data.totalElements,
              pageNo:data.data.number+1,
            }
          })
          yield put({type:'setShowData',payload:showData})
        }else{
          //服务器响应失败
          yield put({
            type:'togglePromptObj',
            payload:{
              visible:true,
              title:'获取项目相册信息失败！',
              description:'请刷新',
              okText:'退出',
            },
          })
        }
      }else{
        //fetch失败
        yield put({
          type:'togglePromptObj',
          payload:{
            visible:true,
            title:'与服务器连接失败！',
            description:'请联系管理员',
            okText:'退出',
          },
        })
      }
    },
    //获取项目销控表数据
    *initHousesSalesTable({payload},{select,call,put}){
      const {data}=yield call(getHousesSalesTableDataFetch,{projectId:payload});
      if(!!data){
        if(data.status==='success'){
          const resultData=data.data.content;
          const salesTableData=resultData.map(item=>({
            key:`key_${item.id}`,
            serialNumber:item.id,
            area:item.area,
            unit:item.unit,
            stairType:item.stairType,
            decoration:item.decoration,
            floor:item.floor,
            totalFloor:item.totalFloor,
            roomNumber:item.roomNumber,
            buildingNumber:item.buildingNumber,
            housingType:item.housingType,
            floorArea:item.floorArea,
            price:item.price,
            totalPrice:item.totalPrice,
            houseTypeName:item.houseTypeName,
            status:item.state,
          }))
          const showData=JSON.stringify(salesTableData);
          yield put({type:'setShowData',payload:showData})
          yield put({
            type:"setProjectIdName",
            payload:{
              total:data.data.totalElements,
              pageNo:data.data.number+1,
            }
          })
        }else{
          //服务器响应失败
          yield put({
            type:'togglePromptObj',
            payload:{
              visible:true,
              title:'获取项目相册信息失败！',
              description:'请刷新',
              okText:'退出',
            },
          })
        }
      }else{
        //fetch失败
        yield put({
          type:'togglePromptObj',
          payload:{
            visible:true,
            title:'与服务器连接失败！',
            description:'请联系管理员',
            okText:'退出',
          },
        })
      }
    },
    //获取项目优惠数据
    *getProjectDiscountInfoData({payload},{select,call,put}){
      const {pageNo}=payload;
      const {projectId}=yield select(({projectDetailsBackStage})=>projectDetailsBackStage);
      const {data}=yield call(getProjectDiscountInfoDataFetch,{projectId,pageNo:pageNo-1});
      if(!!data){
        if(data.status==='success'){
          const discountTableData=data.data.content.map((item,index)=>({
            serialNumber:isNull(item.id,index),
            name:isNull(item.name,''),
            originalPrice:isNull(item.originalPrice,''),
            price:isNull(item.price,''),
            validDate:isNull(item.validDate,''),
            areaFrom:isNull(item.areaFrom,''),
            areaTo:isNull(item.areaTo,''),
            discounts:isNull(item.discounts,''),
            applyType:'',
            houseType:isNull(item.houseType,''),
            holdDays:isNull(item.holdDays,''),
            createTime:isNull(item.createDateTime,''),
            beSaled:'【无字段】',
            beUsed:'【无字段】',
            beRefunded:'【无字段】',
          }))
          const showData=JSON.stringify(discountTableData);
          yield put({type:'setShowData',payload:showData});
          yield put({
            type:"setProjectIdName",
            payload:{
              total:data.data.totalElements,
              pageNo:data.data.number+1,
            }
          })
          // 分页未做
        }else{
          yield put({
            type:'togglePromptObj',
            payload:{
              visible:true,
              title:'获取项目优惠信息列表失败！',
              description:data.message,
              todo:'default',
            },
          })
        }
      }else{
        yield put({
          type:'togglePromptObj',
          payload:{
            visible:true,
            title:'获取项目优惠信息列表失败！',
            description:'请联系管理员',
            todo:'default',
          },
        })
      }
    },
    *changePageDiscounts({payload},{select,call,put}){
      const {projectId}=yield select(({projectDetailsBackStage})=>projectDetailsBackStage);
      const {data}=yield call(getProjectDiscountInfoDataFetch,{projectId:projectId,pageNo:payload});
      if(!!data){
        if(data.status==='success'){
          const discountTableData=data.data.content.map((item,index)=>({
            serialNumber:isNull(item.id,index),
            name:isNull(item.name,''),
            originalPrice:isNull(item.originalPrice,''),
            price:isNull(item.price,''),
            validDate:isNull(item.validDate,''),
            areaFrom:isNull(item.areaFrom,''),
            areaTo:isNull(item.areaTo,''),
            discounts:isNull(item.discounts,''),
            applyType:'',
            houseType:isNull(item.houseType,''),
            holdDays:isNull(item.holdDays,''),
            createTime:isNull(item.createDateTime,''),
            beSaled:'【无字段】',
            beUsed:'【无字段】',
            beRefunded:'【无字段】',
          }))
          const showData=JSON.stringify(discountTableData);
          yield put({type:'setShowData',payload:showData});
          yield put({
            type:"setProjectIdName",
            payload:{
              total:data.data.totalElements,
              pageNo:data.data.number+1,
            }
          })
          // 分页未做
        }else{
          yield put({
            type:'togglePromptObj',
            payload:{
              visible:true,
              title:'获取项目优惠信息列表失败！',
              description:data.message,
              todo:'default',
            },
          })
        }
      }else{
        yield put({
          type:'togglePromptObj',
          payload:{
            visible:true,
            title:'获取项目优惠信息列表失败！',
            description:'请联系管理员',
            todo:'default',
          },
        })
      }
    },
    //获取项目资质详情
    *getProjectCertificatesInfoData({payload},{select,call,put}){
      const {projectId}=yield select(({projectDetailsBackStage})=>projectDetailsBackStage);
      const {data}=yield call(getProjectCertificatesInfoDataFetch,{projectId,});
      if(!!data){
        if(data.status==='success'){
          // console.log('data',data);
          const picCredentialsList=[];
          data.data[0].credentialsPictures.map(item=>{
            picCredentialsList.push(item.path)
          })
          yield put({
            type:"savePicCredentialsList",
            payload:{
              picCredentialsList:picCredentialsList
            }
          })
        }else{
          yield put({
            type:'togglePromptObj',
            payload:{
              visible:true,
              title:'获取项目资质信息失败！',
              description:data.message,
              todo:'default',
            },
          })
        }
      }else{
        yield put({
          type:'togglePromptObj',
          payload:{
            visible:true,
            title:'获取项目资质信息失败！',
            description:'请联系管理员',
            todo:'default',
          },
        })
      }
    },
    //销控表分页变化
    *changePageNumber({payload},{select,call,put}){
      // console.log(payload,'payload');
      const {projectId}=yield select(({projectDetailsBackStage})=>projectDetailsBackStage);
      const {data}=yield call(getHousesSalesTableDataFetch,{projectId:projectId,pageNo:payload});
      if(data.status==='success'){
        const resultData=data.data.content;
        const salesTableData=resultData.map(item=>({
          key:`key_${item.id}`,
          serialNumber:item.id,
          area:item.area,
          unit:item.unit,
          stairType:item.stairType,
          decoration:item.decoration,
          floor:item.floor,
          totalFloor:item.totalFloor,
          roomNumber:item.roomNumber,
          buildingNumber:item.buildingNumber,
          housingType:item.housingType,
          floorArea:item.floorArea,
          price:item.price,
          totalPrice:item.totalPrice,
          houseTypeName:item.houseTypeName,
          status:item.state,
        }))
        const showData=JSON.stringify(salesTableData);
        yield put({type:'setShowData',payload:showData})
        yield put({
          type:"setProjectIdName",
          payload:{
            total:data.data.totalElements,
            pageNo:data.data.number+1,
          }
        })
      }
    }
  },
  reducers: {
    doInitState(state,action){
      return initState;
    },
    setProjectIdName(state,action){
      return {...state,...action.payload}
    },
    savePicCredentialsList(state,action){
      return {...state,...action.payload}
    },
    togglePromptObj(state,action){
      return {...state,promptObj:Object.assign({},state.promptObj,{...action.payload})}
    },
    updateCurrent(state,action){
      return {...state,current:action.payload,loading:true}
    },
    setShowData(state,action){
      return {...state,showData:action.payload,loading:false}
    },
    updateProjectId(state,action){
      return {...state,projectId:action.payload}
    },
    updateProjectList(state,action){
      return {...state,projectList:action.payload}
    },
    selectProject(state,action){
      return {...state,projectId:action.payload}
    },
    changeLoading(state,action){
      return {...state,loading:action.payload}
    },
    changePagination(state,action){
      return {...state,pagination:Object.assign({},state.pagination,action.payload)}
    },
  },
}
