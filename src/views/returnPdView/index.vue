<style lang="sass">

@import './returnPdView.scss'

</style>

<template>

<div>
    <div v-if="urlParam.action">

        <tab active-color='#007aff'>
            <!-- type不为2跟9的时候  只显示二维码 -->
            <tab-item v-if='urlParam.action.type!=2&&urlParam.action.type!=9'>我的订单</tab-item>

            <!-- type为2跟9的时候  显示附近门店 -->
            <tab-item v-if='urlParam.action.type==2||urlParam.action.type==9' :selected="showstore" @click="showstore=showstore?showstore:!showstore">附近门店</tab-item>
            <!-- type为2 二维码按钮的字显示“我的订单”，9 则显示”我的优惠券”  -->
            <tab-item v-if='urlParam.action.type==2' :selected="!showstore" @click="showstore=showstore?!showstore:showstore">我的订单</tab-item>
            <tab-item v-if='urlParam.action.type==9' :selected="!showstore" @click="showstore=showstore?!showstore:showstore">我的优惠券</tab-item>
        </tab>

        <div class="fadepage" v-show="showstore" transition="slideLeft">

            <!-- <div class="pannelTitle">我的位置</div> -->
            <div class="flexBox addressinfo">
              <span class="title">选择定位地址</span>
              <span class="leftbtn btn" @click="menuclick('menu2')">
                <span class="checkbox" :class="{'active':!showMyLocation}"><span></span></span>
                订单收货地址
              </span>
              <span class="rightbtn btn" @click="menuclick('menu1')">
                <span class="checkbox" :class="{'active':showMyLocation}"><span></span></span>
                当前位置
              </span>
                <!-- <div>
                    <p class="orderlocationbar" @click="showAction=true" v-show="showMyLocation">
                        <span class="iconfont maincolor icon-dizhi orangecolor"></span>当前位置
                        <span class="iconfont rightjiantou icon-fanhui4"></span>
                    </p>
                    <p class="orderlocationbar" @click="showAction=true" v-show='!showMyLocation'>
                        <span class="iconfont maincolor icon-kuaididaishou"></span> 订单收货地址
                        <span class="iconfont rightjiantou icon-fanhui4"></span>
                    </p>
                </div>
                <div class="startaddress" v-show='showMyLocation'>
                    {{nowaddress}}
                </div>
                <div class="startaddress" v-show='!showMyLocation'>
                    {{orderaddress}}
                </div> -->
            </div>
            <div class="pannelTitle">
              附近门店
              <span class="showmapbtn iconfont icon-mn03"  @click="changeMapList" v-show="!showmap"></span>
              <span class="showmapbtn iconfont icon-liebiao" @click="changeMapList" v-show="showmap"></span>
            </div>
            <div id="baidumap" v-show="stores&&showmap" :style="{height:scrollerHeight1}"></div>
            <scroller lock-x v-show="stores&&!showmap" :style="{height:scrollerHeight1}" v-ref:scroller>
                <stores-box :stores="stores" :openit="openit"></stores-box v-ref:storesBox>
            </scroller>
        </div>


        <div class="fadepage" v-show='!showstore' transition="slideRight">
          <Scroller lock-x height='scrollerHeight' :style='{height:scrollerHeight}' >
            <!-- type不同  提示文字不同，二维码内容不同  9是优惠券信息，其余是订单信息,   注：type为5  二维码为 订单号,code  -->
            <qrcode-box v-if="urlParam.action.type!=9" title="订单编号" :title-code="urlParam.action.orderNumber" :qrcode="json2string(urlParam.action)" tips="此二维码用于门店快速找到您的订单"></qrcode-box>
            <qrcode-box v-if="urlParam.action.type==9" title="优惠券编号" :title-code="urlParam.action.code" :qrcode="json2string(urlParam.action)" tips="此二维码用于门店快速验证您的优惠券"></qrcode-box>
          </Scroller>
        </div>

    </div>
    <!-- <actionsheet :show.sync="showAction" :menus="menus2" @menu-click="menuclick" cancel-text="取消" show-cancel></actionsheet> -->
    <loading :show="loading.show" :text="loading.text"></loading>
</div>

</template>

<script>
import { Promise } from 'es6-promise'
import store from 'src/store'
import Scroller from 'vux/components/scroller'
import Tab from 'vux/components/tab'
import TabItem from 'vux/components/tab-item'
import Actionsheet from 'vux/components/actionsheet'
import qrcodeBox from 'src/components/qrcodeBox.vue'
import Loading from 'vux/components/loading'
import storesBox from './storesBox.vue'
// import {Base64} from 'js-base64'

import {
    getNowLngLat,
    getDrivingRoute,
    getAddressLngLat
} from 'src/tools/HW_BmapApi'

// const ma = Base64.encode(JSON.stringify({orgCode: "o2o", orderNumber: "144982180517251", type: "2", code: "asdadda"}))
// console.log(location.origin+'/?action='+ma+'#!/returnProducts');
// eyJvcmdDb2RlIjoibzJvIiwib3JkZXJOdW1iZXIiOiIxNDQ5ODIxODA1MTcyNTEiLCJ0eXBlIjoiMiIsImNvZGUiOiJhc2RhZGRhIn0=

