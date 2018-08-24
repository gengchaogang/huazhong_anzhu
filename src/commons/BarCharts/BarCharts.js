import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { Link } from 'dva/router'
import echarts from 'echarts'
import  './BarCharts.css'
// echarts.dispose(this.echartsElement);

class Barcharts extends React.Component{

  constructor(props){
    super(props);
    this.myChart=null;
  }
  initCanvas=()=>{
    let canvasNode = this.refs[this.props.onlyRefs];
    const type=this.props.type;
    const chartsColor=this.props.chartsColor;
    this.myChart = echarts.init(canvasNode);

    var option = {
            tooltip: {
              trigger: 'axis',
              axisPointer : {
                type : 'shadow'
              }
            },
            xAxis: (type==('bar'||'line')?({data:this.props.xData}):''),
            legend: {
              data:this.props.mainTitleLegend
            },
            grid:{
              x:80,
              y:60
            },
            yAxis:(type==('bar'||'line')?{type : 'value'}:''),
            series:this.props.yData
      };
    const colorArr=[];
    colorArr.push(chartsColor);
    chartsColor===undefined?'':option.color=colorArr;
    this.myChart.showLoading();
    this.myChart.setOption(option);
  }
  componentDidMount(){
    this.initCanvas();
  }
  componentWillReceiveProps(nextProps){
    // console.log(nextProps,'nextProps')
    // if(nextProps.isDrow==true){
      const drawObj={
        xAxisData:nextProps.xData,
        boundaryGap:nextProps.boundaryGap,
        seriesData:nextProps.yData,
        type:nextProps.type,
        mainTitleLegend:nextProps.mainTitleLegend,
       }
      this.changeDrowChart(drawObj);
    // }
  }
  changeDrowChart=(drawObj)=>{
    // console.log(drawObj,'drawObj');
    let axisLabel={
      rotate:0,
      interval:0,
    }
    if(!!this.props.xRotate){
      axisLabel.rotate=this.props.xRotate;
    }
    this.myChart.setOption({
      xAxis: {
        data:drawObj.xAxisData,
        boundaryGap:drawObj.boundaryGap,
        axisLabel,
      },
      legend: {
        data:drawObj.mainTitleLegend
      },
      series:drawObj.seriesData
    });
    this.myChart.hideLoading();
  }
  componentWillUnmount(){
    echarts.init(this.refs[this.props.onlyRefs]);
    // console.log('xiaohui')
  }
  render(){
    const {onlyRefs}=this.props
    return(
      <div>
        {!!this.props.height?
          <div className='mainZ'
            style={{width:this.props.widths,height:this.props.height}}
            ref={onlyRefs}>
          </div>:
          <div className='mainZ'
            style={{width:this.props.widths}}
            ref={onlyRefs}>
          </div>
        }
      </div>
    )
  }
}
Barcharts.propTypes = {
  onlyRefs:PropTypes.string.isRequired,
  type:PropTypes.string.isRequired,
  widths:PropTypes.string.isRequired,
}

export default Barcharts;
