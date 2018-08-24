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
import './StoreSell.css'
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
function StoreSell({dispatch,storeSell,form}){
  const {
    tableData,
    loading,
    areaAndCode,
    resourcesType,
    pageNo,
    houseState,
    keyword,
    total,
    fullPath,
    isCooperationSale,
    offLineStatus,
    id,
    promptObj,
  }=storeSell;
  const {getFieldDecorator}=form;
  const onTabsChange=(key)=>{
    dispatch({
      type:"storeSell/getInitSellingData",
      payload:{
        pageSize:10,
        resourcesType:"商铺",
        pageNo:0,
        houseState:key,
        saleWay:'出售',
        keyword:'',
        fullPath:'',
        isCooperationSale:'',
      }
    })
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
        type:'storeSell/offLine',
        payload:{
          offLineReason:reason,
          houseId:id,
          pageSize:10,
          pageNo:0,
          houseState:houseState,
          resourcesType:"商铺",
          isCooperationSale:'',
          saleWay:'出售',
          fullPath:'',
          keyword:'',
        }
      })
    })
    form.resetFields();
  }
  //取消下架
  const offLineCancel=()=>{
    form.resetFields();
    dispatch({
      type:'storeSell/saveCurrentRecord',
      payload:{
        offLineStatus:false,
      }
    })
  }
  //搜索
  const onSearch=(values)=>{
    // console.log('values',values);
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
      type:"storeSell/getInitSellingData",
      payload:{
        pageSize:10,
        pageNo:0,
        houseState:houseState,
        resourcesType:"商铺",
        saleWay:'出售',
        isCooperationSale:states,
        fullPath:area,
        keyword:values.keyword,
      }
    })
  }
  const saveAreaPath=(areaPath)=>{
    dispatch({
      type:"storeSell/saveAreaPath",
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
      pathname:'/resourceManagement/storeSell/storeSellingNavBar',
      state:{
        projectId:record.key
      }
    }))
  }
  const toSelledDetails=(record)=>{
    dispatch(routerRedux.push({
      pathname:'/resourceManagement/storeSell/storeSellingNavBar',
      state:{
        projectId:record.key
      }
    }))
  }
  const offLine=(record)=>{
    dispatch({
      type:"storeSell/saveCurrentRecord",
      payload:{
        id:record.key,
        offLineStatus:true,
      }
    })
    // dispatch({
    //   type:"storeSell/togglePrompt",
    //   payload:{
    //     cancelText:"取消",
    //     title:"是否要下架?",
    //     visible:true,
    //     todo:"offLine"
    //   }
    // })
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
        type:"storeSell/togglePrompt",
        payload:{
          visible:false
        }
      })
    }
    if(promptObj.todo==='closeModalAndFetch'){
      dispatch({
        type:"storeSell/togglePrompt",
        payload:{
          visible:false
        }
      })
      dispatch({
        type:"storeSell/getInitSellingData",
        payload:{
          pageSize:10,
          pageNo:0,
          houseState:"已发布",
          resourcesType:"商铺",
          saleWay:"出售",
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
        type:"storeSell/togglePrompt",
        payload:{visible:false}
      })
    }
  }
  const sellingPagination={
    pageSize:10,
    current:pageNo,
    total:total,
    onChange:(page)=>{
      dispatch({
        type:"storeSell/changeTableLoading",
        payload:{
          loading:true
        }
      })
      dispatch({
        type:"storeSell/getInitSellingData",
        payload:{
          pageSize:10,
          pageNo:0,
          houseState:houseState,
          resourcesType:"商铺",
          saleWay:'出售',
          isCooperationSale:isCooperationSale,
          fullPath:fullPath,
          keyword:keyword,
          pageSize:10,
          pageNo:page-1,
        }
      })
    }
  }
  // const selledPagination={
  //   showTotal:(currentSelledTotal)=>{return(`共${currentSelledTotal}项`)},
  //   pageSize:10,
  //   defaultCurrent:1,
  //   showQuickJumper:true,
  //   total:currentSelledTotal,
  //   onChange:(page)=>{
  //     dispatch({
  //       type:"storeSell/changeTableLoading",
  //       payload:{
  //         tableLoading:true
  //       }
  //     })
  //     dispatch({
  //       type:"storeSell/getInitSelledData",
  //       payload:{
  //         pageSize:10,
  //         pageNo:page-1,
  //         houseState:"已售"
  //       }
  //     })
  //   }
  // }

  return(
    <DxPanel title="商铺出售">
      <div className="storeSell">
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
          <TabPane tab="在售" key="已发布">
            <Table
              loading={loading}
              dataSource={tableData}
              columns={sellingColumns}
              pagination={sellingPagination}
              />
          </TabPane>
          <TabPane tab="已售" key="已售">
            <Table
              columns={SelledColumns}
              loading={loading}
              dataSource={tableData}
              pagination={sellingPagination}
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
function mapStateToProps({storeSell}){
  return{
    storeSell
  }
}
StoreSell = Form.create({})(StoreSell);
export default connect(mapStateToProps)(StoreSell)
