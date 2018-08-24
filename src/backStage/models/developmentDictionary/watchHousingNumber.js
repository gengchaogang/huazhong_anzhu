import {findAll,addRooms,editRooms} from '../../services/developmentDictionary/watchHousingNumber';
import { parse } from 'qs';
import { message} from 'antd';
export default {
	namespace: 'watchHousingNumber',
	state: {
    id:'',
    totalNumberOfFloors:'',
    household:'',
    roomNumberStartingValue:'',
		setHouseNoStatus:false,//设置房源编号的模态框
		dataSurce:[],
		orgin:[],
		loading:false,
		choseRulesStatus:false,
		isCreate:false,
	},
  subscriptions:{
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/developmentDictionary/residentialArea/watchHousingNumber') {
					dispatch({
            type:'findAll',
            payload:{buildingId:location.state.id,
							totalNumberOfFloors:location.state.totalNumberOfFloors,
              household:location.state.household,
              roomNumberStartingValue:location.state.roomNumberStartingValue,
						}
          })
          dispatch({
            type:'querySuccess',
            payload:{
              id:location.state.id,
              totalNumberOfFloors:location.state.totalNumberOfFloors,
              household:location.state.household,
              roomNumberStartingValue:location.state.roomNumberStartingValue,
            }
          });
				}
			});
		},
	},
	effects: {
    *findAll({ payload }, { call, put ,select}){
      const  {data,err}  = yield call(findAll,{...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				const results=data.data.rooms;
				var isCreate=false;
				if(results.length>0){
					isCreate=true
				}else{
					isCreate=false
				}
				const tableData=[];
				const tableMap=new Map();
				results.map(item=>{
					if(tableMap.has(item.floor)){
						tableMap.get(item.floor).rooms.push(item)
					}else{
						tableMap.set(item.floor,{
							floor:item.floor,
							rooms:[item],
						})
					}
				})
				const arr=[];
				tableMap.forEach((index,key,obj)=>{
					const floorObj={};
					floorObj.floorName=`第${index.floor}层`;
					floorObj.key=key;
					index.rooms.map((item,index)=>{
						floorObj[`room${index}`]=item.roomNo;
						floorObj[`id${index}`]=item.id;
						floorObj[`roomCode${index}`]=item.roomCode;
					})
					arr.push(floorObj)
				})
				const tableDataMap=[...tableMap.values()];
				yield put({
					type:'querySuccess',
					payload:{
						dataSurce:arr,
						orgin:data.data.rooms,
						setHouseNoStatus:false,
						choseRulesStatus:false,
						loading:false,
						isCreate:isCreate,
					}
				})
			}else{
				message.error(data.message)
			}
    },
		*addHouseNumber({payload},{ call, put ,select}){
			const  {data,err}  = yield call(addRooms,{...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				yield put({type:'findAll',payload:{...payload}}),
				message.success('添加成功')
			}else{
				message.error(data.message);
				yield put({type:'querySuccess',
					payload:{setHouseNoStatus:false,loading:false}
				})
			}
		},
		*editRoomsNumber({payload},{ call, put ,select}){
			const  {data,err}  = yield call(editRooms,{...payload});
			if(err){
				return message.error('出错了，请联系管理员');
			}
			if(data.data){
				yield put({type:'findAll',payload:{...payload}}),
				message.success('操作成功')
			}else{
				message.error(data.message);
				yield put({type:'querySuccess',
					payload:{setHouseNoStatus:false,loading:false}
				})
			}
		},
	},
	reducers: {
		querySuccess(state,{payload}){
			return { ...state, ...payload };
		},
	},
}
