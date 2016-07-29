// import Firebase from 'firebase'
import { EventEmitter } from 'events'
import { Promise } from 'es6-promise'
import { hwGetJsonp, hwPost } from './tools/HW_SuperApi'
import { UrlParam } from './tools/GetUrlParam'
import config from './config'

// const api = new Firebase('https://hacker-news.firebaseio.com/v0')
let apiurl = config.apiurl+'/openApi/dyncHongware/mobile/';

const itemsCache = Object.create(null)
const store = new EventEmitter()
const storiesPerPage = store.storiesPerPage = 30

// console.log('UrlParam')
const urlParam = UrlParam();
const configjson = {
	orgCode: urlParam.action.orgCode,
	store: 'h5',
	op: 'h5'
};

//订单数据
let orderDate = []
	//门店数据
let storeDate = {}
let topStoryIds = []

export default store

const orderInfoCache = {}

store.fetchUrlParma = () => {
	return Promise.resolve(urlParam);
}

/**
 * @summary 取门店信息
 * @locus Anywhere
 * @method fetchStors
 * @param {Object} objdata 数据对象
 * @param {String} objdata.type 查询类型，store为附近门店，order为我的订单
 * @param {String} objdata.condition 当查询类型为“store”值为省市，格式（湖南省，永州市），当查询类型为“order”值为订单编号
 */
store.fetchStors = (objdata) => {
	// console.log('****',objdata.condition);
	if (storeDate[objdata.condition]) {
		return Promise.resolve(storeDate[objdata.condition])
	} else {
		return new Promise(function(resolve, reject) {
			let data = {
				method: 'V5.mobile.hfive.warehouse',
			}
			let storesP = hwGetJsonp(apiurl + 'hfiveWarehouse', Object.assign(data, configjson, objdata))
				.then(data => {
					storeDate[objdata.condition]=data.stores;
					// storeDate = data.stores;
					resolve(data.stores)
				})
		})
	}
}
// store.fetchStors = () => {
// 	if (storeDate.length > 0) {
// 		return Promise.resolve(storeDate)
// 	} else {
// 		return new Promise(function(resolve, reject) {
// 			let data = {
// 				method: 'V5.mobile.allocate.warehouse.search',
// 			}
// 			let storesP = hwGetJsonp(apiurl + 'warehouseSearch', Object.assign(data, configjson))
// 				.then(data => {
// 					storeDate = data.stores;
// 					resolve(data.stores)
// 				})
// 		})
// 	}
// }

//取门店信息
store.fetchStors2 = () => {
	return new Promise(function(resolve, reject) {
		let data = {
			method: 'V5.mobile.allocate.warehouse.search',
		}
		let storesP = hwGetJsonp(apiurl + 'warehouseSearch', Object.assign(data, configjson))
			.then(data => {
				resolve(data.stores)
			})
	})
}

//取订单信息
store.fetchOrder = (orderNumber) => {
	if (!orderNumber) {
		orderNumber = urlParam.action.orderNumber
	}
	return new Promise(function(resolve, reject) {
		if (orderInfoCache[orderNumber]) {
			resolve(orderInfoCache[orderNumber])
		} else {
			let data = {
				method: 'V5.mobile.order.info.get',
				orderNumber: orderNumber,
			}
			hwGetJsonp(apiurl + 'orderInfoGet', Object.assign(data, configjson))
				.then(data => {
					resolve(data)
				})
		}
	});
}
store.CommentInfoGet = () => {
	return new Promise(function(resolve, reject) {
		let data = {
			method: 'V5.mobile.order.comment.info.get',
			orderNumber: urlParam.action.orderNumber,
			commentType:urlParam.action.commentType||'1',
		}
		hwGetJsonp(apiurl + 'OrderCommentInfoGet', Object.assign(data, configjson))
			.then(data => {
				resolve(data)
			})

	});
}
store.CommentAdd = (CommentData) => {
	return new Promise(function(resolve, reject) {
		let data = {
			method: 'V5.mobile.order.Comment.add',
			orderNumber: urlParam.action.orderNumber,
			commentType:urlParam.action.commentType||'1',
			commentData:CommentData
		}
		hwGetJsonp(apiurl + 'OrderCommentAdd', Object.assign(data, configjson))
			.then(data => {
				resolve(data)
			})

	});
}
const Couponjson = {
	orgCode: 'o2o',
	openID: urlParam.action.openID,
	appID: urlParam.action.appID
};

store.CouponInfoSearch = () => {
	return new Promise(function(resolve, reject) {
		let data = {
			method: 'V5.mobile.wx.coupon.info.search',
		}
		hwGetJsonp(apiurl + 'wxCouponInfoSearch', Object.assign(data, Couponjson))
			.then(data => {
				resolve(data)
			})

	});
}

store.CouponInfoGet = (couponNumber) => {
	return new Promise(function(resolve, reject) {
		let data = {
			method: 'V5.mobile.wx.coupon.info.get',
			couponNumber: couponNumber
		}
		hwGetJsonp(apiurl + 'wxCouponInfoGet', Object.assign(data, Couponjson))
			.then(data => {
				resolve(data)
			})

	});
}

