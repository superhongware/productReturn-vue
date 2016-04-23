<template>
<div class="mui-content" id='storeandqrcode'>
  <tab active-color='#007aff'>
  <tab-item :selected="showstore" @click="showstore=showstore?showstore:!showstore">附近门店</tab-item>
  <tab-item :selected="!showstore" @click="showstore=showstore?!showstore:showstore">我的订单</tab-item>
  </tab>

  <div class="mui-slider-group top47" height>
    <!-- <Scroller lock-x scrollbar-y :height='scrollerHeight'> -->
      <stores-box v-if='showstore' :stores='stores' keep-alive></stores-box>
      <qrcode-box v-if='!showstore' keep-alive></qrcode-box>
    <!-- </Scroller> -->
  </div>
</div>
</template>

<script>
import store from '../store'
import storesBox from '../components/storesBox.vue'
import qrcodeBox from '../components/qrcodeBox.vue'
import Scroller from 'vux/components/scroller'
import Tab from 'vux/components/tab'
import TabItem from 'vux/components/tab-item'

// import Comment from './Comment.vue'
//
export default {
  components: {
    TabItem,
    Tab,
    Scroller,
    storesBox,
    qrcodeBox
  },

  data () {
    console.log(this.$log())
    return {
      stores: [],
      showstore:true,
      scrollerHeight:window.innerHeight-44+'px'
    }
  },

  route: {
    data ({ to }) {
      return store.fetchStors().then(data => {
        document.title = '退换货'
        return {
          stores:data.stores
        }
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
@import '~vux/vux.css';
.mui-scroll-wrapper{
  height:600px;
  .mui-scroll{
    height:600px;
  }
}
</style>
