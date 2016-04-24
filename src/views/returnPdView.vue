<template>
<div>
  <div v-if="urlParam.action">

  <tab active-color='#007aff'>
    <tab-item v-if='urlParam.action.type!=2'>我的订单</tab-item>
    <tab-item v-if='urlParam.action.type==2' :selected="showstore" @click="showstore=showstore?showstore:!showstore">附近门店</tab-item>
    <tab-item v-if='urlParam.action.type==2' :selected="!showstore" @click="showstore=showstore?!showstore:showstore">我的订单</tab-item>
  </tab>

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
      title="订单编号"
      :title-code="urlParam.action.orderNumber"
      :qrcode="urlParam.action.orderNumber+(urlParam.action.type==5?','+urlParam.action.code:'')"
      tips="此二维码用于门店快速找到您的订单"></qrcode-box>
    </Scroller>
  <!-- </div> -->
   <actionsheet :show.sync="show2" :menus="menus2" @menu-click="menuclick" cancel-text="取消" show-cancel></actionsheet>
  </div>
</div>
</template>

<script>
// import storesBox from '../components/storesBox.vue'
import store from '../store'
import Scroller from 'vux/components/scroller'
import Tab from 'vux/components/tab'
import TabItem from 'vux/components/tab-item'
import Actionsheet from 'vux/components/actionsheet'
import qrcodeBox from '../components/qrcodeBox.vue'
import {UrlParam} from '../tools/GetUrlParam'
import {getNowLngLat,getDrivingRoute,getAddressLngLat} from '../tools/HW_BmapApi'
let urlParam=UrlParam()

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
        menu1: '<p class="actionsheetbtn"><span class=" iconfont icon-dizhi orangecolor"></span>当前位置</p>',
        menu2: '<p class="actionsheetbtn"><span class=" iconfont icon-kuaididaishou maincolor"></span> 订单收货地址</p>',
      }
    }
  },

  route: {
    data ({ to }) {
      let sref=this
      let title=''
      switch (urlParam.action.type) {
        case '1':
        title='自提信息'
        break;
        case '2':
        title='退换货信息'
        break;
        case '5':
        title='提货信息'
        break;
        case '6':
        title='自提信息'
        break;
        case '9':
        title='优惠信息'
        break;
        default:
        title='商铺旺'
      }
      document.title = title

      return Promise.all([
        store.fetchStors(),
        store.fetchOrder(urlParam.action.orderNumber),
        store.fetchUrlParma(),
      ]).then((data)=>{
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

}
</script>

<style lang="sass">
@import '../variables.scss';
body{
  background-color:#efeff4;
}
*{
  box-sizing: border-box;
}
.storePage{
  .pannelTitle{
    width:100%;
    padding:8px 10px;
    font-size:14px;
    color:#666;
  }
  .flexBox{
    width:100%;
    display:flex;
  }
  .addressinfo{
    background-color:#fff;
    height:44px;
    line-height:44px;
    padding:0px 5px;
    .startaddress{
      font-size:12px;
      color:#666;
      overflow: hidden;
      text-overflow: ellipsis;
      flex:1;
      white-space: nowrap;
      display: block;
    }
    .orderlocationbar{
      font-size:12px;
      color:#666;
      .rightjiantou{
        color:#666;
        font-size:8px;
        display:inline-block;
        // position:absolute;
        // right:0px;
      }
    }
  }

  .storeBox{
    width:100%;
    .store{
      list-style:none;
      background-color:#fff;
      border-bottom:1px solid #ddd;
      width:100%;
      height:70px;
      padding:10px;
    }
    .rangetext{
      text-align:right;
      flex: 1;
      font-size:14px;
      line-height:25px;
      .iconfont{
        position:relative;
        top:-2px;
        right:-4px;
        font-size:16px;
      }
    }
    .storeadress{
      font-size:12px;
      color:#666;
      line-height:25px;
    }
  }

}
.actionsheetbtn{
  font-size:14px;
}

.maincolor{
  color:$mainColor;
}
.orangecolor{
  color:$orangeColor;
}
// @import '~vux/vux.css';
// .mui-scroll-wrapper{
//   height:600px;
//   .mui-scroll{
//     height:600px;
//   }
// }
// .mui-control-content{
//   display:block;
// }

</style>
