import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Form, Input,Table,Button,Tree,Row,Col,Modal,Cascader} from 'antd';
import DxPanel from '../../../commons/components/DxPanel'
import DxTree from '../../../commons/View/DxTree'
import RichText from '../../components/richText/RichText'
import {
  Editor,
  EditorState,
  RichUtils ,
  Entity,
  CompositeDecorator,
  convertToRaw,
} from 'draft-js';
import './TrainContent.css'
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 14 },
};
function TrainRichTest({dispatch,form,trainRichTest}) {
  const {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }=form;
  const {richAreaOptions,isRichText,content,key,trainId,
    articleId,richArea,headline
  }=trainRichTest;
  const propsFun=(key)=>{
    dispatch({
      type:'trainRichTest/initail',
      payload:{
        content:key,
      }
    })
  }
  const uploadImgKey=(key)=>{
    // console.log(key,'key');
    dispatch({
      type:'trainRichTest/initail',
      payload:{key:key}
    })
  }
  const onOk=()=>{
    form.validateFields((err,values)=>{
      let areaPath='';
      if(!!values.richArea){
        areaPath='/'+values.richArea.join('/');
      }
      if(!!articleId){
        console.log('进入>>>>>>>>>>');
        dispatch({
          type:'trainRichTest/editContent',
          payload:{
            headline:values.headline,
            trainId:trainId,
            areaPath:areaPath,
            content:content,
            trainName:'培训',
            articleId:articleId,
            key:key,
          }
        })
      }else{
        dispatch({
          type:'trainRichTest/addContentOk',
          payload:{
            headline:values.headline,
            trainId:trainId,
            areaPath:areaPath,
            content:content,
            key:key,
          }
        })
      }

    })
  }
  const goback=()=>{
    dispatch(routerRedux.goBack());
    dispatch({
      type:'trainRichTest/setState',
      payload:{
        content:'',
        isRichText:false,
        articleId:'',
        richArea:'',
    		headline:'',
      }
    })
  }
  return (
    <DxPanel title='富文本'>
      <Form>
        <Row>
          <Col span={16}>
            <FormItem label='城市区域' {...formItemLayout}>
              {getFieldDecorator('richArea', {
                initialValue:richArea,
              })(
                <Cascader options={richAreaOptions} changeOnSelect={true}/>
              )}
            </FormItem>
          </Col>
          <Col span={16}>
            <FormItem label='文章标题'
              {...formItemLayout}
            >
              {getFieldDecorator('headline', {
                initialValue:headline,
              })(
                <Input placeholder='文章标题'/>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div>
        {content && articleId &&
        <RichText istrue={isRichText} rawContent={content}
          uploadImgKey={uploadImgKey}
          propsFun={propsFun}/>
        }
        {!articleId &&
          <RichText istrue={false} rawContent={content}
            uploadImgKey={uploadImgKey}
            propsFun={propsFun}/>
        }
      </div>
      <Button onClick={onOk} type='primary'>保存</Button>
      <Button onClick={goback} type='ghost'>返回</Button>
    </DxPanel>
  );
}

function mapStateToProps({trainRichTest}) {
  return {trainRichTest }
}

export default connect(mapStateToProps)(Form.create()(TrainRichTest));
