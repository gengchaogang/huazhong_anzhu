import React from 'react'
import { Upload,
  Icon,
   Modal,
   message,
   Input ,
   Select,
   Col,
   Row,
   Menu,
   Dropdown,
   Button
 } from 'antd'
import image from '../assets/yay.jpg'
import './SelectPicture.css'

const Option=Select.Option;
const Dragger=Upload.Dragger;
var Up = require('rc-upload');


function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}


export default class SelectPicture extends React.Component {
  constructor(props){
    super(props);
    console.log(this.props);
    this.state = {
      canUpload:false,
      previewVisible: false,
      previewImage: '',
      fileList: [
        {
          uid: -1,
          name: 'xxx.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          uid: -2,
          name: 'xxx.png',
          status: 'done',
          url: 'http://desk.fd.zol-img.com.cn/t_s960x600c5/g3/M03/0D/03/Cg-4V1S_EOWIMyUCAAhG5zFfIHUAATsVQNFKM0ACEb_770.jpg',
        },
      ],
    };
  }

 _syncUploadFile=(file)=>{
   this.refs.up.refs.inner.post(file);
 }

 _beforeUpload=(file)=>{
   const isJPG = file.type === 'image/jpeg';
   if (!isJPG) {
     message.error('You can only upload JPG file!');
   }
   const isLt2M = file.size / 1024 / 1024 < 2;
   if (!isLt2M) {
     message.error('Image must smaller than 2MB!');
   }
   return isJPG && isLt2M;
 }

 handleCancel = () => this.setState({ previewVisible: false })

 handlePreview = (file) => {
   this.setState({
     previewImage: file.url || file.thumbUrl,
     previewVisible: true,
   });
 }


 handleChange(info) {
   console.log({info});
    let fileList = info.fileList;

    // 1. Limit the number of uploaded files
    //    Only to show two recent uploaded files, and old ones will be replaced by the new
    // fileList = fileList.slice(-2);

    // 2. read from response and show file link
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    // 3. filter successfully uploaded files according to response from server
    fileList = fileList.filter((file) => {
      // if (file.response) {
      //   return file.response.status === 'success';
      // }
      return true;
    });
    console.log(this.props);
    console.log({info});
    this.setState({ fileList });
  }
 _customRequest=(file)=>{

   console.log({file})

 }

 render() {
   const uploadBtn=(
         <p className="ant-upload-drag-icon upload-btn">
           <Icon type="plus" className="upload-plus"/>
         </p>
   );
   const { previewVisible, previewImage, fileList } = this.state;
   const {total,size,btnName,callback}=this.props;

   return (
    <div>
     <div className="selectPicture" >

         {
           fileList.map((item,index)=>(
             <UploadedImg
             {...item}
             key={item.uid+''+index}
             isFaceImg={index===0}
             onSetName={(name)=>{
               let list=fileList;
               list[index]={
                 ...list[index],
                 name,
               };
               this.setState({fileList:list});
             }}
             onSetFace={(img)=>{
               let list=fileList;
               let faceImg=list.splice(index,1)[0];
               list.unshift(faceImg);
               this.setState({fileList:list});
             }}
             onDelete={()=>{
               let list=fileList;
               list.splice(index,1);
               this.setState({fileList:list});
             }}
             onShowLargeImg={()=>this.handlePreview(item)}
             />
           ))
         }
         {
           total-fileList.length>0?
           (
             <div style={{width:180,minWidth:180,float:'left',margin:4}}>
             <Up
              style={{display:'block',width:180,height:120}}
              className="upload-btn"
              ref="up"
              name="file"
              action="/upload"
              headers={{
                method:'POST',
              }}
              forceAjax={false}
              multiple={false}
              onChange={this.handleChange}
              beforeUpload={(_file)=>{
                console.log('breforeUp',_file);
                let validate=this._beforeUpload(_file);
                if(validate){
                  if(this.props.async){
                    //async
                    return new Promise(resolve=>{
                      if(!this.files){
                        this.files=[];
                      }
                      this.files.push(_file);
                      var fileReader= new FileReader();
                      fileReader.onload=(file)=>{
                        var url=fileReader.result;
                        var list =fileList;

                        list.push({
                          uid: _file.uid,
                          name:_file.name,
                          status: 'done',
                          url:url,
                        });

                        this.setState({fileList:list});
                      }
                      fileReader.readAsDataURL(_file);
                    })
                  }
                  else{
                    //sync
                    return _file;
                  }
                }
                else{
                  return false;
                }
              }}
              withCredentials={false}
              className="upload-btn"
             >
                <Icon type="plus" className="plus"/>
             </Up>
             <ul className="upload-discrib">
               <li>剩余{total-fileList.length}/{total}张</li>
               <li>图片尺寸最大不超过{size}M</li>
             </ul>
             </div>
           )
           :
           null
         }
         <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
     </div>
     {
       this.props.async?
       <div>
         <Button type="primary" onClick={function (){
           // callback
           var canUpload;
           if(callback){
             let canUpload=new Promise(resolve=>{
                  const result=callback();
                  resolve(result);
             });
             if(canUpload){
               if(this.files instanceof Array){
                 this.files.forEach(file=>this.refs.up.refs.inner.post(file));
               }
             }
             else{
              //  ...
             }
           }
         }}>{btnName?btnName:"保存"}</Button>
       </div>
       :null
     }
   </div>
   )
 }
}


