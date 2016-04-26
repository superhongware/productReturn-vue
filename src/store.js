// import Firebase from 'firebase'
import { EventEmitter } from 'events'
import { Promise } from 'es6-promise'
import {hwGetJsonp} from './tools/HW_SuperApi'
import {UrlParam} from './tools/GetUrlParam'

// const devapiurl='http://swapi.sandbox.hongware.com'
// const api = new Firebase('https://hacker-news.firebaseio.com/v0')
const devapiurl='http://swapi.sandbox.hongware.com'
const apiurl=devapiurl+'/openApi/dyncHongware/mobile/'
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

//订单数据
let orderDate=[]
//门店数据
let storeDate=[]
let topStoryIds = []

export default store

const orderInfoCache={}

store.fetchUrlParma=()=>{
  return Promise.resolve(urlParam);
}

//取门店信息
store.fetchStors=()=>{
  if(storeDate.length>0){
    return Promise.resolve(storeDate)
  }else{
    return new Promise(function(resolve, reject) {
      let data={
        method: 'V5.mobile.allocate.warehouse.search',
      }
      let storesP=hwGetJsonp(apiurl+'warehouseSearch',Object.assign(data, configjson))
      .then(data=>{
        storeDate=data.stores;
        resolve(data.stores)
      })
    })
  }
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
