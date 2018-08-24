export default{
  namespace:'CreateHouseType',
  state:{
    previewVisible:false,
    previewImage:'',
    fileList: [{
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }],
  },
  reducers:{
    handleCancel(state){
      return{...state,previewVisible:!state.previewVisible}
    },
    handlePreview(state,anction){
      return{...state,previewImage: anction.payload.url || anction.payload.thumbUrl,previewVisible:!state.previewVisible}
    },
    handleChange(state,anction){
      return{...state,fileList:anction.payload.fileList}
    }
  }
}
