import Firebase from 'firebase'
import {hwGetJsonp} from './tools/HW_SuperApi'
import { EventEmitter } from 'events'
import { Promise } from 'es6-promise'
import UrlParam from './tools/GetUrlParam'

const devapiurl='http://swapi.sandbox.hongware.com'
const apiurl=devapiurl+'/openApi/dyncHongware/mobile/'
const api = new Firebase('https://hacker-news.firebaseio.com/v0')
const itemsCache = Object.create(null)
const store = new EventEmitter()
const storiesPerPage = store.storiesPerPage = 30



console.log(UrlParam)
const configjson = {
  // orgCode:UrlParam.action.orgCode,
  store: 'h5',
  op: 'h5'
};


let topStoryIds = []

export default store

/**
 * Subscribe to real time updates of the top 100 stories,
 * and cache the IDs locally.
 */

api.child('topstories').on('value', snapshot => {
  topStoryIds = snapshot.val()
  store.emit('topstories-updated')
})


//取门店信息
store.fetchStors=()=>{
  let data={
    method: 'V5.mobile.allocate.warehouse.search',
  }
  return hwGetJsonp(apiurl+'warehouseSearch',Object.assign(data, configjson))
}
//取订单信息
store.fetchOrder=orderNumber=>{
  let data={
    method: 'V5.mobile.order.info.get',
    orderNumber: orderNumber,
  }
  return hwGetJsonp(apiurl+'orderInfoGet',Object.assign(data, configjson))
}

/**
 * Fetch an item data with given id.
 *
 * @param {Number} id
 * @return {Promise}
 */

store.fetchItem = id => {
  return new Promise((resolve, reject) => {
    if (itemsCache[id]) {
      resolve(itemsCache[id])
    } else {
      api.child('item/' + id).once('value', snapshot => {
        const story = itemsCache[id] = snapshot.val()
        resolve(story)
      }, reject)
    }
  })
}

/**
 * Fetch the given list of items.
 *
 * @param {Array<Number>} ids
 * @return {Promise}
 */

store.fetchItems = ids => {
  if (!ids || !ids.length) {
    return Promise.resolve([])
  } else {
    return Promise.all(ids.map(id => store.fetchItem(id)))
  }
}

/**
 * Fetch items for the given page.
 *
 * @param {Number} page
 * @return {Promise}
 */

store.fetchItemsByPage = page => {
  const start = (page - 1) * storiesPerPage
  const end = page * storiesPerPage
  const ids = topStoryIds.slice(start, end)
  return store.fetchItems(ids)
}

/**
 * Fetch a user data with given id.
 *
 * @param {Number} id
 * @return {Promise}
 */

store.fetchUser = id => {
  return new Promise((resolve, reject) => {
    api.child('user/' + id).once('value', snapshot => {
      resolve(snapshot.val())
    }, reject)
  })
}
