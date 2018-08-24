export default {
  namespace: 'uploadAptitude',
  state: {
    previewVisible: false,
    previewImage: '',
    // fileList1: []
fileList1: [{
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }]
  },
  reducers: {
    //控制表格组件
    changeVisiblePreviewImage(state,action) {
      // console.log('action',action);
      return {...state,...action.payload};
    },

  },
}