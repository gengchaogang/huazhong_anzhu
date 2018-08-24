import React, { PropTypes } from 'react';
import './agentBrokers.css';
import { Table, Tag } from 'antd';
import {
  renderTotalMoneyStr,
} from '../../../../commons/utils/publicFunction'
function AgentBrokers({ data }) {
  const columns = [{
    title: '序号',
    dataIndex: 'number',
  }, {
    title: '经纪人',
    dataIndex: 'brokerName',
    render:(text, record) => {
      return (
        <div style={{position:'relative'}}>
          {/*<img className='avatar' src={record.logo}/>*/}
          <span>{record.agentBrokers}</span>
          {/*
            <div style={{position:'absolute',left:80,bottom:-19}}>
              {
                record.publisher?
                      <Tag color="#87d068">发布者</Tag>
                :null
              }
              {
                record.deal?
                      <Tag color="#87d068">成交</Tag>
                :null
              }
            </div>
            */}
        </div>
      )
    }
  }, {
    title: '联系方式',
    dataIndex: 'phone',
  }, {
    title: '总价',
    render:(text,record,index)=>{
      return(<span>{renderTotalMoneyStr(record.totalPrice)}</span>)
    }
  }, {
    title: '合作速销',
    render:(text,record,index)=>{
      if(record.promotionMode==='金额'){
        return(<span>{record.commissionAmount}元</span>)
      }else if(record.promotionMode==='比例'){
        return(<span>{record.tradingCommissions*record.commissionRate}元</span>)
      }
    }
  }, {
    title: '核心卖点',
    dataIndex: 'coreSellingPoint',
    width:400,
  }];
  return (
    <div className='agentBrokers'>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </div>
  );
}

AgentBrokers.propTypes = {
  data: PropTypes.array,
};

export default AgentBrokers;
