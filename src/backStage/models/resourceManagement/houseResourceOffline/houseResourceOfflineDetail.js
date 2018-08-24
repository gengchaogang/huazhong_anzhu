import {
  findOneProject,findAllNewHouseImg,findAllNewHouseMangement,
  findAllNewHouseSellControlTable,findAllNewHouseDiscount,
  findAllNewHouseCertificates,
} from  '../../../services/resourceManagement/houseResourceOffline/houseResourceOfflineDetail'
import { routerRedux } from 'dva/router';
import {message} from 'antd';
export default {
  namespace: 'houseResourceOfflineDetail',
  state: {
    current:0,
    newHouseDetailObj:null,
    id:'',
    newHouseImgArr:[],//新房照片
    mangementSource:[],//户型图管理
    sellControlTableArr:[],//项目销控表
    sellControltotal:'',//项目销控表总数
    sellControlpageNo:'',//销控表当前页数
    discountArr:[],//项目优惠
    discounttotal:'',//项目优惠总数
    discountpageNo:'',//项目优惠当前页数
    certificatesImgArr:[],//项目资质图片
  },
  reducers: {

    setState(state,action){
      return{...state,...action.payload}
    },

  },
  effects:{
    *iniailFindAll({ payload }, { call, put }){
      const {data,err}=yield call(findOneProject,{...payload})
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        yield put({
          type:'setState',
          payload:{
            newHouseDetailObj:data.data,
            id:payload.id,
          }
        })
      }
    },
    *newHouseImg({payload},{call,put}){
      const {data,err}=yield call(findAllNewHouseImg,{...payload})
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        yield put({
          type:'setState',
          payload:{
            newHouseImgArr:data.data,
          }
        })
      }else{
        message.error(data.message)
      }
    },
    *newHouseMangement({payload},{call,put}){
      const {data,err}=yield call(findAllNewHouseMangement,{...payload})
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        const mangementSource=[];
        yield put({
          type:'setState',
          payload:{
            mangementSource:data.data.content,
            total:data.data.totalElements,
            pageNo:data.data.number+1,
          }
        })
      }else{
        message.error(data.message)
      }
    },
    *newHouseSellControlTable({payload},{call,put}){
      const {data,err}=yield call(findAllNewHouseSellControlTable,{...payload})
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        const sellControlTableArr=[];
        data.data.content.map((item,index)=>(
          sellControlTableArr.push({
            key:item.id,
            number:index+1,
            area:item.area,
            unit:item.unit,
            stairType:item.stairType,
            totalFloor:item.totalFloor,
            floor:item.floor,
            roomNumber:item.roomNumber,
            housingType:item.housingType,
            floorArea:item.floorArea,
            price:item.price,
            totalPrice:item.totalPrice,
            houseTypeName:item.houseTypeName,
            state:item.state,
          })
        ))
        yield put({
          type:'setState',
          payload:{
            sellControlTableArr:sellControlTableArr,
            sellControltotal:data.data.totalElements,
            sellControlpageNo:data.data.number+1,
          }
        })
      }else{
        message.error(data.message)
      }
    },
    *newHouseDiscount({payload},{call,put}){
      const {data,err}=yield call(findAllNewHouseDiscount,{...payload})
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        const discountArr=[];
        data.data.content.map((item,index)=>(
          discountArr.push({
            key:item.id,
            number:index+1,
            name:item.name,
            originalPrice:item.originalPrice,
            price:item.price,
            validDate:item.validDate,
            areaFrom:item.areaFrom,
            areaTo:item.areaTo,
            houseType:item.houseType,
            holdDays:item.holdDays,
            createDatetime:item.createDatetime,
          })
        ))
        yield put({
          type:'setState',
          payload:{
            discountArr:discountArr,
            discounttotal:data.data.totalElements,
            discountpageNo:data.data.number+1,
          }
        })
      }else{
        message.error(data.message)
      }
    },
    *newHouseQualification({payload},{call,put}){
      const {data,err}=yield call(findAllNewHouseCertificates,{...payload})
      if(err){
				return message.error('出错了，请联系管理员');
			}
      if(data.data){
        yield put({
          type:'setState',
          payload:{
            certificatesImgArr:data.data[0].credentialsPictures
          }
        })
      }
    },
  },
  subscriptions:{
    setup({ dispatch, history }) {
      history.listen(location =>{
        if (location.pathname === '/resourceManagement/soldOutHouse/houseResourceOfflineDetail') {
          dispatch({type:'iniailFindAll',
            payload:{
              id:location.state.id,
            }
          })
        }
      });
    },
  }
}
