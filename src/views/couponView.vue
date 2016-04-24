<template>
<div>
  <tab active-color='#007aff'>
  <tab-item :selected="showstore" @click="showstore=showstore?showstore:!showstore">附近门店</tab-item>
  <tab-item :selected="!showstore" @click="showstore=showstore?!showstore:showstore">我的优惠券</tab-item>
  </tab>

  <!-- <div class="mui-slider-group top47" height> -->

  <div class="storePage"  v-show='showstore'>
    <div class="pannelTitle">我的位置</div>
    <div class="flexBox addressinfo">

      <span>
        <p class="orderlocationbar" @click="show2=true" v-show='addressshow'>
          <span class="iconfont maincolor icon-dizhi orangecolor"></span>当前位置
          <span class="iconfont rightjiantou icon-fanhui4"></span>
        </p>
        <p class="orderlocationbar" @click="show2=true"  v-show='!addressshow'>
          <span class="iconfont maincolor icon-kuaididaishou"></span> 订单收货地址
          <span class="iconfont rightjiantou icon-fanhui4"></span>
        </p>
      </span>
      <div class="startaddress" v-show='addressshow'>
        {{orderaddress}}
      </div>
      <div class="startaddress" v-show='!addressshow'>
        {{orderaddress}}
      </div>
      <!-- <span class="mui-icon mui-icon-reload loc-load amt"></span> -->
    </div>
    <div class="pannelTitle">附近门店</div>

    <!-- <Scroller lock-x  v-show='stores' > -->
      <ul class="storeBox">
          <li class="store"  v-for="store in stores" order-by='store.range'>
              <div class="flexBox">
                  <div class="storeName">{{store.storeName}}</div>
                  <span class="rangetext orangecolor">
                      <span class="mui-icon iconfont icon-dizhi orangecolor"></span>
                      <!-- {{(ranges[$index]/1000).toFixed(2)}} -->
                      <span class="mainrange" v-if="ranges[$index]>0">{{(ranges[$index]/1000).toFixed(2)}}km</span>
                      <span class="mainrange" v-if="!(ranges[$index]>0)">未查到距离</span>
                  </span>
              </div>
              <p class="storeadress">{{store.address}}</p>
          </li>
      </ul>
  </div>
    <!-- </Scroller> -->

    <Scroller lock-x height='scrollerHeight' :style='{height:scrollerHeight}' v-show='!showstore||urlParam.action.type!=2' >
      <!-- <stores-box v-show='showstore' :stores='stores'></stores-box> -->
      <qrcode-box
      title="优惠券编号"
      :title-code="urlParam.action.orderNumber"
      :qrcode="urlParam.action.code"
      tips="此二维码用于门店快速验证您的优惠券"></qrcode-box>
    </Scroller>
  <!-- </div> -->
   <actionsheet :show.sync="show2" :menus="menus2" @menu-click="menuclick" cancel-text="取消" show-cancel></actionsheet>
</div>
</template>

<script>
import store from '../store'
// import storesBox from '../components/storesBox.vue'
import qrcodeBox from '../components/couponBox.vue'
import Scroller from 'vux/components/scroller'
import Tab from 'vux/components/tab'
import Actionsheet from 'vux/components/actionsheet'
import TabItem from 'vux/components/tab-item'
import {UrlParam} from '../tools/GetUrlParam'
let urlParam=UrlParam()


//浏览器获取当前经纬度
function getNowLngLat(){
    return new Promise(function(resolve, reject) {
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r) {
          // console.log(r)
            if (this.getStatus() === 0) {
                resolve(r);
            } else {
                reject(this.getStatus());
            }
        }, {
            enableHighAccuracy: true
        });
    });
}
//行车距离
function getDrivingRoute(p1, p2) {
    return new Promise(function(resolve, reject) {
        if(!p2){
          resolve(null);
          return;
        }
        var map = new BMap.Map();
        var start = new BMap.Point(p1.length ? p1[0] : p1.lng, p1.length ? p1[1] : p1.lat);
        var end = new BMap.Point(p2.length ? p2[0] : p2.lng, p2.length ? p2[1] : p2.lat);
        var driving = new BMap.DrivingRoute(map, {
            onSearchComplete: onSearchComplete
        });

        function onSearchComplete(data) {
            resolve(data);
        }
        driving.search(start, end);
    });
}
//传地址取经纬度
function getAddressLngLat(address) {
    return new Promise(function(resolve, reject) {
        var myGeo = new BMap.Geocoder();
        myGeo.getPoint(address, function(point) {
            resolve(point);
        });
    });
}



