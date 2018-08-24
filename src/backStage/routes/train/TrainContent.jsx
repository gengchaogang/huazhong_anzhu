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
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
function TrainContent({dispatch,form,trainContent }) {
  const {dataTree,titleTree,dataSource,defaultType,
    articleCategory,pageNo,total,keyword,typeName,editTypeStatus,
    addContentStatus,content,isRichText,articleId,richAreaOptions,
    richArea,headline,key,
  }=trainContent;
  const {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }=form;
  const columns=[
    {
      title:'序号',
      dataIndex:'number',
    },
    {
      title:'发布时间',
      dataIndex:'sendDate',
    },
    {
      title:'文章标题',
      dataIndex:'headline',
    },
    {
      title:'阅读',
      dataIndex:'readNO',
    },
    {
      title:'点赞',
      dataIndex:'clik',
    },
    {
      title:'收藏',
      dataIndex:'collect',
    },
    {
      title:'评论',
      dataIndex:'comment',
    },
    {
      title:'操作',
      render:(record,text)=>{
        if(record.status=='待发布'){
          return (
            <div>
              <span className='operationsColor' onClick={()=>{watchClick(record.key)}}>查看</span>
              <span className='operationsColor' onClick={()=>{deleteAritle(record)}}>删除</span>
              <span className='operationsColor' onClick={()=>{releaseAritle(record)}}>发布</span>
              {!!record.recommend?
                <span className='operationsColor' onClick={()=>{recommend(record)}}>推荐</span>:
                <span className='operationsColor' onClick={()=>{cancelRecommend(record)}}>取消推荐
              </span>}
            </div>
          )
        }else{
          return (
            <div>
              <span className='operationsColor' onClick={()=>{watchClick(record.key)}}>查看</span>
              <span className='operationsColor' onClick={()=>{cancelReleaseAritle(record)}}>取消发布</span>
              {!!record.recommend?
                <span className='operationsColor' onClick={()=>{recommend(record)}}>推荐</span>:
                <span className='operationsColor' onClick={()=>{cancelRecommend(record)}}>取消推荐
              </span>}
            </div>
          )
        }
      }
    },
  ]
  //推荐
  const recommend=(key)=>{
    Modal.confirm({
      title: '提示',
      content: '确认要推荐？',
      onOk() {
        dispatch({
          type:'trainContent/recommend',
          payload:{
            articleId:key.key,
            type:key.type,
            keyword:keyword,
            pageNo:pageNo-1,
          }
        })
      },
      onCancel() {},
    });
  }
  //取消推荐
  const cancelRecommend=(key)=>{
    Modal.confirm({
      title: '提示',
      content: '确认取消推荐？',
      onOk() {
        dispatch({
          type:'trainContent/cancelRecommend',
          payload:{
            articleId:key.key,
            type:key.type,
            keyword:keyword,
            pageNo:pageNo-1,
          }
        })
      },
      onCancel() {},
    });
  }
  //发布
  const releaseAritle=(key)=>{
    Modal.confirm({
      title: '发布',
      content: '确认要发布？',
      onOk() {
        dispatch({
          type:'trainContent/releaseAritle',
          payload:{
            articleId:key.key,
            type:key.type,
            keyword:keyword,
            pageNo:pageNo-1,
          }
        })
      },
      onCancel() {},
    });
  }
  //取消发布
  const cancelReleaseAritle=(key)=>{
    Modal.confirm({
      title: '发布',
      content: '确认要取消发布？',
      onOk() {
        dispatch({
          type:'trainContent/cancelReleaseAritle',
          payload:{
            articleId:key.key,
            type:key.type,
            keyword:keyword,
            pageNo:pageNo-1,
          }
        })
      },
      onCancel() {},
    });
  }
  //查看
  const watchClick=(key)=>{
    // dispatch({
    //   type:'trainContent/findTrainArea'
    // })
    dispatch(routerRedux.push({
			pathname: `/train/trainContent/trainRichTest`,
      state:{articleId:key}
		}));
    // dispatch({
    //   type:'trainContent/watchClick',
    //   payload:{
    //     articleId:key,
    //   }
    // })
  }
  //删除文章
  const deleteAritle=(key)=>{
    Modal.confirm({
      title: '删除',
      content: '确认要删除？',
      onOk() {
        dispatch({
          type:'trainContent/deleteAritleType',
          payload:{
            articleId:key.key,
            type:key.type,
            keyword:keyword,
            pageNo:0,
          }
        })
      },
      onCancel() {},
    });
  }
  //选择文章类别
  const selectedTree=(key,e)=>{
    dispatch({
      type:'trainContent/selectedTreeTable',
      payload:{
        type:key[0],
        id:(!!e.selectedNodes[0] && e.selectedNodes[0].props.value),
      }
    })
  }
  //删除文章分类
  const deleteType=()=>{
    if(!!defaultType){
      Modal.confirm({
        title: '删除',
        content: '确认要删除？',
        onOk() {
          dispatch({
            type:'trainContent/deleteType',
            payload:{
              trainId:defaultType.id,
            }
          })
        },
        onCancel() {},
      });
    }
  }
  //添加分类
  const addType=()=>{
    dispatch({type:'trainContent/initail',
      payload:{articleCategory:true,
        editTypeStatus:false,
      }
    })
  }
  //编辑分类
  const editType=()=>{
    dispatch({type:'trainContent/initail',
      payload:{articleCategory:true,
        editTypeStatus:true,
        typeName:defaultType.name,
      }
    })
  }
  //确认添加文章类别
  const articTypeOk=()=>{
    form.validateFields((err,values)=>{
      if (err) {
				return;
			}
      console.log(values,'values');
      if(editTypeStatus==false){
        dispatch({type:'trainContent/articTypeOk',
          payload:{
            type:values.name,
          }
        })
      }else{
        dispatch({type:'trainContent/articTypeEditOk',
          payload:{
            type:values.name,
            trainId:defaultType.id,
          }
        })
      }
    })
    resetFields();
  }
  const articTypeCancel=()=>{
    resetFields();
    dispatch({type:'trainContent/initail',
      payload:{articleCategory:false,
        typeName:'',
      }
    })
  }
  //分页
  const pagination={
    current:pageNo,
    total:total,
    showTotal:total => `共 ${total} 项`,
    onChange:(page)=>{
      dispatch({
        type:'trainContent/pagination',
        payload:{
          keyword:keyword,
          pageNo:page-1,
          type:defaultType.name,
        }
      })
    }
  }
  //搜索
  const handleSubmit=()=>{
    form.validateFields((err, values)=>{
      dispatch({
        type:'trainContent/pagination',
        payload:{
          keyword:values.keyword,
          type:defaultType.name,
        }
      })
    })
  }
  const handleReset=()=>{
    form.validateFields((err, values)=>{
      dispatch({
        type:'trainContent/pagination',
        payload:{
          keyword:'',
          type:defaultType.name,
        }
      })
    })
    resetFields();
  }
  const propsFun=(key)=>{
    dispatch({
      type:'trainContent/initail',
      payload:{
        content:key,
      }
    })
  }
  const uploadImgKey=(key)=>{
    console.log(key,'key');
    dispatch({
      type:'trainContent/initail',
      payload:{key:key}
    })
  }
  const addContent=()=>{
    dispatch({
      type:'trainContent/findTrainArea'
    })
    dispatch({
      type:'trainContent/initail',
      payload:{
        addContentStatus:true,
      }
    })
  }
  const addContentOk=()=>{
    form.validateFields((err,values)=>{
        if(isRichText===true){
          dispatch({
            type:'trainContent/editContent',
            payload:{
              headline:values.headline,
              trainId:defaultType.id,
              areaPath:'/'+values.richArea.join('/'),
              content:content,
              trainName:'培训',
              articleId:articleId,
              key:key,
            }
          })
        }else{
          dispatch({
            type:'trainContent/addContentOk',
            payload:{
              headline:values.headline,
              trainId:defaultType.id,
              areaPath:'/'+values.richArea.join('/'),
              content:content,
              key:key,
            }
          })
        }
    })
    resetFields();
  }
  const addContentCancel=()=>{
    dispatch({
      type:'trainContent/initail',
      payload:{
        isRichText:false,
        addContentStatus:false,
        headline:'',
        richArea:[],
      }
    })
  }
  const addNewContent=()=>{
    dispatch(routerRedux.push({
			pathname: `/train/trainContent/trainRichTest`,
      state:{trainId:defaultType.id}
		}));
  }
  return (
    <div>
      <Form inline style={{margin:'20px 0'}}>
				<Row type="flex" align="middle" >
					<FormItem
						label="关键字"
					>
						{getFieldDecorator('keyword', {
						})(
							<Input placeholder='搜索文章标题'/>
						)}
					</FormItem>
					<Button style={{margin:'0 6px 0 0'}}  onClick={handleSubmit} type="primary" icon="search">搜索</Button>
					<Button  onClick={handleReset} type='default'>重置</Button>
				</Row>
			</Form>
      <Row>
        <Col span={4}>
          <div className='train_left'>
            <p>培训文章分类</p>
            <Tree
              onSelect={(expandedKeys,e)=>{selectedTree(expandedKeys,e)}}
              selectedKeys={[defaultType.name]}
            >
              <TreeNode value={titleTree} title={titleTree} key={titleTree}>
                {!!dataTree && dataTree.map((item,index)=>(
                  <TreeNode value={item.id} title={item.type} key={item.type}/>
                ))}
              </TreeNode>
            </Tree>
          </div>
        </Col>
        <Col span={20}>
          <div className='train_right'>
            <span>分类：{defaultType.name}</span>
            <Button type='primary' onClick={addType}>添加</Button>
            {defaultType.id==false ||defaultType.id=='培训' ?
              <div className='inlineBlock'>
                <Button type='ghost' disabled>编辑</Button>
                <Button type='ghost' disabled>删除</Button>
              </div>
              :
              <div className='inlineBlock'>
                <Button type='primary' onClick={editType}>编辑</Button>
                <Button type='primary' onClick={deleteType}>删除</Button>
              </div>
            }
            {/*defaultType.id=='培训' || defaultType.id==false?
              <Button type='ghost' disabled>添加内容</Button>:
              <Button type='primary' onClick={addContent}>添加内容1</Button>
            */}
            {defaultType.id=='培训' || defaultType.id==false?
              <Button type='ghost' disabled>添加内容</Button>:
              <Button type='primary' onClick={addNewContent}>添加内容</Button>
            }
            <Table columns={columns}
              dataSource={dataSource}
              pagination={pagination}
            />
          </div>
        </Col>
      </Row>
      {/*添加类型或者编辑类型的模态框*/}
      <Modal visible={articleCategory}
        title={editTypeStatus==true?'编辑':'添加'}
        onOk={articTypeOk} onCancel={articTypeCancel}
      >
        <Form>
          <FormItem
            label='文章分类名称'
            {...formItemLayout}
          >
            {getFieldDecorator('name', {
              initialValue:typeName,
              rules: [
                { required: true, message: '请输入名称' },
              ],
            })(
              <Input type='text' placeholder='请输入名称'/>
            )}
          </FormItem>
        </Form>
      </Modal>
      <Modal visible={addContentStatus} onOk={addContentOk}
        onCancel={addContentCancel} title='富文本'
      >
        {/*<Form>
          <FormItem label='城市区域' {...formItemLayout}>
            {getFieldDecorator('richArea', {
              initialValue:richArea,
              // rules: [
              //   { required: true, message: '必填' },
              // ],
						})(
							<Cascader options={richAreaOptions}/>
						)}
          </FormItem>
          <FormItem label='文章标题'
            {...formItemLayout}
          >
            {getFieldDecorator('headline', {
              initialValue:headline,
              // rules: [
              //   { required: true, message: '必填' },
              // ],
						})(
							<Input placeholder='文章标题'/>
						)}
          </FormItem>
        </Form>*/}
        {/*!!addContentStatus &&
        <RichText istrue={isRichText} rawContent={content}
          uploadImgKey={uploadImgKey}
        propsFun={propsFun}/>*/}
      </Modal>
    </div>
  );
}

function mapStateToProps({trainContent}) {
  return {trainContent }
}

export default connect(mapStateToProps)(Form.create()(TrainContent));
