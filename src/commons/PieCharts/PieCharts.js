import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import echarts from 'echarts'
import  './PieCharts.css'

class PieCharts extends React.Component{

  constructor(props){
    super(props);
    this.myChart=null;
  }
  initCanvas=()=>{
    let canvasNode = this.refs[this.props.onlyRefs];
    const type=this.props.type;
    this.myChart = echarts.init(canvasNode);
    var option = {
      // itemStyle: {
      //           normal: {
      //               color: '#F57B28',
      //               shadowBlur: 200,
      //               shadowColor: 'rgba(0, 0, 0, 0.5)'
      //           }
      // },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {},
      series : [],
    };
    // this.myChart.showLoading();
    this.myChart.setOption(option);
  }
  componentDidMount(){
    this.initCanvas();
  }
  componentWillReceiveProps(nextProps){
    // console.log(nextProps,'nextProps')
    // if(nextProps.isDrow==true){
      const drawObj={
        series:nextProps.series,
        type:nextProps.type,
        color:nextProps.color,
        mainTitleLegend:nextProps.mainTitleLegend,
      }
      this.changeDrowChart(drawObj);
    // }
  }
  changeDrowChart=(drawObj)=>{
    // console.log(drawObj,'drawObj');
    this.myChart.setOption({
      legend: {
        ...drawObj.mainTitleLegend
      },
      series:drawObj.series,
      color:drawObj.color,
    });
  }
  componentWillUnmount(){
    echarts.init(this.refs[this.props.onlyRefs]);
    // console.log('xiaohui')
  }
  render(){
    const {onlyRefs}=this.props
    // console.log(this.props,'this.props');
    return(
      <div>
        {!!this.props.height?
          <div className='mainZ'
            style={{width:this.props.widths,height:this.props.height}}
            ref={onlyRefs}>
          </div>:
          <div className='mainZ' style={{width:this.props.widths}}
            ref={onlyRefs}>
          </div>
        }
      </div>

    )
  }
}
PieCharts.propTypes = {
  onlyRefs:PropTypes.string.isRequired,
  widths:PropTypes.string.isRequired,
}

export default PieCharts;
