import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button, Table } from 'antd';
import './newHousePro.css';
import UnloadHouseModal from '../../../components/resourceManagement/secondhandHouseSell/housingDetails/UnloadHouseModal';
import SearchBox from '../../../components/resourceManagement/newHousePro/newHouseProIndex/SearchBox.js'
import OffLineModal from '../../../components/resourceManagement/newHousePro/newHouseProIndex/OffLineModal'
import PromptModal from '../../../../commons/View/PromptModal'
const optionsProState = [{
  value: '全部',
  label: '全部',
}, {
  value: '已下架',
  label: '已下架',
},];
function NewHousePro({  dispatch,newHouseProIndex }) {
  const {
    totalElements,
    dealCenterData,
    areaAndCode,
    areaPath,
    visible,
    tableLoading,
    promptObj,
    tableData,
    currentRecord,
  }=newHouseProIndex
  const dealDataClick=(record)=>{
    dispatch(routerRedux.push({
      pathname:'resourceManagement/newHousePro/dealData',
      state:{
        name:record.name,
        tradingCenterName:record.tradingCenterName,
        projectId:record.key
      }
    }))
  }
  const columns = [{
      title: '序号',
      dataIndex: 'number',
    }, {
      title: '项目名称',
      dataIndex: 'name',
    }, {
      title: '所在区域',
      dataIndex: 'areaPath',
    }, {
      title: '房源单价',
      dataIndex: 'price',
      render:text=><span>{text}元</span>
    }, {
      title: '带看次数',
      dataIndex: 'lookNumber',
    }, {
      title: '团购优惠',
      dataIndex: 'discount',
    }, {
      title: '创建时间',
      dataIndex: 'createDateTime',
    }, {
      title: '交易中心',
      dataIndex: 'tradingCenterName',
    },{
      title: '剩余/总套数',
      dataIndex: 'sellTotle',
    }, {
      title: '操作',
      render:(text, record) => {
        return (
          <span>
            <span className="operation" onClick={()=>offLine(record)}>下架</span>
            <span className="ant-divider" />
            <span className="operation" onClick={()=>routePush(record)}>详情</span>
            <span className="ant-divider" />
            <span className="operation" onClick={()=>dealDataClick(record)}>交易数据</span>
          </span>
        )
      }
    }];
    const routePush=(record)=>{
      dispatch(routerRedux.push({
        pathname: `/resourceManagement/newHousePro/projectDetails`,
        state:{
          projectId:record.key
        }
      }));
    }
  const offLine=(record)=>{
    dispatch({
      type:"newHouseProIndex/saveCurrentRecord",
      payload:{currentRecord:record}
    })
    dispatch({
      type:"newHouseProIndex/togglePrompt",
      payload:{
        visible:true,
        title:"是否要下架?",
        description:"",
        todo:"offLine",
        cancelText:"取消",
      }
    })
  }
  const showOffLineModal=(record)=>{
    dispatch({
      type:"newHouseProIndex/showOffLineModal",
      payload:{
        visible:true,
        currentRecord:record
      }
    })
  }

  //下架modal需要的props
  const UnloadHouseModalProps={
    modalVisible:false,
    submitLoading:true,

    changeVisible:()=>{

    },
    changeSubmitLoading:(bool)=>{

    },
  }
  const pagination={
    total:totalElements,
    pageSize:10,
    showTotal:(totalElements)=>{return(`总${totalElements}项`)},
    defaultCurrent:1,
    showQuickJumper:true,
    onChange:(page)=>{
      dispatch({
        type:"newHouseProIndex/changeTableLoading",
        payload:{
          tableLoading:true
        }
      })
      dispatch({
        type:"newHouseProIndex/getInitData",
        payload:{
          pageSize:10,
          pageNo:page-1,
        }
      })
    }
  }
  const onSearch=(values)=>{
    values.areaPath=areaPath;
    if(values.status==="全部"){
      values.status=''
    }
    dispatch({
      type:"newHouseProIndex/getInitData",
      payload:{
        pageSize:10,
        pageNo:0,
        areaPath:!!values.areaPath?values.areaPath:'',
        status:!!values.status?values.status:'',
        keyword:!!values.keyword?values.keyword:'',
        tradingCenterCode:!!values.tradingCenterCode?values.tradingCenterCode:'',
      }
    })
    dispatch({
      type:"newHouseProIndex/saveAreaPath",
      payload:{
        areaPath:null
      }
    })
  }
  const saveAreaPath=(areaPath)=>{
    dispatch({
      type:"newHouseProIndex/saveAreaPath",
      payload:{
        areaPath:'/'+areaPath.join('/')
      }
    })
  }
  const handleCallBackOk=()=>{
    if(promptObj.todo==='offLine'){
      dispatch({type:"newHouseProIndex/offLine",payload:{projectId:currentRecord.key}})
    }
    if(promptObj.todo==="closeModal"){
      dispatch({type:"newHouseProIndex/togglePrompt",payload:{visible:false}})
    }
    if(promptObj.todo==='closeModalAndFetch'){
      dispatch({type:"newHouseProIndex/togglePrompt",payload:{visible:false}})
      // dispatch({type:"newHouseProIndex/showOffLineModal",payload:{visible:false}})
      dispatch({type:"newHouseProIndex/getInitData",payload:{pageSize:10,pageNo:0,status:'',areaPath:'/'}})
    }
  }
  const handleCallBackCancel=()=>{
    if(promptObj.todo==="offLine"){
      dispatch({type:"newHouseProIndex/togglePrompt",payload:{visible:false}})
    }
  }
  return (
    <div className='NewHousePro_container'>
      <PromptModal onOk={handleCallBackOk} onCancel={handleCallBackCancel} {...promptObj}/>
      <OffLineModal/>
      {areaAndCode.length!==0&&tableLoading?null:<SearchBox
              onSearch={onSearch}
              showDealCenter={true}
              label="项目状态"
              type="status"
              areaAndCode={!!areaAndCode?areaAndCode:[]}
              dealCenterData={!!dealCenterData?dealCenterData:[]}
              saveAreaPath={saveAreaPath}
              optionsProState={optionsProState}
              />}
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={pagination}
        loading={tableLoading}
      />
      <UnloadHouseModal {...UnloadHouseModalProps}/>
    </div>
  );
}


function mapStateToProps({ newHouseProIndex }) {
  return { newHouseProIndex }
}

export default connect(mapStateToProps)(NewHousePro);
