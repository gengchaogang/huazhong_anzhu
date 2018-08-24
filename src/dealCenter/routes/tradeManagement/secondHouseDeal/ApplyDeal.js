import React from 'react'
import {
  Button,
  Form,
  Input,
  Select,
  Radio,
  Row,
  Col
} from 'antd'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import ApplyLoanModal from '../../../components/Modals/ApplyLoan';
import SelectPicture from '../../../../commons/UI/SelectPicture';
import DxPanel from '../../../../commons/components/DxPanel';
const Option= Select.Option;
const FormItem=Form.Item;
const RadioGroup=Radio.Group;
const ApplyDeal=Form.create({})(
  function ApplyDeal({form,secondDeal,dispatch}){
    const {getFieldDecorator}=form;
    const {showApplyLoan}=secondDeal;
    const payBack=true;
    const goToDeal=()=>{alert('成功')};
    const goBack=()=>{dispatch(routerRedux.goBack())};
    const banks=['中国银行','民生银行','建设银行'];
    const bank_options=banks.map((bank,index)=>(
      <Option value={bank} key={bank+index}>{bank}</Option>
    ));
    return (
      <Form vertical>
        {
          payBack?
          <DxPanel title="成交资金释放">
          <FormItem
             label="业主姓名"
             >
            {
              getFieldDecorator('customer',{initialValue:"张三"})(
                <Input disabled/>
              )
            }
          </FormItem>
          <FormItem label="开户银行">
            {
              getFieldDecorator('bank',{

              })(
                <Select
                  allowClear
                  placeholder="请选择开户银行"
                  notFoundContent="没有任何选项"
                >
                {bank_options||null}
                </Select>
              )
            }
          </FormItem>
          <FormItem label="开户支行">
            {
              getFieldDecorator('bank_pos',{})(
                <Input placeholder="请输入开户支行"/>
              )
            }
          </FormItem>
          <FormItem label="开户银行卡号">
            {
              getFieldDecorator('bank_num',{})(
                <Input placeholder="请输入银行卡号"/>
              )
            }
          </FormItem>
          <FormItem label="业主电话">
            {
              getFieldDecorator('cellphone',{})(
                <Input placeholder="请输入业主电话"/>
              )
            }
          </FormItem>
          <SelectPicture size={2} total={10}/>
        </DxPanel>
          :null
        }
      <DxPanel title="成交分佣设置">
        <div>
          成交佣金总额:<span>20000</span>元
        </div>
        <div>
          平台抽佣:<span>10%</span>
        </div>
        <div>
            剩余佣金总额:<span>18000</span>元
        </div>
        <FormItem>
          {
            getFieldDecorator('dealWay',{
              initialValue:"合作成交"
            })(
              <RadioGroup>
                <Radio value="合作成交">合作成交</Radio>
                <Radio value="自有客户">自有客户</Radio>
              </RadioGroup>
            )
          }
        </FormItem>
        <Row>
          <Col span={12}>
            <FormItem
                label="买方经纪人"
              >
                {
                  getFieldDecorator('customer_agent',{})(
                    <Input addonAfter="%" placeholder="输入买方经纪人佣金比例"/>
                  )
                }
                <div>佣金收益:<span>{40000}</span>元</div>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
                label="卖方经纪人"
              >
                {
                  getFieldDecorator('seller_agent',{})(
                    <Input addonAfter="%" placeholder="输入卖方经纪人佣金比例"/>
                  )
                }
                <div>佣金收益:<span>{40000}</span>元</div>
            </FormItem>
          </Col>
        </Row>

      </DxPanel>
      <Button type="primary" onClick={goToDeal}>申请成交</Button>
      <Button type="ghost" onClick={goBack}>返回</Button>
      </Form>
    );
  }

);

function mapStateToProps({secondDeal}){
  return {secondDeal}
}

export default connect(mapStateToProps)(ApplyDeal);
