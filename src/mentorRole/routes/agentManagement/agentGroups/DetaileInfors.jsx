import React from 'react'
import {connect}from 'dva'
import {routerRedux}from 'dva/router'
import {Row,Col,Form,Radio,DatePicker,Button,Table} from 'antd'
import moment from 'moment';
import DxPanel from '../../../../commons/components/DxPanel'
import Panel from '../../../../commons/components/Panel'
import './detaileInfors.css'
import morenImg from '../../../assets/images/morentouinfg.png'
import PromptModal from '../../../../commons/View/PromptModal';
import DxLoadingShadow from '../../../../commons/UI/DxLoadingShadow';
import {isNull} from '../../../../commons/utils/currencyFunction'

const FormItem=Form.Item;
const RangePicker = DatePicker.RangePicker;
const RadioGroup=Radio.Group;
let startDate,endDate;
function DetaileInfors({dispatch,detaileInfors,form}){



  const {getFieldDecorator}=form;
  const{
    tableData,
    brokerId,
  	logo,
  	name,
  	phone,
  	addTeamTime,//加入团队时间
  	conversantArea,//熟悉区域
  	age,
  	workTime,//从业年限
    speciality,
  	guideCountForOneWeek,//近7天带看
  	commitCountForOneMonth,//近30天成交
    guideFollowForOneWeek,
    addHouseTotal,//累计拓房
  	addCustomerTotal,//累计拓客
  	appointmentTotal,//累计预约
  	reportTotal,//累计报备
  	guideTotal,//累计带看
  	commitTotal,//总成交
  	newHouseCommitTotal,//新房成交
  	secondHouseCommitTotal,//二手房成交
  	rentOutTotal,//出租成交
  	commitMoneyTotal,//累计成交金额
  	brokerageTotal,//累计佣金
  	tutorEarnings,//导师收益
    loadingShadow,
    promptObj,
  }=detaileInfors
  const columns=[{
      title:"累计拓房",
      dataIndex:"tf"
    },{
      title:"累计拓客",
      dataIndex:"tk"
    },{
      title:"累计预约",
      dataIndex:"yy"
    },{
      title:"累计报备",
      dataIndex:"bb"
    },{
      title:"累计带看",
      dataIndex:"dk"
    },{
      title:"累计成交（新房、二手房、出租）",
      dataIndex:"cj",
    },{
      title:"成交金额",
      dataIndex:"je"
    },{
      title:"累计佣金",
      dataIndex:"yj"
    },{
      title:"导师收益",
      dataIndex:"sy"
    }]


  const radioChange=(e)=>{
    dispatch({
      type:"detaileInfors/findBrokerPerformance",
      payload:{
        id:brokerId,
        sreachType:e.target.value,
      }
    })

  }
  const handleBack=()=>{
    history.back();
    // dispatch(routerRedux.push({
    //   pathname:"/agentManagement/agentGroups"
    // }))
  }
  const searchSubmit=(e)=>{
    form.setFieldsValue({searchType:""});
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }else{
        if(startDate && endDate){
          dispatch({
            type:"detaileInfors/findBrokerPerformance",
            payload:{
              sreachType:3,
              startDate:startDate,
              endDate:endDate,
              id:brokerId,
            }
          })
        }
      }
    })
  }
  const rangePickerChange=(dates, dateStrings)=>{
    startDate = dateStrings[0];
    endDate = dateStrings[1];
  }
  const onOkCallBack=()=>{
    if(promptObj.todo==='closeModal'){
      dispatch({
        type:"detaileInfors/togglePrompt",
        payload:{
          visible:false
        }
      })
    }
  }
  const onCancelCallBack=()=>{}
  return(
    <div className="detaileInfors">
      <PromptModal {...promptObj} onOk={onOkCallBack} onCancel={onCancelCallBack}/>
      <DxLoadingShadow visible={loadingShadow} />
      <div>
        <DxPanel title="经纪人详情">
          <Row>
            <Col>
              <img src={isNull(logo,morenImg)} width="100px" height='100px'/>
            </Col>
            <Col>
              <Row className="userInfos">
                <Col><p>{isNull(name,'')}</p></Col>
                <Col><p>{isNull(phone,'')}</p></Col>
              </Row>
            </Col>
          </Row>
          </DxPanel>
        <DxPanel title="最近业绩">
          <p>近7日跟进：{isNull(guideFollowForOneWeek,'')}次</p>
          <p>近7日带看：{isNull(guideCountForOneWeek,'')}次</p>
          <p>近30天成交：{isNull(commitCountForOneMonth,'')}套</p>
          <p>累计成交：{isNull(commitTotal,'')}套</p>
        </DxPanel>
        <DxPanel className="personal" title="个人业绩">
          <Row>
            <Form onSubmit={searchSubmit}>
              <Col span={5}>
                <FormItem>
                  {getFieldDecorator('searchType', {
                    initialValue:"WEEK",
                    // rules: [{ required: false, message:'请输入姓名!' }],
                  })(
                    <RadioGroup onChange={radioChange}>
                      <Radio value='WEEK'>本周</Radio>
                      <Radio value='MONTH'>本月</Radio>
                      <Radio value='QUARTER'>本季度</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                {getFieldDecorator('rangePicker', {
                  rules: [{ type: 'array', required: true, message: '请选择查询时间!' }],
                })(
                    <RangePicker ranges={{ "今天": [moment(), moment()]}} onChange={rangePickerChange}/>
                  )}
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem>
                  <Button type="default" htmlType="submit">查询</Button>
                </FormItem>
              </Col>
            </Form>
          </Row>
          <Row>
            <Col>
              <Table columns={columns} dataSource={tableData} pagination={false}/>
            </Col>
          </Row>
        </DxPanel>
        <DxPanel className="basicMessage" title="基本信息">
          <Row>
            <Col span={10}>{isNull(addTeamTime,'--')}加入团队</Col>
          </Row>
          <Row>
            <Col span={10}>年龄：{isNull(age,'--')}岁</Col>
          </Row>
          <Row>
            <Col span={10}>从业年限：{isNull(workTime,'--')}年</Col>
          </Row>
          <Row>
            <Col span={10}>熟悉区域：{isNull(conversantArea,'--')}</Col>
          </Row>
          <Row>
            <Col span={10}>擅长物业：{isNull(speciality,'--')}</Col>
          </Row>
          <div className="toBack">
            <Button type="ghost" onClick={handleBack}>返回</Button>
          </div>
        </DxPanel>
      </div>
    </div>
  )
}

function mapStateToProps({detaileInfors}){
  return{
    detaileInfors
  }
}
export default connect(mapStateToProps)(Form.create({})(DetaileInfors));
