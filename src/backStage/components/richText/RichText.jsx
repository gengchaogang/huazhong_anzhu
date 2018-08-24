import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import {
  Editor,
  EditorState,
  AtomicBlockUtils,
  RichUtils ,
  Entity,
  CompositeDecorator,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import Immutable from 'immutable';
import  './RichText.css'
import DxLoadingShadow from '../../../commons/UI/DxLoadingShadow'
import { Form, Input,Table,Button,Tree,Row,Col,Modal,Upload,message} from 'antd';
//////////////////////////////////

class RichText extends React.Component {
  constructor(props) {
    super(props);
    const decorator = new CompositeDecorator([
      {
          // 查找方法
          strategy: getEntityStrategy('IMMUTABLE'),
          // 元素
          component: TokenSpan,
      },
      {
          strategy: getEntityStrategy('MUTABLE'),
          component: TokenSpan,
      },
      {
          strategy: getEntityStrategy('SEGMENTED'),
          component: TokenSpan,
      },
    ]);
    this.state = {
      // editorState:EditorState.createEmpty(decorator),
      editorState:((this.props.istrue===true)?
        (EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.rawContent)),decorator)):
        (EditorState.createEmpty(decorator))),
      showURLInput: false,
      url: '',
      urlType: 'image',
      key:'',
      dxLoading:false,
    };
    this.focus = () => this.refs.editor.focus();
    // this.logState = () => {
    //   const content = this.state.editorState.getCurrentContent();
    //   console.log(convertToRaw(content));
    // };
    this.onChange = (editorState) =>{ this.setState({editorState});
      this.props.propsFun(JSON.stringify(convertToRaw(editorState.getCurrentContent())))
    };
    this.onURLChange = (e) => this.setState({urlValue: e.target.value});
    // this.addAudio = this._addAudio.bind(this);
    this.addImage = this._addImage.bind(this);
    // this.addVideo = this._addVideo.bind(this);
    this.confirmMedia = this._confirmMedia.bind(this);
    // this.handleKeyCommand = this._handleKeyCommand.bind(this);
    this.onURLInputKeyDown = this._onURLInputKeyDown.bind(this);
    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.onTab = (e) => this._onTab(e);
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);

  }
  // componentDidMount(){
  //   // console.log(this.props.rawContent,'...');
  //   console.log(convertFromRaw(JSON.parse(this.props.rawContent)),'raw');
  //   if(!!this.props.rawContent){
  //     this.setState(convertFromRaw(JSON.parse(this.props.rawContent)))
  //   }
  // }
  componentWillUnmount(){
    const {editorState} = this.state;
    EditorState.undo(editorState: EditorState);
  }
  uploadImg=(key)=>{
    this.props.uploadImgKey(key)
  }
  _handleKeyCommand(command) {
    const {editorState} = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }
  _onTab(e) {
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
  }

  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }
  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }
  _confirmMedia(e) {
    e.preventDefault();
    const {editorState, urlValue, urlType,urlImg} = this.state;
    this.props.uploadImgKey(this.state.key)
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      urlType,
      'IMMUTABLE',
      {src: urlImg}
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(
      editorState,
      {currentContent: contentStateWithEntity}
    );
    this.setState({
      editorState: AtomicBlockUtils.insertAtomicBlock(
        newEditorState,
        entityKey,
        ' '
      ),
      showURLInput: false,
      urlValue: '',
    }, () => {
      setTimeout(() => this.focus(), 0);
    });
  }
  _onURLInputKeyDown(e) {
    if (e.which === 13) {
      this._confirmMedia(e);
    }
  }
  _promptForMedia(type) {
    const {editorState} = this.state;
    this.setState({
      showURLInput: true,
      urlValue: '',
      urlType: type,
    }, () => {
      setTimeout(() => this.refs.url.focus(), 0);
    });
  }
  _addImage() {
    this._promptForMedia('image');
  }
  render() {
    let urlInput;
    if (this.state.showURLInput) {
      urlInput =
        <div style={styles.urlInputContainer}>
          <input
            style={{'visibility':'hidden'}}
            onChange={this.onURLChange}
            ref="url"
            style={styles.urlInput}
            type="text"
            value={this.state.urlValue}
            onKeyDown={this.onURLInputKeyDown}
          />
        <Button onMouseDown={this.confirmMedia} style={styles.positionSrue}>
            确定
          </Button>
        </div>;
    }
    const {editorState} = this.state;
    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    // console.log(convertFromRaw(this.props.rawContent),'./.');
    let className = 'RichEditor-editor';
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }
    const uploadProps={
      showUploadList:false,
      name:"file",
      method:"post",
      action:"/miss-anzhu-aliyun-file/putfile",
      beforeUpload:(file)=>{
        console.log(file);
        if(file.size==0 || file.size>1024000000){
          message.error('上传失败,文件不能为空或大于10M')
          return false
        }
      },
      onChange:(info)=>{
        // dispatch({type:'contractAgreementModulesManage/initailSuccess',
        //   payload:{dxLoading:true}
        // })
        this.setState({dxLoading:true})
        if(!!info&&info.file.status==='done'){
          if(!!info.file.response&&info.file.response.status==='success'){
            if(!!info.file.response.data.key){
              // dispatch({
              //   type:'trainContent/initail',
              //   payload:{
              //     key:info.file.response.data.key,
              //     dxLoading:false,
              //   }
              // })
              this.setState({
                key:info.file.response.data.key,
                urlImg:info.file.response.data.preview,
                dxLoading:false,
              })
              message.success('上传成功')
            }else{
              message.error('上传失败')
            }
          }
        }
      }
    }
    return (
      <div style={styles.root}>
        <div style={styles.buttons}>
          <DxLoadingShadow visible={this.state.dxLoading}/>
          <Upload {...uploadProps}>
            <Button onMouseDown={this.addImage} style={{marginRight: 10}}>
              插入图片
            </Button>
          </Upload>
        </div>
        {urlInput}
        <BlockStyleControls
          editorState={editorState}
          onToggle={this.toggleBlockType}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={this.toggleInlineStyle}
        />
        <div style={styles.editor} onClick={this.focus}>
          <Editor
            blockRendererFn={mediaBlockRenderer}
            editorState={this.state.editorState}
            customStyleMap={styleMap}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            onTab={this.onTab}
            placeholder="Tell a story..."
            ref="editor"
            spellCheck={true}
          />
        </div>

      </div>
    );
  }
}
// <Button onClick={this.logState}>Log State</Button>
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};
class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

