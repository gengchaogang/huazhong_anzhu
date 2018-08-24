import React from 'react'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import {Table,Tabs,Form,Input,Checkbox,Modal,Cascader,Select,Button} from 'antd'
import SearchBox from '../../../components/resourceManagement/newHousePro/newHouseProIndex/SearchBox'
import PromptModal from '../../../../commons/View/PromptModal'
import DxPanel from '../../../../commons/components/DxPanel'
const plainOptions = ['房源线下已售', '房源信息错误', '包含非法信息','其它'];
import './OfficeRent.css'
const FormItem=Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
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
function OfficeRent({dispatch,officeRent,form}){
  const {getFieldDecorator}=form;
  const {
    loading,
    houseState,
    cascaderArr,
    dataSoruce,
    total,
    keyword,
    fullPath,
    isCooperationSale,
    pageNo,
    offLineStatus,
    id,
  }=officeRent
  const rentingColumns=[
    {
      title:'序号',
      dataIndex:'number',
    },
    {
      title:'城市',
      dataIndex:'areaName',
    },
    {
      title:'标题',
      dataIndex:'houseName',
    },
    {
      title:'面积',
      dataIndex:'floorArea',
      render:text=><span>{text}㎡</span>
    },
    {
      title:'总价',
      dataIndex:'totlePriceShowName',
    },
    {
      title:'单价',
      dataIndex:'price',
      render:text=><span>{text}元</span>
    },
    {
      title:(houseState=='已发布'?'挂牌日期':'成交日期'),
      dataIndex:'createDate',
    },
    {
      title:'销售方式',
      dataIndex:'houseStateShowName',
    },
    {
      title:'操作',
      render:(text,record)=>{
        if(houseState=='已发布'&& record.houseStateShowName!='已下架'){
          return <div>
            <span className='operationColor' onClick={()=>{watchDatil(record)}}>详情</span>
            <span className='operationColor' onClick={()=>{offLineClick(record)}}>下架</span>
          </div>
        }else{
          return <span className='operationColor' onClick={()=>{watchDatil(record)}}>详情</span>
        }
      }
    },
  ];
  //查看详情
  const watchDatil=(record)=>{
    dispatch(routerRedux.push({
			pathname: `/resourceManagement/officeBuildingRent/officeRentDetail`,
      state:{
        id:record.key,
        transCode:record.transCode,
      }
		}));
  }
  //下架
  const offLineClick=(record)=>{
    dispatch({
      type:'officeRent/offLineClick',
      payload:{offLineStatus:true,id:record.key}
    })
  }
  //确定下架
  const offLineOk=()=>{
    form.validateFields((err,values)=>{
      let reason='';
      if(values.offLineReason){
        reason=values.offLineReason.join('/')+'/'+values.offLineReasonEles;
      }else{
        reason=values.offLineReasonEles;
      }
      dispatch({
        type:'officeRent/offLineOk',
        payload:{
          houseId:id,
          offLineReason:reason,
        }
      })
    })
    form.resetFields();
  }
  //取消下架
  const offLineCancel=()=>{
    form.resetFields();
    dispatch({
      type:'officeRent/offLineClick',
      payload:{
        offLineStatus:false,
      }
    })
  }
  //tabs切换的回调
  const callBack=(key)=>{
    dispatch({
      type:'officeRent/loading',
      payload:{
        loading:true,
      }
    })
    dispatch({
      type:'officeRent/findAll',
      payload:{
        keyword:'',
        fullPath:'',
        isCooperationSale:'',
        houseState:key,
        pageNo:0,
        pageSize:10,
        saleWay:'出租',
        resourcesType:'写字楼',
      }
    })
    form.resetFields();
  }
  //分页
  const pagination={
    current:pageNo,
    total:total,
    onChange:(page)=>{
      dispatch({
        type:'officeRent/loading',
        payload:{
          loading:true,
        }
      })
      dispatch({
        type:'officeRent/findAll',
        payload:{
          keyword:keyword,
          fullPath:fullPath,
          isCooperationSale:isCooperationSale,
          houseState:houseState,
          saleWay:'出租',
          pageNo:page-1,
          pageSize:10,
          resourcesType:'写字楼',
        }
      })
    }
  }
  //搜索
  const searchClick=()=>{
    form.validateFields((err,values)=>{
      let areas='';
      if(values.fullPath){
        areas='/'+values.fullPath.join('/')
      }
      let statesCooperationSale='';
      if(values.isCooperationSale=='合作'){
        statesCooperationSale='开启'
      }else if(values.isCooperationSale=='私有'){
        statesCooperationSale='关闭'
      }
      dispatch({
        type:'officeRent/loading',payload:{loading:true}
      })
      dispatch({
        type:'officeRent/findAll',
        payload:{
          keyword:values.keyword,
          fullPath:areas,
          isCooperationSale:statesCooperationSale,
          houseState:houseState,
          pageNo:0,
          pageSize:10,
          saleWay:'出租',
          resourcesType:'写字楼',
        }
      })
    })
  }
  //重置
  const resetClick=()=>{
    dispatch({
      type:'officeRent/loading',payload:{loading:true}
    })
    dispatch({
      type:'officeRent/findAll',
      payload:{
        keyword:'',
        fullPath:'',
        isCooperationSale:'',
        houseState:houseState,
        saleWay:'出租',
        pageNo:0,
        pageSize:10,
        resourcesType:'写字楼',
      }
    })
    form.resetFields();
  }
  return(
    <DxPanel title="写字楼出租">
      <div>
        <Form inline style={{margin:'20px 0'}}>
  				<FormItem
  					label="关键字"
  				>
  					{getFieldDecorator('keyword', {
  					})(
  						<Input placeholder='搜索标题内容'/>
  					)}
  				</FormItem>
  				<FormItem
  					label="城市"
  				>
  					{getFieldDecorator('fullPath', {
  					})(
  						<Cascader placeholder='河北省 / 保定市' options={cascaderArr}/>
  					)}
  				</FormItem>
  				<FormItem
  					label="出租方式"
  				>
  					{getFieldDecorator('isCooperationSale', {
  					})(
  						<Select style={{width:'200px'}}>
                <Option value='合作' key='合作'>合作</Option>
                <Option value='私有' key='私有'>私有</Option>
              </Select>
  					)}
  				</FormItem>
          <Button type='primary' onClick={searchClick}>搜索</Button>
          <Button type='ghost' onClick={resetClick}>重置</Button>
        </Form>
      </div>
      <Tabs type='card' onChange={callBack}>
        <TabPane tab='在租' key='已发布'>
          <Table columns={rentingColumns} dataSource={dataSoruce}
            pagination={pagination} loading={loading}
          />
        </TabPane>
        <TabPane tab='已租' key='已售'>
          <Table columns={rentingColumns}/>
        </TabPane>
      </Tabs>
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
function mapStateToProps({officeRent}){
  return{
    officeRent
  }
}
OfficeRent = Form.create({})(OfficeRent);
export default connect(mapStateToProps)(OfficeRent)
