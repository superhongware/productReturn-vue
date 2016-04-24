<template>
  <div class="mui-slider-item mui-control-content">
    <div class="mui-scroll-wrapper">
      <div class="mui-scroll">
        <p class="listNo">优惠券编号：{{action.code}}</p>
        <div class="qrCon">
          <div class="qrcode">
            <qrcode-img :qrcode="action.code"></qrcode-img>
          </div>
        </div>
        <p class="listNo">此二维码用于门店快速验证您的优惠券</p>
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
    }
  },

  components: {
    qrcodeImg
  },
}
</script>

<style lang="stylus">

</style>