//type 1,修改自提门店短信;2,退换货提醒;3,退货成功;4,换货成功;5,发货码,6,自提码  9,优惠券

export default {
    components: {
        TabItem,
        Tab,
        Loading,
        Scroller,
        storesBox,
        qrcodeBox,
        // Actionsheet,
    },

    data() {
        // console.log(this.$log())
        return {
            stores: false,
            orderaddress: '',
            orderInfo: null,
            urlParam: {},
            ranges: [],
            storecondition:null,//当前门店是哪个城市的
            loading:{
              show:true,
              text:'加载中...'
            },
            showstore: true,
            showMyLocation: false,
            scrollerHeight1: window.innerHeight - 126 + 'px',
            scrollerHeight: window.innerHeight - 44 + 'px',
            showAction: false,
            showmap:false,
            baidumap:'',
            nowaddress: '',
            nowLngLat: {},
            orderLngLat: {},
            menus2: {
                menu1: '<p class="actionsheetbtn"><span class=" iconfont icon-dizhi orangecolor"></span>当前位置</p>',
                menu2: '<p class="actionsheetbtn"><span class=" iconfont icon-kuaididaishou maincolor"></span> 订单收货地址</p>',
            }
        }
    },

    route: {
        data({to:{query:{action}}}) {
            // console.log(JSON.parse(decodeURIComponent(Base64.decode(action))))
            let self = this
            return Promise.all([
                // store.fetchStors2(),
                store.fetchOrder(),
                store.fetchUrlParma(),
            ]).then((data) => {
                let [ orderdata, urlParam] = data
                document.title = getTitleName(urlParam)
                // console.log('returndata',orderdata.order.logisticInfo.address);
                setTimeout(()=>{
                  if(self.showMyLocation){
                    self.menuclick('menu1',true)
                  }else{
                    self.getmaininfo()
                    .then(()=>{
                      // 取订单地址经纬度
                      getAddressLngLat(self.orderaddress)
                      .then(orderLL=>{
                        // 存订单地址经纬度
                        self.orderLngLat=orderLL
                        // 计算订单地址与门店距离
                        self.setRange(self.orderLngLat)
                        // if(self.showmap=true){
                        //   self.changeMapList(orderLL)
                        // }
                      })
                    });
                  }
                })
                return {
                    // stores: stores,
                    orderaddress: orderdata.order.logisticInfo.address,
                    orderInfo: orderdata.order,
                    storecondition: orderdata.order.logisticInfo.province + ',' + orderdata.order.logisticInfo.city,
                    urlParam: urlParam,
                    loading:{
                      show:false,
                      text:'加载中...'
                    },
                    showstore: (urlParam.action.type == 2) ? true : false
                }
            })
        }
    },
    ready: function() {
      console.log('ready');
    },
    methods: {
        openit:function(_uid){
          let self=this
          let index='';
          this.stores.forEach((store,key)=>{
            if(store._uid===_uid){
              index=key;
            }
          })
          if(this.stores[index].promotions.length<=3){
            return;
          }
          this.$set('stores['+index+'].openPromotions',!this.stores[index].openPromotions)
          // this.$set('stores['+index+']._uid',Math.random())
          setTimeout(()=>{
            self.$nextTick(()=>{
              self.$refs.scroller.reset()
            })
          },500)
        },
        getmaininfo(){
          // console.log('加载门店信息');
          let self=this
          return new Promise(function(resolve, reject) {
            //取store信息
            store.fetchStors({
              type: 'store',
              // condition:  '湖南, 长沙'
              condition: self.storecondition,
            })
            .then(stores=>{
              //默认距离设置9999999  storesBox中会直接显示“未获取距离“  并且排序会排在最后面
              // console.log('$$$$',stores);
              if(!stores){
                stores=[];
              }
              stores.map(store=>{
                store.range=9999999
                store._uid=Math.random()
                return store;
              });
              //存门店信息
              self.stores=stores
              //更新scroller
              setTimeout(()=>{
                self.$nextTick(()=>{
                  self.$refs.scroller.reset()
                })
              },stores.length*150)
              // console.log('门店信息搞定');
              //取门店地址经纬度
              return Promise.all(self.stores.map(store => getAddressLngLat(store.address)))
            })
            .then(storeLLs=>{
              // 存门店经纬度
              storeLLs.map((storeLL,i)=>self.stores[i].point=storeLL)
              // console.log('@#$%^');
              // console.log('门店经纬度搞定',self.orderaddress);
              resolve()
            })
            .catch(msg=>{
              reject(msg)
            })
          })
        },
        //更新地图的点
        changeMapList(){
          let self = this
          this.showmap=!this.showmap
          if(!self.baidumap){
            setTimeout(()=>{
              self.baidumap= new BMap.Map("baidumap")
              if(self.showMyLocation){
                self.setmap(self.nowLngLat)
              }else{
                self.setmap(self.orderLngLat)
              }
            })
          }
        },
        menuclick(a,force) {
            let self = this
            if (a === 'menu1' && (self.showMyLocation === false||force)) {
                self.showMyLocation = true
                self.loading.show = true
                self.loading.text = '正在获取地址..'
                getNowLngLat()
                    .then(r => {
                        self.loading.show = false
                        self.loading.text = ''
                        self.nowLngLat = r.point
                        self.nowaddress = r.address.city+r.address.district+r.address.street+r.address.street_number
                        let newstorecondition = r.address.province.replace('市', '') + ',' + r.address.city
                        self.checkStoreconditionAndSetrange(newstorecondition, self.nowLngLat)
                    })
            } else if (a === 'menu2' && self.showMyLocation === true) {
                self.showMyLocation = false
                let newstorecondition = self.orderInfo.logisticInfo.province + ',' + self.orderInfo.logisticInfo.city
                self.checkStoreconditionAndSetrange(newstorecondition, self.orderLngLat)
            }
        },
        checkStoreconditionAndSetrange(newstorecondition, startPoint) {
          let self = this
          //加.split(',')[1] 是为了直接对比市 订单中直辖市是 上海   百度地图是 上海市  不一样  会导致接口重复调用
          if(self.storecondition.split(',')[1] !== newstorecondition.split(',')[1]){
          // if(self.storecondition !== newstorecondition){
            self.storecondition = newstorecondition
            //当前位置与订单位置非同一城市  要重新获取门店数据  再计算距离
            self.getmaininfo()
            .then(()=>{
              // console.log('@@@',self.storecondition,newstorecondition);
              // 取订单地址经纬度
              // getAddressLngLat(self.orderaddress)
              // .then(orderLL=>{
                // 存订单地址经纬度
                // self.orderLngLat=orderLL
                // 计算订单地址与门店距离
                self.setRange(startPoint)
              // })
            },msg=>{
              console.error('###',msg);
            })

          }else{
            self.setRange(startPoint)
          }
        },
        setRange(start) {
            let self = this
            //取出所有门店的经纬度
            let storeLLs = self.stores.map(store => store.point)
            //计算start与每个门店的距离
            let rangePs = storeLLs.map(storeLL => getDrivingRoute(start, storeLL))
            //更新stores
            Promise.all(rangePs)
            .then(ranges => {
                ranges.map((range,i)=>{
                  setTimeout(()=>{
                    // console.log(i,self.stores[i].storeName,range);
                    if (!range||!range.tr) {
                      console.log(self.stores[i].storeName+"没有获取到距离")
                      return;
                    }
                    self.$set('stores[' + i + '].range', range.tr[0].cg)
                  },200*i)
                })
                self.setmap(start)
            })
        },
        setmap(centerpoint){
            // console.log(centerpoint.lng, centerpoint.lat);
            // var point = new BMap.Point(116.404, 39.915);
            // var point = new BMap.Point(31.170, 121.411);
            let pointnmae = "订单收货地址"
            let deletename = '当前位置'

            if(this.showMyLocation){
              pointnmae = "当前位置"
              deletename = '订单收货地址'
            }
            //移动地图到相应位置  显示相应尺寸
            let point = new BMap.Point(centerpoint.lng, centerpoint.lat)
            this.baidumap.centerAndZoom(point, 11)
            //获取地图上的点  没点则设置点  有点说明已经设置过门店就不用设置了 并 清理之前设置的centerpoint点
            var allOverlay = this.baidumap.getOverlays()
            console.log(allOverlay.length)
            // debugger;
            if(allOverlay.length > 0){
              //清理之前的centerpoint点
              // console.log('##')
              allOverlay.forEach((overlay,i)=>{
                if(overlay.getLabel && overlay.getLabel().content === deletename){
                  // console.log('$$')
                  this.baidumap.removeOverlay(overlay);
                  // console.log(overlay.getLabel().content,centerpoint,deletename,pointnmae)
                }
              })
              // console.log('@@')
            }else{
              //设置point点
              this.stores.forEach(store=>{
                if(store.point){
                  this.markpoint(this.baidumap,store.point,store.storeName)
                }
              })
            }
            // console.log('&&')
            // console.log(centerpoint,pointnmae);
            //加上centerpoin点
            this.markpoint(this.baidumap,centerpoint,pointnmae)
          	// marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
        },
        markpoint(map,mappoint,text){
          let point = new BMap.Point(mappoint.lng, mappoint.lat);
          let marker = new BMap.Marker(point);  // 创建标注
          let label = new BMap.Label(text,{offset:new BMap.Size(-10,-20)});
          marker.setLabel(label)
          map.addOverlay(marker);
        },
        json2string(obj){
          let datastring = JSON.stringify({
              "orderNumber": obj.orderNumber,
              "type": obj.type,
              "code": obj.code,
          });
          console.log(datastring);
          return datastring;
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



// import returnPdView from './returnPdView'
// export default returnPdView

</script>