class UploadedImg extends React.Component{
  constructor(props){
    super(props);
    this.state={
      showHandler:false,
      editable:false,
      imgName:'',
      isFaceImg:false,
    };
  }
  componentDidMount(){
    this.setState({
      imgName:this.props.name,
      isFaceImg:this.props.isFaceImg
    })
  }
  showHandler=()=>{
    this.setState({showHandler:!this.state.showHandler})
  }
  _setImgName=()=>{
    const nam=this.state.imgName;
    var arr=nam.split('.');
    var isAName=/png|jpg|bmp|gif/.test(arr[arr.length-1]);
    if(isAName){
      this.props.onSetName(nam);
      this.setState({editable:false});
    }
    else{
      message.error('请输入合法的名称！');
    }
  }
  render(){
    const {name,uid,url,status}=this.props;
    const width=180;const height=120;
    const menu = (
  <Menu>
    <Menu.Item>
        <a onClick={()=>this.setState({
          showHandler:!this.state.showHandler
        },
        ()=>this.props.onSetFace({name,uid,url,status})
      )}>设为封面</a>
    </Menu.Item>
    <Menu.Item>
      <a onClick={()=>this.setState({
        showHandler:!this.state.showHandler},
        ()=>this.setState({editable:true})
      )}>设置名称</a>
    </Menu.Item>
  </Menu>);


    return (
      <div className="uploadImg" style={{width}}>
      <div className="img-box" style={{width,height}}>
        <img  src={url}  className="img-responsive"/>
      </div>
      <div style={{overflow:'hidden'}}>
        <a style={{float:'left'}}
          onClick={()=>{
            let isDelete=confirm('确认删除？');
            isDelete&&this.props.onDelete()
          }}
          className="img-delete"
        >删除</a>
        <div style={{float:'right'}}>
          <Dropdown
          onVisibleChange={()=>this.setState({showHandler:!this.state.showHandler})}
          overlay={menu}
          trigger={['click']}
          >
            <Icon
              type={this.state.showHandler?"caret-up":"caret-down"}
              className="img-handle"/>
          </Dropdown>
        </div>
      </div>
      <div className="img-name-box">
        {
          this.state.editable?
          <Input
            placeholder="请输入名称"
            maxLength={100}
            autoFocus={true}
            value={this.state.imgName}
            onChange={e=>this.setState({imgName:e.target.value})}
            onBlur={this._setImgName}
            className="img-name"
          />:
          <a onClick={this.props.onShowLargeImg} className="img-name">{name}</a>
        }
      </div>
      <div className="face" style={this.state.isFaceImg?{display:"block"}:{}}>封面</div>
    </div>
    );
  }
}
