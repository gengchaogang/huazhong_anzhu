import React from 'react';
import {connect} from 'dva';
import TitleBar from '../../../../commons/UI/TitleBar';
import "./ImgManagement.css"
import CreateHouseType from './../createPro/CreateHouseType'
import {Button,Row,Col,Table,Icon,Form,Radio,Switch,Tag} from 'antd';
import img1 from '../../../assets/images/img1.jpg';
import img2 from '../../../assets/images/img2.jpg';
import img3 from '../../../assets/images/img3.jpg';
const CheckableTag = Tag.CheckableTag;

function ImgManagement({dispatch,ImgManagement,next,prev}){
  const {createhousetype}=ImgManagement
  const columns = [{
  title: '全选',
  dataIndex: 'img',
  render: text => <div><a href="#"><img src={text}/></a></div>,
}, {
  title: '',
  dataIndex: 'info',
  render: text => <div>
                                <div>{text.type}</div>
                                <div>{text.tip}</div>
                                <div>居室:{text.housewear}</div>
                                <div>建筑面积:{text.buildArea}</div>
                                <div>套内面积:{text.houseArea}</div>
                                <div>参考均价:{text.referencePrice}</div>
                                <div>参考总价:{text.priceTotal}</div>
                              </div>
}, {
  title: '',
  dataIndex: 'date',
}];
const data = [{
  key: '1',
  img: img1,
  info: {
    type:"A户型",
    tip:"南北通透 主卧带卫",
    housewear:"4室2厅1厨2卫",
    buildArea:"100~150㎡",
    houseArea:"94㎡",
    referencePrice:'10000元/㎡',
    priceTotal:'100万~150万'
  },
  date: '2016-10-24  19:00',
}, {
  key: '2',
  img: img2,
  info: {
    type:"A户型",
    tip:"南北通透 主卧带卫",
    housewear:"4室2厅1厨2卫",
    buildArea:"100~150㎡",
    houseArea:"94㎡",
    referencePrice:'10000元/㎡',
    priceTotal:'100万~150万'
  },
  date: '2016-10-24  19:00',
}, {
  key: '3',
  img: img3,
  info: {
    type:"A户型",
    tip:"南北通透 主卧带卫",
    housewear:"4室2厅1厨2卫",
    buildArea:"100~150㎡",
    houseArea:"94㎡",
    referencePrice:'10000元/㎡',
    priceTotal:'100万~150万'
  },
  date: '2016-10-24  19:00',
}];
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  onSelect: (record, selected, selectedRows) => {
    // console.log(record);
    console.log(record)
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    // console.log(selected, selectedRows, changeRows);
  },
};
const pagination={
  pageSize:1,
  total:3,
  showQuickJumper:true
}
const Delete=()=>{

}
const CreateType=()=>{
        // {toggole?<Table/>:<Add>}
        console.log(ImgManagement.createhousetype)
        dispatch({
          type:"ImgManagement/CreateType",
        })
}
  return(
    <div>
      <TitleBar title="项目室内图户型图"/>
      <Button type="primary" onClick={CreateType}>创建户型</Button>
      {ImgManagement.createhousetype
        ?<div className="showImg"><Button type="primary" className="delete" onClick={Delete}>删除</Button><Table rowSelection={rowSelection} columns={columns} dataSource={data} pagination={pagination} /><Button type="primary" onClick={prev}>返回上一步</Button><Button type="primary" onClick={next}>下一步创建项目项控表</Button></div>
      :<CreateHouseType/>
      }

    </div>
  )
}
function mapStateToProps({ ImgManagement }) {
  return { ImgManagement }
}
export default connect(mapStateToProps)(ImgManagement);
