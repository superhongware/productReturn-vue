// import Firebase from 'firebase'
import { EventEmitter } from 'events'
import { Promise } from 'es6-promise'
import {hwGetJsonp} from './tools/HW_SuperApi'
import {UrlParam} from './tools/GetUrlParam'

const devapiurl='http://swapi.sandbox.hongware.com'
const apiurl=devapiurl+'/openApi/dyncHongware/mobile/'
// const api = new Firebase('https://hacker-news.firebaseio.com/v0')
const itemsCache = Object.create(null)
const store = new EventEmitter()
const storiesPerPage = store.storiesPerPage = 30

// console.log(UrlParam)
const urlParam=UrlParam();
const configjson = {
  orgCode:urlParam.action.orgCode,
  store: 'h5',
  op: 'h5'
};


let topStoryIds = []

export default store


//传地址取经纬度
function getAddressLngLat(address) {
    return new Promise(function(resolve, reject) {
        var myGeo = new BMap.Geocoder();
        myGeo.getPoint(address, function(point) {
            resolve(point);
        });
    });
}


//根据开始地点计算全部距离
function setrange(start, callback) {
    var endpoints = storedata.map(s => s.point);
    var rangeP = endpoints.map(end => getDrivingRoute(start, end));
    var num = 0;
    rangeP.map((p, i) => {
        p.then(data => {
          var range="未查到距离";
          if(data){
            storedata[i].range = data.tr[0].cg;
            range = (storedata[i].range / 1000).toFixed(2) + 'km';
          }
            $('.mainrange:eq(' + i + ')').html(range);
        });
    });
}


const orderInfoCache={}

store.fetchUrlParma=()=>{
  return Promise.resolve(urlParam);
}

//取门店信息
store.fetchStors3=()=>{
  return new Promise(function(resolve, reject) {
    let data={
      method: 'V5.mobile.allocate.warehouse.search',
    }
    let storesP=hwGetJsonp(apiurl+'warehouseSearch',Object.assign(data, configjson))
    .then(data=>{
      resolve([
        {range1:0,storeName:'asdasdda'},
        {range1:0,storeName:'asfa'},
        {range1:0,storeName:'fhgfh'},
        {range1:0,storeName:'asda'},
        {range1:0,storeName:'asghturtydasdda'},
        {range1:0,storeName:'werwr'},
      ])
    })
  })
}

//取门店信息
store.fetchStors2=()=>{
  return new Promise(function(resolve, reject) {
    let data={
      method: 'V5.mobile.allocate.warehouse.search',
    }
    let storesP=hwGetJsonp(apiurl+'warehouseSearch',Object.assign(data, configjson))
    .then(data=>{
      resolve(data.stores)
    })
  })
}

//取门店信息
store.fetchStors=()=>{
  return new Promise(function(resolve, reject) {
    let data={
      method: 'V5.mobile.allocate.warehouse.search',
    }
    let storesP=hwGetJsonp(apiurl+'warehouseSearch',Object.assign(data, configjson))
    .then(data=>{
      console.log(data)
      let storesData=data.stores
      let addresses=storesData.map(store=>store.address)
      let addressLngLatP = addresses.map(address => getAddressLngLat(address))
      //设置地址经纬度
      addressLngLatP.map((p, i) => {
        p.then(point => {
          storesData[i].point = point;
          storesData[i].range = 0;
        });
      });
      Promise.all(addressLngLatP)
      .then(()=>{
        resolve(storesData)
      })
    })
  })
}
//取订单信息
store.fetchOrder=(orderNumber)=>{
  if(!orderNumber){
    orderNumber=urlParam.action.orderNumber
  }
  return new Promise(function(resolve, reject) {
    if(orderInfoCache[orderNumber]){
      resolve(orderInfoCache[orderNumber])
    }else{
      let data={
        method: 'V5.mobile.order.info.get',
        orderNumber: orderNumber,
      }
      hwGetJsonp(apiurl+'orderInfoGet',Object.assign(data, configjson))
      .then(data=>{
        resolve(data)
      })
    }
  });
}
