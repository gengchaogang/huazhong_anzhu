import React from 'react'
import {Steps,Table,Modal,Button,Form,Row,Col,Input,Checkbox,Timeline} from 'antd'
import { routerRedux } from 'dva/router'
import {connect} from 'dva'
import TextWithIconLeft from '../../../commons/UI/TextWithIconLeft'
import img4 from '../../assets/4.jpg'
const Step=Steps.Step;
const FormItem=Form.Item;
function ApplyTransfer({dispatch,secondDeal}){
  const {showHandleTransferModal}=secondDeal
  const {ApplyTransferCurrent}=secondDeal
  const {isApplyTransferWrote}=secondDeal

  const handleBack=()=>{
    dispatch(routerRedux.push('/dealManagement/secondHouseSellDeal/HouseResourceInfo'))
  }
  const showModal=()=>{
    dispatch({
      type:'secondDeal/setState',
      payload:{
        showHandleTransferModal:true
      }
    })
  }

  const toHouseResourceIndex=()=>{
    dispatch(routerRedux.push('/dealManagement/secondHouseSellDeal/HouseResourceInfo'))
  }
  const dataSource=[
    {
      key:'-1',
      fybh:332005469041,
      ssxq:'远洋山水',
      fyxx:'A区/1号楼/1单元/7层/7002室',
      fymj:'100㎡',
      td:'满五唯一',
      fydj:'1000元/㎡',
      fyzj:"200万/套",
      zcdk:'支持',
      cz:'交易详情'
    }
  ];
  const columns=[
    {
      key:'1',
      title:'房源编号',
      render:(text,record,index)=>{
      return(
          <a href='#' onClick={toHouseResourceIndex}>332005469041</a>
      )
      }
    },
    {
      key:'2',
      title:'所属小区',
      dataIndex:'ssxq'
    },
    {
      key:'3',
      title:'房源信息',
      render:(text,record,index)=>{
        return(
          <a href="#">A区域/1号楼/1单元/7层/7002室</a>
        )
      }
    },
    {
      key:'4',
      title:'房源面积',
      dataIndex:'fymj'
    },
    {
      key:'5',
      title:'特点',
      dataIndex:'td'
    },
    {
      key:'6',
      title:'房源单价',
      dataIndex:'fydj'
    },
    {
      key:'7',
      title:'房源总价',
      dataIndex:'fyzj',
    },
    {
      key:'8',
      title:'支持贷款',
      dataIndex:'zcdk'
    },{
      key:'9',
      title:'操作',
      render:(text,record,index)=>{
        return(
          <a href='#'>交易详情</a>
        )
      }
    }
  ];
  const tableProps={
    columns,
    dataSource,
    className:'anzhu_table_tr',
    pagination:false,
    title:()=>{return("过户房源")}
  };
  const data=['意向金已支付','首付款已支付','中介佣金已支付','贷款已批'];
  const owerData=['身份证','身份证原件'];
  const buyerData=['户口本原件','结婚证原件','身份证原件']
  const handleModalCancel=()=>{
    dispatch({
      type:"secondDeal/setState",
      payload:{
        showHandleTransferModal:false
      }
    })
  }
  const withdrawnApply=()=>{
    console.log("您点击了撤回申请");
  }
  const steps = [{
    title: '申请贷款',
    content:
      isApplyTransferWrote?<div><Table {...tableProps}/><TextWithIconLeft data={data}/><FormContent/></div>:<div><Table {...tableProps}/><TextWithIconLeft data={data}/><Row>过户信息</Row><Row>业主姓名: 林峰</Row><Row>业主电话: 15120050558</Row><TextWithIconLeft data={owerData}/><Row>购房者姓名: 黄月</Row><Row>购房者电话: 15120050558</Row><TextWithIconLeft data={buyerData}/><Row>过户进度</Row><Timeline><Timeline.Item>2012-10-24 19:00  由林八千 提交过户申请  等待 张三 受理 办理过户 </Timeline.Item></Timeline><Row><Button type="ghost" onClick={withdrawnApply}>撤回申请</Button><Button type="ghost" onClick={handleModalCancel}>关闭</Button></Row></div>,
    }, {
      title: '办理贷款',
      content: <RejectedHandleTransfer/>,
    }, {
      title: '批款',
      content: <Completed/>,
    }];
  return (
    <div>
      <Button type="ghost" onClick={showModal}>申请办理过户</Button>
      <Button type="ghost" onClick={handleBack}>返回</Button>
      <Modal visible={showHandleTransferModal} title="二手房--申请过户" onCancel={handleModalCancel} width="800px" footer=" ">
        <Steps current={ApplyTransferCurrent}>
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className="steps-content">{steps[ApplyTransferCurrent].content}</div>
      </Modal>
    </div>
  )
}


