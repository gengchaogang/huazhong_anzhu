function objToKeyValue(obj){
  var str=""
  for(let key in obj){
    str+=key+"="+obj[key]+"&";
  }
  str=str.slice(0,-1);
  return str;
}
var id="";

var key="2faf89d5ef8d38f6e0e08528acaa32cc";

var params={
  key:key,
  subdistrict:3,
  showbiz:false,
  extensions:"base",
};

id&&(params.id=id);

function callback(data){
  console.log(data);
}

var parammeters=objToKeyValue(params);

var uri=`http://restapi.amap.com/v3/config/district?${parammeters}`;

var output=new Promise((resolve,reject)=>{
  fetch(uri).then(res=>{
    if(!res.ok){
      return ;
    }
    return res.json();
  }).then(data=>{
    if(data.status==="1"){
      let cities=data.districts[0].districts;
      var out=getArr(cities);
      resolve(out);
    }
    else{
      reject('');
    }
  }).catch(error=>{
    reject('');
  })
});

function getArr(obj){
  var arr=[];
  for(let i=0;i<obj.length;i++){
    arr[i]={
      value:obj[i].adcode,
      label:obj[i].name,
    }
    if(obj[i].districts.length>0){
      arr[i].children=getArr(obj[i].districts);
    }
  }
  return arr;
}

export default output;
