import React from 'react'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import {Table,Tabs ,Row,Col,Form,Checkbox,Modal,Input} from 'antd'
import SearchBox from '../../../components/resourceManagement/newHousePro/newHouseProIndex/SearchBox'
import PromptModal from '../../../../commons/View/PromptModal'
import DxPanel from '../../../../commons/components/DxPanel'
import {
  renderTotalMoneyStr,
} from '../../../../commons/utils/publicFunction'
import './secondhandSellIndex.css'
const TabPane = Tabs.TabPane;
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const plainOptions = ['房源线下已售', '房源信息错误', '包含非法信息','其它'];
const optionsProState = [{
    value: '全部',
    label: '全部',
  }, {
    value: '合作',
    label: '合作',
  },{
    value:"私有",
    label:"私有"
}];
function SecondHandSellIndex({dispatch,secondHandSellIndex,form}){
  const {
    currentRecord,
    tableData,
    currentSellingPage,
    currentSellingTotal,
    currentSelledPage,
    currentSelledTotal,
    tableLoading,
    areaPath,
    pageNo,
    areaAndCode,
    promptObj,
    activeKey,
    isCooperationSale,
    fullPath,
    keyword,
    offLineStatus,
    id,
    saleWay,
  }=secondHandSellIndex;
  // console.log(tableData,'tableData');
  const {getFieldDecorator}=form;
  const onTabsChange=(key)=>{
    dispatch({
      type:"secondHandSellIndex/changeTabsKey",
      payload:{
        activeKey:key
      }
    })
    if(key==='selled'){
      dispatch({
        type:"secondHandSellIndex/getInitSelledData",
        payload:{
          pageSize:10,
          pageNo:0,
          houseState:"已售",
          resourcesType:'住宅',
          saleWay:"出售",
        }
      })
    }else{
      dispatch({
        type:"secondHandSellIndex/getInitSelledData",
        payload:{
          pageSize:10,
          pageNo:0,
          houseState:"已发布",
          resourcesType:"住宅",
          saleWay:"出售"
        }
      })
    }
  }
  const onSearch=(values)=>{
    console.log(values,'values');
    let area='';
    if(values.areaCode){
      area='/'+values.areaCode.join('/')
    }
    let states='';
    if(values.state=='合作'){
      states='开启';
    }else if(values.state=='私有'){
      states='关闭';
    }
    dispatch({
      type:"secondHandSellIndex/getonSearchData",
      payload:{
        pageSize:10,
        pageNo:0,
        houseState:"已发布",
        resourcesType:"住宅",
        saleWay:(activeKey=='selling'?'出售':'已售'),
        isCooperationSale:states,
        fullPath:area,
        keyword:values.keyword,
      }
    })
  }
  const saveAreaPath=(areaPath)=>{
    dispatch({
      type:"secondHandSellIndex/saveAreaPath",
      payload:{
        areaPath:'/'+areaPath.join('/')
      }
    })
  }
  const sellingColumns=[{
      title:"序号",
      dataIndex:"number"
    },{
      title:"城市",
      dataIndex:"areaName"
    },{
      title:"标题",
      dataIndex:"communityName"
    },{
      title:"户型",
      dataIndex:"houseType"
    },{
      title:"面积",
      dataIndex:"floorArea",
      render:text=><span>{text}㎡</span>
    },{
      title:"总价",
      dataIndex:"totlePrice",
      render:text=><span>{renderTotalMoneyStr(text)}</span>
    },{
      title:"单价",
      dataIndex:"price",
      render:text=><span>{text}元</span>
    },{
      title:"挂牌日期",
      dataIndex:"createDate"
    },{
      title:"销售方式",
      dataIndex:"saleMode",
    },{
      title:"操作",
      render:(text,record,index)=>{
        return(
          <div>
            <span className="operation" onClick={()=>toDetails(record)}>详情</span>
            <span className="operation" onClick={()=>offLine(record)}>下架</span>
          </div>
        )
      }
    }]
  const toDetails=(record)=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/secondhandHouseSell/secHandSellingNavBar',
      state:{
        projectId:record.key,
        isSelled:false,
      }
    }))
  }
  const toSelledDetails=(record)=>{
    dispatch(routerRedux.push({
      // pathname:'/resourceManagement/secondhandHouseSell/secHandSelledNavBar',
      pathname:'/resourceManagement/secondhandHouseSell/secHandSellingNavBar',
      state:{
        projectId:record.key,
        isSelled:true,
      }
    }))
  }
  const offLine=(record)=>{
    dispatch({
      type:"secondHandSellIndex/saveCurrentRecord",
      payload:{
        currentRecord:record,
        id:record.key,
        offLineStatus:true,
      }
    })
    // dispatch({
    //   type:"secondHandSellIndex/togglePrompt",
    //   payload:{
    //     cancelText:"取消",
    //     title:"是否要下架?",
    //     visible:true,
    //     todo:"offLine"
    //   }
    // })
  }
  //确定下架
  const offLineOk=()=>{
    form.validateFields((err,values)=>{
      let reason='';
      if(values.offLineReason && values.offLineReasonEles){
        reason='/'+values.offLineReason.join('/')+values.offLineReasonEles;
      }else if(!values.offLineReason){
        reason=values.offLineReasonEles;
      }else if(values.offLineReason){
        reason='/'+values.offLineReason.join('/');
      }
      dispatch({
        type:'secondHandSellIndex/offLine',
        payload:{
          offLineReason:reason,
          houseId:id,
          saleWay:saleWay,
        }
      })
    })
    form.resetFields();
  }
  //取消下架
  const offLineCancel=()=>{
    form.resetFields();
    dispatch({
      type:'secondHandSellIndex/saveCurrentRecord',
      payload:{
        offLineStatus:false,
      }
    })
  }
  const SelledColumns=[{
      title:"序号",
      dataIndex:"number"
    },{
      title:"城市",
      dataIndex:"areaName"
    },{
      title:"标题",
      dataIndex:"communityName"
    },{
      title:"户型",
      dataIndex:"houseType"
    },{
      title:"面积",
      dataIndex:"floorArea",
      render:text=><span>{text}㎡</span>
    },{
      title:"总价",
      dataIndex:"totalPrice",
      render:text=><span>{renderTotalMoneyStr(text)}</span>
    },{
      title:"单价",
      dataIndex:"price",
      render:text=><span>{text}元</span>
    },{
      title:"成交日期",
      dataIndex:"dealDate"
    },{
      title:"销售方式",
      dataIndex:"saleMode"
    },{
      title:"操作",
      render:(text,record,index)=>{
        return(
          <div>
            <span className="operation" onClick={()=>toSelledDetails(record)}>详情</span>
          </div>
        )
      }
    }]
  const handleCallBackOk=()=>{
    if(promptObj.todo==='closeModal'){
      dispatch({
        type:"secondHandSellIndex/togglePrompt",
        payload:{
          visible:false
        }
      })
    }
    if(promptObj.todo==='closeModalAndFetch'){
      dispatch({
        type:"secondHandSellIndex/togglePrompt",
        payload:{
          visible:false
        }
      })
      dispatch({
        type:"secondHandSellIndex/getInitSellingData",
        payload:{
          pageSize:10,
          pageNo:0,
          houseState:"已发布",
          resourcesType:"住宅",
          saleWay:saleWay,
        }
      })
    }
    if(promptObj.todo==='offLine'){
      // console.log('currentRecord',currentRecord);
      // if(!!currentRecord){
      //   dispatch({
      //     type:"secondhandHouseSell/offLine",
      //     payload:{
      //       id:currentRecord.id
      //     }
      //   })
      // }
    }
  }
  const handleCallBackCancel=()=>{
    if(promptObj.todo==='offLine'){
      dispatch({
        type:"secondHandSellIndex/togglePrompt",
        payload:{visible:false}
      })
    }
  }
  const sellingPagination={
    showTotal:(currentSellingTotal)=>{return(`共${currentSellingTotal}项`)},
    pageSize:10,
    current:pageNo,
    // showQuickJumper:true,
    total:currentSellingTotal,
    onChange:(page)=>{
      dispatch({
        type:"secondHandSellIndex/changeTableLoading",
        payload:{
          tableLoading:true
        }
      })
      dispatch({
        type:"secondHandSellIndex/getInitSellingData",
        payload:{
          pageSize:10,
          pageNo:page-1,
          houseState:"已发布",
          resourcesType:"住宅",
          saleWay:"出售",
          isCooperationSale:isCooperationSale,
          fullPath:fullPath,
          keyword:keyword,
        }
      })
    }
  }
  const selledPagination={
    // showTotal:(currentSelledTotal)=>{return(`共${currentSelledTotal}项`)},
    pageSize:10,
    current:pageNo,
    // showQuickJumper:true,
    total:currentSelledTotal,
    onChange:(page)=>{
      dispatch({
        type:"secondHandSellIndex/changeTableLoading",
        payload:{
          tableLoading:true
        }
      })
      dispatch({
        type:"secondHandSellIndex/getInitSelledData",
        payload:{
          pageSize:10,
          pageNo:page-1,
          houseState:"已售",
          resourcesType:"住宅",
          saleWay:"已售",
          isCooperationSale:isCooperationSale,
          fullPath:fullPath,
          keyword:keyword,
        }
      })
    }
  }

  return(
    <DxPanel title="二手房出售">
      <div className="secondHandSellIndex">
        <PromptModal {...promptObj} onOk={handleCallBackOk} onCancel={handleCallBackCancel}/>
        {areaAndCode.length!==0&&tableLoading?null:<SearchBox
                onSearch={onSearch}
                showDealCenter={false}
                label="销售方式"
                type="state"
                areaAndCode={!!areaAndCode?areaAndCode:[]}
                saveAreaPath={saveAreaPath}
                optionsProState={optionsProState}
                />}
        <Tabs onChange={onTabsChange} type="card" >
          <TabPane tab="在售" key="selling">
            <Table
              loading={tableLoading}
              dataSource={tableData}
              columns={sellingColumns}
              pagination={sellingPagination}
              />
          </TabPane>
          <TabPane tab="已售" key="selled">
            <Table
              columns={SelledColumns}
              loading={tableLoading}
              dataSource={tableData}
              pagination={selledPagination}
              />
          </TabPane>
        </Tabs>
      </div>
      <Modal title='下架' visible={offLineStatus}
        onOk={offLineOk} onCancel={offLineCancel}
      >
        <Form>
          <FormItem>
            {getFieldDecorator('offLineReason', {
            })(
              <CheckboxGroup options={plainOptions}/>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('offLineReasonEles', {
            })(
              <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} />
            )}
          </FormItem>
        </Form>
      </Modal>
    </DxPanel>
  )
}
function mapStateToProps({secondHandSellIndex}){
  return{
    secondHandSellIndex
  }
}
SecondHandSellIndex = Form.create({})(SecondHandSellIndex);
export default connect(mapStateToProps)(SecondHandSellIndex)
