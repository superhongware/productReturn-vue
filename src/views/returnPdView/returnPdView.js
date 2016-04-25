import { Promise } from 'es6-promise'
import store from 'src/store'
import Scroller from 'vux/components/scroller'
import Tab from 'vux/components/tab'
import TabItem from 'vux/components/tab-item'
import Actionsheet from 'vux/components/actionsheet'
import qrcodeBox from 'src/components/qrcodeBox.vue'
import storesBox from 'src/components/storesBox.vue'
import Loading from 'vux/components/loading'

import {
    getNowLngLat,
    getDrivingRoute,
    getAddressLngLat
} from 'src/tools/HW_BmapApi'

export default {
    components: {
        TabItem,
        Tab,
        Loading,
        Scroller,
        storesBox,
        qrcodeBox,
        Actionsheet,
    },

    data() {
        // console.log(this.$log())
        return {
            stores: [],
            orderaddress: '',
            urlParam: {},
            ranges: [],
            loading:{
              show:true,
              text:'加载中...'
            },
            showstore: true,
            addressshow: false,
            scrollerHeight1: window.innerHeight - 164 + 'px',
            scrollerHeight: window.innerHeight - 44 + 'px',
            show2: false,
            nowaddress: '',
            orderLngLat: {},
            menus2: {
                menu1: '<p class="actionsheetbtn"><span class=" iconfont icon-dizhi orangecolor"></span>当前位置</p>',
                menu2: '<p class="actionsheetbtn"><span class=" iconfont icon-kuaididaishou maincolor"></span> 订单收货地址</p>',
            }
        }
    },

    route: {
        data({to:{query:{action}}}) {
          console.log(action)
            let self = this
            return Promise.all([
                store.fetchStors2(),
                store.fetchOrder(),
                store.fetchUrlParma(),
            ]).then((data) => {
                let [stores, orderdata, urlParam] = data
                document.title = getTitleName(urlParam)

                setTimeout(() => {
                    self.$emit('dataload', data)
                })
                return {
                    stores: stores,
                    orderaddress: orderdata.order.logisticInfo.address,
                    urlParam: urlParam,
                    loading:{
                      show:false,
                      text:'加载中...'
                    },
                    showstore: (urlParam.action.type == 2 || urlParam.action.type == 9) ? true : false
                }
            })
        }
    },
    created: function() {
        this.$on('dataload', (data) => {
            let self = this,
                orderLngLat,
                orderLngLatP,
                storesLngLatP,
                rangeP = []
                //取门店地址经纬度
            let addresses = self.stores.map(store => store.address)
                // console.log(['%%',this.stores])
            storesLngLatP = addresses.map(address => getAddressLngLat(address))
                //将经纬度设置到stores上
            storesLngLatP.map((p, i) => {
                    p.then(point => self.stores[i].point = point)
                })
                //取订单地址经纬度
            orderLngLatP = getAddressLngLat(self.orderaddress)

            //取到门店地址经纬度  订单地址经纬度后  算订单地址到门店距离
            Promise.all(storesLngLatP.concat(orderLngLatP))
                .then(data => {
                    //订单地址经纬度
                    self.orderLngLat = data.pop()
                        //门店地址经纬度
                    let storeLLs = data
                        //更新门店经纬度
                    storeLLs.map((storeLL, i) => {
                            self.$set('stores[' + i + '].point', storeLL)
                        })
                        //更新门店距离
                    self.setRange(self.orderLngLat)
                })
        })
    },
    methods: {
        menuclick(a) {
            let self = this
            if (a === 'menu1') {

                self.addressshow = true
                self.loading.show = true
                self.loading.text = '正在获取地址..'
                getNowLngLat()
                    .then(r => {
                        self.loading.show = false
                        self.loading.text = ''
                        // console.log(r.address.city+r.address.district+r.address.street+r.address.street_number)
                        self.nowaddress=r.address.city+r.address.district+r.address.street+r.address.street_number
                        self.setRange(r.point)
                    })
            } else if (a === 'menu2') {
                self.addressshow = false
                self.setRange(self.orderLngLat)
            }
        },
        setRange(start) {
            let self = this
            //取出所有门店的经纬度
            let storeLLs = self.stores.map(store => store.point)
            //计算start与每个门店的距离
            let rangePs = storeLLs.map(storeLL => getDrivingRoute(start, storeLL))
            //更新stores
            rangePs.map((rangeP, i) => {
                rangeP.then(rangedata => {
                    console.log(rangedata.tr[0].cg)
                    self.$set('stores[' + i + '].range', rangedata.tr[0].cg)
                })
            })
        }
    },
}


function getTitleName(urlParam) {
    let title = ''
    switch (urlParam.action.type) {
        case '1':
            title = '自提信息'
            break;
        case '2':
            title = '退换货信息'
            break;
        case '5':
            title = '提货信息'
            break;
        case '6':
            title = '自提信息'
            break;
        case '9':
            title = '优惠信息'
            break;
        default:
            title = '商铺旺'
    }
    return title;
}