store.RMCouponReceive = (tel) => {
	return new Promise(function(resolve, reject) {
		let data = {
			method: 'V5.mobile.wx.rmCoupon.receive',
			mobilePhone: tel,
			couponCode: urlParam.action.couponCode
		}
		hwGetJsonp(apiurl + 'WXRMCouponReceive', Object.assign(data, Couponjson))
			.then(data => {
				resolve(data)
			})

	});
}

store.CouponReceive = () => {

	return new Promise(function(resolve, reject) {
		let data = {
			method: 'V5.mobile.wx.coupon.receive',
			couponCode: urlParam.action.couponCode
		}
		hwGetJsonp(apiurl + 'WXCouponReceive', Object.assign(data, Couponjson))
			.then(data => {
				resolve(data)
			})

	});
}

store.CouponInitialization = () => {
	return new Promise(function(resolve, reject) {
		let data = {
			method: 'V5.mobile.wx.Coupon.initialization',
			couponID: urlParam.action.couponID
		}
		hwGetJsonp(apiurl + 'WXCouponInitialization', Object.assign(data, Couponjson))
			.then(data => {
				resolve(data)
			})

	});
}


/*
	发送验证码
*/
store.sendvcode = (mobilePhone) => {
	// if (!objdata) {objdata = {}}
	return new Promise(function(resolve, reject) {
		let data = {
			method: 'V5.mobile.wx.code.send',
			orgCode: urlParam.action.orgCode,
			openID: urlParam.action.openID,
			appID: urlParam.action.appID,
			mobilePhone: mobilePhone,
		}
		hwGetJsonp(apiurl + 'wxCodeSend', Object.assign({},data))
			.then(data => {
				resolve(data)
			})
	});
}
/*
	用户注册
*/
store.register = (mobilePhone) => {
	// if (!objdata) {objdata = {}}
	return new Promise(function(resolve, reject) {
		let data = {
			method: 'V5.mobile.wx.member.create',
			orgCode: urlParam.action.orgCode,
			openID: urlParam.action.openID,
			appID: urlParam.action.appID,
			mobilePhone: mobilePhone,
		}
		// hwGetJsonp(apiurl + 'wxMember', Object.assign({},data))
		hwPost(apiurl + 'wxMemberCreate', Object.assign({},data))
			.then(data => {
				resolve(data)
			})
	});
}
/*
	用户地址列表获取
*/
store.getMemberAddress = (mobilePhone) => {
	// if (!objdata) {objdata = {}}
	return new Promise(function(resolve, reject) {
		let data = {
			method: 'V5.mobile.member.address.search',
			orgCode: urlParam.action.orgCode,
			openID: urlParam.action.openID,
			appID: urlParam.action.appID,
		}
		// hwGetJsonp(apiurl + 'wxMember', Object.assign({},data))
		hwGetJsonp(apiurl + 'memberAddressSearch', Object.assign(data,configjson))
			.then(data => {
				resolve(data)
			})
	});
}
// store.getMemberAddress = (mobilePhone) => {
// 	// if (!objdata) {objdata = {}}
// 	return new Promise(function(resolve, reject) {
// 		let data = {
// 			method: 'V5.mobile.channelMember.get',
// 			mobilePhone: mobilePhone,
// 		}
// 		// hwGetJsonp(apiurl + 'wxMember', Object.assign({},data))
// 		hwGetJsonp(apiurl + 'channelMemberGet', Object.assign(data,configjson))
// 			.then(data => {
// 				resolve(data)
// 			})
// 	});
// }
/*
	用户地址新增
*/
store.addMemberAddress = (addressInfo) => {
	// if (!objdata) {objdata = {}}
	return new Promise(function(resolve, reject) {
		let data = {
			method: 'V5.mobile.member.address.create',
			openID: urlParam.action.openID,
			appID: urlParam.action.appID,
			addressInfo: JSON.stringify(addressInfo),
		}
		// hwGetJsonp(apiurl + 'wxMember', Object.assign({},data))
		hwPost(apiurl + 'memberAddressCreate', Object.assign(data,configjson))
			.then(data => {
				resolve(data)
			})
	});
}
// store.setMemberAddress = (memberData) => {
// 	// if (!objdata) {objdata = {}}
// 	return new Promise(function(resolve, reject) {
// 		let data = {
// 			method: 'V5.mobile.platMember.add',
// 			memberData: JSON.stringify(memberData),
// 		}
// 		// hwGetJsonp(apiurl + 'wxMember', Object.assign({},data))
// 		hwPost(apiurl + 'platMemberAdd', Object.assign(data,configjson))
// 			.then(data => {
// 				resolve(data)
// 			})
// 	});
// }
/*
	地址code获取
*/
store.getAddressCode = () => {
	// if (!objdata) {objdata = {}}
	return new Promise(function(resolve, reject) {
		let data = {
			method: 'V5.mobile.areas.get',
			orgCode: 'work',
			id: 1,
		}
		// hwGetJsonp(apiurl + 'wxMember', Object.assign({},data))
		hwPost(apiurl + 'areasGet', Object.assign({},data))
			.then(data => {
				resolve(data)
			})
	});
}
