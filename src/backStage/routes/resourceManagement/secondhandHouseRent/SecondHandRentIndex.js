import React from 'react'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import {Table,Tabs ,Row,Col,Modal,Checkbox,Input,Form} from 'antd'
import SearchBox from '../../../components/resourceManagement/newHousePro/newHouseProIndex/SearchBox'
import PromptModal from '../../../../commons/View/PromptModal'
import DxPanel from '../../../../commons/components/DxPanel'
import {
  renderTotalMoneyStr,
} from '../../../../commons/utils/publicFunction'
import './secondhandRentIndex.css'
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
function SecondHandRentIndex({dispatch,secondHandRentIndex,form}){
  const {
    areaAndCode,
    loading,
    tableData,
    currentRentingTotal,
    currentRentingPage,
    pageNo,
    total,
    houseState,
    resourcesType,
    keyword,
    fullPath,
    isCooperationSale,
    promptObj,
    offLineStatus,
    id,
  }=secondHandRentIndex;
  const {getFieldDecorator}=form;
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
        type:'secondHandRentIndex/offLine',
        payload:{
          offLineReason:reason,
          houseId:id,
          pageSize:10,
          pageNo:0,
          houseState:houseState,
          resourcesType:"住宅",
          saleWay:'出租',
          keyword:'',
          fullPath:'',
          isCooperationSale:'',
        }
      })
    })
    form.resetFields();
  }
  //取消下架
  const offLineCancel=()=>{
    form.resetFields();
    dispatch({
      type:'secondHandRentIndex/saveCurrentRecord',
      payload:{
        offLineStatus:false,
      }
    })
  }
  const onTabsChange=(key)=>{
    // console.log(key);
    dispatch({
      type:"secondHandRentIndex/getInitRentingData",
      payload:{
        pageSize:10,
        pageNo:0,
        houseState:key,
        resourcesType:"住宅",
        saleWay:'出租',
        keyword:'',
        fullPath:'',
        isCooperationSale:'',
      }
    })
  }
  const onSearch=(values)=>{
    let fullPath='';
    if(values.areaCode){
      fullPath='/'+values.areaCode.join('/');
    }
    let states='';
    if(values.state=='合作'){
      states='开启';
    }else if(values.state=='私有'){
      states='关闭';
    }
    dispatch({
      type:'secondHandRentIndex/getInitRentingData',
      payload:{
        pageSize:10,
        pageNo:0,
        houseState:houseState,
        resourcesType:"住宅",
        saleWay:"出租",
        keyword:values.keyword,
        fullPath:fullPath,
        isCooperationSale:states,
      }
    })
  }
  const saveAreaPath=(areaPath)=>{
    dispatch({
      type:"secondHandRentIndex/saveAreaPath",
      payload:{
        areaPath:'/'+areaPath.join('/')
      }
    })
  }
  const RentingColumns=[{
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
      dataIndex:"totlePriceShowName",
    },{
      title:"单价",
      dataIndex:"price",
      render:text=><span>{text}元</span>
    },{
      title:"挂牌日期",
      dataIndex:"createDate"
    },{
      title:"销售方式",
      dataIndex:"saleMode"
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
      pathname:'/resourceManagement/secondhandHouseRent/secHandRentingNavBar',
      state:{
        projectId:record.key
      }
    }))
  }
  const toRentedDetails=(record)=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/secondhandHouseRent/secHandRentingNavBar',
      state:{
        projectId:record.key
      }
    }))
  }
  const offLine=(record)=>{
    dispatch({
      type:"secondHandRentIndex/saveCurrentRecord",
      payload:{
        // currentRecord:record,
        id:record.key,
        offLineStatus:true,
      }
    })
    // dispatch({
    //   type:"secondHandRentIndex/saveCurrentRecord",
    //   payload:{
    //     currentRecord:record
    //   }
    // })
    // dispatch({
    //   type:"secondHandRentIndex/togglePrompt",
    //   payload:{
    //     cancelText:"取消",
    //     title:"是否要下架?",
    //     visible:true,
    //     todo:"offLine"
    //   }
    // })
  }
  const RentedColumns=[{
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
            <span className="operation" onClick={()=>toRentedDetails(record)}>详情</span>
          </div>
        )
      }
    }]
  const handleCallBackOk=()=>{
    if(promptObj.todo==='closeModal'){
      dispatch({
        type:"secondHandRentIndex/togglePrompt",
        payload:{
          visible:false
        }
      })
    }
    if(promptObj.todo==='closeModalAndFetch'){
      dispatch({
        type:"secondHandRentIndex/togglePrompt",
        payload:{
          visible:false
        }
      })
      dispatch({
        type:"secondHandRentIndex/getInitRentingData",
        payload:{
          pageSize:10,
          pageNo:0,
          houseState:"已发布",
          resourcesType:'住宅',
          saleWay:'出租',
        }
      })
    }
    if(promptObj.todo==='offLine'){
      // console.log('currentRecord',currentRecord);
      // if(!!currentRecord){
      //   dispatch({
      //     type:"secondhandHouseRent/offLine",
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
        type:"secondHandRentIndex/togglePrompt",
        payload:{visible:false}
      })
    }
  }
  const RentingPagination={
    total:total,
    current:pageNo,
    onChange:(page)=>{
      dispatch({
        type:"secondHandRentIndex/changeTableLoading",
        payload:{
          loading:true
        }
      })
      dispatch({
        type:"secondHandRentIndex/getInitRentingData",
        payload:{
          pageSize:10,
          pageNo:page-1,
          houseState:houseState,
          resourcesType:"住宅",
          keyword:keyword,
          fullPath:fullPath,
          saleWay:'出租',
          isCooperationSale:isCooperationSale,
        }
      })
    }
  }
  const RentedPagination={
    pageSize:10,
    current:pageNo,
    total:total,
    onChange:(page)=>{
      dispatch({
        type:"secondHandRentIndex/changeTableLoading",
        payload:{
          loading:true
        }
      })
      dispatch({
        type:"secondHandRentIndex/getInitRentedData",
        payload:{
          pageSize:10,
          pageNo:page-1,
          houseState:"已售",
          resourcesType:'住宅',
          saleWay:'出租',
        }
      })
    }
  }

  return(
    <DxPanel title="二手房出租">
      <div className="secondHandRentIndex">
        {/*<PromptModal {...promptObj} onOk={handleCallBackOk} onCancel={handleCallBackCancel}/>*/}
        {areaAndCode.length!==0&&loading?null:<SearchBox
                onSearch={onSearch}
                showDealCenter={false}
                label="销售方式"
                type="state"
                areaAndCode={!!areaAndCode?areaAndCode:[]}
                saveAreaPath={saveAreaPath}
                optionsProState={optionsProState}
                />}
        <Tabs onChange={onTabsChange} type="card" >
          <TabPane tab="在租" key="已发布">
            <Table
              loading={loading}
              dataSource={tableData}
              columns={RentingColumns}
              pagination={RentingPagination}
              />
          </TabPane>
          <TabPane tab="已租" key="已售">
            <Table
              columns={RentedColumns}
              loading={loading}
              dataSource={tableData}
              pagination={RentingPagination}
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
function mapStateToProps({secondHandRentIndex}){
  return{
    secondHandRentIndex
  }
}
SecondHandRentIndex = Form.create({})(SecondHandRentIndex);
export default connect(mapStateToProps)(SecondHandRentIndex)
