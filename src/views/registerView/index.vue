<style lang="sass">

@import './registerView.scss'

</style>

<template>

<div>

    <!-- <actionsheet :show.sync="showAction" :menus="menus2" @menu-click="menuclick" cancel-text="取消" show-cancel></actionsheet> -->
    <loading :show="loading.show" :text="loading.text"></loading>
</div>

</template>

<script>
import { Promise } from 'es6-promise'
import store from 'src/store'
import Scroller from 'vux/components/scroller'
import Loading from 'vux/components/loading'
import {Base64} from 'js-base64'
console.log(Base64.encode(JSON.stringify({orgCode: "work", callbackUrl: "http://baidu.com"})));


export default {
    components: {
        Loading,
        Scroller,
    },

    data() {
        return {
          phone: '',
          code: '',
          loading:{
            show:false,
            text:'加载中...'
          },
        }
    },

    route: {
        data({to:{query}}) {
            console.log(query)
            let self = this;
            // return Promise.all([
            //     // store.fetchStors2(),
            //     // store.fetchOrder(),
            //     // store.fetchUrlParma(),
            // ]).then((data) => {
            //     // let [ orderdata, urlParam] = data
            //     // document.title = getTitleName(urlParam)
            //     // console.log('returndata',orderdata.order.logisticInfo.address);
            //     // self.getmaininfo();
            //     return {
            //         // stores: stores,
            //         orderaddress: orderdata.order.logisticInfo.address,
            //     }
            // })
        }
    },
    ready: function() {
      console.log('ready');
    },
    methods: {
        changeMapList(){
          // let self = this
          // this.showmap=!this.showmap
          // if(!this.baidumap){
          //   setTimeout(()=>{
          //     this.baidumap= new BMap.Map("baidumap")
          //     this.setmap(this.orderLngLat)
          //   })
          // }
        },
        markpoint(map,mappoint,text){
          // let point = new BMap.Point(mappoint.lng, mappoint.lat);
          // let marker = new BMap.Marker(point);  // 创建标注
          // let label = new BMap.Label(text,{offset:new BMap.Size(-10,-20)});
          // marker.setLabel(label)
          // map.addOverlay(marker);
        }
    },
}

// import returnPdView from './returnPdView'
// export default returnPdView

</script>