const FormContent=Form.create()(
  connect(({secondDeal})=>({secondDeal}))(
    function ({form,dispatch}){
      const {getFieldDecorator}=form;
      const handleCancel=()=>{
        dispatch({
          type:"secondDeal/setState",
          payload:{
            showHandleTransferModal:false
          }
        })
      }
      const handleSubmit=(e)=>{
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            dispatch({
              type:"secondDeal/setState",
              payload:{
                showHandleTransferModal:false
              }
            })
          }
        });
      }
      return (
          <Form inline onSubmit={handleSubmit}>
            <Row gutter={8}>
              <Col span={6}>业主信息</Col>
              <Col span={6}>购房者信息</Col>
            </Row>
            <Row gutter={8}>
              <Col span={6}>业主姓名</Col>
              <Col span={6}>购房者姓名</Col>
            </Row>
            <Row gutter={24}>
              <FormItem>
                {getFieldDecorator('owerName', {
                    rules: [{ required: true, message: '请填写业主姓名!' }],
                  })(
                    <Input placeholder="请填写业主姓名" />
                  )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('buyerName', {
                    rules: [{ required: true, message: '请填写购房人姓名!' }],
                  })(
                    <Input placeholder="请填写购房人姓名" />
                  )}
              </FormItem>
            </Row>
            <Row gutter={8}>
              <Col span={6}>业主联系方式</Col>
              <Col span={6}>购房人联系方式</Col>
            </Row>
            <Row gutter={24}>
              <FormItem>
                {getFieldDecorator('owerPhone', {
                    rules: [{ required: true, message: '请填写业主联系方式!' }],
                  })(
                      <Input placeholder="请填写业主联系方式" />
                  )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('buyerPhone', {
                    rules: [{ required: true, message: '请填写购房人联系方式!' }],
                  })(
                    <Input placeholder="请填写购房人联系方式" />
                  )}
              </FormItem>
            </Row>
            <Row gutter={48}>
              <FormItem>
                {getFieldDecorator('owerCertificates', {
                    valuePropName: 'checked',
                  })(
                    <Col>
                      <Row gutter={48}>
                        <Checkbox>房产证</Checkbox>
                      </Row>
                      <Row gutter={48}>
                        <Checkbox>身份证原件</Checkbox>
                      </Row>
                    </Col>
                  )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('buyerCertificates', {
                    valuePropName: 'checked',
                  })(
                    <Col>
                      <Row gutter={8}>
                        <Checkbox>户口本原件</Checkbox>
                      </Row>
                      <Row gutter={8}>
                        <Checkbox>结婚证原件</Checkbox>
                      </Row >
                      <Row gutter={8}>
                        <Checkbox>身份证原件</Checkbox>
                      </Row>
                    </Col>
                  )}
              </FormItem>
            </Row>
            <Row>
              <FormItem>
                <Button type="primary" htmlType="submit" size="large">申请提交</Button>
                <Button type="ghost"  size="large" onClick={handleCancel}>取消</Button>
              </FormItem>
            </Row>
          </Form>
        );
      }
    )
  )
const RejectedHandleTransfer=connect(({secondDeal})=>({secondDeal}))(
    function ({form,dispatch}){
      const dataSource=[{
          key:'-1',
          ssxq:'远洋山水',
          wylx:'住宅',
          fyxx:'A区/1号楼/1单元/7层/7002室',
          fymj:'100㎡',
          zjyj:'押1付3',
          zq:'1年',
          fz:"85000元/月",
          czfs:'整租',
          cz:'交易详情'
        }
      ];
      const columns=[{
          key:'1',
          title:'所属小区',
          dataIndex:'ssxq'
        },{
          key:'2',
          title:'物业类型',
          dataIndex:'wylx'
        },{
          key:'3',
          title:'房源信息',
          dataIndex:'fyxx'
        },
        {
          key:'4',
          title:'房源面积',
          dataIndex:'fymj'
        },
        {
          key:'5',
          title:'租金/押金',
          dataIndex:'zjyj'
        },
        {
          key:'6',
          title:'租期',
          dataIndex:'zq'
        },
        {
          key:'7',
          title:'房租',
          dataIndex:'fz',
        },
        {
          key:'8',
          title:'出租方式',
          dataIndex:'czfs'
        },{
          key:'9',
          title:'操作',
          render:(text,record,index)=>{
            return(
              <a href='#'>交易详情</a>
            )
          }
        }
      ];
      const tableProps={
        columns,
        dataSource,
        className:'anzhu_table_tr',
        pagination:false,
        title:()=>{return("过户房源")}
      };
      const completedBusiness=['意向金已支付','首付款已支付','中介佣金已支付','贷款已批'];
      const owerData=['身份证','身份证原件'];
      const buyerData=['户口本原件','结婚证原件','身份证原件'];
      const handleModalCancel=()=>{
        dispatch({
          type:"secondDeal/setState",
          payload:{
            showHandleTransferModal:false
          }
        })
      }
      const reApply=()=>{
        console.log("您点击了重新申请")
        dispatch({
          type:"secondDeal/setState",
          payload:{
            showHandleTransferModal:true,
            ApplyTransferCurrent:0,
            isApplyTransferWrote:true,
          }
        })
      }
      return(
        <div>
          <Table {...tableProps}/>
          <Row gutter={48}>
            <Col>
              <Row>已完成业务</Row>
              <TextWithIconLeft data={completedBusiness}/>
              <Row>过户信息</Row>
              <Row>业主姓名: 林峰</Row>
              <Row>业主电话: 15120050558</Row>
              <TextWithIconLeft data={owerData}/>
              <Row>购买者姓名: 黄月</Row>
              <Row>购买者电话: 15120050558</Row>
              <TextWithIconLeft data={buyerData}/>
            </Col>
            <Col>
              <Row>过户进度</Row>
              <Timeline>
                <Timeline.Item>
                  2012-10-24 19:00  由林八千 提交过户申请  等待 张三 受理 办理过户
                </Timeline.Item>
                <Timeline.Item>
                  2012-10-24 21:00  由张三 受理过户
                </Timeline.Item>
                <Timeline.Item>
                  2012-10-24 22:00  由张三 驳回过户申请
                </Timeline.Item>
              </Timeline>
              <Row>驳回理由：信息不完整办理不了。</Row>
            </Col>
          </Row>
          <Button type="ghost" onClick={reApply}>重新申请</Button>
          <Button type="ghost" onClick={handleModalCancel}>关闭</Button>
        </div>
      )
  }
)

