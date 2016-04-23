<template>
  <div class="mui-slider-item mui-control-content">
    <img :src="qrcode2img(qrcode)" alt="" />
  </div>
</template>

<script>
import QRcode from 'qrcode-js';

export default {
  name: 'qrcodeImg',
  props:['qrcode'],
  methods:{
    qrcode2img:qrcode=>{
      console.log(qrcode)
      return QRcode.toDataURL(qrcode,4)
    }
  }
}
</script>

<style lang="stylus">

</style>
