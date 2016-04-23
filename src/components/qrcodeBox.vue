<template>
  <div class="mui-slider-item mui-control-content">
    <div class="mui-scroll-wrapper">
      <div class="mui-scroll">
        <p class="listNo">订单编号：<span></span></p>
        <div class="qrCon">
          <div class="qrcode">
            <qrcode-img :qrcode="qrcodestring"></qrcode-img>
          </div>
        </div>
        <p class="listNo">此二维码用于门店快速找到您的订单</p>
      </div>
    </div>

  </div>
</template>

<script>
import store from '../store'
import qrcodeImg from './qrcodeImg.vue'
import {UrlParam} from '../tools/GetUrlParam'

var urlParam=UrlParam()
// console.log(urlParam)
export default {

  //
  // props:['qrcode'],
  //
  data () {
    return {
      action: urlParam.action,
      qrcodestring:urlParam.action.orderNumber+(urlParam.action.code?','+urlParam.action.code:'')
    }
  },

  components: {
    qrcodeImg
  },
}
</script>

<style lang="stylus">

</style>
