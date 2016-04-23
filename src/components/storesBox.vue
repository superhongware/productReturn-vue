<template>
  <div id="item1mobile" class="mui-slider-item mui-control-content mui-active">
    <div id="scroll1" class="mui-scroll-wrapper">
      <div class="mui-scroll">
        <div class="detail-name">我的位置</div>
        <div class="flexCon backFFF padding10">
          <a href="#bottomPop">
            <p class="nowlocationbar">
              <span class="mui-icon iconfont icon-ditu1 fontOrange"></span>当前位置
              <span class="mui-navigate-right downIcon"></span>
            </p>
            <p class="orderlocationbar">
              <span class="mui-icon iconfont icon-xiangzi1"></span> 订单收货地址
            </p>
            <span class="mui-navigate-right downIcon"></span>
          </a>
          <div class="flexOne fontEll orderlocationbar" id="orderAddress">
          </div>
          <!-- <span class="mui-icon mui-icon-reload loc-load amt"></span> -->
        </div>
        <div class="detail-name">附近门店</div>
        <ul class="mui-table-view" id="storelist">
          <store-item :store='store' v-for="store of stores"></store-item>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// import store from '../store'
import storeItem from './storeItem.vue'

export default {
  name: 'storesBox',
  props:['stores'],

  components: {
    storeItem
  },
}
</script>

<style lang="stylus">

</style>
