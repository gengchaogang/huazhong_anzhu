import React, { PropTypes } from 'react';
import { Upload, Icon, Modal, Button, Menu, Dropdown, Input, message } from 'antd';
import DxLoadingShadow from '../../UI/DxLoadingShadow'
import './index.css';

class DxUpLoadPicItem extends React.Component {
  constructor(props) {
    super(props);
  };
  setName = (e) => {
    const newName = e.target.value;
    if (newName.length !== 0) {
      this.props.reNamePic(this.props.id, e.target.value)
    } else {
      Modal.info({
        title: '提示',
        content: '您输入的内容为空，命名失败！',
        onOk: () => this.props.reNamePic(this.props.id, this.props.name),
        okText: '确定',
      });
    }
  }
  eidtName = () => {
    this.props.editNameCallBack(this.props.id)
  }
  delete = () => {
    Modal.confirm({
      title: '提示',
      content: '确认删除这张图片？',
      onOk: () => this.props.picDeleteCallBack(this.props.id),
      okText: '删除',
      cancelText: '取消',
    });
  }
  onClickOpreat = (key) => {
    if (key === 'editName') {
      this.props.editNameCallBack(this.props.id)
    } else if (key === 'setCover') {
      this.props.picCoverCallBack(this.props.id)
    }
  }
  picOnClick = () => {
    if (this.props.showBig) {
      this.props.handlePreview(this.props.src.split('?')[0]);
    }
  }
  render() {
    const { src, rename, name, isCover, doCover, hideTitle, showBig } = this.props;
    const menu = <Menu onSelect={this.onSelect} className='dx_upload_pic_dropdown'>
      <Menu.Item key='editName'>
        <span className='dx_upload_pic_item_operating_text' onClick={() => this.onClickOpreat('editName')}>编辑名称</span>
      </Menu.Item>
      <Menu.Item key='setCover'>
        <span className='dx_upload_pic_item_operating_text' onClick={() => this.onClickOpreat('setCover')}>设为封面</span>
      </Menu.Item>
    </Menu>
    let operatTypeEle;
    if (!!doCover) {
      operatTypeEle = (!!isCover ? <span className='dx_upload_pic_item_operating_rename' onClick={this.eidtName}>编辑名称</span> : <Dropdown className='dx_upload_pic_item_operating_select' overlay={menu} trigger={['click']}>
        <a className="ant-dropdown-link" href="#">
          操作<Icon type="down" />
        </a>
      </Dropdown>)
    } else {
      operatTypeEle = <span className='dx_upload_pic_item_operating_rename' onClick={this.eidtName}>编辑名称</span>
    }
    return (
      <div className='dx_upload_pic_item'>
        {!!isCover && <b className='dx_upload_pic_item_shadow'>封面</b>}
        <div className={`dx_upload_pic_item_pic ${showBig ? 'dx_upload_pic_item_pic_showBig' : ''}`} style={{ backgroundImage: `URL(${src})` }} onClick={this.picOnClick}></div>
        <div className='dx_upload_pic_item_operating'>
          <span className='dx_upload_pic_item_operating_delete' onClick={this.delete}>删除</span>
          {!hideTitle && operatTypeEle}
        </div>
        {!hideTitle && <div className='dx_upload_pic_item_name_box'>
          {!!rename
            ? <Input className='dx_upload_pic_item_name_edit' autoFocus={!!rename} defaultValue={name} onBlur={this.setName} onPressEnter={this.setName} />
            : <span className='dx_upload_pic_item_name_show' title={name}>{name}</span>
          }
        </div>}
      </div>
    );
  }
}



