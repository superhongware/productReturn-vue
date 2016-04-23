<template>
  <div class="mui-content" id='storeandqrcode'>
    <div id="slider" class="mui-slider mui-fullscreen">
      <div id="sliderSegmentedControl" class="mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
        <a class="mui-control-item mui-active" href="#item1mobile">
          附近门店
        </a>
        <a class="mui-control-item" href="#item2mobile">
          我的订单
        </a>
      </div>

      <div id="sliderProgressBar" class="mui-slider-progress-bar mui-col-xs-6"></div>

      <div class="mui-slider-group top47">

        <stores-box v-if='showstore' :stores='stores' keep-alive></stores-box>

        <qrcode-box v-if='!showstore' keep-alive></qrcode-box>
      </div>
    </div>
  </div>

</template>

<script>
import store from '../store'
import storesBox from '../components/storesBox.vue'
import qrcodeBox from '../components/qrcodeBox.vue'


// import Comment from './Comment.vue'
//
export default {

  name: 'returnPdView',

  components: {
    storesBox,
    qrcodeBox
  },

  data () {
    console.log(this.$log())
    return {
      stores: [],
      showstore:false,
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
.mui-scroll-wrapper{
  height:600px;
  .mui-scroll{
    height:600px;
  }
}
</style>
