<template>
  <div class="qrcodeimg">
    <img :src="qrcode2img(qrcode)" alt="" />
  </div>
</template>

<script>
import QRcode from 'qrcode-js';

export default {
  props:['qrcode'],
  methods:{
    qrcode2img:qrcode=>{
    	console.log(qrcode)
      return QRcode.toDataURL(qrcode,4)
    }
  }
}
</script>

<style lang="sass" scoped>
.qrcodeimg{
  width:100%;
  img{
    width:100%;
  }
}
</style>
