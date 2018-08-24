import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button ,Checkbox } from 'antd';
import DxPanel from '../../../../commons/components/DxPanel'
import DxUpLoadPic from '../../../../commons/View/DxUpLoadPic'
import './PhotoManagement.css'
function PhotoManagement({dispatch,photoManagement }) {
  const {showPicList,
    id,
  }=photoManagement;
  const shopsUplod={
    url:'/miss-anzhu-aliyun-file/putfile',
    maxNum:20,//最大上传数
    maxSize:2,//文件大小限值
    showPicList:showPicList,//state管理图片list
    doCover:true,
    changeList:(data)=>{
      console.log(data,'datadata');
      dispatch({
        type:'photoManagement/showPic',
        payload:data
      })
    },//更新list回调
  }
  //上传保存
  const uploadSave=()=>{
    const showPicLists=[];
    const showNullPic=[];
    if(!showPicList.length==0){
      let bool=showPicList.every((item,index)=>item.isCover===false);
      if(bool){
         showPicList[0].isCover=true
      }
      showPicList.map(item=>(
        showPicLists.push({
          url:item.id,
          comment:item.isCover,
        })
      ))
      dispatch({
        type:'photoManagement/uploadSave',
        payload:{
          keys:showPicLists,
          id:id,
        }
      })
    }
    else{
      dispatch({
        type:'photoManagement/uploadSave',
        payload:{
          keys:showNullPic,
          id:id,
        }
      })
    }
  }
  const goBack=()=>{
    dispatch(routerRedux.goBack());
  }
  return (
    <div>
      <DxPanel title='相册管理'>
        <p>注意事项：</p>
        <p>1.上传图片大小不超过2M</p>
        <p>2.最多上传20张图片</p>
        <p>3.图片支持jpg、png、bmp、gif格式</p>
        <p>4.图片内容清晰</p>
        <p>5.默认首长作为封面图</p>
        <div className='uploadParent'>
          <DxUpLoadPic {...shopsUplod}/>
        </div>
      </DxPanel>
      <div className='goBack'>
        <Button type='primary' onClick={uploadSave}>保存</Button>
        <Button type='ghost' onClick={goBack}>返回</Button>
      </div>
    </div>
  );
}

function mapStateToProps({photoManagement}) {
  return {photoManagement }
}

export default connect(mapStateToProps)(PhotoManagement);