// import Comment from './Comment.vue'
//
export default {
  components: {
    TabItem,
    Tab,
    Scroller,
    // storesBox,
    qrcodeBox,
    Actionsheet,
  },

  data () {
    // console.log(this.$log())
    return {
      stores: [],
      orderaddress:'',
      urlParam:{},
      ranges:[],
      showstore:urlParam.action.type==2?true:false,
      scrollerHeight:window.innerHeight-44+'px',
      addressshow:false,
      show2: false,
      nowaddress:'',
      orderLngLat:{},
      menus2: {
        menu1: '<p><span class=" iconfont icon-dizhi fontOrange"></span>当前位置</p>',
        menu2: '<p><span class=" iconfont icon-kuaididaishou"></span> 订单收货地址</p>',
      }
    }
  },

  route: {
    data ({ to }) {
      var sref=this
      // console.log(this);

      return Promise.all([
        store.fetchStors(),
        store.fetchOrder(urlParam.action.orderNumber),
        store.fetchUrlParma(),
      ]).then((data)=>{
        document.title = '优惠信息'
        // sref.$log()
        // sref.$broadcast( 'dataload',data)
        sref.$emit('dataload',data)
        return {
          stores:data[0],
          orderaddress:data[1].order.logisticInfo.address,
          urlParam:data[2]
        }
      })
    }
  },

  created:function(){
    this.$on('dataload',(data)=>{
        let sref=this
        let orderLngLat,rangeP=[]
        let orderLngLatP=getAddressLngLat(data[1].order.logisticInfo.address)
        .then((point)=>{
          sref.orderLngLat=point
          // console.log(point)
          data[0].map(store=>{
            rangeP.push(getDrivingRoute(sref.orderLngLat,store.point))
          })
          sref.$log()
          Promise.all(rangeP).then(ranges=>{
            console.log(ranges)
            ranges.map((range,i)=>{
              data[0][i].range=range.tr[0].cg
              // sref.stores[i].range=range.tr[0].cg
              // console.log(sref.$data.stores[i])
            })
            data[0].sort(function(a,b){
              return a.range-b.range
            })
            sref.$set('stores',data[0])
            sref.$set('ranges',data[0].map(d=>d.range))
            // sref.$set('stores',data[0])
            // console.log(sref)
          })
        })
    })

  },
  methods:{
    menuclick(a){
      let self=this

      if(a==='menu1'){
        self.addressshow=true
        getNowLngLat()
        .then(r=>{
          console.log(r)
          self.setRange(r.point)
        })
      }else if(a==='menu2'){
        self.addressshow=false
        self.setRange(self.orderLngLat)
      }
    },
    setRange(start){
      console.log(start)
      let self=this
      let rangeP=[]
      self.stores.map(store=>{
        rangeP.push(getDrivingRoute(start,store.point))
      })
      Promise.all(rangeP).then(ranges=>{
        console.log(ranges)
        ranges.map((range,i)=>{
          self.stores[i].range=range.tr[0].cg
          // sref.stores[i].range=range.tr[0].cg
          // console.log(sref.$data.stores[i])
        })
        self.stores.sort(function(a,b){
          return a.range-b.range
        })
        self.$set('ranges',self.stores.map(d=>d.range))
      })

    }
  },

  computed: {
    // isJob () {
    //   return this.item.type === 'job'
    // },
    //
    // hasText () {
    //   return this.item.hasOwnProperty('text')
    // }
  }
}
</script>

<style lang="sass">


</style>
