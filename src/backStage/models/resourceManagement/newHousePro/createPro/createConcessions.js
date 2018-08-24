export default {
  namespace: 'createConcessions',
  state: {
    //控制表格组件
    selectedRowKeys: [],
    delLoading: false,
    total:165,
    pageSize:10,
    currentPage:null,
    //控制创建团购的modal
    submitLoading: false,
    modalVisible: false,
    applicability:'',//适用范围
    //控制编辑模态框
    eidt_modalVisible:false,
    edit_submitLoading:false,
    eidt_applicability:'',
    edit_record:{
      key: null,
      xh: null,
      yhmc:null,
      yhje:null,
      sxje:null,
      hdyxq:null,
      sylx:null,
      tgsdfy:null,
      cjsj:null,
    },
  },
  reducers: {
    //控制表格组件
    onSelectChange(state,action) {
      // console.log('action',action);
      return {...state,...action.payload};
    },
    //改变删除按钮loading;
    changeDelLoading(state,action){
      return {...state,...action.payload};
    },
    //控制创建团购的modal
    changeVisible(state,action){
      console.log('in models changeVisible action???',action);
      return {...state,...action.payload};
    },
    //控制创建团购的modal中的表单
    changeApplicability(state,action){
      return {...state, ...action.payload };
    },
    changeSubmitLoading(state,action){
      return {...state, ...action.payload };
    },
    //控制editmodal的visible
    changeEditVisible(state,action){
      console.log('in models changeVisible action???',action);
      return {...state,...action.payload};
    },

  },
}