export default class DxUpLoadPic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      loading: false,
      fileList: [],
    };

  }
  handleCancel = () => {
    this.setState({ previewVisible: false })
  }

  handlePreview = (url) => {
    this.setState({
      previewImage: url,
      previewVisible: true,
    });
  }

  handleChange = ({ file, fileList }) => {
    this.setState({ fileList });
    const { loading } = this.state;
    const { maxNum } = this.props;
    if (file.status == 'error') {
      this.setState({ loading: false });
      message.error('上传失败');
      if (!!this.props.loadCallBack) {
        this.props.loadCallBack(false);
      }
    } else if (file.status == 'done') {
      let getKey = false;
      try {
        if (file.response.status === 'error') {
          getKey = false;
        } else {
          getKey = !!file.response.data.key
        }
      } catch (e) {
        getKey = false;
      }
      if (!!getKey) {
        console.log('getKey', getKey);
        console.log('file', file);
        message.success('上传成功');
        let showPicList = this.props.showPicList;
        const data = file.response.data;
        if (showPicList.length > maxNum - 1) {  //限制图片批量上传超过最大上传张数!
          message.error('超过最大上传数!!');
        } else {
          showPicList.push({
            id: data.key,
            src: data.preview,
            name: file.name,
            rename: false,
            isCover: false,
          });
        }
        this.setState({ loading: false });
        if (!!this.props.loadCallBack) {
          this.props.loadCallBack(true);
        }
        this.props.changeList(showPicList);
      } else {
        if (!!this.props.loadCallBack) {
          this.props.loadCallBack(false);
        }
        this.setState({ loading: false })
        message.error('上传失败');
      }
    } else if (file.status == 'uploading' && !loading) {
      this.setState({ loading: true })
      if (!!this.props.loadCallBack) {
        this.props.loadCallBack(false);
      }
    }
  }
  reNamePic = (id, name) => {
    const showPicList = this.props.showPicList;
    const newShowPicList = showPicList.map((item) => {
      if (item.id !== id) {
        return item;
      } else {
        return Object.assign({}, item, { rename: false, name, });
      }
    });
    this.props.changeList(newShowPicList);
  }
  picDeleteCallBack = (id) => {
    const showPicList = this.props.showPicList;
    let newShowPicList = [];
    showPicList.map((item) => {
      if (item.id !== id) {
        newShowPicList.push(item);
      }
    });
    this.props.changeList(newShowPicList);
  }
  picCoverCallBack = (id) => {
    const showPicList = this.props.showPicList;
    const newShowPicList = showPicList.map((item) => {
      if (item.id !== id) {
        return Object.assign({}, item, { isCover: false });
      } else {
        return Object.assign({}, item, { isCover: true });
      }
    });
    this.props.changeList(newShowPicList);
  }
  editNameCallBack = (id) => {
    const showPicList = this.props.showPicList;
    const newShowPicList = showPicList.map((item) => {
      if (item.id !== id) {
        return item;
      } else {
        return Object.assign({}, item, { rename: true });
      }
    });
    this.props.changeList(newShowPicList);
  }
  beforeUpload = (file) => {
    const { maxSize, picType } = this.props;
    let picTypes = [];
    if (!!picType && picTypes.length !== 0) {
      picTypes = picType;
    } else {
      picTypes = ['image/jpeg', 'image/png'];
    }
    let isRightType;
    if (picTypes.includes(file.type)) {
      isRightType = true;
    } else {
      isRightType = false;
    }
    if (!isRightType) {
      message.error(`图片格式不正确！请上传${picTypes.join('或')}格式的图片`);
    }
    const isLt = file.size / 1024 / 1024 < maxSize;
    if (!isLt) {
      message.error(`上传的图片最大为${maxSize}MB`);
    }
    return isRightType && isLt;
  }
  render() {
    const { maxNum, maxSize, url, showPicList, doCover, hideName, showDetail } = this.props;
    const { previewVisible, previewImage, fileList, loading } = this.state;
    let hideTitle = false;
    if (!!hideName) {
      hideTitle = true;
    }
    let showBig = !!showDetail;
    return (
      <div className='dx_upload_pic'>
        <DxLoadingShadow visible={loading} />
        <div className='dx_upload_pic_list'>
          {showPicList.map(item => <DxUpLoadPicItem {...item} doCover={doCover} renameCallBack={this.reNamePic}
            hideTitle={hideTitle}
            editNameCallBack={this.editNameCallBack}
            handlePreview={this.handlePreview}
            picCoverCallBack={this.picCoverCallBack} picDeleteCallBack={this.picDeleteCallBack}
            showBig={showBig}
            reNamePic={this.reNamePic} key={`list_${item.id}`} />)}
        </div>
        <div className='dx_upload_pic_upload_box'>
          <Upload
            action={url}
            listType='picture-card'
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            showUploadList={false}
            multiple={true}
            beforeUpload={this.beforeUpload}
          >
            {showPicList.length >= maxNum ? null : <div>
              <Icon type="plus" />
              <div className="ant-upload-text">上传实勘图</div>
            </div>}
          </Upload>
          {(maxNum - showPicList.length !== 0) && <div className='dx_upload_pic_upload_msg'>
            <span className='dx_upload_pic_upload_span'>{`剩余${maxNum - showPicList.length}/${maxNum}张`}</span>
            <span className='dx_upload_pic_upload_span'>{`图片大小不超过${maxSize}MB`}</span>
          </div>}
        </div>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
DxUpLoadPic.propTypes = {
  url: PropTypes.string.isRequired,
  maxNum: PropTypes.number.isRequired,
  maxSize: PropTypes.number.isRequired,
  changeList: PropTypes.func.isRequired,
  //调用业务组件的对应的上传loading回调，业务组件对应的标识上传状态的state【不要传给上传组件！！】
  loadCallBack: PropTypes.func,
  doCover: PropTypes.bool.isRequired,
  picType: PropTypes.array,
  hideName: PropTypes.bool,
  showDetail: PropTypes.bool,
  showPicList: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.string.isRequired,
      src: PropTypes.string.isRequired,
      isCover: PropTypes.bool.isRequired,
      rename: PropTypes.bool.isRequired
    })
  ),
};
// DxUpLoadPic.defaultProps= {
//   placeholder:'',
//   buttonTitle:'搜索',
//   type:'default',
// };
