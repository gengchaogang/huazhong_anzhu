import React,{ PropTypes } from 'react';
import defaultImg from '../../../mentorRole/assets/images/morentouinfg.png'
const AMap= window.AMap;
class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      id:'DxMap',
      map:null,
      markers:[],
      count:1,
      address:null,
      treeMarkers:[],
      treeInitMarker:null,
    }
    this.componentDidMount = this.componentDidMount.bind(this);
    this.initMarkers = this.initMarkers.bind(this);
    this.initMap = this.initMap.bind(this);
    this.geocoder = this.geocoder.bind(this);
    this.regeocoder = this.regeocoder.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    const {map,markers,count,treeInitMarker}=this.state;
    const {markerClick,getMap,isDefaultImg}=this.props
    const initMarkers=nextProps.initMarkers;
    if(!!nextProps.address){
      const address=nextProps.address
      this.geocoder(map,address,initMarkers)
    }
    if(nextProps.initMarkers.length!=0){
      this.setState({count:count+1})
    }
    this.initMarkers(map,initMarkers,markers,isDefaultImg)
    if(!!nextProps.treeMarkers&&nextProps.treeMarkers.length!==0){
      this.setState({count:count+1})
      const treeMarkers=nextProps.treeMarkers
      this.regeocoder(map,treeMarkers,treeInitMarker,markerClick,getMap)
    }
  }
  componentDidMount(){
    this.initMap(this.state.id,this.props,this.state)
  }
  componentWillUnmount(){}
  initMap(id,props,state){
    const {markers,treeInitMarker}=state
    const {center,zoom,initMarkers,mapClick,isClick,address,treeMarkers,markerClick,getMap,isDefaultImg}=props;
    if(!!AMap){
      const map=new AMap.Map(id,{zoom,center,resizeEnable:true})
      const toolbar=new AMap.ToolBar({visible:true})
      map.addControl(toolbar);
      if(!!address){
        this.geocoder(map,address,initMarkers)
      }
      if(!!initMarkers){
        this.initMarkers(map,initMarkers,markers,isDefaultImg)
      }
      if(!!treeMarkers&&treeMarkers.length!==0){
        this.regeocoder(map,treeMarkers,treeInitMarker)
      }
      if(!!isClick){
        map.on('click', function(e) {
          markers.map(item=>{
            item.setMap(null);
          })
          const marker=new AMap.Marker({
            map:map,
            icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
            position:[e.lnglat.getLng(),e.lnglat.getLat()]
          })
          map.panTo([e.lnglat.getLng(),e.lnglat.getLat()]);
          mapClick(marker)
          markers.push(marker)
          markers.splice(0,markers.length-1)
        });
      }
      this.setState({map:map})
      return map
    }else{
      alert("地图加载失败请重新刷新页面")
    }
  }
  geocoder(map,address,initMarkers){
    const me=this
    if(address===this.state.address){
      return
    }else{
      const geocoder=new AMap.Geocoder({})
      geocoder.getLocation(address, function(status, result) {
          if (status === 'complete' && result.info === 'OK') {
            // map.panTo(result.geocodes[0].location);  2017-04-05 修改定位縮放級別!
            map.setZoomAndCenter(18,result.geocodes[0].location);
            me.setState({address:address})
          }
      });
    }
  }
  regeocoder(map,treeMarkers,treeInitMarker,markerClick,getMap){
    const infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
    if(!!treeInitMarker){
      treeInitMarker.setMap(null);
      infoWindow.close(map)
    }
    const me=this
    const geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: "all"
    });
    let marker;
    if(this.state.count===1){
      getMap(map)
      if(!!treeMarkers&&treeMarkers.length!=0&&!!treeMarkers[0].position[0]&&!!treeMarkers[0].position[1]){
        // map.panTo([treeMarkers[0].position[0],treeMarkers[0].position[1]]);
        map.setZoomAndCenter(18,[treeMarkers[0].position[0],treeMarkers[0].position[1]]);
      }
      treeMarkers.map((item,index)=>{
       marker=new AMap.Marker({
          map:map,
          icon:!!item.logo?new AMap.Icon({
            size: new AMap.Size(40, 50),  //图标大小
            image: item.logo,
            imageSize:new AMap.Size(40, 50),
          }):defaultImg,
          position:item.position,
          name:item.name,
          id:item.id,
          logo:item.logo,
          phoneNumber:item.phoneNumber,
          teamName:item.teamName,
          latitude:item.latitude,
          longitude:item.longitude,
        })
        marker.on('click',function(e){
          markerClick(e,map)
          map.panTo([e.target.G.position.lng,e.target.G.position.lat]);
        })
      })
    }else{
      return
    }

  }

  initMarkers(map,initMarkers,markers,isDefaultImg){
    if(this.state.count===1){
      if(!!initMarkers&&initMarkers.length!=0&&!!initMarkers[0].position[0]&&!!initMarkers[0].position[1]){
        // map.setZoomAndCenter(14,[initMarkers[0].position[0],initMarkers[0].position[1]]);
        map.setZoomAndCenter(18,[initMarkers[0].position[0],initMarkers[0].position[1]]);
      }
      const infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
      initMarkers.map((item,index)=>{
        if(isDefaultImg){
          if(!!item.position[0]&&!!item.position[1]){
            const marker=new AMap.Marker({
              map:map,
              icon:!!item.logo?new AMap.Icon({
                size: new AMap.Size(40, 50),  //图标大小
                image: item.logo,
                imageSize:new AMap.Size(40, 50),
              }):defaultImg,
              position:item.position
            })
            markers.push(marker)
            this.setState({markers:markers})
            marker.content=item.content
            marker.on('click', function(e) {
              infoWindow.setContent(e.target.content);
              infoWindow.open(map, e.target.getPosition());
              map.panTo([e.lnglat.lng,e.lnglat.lat]);
            });
          }
        }else{
          if(!!item.position[0]&&!!item.position[1]){
            const marker=new AMap.Marker({
              map:map,
              icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b'+(index+1)+'.png',
              position:item.position
            })
            markers.push(marker)
            this.setState({markers:markers})
            marker.content=item.content
            marker.on('click', function(e) {
              infoWindow.setContent(e.target.content);
              infoWindow.open(map, e.target.getPosition());
              map.panTo([e.lnglat.lng,e.lnglat.lat]);
            });
          }
        }
      })
    }else{
        return
    }
  }
  render() {
    const {id}=this.state;
    const style={style:{
      width:this.props.width,
      height:this.props.height,
    }}
    return (
        <div id={id} {...style}></div>
    )
  }
}
Map.defaultProps={
  zoom:10,
  center: [116.397, 39.908],
  isDefaultImg:false,
}
Map.propTypes = {
  width: PropTypes.number.isRequired, //地图宽度
  height: PropTypes.number.isRequired,//地图高度
  mapClick: PropTypes.func.isRequired,  //地图点击保存点坐标
  markerClick: PropTypes.func,  //地图点的点击事件
  getMap: PropTypes.func,  //获取地图对象
  initMarkers: PropTypes.array.isRequired, //初始点坐标
  address:PropTypes.string, //正向地理编码
  treeMarkers:PropTypes.array, //逆地址编码 //树形结构关联地图专用
}
export default Map;
