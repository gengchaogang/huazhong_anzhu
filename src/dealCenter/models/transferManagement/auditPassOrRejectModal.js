import lodash from 'lodash';
const defaultState={
		visible:false,
		title:'',
		inputTitle:'',
		message:'请输入',
		placeholder:'在此输入',
		buttonText:'',
		onSubmit:()=>{},
		showPicList:[],
		recordId:null,
		isPass:null,
		hidePeople:false,
		toUserName:null,
};
export default {
	namespace:'auditPassOrRejectModal',
	state:defaultState,
	reducers:{
		setDefaultState(state,action){
			return lodash.cloneDeep(defaultState);
		},
		closeModal(state,action){
			return{...state,...action.payload}
		},
		changeState(state,action){
			return{...state,...action.payload}
		},
		changePicList(state,action){
			return{...state,showPicList:action.payload}
		},
		saveUserName(state,action){
			return{...state,...action.payload}
		},
		setState(state,{payload}){
			return {
				...state,
				...payload
			};
		},
	},
}