const Completed=connect(({secondDeal})=>({secondDeal}))(
    function ({form,dispatch}){
      const toHouseResourceIndex=()=>{
        dispatch(routerRedux.push('/dealManagement/secondHouseSellDeal/HouseResourceInfo'))
      }
      const dataSource=[
        {
          key:'-1',
          fybh:332005469041,
          ssxq:'远洋山水',
          fyxx:'A区/1号楼/1单元/7层/7002室',
          fymj:'100㎡',
          td:'满五唯一',
          fydj:'1000元/㎡',
          fyzj:"200万/套",
          zcdk:'支持',
          cz:'交易详情'
        }
      ];

      const columns=[
        {
          key:'1',
          title:'房源编号',
          render:(text,record,index)=>{
          return(
              <a href='#' onClick={toHouseResourceIndex}>332005469041</a>
          )
          }
        },
        {
          key:'2',
          title:'所属小区',
          dataIndex:'ssxq'
        },
        {
          key:'3',
          title:'房源信息',
          render:(text,record,index)=>{
            return(
              <a href="#">A区域/1号楼/1单元/7层/7002室</a>
            )
          }
        },
        {
          key:'4',
          title:'房源面积',
          dataIndex:'fymj'
        },
        {
          key:'5',
          title:'特点',
          dataIndex:'td'
        },
        {
          key:'6',
          title:'房源单价',
          dataIndex:'fydj'
        },
        {
          key:'7',
          title:'房源总价',
          dataIndex:'fyzj',
        },
        {
          key:'8',
          title:'支持贷款',
          dataIndex:'zcdk'
        },{
          key:'9',
          title:'操作',
          render:(text,record,index)=>{
            return(
              <a href='#'>交易详情</a>
            )
          }
        }
      ];
      const tableProps={
        columns,
        dataSource,
        className:'anzhu_table_tr',
        pagination:false,
        title:()=>{return("过户房源")}
        };
      const completedBusiness=['意向金已支付','首付款已支付','中介佣金已支付','贷款已批'];
      const owerData=['身份证','身份证原件'];
      const buyerData=['户口本原件','结婚证原件','身份证原件'];
      const handleModalCancel=()=>{
        dispatch({
          type:"secondDeal/setState",
          payload:{
            showHandleTransferModal:false
          }
        })
      }
      return(
        <div>
          <Table {...tableProps}/>
          <Row gutter={48}>
            <Col>
              <Row>已完成业务</Row>
              <TextWithIconLeft data={completedBusiness}/>
              <Row>过户信息</Row>
              <Row>业主姓名: 林峰</Row>
              <Row>业主电话: 15120050558</Row>
              <TextWithIconLeft data={owerData}/>
              <Row>购买者姓名: 黄月</Row>
              <Row>购买者电话: 15120050558</Row>
              <TextWithIconLeft data={buyerData}/>
            </Col>
            <Col>
              <Row>过户进度</Row>
              <Timeline>
                <Timeline.Item>
                  2012-10-24 19:00  由林八千 提交过户申请  等待 张三 受理 办理过户
                </Timeline.Item>
                <Timeline.Item>
                  2012-10-24 21:00  由张三 受理过户
                </Timeline.Item>
                <Timeline.Item>
                  2012-10-24 22:00  由张三 完成过户申请。
                </Timeline.Item>
              </Timeline>
              <Row><img src={img4}/><img src={img4}/><img src={img4}/></Row>
            </Col>
          </Row>
          <Button type="ghost" onClick={handleModalCancel}>关闭</Button>
        </div>
      )
  }
)

export default connect(({secondDeal})=>({secondDeal}))(ApplyTransfer)
