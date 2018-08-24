import React from 'react'
import {connect } from 'dva'
import { routerRedux } from 'dva/router';
import {Table,Icon,Radio,Button,Modal,Form} from 'antd'
import './dealDataNavBar.css'
import PromptModal from '../../../../../commons/View/PromptModal'
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem=Form.Item;
function DealDataNavBar({dispatch,dealDataNavBar,form}){
  const {getFieldDecorator}=form
  const {
    projectName,
    tradingCenterName,
    projectId,
    businessClassification,
    promptObj,
    tableData,
    totalElements,
    tableLoading,
    reajectReason,
    visible,
    reportstate,
    roadioStatus,
    pageNo,
  }=dealDataNavBar
  const onRadioChange=(e)=>{
    dispatch({
      type:"dealDataNavBar/changeLoading",
      payload:{
        tableLoading:true,
      }
    })
    form.resetFields()
    dispatch({
      type:"dealDataNavBar/changeBusinessClassification",
      payload:{
        businessClassification:e.target.value
      }
    })
    if(e.target.value==="报备"){
      dispatch({
        type:"dealDataNavBar/getInitRecordTableData",
        payload:{
          pageNo:0,
          pageSize:10,
          projectId:projectId,
        }
      })
    }
    else if(e.target.value==="确看"){
      dispatch({
        type:"dealDataNavBar/getViewedTableData",
        payload:{
          pageNo:0,
          pageSize:10,
          projectId:projectId,
        }
      })
    }
    else if(e.target.value==="电商团购"){
      dispatch({
        type:"dealDataNavBar/getDiscountTableData",
        payload:{
          pageNo:0,
          pageSize:10,
          projectId:projectId,
        }
      })
    }
    else if(e.target.value==="成交"){
      dispatch({
        type:"dealDataNavBar/getDealTableData",
        payload:{
          pageNo:0,
          pageSize:10,
          projectId:projectId,
        }
      })
    }
    // dispatch(routerRedux.push('resourceManagement/secondhandHouseSell/Selling/housingDetails'));
  }
  // console.log('businessClassification',businessClassification);
  const onStateChange=(e)=>{
    dispatch({
      type:"dealDataNavBar/changeLoading",
      payload:{
        tableLoading:true,
      }
    })
    if(businessClassification==="报备"){
      if(e.target.value==="失败"){
        dispatch({
          type:"dealDataNavBar/getInitRecordTableData",
          payload:{
            pageSize:10,
            pageNo:0,
            projectId:projectId,
            reportstate:"失败",
          }
        })
      }else{
          dispatch({
            type:"dealDataNavBar/getInitRecordTableData",
            payload:{
              pageSize:10,
              pageNo:0,
              projectId:projectId,
              reportstate:"成功"
            }
        })
      }
    }
    if(businessClassification==="确看"){
      if(e.target.value==="已确看"){
        dispatch({
          type:"dealDataNavBar/getViewedTableData",
          payload:{
            pageSize:10,
            pageNo:0,
            projectId:projectId,
            state:"已确看"
          }
        })
      }else{
        dispatch({
          type:"dealDataNavBar/getViewedTableData",
          payload:{
            pageSize:10,
            pageNo:0,
            projectId:projectId,
            state:"未带看"
          }
        })
      }
    }
    if(businessClassification==="电商团购"){
      if(e.target.value==="已团购"){
        dispatch({
          type:"dealDataNavBar/getDiscountTableData",
          payload:{
            pageSize:10,
            pageNo:0,
            projectId:projectId,
            state:"已团购"
          }
        })
      }else{
        dispatch({
          type:"dealDataNavBar/getDiscountTableData",
          payload:{
            pageSize:10,
            pageNo:0,
            projectId:projectId,
            state:"申请退款"
          }
        })
      }
    }
    if(businessClassification==="成交"){
      if(e.target.value==="已团购"){
        dispatch({
          type:"dealDataNavBar/getDealTableData",
          payload:{
            pageSize:10,
            pageNo:0,
            projectId:projectId,
            state:"已成交"
          }
        })
      }else{
        dispatch({
          type:"dealDataNavBar/getDealTableData",
          payload:{
            pageSize:10,
            pageNo:0,
            projectId:projectId,
            state:"已分佣"
          }
        })
      }
    }
  }
  const handleCallBackOk=()=>{
    if(promptObj.todo==='closeModal'){
      dispatch({type:"dealDataNavBar/togglePrompt",payload:{visible:false}})
    }
  }
  const handleCallBackCancel=()=>{}
  const reportColumns=[{
      title:"序号",
      dataIndex:"number"
    },{
      title:"报备经纪人",
      dataIndex:"brokerName"
    },{
      title:"报备客户",
      dataIndex:"customerName"
    },{
      title:"客户手机号",
      dataIndex:"customerPhone"
    },{
      title:"性别",
      dataIndex:"customerSex"
    },{
      title:"报备时间",
      dataIndex:"createTime"
    },{
      title:"预约看房时间",
      dataIndex:"toVisitTime"
    },{
      title:"物业类型",
      dataIndex:"propertyType"
    },{
      title:"意向房源",
      dataIndex:"intentHouse"
    },{
      title:"状态",
      dataIndex:"status",
      render:(text,record,index)=>{
        if(text==="已驳回"){
          return(
          <div>
            <p style={{color:"#f60"}}>失败</p>
            <p style={{color:"#090",cursor:"pointer",display:"block"}} onClick={()=>showReaSon(record)}>驳回理由</p>
          </div>
        )
      }else{
          return(
          <div>
            <p>{text}</p>
          </div>
        )
        }
      }
    }]
  const viewedColumns=[{
      title:"序号",
      dataIndex:"number"
    },{
      title:"带看经纪人",
      dataIndex:"brokerName"
    },{
      title:"经纪人电话",
      dataIndex:"brokerPhone"
    },{
      title:"确看客户",
      dataIndex:"customerName"
    },{
      title:"联系电话",
      dataIndex:"customerPhone"
    },{
      title:"物业类型",
      dataIndex:"propertyType"
    },{
      title:"意向房源",
      dataIndex:"intentHouse"
    },{
      title:"客户保护期",
      dataIndex:"protectDay",
      render:(text,record,index)=>{
        if(!!text){
          return(<span style={{color:"#e4393c"}}>剩余{text}天</span>)
        }
      }
    },{
      title:"看房状态",
      dataIndex:"status",
      render:(text,record,index)=>{
        if(text==="已确看"){
          return(
            <span className="status">{text}</span>
          )
        }else{
          return(
            <span style={{color:"#e4393c"}}>{text}</span>
          )
        }
      }
    },{
      title:"看房时间",
      dataIndex:"showTime"
    },{
      title:"操作",
      render:(text,record,index)=>{
        return(
          <span className="operation" onClick={()=>toDetails(record)}>确看记录</span>
        )
      }
    }]
  const discountColumns=[{
      title:"序号",
      dataIndex:"number"
    },{
      title:"带看经纪人",
      dataIndex:"brokerName"
    },{
      title:"客户姓名",
      dataIndex:"customerName"
    },{
      title:"联系电话",
      dataIndex:"customerPhone"
    },{
      title:"物业类型",
      dataIndex:"propertyType"
    },{
      title:"意向房源",
      dataIndex:"house"
    },{
      title:"已购团购",
      dataIndex:"projectFavorableName"
    },{
      title:"团购时间",
      dataIndex:"groupbuyCreateTime",
    },{
      title:"团购金额",
      dataIndex:"groupbuyMoney",
      render:text=><span>{text} 元</span>
    },{
      title:"状态",
      dataIndex:"groupbuyStatus",
      render:(text,record,index)=>{
        if(text==="待支付"){
          return(<span>待支付</span>)
        }else if(text==="已团购"){
          if(record.isUploadAgreement){
            return(
              <div>
                <p>已团购</p>
              </div>
            )
          }else{
            return(
              <p>{text}</p>
            )
          }
        }else if(text==="申请退款"){
          switch (record.refundStatus) {
            case '已驳回':return(<div><p>申请退款</p><p className="reject">已驳回</p></div>);break;
            case '待合同审核':return(<div><p>申请退款</p><p className="operation">待审核</p></div>);break;
            case '待财务审核':return(<div><p>申请退款</p><p className="operation">待财务审核</p></div>);break;
            default:return(<div><p>申请退款</p><p className="reject">已退款</p></div>);break;
          }
        }
      }
    },{
      title:"操作",
      render:(text,record,index)=>{
        return(
          <span className="operation" onClick={()=>toDetails(record)}>详情</span>
        )
      }
    }]
  const dealColumns=[{
      title:"序号",
      dataIndex:"number"
    },{
      title:"带看经纪人",
      dataIndex:"brokerName"
    },{
      title:"客户姓名",
      dataIndex:"customerName"
    },{
      title:"联系电话",
      dataIndex:"customerPhone"
    },{
      title:"成交类型",
      dataIndex:"propertyType"
    },{
      title:"成交房源",
      dataIndex:"houseName"
    },{
      title:"成交时间",
      dataIndex:"txTime"
    },{
      title:"成交优惠",
      dataIndex:"discountName",
    },{
      title:"成交金额",
      render:(text,record,index)=>{
        return(
          <div className="dealMoney">
            <p style={{display:"block"}}>均价{record.unitPrice}元/㎡</p>
            <p>总价{record.totalPrice}元</p>
          </div>
        )
      }
    },{
      title:"成交状态",
      dataIndex:"auditStatus",
      render:(text,record,index)=>{
        // console.log(text,record,'...');
        if(text==="已撤回"){
          return(
            <p style={{display:"block",color:"#090"}}>{text}</p>
          )
        }else if(text==='业务审核拒绝'){
          return(
            <div>
              <p style={{display:"block"}}>已成交</p>
              <p style={{display:"block",color:"#e4393c"}}>成交审核驳回</p>
            </div>
          )
        }else if(text==='已分佣'){
          return(
            <div>
              <p style={{display:"block"}}>已成交</p>
              <p style={{display:"block",color:"#008000"}}>已分佣</p>
            </div>
          )
        }else if(text==='财务审核通过'){
          <div>
            <p style={{display:"block"}}>已成交</p>
            <p style={{display:"block",color:"#008000"}}>财务审核通过</p>
          </div>
        }else if(text==='财务审核拒绝'){
          <div>
            <p style={{display:"block"}}>已成交</p>
            <p style={{display:"block",color:"#e4393c"}}>财务审核驳回</p>
          </div>
        }else if(text==='业务审核通过'){
          <div>
            <p style={{display:"block"}}>已成交</p>
            <p style={{display:"block",color:"#008000"}}>业务审核通过</p>
          </div>
        }else if(text==='待审核'){
          <div>
            <p style={{display:"block"}}>已成交</p>
            <p style={{display:"block",color:"#008000"}}>待审核</p>
          </div>
        }
      }
    },{
      title:"操作",
      render:(text,record,index)=>{
        return(
          <span className="operation" onClick={()=>toDetails(record)}>详情</span>
        )
      }
    }]
  const toDetails=(record)=>{
    dispatch(routerRedux.push({
      pathname:"/resourceManagement/newHousePro/dealData/dealDataTradeInfoDetails",
      state:{
        groupKey:record.groupKey,
      }
    }))
  }
  const showReaSon=(record)=>{
      dispatch({
        type:"dealDataNavBar/saveCurrentReason",
        payload:{
          reajectReason:record.reasonForRejection,
          visible:true
        }
      })
    }

  const pagination={
      total:totalElements,
      // showTotal:(totalElements)=>{return(`共 ${totalElements} 项`)},
      pageSize:10,
      current:pageNo,
      // showQuickJumper:true,
      onChange:(page)=>{
        if(businessClassification=='报备'){
          dispatch({
            type:"dealDataNavBar/getInitRecordTableData",
            payload:{
              pageSize:10,
              pageNo:page-1,
              projectId:projectId,
              reportstate:reportstate,
            }
          })
        }else if(businessClassification=='确看'){
          dispatch({
            type:"dealDataNavBar/getViewedTableData",
            payload:{
              pageSize:10,
              pageNo:page-1,
              projectId:projectId,
              state:roadioStatus,
            }
          })
        }else if(businessClassification=='电商团购'){
          dispatch({
            type:"dealDataNavBar/getDiscountTableData",
            payload:{
              pageSize:10,
              pageNo:page-1,
              projectId:projectId,
              state:roadioStatus,
            }
          })
        }else if(businessClassification=='成交'){
          dispatch({
            type:"dealDataNavBar/getDealTableData",
            payload:{
              pageSize:10,
              pageNo:page-1,
              projectId:projectId,
              state:roadioStatus,
            }
          })
        }
      }
    }
  const onModalCancel=()=>{
    dispatch({
      type:"dealDataNavBar/closeModal",
      payload:{
        visible:false
      }
    })
  }
  const showState=(businessClassification)=>{
    // console.log(businessClassification,'businessClassification');
    switch (businessClassification) {
      case '确看':return(
        <div className="businessClassification">
          <p>状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态 :</p>
          <FormItem>
          {getFieldDecorator('state',)(
            <RadioGroup onChange={onStateChange}>
              <RadioButton value="已确看" >已确看</RadioButton>
              <RadioButton value="未带看">未带看</RadioButton>
            </RadioGroup>
            )}
          </FormItem>
        </div>); break;
      case '电商团购':return(
        <div className="businessClassification">
          <p>状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态 :</p>
          <FormItem>
            {getFieldDecorator('state',)(
              <RadioGroup onChange={onStateChange}>
                <RadioButton value="已团购" >已团购</RadioButton>
                <RadioButton value="申请退款">申请退款</RadioButton>
              </RadioGroup>
              )}
          </FormItem>
        </div>); break;
      case '成交':return(
        <div className="businessClassification">
          <p>状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态 :</p>
          <FormItem>
              {getFieldDecorator('state',)(
              <RadioGroup onChange={onStateChange}>
                <RadioButton value="已成交" >已成交</RadioButton>
                <RadioButton value="已分佣">已分佣</RadioButton>
              </RadioGroup>
              )}
          </FormItem>
        </div>); break;
      default:return(
         <div className="businessClassification">
            <p>状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态 :</p>
              <FormItem>
                {getFieldDecorator('state',)(
                <RadioGroup onChange={onStateChange}>
                  <RadioButton value="成功" >成功</RadioButton>
                  <RadioButton value="失败">失败</RadioButton>
                </RadioGroup>
                )}
            </FormItem>
        </div>); break;
    }
  }

  const showTable=(businessClassification)=>{
    switch (businessClassification) {
      case '确看':return(
        <Table
          columns={viewedColumns}
          dataSource={tableData}
          pagination={pagination}
          loading={tableLoading}
        />
      );break;
      case '电商团购':return(
        <Table
          columns={discountColumns}
          dataSource={tableData}
          pagination={pagination}
          loading={tableLoading}
        />
      );break;
      case '成交':return(
        <Table
          columns={dealColumns}
          dataSource={tableData}
          pagination={pagination}
          loading={tableLoading}
        />
      );break;
      default:return(
        <Table
          columns={reportColumns}
          dataSource={tableData}
          pagination={pagination}
          loading={tableLoading}
        />
      );break;
    }
  }
  return(
    <div className="dealDataNavBar">
      <Modal
        title="驳回理由"
        footer=""
        visible={visible}
        onCancel={onModalCancel}>
        <div>
          {!!reajectReason?reajectReason:null}
          <div style={{textAlign:"center",marginTop:"10px"}}>
            <Button type="ghost" onClick={onModalCancel}>关闭</Button>
          </div>
        </div>
      </Modal>
      <PromptModal {...promptObj} onOk={handleCallBackOk} onCancel={handleCallBackCancel}/>
      <div className="dealDataNavBarTitle">
        <p>当前项目 :  <span>{!!projectName?projectName:null}</span></p>
        <p>当前项目 :  <span>{!!tradingCenterName?tradingCenterName:null}</span></p>
      </div>
      <div className="businessClassification">
          业务分类 :
          <RadioGroup onChange={onRadioChange} defaultValue="报备" size="large">
            <RadioButton value="报备" >报备</RadioButton>
            <RadioButton value="确看">确看</RadioButton>
            <RadioButton value="电商团购">电商团购</RadioButton>
            <RadioButton value="成交">成交</RadioButton>
          </RadioGroup>
      </div>
      <Form>
        {showState(businessClassification)}
      </Form>
      <div className="businessClassification">
        {showTable(businessClassification)}
      </div>
      <Button type='ghost' onClick={()=>dispatch(routerRedux.goBack())}>返回</Button>
    </div>
  )
}

function mapStateToProps({dealDataNavBar}){
  return{dealDataNavBar}
}
export default connect(mapStateToProps)(Form.create({})(DealDataNavBar))
