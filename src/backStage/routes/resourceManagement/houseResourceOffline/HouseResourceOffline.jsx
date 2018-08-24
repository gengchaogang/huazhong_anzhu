import React from 'react'
import {connect } from 'dva'
import { routerRedux } from 'dva/router';
import {Table,Icon,Button,Modal,Form,Tabs,Radio,Input,Cascader,Select} from 'antd'
import DxPanel from '../../../../commons/components/DxPanel'
import {
  renderTotalMoneyStr,
} from '../../../../commons/utils/publicFunction'
import PromptModal from '../../../../commons/View/PromptModal'
import './houseResourceOffline.css'
const FormItem=Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
function HouseResourceOffline({dispatch,houseResourceOffline,form}){
  const {
    radioValue,
    resourcesType,
    secDataSource,
    total,
    pageNo,
    fullPath,
    keyword,
    saleWay,
    cascaderArr,
    loading,
    newHouseSource,
    tradingArrCode,
    tradingCenterCode,
    areaPath,
  }=houseResourceOffline;
  const {getFieldDecorator}=form;
  //新房项目
  const newHouseColumns=[
    {
      title:'序号',
      dataIndex:'number',
    },
    {
      title:'项目名称',
      dataIndex:'name',
    },
    {
      title:'所在区域',
      dataIndex:'areaPath',
    },
    {
      title:'房源单价',
      dataIndex:'price',
      render:text=><span>{text}元</span>
    },
    {
      title:'带看数',
      dataIndex:'lookNumber',
    },
    {
      title:'已售优惠',
      dataIndex:'discount',
    },
    {
      title:'创建时间',
      dataIndex:'createDateTime',
    },
    {
      title:'交易中心',
      dataIndex:'tradingCenterName',
    },
    {
      title:'剩余/总套数',
      dataIndex:'sellTotle',
    },
    {
      title:'操作',
      render:(text,record)=>(
        <div>
          <span className='operation' onClick={()=>{upLineNewHouse(record.key)}}>上架</span>
          <span className='operation' onClick={()=>{detailNewHouse(record.key)}}>详情</span>
          <span className='operation' onClick={()=>{deleteNewHouse(record.key)}}>删除</span>
        </div>
      )
    },
  ];
  //新房上架
  const upLineNewHouse=(key)=>{
    Modal.confirm({
      title: '提示',
      content: '确定要上架',
      onOk() {
        dispatch({
          type:'houseResourceOffline/loading',
          payload:{loading:true}
        })
        dispatch({
          type:'houseResourceOffline/upLineNewHouse',
          payload:{
            projectId:key,
            areaPath:areaPath,
            keyword:keyword,
            tradingCenterCode:tradingCenterCode,
            pageNo:0,
            status:'已下架',
          }
        })
      },
      onCancel() {
      },
    });
  }
  //新房详情
  const detailNewHouse=(key)=>{
    dispatch(routerRedux.push({
			pathname: `/resourceManagement/soldOutHouse/houseResourceOfflineDetail`,
      state:{
        id:key,
      }
		}));
  }
  //删除
  const deleteNewHouse=(key)=>{
    Modal.confirm({
      title: '提示',
      content: '确定要删除',
      onOk() {
        dispatch({
          type:'houseResourceOffline/loading',
          payload:{loading:true}
        })
        dispatch({
          type:'houseResourceOffline/deleteNewHouse',
          payload:{
            id:key,
            areaPath:areaPath,
            keyword:keyword,
            tradingCenterCode:tradingCenterCode,
            pageNo:0,
            status:'已下架',
          }
        })
      },
      onCancel() {
      },
    });
  }
  //二手房
  const secondHouseColumns=[
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
      title:'户型',
      dataIndex:'houseType',
    },
    {
      title:'面积',
      dataIndex:'floorArea',
      render:text=><span>{text}㎡</span>
    },
    {
      title:(saleWay=='出售'?'总价':'租金'),
      dataIndex:'totlePrice',
      render:text=>{
        if(saleWay=='出售'){
          return  renderTotalMoneyStr(text)
        }else{
          return text
        }
      }
    },
    {
      title:'单价',
      dataIndex:'price',
      render:text=><span>{text}元</span>
    },
    {
      title:(saleWay=='出售'?'销售方式':'出租方式'),
      dataIndex:(saleWay=='出售'?'isCooperationSale':'rentType'),
    },
    {
      title:'下架日期',
      dataIndex:'offiLineTime',
    },
    {
      title:'操作',
      render:(text,record)=>(
        <div>
          <span className='operation' onClick={()=>{upLineSecHouse(record.key)}}>上架</span>
          <span className='operation' onClick={()=>{detailSecHouse(record)}}>详情</span>
          <span className='operation' onClick={()=>{deleteSecHouse(record.key)}}>删除</span>
        </div>
      )
    },
  ];
  if(saleWay=='出租'){
    secondHouseColumns.splice(6,1);
  }
  //商铺
  const shopColumns=[
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
      dataIndex:'floorAreas',
    },
    {
      title:(saleWay=='出售'?'总价':'租金'),
      dataIndex:'totlePrice',
    },
    {
      title:'单价',
      dataIndex:'price',
    },
    {
      title:(saleWay=='出售'?'销售方式':'出租方式'),
      dataIndex:(saleWay=='出售'?'isCooperationSale':'rentType'),
    },
    {
      title:'下架日期',
      dataIndex:'offiLineTime',
    },
    {
      title:'操作',
      render:(text,record)=>(
        <div>
          <span className='operation' onClick={()=>{upLineSecHouse(record.key)}}>上架</span>
          <span className='operation' onClick={()=>{detailSecHouse(record)}}>详情</span>
          <span className='operation' onClick={()=>{deleteSecHouse(record.key)}}>删除</span>
        </div>
      )
    },
  ];
  if(saleWay=='出租'){
    shopColumns.splice(6,1);
  }
  //写字楼
  const officeColumns=[
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
      dataIndex:'floorAreas',
    },
    {
      title:(saleWay=='出售'?'总价':'租金'),
      dataIndex:'totlePrice',
    },
    {
      title:'单价',
      dataIndex:'price',
    },
    {
      title:(saleWay=='出售'?'销售方式':'出租方式'),
      dataIndex:(saleWay=='出售'?'isCooperationSale':'rentType'),
    },
    {
      title:'下架日期',
      dataIndex:'offiLineTime',
    },
    {
      title:'操作',
      render:(text,record)=>(
        <div>
          <span className='operation' onClick={()=>{upLineSecHouse(record.key)}}>上架</span>
          <span className='operation' onClick={()=>{detailSecHouse(record)}}>详情</span>
          <span className='operation' onClick={()=>{deleteSecHouse(record.key)}}>删除</span>
        </div>
      )
    },
  ];
  if(saleWay=='出租'){
    shopColumns.splice(6,1);
  }
  //商铺 二手房 写字楼上线
  const upLineSecHouse=(key)=>{
    Modal.confirm({
      title: '提示',
      content: '确定要上架',
      onOk() {
        dispatch({
          type:'houseResourceOffline/loading',
          payload:{loading:true}
        })
        dispatch({
          type:'houseResourceOffline/upLineSecHouse',
          payload:{
            id:key,
            keyword:keyword,
            fullPath:fullPath,
            houseState:'已下架',
            resourcesType:resourcesType,
            saleWay:saleWay,
            pageNo:0,
          }
        })
      },
      onCancel() {
      },
    });
  }
  //商铺 二手房 写字楼详情
  const detailSecHouse=(record)=>{
    dispatch(routerRedux.push({
			pathname: `/resourceManagement/soldOutHouse/secHouseShopOffceDetail`,
      state:{
        id:record.key,
        transCode:record.transCode,
      }
		}));
  }
  //商铺 二手房 写字楼删除
  const deleteSecHouse=(key)=>{
    Modal.confirm({
      title: '提示',
      content: '确定要删除',
      onOk() {
        dispatch({
          type:'houseResourceOffline/loading',
          payload:{loading:true}
        })
        dispatch({
          type:'houseResourceOffline/deleteSecHouse',
          payload:{
            id:key,
            keyword:keyword,
            fullPath:fullPath,
            houseState:'已下架',
            resourcesType:resourcesType,
            saleWay:saleWay,
            pageNo:0,
          }
        })
      },
      onCancel() {
      },
    });
  }
  //标签页切换的回调
  const tabsOnChange=(tabs)=>{
    if(tabs=='新房项目'){
      dispatch({
        type:'houseResourceOffline/loading',
        payload:{
          loading:true,
        }
      })
      dispatch({
        type:'houseResourceOffline/newHouseList',
        payload:{
          areaPath:'',
          keyword:'',
          pageNo:0,
          tradingCenterCode:'',
          areaPath:'',//新房用
          status:'已下架',
        }
      })
    }else{
      dispatch({
        type:'houseResourceOffline/loading',
        payload:{
          loading:true,
        }
      })
      dispatch({
        type:'houseResourceOffline/listDataSource',
        payload:{
          keyword:'',
          fullPath:'',
          houseState:'已下架',
          resourcesType:tabs,
          saleWay:'出售',
          pageNo:0,
        }
      })
    }
    form.resetFields();
  }
  //
  const radioChange=(key)=>{
    dispatch({
      type:'houseResourceOffline/loading',
      payload:{
        loading:true,
      }
    })
    dispatch({
      type:'houseResourceOffline/setState',
      payload:{
        radioValue:key.target.value,
      }
    })
    dispatch({
      type:'houseResourceOffline/listDataSource',
      payload:{
        keyword:'',
        fullPath:'',
        houseState:'已下架',
        resourcesType:resourcesType,
        saleWay:key.target.value,
        pageNo:0,
      }
    })
  }
  //搜索
  const searchClick=()=>{
    form.validateFields((err,values)=>{
      let areas='';
      if(values.fullPath){
        areas='/'+values.fullPath.join('/');
      }
      dispatch({
        type:'houseResourceOffline/loading',
        payload:{
          loading:true,
        }
      })
      if(resourcesType=='新房项目'){
        dispatch({
          type:'houseResourceOffline/newHouseList',
          payload:{
            areaPath:areas,
            keyword:values.keyword,
            pageNo:0,
            tradingCenterCode:values.tradingCenterCode,
            status:'已下架',
          }
        })
      }else{
        dispatch({
          type:'houseResourceOffline/listDataSource',
          payload:{
            keyword:values.keyword,
            fullPath:areas,
            houseState:'已下架',
            resourcesType:resourcesType,
            saleWay:saleWay,
            pageNo:0,
          }
        })
      }
    })
  }
  //重置
  const resetClick=()=>{
    dispatch({
      type:'houseResourceOffline/setState',
      payload:{
        keyword:'',
        fullPath:'',

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
        type:'houseResourceOffline/loading',
        payload:{
          loading:true,
        }
      })
      if(resourcesType!='新房项目'){
        dispatch({
          type:'houseResourceOffline/listDataSource',
          payload:{
            keyword:keyword,
            fullPath:fullPath,
            saleWay:saleWay,
            pageNo:page-1,
            resourcesType:resourcesType,
            houseState:'已下架',
            pageSize:10,
          }
        })
      }else{
        dispatch({
          type:'houseResourceOffline/newHouseList',
          payload:{
            areaPath:areaPath,
            keyword:keyword,
            pageNo:page-1,
            tradingCenterCode:tradingCenterCode,
            status:'已下架',
          }
        })
      }
    }
  }
  return(
    <DxPanel title="带看记录">
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
        {resourcesType=='新房项目' &&
        <FormItem
          label="交易中心"
        >
          {getFieldDecorator('tradingCenterCode', {
          })(
            <Select style={{width:'200px'}}>
              {tradingArrCode.map((item,index)=>(
                <Option key={item.key} value={item.code}>{item.name}</Option>
              ))}
            </Select>
          )}
        </FormItem>}
        <Button type='primary' onClick={searchClick}>搜索</Button>
        <Button type='ghost' onClick={resetClick}>重置</Button>
      </Form>
      <Tabs type='card' onChange={tabsOnChange}>
        <TabPane tab='新房项目' key="新房项目">
          <Table
            columns={newHouseColumns}
            pagination={pagination}
            dataSource={newHouseSource}
            loading={loading}
          />
        </TabPane>
        <TabPane tab='二手房' key="住宅">
          <RadioGroup defaultValue="出售" value={saleWay} onChange={radioChange}>
            <RadioButton value="出售">出售</RadioButton>
            <RadioButton value="出租">出租</RadioButton>
          </RadioGroup>
          <Table columns={secondHouseColumns} dataSource={secDataSource}
            pagination={pagination} loading={loading}
          />
        </TabPane>
        <TabPane tab='商铺' key="商铺">
          <RadioGroup defaultValue="出售" value={saleWay} onChange={radioChange}>
            <RadioButton value="出售">出售</RadioButton>
            <RadioButton value="出租">出租</RadioButton>
          </RadioGroup>
          <Table
            columns={shopColumns}  dataSource={secDataSource}
            pagination={pagination} loading={loading}
          />
        </TabPane>
        <TabPane tab='写字楼' key="写字楼">
          <RadioGroup defaultValue="出售" value={saleWay} onChange={radioChange}>
            <RadioButton value="出售">出售</RadioButton>
            <RadioButton value="出租">出租</RadioButton>
          </RadioGroup>
          <Table
            columns={officeColumns}  dataSource={secDataSource}
            pagination={pagination} loading={loading}
          />
        </TabPane>
      </Tabs>
    </DxPanel>
  )
}
function mapStateToProps({houseResourceOffline}){
  return{houseResourceOffline}
}
HouseResourceOffline = Form.create({})(HouseResourceOffline);
export default connect(mapStateToProps)(HouseResourceOffline)
