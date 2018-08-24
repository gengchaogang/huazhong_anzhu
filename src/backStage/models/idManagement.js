
// 				},
// 				brokerInfo:{},
// 				nameCertificateInfo:{},
// 				careerCertificate:{},
// 				freezeInfo:{},
// 			},
// 		},
// 		//导师账号index页面
// 		advisorIdIndex:{},
// 		//交易中心账号index页面
// 		dealCenterIdIndex:{},
// 		//代理商账号index页面
// 		agentIdIndex:{},
// 	},
// 	effects: {
// 	},
// 	reducers: {
// 		setState(state,{payload}){
// 			return { ...state, ...payload };
// 		},
// 	},
// 	subscriptions:{
// 		setup({ dispatch, history }) {
// 			history.listen(location => {
// 				if (location.pathname === '/idManagement/brokerIdIndex') {
// 					// dispatch({type:'query',payload:{}});
// 				}
// 			});
//
// 		},
// 	}
// }