const BLOCK_TYPES = [
  {label: 'H1', style: 'header-one'},
  {label: 'H2', style: 'header-two'},
  {label: 'H3', style: 'header-three'},
  {label: 'H4', style: 'header-four'},
  {label: 'H5', style: 'header-five'},
  {label: 'H6', style: 'header-six'},
  // {label: 'Blockquote', style: 'blockquote'},
  // {label: 'UL', style: 'unordered-list-item'},
  // {label: 'OL', style: 'ordered-list-item'},
  // {label: 'Code Block', style: 'code-block'},
];

const BlockStyleControls = (props) => {
  const {editorState} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

var INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD'},
  {label: 'Italic', style: 'ITALIC'},
  {label: 'Underline', style: 'UNDERLINE'},
  {label: 'Monospace', style: 'CODE'},
];

const InlineStyleControls = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};
function mediaBlockRenderer(block) {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    case 'atomic': return  {
      component: Media,
      editable: false,
    };
    default: return null;
  }
  // if (block.getType() === 'atomic') {
  //   return {
  //     component: Media,
  //     editable: false,
  //   };
  // }

  return null;
}
const TokenSpan = (props) => {

    // 获取样式
    const style = getDecoratedStyle(
        Entity.get(props.entityKey).getMutability()
    );
    return (
        <span {...props} style={style}>
            {props.children}
          </span>
    );
};
function getEntityStrategy(mutability) {
  return function (contentBlock, callback) {
    contentBlock.findEntityRanges(
      (character) => {
          const entityKey = character.getEntity();
          if (entityKey === null) {
              return false;
          }
          return Entity.get(entityKey).getMutability() === mutability;
      },
      callback
    );
  };
}
function getDecoratedStyle(mutability) {
    switch (mutability) {
        case 'IMMUTABLE':
            return styles.immutable;
        case 'MUTABLE':
            return styles.mutable;
        case 'SEGMENTED':
            return styles.segmented;
        default:
            return null;
    }
}
const Image = (props) => {
  return <img src={props.src} style={styles.media} />;
};

const Media = (props) => {
  const entity = props.contentState.getEntity(
    props.block.getEntityAt(0)
  );
  const {src} = entity.getData();
  const type = entity.getType();

  let media;
  if (type === 'image') {
    media = <Image src={src} />;
  }

  return media;
};

const styles = {
  root: {
    fontFamily: '\'Georgia\', serif',
    padding: 20,
    minWidth: 800,
  },
  positionSrue:{
    position:'relative',
    bottom:38,
    right:60,
  },
  buttons: {
    marginBottom: 10,
  },
  urlInputContainer: {
    marginBottom: 10,
  },
  urlInput: {
    fontFamily: '\'Georgia\', serif',
    marginRight: 10,
    padding: 3,
    visibility:'hidden',
  },
  editor: {
    border: '1px solid #ccc',
    cursor: 'text',
    minHeight: 300,
    padding: 10,
  },
  button: {
    marginTop: 10,
    textAlign: 'center',
  },
  media: {
    width: '20%',
  },
};
RichText.propTypes = {
};
// function mapStateToProps({richText}) {
//   return {richText }
// }
export default RichText;
