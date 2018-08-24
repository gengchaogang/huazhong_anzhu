import React from 'react'
import {
  Table,
  Input,
  Form,
  Radio,
  Select,
  Steps,
  Modal,
  Row,
  Col,
  Button,
  Timeline
} from 'antd'

import {connect} from 'dva'
import {routerRedux} from 'dva/router'

import TextWithLeftIcon from '../../../commons/UI/TextWithIconLeft'
import SelectShenHeObj from './SelectShenHeObj';
const FormItem=Form.Item;
const Step=Steps.Step;
const Option=Select.Option;
const RadioGroup=Radio.Group;
const TimeItem=Timeline.Item;

const ApplyLoan=Form.create({})(function ({form,visible,secondDeal,dispatch}){
    var status='已驳回申请';

    var Page=null;
    const {getFieldDecorator}=form;
    const completedSteps=['意向金已支付','首付款已支付','中介佣金已支付'];
    const dataSource=[
      {
        key:'-1',
        wylx:'住宅',
        ssxq:'远洋山水',
        fyxx:'A区/1号楼/1单元/7层/7002室',
        fymj:'100平方米',
        yyzj:'200万/套',
        zcdk:'支持',
        sqsj:{date:'2015-10-24',time:'19:00'}
      }
    ];
    const columns=[
      {
        key:'1',
        title:'物业类型',
        dataIndex:'wylx'
      },
      {
        key:'2',
        title:'所属小区',
        dataIndex:'ssxq'
      },
      {
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
        title:'房源总价',
        dataIndex:'fyzj'
      },
      {
        key:'6',
        title:'支持贷款',
        dataIndex:'zcdk'
      },
      {
        key:'7',
        title:'申请时间',
        dataIndex:'sqsj',
        render:(text,record,index)=>{
          return (
            <div>
              <div>{text.date}</div>
              <div>{text.time}</div>
            </div>
          )
        }
      },
      {
        key:'8',
        title:'操作',
        render:(text,record,index)=>{
          return <a>交易详情</a>
        }
      }
    ];
    const tableProps={
      columns,
      dataSource,
      className:'anzhu_table_tr',
      pagination:false
    };
    const timelineData=[
      {msg:"2012-10-24 19:00  由林八千 提交贷款申请   等待 刘阳 受理",type:"done"},
      {msg:"2012-10-24 19:00  由刘阳 受理开始办理贷款，等待贷款反馈",type:"done"},
      {msg:"2012-10-24 19:00  贷款申请被驳回",type:"error",error:"驳回理由：贷款用户信用评级不够无法完成批款"},
    ];
    const timeline=timelineData.map((item,index)=>{
      return (
        <TimeItem key={index}>
          <div style={{ color:item.type==="error"?"#f00":item.type==="done"?"#333":"#333"}}>
            {item.msg}
            <br/>
            {item.error?item.error:null}
          </div>
        </TimeItem>
      );
    });
    const footer=(status)=>{
      let okBtn=null;
      switch (status) {
        case "提交申请":
        okBtn=  <Button key="submit" type="primary" size="large" onClick={()=>{
            dispatch({
              type:'secondDeal/setState',
              payload:{showSelectShenheObj:true}
            })
          }}>
            提交申请
          </Button>;
          break;
        case "等待受理":
          okBtn=<Button key="submit" type="primary" size="large" onClick={()=>{
            //撤回申请
            }}>
              撤回申请
            </Button>;
            break;
        case "已驳回申请":
          okBtn=<Button key="submit" type="primary" size="large" onClick={()=>{
              //重新申请
              //更改status为提交申请
            }}>
              重新申请
            </Button>;
            break;
        case "已受理申请":
        case "申请成功":
          break;
      }
      if(okBtn){
        return [
          okBtn,
          <Button key="back" type="ghost" size="large"  onClick={()=>{
            dispatch({type:'secondDeal/setState',payload:{showApplyLoan:false}})
          }}>
            关闭
          </Button>
        ]
      }
      else{
        return <Button key="back" type="ghost" size="large"  onClick={()=>{
          dispatch({type:'secondDeal/setState',payload:{showApplyLoan:false}})
        }}>
          关闭
        </Button>
      }
    };
    return (
      <Modal
        visible={visible}
        width={1000}
        onCancel={()=>{
          dispatch({type:'secondDeal/setState',payload:{showApplyLoan:false}})
        }}

        footer={footer(status)}
        >
        <div>
          <h3>二手房-申请贷款</h3>
          <Steps current={1}>
            <Step  title="申请贷款"/>
            <Step  title="办理贷款"/>
            <Step  title="批款"/>
          </Steps>
          <h4>贷款房源</h4>
          <Table
            {...tableProps}
          />
          <div>
            <TextWithLeftIcon
              data={completedSteps}
            />
          </div>
          <div>
            {
              status==="提交申请"?
              <Form inline>

                    <FormItem label="贷款客户">
                      {
                        getFieldDecorator('customer',{})(
                          <Input placeholder="请输入贷款客户姓名"/>
                        )
                      }
                    </FormItem>

                    <FormItem label="贷款金额">
                      {
                        getFieldDecorator('loanPercent',{
                          initialValue:'1'
                        })(
                          <Select>
                            <Option value={'1'}>1成</Option>
                            <Option value={'2'}>2成</Option>
                            <Option value={'3'}>3成</Option>
                            <Option value={'4'}>4成</Option>
                          </Select>
                        )
                      }
                    </FormItem>
                    <FormItem >
                      {
                        getFieldDecorator('loanMoney',{
                        })(
                          <Input addonAfter="万元" />
                        )
                      }
                    </FormItem>
                    <br/>
                <FormItem label="贷款联系人电话">
                  {
                    getFieldDecorator('contactUserPhone',{})(
                      <Input placeholder="请输入贷款人联系电话"/>
                    )
                  }
                </FormItem>
                <FormItem label="贷款期限">
                  {
                    getFieldDecorator('loanYear',{
                      initialValue:'5'
                    })(
                      <Select>
                        <Option value={'5'}>5年</Option>
                        <Option value={'10'}>10年</Option>
                        <Option value={'15'}>15年</Option>
                        <Option value={'20'}>20年</Option>
                        <Option value={'25'}>25年</Option>
                        <Option value={'30'}>30年</Option>
                      </Select>
                    )
                  }
                </FormItem>
                <br/>
                <FormItem label="贷款方式">
                  {
                    getFieldDecorator('loanWay',{
                      initialValue:1
                    })(
                      <RadioGroup>
                        <Radio value={1}>商贷</Radio>
                        <Radio value={2}>公积金</Radio>
                        <Radio value={3}>组合贷款</Radio>
                      </RadioGroup>
                    )
                  }
                </FormItem>
              </Form>
              :
              <div>
                <h4>贷款信息</h4>
                <p>贷款客户：<span>{"林八千"}</span></p>
                <p>贷款人联系电话：<span>15120050558</span></p>
                <p>贷款类型：<span>商贷</span></p>
                <p>贷款金额：<span>6成/ 630万元</span></p>
                <p>贷款期限：<span>30年</span></p>
                <h4>贷款状态</h4>
                <Timeline>
                  {timeline}
                </Timeline>
              </div>
            }
          </div>
          <SelectShenHeObj/>
        </div>
      </Modal>
    );
})



export default connect(({secondDeal})=>({secondDeal}))(ApplyLoan)
